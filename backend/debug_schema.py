# debug_schema.py
import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def debug_schema():
    print("🔍 Debugging Database Schema")
    print("=" * 40)
    
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        
        # Get exact column definitions
        columns = await conn.fetch("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        """)
        
        print("📋 Users table structure:")
        for col in columns:
            default = col['column_default'] or 'NULL'
            nullable = 'NULL' if col['is_nullable'] == 'YES' else 'NOT NULL'
            print(f"   {col['column_name']} ({col['data_type']}) {nullable} DEFAULT {default}")
        
        # Check if there are any existing users
        user_count = await conn.fetchval("SELECT COUNT(*) FROM users")
        print(f"\n👥 Total users in database: {user_count}")
        
        if user_count > 0:
            # Show first user as example
            sample_user = await conn.fetchrow("SELECT * FROM users LIMIT 1")
            print(f"\n📝 Sample user structure:")
            for key, value in sample_user.items():
                print(f"   {key}: {value}")
        
        await conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

asyncio.run(debug_schema())