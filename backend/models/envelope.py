from sqlalchemy import Column, String, DateTime, ForeignKey, text
from sqlalchemy.dialects.mysql import BIGINT, LONGBLOB

from database import Base


class KeyEnvelope(Base):
    __tablename__ = "key_envelopes"

    key_envelope_id = Column(BIGINT(unsigned=True), primary_key=True, index=True)

    will_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("wills.will_id"),
        nullable=False
    )

    wrapped_dek = Column(LONGBLOB, nullable=False)
    wrapping_algorithm = Column(String(100), nullable=False)
    key_version = Column(String(20), nullable=False)
    key_reference = Column(String(255), nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )

    revoked_at = Column(DateTime, nullable=True)