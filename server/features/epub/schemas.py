from datetime import datetime

from pydantic import BaseModel


class EpubRead(BaseModel):
    id: int
    name: str
    original_filename: str
    url: str
    file_size: int
    upload_count: int
    created_at: datetime
    updated_at: datetime


class EpubUpdate(BaseModel):
    name: str | None = None


class EpubPage(BaseModel):
    items: list[EpubRead]
    total: int
    limit: int
    offset: int
