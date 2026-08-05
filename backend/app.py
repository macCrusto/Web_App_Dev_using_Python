from flask import Flask #type: ignore
from flask_cors import CORS
from extension import bcrypt, jwt
from auth import auth_bp
from config import Config

app = Flask(__name__)
CORS(app, origins=[Config.FRONTEND_URL], supports_credentials=True)
app.config.from_object(Config)

app.config["BREVO_API_KEY"] = Config.BREVO_API_KEY
app.config["MAIL_FROM"] = Config.MAIL_FROM
app.config["MAIL_FROM_TITLE"] = Config.MAIL_FROM_TITLE

bcrypt.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)