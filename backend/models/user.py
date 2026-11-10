from sqlalchemy import Column, String, Enum, DateTime, text
from sqlalchemy.dialects.mysql import BIGINT

from database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(190), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)

    role = Column(
        Enum("pewaris", "ahli_waris", "admin"),
        nullable=False
    )

    account_status = Column(
        Enum("pending", "active", "suspended"),
        nullable=False,
        server_default="pending"
    )

    email_verified_at = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP")
    )