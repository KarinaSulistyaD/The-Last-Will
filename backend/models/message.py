from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, text
from sqlalchemy.dialects.mysql import BIGINT, LONGBLOB, VARBINARY

from database import Base


class WillMessage(Base):
    __tablename__ = "will_messages"

    message_id = Column(BIGINT(unsigned=True), primary_key=True, index=True)

    will_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("wills.will_id"),
        nullable=False,
        unique=True
    )

    ciphertext = Column(LONGBLOB, nullable=False)
    algorithm = Column(String(80), nullable=False)
    algorithm_version = Column(String(30), nullable=False)
    nonce = Column(VARBINARY(32), nullable=False)
    auth_tag = Column(VARBINARY(32), nullable=True)

    classical_algorithm = Column(String(40), nullable=False)
    classical_parameters = Column(JSON, nullable=True)

    key_envelope_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("key_envelopes.key_envelope_id"),
        nullable=True
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