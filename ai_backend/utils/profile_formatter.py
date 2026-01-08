def profile_to_text(profile: dict) -> str:
    return f"""
Role: {profile.get('role')}
Skills: {', '.join(profile.get('skills', []))}
Experience: {profile.get('experience')}
Interests: {', '.join(profile.get('interests', []))}
Goals: {profile.get('goals')}
Availability: {profile.get('availability')}
Bio: {profile.get('bio')}
"""
