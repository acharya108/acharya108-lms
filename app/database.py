import os
import sqlalchemy
import databases
from dotenv import load_dotenv
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_sync_database_url(async_url: str) -> str:
    parsed = urlparse(async_url)
    # Remove +asyncpg from scheme for sync
    scheme = parsed.scheme.replace("+asyncpg", "")
    # Remove sslmode and channel_binding from query params for sync mode
    query_params = dict(parse_qsl(parsed.query))
    query_params.pop("sslmode", None)
    query_params.pop("channel_binding", None)
    new_query = urlencode(query_params)
    # Rebuild URL without asyncpg and without sslmode
    return urlunparse(parsed._replace(scheme=scheme, query=new_query))

DATABASE_URL_SYNC = get_sync_database_url(DATABASE_URL)

# Async DB connection for runtime queries / Prisma uses full async URL
database = databases.Database(DATABASE_URL)

# Sync engine only for schema creation
engine = sqlalchemy.create_engine(DATABASE_URL_SYNC)

metadata = sqlalchemy.MetaData()

def create_tables():
    metadata.create_all(engine)
