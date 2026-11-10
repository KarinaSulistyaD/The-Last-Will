from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, text
from sqlalchemy.dialects.mysql import BIGINT

from database import Base


class Heir(Base):
    __tablename__ = "heirs"

    heir_id = Column(BIGINT(unsigned=True), primary_key=True, index=True)

    testator_user_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.user_id"),
        nullable=False
    )

    heir_user_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.user_id"),
        nullable=True
    )

    full_name = Column(String(150), nullable=False)
    email = Column(String(190), nullable=True)
    relationship = Column(String(80), nullable=True)

    verification_status = Column(
        Enum("pending", "linked", "rejected"),
        nullable=False,
        server_default="pending"
    )

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