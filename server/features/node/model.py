from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from server.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Node(Base):
    __tablename__ = "nodes"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    node_type: Mapped[str] = mapped_column(String(64), default="note")
    content: Mapped[str] = mapped_column(Text, default="")
    # "metadata" is reserved by SQLAlchemy's declarative API, so the attribute
    # is named `meta` while the column itself is stored as "metadata".
    meta: Mapped[dict[str, object]] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=utcnow, onupdate=utcnow
    )


class NodeRelation(Base):
    __tablename__ = "node_relations"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_node_id: Mapped[int] = mapped_column(ForeignKey("nodes.id"), index=True)
    target_node_id: Mapped[int] = mapped_column(ForeignKey("nodes.id"), index=True)
    relation_type: Mapped[str] = mapped_column(String(64), default="linked")
    meta: Mapped[dict[str, object]] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
