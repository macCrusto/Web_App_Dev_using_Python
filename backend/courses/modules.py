from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_connection
from .module_utils import get_course_with_access_check, get_lessons_with_access_control, build_module_response
from decorators import instructor_required

@course_bp.route("/<int:course_id>/modules", methods=["POST"])
@jwt_required()
@instructor_required
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
        
        # Check if course exists and belongs to the instructor using helper function
        course, is_instructor, is_enrolled, has_full_access = get_course_with_access_check(
            cursor, course_id, user_id
        )
        
        if not course:
            return jsonify({"success": False, "message": "Course not found!"}), 404
        
        # Check if position is already taken
        cursor.execute("""
            SELECT id FROM module WHERE course_id = %s AND module_position = %s
        """, (course_id, position))
        
        existing_module = cursor.fetchone()
        if existing_module:
            return jsonify({
                "success": False, 
                "message": f"Module position {position} is already taken!"
            }), 400

        cursor.execute("""
            INSERT INTO module (course_id, description, module_position) 
            VALUES (%s, %s, %s)
        """, (course_id, description, position))
        
        module_id = cursor.lastrowid
        conn.commit()
        
        # Get the created module to return consistent response
        cursor.execute("""
            SELECT id, description, module_position as position, created_at, updated_at
            FROM module 
            WHERE id = %s
        """, (module_id,))
        
        new_module = cursor.fetchone()

        return jsonify({
            "success": True,
            "message": "Module created successfully.",
            "module": new_module
        }), 201

    except Exception as e:
        return jsonify({
            "success": False, 
            "message": "Failed to create module", 
            "error": str(e)
        }), 500
        
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

@course_bp.route("/modules/<int:module_id>", methods=["PUT"])
@jwt_required()
@instructor_required
def update_module(module_id):

    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message":"Request body is required."})
    
    title = data.get("title")
    description = data.get("description")
    position = data.get("position")

    if not title or not title.strip():
            return jsonify({"success": False, "message":  "Module title must not be empty."})
        
    if not description.strip():
        return jsonify({"success": False, "message":  "Module description must not be empty."})
    

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:

            cursor.execute("""
            SELECT m.id, m.title, m.description, m.module_position, c.id FROM module m
            INNER JOIN course c ON m.course_id = m.id               
            WHERE m.id = %s AND c.instructor_id = %s
        """, (module_id, user_id))
            
            module = cursor.fetchone()

            if not module:
                return jsonify({"success": False, "message":"Module not found or you do not own any module."}), 404
            
            new_title = title
            new_description = description 
            new_position = position

            cursor.execute("""
                                UPDATE module SET title = %s, description = %s, position = %s
                                WHERE id = %s;
                           """, new_title, new_description, new_position, module_id)

        conn.commit()
        return jsonify({
                    "success": True,
                    "message": "Module updated successfully.",
                    "module": {
                        "id": module_id,
                        "title": new_title,
                        "description": new_description
                    }
                }), 200
                
    except Exception as e:
        return jsonify({
                    "success": True,
                    "message": "Failed to update module."})
    finally:
        conn.close()


@course_bp.route("course/module/<int:module_id>", methods=["DELETE"])
@jwt_required()
@instructor_required
def delete_module(module_id):
    user_id = get_jwt_identity()
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT m.id FROM module m INNER JOIN course c ON m.course_id = c.id
                WHERE m.id = %s and c.instructor_id = %s
            """, (module_id, user_id))

            module = cursor.fetchone()
            if not module:
                return jsonify({"success": False , "message": "Module not found."}), 400
            
            cursor.execute("""
                    DELETE FROM module WHERE id = %s
                """, module)
            conn.commit()
            return jsonify({"success": True, "message": "Module has been deleted successfully."}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Failed deleting module."}), 500
    finally:
        conn.close()
