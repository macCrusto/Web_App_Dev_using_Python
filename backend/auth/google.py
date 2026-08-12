from flask import request, jsonify, redirect, url_for
from flask_jwt_extended import create_access_token
from . import auth_bp
from oauth import google
from config import Config
from db import get_connection
from extension import bcrypt
import secrets

@auth_bp.route("/google", methods=["GET"])
def google_login():
    redirect_uri = url_for("auth_bp.google_callback", _external=True)
    return google.authorize_redirect(redirect_uri)

@auth_bp.route("/google/callback", methods=["GET"])
def google_callback():
    token = google.authorize_access_token()
    if not token:
        return jsonify({"success": False, "message": "Failed to authorize with Google."}), 400

    # Step 2: Fetch user info from Google using the token
    try:
        user_info = google.get('userinfo', token=token).json()
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch user info: {str(e)}"}), 400

    google_id = user_info.get('sub')
    email = user_info.get('email')
    name = user_info.get('name')
    # picture = user_info.get('picture')   # optional

    if not google_id or not email:
        return jsonify({"success": False, "message": "Missing required user data from Google."}), 400

    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Step 3: Check if the user exists in the database
        
        cursor.execute("""
            SELECT u.id, u.fullname, u.email, u.role, u.is_verified
            FROM OAuthAccounts o
            JOIN Users u ON o.user_id = u.id
            WHERE o.provider = %s AND o.provider_user_id = %s
        """, ('google', google_id))

        user = cursor.fetchone()
        if user:
            user_id = user["id"]
        else:
            #check if email already exists in Users table
            cursor.execute("""
                SELECT id FROM Users WHERE email = %s
            """, (email,))
            existing_user = cursor.fetchone()

            if existing_user:
                user_id = existing_user["id"]

                #Link the Google account to the existing user
                cursor.execute("""
                    INSERT INTO OAuthAccounts (user_id, provider, provider_user_id)
                    VALUES (%s, %s, %s)
                """, (user_id, 'google', google_id))
            else:
                #Create a new user and link the Google account
                cursor.execute("""
                    INSERT INTO Users (fullname, email, password, is_verified, role)
                    VALUES (%s, %s, %s, %s, %s)
                """, (fullname, email, None, True, 'user'))
                user_id = cursor.lastrowid

                cursor.execute("""
                    INSERT INTO OAuthAccounts (user_id, provider, provider_user_id)
                    VALUES (%s, %s, %s)
                """, (user_id, 'google', google_id))

        conn.commit()

        # Step 4: Generate JWT access token (same as normal login)
        access_token = create_access_token(
            identity=str(user["id"]),
            additional_claims={
                "role": user["role"],
                "email": user["email"]
            }
        )
        
        cursor.close()
        conn.close()

        # Step 5: Redirect to frontend with token as a **fragment** (not query param)
        # Using fragment avoids exposing the token in server logs.
        redirect_target = f"{Config.FRONTEND_URL}/#access_token={access_token}"
        return redirect(redirect_target)

        return jsonify({
            "success": True,
            "message": "Google authentication successful.",
            "access_token": access_token
        }), 200

    except Exception as e:
        try:
            conn.rollback()
        except:
            pass
        return jsonify({"success": False, "message": f"Error during Google OAuth: {str(e)}"}), 500