from enum import Enum

from pydantic import BaseModel


class ThemeValue(str, Enum):
    light = "light"
    dark = "dark"


class SettingsRead(BaseModel):
    theme: ThemeValue
    nickname: str
    avatar: str


class SettingsUpdate(BaseModel):
    theme: ThemeValue | None = None
    nickname: str | None = None
