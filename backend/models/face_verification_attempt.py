from sqlalchemy import Column, Boolean, String, DateTime, ForeignKey, text
from sqlalchemy.dialects.mysql import BIGINT

from database import Base


class FaceVerificationAttempt(Base):
    __tablename__ = "face_verification_attempts"

    attempt_id = Column(
        BIGINT(unsigned=True),
        primary_key=True,
        index=True
    )

    user_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.user_id"),
        nullable=False
    )

    will_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("wills.will_id"),
        nullable=True
    )

    is_success = Column(Boolean, nullable=False)

    failure_reason_code = Column(String(60), nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )