from pydantic import BaseModel, constr

from pydantic import BaseModel, EmailStr, ConfigDict

class UserCreate(BaseModel):
    full_name: str
    phone: constr(regex=r"^\+\d{1,4}\d{6,15}$")  # Regex to ensure starts with '+' followed by digits
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    full_name: str
    phone: str
    email: EmailStr

    class Config:
        model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
