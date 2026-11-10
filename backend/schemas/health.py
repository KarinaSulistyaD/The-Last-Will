from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Skema respons untuk endpoint pemeriksaan status backend."""

    status: str
    service: str
    environment: str


class DatabaseHealthResponse(BaseModel):
    """Skema respons untuk endpoint pemeriksaan koneksi database."""

    status: str
    database: str
    database_name: str
