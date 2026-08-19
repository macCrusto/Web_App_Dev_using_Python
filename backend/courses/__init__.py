from flask import Blueprint

course_bp = Blueprint("courses", __name__)

from . import test, course