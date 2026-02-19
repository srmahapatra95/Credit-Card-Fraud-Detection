from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import ALLOWED_ORIGINS
from app.database import engine, Base
from app.routes.predict import router as predict_router
from app.routes.users import router as users_router
from dotenv import load_dotenv
import os

"""
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
"""

app = FastAPI(title="Fraud Detection API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/api/users", tags=["auth"])
app.include_router(predict_router, prefix="/api", tags=["predict"])
