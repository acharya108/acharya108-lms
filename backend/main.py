from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Acharya108 LMS API",
    description="Learning Management System Backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth models
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str
    role: str = "teacher"

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

# Mock user database (replace with real database later)
mock_users_db = {
    "test@example.com": {
        "id": "1",
        "email": "test@example.com",
        "password": "password123",
        "name": "Test Teacher",
        "role": "teacher"
    },
    "rjagathe@drillmasters.in": {
        "id": "2", 
        "email": "rjagathe@drillmasters.in",
        "password": "password123",
        "name": "R Jagathe",
        "role": "teacher"
    }
}

# Routes
@app.get("/")
async def root():
    return {"message": "Acharya108 LMS API is running!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Acharya108 LMS API"}

@app.post("/api/auth/login")
async def login(user: UserLogin):
    # Check if user exists and password matches
    if user.email in mock_users_db and mock_users_db[user.email]["password"] == user.password:
        user_data = mock_users_db[user.email]
        return {
            "success": True,
            "message": "Login successful",
            "token": f"mock_jwt_token_{user_data['id']}",
            "user": {
                "id": user_data["id"],
                "email": user_data["email"],
                "name": user_data["name"],
                "role": user_data["role"]
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")

@app.post("/api/auth/register")
async def register(user: UserRegister):
    # Check if user already exists
    if user.email in mock_users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user (in real app, save to database)
    new_user_id = str(len(mock_users_db) + 1)
    mock_users_db[user.email] = {
        "id": new_user_id,
        "email": user.email,
        "password": user.password,
        "name": user.name,
        "role": user.role
    }
    
    return {
        "success": True,
        "message": "User registered successfully",
        "user_id": new_user_id,
        "user": {
            "id": new_user_id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }

@app.get("/api/users/me")
async def get_current_user(token: str = Depends(lambda: "mock")):
    # Mock implementation - in real app, verify JWT token
    return mock_users_db["test@example.com"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
