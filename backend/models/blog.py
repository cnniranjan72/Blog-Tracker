# backend/models/blog.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BlogCreate(BaseModel):
    title: str
    content: str
    isPublic: bool = True
    tags: Optional[List[str]] = []

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    isPublic: Optional[bool] = None
    tags: Optional[List[str]] = None

class BlogResponse(BaseModel):
    id: str
    title: str
    content: str
    authorId: str
    createdAt: datetime
    updatedAt: Optional[datetime] = None
    isPublic: bool
    tags: Optional[List[str]] = []
