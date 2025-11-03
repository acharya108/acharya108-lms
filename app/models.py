import sqlalchemy
from sqlalchemy import Table, Column, Integer, String, Boolean
from app.database import metadata

User = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("full_name", String, nullable=False),
    Column("phone", String, nullable=True),
    Column("email", String, unique=True, nullable=False),
    Column("hashed_password", String, nullable=False),
    Column("is_active", Boolean, default=True),
    Column("is_verified", Boolean, default=False),
)
