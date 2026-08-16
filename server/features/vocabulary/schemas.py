from datetime import datetime

from pydantic import BaseModel


class DefinitionItem(BaseModel):
    definition: str
    example: str = ""


class MeaningItem(BaseModel):
    partOfSpeech: str
    definitions: list[DefinitionItem]


class VocabularyAdd(BaseModel):
    word: str


class VocabularyUpdate(BaseModel):
    vietnamese_meaning: str | None = None
    meanings: list[MeaningItem] | None = None
    phonetic: str | None = None
    audio_url: str | None = None
    oald_link: str | None = None


class SearchLogRead(BaseModel):
    id: int
    searched_at: datetime


class VocabularyRead(BaseModel):
    id: int
    word: str
    phonetic: str
    audio_url: str
    meanings: list[MeaningItem]
    oald_link: str
    vietnamese_meaning: str
    search_times: int
    search_history: list[SearchLogRead]
    created_at: datetime
    updated_at: datetime


class VocabularyPage(BaseModel):
    items: list[VocabularyRead]
    total: int
    limit: int
    offset: int
