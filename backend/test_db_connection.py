import os
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def test_prisma_connection():
    """Test Prisma database connection"""
    print("🔌 Testing Prisma connection...")
    try:
        from prisma import Prisma
        db = Prisma()
        await db.connect()
        print("✅ Prisma: Connected successfully!")
        await db.disconnect()
        return True
    except Exception as e:
        print(f"❌ Prisma: Connection failed - {e}")
        return False

async def test_asyncpg_connection():
    """Test asyncpg connection"""
    print("🔌 Testing asyncpg connection...")
    try:
        import asyncpg
        conn = await asyncpg.connect(os.getenv('DATABASE_URL_ASYNC'))
        print("✅ asyncpg: Connected successfully!")
        await conn.close()
        return True
    except Exception as e:
        print(f"❌ asyncpg: Connection failed - {e}")
        return False

async def main():
    print("=" * 60)
    print("🧪 DATABASE CONNECTION TESTS")
    print("=" * 60)
    print()
    
    prisma_ok = await test_prisma_connection()
    print()
    asyncpg_ok = await test_asyncpg_connection()
    print()
    
    print("=" * 60)
    if prisma_ok and asyncpg_ok:
        print("✅ ALL CONNECTION TESTS PASSED!")
    else:
        print("❌ SOME CONNECTION TESTS FAILED")
        print("   Check your DATABASE_URL values in .env")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
