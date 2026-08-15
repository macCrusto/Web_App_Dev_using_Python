from flask import request, jsonify, redirect, url_for, session
from flask_jwt_extended import create_access_token
from . import auth_bp
from oauth import google
from config import Config
from db import get_connection
from extension import bcrypt
from urllib.parse import quote

@auth_bp.route("/google", methods=["GET"])
def google_login():
    try:
        redirect_uri = url_for("auth.google_callback", _external=True)

        # 1. Get authorization URL and state (without generating a response)
        auth_data = google.create_authorization_url(redirect_uri)

        # 2. Store the state in the session under the key Authlib expects
        google.save_authorize_data(redirect_uri=redirect_uri, **auth_data)

        # 3. Return the URL as JSON; session will be saved with the response
        return jsonify({"success": True, "url": auth_data["url"]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@auth_bp.route("/google/callback", methods=["GET"])
def google_callback():
    try:
        token = google.authorize_access_token()
    except Exception as e:
        error_msg = quote("Login session expired or multiple tabs opened. Please try again.")
        return redirect(f"{Config.FRONTEND_URL}/login#error={error_msg}")

    if not token:
        error_msg = quote("Failed to authorize with Google.")
        return redirect(f"{Config.FRONTEND_URL}/#error={error_msg}")

    try:
        user_info = google.get('userinfo', token=token).json()
    except Exception as e:
        error_msg = quote(f"Failed to fetch user info: {str(e)}")
        return redirect(f"{Config.FRONTEND_URL}/#error={error_msg}")

    google_id = user_info.get('sub')
    email = user_info.get('email')
    fullname = user_info.get('name')   # note: you used 'fullname' later but didn't define it

    if not google_id or not email:
        error_msg = quote("Missing required user data from Google.")
        return redirect(f"{Config.FRONTEND_URL}/#error={error_msg}")

    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Check if user exists via OAuthAccounts
        cursor.execute("""
            SELECT u.id, u.fullname, u.email, u.role, u.is_verified
            FROM OAuthAccounts o
            JOIN Users u ON o.user_id = u.id
            WHERE o.provider = %s AND o.provider_user_id = %s
        """, ('google', google_id))
        user = cursor.fetchone()

        if user:
            user_id = user["id"]
            role = user["role"]
            email = user["email"]
        else:
            # Check if email already exists
            cursor.execute("SELECT id, role, email FROM Users WHERE email = %s", (email,))
            existing_user = cursor.fetchone()
            if existing_user:
                user_id = existing_user["id"]
                role = existing_user["role"]
                # Link Google account
                cursor.execute("""
                    INSERT INTO OAuthAccounts (user_id, provider, provider_user_id)
                    VALUES (%s, %s, %s)
                """, (user_id, 'google', google_id))
            else:
                # Create new user (use fullname from Google; if None, use email or default)
                fullname = fullname or email.split('@')[0]
                cursor.execute("""
                    INSERT INTO Users (fullname, email, password, is_verified, role)
                    VALUES (%s, %s, %s, %s, %s)
                """, (fullname, email, None, True, 'user'))
                user_id = cursor.lastrowid
                role = 'user'
                cursor.execute("""
                    INSERT INTO OAuthAccounts (user_id, provider, provider_user_id)
                    VALUES (%s, %s, %s)
                """, (user_id, 'google', google_id))

        conn.commit()

        # Generate JWT
        access_token = create_access_token(
            identity=str(user_id),
            additional_claims={
                "role": role,
                "email": email
            }
        )

        # Redirect with token in fragment
        return redirect(f"{Config.FRONTEND_URL}/#access_token={access_token}")

    except Exception as e:
        try:
            conn.rollback()
        except:
            pass
        error_msg = quote(f"Server error during Google OAuth: {str(e)}")
        return redirect(f"{Config.FRONTEND_URL}/#error={error_msg}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()