from fastapi import FastAPI
from app.database import database
from app.routes import auth, user

app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "Acharya108 LMS backend is running!"}
