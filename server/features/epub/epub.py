import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.epub.model import Epub
from server.features.epub.schemas import EpubPage, EpubRead, EpubUpdate

UPLOAD_DIR = Path(os.getenv("EPUB_UPLOAD_DIR", "./uploads/epubs"))

router = APIRouter(
    prefix="/epubs",
    tags=["epubs"],
    dependencies=[Depends(require_login)],
)


def _ensure_upload_dir() -> Path:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    return UPLOAD_DIR


def _epub_to_dict(epub: Epub) -> dict[str, object]:
    return {
        "id": epub.id,
        "name": epub.name,
        "original_filename": epub.original_filename,
        "url": epub.url,
        "file_size": epub.file_size,
        "upload_count": epub.upload_count,
        "created_at": epub.created_at,
        "updated_at": epub.updated_at,
    }


def _get_or_404(db: Session, epub_id: int) -> Epub:
    epub = db.get(Epub, epub_id)
    if not epub:
        raise HTTPException(status_code=404, detail="Epub not found")
    return epub


@router.get("", response_model=EpubPage)
def list_epubs(
    q: str | None = Query(None, description="Search by name"),
    sort: str = Query("recent", description="Sort: recent, alpha, most_uploaded"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    base = select(Epub)

    if q:
        base = base.where(Epub.name.ilike(f"%{q}%"))

    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0

    if sort == "alpha":
        base = base.order_by(Epub.name.asc())
    elif sort == "most_uploaded":
        base = base.order_by(Epub.upload_count.desc())
    else:
        base = base.order_by(Epub.created_at.desc())

    items = db.scalars(base.offset(offset).limit(limit)).all()

    return {
        "items": [_epub_to_dict(e) for e in items],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.post("", response_model=EpubRead, status_code=201)
async def upload_epub(
    file: UploadFile,
    db: Session = Depends(get_db),
) -> dict[str, object]:
    if not file.filename:
        raise HTTPException(status_code=422, detail="No filename provided")

    if not file.filename.lower().endswith(".epub"):
        raise HTTPException(status_code=422, detail="Only .epub files are accepted")

    upload_dir = _ensure_upload_dir()

    content = await file.read()
    file_size = len(content)

    ext = Path(file.filename).suffix
    stored_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = upload_dir / stored_filename

    file_path.write_bytes(content)

    name = Path(file.filename).stem
    url = f"/api/epubs/file/{stored_filename}"

    epub = Epub(
        name=name,
        original_filename=file.filename,
        stored_filename=stored_filename,
        url=url,
        file_size=file_size,
    )
    db.add(epub)
    db.commit()
    db.refresh(epub)

    return _epub_to_dict(epub)


@router.get("/{epub_id}", response_model=EpubRead)
def get_epub(epub_id: int, db: Session = Depends(get_db)) -> dict[str, object]:
    epub = _get_or_404(db, epub_id)
    return _epub_to_dict(epub)


@router.patch("/{epub_id}", response_model=EpubRead)
def update_epub(
    epub_id: int, body: EpubUpdate, db: Session = Depends(get_db)
) -> dict[str, object]:
    epub = _get_or_404(db, epub_id)

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(epub, field, value)

    db.commit()
    db.refresh(epub)
    return _epub_to_dict(epub)


@router.delete("/{epub_id}", status_code=204)
def delete_epub(epub_id: int, db: Session = Depends(get_db)) -> None:
    epub = _get_or_404(db, epub_id)

    file_path = UPLOAD_DIR / epub.stored_filename
    if file_path.exists():
        file_path.unlink()

    db.delete(epub)
    db.commit()


@router.get("/file/{filename}")
def download_epub(filename: str) -> FileResponse:
    file_path = UPLOAD_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        media_type="application/epub+zip",
        filename=filename,
    )
