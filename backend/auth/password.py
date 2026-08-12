from flask import request, jsonify
from flask_jwt_extended import create_access_token, decode_token
from datetime import timedelta
from . import auth_bp
from email_service import send_verification_email
from extension import bcrypt
from db import get_connection
from config import Config

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    reset_claims = {"action": "password_reset"}

    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required"
        }), 400

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, fullname, email
            FROM Users
            WHERE email=%s
        """, (email,))

        user = cursor.fetchone()
        if not user:
            return jsonify({
                "success": False,
                "message": "Email not found"
            }), 404

        # Generate a password reset token
        reset_token = create_access_token(
            identity=str(user["id"]),
            additional_claims=reset_claims,
            expires_delta=timedelta(minutes=30)
        )

        # Send the reset link via email
        reset_link = f"{Config.FRONTEND_URL}api/auth/reset-password/{reset_token}"

        html = f"""
        <p>Hi {user["fullname"]},</p>
        <p> Go <a href="{reset_link}">here</a> to reset your password. </p>
        """

        send_verification_email(user["email"], "Password Reset", html)

        return jsonify({
            "success": True,
            "message": "Password reset link sent to your email."
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()



@auth_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json()
    new_password = data.get("password")

    if not new_password or len(new_password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters long."
        }), 400

    conn = None
    cursor = None

    try:
        # 1. Decode and validate the JWT token
        decoded = decode_token(token)
        user_id = decoded.get("sub")    # the identity we stored as string
        token_iat = decoded.get("iat") # iat stands for 'issued at'

        if not user_id:
            return jsonify({
                "success": False,
                "message": "Invalid token payload."
            }), 400

        if decoded.get("action") != "password_reset":
            return jsonify({
                "success": False,
                "message": "Invalid token type."
            }), 400

        # 2. Fetch user and their last password change timestamp
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute( 
            "SELECT id, last_password_change FROM Users WHERE id = %s",
            (user_id,)
        )

        user = cursor.fetchone()
        if not user:
            return jsonify({"success": False, "message": "User not found."}), 404

        user_id = user["id"]
        last_change = user["last_password_change"]   # may be None

        # 3. Check TIMESTAMP for outdated tokens
        if last_change is not None and token_iat is not None:
            # Convert last_change (datetime) to Unix timestamp
            # Assuming last_change is a Python datetime object
            if last_change.timestamp() > token_iat:
                return jsonify({
                    "success": False,
                    "message": "This reset link has already been used or is no longer valid."
                }), 400

        # 4. Hash the password
        hashed = bcrypt.generate_password_hash(new_password).decode("utf-8")

        # 5. Update the password and last_password_change in one transaction
        cursor.execute(
            "UPDATE Users SET password = %s, last_password_change = CURRENT_TIMESTAMP WHERE id = %s",
            (hashed, user_id)
        )
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Password has been reset successfully."
        }), 200

    except Exception as e:
        # Catches expired tokens, invalid signatures, etc.
        return jsonify({
            "success": False,
            "message": "Invalid or expired reset link."
        }), 400

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()