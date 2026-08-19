from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from slugify import slugify
from db import get_connection

@course_bp.route("/create", methods=["POST"])
@jwt_required()
def create():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get('title')
    price = data.get('price', 0)
    currency = data.get('currency', 'NGN')
    free_count = data.get('free_count', 1)
    slug = title.strip()

    if not title:
        return jsonify({"success": False, "message": "Course title must be provided"}), 400

    if not currency:
        return jsonify({"success": False, "message": "Currency must be provided"}), 400

    if price <= 0:
        return jsonify({"success": False, "message": "Price must be greater than 0"}), 400


    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""SELECT * FROM Users WHERE id = %s""", (user_id,))
        
    except Exception as e:
        return jsonify({"success": False, "message": e}), 400

    finally:
        cursor.close()
        conn.close()

    return jsonify({"success": True, "message": f"Course {title} created successfully"}), 400
