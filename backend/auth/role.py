from datetime import datetime, timedelta
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from db import get_connection
from . import auth_bp

COOLDOWN_HOURS = 12
COOLDOWN_SECONDS = COOLDOWN_HOURS * 3600


@auth_bp.route("/role-status", methods=["GET"])
@jwt_required()
def role_status():
    """
    Check the current role and cooldown status for the authenticated user.
    """
    user_id = get_jwt_identity()
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, role, last_role_switch
                FROM Users
                WHERE id = %s
                """,
                (user_id,),
            )
            user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found."}), 404

        last_switch = user.get("last_role_switch")
        can_switch = True
        remaining_seconds = 0
        next_available_at = None

        if last_switch:
            now = datetime.now()
            elapsed_seconds = (now - last_switch).total_seconds()
            if elapsed_seconds < COOLDOWN_SECONDS:
                can_switch = False
                remaining_seconds = int(COOLDOWN_SECONDS - elapsed_seconds)
                next_available_at = last_switch + timedelta(hours=COOLDOWN_HOURS)

        return jsonify({
            "success": True,
            "role": user["role"],
            "can_switch": can_switch,
            "cooldown_remaining_seconds": max(0, remaining_seconds),
            "last_role_switch": last_switch.isoformat() if last_switch else None,
            "next_switch_available_at": next_available_at.isoformat() if next_available_at else None,
            "cooldown_hours": COOLDOWN_HOURS,
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Failed to retrieve role status.",
            "error": str(e),
        }), 500

    finally:
        if conn:
            conn.close()


@auth_bp.route("/switch-role", methods=["POST"])
@jwt_required()
def switch_role():
    """
    Switch authenticated user's role between USER (student) and INSTRUCTOR.
    Enforces a strict 12-hour cooldown delay between role switches.
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    target_role = data.get("role")

    if not target_role:
        return jsonify({
            "success": False,
            "message": "Target role is required."
        }), 400

    target_role = target_role.strip().upper()

    if target_role not in ["USER", "INSTRUCTOR"]:
        return jsonify({
            "success": False,
            "message": "Invalid role. Role switching is only permitted between USER and INSTRUCTOR."
        }), 400

    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, fullname, email, phone_no, role, is_verified, avatar, last_role_switch
                FROM Users
                WHERE id = %s
                """,
                (user_id,),
            )
            user = cursor.fetchone()

            if not user:
                return jsonify({"success": False, "message": "User not found."}), 404

            current_role = user.get("role")
            if current_role == target_role:
                return jsonify({
                    "success": False,
                    "message": f"You are already in the {target_role} role."
                }), 400

            # Enforce 12-hour cooldown
            last_switch = user.get("last_role_switch")
            if last_switch:
                now = datetime.now()
                elapsed_seconds = (now - last_switch).total_seconds()
                if elapsed_seconds < COOLDOWN_SECONDS:
                    remaining_seconds = int(COOLDOWN_SECONDS - elapsed_seconds)
                    next_available_at = last_switch + timedelta(hours=COOLDOWN_HOURS)
                    rem_hours = remaining_seconds // 3600
                    rem_mins = (remaining_seconds % 3600) // 60
                    rem_secs = remaining_seconds % 60

                    return jsonify({
                        "success": False,
                        "message": (
                            f"Role switch is on cooldown. You can switch again in "
                            f"{rem_hours}h {rem_mins}m {rem_secs}s."
                        ),
                        "cooldown_remaining_seconds": remaining_seconds,
                        "next_switch_available_at": next_available_at.isoformat(),
                        "last_role_switch": last_switch.isoformat()
                    }), 429

            # Apply role update and update last_role_switch timestamp
            cursor.execute(
                """
                UPDATE Users
                SET role = %s, last_role_switch = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (target_role, user_id),
            )

            # Retrieve updated user record
            cursor.execute(
                """
                SELECT id, fullname, email, phone_no, role, is_verified, avatar, last_role_switch
                FROM Users
                WHERE id = %s
                """,
                (user_id,),
            )
            updated_user = cursor.fetchone()

        conn.commit()

        # Generate fresh JWT token with updated role claim
        access_token = create_access_token(
            identity=str(updated_user["id"]),
            additional_claims={
                "role": updated_user["role"],
                "email": updated_user["email"],
            }
        )

        last_switch_iso = (
            updated_user["last_role_switch"].isoformat()
            if updated_user.get("last_role_switch")
            else datetime.now().isoformat()
        )

        return jsonify({
            "success": True,
            "message": f"Role successfully switched to {target_role}.",
            "access_token": access_token,
            "user": {
                "id": updated_user["id"],
                "fullname": updated_user["fullname"],
                "email": updated_user["email"],
                "phone_no": updated_user.get("phone_no"),
                "role": updated_user["role"],
                "is_verified": bool(updated_user.get("is_verified")),
                "avatar": updated_user.get("avatar"),
                "last_role_switch": last_switch_iso,
            }
        }), 200

    except Exception as e:
        if conn:
            try:
                conn.rollback()
            except Exception:
                pass
        return jsonify({
            "success": False,
            "message": "Failed to switch role.",
            "error": str(e),
        }), 500

    finally:
        if conn:
            conn.close()
