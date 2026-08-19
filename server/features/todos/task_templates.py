from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select, update
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.todos.model import Category, Task, TaskTemplate, utcnow
from server.features.todos.schemas import (
    TaskCreate,
    TaskRead,
    TaskTemplateCreate,
    TaskTemplatePage,
    TaskTemplateRead,
    TaskTemplateUpdate,
)

router = APIRouter(
    prefix="/todos/templates",
    tags=["todos"],
    dependencies=[Depends(require_login)],
)


def _category_dicts(cats: list[Category]) -> list[dict]:
    return [
        {"id": c.id, "name": c.name, "color": c.color, "created_at": c.created_at, "updated_at": c.updated_at}
        for c in cats
    ]


def _template_to_dict(t: TaskTemplate) -> dict:
    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "priority": t.priority,
        "period_type_id": t.period_type_id,
        "next_due_at": t.next_due_at,
        "is_active": t.is_active,
        "categories": _category_dicts(t.categories),
        "created_at": t.created_at,
        "updated_at": t.updated_at,
    }


def _task_to_dict(t: Task) -> dict:
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


def _get_or_404(db: Session, template_id: int) -> TaskTemplate:
    tmpl = db.get(TaskTemplate, template_id)
    if not tmpl:
        raise HTTPException(status_code=404, detail="Task template not found")
    return tmpl


def _resolve_categories(db: Session, ids: list[int]) -> list[Category]:
    if not ids:
        return []
    cats = db.scalars(select(Category).where(Category.id.in_(ids))).all()
    missing = set(ids) - {c.id for c in cats}
    if missing:
        raise HTTPException(status_code=422, detail=f"Category ids not found: {sorted(missing)}")
    return list(cats)


@router.get("", response_model=TaskTemplatePage)
def list_templates(
    q: str | None = Query(None),
    active_only: bool = Query(False),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> dict:
    base = select(TaskTemplate)
    if q:
        base = base.where(TaskTemplate.title.ilike(f"%{q}%"))
    if active_only:
        base = base.where(TaskTemplate.is_active.is_(True))
    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0
    items = db.scalars(base.order_by(TaskTemplate.created_at.desc()).offset(offset).limit(limit)).all()
    return {"items": [_template_to_dict(t) for t in items], "total": total, "limit": limit, "offset": offset}


@router.post("", response_model=TaskTemplateRead, status_code=201)
def create_template(body: TaskTemplateCreate, db: Session = Depends(get_db)) -> dict:
    if not body.title.strip():
        raise HTTPException(status_code=422, detail="Title cannot be empty")
    cats = _resolve_categories(db, body.category_ids)
    tmpl = TaskTemplate(
        title=body.title.strip(),
        description=body.description,
        priority=body.priority,
        period_type_id=body.period_type_id,
        next_due_at=body.next_due_at,
    )
    tmpl.categories = cats
    db.add(tmpl)
    db.commit()
    db.refresh(tmpl)
    return _template_to_dict(tmpl)


@router.get("/{template_id}", response_model=TaskTemplateRead)
def get_template(template_id: int, db: Session = Depends(get_db)) -> dict:
    return _template_to_dict(_get_or_404(db, template_id))


@router.patch("/{template_id}", response_model=TaskTemplateRead)
def update_template(
    template_id: int, body: TaskTemplateUpdate, db: Session = Depends(get_db)
) -> dict:
    tmpl = _get_or_404(db, template_id)
    data = body.model_dump(exclude_unset=True)
    category_ids = data.pop("category_ids", None)
    for field, value in data.items():
        setattr(tmpl, field, value)
    if category_ids is not None:
        tmpl.categories = _resolve_categories(db, category_ids)
    db.commit()
    db.refresh(tmpl)
    return _template_to_dict(tmpl)


@router.delete("/{template_id}", status_code=204)
def delete_template(template_id: int, db: Session = Depends(get_db)) -> None:
    tmpl = _get_or_404(db, template_id)
    # Explicitly nullify to satisfy SQLite which ignores FK ON DELETE SET NULL by default
    db.execute(update(Task).where(Task.template_id == tmpl.id).values(template_id=None))
    db.delete(tmpl)
    db.commit()


@router.post("/{template_id}/spawn", response_model=TaskRead, status_code=201)
def spawn_task_from_template(template_id: int, db: Session = Depends(get_db)) -> dict:
    """Create a task from the template, copying its title, description, priority, and categories."""
    tmpl = _get_or_404(db, template_id)
    task = Task(
        title=tmpl.title,
        description=tmpl.description,
        priority=tmpl.priority,
        template_id=tmpl.id,
    )
    task.categories = list(tmpl.categories)
    db.add(task)
    db.commit()
    db.refresh(task)
    return _task_to_dict(task)
