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
            
            result = cursor.fetchone()
            
            next_position = result["next_position"]

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


@course_bp.route("/modules/<int:module_id>/lessons", methods=["GET"])
@jwt_required()
@instructor_required
def get_module_lessons(module_id):

    user_id = get_jwt_identity()

    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    m.id,
                    m.course_id,
                    m.title
                FROM module m
                INNER JOIN course c
                    ON m.course_id = c.id
                WHERE m.id = %s
                AND c.instructor_id = %s
            """, (module_id, user_id))

            module = cursor.fetchone()

            if not module:
                return jsonify({
                    "success": False,
                    "message": "Module not found or you do not own this module."
                }), 404

            cursor.execute("""
                SELECT
                    id,
                    module_id,
                    title,
                    description,
                    content_type,
                    content_url,
                    content_body,
                    is_free,
                    lesson_position,
                    is_published,
                    duration_seconds,
                    created_at,
                    updated_at
                FROM lesson
                WHERE module_id = %s
                ORDER BY position ASC
            """, (module_id,))

            lessons = cursor.fetchall()

            return jsonify({
                "success": True,
                "module": {
                    "id": module["id"],
                    "course_id": module["course_id"],
                    "title": module["title"]
                },
                "lessons": lessons
            }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": "Failed to retrieve lessons.",
            "error": str(e)
        }), 500

    finally:
        if connection:
            connection.close()


@course_bp.route("/lessons/<int:lesson_id>", methods=["PUT"])
@jwt_required()
@instructor_required
def update_module_lessons(lesson_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "message": "Request body is required."}), 400
    
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT I.id, I.title, I.description,
                    I.content_type, I.content_url, I.content_body,
                    I.is_free, I.module_position, C.id FROM module I
                INNER JOIN module M ON I.id = M.id
                INNER JOIN course C ON I.course_id = C.id
                WHERE I.id = %s AND C.instructor_id = %s
            """, (lesson_id, user_id))

            lesson = cursor.fetchone()
            if not lesson:
                return jsonify({"success": False, "message": "Lesson not found or you do not own this lesson."}), 404
            
            title = data.get("title", lesson["title"])
            description = data.get("description", lesson["description"])
            content_type = data.get("content_type", lesson["content_type"])
            content_url = data.get("content_url", lesson["content_url"])
            content_body = data.get("content_body", lesson["content_body"])
            is_free = data.get("is_free", lesson["is_free"])    

            title = title.strip()
            if not title:
                return jsonify({"success": False, "message": "Lesson title must not be empty."}), 400
            
            allowed_types = ['VIDEO', 'DOCUMENT', 'PDF', 'LINK', 'CODE']
            if content_type not in allowed_types:
                return jsonify({"success": False, "message": "Lesson type not valid."}), 400
            
            if not isinstance(is_free, bool):
                return jsonify({"success": False, "message": "is_free must be a boolean value."}), 400
            
            cursor.execute("""
                UPDATE lesson SET title = %s, description = %s, content_type = %s, content_url = %s, content_body = %s, is_free = %s
                WHERE id = %s
            """, (title, description, content_type, content_url, content_body, is_free, lesson_id))

            conn.commit()
            return jsonify({"success": True, "message": "Lesson updated successfully."}), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Failed to update lesson.", "error": str(e)}), 500

    finally:
        if conn:
            conn.close()



@course_bp.route("/lessons/<int:lesson_id>", methods=["DELETE"])
@jwt_required()
@instructor_required
def delete_module_lessons(lesson_id):
    user_id = get_jwt_identity()

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT I.id, I.title, I.description,
                    I.content_type, I.content_url, I.content_body,
                    I.is_free, I.module_position, C.id FROM module I
                INNER JOIN module M ON I.id = M.id
                INNER JOIN course C ON I.course_id = C.id
                WHERE I.id = %s AND C.instructor_id = %s
            """, (lesson_id, user_id))

            lesson = cursor.fetchone()
            if not lesson:
                return jsonify({"success": False, "message": "Lesson not found or you do not own this lesson."}), 404

            cursor.execute("""
                DELETE FROM lesson WHERE id = %s
            """, (lesson_id,))

            conn.commit()
            return jsonify({"success": True, "message": "Lesson deleted successfully."}), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Failed to delete lesson.", "error": str(e)}), 500

    finally:
        if conn:
            conn.close()