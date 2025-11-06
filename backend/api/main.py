from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from prisma import Prisma
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title='Acharya108 LMS API',
    description='Learning Management System Backend',
    version='1.0.0'
)

# CORS
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Security
security = HTTPBearer()

# Database - single instance
db = Prisma()

@app.on_event('startup')
async def startup():
    try:
        await db.connect()
        print('✅ Database connected successfully')
    except Exception as e:
        print(f'❌ Database connection failed: {e}')

@app.on_event('shutdown')
async def shutdown():
    await db.disconnect()
    print('✅ Database disconnected')

@app.get('/')
async def root():
    return {'message': 'Acharya108 LMS API is running!'}

@app.get('/health')
async def health():
    return {
        'status': 'healthy',
        'database': db.is_connected()
    }

# Import all routes
try:
    from api.routes import auth, users, email, social_auth
    app.include_router(auth.router, prefix='/api/auth', tags=['authentication'])
    app.include_router(users.router, prefix='/api/users', tags=['users'])
    app.include_router(email.router, prefix='/api/email', tags=['email'])
    app.include_router(social_auth.router, prefix='/api/auth', tags=['social-auth'])
    print('✅ All routes loaded successfully')
except Exception as e:
    print(f'⚠️  Could not load some routes: {e}')