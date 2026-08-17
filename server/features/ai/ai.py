import os

import httpx
from fastapi import APIRouter, HTTPException

from .schemas import AiChatRequest

router = APIRouter(prefix="/ai", tags=["ai"])

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


@router.post("/chat")
async def chat(request: AiChatRequest):
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            GROQ_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json=request.model_dump(),
            timeout=30.0,
        )

    if resp.status_code != 200:
        detail = resp.json().get("error", {}).get("message", f"Groq error {resp.status_code}")
        raise HTTPException(status_code=resp.status_code, detail=detail)

    return resp.json()
