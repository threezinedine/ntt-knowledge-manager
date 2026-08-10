"""initial schema as it existed before Alembic

Revision ID: 0001
Revises:
Create Date: 2026-08-10 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "login_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("token", sa.String(length=128), nullable=False),
        sa.Column("label", sa.String(length=128), nullable=False),
    )
    op.create_index("ix_login_tokens_token", "login_tokens", ["token"], unique=True)

    op.create_table(
        "nodes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("node_type", sa.String(length=64), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )

    op.create_table(
        "node_relations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_node_id", sa.Integer(), nullable=False),
        sa.Column("target_node_id", sa.Integer(), nullable=False),
        sa.Column("relation_type", sa.String(length=64), nullable=False),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["source_node_id"],
            ["nodes.id"],
        ),
        sa.ForeignKeyConstraint(
            ["target_node_id"],
            ["nodes.id"],
        ),
    )
    op.create_index(
        "ix_node_relations_source_node_id",
        "node_relations",
        ["source_node_id"],
        unique=False,
    )
    op.create_index(
        "ix_node_relations_target_node_id",
        "node_relations",
        ["target_node_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_node_relations_target_node_id", table_name="node_relations")
    op.drop_index("ix_node_relations_source_node_id", table_name="node_relations")
    op.drop_table("node_relations")
    op.drop_table("nodes")
    op.drop_index("ix_login_tokens_token", table_name="login_tokens")
    op.drop_table("login_tokens")
