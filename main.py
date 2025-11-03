from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from databases import Database
from dotenv import load_dotenv
import os
from app.routes import auth  # Adjust based on your file structure
load_dotenv()  # loads environment variables from a .env file into os.environ


# Replace this with your neonDB connection string from your neon dashboard
DATABASE_URL = os.getenv("DATABASE_URL")

database = Database(DATABASE_URL)
app = FastAPI()
app.include_router(auth.router)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class UserIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

async def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_password_hash(password):
    return pwd_context.hash(password)

async def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/api/auth/register", response_model=UserOut)
async def register(user: UserIn):
    query = "SELECT * FROM users WHERE email = :email"
    existing_user = await database.fetch_one(query=query, values={"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = await get_password_hash(user.password)
    query = "INSERT INTO users(email, hashed_password) VALUES(:email, :hashed_password)"
    await database.execute(query=query, values={"email": user.email, "hashed_password": hashed_password})
    return {"email": user.email}

@app.post("/api/auth/login", response_model=Token)
async def login(user: UserIn):
    query = "SELECT * FROM users WHERE email = :email"
    db_user = await database.fetch_one(query=query, values={"email": user.email})
    if not db_user or not await verify_password(user.password, db_user['hashed_password']):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = await create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
