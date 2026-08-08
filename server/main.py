import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.database import get_db, initialize_database
from server.features.login.login import router as login_router
from server.features.login.middleware import require_login


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


@app.get("/health")
async def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok Thao"}


@app.get("/secure-health", dependencies=[Depends(require_login)])
async def secure_health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


app.include_router(login_router)
app.mount(
    "/",
    StaticFiles(directory=Path(__file__).with_name("static"), html=True),
    name="web",
)
