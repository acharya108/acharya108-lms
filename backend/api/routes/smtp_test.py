import smtplib
from email.message import EmailMessage

def test_smtp_send():
    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "rjagathe@drillmasters.in"         # Replace with your email
    smtp_password = "mdrohzsssdykyvya"        # Replace with your app password

    to_email = "rjagathe@gmail.com"     # Replace with recipient email

    msg = EmailMessage()
    msg.set_content("This is a test email sent from standalone SMTP test script.")
    msg["Subject"] = "SMTP Test Email"
    msg["From"] = smtp_user
    msg["To"] = to_email

    try:
        print("Connecting to SMTP server...")
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.set_debuglevel(1)    # Enable SMTP debug output
            server.starttls()
            print("Logging in...")
            server.login(smtp_user, smtp_password)
            print("Sending email...")
            server.send_message(msg)
            print("Email sent successfully!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_smtp_send()
