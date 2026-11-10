from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

try:
    from backend.config import settings
    from backend.database import get_db
    from backend.schemas.health import DatabaseHealthResponse, HealthResponse
except ImportError:
    from config import settings
    from database import get_db
    from schemas.health import DatabaseHealthResponse, HealthResponse


router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Memeriksa status layanan backend The Last Will."""
    return HealthResponse(
        status="ok",
        service=settings.APP_NAME,
        environment=settings.APP_ENV,
    )


@router.get("/health/database", response_model=DatabaseHealthResponse)
def database_health_check(db: Session = Depends(get_db)) -> DatabaseHealthResponse:
    """Memeriksa status koneksi ke database MySQL."""
    try:
        result = db.execute(text("SELECT DATABASE();"))
        db_name = result.scalar()
        if not db_name:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={
                    "status": "error",
                    "database": "disconnected",
                    "message": "Koneksi berhasil tetapi tidak ada database yang terpilih.",
                },
            )
        return DatabaseHealthResponse(
            status="ok",
            database="connected",
            database_name=str(db_name),
        )
    except HTTPException:
        raise
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "database": "disconnected",
                "message": f"Gagal terhubung ke database MySQL ({exc.__class__.__name__}).",
            },
        ) from exc
