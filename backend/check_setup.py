# check_setup.py
try:
    import uvicorn
    print("✅ uvicorn installed")
except ImportError:
    print("❌ uvicorn not installed")

try:
    import fastapi
    print("✅ fastapi installed") 
except ImportError:
    print("❌ fastapi not installed")

try:
    import asyncpg
    print("✅ asyncpg installed")
except ImportError:
    print("❌ asyncpg not installed")