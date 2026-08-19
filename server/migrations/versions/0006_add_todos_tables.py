"""add todos tables (period_types, categories, task_templates, tasks, join tables)

Revision ID: 0006
Revises: 0005
Create Date: 2026-08-17 00:00:00.000000

"""

from datetime import datetime, timezone
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0006"
down_revision: Union[str, None] = "0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def upgrade() -> None:
    # 1. period_types --------------------------------------------------------
    period_types = op.create_table(
        "period_types",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, index=True),
        sa.Column("kind", sa.String(32), nullable=False),
        sa.Column("interval_days", sa.Integer(), nullable=True),
        sa.Column("days_of_week", sa.JSON(), nullable=True),
        sa.Column("times_per_occurrence", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("is_custom", sa.Boolean(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # Seed built-in period types
    now = utcnow()
    op.bulk_insert(period_types, [
        # interval-based
        dict(name="Daily",        kind="interval", interval_days=1,  days_of_week=None,      times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        dict(name="Every 2 days", kind="interval", interval_days=2,  days_of_week=None,      times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        dict(name="Every 3 days", kind="interval", interval_days=3,  days_of_week=None,      times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        # weekly-based (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6)
        dict(name="Every Monday",        kind="weekly", interval_days=None, days_of_week=[0],      times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        dict(name="Every Tuesday",       kind="weekly", interval_days=None, days_of_week=[1],      times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        dict(name="Every Wednesday",     kind="weekly", interval_days=None, days_of_week=[2],      times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        dict(name="Every Tue & Thu",     kind="weekly", interval_days=None, days_of_week=[1, 3],   times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        dict(name="Every weekday",       kind="weekly", interval_days=None, days_of_week=[0,1,2,3,4], times_per_occurrence=1, is_custom=False, created_at=now, updated_at=now),
        dict(name="Twice each Tuesday",  kind="weekly", interval_days=None, days_of_week=[1],      times_per_occurrence=2, is_custom=False, created_at=now, updated_at=now),
    ])

    # 2. categories ----------------------------------------------------------
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False, unique=True, index=True),
        sa.Column("color", sa.String(16), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # 3. task_templates ------------------------------------------------------
    op.create_table(
        "task_templates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("priority", sa.String(16), nullable=False, server_default="medium"),
        sa.Column(
            "period_type_id",
            sa.Integer(),
            sa.ForeignKey("period_types.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("next_due_at", sa.DateTime(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # 4. tasks ---------------------------------------------------------------
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("status", sa.String(16), nullable=False, server_default="todo"),
        sa.Column("priority", sa.String(16), nullable=False, server_default="medium"),
        sa.Column("due_date", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column(
            "template_id",
            sa.Integer(),
            sa.ForeignKey("task_templates.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    # 5. task_categories (join) ----------------------------------------------
    op.create_table(
        "task_categories",
        sa.Column("task_id", sa.Integer(), sa.ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
    )

    # 6. template_categories (join) ------------------------------------------
    op.create_table(
        "template_categories",
        sa.Column("template_id", sa.Integer(), sa.ForeignKey("task_templates.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
    )


def downgrade() -> None:
    op.drop_table("template_categories")
    op.drop_table("task_categories")
    op.drop_table("tasks")
    op.drop_table("task_templates")
    op.drop_table("categories")
    op.drop_table("period_types")
