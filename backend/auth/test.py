from flask import jsonify
from . import auth_bp

@auth_bp.route("/home", methods=["GET"])
def home():
    return "Flask is running!"

@auth_bp.route("/user", methods=["GET"])
def user():
    return jsonify({"success": True, "name": "HY Devinton", "skill": "Software Engineer"}), 200
