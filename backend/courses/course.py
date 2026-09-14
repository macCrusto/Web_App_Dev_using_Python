from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from slugify import slugify
from db import get_connection
from .module_utils import (
    get_course_with_access_check,
    get_lessons_with_access_control,
    build_module_response,
)
from utils.decorators import instructor_required, student_required

@course_bp.route("", methods=["POST"])
@jwt_required()
@instructor_required
def create_course():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get('title')
    price = data.get('price', 0)
    currency = data.get('currency', 'NGN')
    free_count = data.get('free_count', 1)
    description = data.get('description')
    thumbnail = data.get('thumbnail') or data.get('thumbnail_url')
    status = data.get('status', 'DRAFT')

    if not title.strip():
        return jsonify({"success": False, "message": "Course title must be provided"}), 400

    try:
        price = float(price)
    except (TypeError, ValueError):
        return jsonify({"success": False, "message": "Price must be a valid number"}), 400

    if price < 0:
        return jsonify({"success": False, "message": "Price cannot be negative"}), 400


    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""SELECT * FROM Users WHERE id = %s""", (user_id,))

        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found!"}), 404
        
        slug = slugify(title)

        if not slug: 
            return jsonify({"success": False, "message": "Unable to generate course slug!"})
        
        cursor.execute("""
                        INSERT INTO course 
                        (instructor_id, title, slug, description, thumbnail_url, price, currency, status, free_count)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, (
                            user_id,
                            title.strip(),
                            slug,
                            description,
                            thumbnail,
                            price,
                            currency,
                            status,
                            free_count
                        ))
        
        course_id = cursor.lastrowid
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Course created successfully.",
            "course": {
                "id": course_id,
                "instructor": user_id,
                "title": title,
                "slug": slug,
                "description": description,
                "thumbnail": thumbnail,
                "price": price,
                "currency": currency,
                "status": status,
                "free_count": free_count
            }
        }), 201

    except Exception as e:
        return jsonify(
                {"success": False, 
                 "message": "Failed to create course.", 
                 "error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@course_bp.route("", methods=["GET"])
@course_bp.route("/catalog", methods=["GET"])
def list_published_courses():
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT c.id, c.title, c.slug, c.description, c.thumbnail_url, c.price, c.currency, c.status, c.free_count, c.created_at,
                   u.fullname as instructor_name, u.email as instructor_email, u.avatar as instructor_avatar,
                   (SELECT COUNT(*) FROM module m WHERE m.course_id = c.id) as modules_count,
                   (SELECT COUNT(*) FROM lessons l JOIN module m ON l.module_id = m.id WHERE m.course_id = c.id) as lessons_count,
                   (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.id) as students_count
            FROM course c
            LEFT JOIN Users u ON c.instructor_id = u.id
            WHERE c.status = 'PUBLISHED'
            ORDER BY c.created_at DESC
        """)
        
        courses = cursor.fetchall()
        return jsonify({
            "success": True,
            "courses": courses or []
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to retrieve courses.",
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@course_bp.route("/enrolled", methods=["GET"])
@jwt_required()
@student_required
def get_student_courses():
    user_id = get_jwt_identity()

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            # Example query to retrieve student courses
            cursor.execute("""
                SELECT c.id, c.title, c.description, c.slug,
                       c.thumbnail_url, c.price, c.currency, c.status,
                       c.free_count, c.created_at, e.access_type,
                       e.enrolled_at
                FROM enrollment e
                INNER JOIN course c ON c.id = e.course_id
                WHERE e.user_id = %s AND e.status = 'ACTIVE'
                ORDER BY e.enrolled_at DESC
            """, (user_id,))
            courses = cursor.fetchall()


            return jsonify({"success": True, "courses": courses}), 200
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Failed to retrieve courses", "error": str(e)}), 500

    
    return jsonify({"success": False, "message": "No courses found for this student"}), 404

@course_bp.route("/<int:course_id>", methods=["GET"])
@jwt_required()
def get_course(course_id):
    user_id = get_jwt_identity()

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        course, is_instructor, is_enrolled, has_full_access = get_course_with_access_check(
            cursor, course_id, user_id
        )

        if not course:
            return jsonify({
                "success": False,
                "message": "Course not found."
            }), 404

        if isinstance(has_full_access, dict):
            return jsonify(has_full_access), 403

        cursor.execute("""
            SELECT
                c.id,
                c.title,
                c.slug,
                c.description,
                c.thumbnail_url,
                c.price,
                c.currency,
                c.status,
                c.free_count,
                c.created_at,
                u.id AS instructor_id,
                u.fullname AS instructor_name,
                u.email AS instructor_email,
                u.avatar AS instructor_avatar,
                (SELECT COUNT(*) FROM module m WHERE m.course_id = c.id) AS modules_count,
                (SELECT COUNT(*) FROM lessons l
                    JOIN module m ON l.module_id = m.id
                    WHERE m.course_id = c.id) AS lessons_count,
                (SELECT COUNT(*) FROM enrollment e WHERE e.course_id = c.id) AS students_count
            FROM course c
            LEFT JOIN Users u ON c.instructor_id = u.id
            WHERE c.id = %s
        """, (course_id,))

        course_data = cursor.fetchone()

        if not course_data:
            return jsonify({
                "success": False,
                "message": "Course not found."
            }), 404

        cursor.execute("""
            SELECT access_type, status, enrolled_at, expires_at
            FROM enrollment
            WHERE course_id = %s AND user_id = %s
        """, (course_id, user_id))

        enrollment = cursor.fetchone()

        cursor.execute("""
            SELECT
                id,
                description,
                module_position AS position,
                created_at,
                updated_at
            FROM module
            WHERE course_id = %s
            ORDER BY module_position ASC
        """, (course_id,))

        modules = cursor.fetchall()

        modules_data = []

        for module in modules:
            lessons = get_lessons_with_access_control(
                cursor,
                module["id"],
                is_instructor,
                is_enrolled
            )

            modules_data.append(
                build_module_response(module, lessons, has_full_access)
            )

        return jsonify({
            "success": True,
            "message": f"Course found: {course_data['title']}",
            "course": course_data,
            "enrollment": enrollment,
            "modules": modules_data,
            "user_access": {
                "is_instructor": is_instructor,
                "is_enrolled": is_enrolled,
                "has_full_access": has_full_access
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Cannot retrieve course at the moment.",
            "error": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
