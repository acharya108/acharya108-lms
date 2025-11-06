from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from prisma import Prisma
from typing import Optional
from .auth import get_current_active_user, require_role

router = APIRouter()

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

# Dependency to get database connection
async def get_db():
    db = Prisma()
    await db.connect()
    try:
        yield db
    finally:
        await db.disconnect()

@router.get('/profile')
async def get_user_profile(current_user = Depends(get_current_active_user)):
    '''Get user profile'''
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

@router.put('/profile')
async def update_user_profile(
    user_data: UserUpdate, 
    current_user = Depends(get_current_active_user), 
    db: Prisma = Depends(get_db)
):
    '''Update user profile'''
    try:
        update_data = {}
        if user_data.name is not None:
            update_data['name'] = user_data.name
        if user_data.phone is not None:
            update_data['phone'] = user_data.phone
        if user_data.email is not None and user_data.email != current_user.email:
            # Check if email is already taken
            existing_user = await db.user.find_unique(where={'email': user_data.email})
            if existing_user:
                raise HTTPException(status_code=400, detail='Email already registered')
            update_data['email'] = user_data.email
            update_data['isConfirmed'] = False  # Require re-confirmation if email changed
        
        if not update_data:
            raise HTTPException(status_code=400, detail='No data to update')
        
        updated_user = await db.user.update(
            where={'id': current_user.id},
            data=update_data
        )
        
        return {
            'success': True,
            'message': 'Profile updated successfully',
            'user': {
                'id': updated_user.id,
                'email': updated_user.email,
                'name': updated_user.name,
                'phone': updated_user.phone,
                'role': updated_user.role,
                'isConfirmed': updated_user.isConfirmed
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Profile update error: {e}')
        raise HTTPException(status_code=500, detail='Failed to update profile')

@router.get('/admin/users')
async def get_all_users(
    current_user = Depends(lambda: require_role('admin')), 
    db: Prisma = Depends(get_db)
):
    '''Get all users (admin only)'''
    try:
        users = await db.user.find_many()
        
        return {
            'success': True,
            'users': [
                {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'role': user.role,
                    'isConfirmed': user.isConfirmed,
                    'isActive': user.isActive,
                    'createdAt': user.createdAt
                } for user in users
            ]
        }
        
    except Exception as e:
        print(f'❌ Get users error: {e}')
        raise HTTPException(status_code=500, detail='Failed to fetch users')

@router.put('/admin/users/{user_id}/role')
async def update_user_role(
    user_id: str,
    role: str,
    current_user = Depends(lambda: require_role('admin')), 
    db: Prisma = Depends(get_db)
):
    '''Update user role (admin only)'''
    try:
        valid_roles = ['student', 'teacher', 'admin']
        if role not in valid_roles:
            raise HTTPException(status_code=400, detail=f'Role must be one of: {", ".join(valid_roles)}')
        
        user = await db.user.find_unique(where={'id': user_id})
        if not user:
            raise HTTPException(status_code=404, detail='User not found')
        
        updated_user = await db.user.update(
            where={'id': user_id},
            data={'role': role}
        )
        
        return {
            'success': True,
            'message': f'User role updated to {role}',
            'user': {
                'id': updated_user.id,
                'email': updated_user.email,
                'name': updated_user.name,
                'role': updated_user.role
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f'❌ Update user role error: {e}')
        raise HTTPException(status_code=500, detail='Failed to update user role')