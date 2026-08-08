from datetime import datetime

from pydantic import BaseModel, Field


class NodeCreate(BaseModel):
    title: str
    node_type: str = "note"
    content: str = ""
    metadata: dict[str, object] = Field(default_factory=dict)


class NodeUpdate(BaseModel):
    title: str | None = None
    node_type: str | None = None
    content: str | None = None
    metadata: dict[str, object] | None = None


class NodeRead(BaseModel):
    id: int
    title: str
    node_type: str
    content: str
    metadata: dict[str, object]
    created_at: datetime
    updated_at: datetime


class RelationCreate(BaseModel):
    target_node_id: int
    relation_type: str = "linked"
    metadata: dict[str, object] = Field(default_factory=dict)


class RelationUpdate(BaseModel):
    relation_type: str | None = None
    metadata: dict[str, object] | None = None


class RelationRead(BaseModel):
    id: int
    source_node_id: int
    target_node_id: int
    relation_type: str
    metadata: dict[str, object]
    created_at: datetime
