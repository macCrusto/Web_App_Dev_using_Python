from flask import Flask
from flask_cors import CORS
from extension import bcrypt, jwt, oauth
from auth import auth_bp
from config import Config
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
CORS(app, origins=[Config.FRONTEND_URL], supports_credentials=True)
app.config.from_object(Config)

app.config["SERVER_NAME"] = Config.SERVER_NAME
app.config["PREFERRED_URL_SCHEME"] = Config.PREFERRED_URL_SCHEME
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1)

app.config["BREVO_API_KEY"] = Config.BREVO_API_KEY
app.config["MAIL_FROM"] = Config.MAIL_FROM
app.config["MAIL_FROM_TITLE"] = Config.MAIL_FROM_TITLE

bcrypt.init_app(app)
jwt.init_app(app)
oauth.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)