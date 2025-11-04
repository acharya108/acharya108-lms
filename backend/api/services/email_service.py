# backend/api/services/email_service.py

import os
import smtplib
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def send_email(
    to_email: str, 
    subject: str, 
    body: str,
    html: bool = False,
    cc: Optional[List[str]] = None,
    bcc: Optional[List[str]] = None
):
    """
    Send email via SMTP (Gmail)
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        body: Email body (plain text or HTML)
        html: If True, body is treated as HTML
        cc: List of CC recipients (optional)
        bcc: List of BCC recipients (optional)
    
    Raises:
        Exception: If email sending fails
    """
    logger.info(f"send_email called with: to={to_email}, subject={subject}")
    
    try:
        # Get SMTP configuration
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")
        email_from = os.getenv("EMAIL_FROM") or os.getenv("SMTP_FROM_EMAIL") or smtp_user
        from_name = os.getenv("SMTP_FROM_NAME", "Acharya108 LMS")
        
        # Validate required settings
        if not all([smtp_host, smtp_port, smtp_user, smtp_password]):
            raise ValueError("Missing SMTP configuration. Check environment variables.")
        
        # Create message
        if html:
            msg = MIMEMultipart('alternative')
            msg.attach(MIMEText(body, 'html'))
        else:
            msg = EmailMessage()
            msg.set_content(body)
        
        # Set headers
        msg["Subject"] = subject
        msg["From"] = f"{from_name} <{email_from}>"
        msg["To"] = to_email
        
        if cc:
            msg["Cc"] = ", ".join(cc)
        if bcc:
            msg["Bcc"] = ", ".join(bcc)
        
        # Send email
        logger.info(f"Connecting to SMTP server {smtp_host}:{smtp_port}")
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            if os.getenv("DEBUG", "False").lower() == "true":
                server.set_debuglevel(1)  # Show SMTP protocol output
            
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        logger.info(f"✅ Email successfully sent to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error sending email to {to_email}: {e}")
        raise


async def send_registration_email(to_email: str, name: str):
    """Send welcome email after user registration"""
    subject = "Welcome to Acharya108 LMS!"
    
    # Plain text version
    body_text = f"""
Dear {name},

Welcome to Acharya108 LMS! Your account has been created successfully.

You can now log in and start your learning journey with our multi-level curriculum designed to help you excel in your studies.

Features available to you:
- Board-specific content (TN State Board, CBSE, ICSE, etc.)
- 5 levels of difficulty (Basic to Expert)
- AI-powered answer evaluation
- Interactive lessons with videos and animations
- Progress tracking and daily reports

If you have any questions, please don't hesitate to contact us.

Best regards,
Acharya108 LMS Team

---
This is an automated message. Please do not reply to this email.
    """
    
    # HTML version (optional)
    body_html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #007bff; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .features {{ background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Acharya108 LMS!</h1>
        </div>
        <div class="content">
            <p>Dear <strong>{name}</strong>,</p>
            <p>Welcome to Acharya108 LMS! Your account has been created successfully.</p>
            <p>You can now log in and start your learning journey with our multi-level curriculum designed to help you excel in your studies.</p>
            
            <div class="features">
                <h3>Features available to you:</h3>
                <ul>
                    <li>📚 Board-specific content (TN State Board, CBSE, ICSE, etc.)</li>
                    <li>📊 5 levels of difficulty (Basic to Expert)</li>
                    <li>🤖 AI-powered answer evaluation</li>
                    <li>🎬 Interactive lessons with videos and animations</li>
                    <li>📈 Progress tracking and daily reports</li>
                </ul>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br><strong>Acharya108 LMS Team</strong></p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
    """
    
    try:
        await send_email(to_email, subject, body_html, html=True)
        return True
    except Exception as e:
        logger.error(f"Failed to send registration email: {e}")
        # Try plain text fallback
        try:
            await send_email(to_email, subject, body_text, html=False)
            return True
        except:
            return False


async def send_password_reset_email(to_email: str, reset_token: str, reset_url: str):
    """Send password reset email"""
    subject = "Password Reset Request - Acharya108 LMS"
    
    body = f"""
Dear User,

We received a request to reset your password for your Acharya108 LMS account.

Click the link below to reset your password:
{reset_url}?token={reset_token}

This link will expire in 1 hour.

If you did not request a password reset, please ignore this email.

Best regards,
Acharya108 LMS Team
    """
    
    try:
        await send_email(to_email, subject, body)
        return True
    except:
        return False


async def send_daily_report_email(to_email: str, name: str, report_data: dict):
    """Send daily progress report to student"""
    subject = f"Daily Progress Report - {report_data.get('date', 'Today')}"
    
    body = f"""
Dear {name},

Here's your daily learning progress report:

📊 Summary:
- Questions Attempted: {report_data.get('questions_attempted', 0)}
- Average Score: {report_data.get('average_score', 0):.1f}%
- Time Spent: {report_data.get('time_spent', 0)} minutes

🎯 Level Distribution:
- Basic: {report_data.get('level_distribution', {}).get('1', 0)} questions
- Elementary: {report_data.get('level_distribution', {}).get('2', 0)} questions
- Intermediate: {report_data.get('level_distribution', {}).get('3', 0)} questions
- Advanced: {report_data.get('level_distribution', {}).get('4', 0)} questions
- Expert: {report_data.get('level_distribution', {}).get('5', 0)} questions

Keep up the great work! 🌟

Best regards,
Acharya108 LMS Team
    """
    
    try:
        await send_email(to_email, subject, body)
        return True
    except:
        return False


# Initialize and test connection (optional)
async def test_email_connection():
    """Test SMTP connection and configuration"""
    try:
        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
        
        logger.info("✅ Email service connection test successful")
        return True
    except Exception as e:
        logger.error(f"❌ Email service connection test failed: {e}")
        return False