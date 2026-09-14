from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import get_connection
from . import auth_bp
from utils.cloudinary_service import upload_file

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5 MB


def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@auth_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    """
    Upload or replace the authenticated user's profile avatar.
    Accepts multipart/form-data with field 'avatar'.
    """
    user_id = get_jwt_identity()

    if 'avatar' not in request.files:
        return jsonify({'success': False, 'message': 'No avatar file provided.'}), 400

    file = request.files['avatar']

    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected.'}), 400

    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'message': 'Invalid file type. Allowed: PNG, JPG, JPEG, WebP, GIF.'
        }), 400

    # Check file size
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)     # Reset
    if size > MAX_CONTENT_LENGTH:
        return jsonify({'success': False, 'message': 'File too large. Maximum size is 5 MB.'}), 413

    conn = None
    try:
        upload_result = upload_file(file, "learning_platform/avatars")
        avatar_url = upload_result.get("secure_url")
        if not avatar_url:
            raise RuntimeError("Cloudinary did not return a secure URL")

        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE Users SET avatar = %s WHERE id = %s",
                (avatar_url, user_id)
            )
        conn.commit()

        return jsonify({
            'success': True,
            'message': 'Avatar uploaded successfully.',
            'avatar_url': avatar_url,
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to upload avatar.',
            'error': str(e),
        }), 500

    finally:
        if conn:
            conn.close()
