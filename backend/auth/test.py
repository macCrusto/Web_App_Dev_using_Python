from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from db import get_connection
from . import auth_bp

@auth_bp.route("/home", methods=["GET"])
def home():
    return "Flask is running!"

@auth_bp.route("/user", methods=["GET"])
def user():
    return jsonify({"success": True, "name": "HY Devinton", "skill": "Software Engineer"}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def current_user():
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, fullname, email, phone_no, role, is_verified, avatar
                FROM Users
                WHERE id = %s
                """,
                (get_jwt_identity(),),
            )
            user_record = cursor.fetchone()

        if not user_record:
            return jsonify({"success": False, "message": "User not found."}), 404

        return jsonify({"success": True, "user": user_record}), 200
    finally:
        if connection:
            connection.close()
