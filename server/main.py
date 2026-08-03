from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.database import get_db, initialize_database
from server.features.login.login import router as login_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not getattr(app.state, "skip_database_initialization", False):
        initialize_database()
    yield


app = FastAPI(title="Knowledge Manager API", lifespan=lifespan)


@app.get("/health")
async def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok Thao"}


app.include_router(login_router)
