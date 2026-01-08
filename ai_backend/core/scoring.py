def compute_compatibility(user: dict, other: dict) -> dict:
    user_skills = set(user.get("skills", []))
    other_skills = set(other.get("skills", []))

    skill_overlap = len(user_skills & other_skills) / max(len(user_skills), 1)
    role_complement = 1 if user.get("role") != other.get("role") else 0
    goal_alignment = 1 if user.get("goals") == other.get("goals") else 0.5

    score = (
        skill_overlap * 40 +
        role_complement * 40 +
        goal_alignment * 20
    )

    return {
        "score": round(score),
        "breakdown": {
            "skill_overlap": round(skill_overlap, 2),
            "role_complement": role_complement,
            "goal_alignment": goal_alignment
        }
    }
