from flask import jsonify, redirect
from . import auth_bp
from db import get_connection
from config import Config

@auth_bp.route("/verify-email/<token>", methods=["GET"])
def verify_email(token):
    if not token:
        return jsonify({
            "success": False,
            "message": "Page not found"
        }), 404

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id FROM Users WHERE verification_token=%s",
            (token,)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid verification link."
            }), 400
    
        cursor.execute(
            "UPDATE Users SET is_verified = TRUE, verification_token = NULL WHERE id=%s", 
            (user["id"],)
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
