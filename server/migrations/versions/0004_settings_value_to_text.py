"""widen settings.value from String(255) to Text for avatar storage

Revision ID: 0004
Revises: 0003
Create Date: 2026-08-14 00:00:02.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("settings") as batch_op:
        batch_op.alter_column(
            "value",
            existing_type=sa.String(255),
            type_=sa.Text(),
            existing_nullable=False,
            existing_server_default="",
        )


def downgrade() -> None:
    with op.batch_alter_table("settings") as batch_op:
        batch_op.alter_column(
            "value",
            existing_type=sa.Text(),
            type_=sa.String(255),
            existing_nullable=False,
            existing_server_default="",
        )
