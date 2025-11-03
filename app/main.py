from fastapi import FastAPI
from app.database import database
from app.routes import auth, user
import logging
from fastapi.middleware.cors import CORSMiddleware
logging.basicConfig(level=logging.DEBUG)

app = FastAPI()
print("=== DEBUG: Loading routers ===")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.acharya108.com"],  # frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
print("=== DEBUG: Auth router loaded successfully (endpoints: test-email, register, etc.) ===")
app.include_router(user.router, prefix="/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "Acharya108 LMS backend is running!"}
