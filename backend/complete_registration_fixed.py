# complete_registration_fixed.py
import asyncio
import asyncpg
import os
import uuid
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

async def register_user_with_confirmation(email, name, password, phone=None):
    print(f"👤 Registering user: {email}")
    print("=" * 40)
    
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        
        # Check if user already exists
        existing_user = await conn.fetchrow(
            'SELECT id FROM users WHERE email = $1', email
        )
        
        if existing_user:
            print("❌ User already exists")
            await conn.close()
            return False
        
        # Generate user ID and confirmation token
        user_id = str(uuid.uuid4())
        current_time = datetime.now()
        
        # Create confirmation token
        confirmation_token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'exp': datetime.now() + timedelta(hours=24)
        }, os.getenv('JWT_SECRET', 'fallback-secret'), algorithm='HS256')
        
        # Insert new user
        inserted_id = await conn.fetchval("""
            INSERT INTO users (
                id, email, name, phone, password, "updatedAt", 
                "isConfirmed", role, "confirmationToken"
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        """, user_id, email, name, phone, password, current_time, 
           False, "student", confirmation_token)
        
        print(f"✅ User registered successfully!")
        print(f"   User ID: {inserted_id}")
        print(f"   Email: {email}")
        print(f"   Name: {name}")
        print(f"   Confirmation Token: {confirmation_token[:50]}...")
        
        # TODO: Send confirmation email here
        # await send_confirmation_email(email, confirmation_token, name)
        
        print("📧 Confirmation email would be sent here")
        
        await conn.close()
        return inserted_id
        
    except Exception as e:
        print(f"❌ Registration failed: {e}")
        return False

async def confirm_user_email(token):
    print(f"🔐 Confirming email with token")
    print("=" * 40)
    
    try:
        # Verify token
        payload = jwt.decode(token, os.getenv('JWT_SECRET', 'fallback-secret'), algorithms=['HS256'])
        user_id = payload['user_id']
        email = payload['email']
        
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        
        # Update user as confirmed
        result = await conn.execute("""
            UPDATE users 
            SET "isConfirmed" = true, "confirmationToken" = NULL, "updatedAt" = $1
            WHERE id = $2 AND email = $3
        """, datetime.now(), user_id, email)
        
        if "UPDATE 1" in result:
            print(f"✅ Email confirmed for user: {email}")
            await conn.close()
            return True
        else:
            print("❌ User not found or already confirmed")
            await conn.close()
            return False
            
    except jwt.ExpiredSignatureError:
        print("❌ Confirmation token has expired")
        return False
    except jwt.InvalidTokenError:
        print("❌ Invalid confirmation token")
        return False
    except Exception as e:
        print(f"❌ Confirmation failed: {e}")
        return False

# Test the complete flow
async def test_complete_flow():
    test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
    test_name = "Test Complete User"
    test_password = "securepassword123"
    
    # Step 1: Register user
    user_id = await register_user_with_confirmation(
        email=test_email,
        name=test_name,
        password=test_password,
        phone="1234567890"
    )
    
    if user_id:
        print("\n" + "="*50)
        print("🎉 REGISTRATION SUCCESSFUL!")
        print("Next steps:")
        print("1. User would receive confirmation email")
        print("2. User clicks link to confirm email")
        print("3. Email confirmation updates user status")
        
        # Cleanup - remove test user
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        await conn.execute("DELETE FROM users WHERE id = $1", user_id)
        await conn.close()
        print("🗑️ Test user cleaned up")

# Run the test
asyncio.run(test_complete_flow())