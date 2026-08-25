from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_connection
from module_utils import get_course_with_access_check, get_lessons_with_access_control, build_module_response

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
@course_bp.route("/<int:course_id>/modules", methods=["GET"])
@jwt_required()
def get_course_modules(course_id):
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"success": False, "message": "User not authenticated!"}), 401

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Get course with access check
        course, is_instructor, is_enrolled, has_full_access = get_course_with_access_check(
            cursor, course_id, user_id
        )
        
        if not course:
            return jsonify({"success": False, "message": "Course not found!"}), 404
            
        if isinstance(has_full_access, dict):
            return jsonify(has_full_access), 403

        # Get all modules for the course
        cursor.execute("""
            SELECT id, description, module_position as position, created_at, updated_at
            FROM module 
            WHERE course_id = %s 
            ORDER BY module_position ASC
        """, (course_id,))
        
        modules = cursor.fetchall()

        # Build modules with lessons
        modules_data = []
        for module in modules:
            lessons = get_lessons_with_access_control(
                cursor, module["id"], is_instructor, is_enrolled
            )
            module_data = build_module_response(module, lessons, has_full_access)
            modules_data.append(module_data)

        return jsonify({
            "success": True,
            "message": "Modules retrieved successfully.",
            "course": {
                "id": course["id"],
                "title": course["title"],
                "instructor_id": course["instructor_id"],
                "status": course["status"]
            },
            "user_access": {
                "is_instructor": is_instructor,
                "is_enrolled": is_enrolled,
                "has_full_access": has_full_access
            },
            "modules": modules_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False, 
            "message": "Failed to retrieve modules.", 
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@course_bp.route("/<int:course_id>/modules/<int:module_id>", methods=["GET"])
@jwt_required()
def get_course_module(course_id, module_id):
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"success": False, "message": "User not authenticated!"}), 401

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Get course with access check
        course, is_instructor, is_enrolled, has_full_access = get_course_with_access_check(
            cursor, course_id, user_id
        )
        
        if not course:
            return jsonify({"success": False, "message": "Course not found!"}), 404
            
        if isinstance(has_full_access, dict):
            return jsonify(has_full_access), 403

        # Get the specific module
        cursor.execute("""
            SELECT id, description, module_position as position, created_at, updated_at
            FROM module 
            WHERE id = %s AND course_id = %s
        """, (module_id, course_id))
        
        module = cursor.fetchone()
        
        if not module:
            return jsonify({"success": False, "message": "Module not found in this course!"}), 404

        # Get lessons with access control
        lessons = get_lessons_with_access_control(
            cursor, module_id, is_instructor, is_enrolled
        )
        module_data = build_module_response(module, lessons, has_full_access)

        return jsonify({
            "success": True,
            "message": "Module retrieved successfully.",
            "course": {
                "id": course["id"],
                "title": course["title"],
                "instructor_id": course["instructor_id"],
                "status": course["status"]
            },
            "user_access": {
                "is_instructor": is_instructor,
                "is_enrolled": is_enrolled,
                "has_full_access": has_full_access
            },
            "module": module_data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False, 
            "message": "Failed to retrieve module.", 
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
