from fastapi import APIRouter, HTTPException, Depends, status, BackgroundTasks, Query
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
import uuid
from datetime import datetime

from app.schemas import UserCreate, UserLogin, UserOut, TokenResponse, ResetPassword  # Add ResetPassword if new
from app.models import User
from app.database import database
from app.email_utils import send_email

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MAX_BCRYPT_PASSWORD_LENGTH = 72

@AuthJWT.load_config
def get_config():
    from pydantic import BaseModel
    import os

    class Settings(BaseModel):
        authjwt_secret_key: str = os.getenv("JWT_SECRET")

    return Settings()

# Register User (unchanged)
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, background_tasks: BackgroundTasks):
    query = User.select().where(User.c.email == user.email)
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_id = str(uuid.uuid4())
    raw_password = user.password[:MAX_BCRYPT_PASSWORD_LENGTH]
    hashed_password = pwd_context.hash(raw_password)

    insert_query = User.insert().values(
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

    access_token = AuthJWT.create_access_token(subject=user.email, expires_in=86400)
    verification_url = f"https://your-frontend.com/verify-email?token={access_token}"

    email_body = f"Hello {user.full_name},\n\nPlease verify your email: {verification_url}\n\nThank you!"

    # background_tasks.add_task(send_email, user.email, "Email Verification", email_body)
    test_recipient_email = "rjagathe@gmail.com"
    background_tasks.add_task(send_email, test_recipient_email, "Test Email", "Registration test from Acharya108 LMS.")

    return UserOut(
        id=new_id,
        full_name=user.full_name,
        phone=user.phone,
        email=user.email,
        is_active=True,
        is_verified=False,
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
    )

# Test Email (unchanged)
@router.get("/test-email")
async def test_email(background_tasks: BackgroundTasks):
    test_recipient_email = "rjagathe@gmail.com"
    background_tasks.add_task(send_email, test_recipient_email, "Test Email", "This is a test from your FastAPI app.")
    return {"message": "Test email sent, check inbox/spam."}

# Login (unchanged)
@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin, Authorize: AuthJWT = Depends()):
    query = User.select().where(User.c.email == user.email)
    db_user = await database.fetch_one(query)
    if not db_user or not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = Authorize.create_access_token(subject=db_user["email"])
    return TokenResponse(access_token=access_token)

# Email Verification (unchanged)
@router.post("/verify-email")
async def verify_email(token: str = Query(...), Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        email = Authorize.get_jwt_subject()
    except AuthJWTException:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    update_query = User.update().where(User.c.email == email).values(
        is_verified=True,
        updatedAt=datetime.utcnow()
    )
    result = await database.execute(update_query)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Email verified successfully. Please login."}

# Password Reset (FIXED: Required param first, then optional token)
@router.post("/reset-password", response_model=dict)
async def reset_password(
    reset_data: ResetPassword,  # Required: From body (new model)
    token: str = Query(None),  # Optional: Query param (for token-based reset)
    Authorize: AuthJWT = Depends()  # Optional: For auth if needed
):
    # If token provided, validate it
    if token:
        try:
            Authorize.jwt_required(token=token)  # Use provided token
            email = Authorize.get_jwt_subject()
        except AuthJWTException:
            raise HTTPException(status_code=400, detail="Invalid or expired token")
    else:
        # Fallback: Require email in body (enhance ResetPassword model with email)
        email = reset_data.email  # Assume model has email for email-based reset

    # Hash new password
    hashed_password = pwd_context.hash(reset_data.new_password[:MAX_BCRYPT_PASSWORD_LENGTH])

    # Update
    update_query = User.update().where(User.c.email == email).values(
        hashed_password=hashed_password,
        updatedAt=datetime.utcnow()
    )
    result = await database.execute(update_query)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Password reset successfully. Login with new password."}

# Profile (unchanged)
@router.get("/profile", response_model=UserOut)
async def profile(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        current_user_email = Authorize.get_jwt_subject()
    except AuthJWTException:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    query = User.select().where(User.c.email == current_user_email)
    db_user = await database.fetch_one(query)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserOut(**db_user)