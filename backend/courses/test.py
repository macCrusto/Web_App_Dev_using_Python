from . import course_bp

@course_bp.route("/home", methods=["GET"])
def home():
    return "Welcome to course endpoint!"