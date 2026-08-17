from pydantic import BaseModel


class AiChatMessage(BaseModel):
    role: str
    content: str


class AiChatRequest(BaseModel):
    model: str = "llama3-8b-8192"
    messages: list[AiChatMessage]
    temperature: float = 0.7
    max_tokens: int = 1024
