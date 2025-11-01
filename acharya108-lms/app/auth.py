from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os
from schemas import UserCreate, UserLogin, UserOut, TokenResponse
from app.database import database, metadata
import sqlalchemy
from datetime import datetime
import uuid

from fastapi import BackgroundTasks
from app.email_utils import send_email
from fastapi import Query



from schemas import UserCreate, UserOut

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

MAX_BCRYPT_PASSWORD_LENGTH = 72

# Register User
@router.post("/auth/register", response_model=UserOut)
async def register(user: UserCreate, background_tasks: BackgroundTasks):
    # Replace with your actual email to receive the test email
    test_recipient_email = "rjagathe@gmail.com"
    # Check if user already exists
    query = sqlalchemy.select(metadata.tables["users"]).where(metadata.tables["users"].c.email == user.email)
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate UUID for new user's id
    new_id = str(uuid.uuid4())

    # Truncate password and hash
    raw_password = user.password[:MAX_BCRYPT_PASSWORD_LENGTH]
    hashed_password = pwd_context.hash(raw_password)

    # Insert user in DB
    insert_query = metadata.tables["users"].insert().values(
        id=new_id,
        full_name=user.full_name,
        phone=user.phone,
        email=user.email,
        hashed_password=hashed_password,
        is_active=True,
        is_verified=False,
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
    )
    await database.execute(insert_query)

    # Generate email verification JWT token
    token_data = {
        "sub": user.email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)

    verification_url = f"https://your-frontend.com/verify-email?token={token}"

    email_body = f"Hello {user.full_name},\n\nPlease verify your email by clicking the link below:\n{verification_url}\n\nThank you!"

    # Send verification email asynchronously
    # background_tasks.add_task(send_email, user.email, "Email Verification", email_body)
    # Add background task to send test email asynchronously
    background_tasks.add_task(send_email, test_recipient_email, "Test Email", "This is a test email from your FastAPI app.")
    return {"message": "Test email sent, please check your inbox (and spam folder)."}
    # return UserOut(
      #  full_name=user.full_name,
       # phone=user.phone,
        #email=user.email,
    #)

@router.get("/test-email")
async def test_email(background_tasks: BackgroundTasks):
    test_recipient_email = "rjagathe@gmail.com"  # Change to your real test email
    background_tasks.add_task(send_email, test_recipient_email, "Test Email", "This is a test email from your FastAPI app.")
    return {"message": "Test email sent, please check your inbox (and spam folder)."}


# Login
@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    query = sqlalchemy.select(metadata.tables["users"]).where(metadata.tables["users"].c.email == user.email)
    stored_user = await database.fetch_one(query)
    if not stored_user or not pwd_context.verify(user.password, stored_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token_data = {
        "sub": user.email,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return TokenResponse(access_token=token)


# Email Verification (placeholder)
@router.post("/verify-email")
async def verify_email(token: str = Query(...)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Verification token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

    query = (
        metadata.tables["users"]
        .update()
        .where(metadata.tables["users"].c.email == email)
        .values(is_verified=True, updatedAt=datetime.utcnow())
    )
    await database.execute(query)

    return {"message": "Email verified successfully. Please login to continue."}


# Password Reset (placeholder)
@router.post("/reset-password")
async def reset_password(token: str, new_password: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Reset token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

    # Hash new password
    hashed_password = pwd_context.hash(new_password[:MAX_BCRYPT_PASSWORD_LENGTH])

    query = (
        metadata.tables["users"]
        .update()
        .where(metadata.tables["users"].c.email == email)
        .values(hashed_password=hashed_password, updatedAt=datetime.utcnow())
    )
    await database.execute(query)

    return {"message": "Password reset successfully. You can now login."}

