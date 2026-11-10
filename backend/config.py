from pathlib import Path
from typing import List
from urllib.parse import quote_plus
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent


class Settings(BaseSettings):
    """Konfigurasi aplikasi yang dibaca dari environment variables."""

    APP_NAME: str = "The Last Will API"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000

    CORS_ORIGINS: str = (
        "http://localhost:3000,http://127.0.0.1:3000,"
        "http://localhost:5500,http://127.0.0.1:5500,"
        "http://localhost:8080,http://127.0.0.1:8080"
    )

    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = ""
    DB_PASSWORD: str = ""
    DB_NAME: str = "the_last_will"
    DATABASE_URL: str = ""

    model_config = SettingsConfigDict(
        env_file=(str(ROOT_DIR / ".env"), str(BASE_DIR / ".env")),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        encoded_user = quote_plus(self.DB_USER)
        encoded_password = quote_plus(self.DB_PASSWORD)
        if encoded_user and encoded_password:
            auth = f"{encoded_user}:{encoded_password}@"
        elif encoded_user:
            auth = f"{encoded_user}@"
        else:
            auth = ""
        return f"mysql+pymysql://{auth}{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()
