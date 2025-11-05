# fixed_test.py
import asyncio
import asyncpg
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

async def fixed_registration_test():
    print("🧪 Fixed Registration Test")
    print("=" * 40)
    
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        print("✅ Database connected!")
        
        # Generate a unique ID (like Prisma's cuid())
        user_id = str(uuid.uuid4())
        test_email = f"test_{user_id[:8]}@example.com"
        
        # Insert user with all required fields
        inserted_id = await conn.fetchval("""
            INSERT INTO users (id, email, name, password, role, "isConfirmed") 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        """, user_id, test_email, "Test User", "testpass123", "student", False)
        
        print(f"✅ User created successfully!")
        print(f"   User ID: {inserted_id}")
        print(f"   Email: {test_email}")
        
        # Verify the user was created
        user = await conn.fetchrow('SELECT * FROM users WHERE id = $1', inserted_id)
        print(f"✅ User verified in database")
        print(f"   Email: {user['email']}")
        print(f"   Role: {user['role']}")
        print(f"   isConfirmed: {user['isConfirmed']}")
        
        # Clean up
        await conn.execute("DELETE FROM users WHERE id = $1", inserted_id)
        print("🗑️ Test user cleaned up")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Registration failed: {e}")
        return False

asyncio.run(fixed_registration_test())