from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum, text
from sqlalchemy.dialects.mysql import BIGINT, CHAR

from database import Base


class DeathVerification(Base):
    __tablename__ = "death_verifications"

    verification_id = Column(
        BIGINT(unsigned=True),
        primary_key=True,
        index=True
    )

    will_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("wills.will_id"),
        nullable=False
    )

    heir_user_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.user_id"),
        nullable=False
    )

    document_storage_path = Column(String(500), nullable=False)
    document_sha256 = Column(CHAR(64), nullable=False)

    status = Column(
        Enum("pending", "approved", "rejected"),
        nullable=False,
        server_default="pending"
    )

    admin_user_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.user_id"),
        nullable=True
    )

    admin_notes = Column(Text, nullable=True)

    submitted_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

    reviewed_at = Column(DateTime, nullable=True)