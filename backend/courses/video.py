from . import course_bp
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_connection
from utils.decorators import instructor_required

@course_bp.route("/lessons/<int:lesson_id>/video", methods=["POST"])
@jwt_required()
@instructor_required
def upload_lesson_video(lesson_id):
    user_id = get_jwt_identity()

    if "video" not in request.files:
        return jsonify({
            "success": False,
            "message": "video file is reqyuired."
        }), 400
    video = request.files["video"]

    if not video.filename:
        return jsonify({
            "success": False,
            "message": "No video selected."
        }), 400
    
    if not video.mimetype.startswith("video/"):
        return jsonify({
            "success": False,
            "message": "Only video files are allowed."
        }), 400
    
    conn = None
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                        SELECT l.id, l.title, l.content_type
                           FROM lesson l
                           INNER JOIN course c ON m.course_id = c.id
                           WHERE l.id = %s AND. c.instruction_id = %s
                        """, (lesson_id, user_id))
            lesson = cursor.fetchone()
            if not lesson:
                return jsonify({
                    "success": False,
                    "message":  "Lesson not found or you do not own this lesson."
                }), 404

            if lesson["content_type"] != "VIDEO":
                return jsonify({
                    "success": False,
                    "message": "Invalid content type. Only video lessons can upload videos."
                }), 400

            upload_result = cloudinary.uploader.upload(
                video,
                resource_type="video",
                folder="learning_platform/lessons",
            )
            video_url = upload_result.get("secure_url")
            if not video_url:
                return jsonify({
                    "success": False,
                    "message": "Failed to upload video."
                }), 500
            with conn.cursor() as cursor:
                cursor.execute("""
                    UPDATE lesson SET content_url = %s WHERE id = %s
                """, (video_url, lesson_id))
                conn.commit()
                return jsonify({
                    "success": True,
                    "message": "Video uploaded successfully.",
                    "video_url": video_url
                }), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"success": False, "message": "Failed to upload video."}), 500
    finally:
        conn.close()
        