from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from prisma import Prisma
import httpx
import secrets
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from .auth import create_access_token

load_dotenv()

router = APIRouter()

# OAuth2 Configuration
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GITHUB_CLIENT_ID = os.getenv('GITHUB_CLIENT_ID')
GITHUB_CLIENT_SECRET = os.getenv('GITHUB_CLIENT_SECRET')

class SocialLoginRequest(BaseModel):
    code: str
    redirect_uri: str

# Dependency to get database connection
async def get_db():
    db = Prisma()
    await db.connect()
    try:
        yield db
    finally:
        await db.disconnect()

@router.get("/google")
async def google_login():
    '''Initiate Google OAuth2 login'''
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        "?response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}"
        "&scope=openid%20email%20profile"
        "&access_type=offline"
        "&prompt=consent"
        "&redirect_uri=http://localhost:8000/api/auth/google/callback"
    )
    
    return RedirectResponse(auth_url)

@router.get("/google/callback")
async def google_callback(code: str, db: Prisma = Depends(get_db)):
    '''Google OAuth2 callback'''
    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    'code': code,
                    'client_id': GOOGLE_CLIENT_ID,
                    'client_secret': GOOGLE_CLIENT_SECRET,
                    'redirect_uri': 'http://localhost:8000/api/auth/google/callback',
                    'grant_type': 'authorization_code'
                }
            )
            
            tokens = token_response.json()
            
            if 'error' in tokens:
                raise HTTPException(status_code=400, detail=tokens['error'])
            
            # Get user info
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={'Authorization': f"Bearer {tokens['access_token']}"}
            )
            
            user_info = user_response.json()
            
        # Find or create user
        user = await db.user.find_unique(where={'email': user_info['email']})
        
        if not user:
            # Create new user
            user = await db.user.create({
                'email': user_info['email'],
                'name': user_info.get('name', user_info['email'].split('@')[0]),
                'password': secrets.token_urlsafe(32),  # Random password for social login
                'role': 'student',
                'isConfirmed': True,  # Social logins are automatically confirmed
                'isActive': True
            })
        
        # Create JWT token
        access_token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role}
        )
        
        # Redirect to frontend with token
        frontend_url = f"http://localhost:3000/auth/success?token={access_token}"
        return RedirectResponse(frontend_url)
        
    except Exception as e:
        print(f'❌ Google OAuth error: {e}')
        raise HTTPException(status_code=500, detail='Google login failed')

@router.get("/github")
async def github_login():
    '''Initiate GitHub OAuth2 login'''
    if not GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")
    
    auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        "&scope=user:email"
        "&redirect_uri=http://localhost:8000/api/auth/github/callback"
    )
    
    return RedirectResponse(auth_url)

@router.get("/github/callback")
async def github_callback(code: str, db: Prisma = Depends(get_db)):
    '''GitHub OAuth2 callback'''
    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                data={
                    'code': code,
                    'client_id': GITHUB_CLIENT_ID,
                    'client_secret': GITHUB_CLIENT_SECRET,
                    'redirect_uri': 'http://localhost:8000/api/auth/github/callback'
                },
                headers={'Accept': 'application/json'}
            )
            
            tokens = token_response.json()
            
            if 'error' in tokens:
                raise HTTPException(status_code=400, detail=tokens['error'])
            
            # Get user info
            user_response = await client.get(
                "https://api.github.com/user",
                headers={'Authorization': f"Bearer {tokens['access_token']}"}
            )
            
            user_info = user_response.json()
            
            # Get user email
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={'Authorization': f"Bearer {tokens['access_token']}"}
            )
            
            emails = email_response.json()
            primary_email = next((email['email'] for email in emails if email['primary']), None)
            
        if not primary_email:
            raise HTTPException(status_code=400, detail="Could not retrieve email from GitHub")
        
        # Find or create user
        user = await db.user.find_unique(where={'email': primary_email})
        
        if not user:
            # Create new user
            user = await db.user.create({
                'email': primary_email,
                'name': user_info.get('name', user_info.get('login', primary_email.split('@')[0])),
                'password': secrets.token_urlsafe(32),
                'role': 'student',
                'isConfirmed': True,
                'isActive': True
            })
        
        # Create JWT token
        access_token = create_access_token(
            data={"sub": user.id, "email": user.email, "role": user.role}
        )
        
        # Redirect to frontend with token
        frontend_url = f"http://localhost:3000/auth/success?token={access_token}"
        return RedirectResponse(frontend_url)
        
    except Exception as e:
        print(f'❌ GitHub OAuth error: {e}')
        raise HTTPException(status_code=500, detail='GitHub login failed')