from datetime import datetime

from pydantic import BaseModel, Field


class VocabularyCreate(BaseModel):
    word: str
    word_type: str
    english_meaning: str = ""
    vietnamese_meaning: str = ""
    examples: list[str] = Field(default_factory=list)
    oald_link: str = ""


class VocabularyUpdate(BaseModel):
    word: str | None = None
    word_type: str | None = None
    english_meaning: str | None = None
    vietnamese_meaning: str | None = None
    examples: list[str] | None = None
    oald_link: str | None = None


class VocabularyRead(BaseModel):
    id: int
    word: str
    word_type: str
    english_meaning: str
    vietnamese_meaning: str
    examples: list[str]
    oald_link: str
    search_times: int
    created_at: datetime
    updated_at: datetime


class VocabularyPage(BaseModel):
    items: list[VocabularyRead]
    total: int
    limit: int
    offset: int
