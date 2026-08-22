from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from slugify import slugify
from db import get_connection

@course_bp.route("/<int:course_id>/modules", methods=["POST"])
@jwt_required()
def create_module(course_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    position = data.get('position')


    if not title.strip():
        return jsonify({"success": False, "message": "Title cannot be empty!"}), 400
    

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, title FROM course WHERE id = %s AND instructor_id = %s
        """, (course_id, user_id))

        course = cursor.fetchone()
        if not course:
            return jsonify({"success": False, "message": "Course is not found!"}), 404
        
        cursor.execute("""
            INSERT INTO module 
                        (course_id, title, description, position) VALUES
                       (%s, %s, %s, %s) 
        """, (course_id, title, description, position))
        module_id = cursor.lastrowid

        conn.commit() 
        return jsonify({
            "success": True,
            "message": "Module created successfully.",
            "course": {
                "id": module_id,
                "instructor": user_id,
                "title": title,
                }
                }), 201

    except Exception as e:
        return jsonify({"success": False, "message": "Failed to create module", "error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()