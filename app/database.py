from databases import Database
import sqlalchemy
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL_ASYNC = os.getenv("DATABASE_URL_ASYNC")  # e.g. postgresql+asyncpg://user:pass@localhost/dbname
DATABASE_URL_SYNC = os.getenv("DATABASE_URL_SYNC")    # e.g. postgresql://user:pass@localhost/dbname

# Async database connection (for async queries)
database = Database(DATABASE_URL_ASYNC)

# Sync engine for tools that need sync SQLAlchemy (like migrations)
engine = sqlalchemy.create_engine(DATABASE_URL_SYNC)

# MetaData instance for schema definitions
metadata = sqlalchemy.MetaData()
