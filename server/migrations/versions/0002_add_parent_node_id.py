"""add parent_node_id to nodes for the mind-map tree structure

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-10 00:00:01.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # batch mode rebuilds the table, which is required to add an FK column on
    # SQLite (plain ALTER TABLE can't add constraints)
    with op.batch_alter_table("nodes") as batch_op:
        batch_op.add_column(
            sa.Column(
                "parent_node_id",
                sa.Integer(),
                sa.ForeignKey("nodes.id", name="fk_nodes_parent_node_id_nodes"),
                nullable=True,
            )
        )
        batch_op.create_index(
            "ix_nodes_parent_node_id", ["parent_node_id"], unique=False
        )


def downgrade() -> None:
    with op.batch_alter_table("nodes") as batch_op:
        batch_op.drop_index("ix_nodes_parent_node_id")
        batch_op.drop_column("parent_node_id")
