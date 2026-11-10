from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.mysql import BIGINT, LONGBLOB

from database import Base


class FaceCredential(Base):
    __tablename__ = "face_credentials"

    face_credential_id = Column(
        BIGINT(unsigned=True),
        primary_key=True,
        index=True
    )

    user_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.user_id"),
        nullable=False,
        unique=True
    )

    encrypted_template = Column(LONGBLOB, nullable=False)
    template_version = Column(String(30), nullable=False)
    model_name = Column(String(120), nullable=False)

    is_active = Column(
        Boolean,
        nullable=False,
        server_default="1"
    )

    consent_at = Column(DateTime, nullable=False)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

    revoked_at = Column(DateTime, nullable=True)