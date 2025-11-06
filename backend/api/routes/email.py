from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

async def send_email(to: str, subject: str, body: str):
    '''Send email using SMTP'''
    try:
        if not all([EMAIL_USER, EMAIL_PASSWORD]):
            print('⚠️ Email credentials not configured')
            return False
            
        message = MIMEMultipart()
        message['From'] = EMAIL_USER
        message['To'] = to
        message['Subject'] = subject
        
        message.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(message)
        
        print(f'✅ Email sent to: {to}')
        return True
        
    except Exception as e:
        print(f'❌ Email sending failed: {e}')
        return False

async def send_confirmation_email(email: str, confirmation_token: str):
    '''Send email confirmation email'''
    subject = "Confirm Your Email - Acharya108 LMS"
    confirmation_url = f"http://localhost:3000/confirm-email?token={confirmation_token}"
    
    body = f"""
    <html>
    <body>
        <h2>Welcome to Acharya108 LMS!</h2>
        <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
        <p><a href="{confirmation_url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirm Email</a></p>
        <p>Or copy this link: {confirmation_url}</p>
        <p>This link will expire in 24 hours.</p>
        <br>
        <p>Best regards,<br>Acharya108 LMS Team</p>
    </body>
    </html>
    """
    
    return await send_email(email, subject, body)

async def send_password_reset_email(email: str, reset_token: str):
    '''Send password reset email'''
    subject = "Reset Your Password - Acharya108 LMS"
    reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
    
    body = f"""
    <html>
    <body>
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p><a href="{reset_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>Or copy this link: {reset_url}</p>
        <p>This link will expire in 1 hour.</p>
        <br>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Acharya108 LMS Team</p>
    </body>
    </html>
    """
    
    return await send_email(email, subject, body)

@router.post("/send")
async def send_custom_email(request: EmailRequest, background_tasks: BackgroundTasks):
    '''Send custom email'''
    background_tasks.add_task(send_email, request.to, request.subject, request.body)
    
    return {
        'success': True,
        'message': 'Email queued for sending'
    }