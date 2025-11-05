from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Import auth routes
try:
    from api.routes import auth
    app.include_router(auth.router, prefix='/api/auth', tags=['authentication'])
    print('✅ Auth routes loaded')
except Exception as e:
    print(f'⚠️  Could not load auth routes: {e}')

# Import registration routes
try:
    from api.registration import router as registration_router
    app.include_router(registration_router, prefix='/api', tags=['registration'])
    print('✅ Registration routes loaded')
except ImportError as e:
    print(f'⚠️  Could not load registration routes: {e}')