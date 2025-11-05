# backend/api/registration.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncpg
import os
import uuid
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class UserRegistration(BaseModel):
    email: str
    name: str
    password: str
    phone: str = None

@router.post("/register")
async def register_user(user_data: UserRegistration):
    try:
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        
        # Check if user exists
        existing = await conn.fetchrow('SELECT id FROM users WHERE email = $1', user_data.email)
        if existing:
            await conn.close()
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Generate IDs and tokens
        user_id = str(uuid.uuid4())
        confirmation_token = jwt.encode({
            'user_id': user_id,
            'email': user_data.email,
            'exp': datetime.now() + timedelta(hours=24)
        }, os.getenv('JWT_SECRET', 'fallback-secret'), algorithm='HS256')
        
        # Insert user
        await conn.execute("""
            INSERT INTO users (id, email, name, phone, password, "updatedAt", "isConfirmed", role, "confirmationToken") 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        """, user_id, user_data.email, user_data.name, user_data.phone, user_data.password, 
           datetime.now(), False, "student", confirmation_token)
        
        await conn.close()
        
        print(f"✅ User registered: {user_data.email}")
        return {
            "message": "User registered successfully. Please check your email for confirmation.",
            "user_id": user_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/confirm-email/{token}")
async def confirm_email(token: str):
    try:
        payload = jwt.decode(token, os.getenv('JWT_SECRET', 'fallback-secret'), algorithms=['HS256'])
        user_id = payload['user_id']
        email = payload['email']
        
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        result = await conn.execute("""
            UPDATE users SET "isConfirmed" = true, "confirmationToken" = NULL, "updatedAt" = $1
            WHERE id = $2 AND email = $3
        """, datetime.now(), user_id, email)
        await conn.close()
        
        if "UPDATE 1" in result:
            return {"message": "Email confirmed successfully!"}
        else:
            raise HTTPException(status_code=400, detail="Invalid token")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Test endpoint
@router.get("/test")
async def test_registration():
    return {"message": "Registration API is working!"}