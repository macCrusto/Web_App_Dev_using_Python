from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_connection

@course_bp.route("/<int:course_id>/modules", methods=["POST"])
@jwt_required()
def create_module(course_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    position = data.get('position')

    if not title or not title.strip():
        return jsonify({"success": False, "message": "Title cannot be empty!"}), 400

    if position is None:
        return jsonify({"success": False, "message": "Position is required!"}), 400

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # Check if course exists and belongs to the instructor
        cursor.execute("""
            SELECT id, title FROM course WHERE id = %s AND instructor_id = %s
        """, (course_id, user_id))

        course = cursor.fetchone()
        if not course:
            return jsonify({"success": False, "message": "Course not found or you don't have permission!"}), 404
        
        # Check if position is already taken
        cursor.execute("""
            SELECT id FROM module WHERE course_id = %s AND module_position = %s
        """, (course_id, position))
        
        existing_module = cursor.fetchone()
        if existing_module:
            return jsonify({"success": False, "message": f"Module position {position} is already taken!"}), 400

        cursor.execute("""
            INSERT INTO module (course_id, description, module_position) 
            VALUES (%s, %s, %s)
        """, (course_id, description, position))
        
        module_id = cursor.lastrowid
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Module created successfully.",
            "module": {
                "id": module_id,
                "course_id": course_id,
                "description": description,
                "position": position
            }
        }), 201

    except Exception as e:
        return jsonify({"success": False, "message": "Failed to create module", "error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()