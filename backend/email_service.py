from flask_mail import Message
from extension import mail

def send_verification_email(email, fullname, verification_link):
    msg = Message(
        subject="Verify your email",
        recipients=[email],
    )
    msg.body = {"""
    Hello {fullname},

    Thanks for signing up to our service. Please click on the link below to verify your email.

    {verification_link}

    If you didn't register, please ignore this email.

    Regards,
    The Team
    """}

    mail.send(msg)