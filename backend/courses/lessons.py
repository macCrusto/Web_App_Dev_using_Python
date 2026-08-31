from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_connection
from decorators import instructor_required

@course_bp.route("course/<int:module_id>/lesson", methods=["POST"])
@jwt_required()
@instructor_required
def create_lesson(module_id):
    user_id = get_jwt_identity()

    data = request.get_json()
    if not data:
        return jsonify({"success":  False,  "message":"Request body is required."}), 400
    
    title = data.get("title")
    allowed_type = ['VIDEO', 'DOCUMENT', 'PDF', 'LINK', 'CODE']
    content_type = data.get("content_type")
    content_url = data.get("content_url")
    content_body = data.get("content_body")
    is_free = data.get("is_free", True)

    if not title:
        return jsonify({"success": False, "message": "Lesson title must be provided."}), 400

    title = title.strip()
    if not title:
        return jsonify({"success": False, "message": "Lesson title must not be empty."}), 400
    
    if content_type not in allowed_type:
        return jsonify({"success": False, "message": "Lesson type not valid."}), 400
    
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                        SELECT m.id FROM module m
                        INNER JOIN course c ON m.course_id = c.id 
                        WHERE m.id = %s AND c.instructor_id = %s
                    """, (module_id, user_id))
            
            module = cursor.fetchone()
            if not module:
                return jsonify({"success": False, "message":"Module not found. you do not own any module."})
            
            cursor.execute("""
                        SELECT COALESCE(Max(lesson_position), 0) + 1 as next_position FROM module 
                           WHERE id = %s
                           """, module_id)
            
            next_position = module["next_position"]

            cursor.execute("""
                            INSERT INTO lesson (title, content_type, content_url, content_body, 
                           is_free, lesson_position, is_published)
                           VALUES (%s, %s, %s, %s, %s, %s, %s)
                            """, (title, content_type, content_url, content_body, True, next_position, False))
            lesson_id = cursor.lastrowid

            conn.commit()

            return jsonify({
                "success": True,
                "message": "Lesson created successfully.",
                "module": {
                    "id": module_id,
                    "lesson": {
                        "id": lesson_id,
                        "title": title,
                        "content_type": content_type,
                        "content_url": content_url,
                        "is_published": False,
                        "lesson_position": next_position
                    }
                }
            }), 201



    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Failed creating a lesson."}), 500
    finally:
        conn.close()