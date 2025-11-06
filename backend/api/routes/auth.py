from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, validator
from prisma import Prisma
import bcrypt
import jwt
import secrets
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

router = APIRouter()
security = HTTPBearer()

# JWT Configuration
JWT_SECRET = os.getenv('JWT_SECRET', 'your-super-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str
    
    @validator('new_password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    
    @validator('new_password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

# Dependency to get database connection
async def get_db():
    db = Prisma()
    await db.connect()
    try:
        yield db
    finally:
        await db.disconnect()

# JWT Token functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Prisma = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.user.find_unique(where={'id': user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_current_active_user(current_user = Depends(get_current_user)):
    if not current_user.isActive:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Role-based access control
async def require_role(required_role: str, current_user = Depends(get_current_active_user)):
    if current_user.role != required_role and current_user.role != 'admin':
        raise HTTPException(
            status_code=403, 
            detail=f"Require {required_role} role to access this resource"
        )
    return current_user

# Auth routes
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister, background_tasks: BackgroundTasks, db: Prisma = Depends(get_db)):
    '''Register new user with email confirmation'''
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

        # Generate email confirmation token
        confirmation_token = secrets.token_urlsafe(32)

        # Create user
        new_user = await db.user.create(        
            data={
                'email': user.email,
                'name': user.name,
                'phone': user.phone,
                'password': hashed_password,    
                'role': 'student',
                'isConfirmed': False,
                'isActive': True,
                'confirmationToken': confirmation_token
            }
        )

        print(f'✅ User created: {new_user.email} (ID: {new_user.id})')

        # TODO: Send confirmation email in background
        # background_tasks.add_task(send_confirmation_email, new_user.email, confirmation_token)

        return {
            'success': True,
            'message': 'User registered successfully. Please check your email for confirmation.',
            'user': {
                'id': new_user.id,
                'email': new_user.email,        
                'name': new_user.name,
                'role': new_user.role
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Registration error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f'Registration failed: {str(e)}'
        )

@router.post('/login')
async def login(credentials: UserLogin, db: Prisma = Depends(get_db)):        
    '''Login user and return JWT token'''
    try:
        # Find user
        user = await db.user.find_unique(where={'email': credentials.email})

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Invalid email or password'
            )

        if not user.isActive:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Account is deactivated'
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

        # Create JWT token
        access_token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role}
        )

        return {
            'success': True,
            'message': 'Login successful',      
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'isConfirmed': user.isConfirmed
            },
            'token': access_token,
            'token_type': 'bearer'
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Login error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Login failed'
        )

@router.post('/confirm-email')
async def confirm_email(token: str, db: Prisma = Depends(get_db)):
    '''Confirm user email with token'''
    try:
        user = await db.user.find_first(where={'confirmationToken': token})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Invalid confirmation token'
            )
        
        if user.isConfirmed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Email already confirmed'
            )
        
        # Update user as confirmed
        await db.user.update(
            where={'id': user.id},
            data={
                'isConfirmed': True,
                'confirmationToken': None
            }
        )
        
        return {
            'success': True,
            'message': 'Email confirmed successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Email confirmation error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Email confirmation failed'
        )

@router.post('/resend-confirmation')
async def resend_confirmation(email: str, background_tasks: BackgroundTasks, db: Prisma = Depends(get_db)):
    '''Resend email confirmation'''
    try:
        user = await db.user.find_unique(where={'email': email})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='User not found'
            )
        
        if user.isConfirmed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Email already confirmed'
            )
        
        # Generate new confirmation token
        new_token = secrets.token_urlsafe(32)
        await db.user.update(
            where={'id': user.id},
            data={'confirmationToken': new_token}
        )
        
        # TODO: Resend confirmation email
        # background_tasks.add_task(send_confirmation_email, user.email, new_token)
        
        return {
            'success': True,
            'message': 'Confirmation email sent successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Resend confirmation error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Failed to resend confirmation'
        )

@router.post('/forgot-password')
async def forgot_password(request: PasswordResetRequest, background_tasks: BackgroundTasks, db: Prisma = Depends(get_db)):
    '''Request password reset'''
    try:
        user = await db.user.find_unique(where={'email': request.email})
        
        if user:
            # Generate reset token
            reset_token = secrets.token_urlsafe(32)
            reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
            
            await db.user.update(
                where={'id': user.id},
                data={
                    'resetToken': reset_token,
                    'resetTokenExpiry': reset_token_expiry
                }
            )
            
            # TODO: Send password reset email
            # background_tasks.add_task(send_password_reset_email, user.email, reset_token)
        
        # Always return success to prevent email enumeration
        return {
            'success': True,
            'message': 'If the email exists, a password reset link has been sent'
        }
        
    except Exception as e:
        print(f'❌ Forgot password error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Failed to process password reset request'
        )

@router.post('/reset-password')
async def reset_password(request: PasswordResetConfirm, db: Prisma = Depends(get_db)):
    '''Reset password with token'''
    try:
        user = await db.user.find_first(where={
            'resetToken': request.token,
            'resetTokenExpiry': {'gte': datetime.utcnow()}
        })
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Invalid or expired reset token'
            )
        
        # Hash new password
        hashed_password = bcrypt.hashpw(
            request.new_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Update password and clear reset token
        await db.user.update(
            where={'id': user.id},
            data={
                'password': hashed_password,
                'resetToken': None,
                'resetTokenExpiry': None
            }
        )
        
        return {
            'success': True,
            'message': 'Password reset successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Reset password error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Failed to reset password'
        )

@router.post('/change-password')
async def change_password(request: ChangePassword, current_user = Depends(get_current_active_user), db: Prisma = Depends(get_db)):
    '''Change password for authenticated user'''
    try:
        # Verify current password
        if not bcrypt.checkpw(
            request.current_password.encode('utf-8'),
            current_user.password.encode('utf-8')
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Current password is incorrect'
            )
        
        # Hash new password
        hashed_password = bcrypt.hashpw(
            request.new_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Update password
        await db.user.update(
            where={'id': current_user.id},
            data={'password': hashed_password}
        )
        
        return {
            'success': True,
            'message': 'Password changed successfully'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Change password error: {e}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Failed to change password'
        )

@router.get('/me')
async def get_current_user_profile(current_user = Depends(get_current_active_user)):
    '''Get current user profile'''
    return {
        'success': True,
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'name': current_user.name,
            'phone': current_user.phone,
            'role': current_user.role,
            'isConfirmed': current_user.isConfirmed,
            'createdAt': current_user.createdAt,
            'updatedAt': current_user.updatedAt
        }
    }