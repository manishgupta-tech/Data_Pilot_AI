"""
FastAPI Main Application Entry Point for DataPilot AI Backend.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.database.database import engine
from backend.app.database.base import Base
from backend.app.api import auth, datasets, analysis, dsa, chat, reports
from backend.app.seed_data import seed_default_dataset

# Ensure database tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="1.0.0",
    description="DataPilot AI Backend - Algorithmic Data Analysis Engine with FastAPI & DSA"
)

# CORS Middleware setup
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(datasets.router, prefix=settings.API_V1_STR)
app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(dsa.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)


@app.on_event("startup")
def on_startup():
    """Execute on startup: create seed datasets if empty."""
    try:
        seed_default_dataset()
    except Exception as e:
        print(f"Startup seed error: {e}")


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "environment": "production" if os.getenv("NODE_ENV") == "production" else "development"
    }
