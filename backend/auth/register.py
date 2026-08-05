from flask import request, jsonify, current_app
from . import auth_bp
from email_validator import validate_email, EmailNotValidError
from email_service import send_verification_email
from extension import bcrypt
from db import get_connection
from config import Config
import secrets

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    fullname = data.get("fullname")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "USER").upper()

    if role not in ["USER", "ADMIN"]:
        return jsonify({"success": False, "message": "Invalid role"}), 400

    if not role:
        role = "USER"

    if not fullname or not email or not password:
        return jsonify({"success": False, "message": "All fields are required"}), 400
    
    try:
        validate_email(email)
    except EmailNotValidError as e:
        return jsonify({"success": False, "message": str(e)}), 400

    conn = None
    cursor = None
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
            "SELECT id FROM Users WHERE email = %s",
            (email, ),
        )

    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"success": False, "message": "Email already exists"}), 409


    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters long"}), 400

    
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    verification_token = secrets.token_urlsafe(32)
    

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO Users (fullname, email, password, role, verification_token) VALUES (%s, %s, %s, %s, %s)",
            (fullname, email, hashed_password, role, verification_token),
        )

        verification_link = (f"{Config.FRONTEND_URL}/verify-email/{verification_token}")

        html = f"""<h2>Welcome to Deep Sky, {fullname}!</h2>
        <p>Click the link below to verify your email:</p>
        <p><a href='{verification_link}'>Verify Email</a></p>"""

        try:
            send_verification_email(email, "Verify Your Email", html)
        except Exception as e:
            current_app.logger.error(f"Failed to send verification email: {e}")
            return jsonify({
                "success": True,
                "message": "User not registered as verification email could not be sent."
            }), 500

        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "User registered successfully and verification email has been sent."
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()
