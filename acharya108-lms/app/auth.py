from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

# Mock database
users_db = {}

# Register User
@router.post("/register")
async def register(user: UserCreate):
    if user.email in users_db:
        raise HTTPException(400, "Email already registered")
    hashed_password = pwd_context.hash(user.password)
    users_db[user.email] = {
        "full_name": user.full_name,
        "phone": user.phone,
        "email": user.email,
        "hashed_password": hashed_password,
        "verified": False
    }
    # Send email verification here
    return {"message": "User registered, verify your email"}

# Login
@router.post("/login")
async def login(email: str, password: str):
    user = users_db.get(email)
    if not user or not pwd_context.verify(password, user["hashed_password"]):
        raise HTTPException(401, "Invalid credentials")
    token_data = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"access_token": token}

# Email Verification
@router.post("/verify-email")
async def verify_email(token: str):
    # decode token, mark user verified
    pass

# Password Reset
@router.post("/reset-password")
async def reset_password(token: str, new_password: str):
    # verify token, update password
    pass
