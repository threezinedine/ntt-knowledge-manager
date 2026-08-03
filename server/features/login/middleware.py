from collections.abc import Awaitable, Callable

from fastapi import Request
from starlette.responses import JSONResponse, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from server.features.login.token_model import LoginToken

PROTECTED_PATHS = {"/secure-health"}


async def validate_login_token(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    if request.url.path not in PROTECTED_PATHS:
        return await call_next(request)

    authorization = request.headers.get("Authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return JSONResponse({"detail": "Invalid login token"}, status_code=401)

    session_factory: Callable[[], Session] = request.app.state.db_session_factory
    with session_factory() as db:
        login_token = db.scalar(select(LoginToken).where(LoginToken.token == token))

    if login_token is None:
        return JSONResponse({"detail": "Invalid login token"}, status_code=401)

    return await call_next(request)