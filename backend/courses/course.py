from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from slugify import slugify
from db import get_connection
from .module_utils import get_course_with_access_check

@course_bp.route("/create", methods=["POST"])
@jwt_required()
def create_course():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get('title')
    price = data.get('price', 0)
    currency = data.get('currency', 'NGN')
    free_count = data.get('free_count', 1)
    description = data.get('description')
    thumbnail = data.get('thumbnail')
    status = data.get('status', 'DRAFT')

    if not title.strip():
        return jsonify({"success": False, "message": "Course title must be provided"}), 400

    if price <= 0:
        return jsonify({"success": False, "message": "Price must be greater than 0"}), 400


    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""SELECT * FROM Users WHERE id = %s""", (user_id,))

        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found!"}), 404

        if user["role"] != "INSTRUCTOR":
            return jsonify({"success": False, "message": "Only Instructor can create a course!"}), 403
        
        slug = slugify(title)

        if not slug: 
            return jsonify({"success": False, "message": "Unable to generate course slug!"})
        
        cursor.execute("""
                        INSERT INTO course 
                        (instructor_id, title, slug, description, thumbnail_url, price, currency, status, free_count)
                       VALUES (%s, %s, %s %s, %s, %s, %s, %s, %s)
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

@course_bp.route("/<int:course_id>", methods=["GET"])
@jwt_required()
def get_course(course_id):
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({"success": False, "message":""}), 404

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Check if course exists and belongs to the instructor using helper function
        course, is_instructor, is_enrolled, has_full_access = get_course_with_access_check(
            cursor, course_id, user_id
        )
    
        if not course:
            return jsonify({"success": False, "message": "Course not found."}), 404
            
        if not is_instructor:
            return jsonify({
                "success": False, 
                "message": "Only the course instructor can create modules!"
            }), 403

        # Check if course is published (or user is instructor)
        if course["status"] != "PUBLISHED" and course["instructor_id"] != user_id:
            return jsonify({
                "success": False, 
                "message": "This course is not available!"
            }), 403

        return jsonify({
            "success": True,
            "message": f"Course found: {course["title"]}",
            "course": course
            }), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Cannot establish a connection at the moment."}), 500

    finally:
        if conn:
            conn.close()