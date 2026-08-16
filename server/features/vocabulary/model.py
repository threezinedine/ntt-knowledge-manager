from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from server.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id: Mapped[int] = mapped_column(primary_key=True)
    word: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    word_type: Mapped[str] = mapped_column(String(32))
    english_meaning: Mapped[str] = mapped_column(Text, default="")
    vietnamese_meaning: Mapped[str] = mapped_column(Text, default="")
    examples: Mapped[list[str]] = mapped_column(JSON, default=list)
    oald_link: Mapped[str] = mapped_column(String(512), default="")
    search_times: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow
    )
