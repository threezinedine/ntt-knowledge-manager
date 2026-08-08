from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.database import get_db
from server.features.login.token_model import LoginToken


def require_login(
    request: Request,
    db: Session = Depends(get_db),
) -> str:
    """Route-level guard: validates the Bearer login token and returns it.

    Attach it to a route at definition time via
    ``dependencies=[Depends(require_login)]`` (or ``token: str = Depends(require_login)``
    when the endpoint needs the token) so protection is declared per-route
    instead of being looked up from a hardcoded path list.
    """
    authorization = request.headers.get("Authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid login token")

    login_token = db.scalar(select(LoginToken).where(LoginToken.token == token))
    if login_token is None:
        raise HTTPException(status_code=401, detail="Invalid login token")

    return token
