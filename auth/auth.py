from flask import Blueprint, request, jsonify
from email_validator import validate_email, EmailNotValidError
from extension import bcrypt
from db import get_connection

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    fullname = data.get("fullname")
    email = data.get("email")
    password = data.get("password")

    if not fullname or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        validate_email(email)
    except EmailNotValidError as e:
        return jsonify({"success": False, "message": str(e)}), 400

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM Users WHERE email = %s",
            (email, ),
        )

        if cursor.fetchone():
            return jsonify({"success": False, "message": "Email already exists"}), 409
    
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
        
    finally:
        cursor.close()
        conn.close()

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO users (fullname, email, password) VALUES (%s, %s, %s)",
            (fullname, email, hashed_password),
        )

        conn.commit()

        return jsonify({
            "success": True, 
            "message": "User registered successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
    finally:
        if cursor:
            cursor.close()
        if conn: 
            conn.close()

    # print(data)
    # return jsonify({"success": "User registered successfully"}), 201
