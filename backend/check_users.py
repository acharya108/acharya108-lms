# check_users.py
from prisma import Prisma
import asyncio

async def check_users():
    db = Prisma()
    await db.connect()
    
    users = await db.user.find_many()
    print(f"📊 Total users: {len(users)}")
    
    for user in users:
        print(f"👤 {user.email} (ID: {user.id}, Role: {user.role})")
    
    await db.disconnect()

asyncio.run(check_users())