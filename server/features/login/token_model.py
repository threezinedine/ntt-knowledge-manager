import os

from sqlalchemy import String, func, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from server.database import Base


class LoginToken(Base):
    __tablename__ = "login_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    label: Mapped[str] = mapped_column(String(128))


FIX_TOKEN = os.getenv("FIX_TOKEN", "")


def get_fixed_login_tokens() -> tuple[tuple[str, str], ...]:
    if not FIX_TOKEN:
        return ()

    return ((FIX_TOKEN, "Fixed token"),)


def seed_login_tokens(db: Session) -> None:
    token_count = db.scalar(select(func.count()).select_from(LoginToken))
    if token_count == 0:
        db.add_all(
            LoginToken(token=token, label=label)
            for token, label in get_fixed_login_tokens()
        )
        db.commit()
