from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from server.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id: Mapped[int] = mapped_column(primary_key=True)
    word: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phonetic: Mapped[str] = mapped_column(String(255), default="")
    audio_url: Mapped[str] = mapped_column(String(512), default="")
    meanings: Mapped[list[dict[str, object]]] = mapped_column(JSON, default=list)
    oald_link: Mapped[str] = mapped_column(String(512), default="")
    vietnamese_meaning: Mapped[str] = mapped_column(Text, default="")
    search_times: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow
    )


class SearchLog(Base):
    __tablename__ = "search_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    vocabulary_id: Mapped[int] = mapped_column(
        ForeignKey("vocabulary.id", ondelete="CASCADE"), index=True
    )
    searched_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
