import os
import smtplib
from email.message import EmailMessage
import logging
from dotenv import load_dotenv
load_dotenv()


# Load .env file variables
load_dotenv()

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def send_email(to_email: str, subject: str, body: str):
    print("DEBUG: send_email function invoked")

    logger.info(f"send_email called with: to={to_email}, subject={subject}")
    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg["Subject"] = subject
        msg["From"] = os.getenv(""EMAIL_FROM"")
        msg["To"] = to_email

        smtp_host = os.getenv("SMTP_HOST")
        print(f"DEBUG: SMTP_HOST = {os.getenv('SMTP_HOST')}")

        smtp_port = int(os.getenv("SMTP_PORT"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")

        logger.info(f"Connecting to SMTP server {smtp_host}:{smtp_port}")
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.set_debuglevel(1)  # Show SMTP protocol output in logs
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        logger.info(f"Email successfully sent to {to_email}")
    except Exception as e:
        logger.error(f"Error sending email to {to_email}: {e}")
        raise
