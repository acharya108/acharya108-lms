from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Query, status
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
import uuid
from datetime import datetime, timedelta
import os
import smtplib
from email.message import EmailMessage
import logging
from dotenv import load_dotenv

from app.schemas import UserCreate, UserLogin, UserOut, TokenResponse, ResetPassword
from app.models import User
from app.database import database

load_dotenv()
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
MAX_BCRYPT_PASSWORD_LENGTH = 72

@AuthJWT.load_config
def get_config():
    from pydantic import BaseModel
    class Settings(BaseModel):
        authjwt_secret_key: str = os.getenv("JWT_SECRET")
    return Settings()

async def send_email(to_email: str, subject: str, body: str):
    logger.debug(f"Preparing to send email to {to_email} with subject '{subject}'")
    try:
        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = int(os.getenv("SMTP_PORT"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")
        email_from = os.getenv("EMAIL_FROM")

        if not all([smtp_host, smtp_port, smtp_user, smtp_password, email_from]):
            raise Exception("SMTP configuration incomplete. Please check your .env")

        msg = EmailMessage()
        msg.set_content(body)
        msg["Subject"] = subject
        msg["From"] = email_from
        msg["To"] = to_email

        logger.info(f"Connecting to SMTP server {smtp_host}:{smtp_port}...")
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.set_debuglevel(1)  # SMTP debug output
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
            logger.info(f"Email successfully sent to {to_email}")

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        raise

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, background_tasks: BackgroundTasks, Authorize: AuthJWT = Depends()):
    # Check if email already exists
    existing_user = await database.fetch_one(User.select().where(User.c.email == user.email))
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password[:MAX_BCRYPT_PASSWORD_LENGTH])
    new_id = str(uuid.uuid4())
    await database.execute(
        User.insert().values(
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
    )
    # Generate verification token
    access_token = Authorize.create_access_token(subject=user.email, expires_time=timedelta(hours=24))
    verification_link = f"https://www.acharya108.com/verify-email?token={access_token}"
    email_body = f"""
    Hello {user.full_name},

    Thank you for registering. Please verify your email by clicking the link below:

    {verification_link}

    This link will expire in 24 hours.

    Regards,
    Acharya108 LMS Team
    """
    # Send email asynchronously
    background_tasks.add_task(send_email, user.email, "Verify Your Email - Acharya108 LMS", email_body)

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

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin, Authorize: AuthJWT = Depends()):
    db_user = await database.fetch_one(User.select().where(User.c.email == user.email))
    if not db_user or not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = Authorize.create_access_token(subject=db_user["email"])
    return TokenResponse(access_token=access_token)

@router.post("/verify-email")
async def verify_email(token: str = Query(...), Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required(token=token)
        email = Authorize.get_jwt_subject()
    except AuthJWTException:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    update_result = await database.execute(
        User.update().where(User.c.email == email).values(is_verified=True, updatedAt=datetime.utcnow())
    )
    if not update_result:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Email verified successfully. Please login."}

@router.post("/reset-password", response_model=dict)
async def reset_password(
    reset_data: ResetPassword,
    token: str = Query(None),
    Authorize: AuthJWT = Depends()
):
    email = reset_data.email
    if token:
        try:
            Authorize.jwt_required(token=token)
            email = Authorize.get_jwt_subject()
        except AuthJWTException:
            raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed_password = pwd_context.hash(reset_data.new_password[:MAX_BCRYPT_PASSWORD_LENGTH])
    update_result = await database.execute(
        User.update().where(User.c.email == email).values(
            hashed_password=hashed_password,
            updatedAt=datetime.utcnow()
        )
    )
    if not update_result:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Password reset successfully. Login with new password."}

@router.get("/profile", response_model=UserOut)
async def profile(Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_required()
        current_user_email = Authorize.get_jwt_subject()
    except AuthJWTException:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db_user = await database.fetch_one(User.select().where(User.c.email == current_user_email))
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserOut(**db_user)

# Test email sending endpoint (for quick manual verification)
@router.get("/test-email")
async def test_email(background_tasks: BackgroundTasks):
    to_email = "rjagathe@gmail.com"  # Replace with real test email
    background_tasks.add_task(send_email, to_email, "Test Email", "This is a test email from Acharya108 LMS")
    return {"message": "Test email sent, check inbox/spam."}
