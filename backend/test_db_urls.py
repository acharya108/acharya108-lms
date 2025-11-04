import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

print("=" * 70)
print("?? TESTING DATABASE CONFIGURATION")
print("=" * 70)
print()

# Test each database URL
db_configs = {
    'DATABASE_URL': 'Prisma ORM (pooled)',
    'DATABASE_URL_UNPOOLED': 'Prisma Migrations (direct)',
    'DATABASE_URL_ASYNC': 'AsyncPG Driver',
    'DATABASE_URL_SYNC': 'Alembic/Sync SQLAlchemy'
}

all_ok = True

for var_name, description in db_configs.items():
    value = os.getenv(var_name)
    if value:
        # Show first 60 chars (includes protocol and host)
        preview = value[:60] + '...' if len(value) > 60 else value
        print(f'? {var_name}')
        print(f'   Purpose: {description}')
        print(f'   Value: {preview}')
        print()
    else:
        print(f'? {var_name}')
        print(f'   Purpose: {description}')
        print(f'   Status: NOT SET')
        print()
        all_ok = False

print("=" * 70)
if all_ok:
    print("? SUCCESS: All database URLs are configured!")
else:
    print("? ERROR: Some database URLs are missing!")
    print("   Please check your .env file in backend/ directory")
print("=" * 70)
