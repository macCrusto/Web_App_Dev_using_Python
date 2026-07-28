from flask_mail import Message
from extension import mail
from config import Config

def send_verification_email(email, fullname, verification_link):
    try:
        msg = Message(
            subject="Verify your email",
            sender=Config.MAIL_USERNAME,
            recipients=[email],
        )
        msg.body = f"""
        Hello {fullname},

        Thanks for signing up to our service. Please click on the link below to verify your email.

        {verification_link}

        If you didn't register, please ignore this email.

        Regards,
        The Team
        """

        mail.send(msg)
        return "Email sent successfully!"
        
    except Exception as e:
        return f"Failed to send email: {str(e)}"