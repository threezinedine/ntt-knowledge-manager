from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.chunks.model import Chunk
from server.features.chunks.schemas import (
    ChunkAdd,
    ChunkPage,
    ChunkRead,
    ChunkUpdate,
)

router = APIRouter(
    prefix="/chunks",
    tags=["chunks"],
    dependencies=[Depends(require_login)],
)


def chunk_to_dict(c: Chunk) -> dict[str, object]:
    return {
        "id": c.id,
        "content": c.content,
        "vietnamese": c.vietnamese,
        "visit_times": c.visit_times,
        "created_at": c.created_at,
        "updated_at": c.updated_at,
    }


def get_chunk_or_404(db: Session, chunk_id: int) -> Chunk:
    chunk = db.get(Chunk, chunk_id)
    if not chunk:
        raise HTTPException(status_code=404, detail="Chunk not found")
    return chunk


@router.get("", response_model=ChunkPage)
def list_chunks(
    q: str | None = Query(None, description="Search by content"),
    sort: str = Query("recent", description="Sort: recent, most_visited"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    base = select(Chunk)

    if q:
        base = base.where(Chunk.content.ilike(f"%{q}%"))

    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0

    if sort == "most_visited":
        base = base.order_by(Chunk.visit_times.desc())
    else:
        base = base.order_by(Chunk.created_at.desc())

    items = db.scalars(base.offset(offset).limit(limit)).all()

    return {
        "items": [chunk_to_dict(c) for c in items],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.post("", response_model=ChunkRead, status_code=201)
def add_chunk(body: ChunkAdd, db: Session = Depends(get_db)) -> dict[str, object]:
    content = body.content.strip()
    if not content:
        raise HTTPException(status_code=422, detail="Content cannot be empty")

    existing = db.scalars(select(Chunk).where(Chunk.content == content)).first()
    if existing:
        existing.visit_times += 1
        db.commit()
        db.refresh(existing)
        return chunk_to_dict(existing)

    chunk = Chunk(content=content)
    db.add(chunk)
    db.commit()
    db.refresh(chunk)
    return chunk_to_dict(chunk)


@router.get("/{chunk_id}", response_model=ChunkRead)
def get_chunk(chunk_id: int, db: Session = Depends(get_db)) -> dict[str, object]:
    chunk = get_chunk_or_404(db, chunk_id)
    chunk.visit_times += 1
    db.commit()
    db.refresh(chunk)
    return chunk_to_dict(chunk)


@router.patch("/{chunk_id}", response_model=ChunkRead)
def update_chunk(
    chunk_id: int, body: ChunkUpdate, db: Session = Depends(get_db)
) -> dict[str, object]:
    chunk = get_chunk_or_404(db, chunk_id)

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(chunk, field, value)

    db.commit()
    db.refresh(chunk)
    return chunk_to_dict(chunk)


@router.delete("/{chunk_id}", status_code=204)
def delete_chunk(chunk_id: int, db: Session = Depends(get_db)) -> None:
    chunk = get_chunk_or_404(db, chunk_id)
    db.delete(chunk)
    db.commit()
