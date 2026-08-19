import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.database import get_db, initialize_database
from server.features.login.login import router as login_router
from server.features.login.middleware import require_login
from server.features.node.node import router as nodes_router
from server.features.settings.settings import router as settings_router
from server.features.vocabulary.vocabulary import router as vocabulary_router
from server.features.ai.ai import router as ai_router
from server.features.chunks.chunks import router as chunks_router
from server.features.epub.epub import router as epub_router
from server.features.todos.period_types import router as period_types_router
from server.features.todos.categories import router as categories_router
from server.features.todos.task_templates import router as task_templates_router
from server.features.todos.tasks import router as tasks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not getattr(app.state, "skip_database_initialization", False):
        initialize_database()
    yield


app = FastAPI(title="Knowledge Manager API", lifespan=lifespan)

# allow the dev client origin to reach the API during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


@api.get("/health")
async def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok Thao"}


@api.get("/secure-health", dependencies=[Depends(require_login)])
async def secure_health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


api.include_router(login_router)
api.include_router(nodes_router)
api.include_router(settings_router)
api.include_router(vocabulary_router)
api.include_router(chunks_router)
api.include_router(ai_router)
api.include_router(epub_router)
api.include_router(period_types_router)
api.include_router(categories_router)
api.include_router(task_templates_router)
api.include_router(tasks_router)
app.include_router(api)
app.mount(
    "/",
    StaticFiles(directory=Path(__file__).with_name("static"), html=True),
    name="web",
)
