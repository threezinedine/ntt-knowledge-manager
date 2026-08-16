"""add vocabulary table

Revision ID: 0005
Revises: 0004
Create Date: 2026-08-16 00:00:01.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "vocabulary",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("word", sa.String(255), nullable=False, unique=True, index=True),
        sa.Column("word_type", sa.String(32), nullable=False),
        sa.Column("english_meaning", sa.Text(), nullable=False, server_default=""),
        sa.Column("vietnamese_meaning", sa.Text(), nullable=False, server_default=""),
        sa.Column("examples", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("oald_link", sa.String(512), nullable=False, server_default=""),
        sa.Column("search_times", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("vocabulary")
