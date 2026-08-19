from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Table,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from server.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ---------------------------------------------------------------------------
# Association tables (used as `secondary` in relationships)
# ---------------------------------------------------------------------------

task_categories_table = Table(
    "task_categories",
    Base.metadata,
    Column("task_id", Integer, ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
)

template_categories_table = Table(
    "template_categories",
    Base.metadata,
    Column("template_id", Integer, ForeignKey("task_templates.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
)


# ---------------------------------------------------------------------------
# ORM models
# ---------------------------------------------------------------------------

class PeriodType(Base):
    __tablename__ = "period_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    # "interval" → fires every N days   |   "weekly" → fires on specific days of week
    kind: Mapped[str] = mapped_column(String(32))
    # kind=interval: every N days (e.g. 2 = every other day)
    interval_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # kind=weekly: list of day numbers Mon=0 … Sun=6 (e.g. [1,3] = Tue+Thu)
    days_of_week: Mapped[list[int] | None] = mapped_column(JSON, nullable=True)
    # how many tasks to generate per trigger (e.g. 2 = "twice each Tuesday")
    times_per_occurrence: Mapped[int] = mapped_column(Integer, default=1)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    color: Mapped[str] = mapped_column(String(16), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)


class TaskTemplate(Base):
    __tablename__ = "task_templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    priority: Mapped[str] = mapped_column(String(16), default="medium")
    period_type_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("period_types.id", ondelete="SET NULL"), nullable=True
    )
    next_due_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    categories: Mapped[list["Category"]] = relationship(
        "Category", secondary=template_categories_table, lazy="select"
    )


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(16), default="todo")
    priority: Mapped[str] = mapped_column(String(16), default="medium")
    due_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    template_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("task_templates.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    categories: Mapped[list["Category"]] = relationship(
        "Category", secondary=task_categories_table, lazy="select"
    )
