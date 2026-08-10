"""
AI Chat Request and Response Schemas.
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    dataset_id: int


class ChatResponse(BaseModel):
    dataset_id: int
    user_message: str
    assistant_reply: str
    timestamp: datetime


class ChatHistoryOut(BaseModel):
    id: int
    sender: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
