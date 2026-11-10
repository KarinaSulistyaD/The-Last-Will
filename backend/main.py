from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.config import settings
    from backend.routes.health import router as health_router
except ImportError:
    from config import settings
    from routes.health import router as health_router


app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API untuk aplikasi The Last Will.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
