# simple_db_test.py
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

async def test_user_registration():
    print("👤 Testing User Registration with Direct DB Connection")
    print("=" * 50)
    
    try:
        # Connect to database
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        print("✅ Database connected successfully!")
        
        # Test user registration
        user_email = "test_direct@example.com"
        user_name = "Test Direct User"
        
        # Insert user
        user_id = await conn.fetchval("""
            INSERT INTO users (email, name, password, role, isConfirmed) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        """, user_email, user_name, "testpass123", "student", False)
        
        print(f"✅ User registered successfully!")
        print(f"   User ID: {user_id}")
        print(f"   Email: {user_email}")
        print(f"   Name: {user_name}")
        
        # Verify user was created
        user = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
        print(f"✅ User verified in database")
        print(f"   Confirmation status: {user['isconfirmed']}")
        
        # Clean up
        await conn.execute("DELETE FROM users WHERE id = $1", user_id)
        print("🗑️ Test user cleaned up")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Registration test failed: {e}")
        return False

# Run the test
import asyncio
asyncio.run(test_user_registration())