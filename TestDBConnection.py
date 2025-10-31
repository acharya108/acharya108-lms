import asyncio
import databases
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
database = databases.Database(DATABASE_URL)

async def test_db():
    try:
        await database.connect()
        print("Database connected successfully")
    except Exception as e:
        print(f"Connection error: {e}")
    finally:
        await database.disconnect()

asyncio.run(test_db())
