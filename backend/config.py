import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

    SECRET_KEY = os.getenv("MY_SECRET_KEY")
    SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "Lax")
    SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "True").lower() in ("true", "1", "yes") if os.getenv("FRONTEND_URL", "").startswith("https") else False
    
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")

    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
    # SSL = {"ca", os.getenv("DB_SSL_CERT")}
  
    BREVO_API_KEY = os.getenv("BREVO_API_KEY")
    MAIL_FROM_TITLE = os.getenv("MAIL_FROM_TITLE")
    MAIL_FROM = os.getenv("MAIL_FROM")

    SERVER_NAME = os.getenv("SERVER_NAME") or None
    PREFERRED_URL_SCHEME = os.getenv("PREFERRED_URL_SCHEME", "https" if os.getenv("FRONTEND_URL", "").startswith("https") else "http")