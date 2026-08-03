from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.database import get_db

app = FastAPI(title="Knowledge Manager API")


@app.get("/health")
async def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok Thao"}
