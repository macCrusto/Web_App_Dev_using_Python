def get_course_with_access_check(cursor, course_id, user_id):
    """Check if course exists and determine user access level"""
    cursor.execute("""
        SELECT id, title, instructor_id, status FROM course WHERE id = %s
    """, (course_id,))
    
    course = cursor.fetchone()
    if not course:
        return None, None, None, None
    
    # Check if course is published (or user is instructor)
    if course["status"] != "PUBLISHED" and course["instructor_id"] != user_id:
        return course, None, None, {
            "success": False,
            "message": "This course is not available!"
        }
    
    # Check if user is the instructor or enrolled
    cursor.execute("""
        SELECT id, access_type FROM enrollment 
        WHERE course_id = %s AND user_id = %s AND status = 'ACTIVE'
    """, (course_id, user_id))
    
    enrollment = cursor.fetchone()
    
    is_instructor = course["instructor_id"] == user_id
    is_enrolled = enrollment is not None
    has_full_access = is_instructor or is_enrolled
    
    return course, is_instructor, is_enrolled, has_full_access

def get_lessons_with_access_control(cursor, module_id, is_instructor, is_enrolled):
    """Get lessons with proper access control"""
    cursor.execute("""
        SELECT id, title, content_type, content_body, content_url, 
               lesson_position as position, is_free, duration_seconds, 
               is_published, created_at, updated_at
        FROM lessons 
        WHERE module_id = %s 
        ORDER BY lesson_position ASC
    """, (module_id,))
    
    lessons = cursor.fetchall()
    
    filtered_lessons = []
    for lesson in lessons:
        # Only show published lessons
        if not lesson["is_published"] and not is_instructor:
            continue
        
        # Create a copy of the lesson data
        lesson_data = {
            "id": lesson["id"],
            "title": lesson["title"],
            "content_type": lesson["content_type"],
            "position": lesson["position"],
            "is_free": lesson["is_free"],
            "duration_seconds": lesson["duration_seconds"],
            "is_published": lesson["is_published"],
            "created_at": lesson["created_at"],
            "updated_at": lesson["updated_at"]
        }
        
        # Determine if user can access full content
        can_access_full_content = (
            is_instructor or 
            is_enrolled or 
            lesson["is_free"]
        )
        
        # Include content only if user has access
        if can_access_full_content:
            lesson_data["content_body"] = lesson["content_body"]
            lesson_data["content_url"] = lesson["content_url"]
        else:
            lesson_data["content_body"] = None
            lesson_data["content_url"] = None
            lesson_data["access_restricted"] = True
            lesson_data["message"] = "Enroll to access this lesson content"
        
        filtered_lessons.append(lesson_data)
    
    return filtered_lessons

def build_module_response(module, lessons, has_full_access):
    """Build module response with access info"""
    module_data = {
        "id": module["id"],
        "description": module["description"],
        "position": module["position"],
        "created_at": module["created_at"],
        "updated_at": module["updated_at"],
        "lessons": lessons,
        "access_level": "full" if has_full_access else "preview"
    }
    
    if not has_full_access:
        module_data["message"] = "Enroll to access all lessons in this module"
    
    return module_data
