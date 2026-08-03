import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("MY_SECRET_KEY")
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT"))
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")
    # SSL = {"ca", os.getenv("DB_SSL_CERT")}
  
    BREVO_API_KEY = os.getenv("BREVO_API_KEY")
    MAIL_FROM_TITLE = os.getenv("MAIL_FROM_TITLE")
    MAIL_FROM = os.getenv("MAIL_FROM")