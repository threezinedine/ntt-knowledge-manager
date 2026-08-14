from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.middleware import require_login
from server.features.settings.model import Settings
from server.features.settings.schemas import SettingsRead, SettingsUpdate, ThemeValue

DEFAULTS: dict[str, str] = {
    "theme": ThemeValue.light.value,
    "nickname": "",
}

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
