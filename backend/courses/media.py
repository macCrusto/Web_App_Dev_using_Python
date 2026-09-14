from flask import jsonify, redirect, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from db import get_connection
from utils.cloudinary_service import file_extension, file_size_kb, upload_file
from utils.decorators import instructor_required

from . import course_bp


ALLOWED_DOCUMENT_EXTENSIONS = {
    "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "md",
    "csv", "zip", "png", "jpg", "jpeg", "webp", "gif",
}
MAX_VIDEO_SIZE = 500 * 1024 * 1024
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024


def _lesson_for_instructor(cursor, lesson_id, user_id):
    cursor.execute(
        """
        SELECT l.id, l.title, l.content_type
        FROM lessons l
        INNER JOIN module m ON l.module_id = m.id
        INNER JOIN course c ON m.course_id = c.id
        WHERE l.id = %s AND c.instructor_id = %s
        """,
        (lesson_id, user_id),
    )
    return cursor.fetchone()


@course_bp.route("/lessons/<int:lesson_id>/media", methods=["POST"])
@course_bp.route("/lessons/<int:lesson_id>/video", methods=["POST"])
@jwt_required()
@instructor_required
def upload_lesson_media(lesson_id):
    user_id = get_jwt_identity()
    uploaded_file = request.files.get("file") or request.files.get("video")
    if not uploaded_file or not uploaded_file.filename:
        return jsonify({"success": False, "message": "A file is required."}), 400

    extension = file_extension(uploaded_file.filename)
    mimetype = (uploaded_file.mimetype or "").lower()
    is_video = mimetype.startswith("video/")
    if not is_video and extension not in ALLOWED_DOCUMENT_EXTENSIONS:
        return jsonify({"success": False, "message": "This file format is not permitted."}), 400

    try:
        size_kb = file_size_kb(uploaded_file)
        max_size = MAX_VIDEO_SIZE if is_video else MAX_DOCUMENT_SIZE
        if size_kb * 1024 > max_size:
            limit_mb = max_size // (1024 * 1024)
            return jsonify({"success": False, "message": f"File is too large. Maximum size is {limit_mb} MB."}), 413
    except (OSError, ValueError):
        return jsonify({"success": False, "message": "Could not read the uploaded file."}), 400

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            lesson = _lesson_for_instructor(cursor, lesson_id, user_id)
            if not lesson:
                return jsonify({
                    "success": False,
                    "message": "Lesson not found or you do not own this lesson.",
                }), 404

            if lesson["content_type"] == "VIDEO" and not is_video:
                return jsonify({"success": False, "message": "This lesson requires a video file."}), 400
            if lesson["content_type"] != "VIDEO" and is_video:
                return jsonify({"success": False, "message": "Video files are only allowed for video lessons."}), 400

            upload_result = upload_file(uploaded_file, "learning_platform/lessons")
            file_url = upload_result.get("secure_url")
            if not file_url:
                raise RuntimeError("Cloudinary did not return a secure URL")

            title = request.form.get("title") or uploaded_file.filename
            description = request.form.get("description") or None
            file_type = "VIDEO" if is_video else (extension.upper() if extension else "OTHER")
            cursor.execute(
                """
                INSERT INTO lesson_resource
                    (lesson_id, title, file_url, file_type, file_size_kb, description)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (lesson_id, title, file_url, file_type, size_kb, description),
            )
            resource_id = cursor.lastrowid
            cursor.execute(
                "UPDATE lessons SET content_url = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                (file_url, lesson_id),
            )
            conn.commit()

        return jsonify({
            "success": True,
            "message": "File uploaded successfully.",
            "resource": {
                "id": resource_id,
                "lesson_id": lesson_id,
                "title": title,
                "file_url": file_url,
                "file_type": file_type,
                "file_size_kb": size_kb,
                "description": description,
            },
            "file_url": file_url,
            "video_url": file_url if is_video else None,
        }), 200
    except Exception as error:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Failed to upload file.", "error": str(error)}), 500
    finally:
        if conn:
            conn.close()


@course_bp.route("/lessons/<int:lesson_id>/resources/<int:resource_id>/download", methods=["GET"])
@jwt_required()
def download_lesson_resource(lesson_id, resource_id):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT file_url FROM lesson_resource WHERE id = %s AND lesson_id = %s",
                (resource_id, lesson_id),
            )
            resource = cursor.fetchone()
        if not resource:
            return jsonify({"success": False, "message": "Resource not found."}), 404
        return redirect(resource["file_url"])
    finally:
        if conn:
            conn.close()
