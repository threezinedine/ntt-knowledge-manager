import base64

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.settings.model import Settings
from server.features.settings.schemas import SettingsRead, SettingsUpdate, ThemeValue

DEFAULTS: dict[str, str] = {
    "theme": ThemeValue.light.value,
    "nickname": "",
    "avatar": "",
}

ALLOWED_MIME_TYPES = {"image/png", "image/jpeg", "image/gif", "image/webp"}
MAX_AVATAR_SIZE = 2 * 1024 * 1024  # 2 MB

router = APIRouter(
    prefix="/settings",
    tags=["settings"],
    dependencies=[Depends(require_login)],
)


def _get_or_create(db: Session, key: str) -> Settings:
    row = db.scalar(select(Settings).where(Settings.key == key))
    if row is None:
        row = Settings(key=key, value=DEFAULTS.get(key, ""))
        db.add(row)
        db.flush()
    return row


def _read_all(db: Session) -> dict[str, str]:
    rows = db.scalars(select(Settings)).all()
    result = dict(DEFAULTS)
    for row in rows:
        result[row.key] = row.value
    return result


@router.get("", response_model=SettingsRead)
def get_settings(db: Session = Depends(get_db)) -> dict[str, str]:
    return _read_all(db)


@router.patch("", response_model=SettingsRead)
def update_settings(
    payload: SettingsUpdate, db: Session = Depends(get_db)
) -> dict[str, str]:
    if payload.theme is not None:
        row = _get_or_create(db, "theme")
        row.value = payload.theme.value

    if payload.nickname is not None:
        row = _get_or_create(db, "nickname")
        row.value = payload.nickname

    db.commit()
    return _read_all(db)


@router.post("/avatar", response_model=SettingsRead)
async def upload_avatar(
    file: UploadFile, db: Session = Depends(get_db)
) -> dict[str, str]:
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported image type. Allowed: {', '.join(sorted(ALLOWED_MIME_TYPES))}",
        )

    data = await file.read()
    if len(data) > MAX_AVATAR_SIZE:
        raise HTTPException(status_code=400, detail="Avatar must be under 2 MB")

    encoded = base64.b64encode(data).decode("ascii")
    value = f"data:{file.content_type};base64,{encoded}"

    row = _get_or_create(db, "avatar")
    row.value = value
    db.commit()

    return _read_all(db)


@router.delete("/avatar", response_model=SettingsRead)
def delete_avatar(db: Session = Depends(get_db)) -> dict[str, str]:
    row = _get_or_create(db, "avatar")
    row.value = ""
    db.commit()
    return _read_all(db)


@router.get("/avatar")
def get_avatar(db: Session = Depends(get_db)) -> Response:
    data = _read_all(db)
    avatar = data.get("avatar", "")
    if not avatar:
        raise HTTPException(status_code=404, detail="No avatar set")

    # Parse data URI: data:<mime>;base64,<data>
    header, _, b64data = avatar.partition(",")
    mime = header.replace("data:", "").replace(";base64", "")

    return Response(
        content=base64.b64decode(b64data),
        media_type=mime,
    )
