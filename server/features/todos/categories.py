from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.todos.model import Category
from server.features.todos.schemas import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(
    prefix="/todos/categories",
    tags=["todos"],
    dependencies=[Depends(require_login)],
)


def _to_dict(c: Category) -> dict:
    return {
        "id": c.id,
        "name": c.name,
        "color": c.color,
        "created_at": c.created_at,
        "updated_at": c.updated_at,
    }


def _get_or_404(db: Session, category_id: int) -> Category:
    cat = db.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@router.get("", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)) -> list[dict]:
    rows = db.scalars(select(Category).order_by(Category.name)).all()
    return [_to_dict(c) for c in rows]


@router.post("", response_model=CategoryRead, status_code=201)
def create_category(body: CategoryCreate, db: Session = Depends(get_db)) -> dict:
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Category name cannot be empty")
    existing = db.scalars(select(Category).where(Category.name == name)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Category name already exists")
    cat = Category(name=name, color=body.color)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return _to_dict(cat)


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)) -> dict:
    return _to_dict(_get_or_404(db, category_id))


@router.patch("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int, body: CategoryUpdate, db: Session = Depends(get_db)
) -> dict:
    cat = _get_or_404(db, category_id)
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return _to_dict(cat)


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)) -> None:
    cat = _get_or_404(db, category_id)
    db.delete(cat)
    db.commit()
