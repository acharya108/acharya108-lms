# backend/api/routes/auth.py
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr        
from prisma import Prisma
import bcrypt

router = APIRouter()

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Dependency to get database connection
async def get_db():
    db = Prisma()
    await db.connect()
    try:
        yield db
    finally:
        await db.disconnect()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister, db: Prisma = Depends(get_db)):
    '''Register new user'''
    try:
        # Check if user already exists
        existing_user = await db.user.find_unique(where={'email': user.email})

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Email already registered'
            )

        # Hash password
        hashed_password = bcrypt.hashpw(        
            user.password.encode('utf-8'),      
            bcrypt.gensalt()
        ).decode('utf-8')

        # Create user
        new_user = await db.user.create(        
            data={
                'email': user.email,
                'name': user.name,
                'phone': user.phone,
                'password': hashed_password,    
                'role': 'student',
                'isConfirmed': False
            }
        )

        print(f'✅ User created: {new_user.email} (ID: {new_user.id})')

        return {
            'success': True,
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'email': new_user.email,        
                'name': new_user.name,
                'role': new_user.role
            }
        }

    except Exception as e:
        print(f'❌ Registration error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Registration failed: {str(e)}'
        )

@router.post('/login')
async def login(credentials: UserLogin, db: Prisma = Depends(get_db)):        
    '''Login user'''
    try:
        # Find user
        user = await db.user.find_unique(where={'email': credentials.email})

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid email or password'
            )

        # Verify password
        if not bcrypt.checkpw(
            credentials.password.encode('utf-8'),
            user.password.encode('utf-8')       
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid email or password'
            )

        return {
            'success': True,
            'message': 'Login successful',      
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role
            }
        }

    except Exception as e:
        print(f'❌ Login error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Login failed'
        )