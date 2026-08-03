from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.token_model import LoginToken

router = APIRouter(prefix="/login-tokens", tags=["login"])


@router.get("/{token}")
async def validate_login_token(
    token: str, db: Session = Depends(get_db)
) -> dict[str, bool]:
    login_token = db.scalar(select(LoginToken).where(LoginToken.token == token))
    return {"valid": login_token is not None}
