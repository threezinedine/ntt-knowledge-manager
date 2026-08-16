from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.vocabulary.model import Vocabulary
from server.features.vocabulary.schemas import (
    VocabularyCreate,
    VocabularyPage,
    VocabularyRead,
    VocabularyUpdate,
)

router = APIRouter(
    prefix="/vocabulary",
    tags=["vocabulary"],
    dependencies=[Depends(require_login)],
)


def vocab_to_dict(v: Vocabulary) -> dict[str, object]:
    return {
        "id": v.id,
        "word": v.word,
        "word_type": v.word_type,
        "english_meaning": v.english_meaning,
        "vietnamese_meaning": v.vietnamese_meaning,
        "examples": v.examples,
        "oald_link": v.oald_link,
        "search_times": v.search_times,
        "created_at": v.created_at,
        "updated_at": v.updated_at,
    }


def get_vocab_or_404(db: Session, vocab_id: int) -> Vocabulary:
    vocab = db.get(Vocabulary, vocab_id)
    if not vocab:
        raise HTTPException(status_code=404, detail="Vocabulary not found")
    return vocab


@router.get("", response_model=VocabularyPage)
def list_vocabulary(
    q: str | None = Query(None, description="Search by word"),
    word_type: str | None = Query(None, description="Filter by type"),
    sort: str = Query("recent", description="Sort: recent, alpha, most_searched"),
    limit: int = Query(20, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset"),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    base = select(Vocabulary)

    if q:
        base = base.where(Vocabulary.word.ilike(f"%{q}%"))
    if word_type:
        base = base.where(Vocabulary.word_type == word_type)

    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0

    if sort == "alpha":
        base = base.order_by(Vocabulary.word.asc())
    elif sort == "most_searched":
        base = base.order_by(Vocabulary.search_times.desc())
    else:
        base = base.order_by(Vocabulary.created_at.desc())

    items = db.scalars(base.offset(offset).limit(limit)).all()

    return {
        "items": [vocab_to_dict(v) for v in items],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.post("", response_model=VocabularyRead, status_code=201)
def create_vocabulary(body: VocabularyCreate, db: Session = Depends(get_db)) -> dict[str, object]:
    existing = db.scalars(
        select(Vocabulary).where(Vocabulary.word == body.word)
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Word already exists")

    vocab = Vocabulary(**body.model_dump())
    db.add(vocab)
    db.commit()
    db.refresh(vocab)
    return vocab_to_dict(vocab)


@router.get("/{vocab_id}", response_model=VocabularyRead)
def get_vocabulary(vocab_id: int, db: Session = Depends(get_db)) -> dict[str, object]:
    vocab = get_vocab_or_404(db, vocab_id)
    vocab.search_times += 1
    db.commit()
    db.refresh(vocab)
    return vocab_to_dict(vocab)


@router.patch("/{vocab_id}", response_model=VocabularyRead)
def update_vocabulary(
    vocab_id: int, body: VocabularyUpdate, db: Session = Depends(get_db)
) -> dict[str, object]:
    vocab = get_vocab_or_404(db, vocab_id)

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(vocab, field, value)

    db.commit()
    db.refresh(vocab)
    return vocab_to_dict(vocab)


@router.delete("/{vocab_id}", status_code=204)
def delete_vocabulary(vocab_id: int, db: Session = Depends(get_db)) -> None:
    vocab = get_vocab_or_404(db, vocab_id)
    db.delete(vocab)
    db.commit()
