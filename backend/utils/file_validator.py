
ALLOWED_FILES = {
    "VIDEO": {
        "extensions": {"mp4", "mov", "mkv"},
        "mime_types": {"video/mp4", "video/quicktime", "video/webm"},
        "max_size": 500 * 1024 * 1024  # 500 MB
    },
    "DOCUMENT": {
        "extensions": {"pdf", "doc", "docx", "ppt"},
        "mime_types": {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"},
        "max_size": 25 * 1024 * 1024  # 25 MB
    },
}

def validate_extension(filename, content_type):
    
    extension = os.path.splitext(filename)[1][1:].lower()  # Get the file extension without the dot

    allowed_extensions = ALLOWED_FILES[content_type]["extensions"]

    if extension not in allowed_extensions: 
        return False, f"Invalid file extension: .{extension}. Allowed extensions for {content_type} are: {', '.join(allowed_extensions)}."
    return True, None

# --- CHECK THIS FUNCTION LATER ---
def validate_mimetype(file, content_type):
    if not file.mimetype:
        return False, "MIME type is required."

    allowed_mime_types = ALLOWED_FILES[content_type]["mime_types"]

    if file.mimetype not in allowed_mime_types:
        return False, f"Invalid MIME type: {file.mimetype}. Allowed MIME types for {content_type} are: {', '.join(allowed_mime_types)}."

    return True, None

def validate_file(file, content_type):
    if content_type not in ALLOWED_FILES:
        return False, f"Invalid content type: {content_type}. Allowed types are: {', '.join(ALLOWED_FILES.keys())}."
    if not file.filename:
        return False, "Filename is required."

    valid, error = validate_extension(file.filename, content_type)
    if not valid:
        return False, error

    valid, error = validate_mimetype(file, content_type)
    if not valid:
        return False, error

    return True, None
