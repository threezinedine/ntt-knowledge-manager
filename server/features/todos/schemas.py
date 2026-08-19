from datetime import datetime

from pydantic import BaseModel


# ---------------------------------------------------------------------------
# PeriodType
# ---------------------------------------------------------------------------

class PeriodTypeCreate(BaseModel):
    name: str
    kind: str  # "interval" | "weekly"
    interval_days: int | None = None
    days_of_week: list[int] | None = None
    times_per_occurrence: int = 1


class PeriodTypeUpdate(BaseModel):
    name: str | None = None
    kind: str | None = None
    interval_days: int | None = None
    days_of_week: list[int] | None = None
    times_per_occurrence: int | None = None


class PeriodTypeRead(BaseModel):
    id: int
    name: str
    kind: str
    interval_days: int | None
    days_of_week: list[int] | None
    times_per_occurrence: int
    is_custom: bool
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Category
# ---------------------------------------------------------------------------

class CategoryCreate(BaseModel):
    name: str
    color: str = ""


class CategoryUpdate(BaseModel):
    name: str | None = None
    color: str | None = None


class CategoryRead(BaseModel):
    id: int
    name: str
    color: str
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# TaskTemplate
# ---------------------------------------------------------------------------

class TaskTemplateCreate(BaseModel):
    title: str
    description: str = ""
    priority: str = "medium"
    period_type_id: int | None = None
    next_due_at: datetime | None = None
    category_ids: list[int] = []


class TaskTemplateUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: str | None = None
    period_type_id: int | None = None
    next_due_at: datetime | None = None
    is_active: bool | None = None
    category_ids: list[int] | None = None


class TaskTemplateRead(BaseModel):
    id: int
    title: str
    description: str
    priority: str
    period_type_id: int | None
    next_due_at: datetime | None
    is_active: bool
    categories: list[CategoryRead]
    created_at: datetime
    updated_at: datetime


class TaskTemplatePage(BaseModel):
    items: list[TaskTemplateRead]
    total: int
    limit: int
    offset: int


# ---------------------------------------------------------------------------
# Task
# ---------------------------------------------------------------------------

class TaskCreate(BaseModel):
    title: str
    description: str = ""
    status: str = "todo"
    priority: str = "medium"
    due_date: datetime | None = None
    template_id: int | None = None
    category_ids: list[int] = []


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None
    priority: str | None = None
    due_date: datetime | None = None
    template_id: int | None = None
    category_ids: list[int] | None = None


class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    due_date: datetime | None
    completed_at: datetime | None
    template_id: int | None
    categories: list[CategoryRead]
    created_at: datetime
    updated_at: datetime


class TaskPage(BaseModel):
    items: list[TaskRead]
    total: int
    limit: int
    offset: int
