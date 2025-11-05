# minimal_test.py
import asyncio
import asyncpg
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

async def minimal_test():
    print("🧪 Minimal Registration Test")
    print("=" * 40)
    
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        print("✅ Database connected!")
        
        # Get required columns
        required_cols = await conn.fetch("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND is_nullable = 'NO'
            AND column_default IS NULL
        """)
        
        print("🔧 Required columns:", [col['column_name'] for col in required_cols])
        
        # Create user with only required fields
        user_id = str(uuid.uuid4())
        test_email = f"minimal_{user_id[:8]}@example.com"
        
        inserted_id = await conn.fetchval("""
            INSERT INTO users (id, email, password) 
            VALUES ($1, $2, $3)
            RETURNING id
        """, user_id, test_email, "minimalpass123")
        
        print(f"✅ Minimal user created!")
        print(f"   ID: {inserted_id}")
        
        # Clean up
        await conn.execute("DELETE FROM users WHERE id = $1", inserted_id)
        print("🗑️ Test user cleaned up")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Minimal test failed: {e}")
        return False

asyncio.run(minimal_test())