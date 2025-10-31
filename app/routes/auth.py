from fastapi import APIRouter, HTTPException, Depends, status
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from starlette.requests import Request

from app.schemas import UserCreate, UserLogin, TokenResponse
from app.models import User
from app.database import database

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@AuthJWT.load_config
def get_config():
    from pydantic import BaseModel
    import os

    class Settings(BaseModel):
        authjwt_secret_key: str = os.getenv("JWT_SECRET")

    return Settings()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    query = User.select().where(User.c.email == user.email)
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    query = User.insert().values(
        full_name=user.full_name,
        phone=user.phone,
        email=user.email,
        hashed_password=hashed_password,
        is_active=True,
        is_verified=False,
    )
    await database.execute(query)
    return {"message": "User registered successfully. Please verify your email."}

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin, Authorize: AuthJWT = Depends()):
    query = User.select().where(User.c.email == user.email)
    db_user = await database.fetch_one(query)
    if not db_user or not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = Authorize.create_access_token(subject=db_user["email"])
    return {"access_token": access_token}

@router.get("/profile", response_model=UserCreate)
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

    return db_user
