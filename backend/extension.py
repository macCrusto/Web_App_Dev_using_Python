from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth

bcrypt = Bcrypt()
jwt = JWTManager()
oauth = OAuth()