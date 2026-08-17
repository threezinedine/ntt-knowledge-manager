from datetime import datetime

from pydantic import BaseModel


class ChunkAdd(BaseModel):
    content: str


class ChunkUpdate(BaseModel):
    content: str | None = None
    vietnamese: str | None = None


class ChunkRead(BaseModel):
    id: int
    content: str
    vietnamese: str
    visit_times: int
    created_at: datetime
    updated_at: datetime


class ChunkPage(BaseModel):
    items: list[ChunkRead]
    total: int
    limit: int
    offset: int
