from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.todos.model import Category, Task, utcnow
from server.features.todos.schemas import TaskCreate, TaskPage, TaskRead, TaskUpdate

router = APIRouter(
    prefix="/todos/tasks",
    tags=["todos"],
    dependencies=[Depends(require_login)],
)

VALID_STATUSES = {"todo", "in_progress", "done"}
VALID_PRIORITIES = {"low", "medium", "high"}


def _category_dicts(cats: list[Category]) -> list[dict]:
    return [
        {"id": c.id, "name": c.name, "color": c.color, "created_at": c.created_at, "updated_at": c.updated_at}
        for c in cats
    ]


def _to_dict(t: Task) -> dict:
    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "status": t.status,
        "priority": t.priority,
        "due_date": t.due_date,
        "completed_at": t.completed_at,
        "template_id": t.template_id,
        "categories": _category_dicts(t.categories),
        "created_at": t.created_at,
        "updated_at": t.updated_at,
    }


def _get_or_404(db: Session, task_id: int) -> Task:
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


def _resolve_categories(db: Session, ids: list[int]) -> list[Category]:
    if not ids:
        return []
    cats = db.scalars(select(Category).where(Category.id.in_(ids))).all()
    missing = set(ids) - {c.id for c in cats}
    if missing:
        raise HTTPException(status_code=422, detail=f"Category ids not found: {sorted(missing)}")
    return list(cats)


@router.get("", response_model=TaskPage)
def list_tasks(
    q: str | None = Query(None, description="Search title"),
    status: str | None = Query(None, description="Filter by status"),
    priority: str | None = Query(None, description="Filter by priority"),
    category_id: int | None = Query(None, description="Filter by category"),
    sort: str = Query("recent", description="recent | due | priority"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> dict:
    base = select(Task)
    if q:
        base = base.where(Task.title.ilike(f"%{q}%"))
    if status:
        base = base.where(Task.status == status)
    if priority:
        base = base.where(Task.priority == priority)
    if category_id is not None:
        base = base.where(Task.categories.any(Category.id == category_id))

    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0

    if sort == "due":
        base = base.order_by(Task.due_date.asc().nulls_last())
    elif sort == "priority":
        from sqlalchemy import case
        priority_order = case({"high": 0, "medium": 1, "low": 2}, value=Task.priority)
        base = base.order_by(priority_order)
    else:
        base = base.order_by(Task.created_at.desc())

    items = db.scalars(base.offset(offset).limit(limit)).all()
    return {"items": [_to_dict(t) for t in items], "total": total, "limit": limit, "offset": offset}


@router.post("", response_model=TaskRead, status_code=201)
def create_task(body: TaskCreate, db: Session = Depends(get_db)) -> dict:
    if not body.title.strip():
        raise HTTPException(status_code=422, detail="Title cannot be empty")
    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=422, detail=f"status must be one of {VALID_STATUSES}")
    if body.priority not in VALID_PRIORITIES:
        raise HTTPException(status_code=422, detail=f"priority must be one of {VALID_PRIORITIES}")
    cats = _resolve_categories(db, body.category_ids)
    task = Task(
        title=body.title.strip(),
        description=body.description,
        status=body.status,
        priority=body.priority,
        due_date=body.due_date,
        template_id=body.template_id,
        completed_at=utcnow() if body.status == "done" else None,
    )
    task.categories = cats
    db.add(task)
    db.commit()
    db.refresh(task)
    return _to_dict(task)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db)) -> dict:
    return _to_dict(_get_or_404(db, task_id))


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, body: TaskUpdate, db: Session = Depends(get_db)) -> dict:
    task = _get_or_404(db, task_id)
    data = body.model_dump(exclude_unset=True)
    category_ids = data.pop("category_ids", None)

    prev_status = task.status
    for field, value in data.items():
        setattr(task, field, value)

    # auto-stamp completed_at when transitioning to/from done
    if "status" in data:
        if task.status == "done" and prev_status != "done":
            task.completed_at = utcnow()
        elif task.status != "done" and prev_status == "done":
            task.completed_at = None

    if category_ids is not None:
        task.categories = _resolve_categories(db, category_ids)

    db.commit()
    db.refresh(task)
    return _to_dict(task)


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)) -> None:
    task = _get_or_404(db, task_id)
    db.delete(task)
    db.commit()
