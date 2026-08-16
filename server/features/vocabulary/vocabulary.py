from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.vocabulary.dictionary import fetch_word
from server.features.vocabulary.model import SearchLog, Vocabulary
from server.features.vocabulary.schemas import (
    VocabularyAdd,
    VocabularyPage,
    VocabularyRead,
    VocabularyUpdate,
)

router = APIRouter(
    prefix="/vocabulary",
    tags=["vocabulary"],
    dependencies=[Depends(require_login)],
)


def _get_search_history(db: Session, vocab_id: int) -> list[dict[str, object]]:
    logs = db.scalars(
        select(SearchLog)
        .where(SearchLog.vocabulary_id == vocab_id)
        .order_by(SearchLog.searched_at.desc())
    ).all()
    return [{"id": log.id, "searched_at": log.searched_at} for log in logs]


def _log_search(db: Session, vocab_id: int) -> None:
    db.add(SearchLog(vocabulary_id=vocab_id))


def vocab_to_dict(v: Vocabulary, db: Session) -> dict[str, object]:
    return {
        "id": v.id,
        "word": v.word,
        "phonetic": v.phonetic,
        "audio_url": v.audio_url,
        "meanings": v.meanings,
        "oald_link": v.oald_link,
        "vietnamese_meaning": v.vietnamese_meaning,
        "search_times": v.search_times,
        "search_history": _get_search_history(db, v.id),
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
    sort: str = Query("recent", description="Sort: recent, alpha, most_searched"),
    limit: int = Query(20, ge=1, le=100, description="Page size"),
    offset: int = Query(0, ge=0, description="Offset"),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    base = select(Vocabulary)

    if q:
        base = base.where(Vocabulary.word.ilike(f"%{q}%"))

    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0

    if sort == "alpha":
        base = base.order_by(Vocabulary.word.asc())
    elif sort == "most_searched":
        base = base.order_by(Vocabulary.search_times.desc())
    else:
        base = base.order_by(Vocabulary.created_at.desc())

    items = db.scalars(base.offset(offset).limit(limit)).all()

    return {
        "items": [vocab_to_dict(v, db) for v in items],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.post("", response_model=VocabularyRead, status_code=201)
def add_vocabulary(
    body: VocabularyAdd, db: Session = Depends(get_db)
) -> dict[str, object]:
    word = body.word.strip().lower()
    if not word:
        raise HTTPException(status_code=422, detail="Word cannot be empty")

    existing = db.scalars(select(Vocabulary).where(Vocabulary.word == word)).first()

    if existing:
        existing.search_times += 1
        _log_search(db, existing.id)
        db.commit()
        db.refresh(existing)
        return vocab_to_dict(existing, db)

    data: dict[str, Any] | None = fetch_word(word)
    if data is None:
        raise HTTPException(
            status_code=502,
            detail=f"Could not fetch dictionary data for '{word}'",
        )

    vocab = Vocabulary(
        word=word,
        phonetic=str(data.get("phonetic", "")),
        audio_url=str(data.get("audio_url", "")),
        meanings=data.get("meanings", []),
        oald_link=str(data.get("oald_link", "")),
    )
    db.add(vocab)
    db.commit()
    db.refresh(vocab)
    return vocab_to_dict(vocab, db)


@router.get("/{vocab_id}", response_model=VocabularyRead)
def get_vocabulary(vocab_id: int, db: Session = Depends(get_db)) -> dict[str, object]:
    vocab = get_vocab_or_404(db, vocab_id)
    vocab.search_times += 1
    _log_search(db, vocab.id)
    db.commit()
    db.refresh(vocab)
    return vocab_to_dict(vocab, db)


@router.patch("/{vocab_id}", response_model=VocabularyRead)
def update_vocabulary(
    vocab_id: int, body: VocabularyUpdate, db: Session = Depends(get_db)
) -> dict[str, object]:
    vocab = get_vocab_or_404(db, vocab_id)

    for field, value in body.model_dump(exclude_unset=True).items():
        if field == "meanings" and value is not None:
            value = [m if isinstance(m, dict) else m.model_dump() for m in value]  # type: ignore
        setattr(vocab, field, value)

    db.commit()
    db.refresh(vocab)
    return vocab_to_dict(vocab, db)


@router.delete("/{vocab_id}", status_code=204)
def delete_vocabulary(vocab_id: int, db: Session = Depends(get_db)) -> None:
    vocab = get_vocab_or_404(db, vocab_id)
    db.delete(vocab)
    db.commit()
