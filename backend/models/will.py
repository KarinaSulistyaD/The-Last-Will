from sqlalchemy import (
    Column,
    String,
    Text,
    Enum,
    DateTime,
    ForeignKeyConstraint,
    text
)
from sqlalchemy.dialects.mysql import BIGINT

from database import Base


class Will(Base):
    __tablename__ = "wills"

    will_id = Column(
        BIGINT(unsigned=True),
        primary_key=True,
        index=True
    )

    testator_user_id = Column(
        BIGINT(unsigned=True),
        nullable=False
    )

    heir_id = Column(
        BIGINT(unsigned=True),
        nullable=False
    )

    title = Column(String(180), nullable=False)
    description = Column(Text, nullable=True)

    status = Column(
        Enum(
            "draft",
            "active",
            "claim_pending",
            "ready_to_release",
            "released",
            "revoked"
        ),
        nullable=False,
        server_default="draft"
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

    activated_at = Column(DateTime, nullable=True)
    released_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)

    __table_args__ = (
        ForeignKeyConstraint(
            ["testator_user_id", "heir_id"],
            ["heirs.testator_user_id", "heirs.heir_id"],
            name="fk_wills_heir_belongs_to_testator",
            onupdate="CASCADE"
        ),
    )