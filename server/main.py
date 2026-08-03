from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.database import SessionLocal, get_db, initialize_database
from server.features.login.login import router as login_router
from server.features.login.middleware import validate_login_token


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not getattr(app.state, "skip_database_initialization", False):
        initialize_database()
    yield


app = FastAPI(title="Knowledge Manager API", lifespan=lifespan)
app.state.db_session_factory = SessionLocal
app.middleware("http")(validate_login_token)


@app.get("/health")
async def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok Thao"}


@app.get("/secure-health")
async def secure_health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


app.include_router(login_router)
