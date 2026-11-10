from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.mysql import BIGINT, CHAR

from database import Base


class StegoAccessKey(Base):
    __tablename__ = "stego_access_keys"

    stego_key_id = Column(BIGINT(unsigned=True), primary_key=True, index=True)

    will_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("wills.will_id"),
        nullable=False
    )

    verifier_hash = Column(CHAR(64), nullable=False)
    verifier_version = Column(String(30), nullable=False)
    payload_version = Column(String(30), nullable=False)

    carrier_format = Column(
        String(10),
        nullable=False,
        server_default="PNG"
    )

    stego_image_path = Column(String(500), nullable=True)

    is_active = Column(
        Boolean,
        nullable=False,
        server_default="1"
    )

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

    revoked_at = Column(DateTime, nullable=True)