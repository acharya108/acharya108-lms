# quick_test.py
import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def quick_test():
    print("🧪 Quick Registration Test")
    print("=" * 40)
    
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        print("✅ Database connected!")
        
        # Try different column name variations
        test_email = "quick_test@example.com"
        
        try:
            # Try with "isConfirmed" (Prisma default)
            user_id = await conn.fetchval("""
                INSERT INTO users (email, name, password, role, \"isConfirmed\") 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            """, test_email, "Quick Test User", "testpass123", "student", False)
            print("✅ Used 'isConfirmed' column")
            
        except Exception as e1:
            if "isConfirmed" in str(e1):
                try:
                    # Try with "is_confirmed" (common SQL naming)
                    user_id = await conn.fetchval("""
                        INSERT INTO users (email, name, password, role, is_confirmed) 
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING id
                    """, test_email, "Quick Test User", "testpass123", "student", False)
                    print("✅ Used 'is_confirmed' column")
                    
                except Exception as e2:
                    if "is_confirmed" in str(e2):
                        # Try without confirmation column
                        user_id = await conn.fetchval("""
                            INSERT INTO users (email, name, password, role) 
                            VALUES ($1, $2, $3, $4)
                            RETURNING id
                        """, test_email, "Quick Test User", "testpass123", "student")
                        print("✅ Used basic columns (no confirmation)")
                    else:
                        raise e2
            else:
                raise e1
        
        print(f"✅ User created with ID: {user_id}")
        
        # Clean up
        await conn.execute("DELETE FROM users WHERE id = $1", user_id)
        print("🗑️ Test user cleaned up")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ All attempts failed: {e}")
        return False

asyncio.run(quick_test())