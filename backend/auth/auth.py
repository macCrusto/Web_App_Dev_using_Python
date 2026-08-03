from flask import Blueprint, request, jsonify, current_app, redirect
from flask_jwt_extended import create_access_token
from email_validator import validate_email, EmailNotValidError
from email_service import send_verification_email
from extension import bcrypt
from db import get_connection
from config import Config
import secrets

auth_bp = Blueprint("auth", __name__)

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
        <br>
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



@auth_bp.route("/verify-email/<token>", methods=["GET"])
def verify_email(token):
    if not token:
        return jsonify({
            "success": False,
            "message": "Page not found"
        }), 404

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM Users WHERE verification_token=%s",
            (token),
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid verification link."
            }), 400
    
        cursor.execute(
            "UPDATE Users SET is_verified = TRUE, verification_token = NULL WHERE id=%s", 
            (user["id"]),
        )

        conn.commit()

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()

    return redirect(f"{Config.FRONTEND_URL}/login?verified=true", code=303)

@auth_bp.route("/home", methods=["GET"])
def home():
    return "Flask is running!"

@auth_bp.route("/user", methods=["GET"])
def user():
    return jsonify({"success": True, "name": "HY Devinton", "skill": "Software Engineer"}), 200



@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id,
                   fullname,
                   email,
                   password,
                   role,
                   is_verified
            FROM users
            WHERE email=%s
        """, (email,))

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        if not bcrypt.check_password_hash(user["password"], password):
            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401

        if not user["is_verified"]:
            return jsonify({
                "success": False,
                "message": "Please verify your email before logging in."
            }), 403

        access_token = create_access_token(
            identity=str(user["id"]),
            additional_claims={
                "role": user["role"],
                "email": user["email"]
            }
        )

        return jsonify({
            "success": True,
            "message": "Login successful.",
            "access_token": access_token,
            "user": {
                "id": user["id"],
                "fullname": user["fullname"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    finally:
        cursor.close()
        conn.close()