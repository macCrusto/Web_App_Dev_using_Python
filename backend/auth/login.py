from flask import request, jsonify
from flask_jwt_extended import create_access_token
from . import auth_bp
from extension import bcrypt
from db import get_connection

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

    conn = None
    cursor = None

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
            FROM Users
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
