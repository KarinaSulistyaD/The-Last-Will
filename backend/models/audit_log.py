from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Text, text
from sqlalchemy.dialects.mysql import BIGINT, CHAR

from database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    audit_log_id = Column(
        BIGINT(unsigned=True),
        primary_key=True,
        index=True
    )

    actor_user_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("users.user_id"),
        nullable=True
    )

    will_id = Column(
        BIGINT(unsigned=True),
        ForeignKey("wills.will_id"),
        nullable=True
    )

    event_type = Column(String(100), nullable=False)
    event_data = Column(Text, nullable=False)

    sequence_no = Column(BIGINT(unsigned=True), nullable=False, unique=True)

    previous_hash = Column(CHAR(64), nullable=True)
    entry_hash = Column(CHAR(64), nullable=False)

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP")
    )