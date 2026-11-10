from sqlalchemy import Column, String, DateTime, ForeignKey, BigInteger, text
from sqlalchemy.dialects.mysql import BIGINT, LONGBLOB, VARBINARY, CHAR

from database import Base


class WillDocument(Base):
    __tablename__ = "will_documents"

    document_id = Column(BIGINT(unsigned=True), primary_key=True, index=True)

    will_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("wills.will_id"),
        nullable=False
    )

    original_filename = Column(String(255), nullable=False)
    mime_type = Column(String(120), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    storage_path = Column(String(500), nullable=False)

    ciphertext_sha256 = Column(CHAR(64), nullable=False)

    algorithm = Column(String(80), nullable=False, server_default="AES-256-GCM")
    algorithm_version = Column(String(30), nullable=False, server_default="1")

    nonce = Column(VARBINARY(32), nullable=False)
    auth_tag = Column(VARBINARY(32), nullable=True)

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