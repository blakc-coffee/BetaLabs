# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import uuid

app = Flask(__name__)
CORS(app)

# ------------------ DATA FILES ------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
USERS_FILE = os.path.join(DATA_DIR, "users.json")
TEAMS_FILE = os.path.join(DATA_DIR, "teams.json")
REQUESTS_FILE = os.path.join(DATA_DIR, "requests.json")

os.makedirs(DATA_DIR, exist_ok=True)

def init_file(path):
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump([], f)

def read_json(path):
    with open(path, "r") as f:
        return json.load(f)

def write_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

init_file(USERS_FILE)
init_file(TEAMS_FILE)
init_file(REQUESTS_FILE)

# ------------------ SKILLS ------------------
# ------------------ SKILLS & DATA SEEDING ------------------
SKILL_CATEGORIES = {
    "Frontend": ["React", "Vue.js", "Next.js", "TypeScript", "Tailwind CSS"],
    "Backend": ["Node.js", "Python", "Java", "Go", "Ruby"],
    "Database": ["PostgreSQL", "MongoDB", "Firebase", "MySQL", "Redis"],
    "AI/ML": ["TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "NLP"],
    "Design": ["Figma", "UI/UX Design", "Prototyping", "Wireframing", "Animation Design"]
}
ALL_SKILLS = [skill for category in SKILL_CATEGORIES.values() for skill in category]

SAMPLE_USERS = [
    {"id": "solo-1", "name": "Arjun Sharma", "bio": "Full-stack developer...", "skills": ["React", "Node.js", "MongoDB", "TypeScript", "Tailwind CSS"], "interest": "Full-Stack", "contact": {"discord": "arjun#2341", "linkedin": "arjun-sharma"}},
    {"id": "solo-2", "name": "Priya Patel", "bio": "AI/ML enthusiast...", "skills": ["Python", "TensorFlow", "PyTorch", "NLP", "Scikit-learn"], "interest": "AI/ML", "contact": {"discord": "priya#5678", "linkedin": "priya-patel"}},
    {"id": "solo-3", "name": "Rahul Kumar", "bio": "Backend specialist...", "skills": ["Java", "Go", "PostgreSQL", "Redis", "AWS"], "interest": "Backend", "contact": {"discord": "rahul#9012", "linkedin": "rahul-kumar"}},
    {"id": "solo-4", "name": "Ananya Singh", "bio": "UI/UX designer...", "skills": ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "React"], "interest": "Design", "contact": {"discord": "ananya#3456", "linkedin": "ananya-singh"}},
    {"id": "solo-5", "name": "Vikram Desai", "bio": "Frontend developer...", "skills": ["React", "Vue.js", "Next.js", "Tailwind CSS", "TypeScript"], "interest": "Frontend", "contact": {"discord": "vikram#7890", "linkedin": "vikram-desai"}}
]

SAMPLE_TEAMS = [
    {"id": "team-1", "name": "Code Warriors", "description": "AI-powered e-commerce...", "leader_id": "u_fake_lead_1", "members": ["u_fake_lead_1"], "skills_needed": ["Node.js", "PostgreSQL", "Redis"]},
    {"id": "team-2", "name": "PixelForge", "description": "Design-first team...", "leader_id": "u_fake_lead_2", "members": ["u_fake_lead_2"], "skills_needed": ["React", "TypeScript", "Node.js"]},
    {"id": "team-3", "name": "DataMiners", "description": "Data science team...", "leader_id": "u_fake_lead_3", "members": ["u_fake_lead_3"], "skills_needed": ["Python", "TensorFlow", "PostgreSQL"]},
    {"id": "team-4", "name": "CloudScale", "description": "Scalable cloud tools...", "leader_id": "u_fake_lead_4", "members": ["u_fake_lead_4"], "skills_needed": ["Go", "Java", "Redis"]}
]

def seed_data():
    # Seed Users
    if os.path.getsize(USERS_FILE) <= 2: # Empty list [] is 2 bytes
        write_json(USERS_FILE, SAMPLE_USERS)
    # Seed Teams
    if os.path.getsize(TEAMS_FILE) <= 2:
        write_json(TEAMS_FILE, SAMPLE_TEAMS)

seed_data()

# ------------------ BASIC CHECK ------------------
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status":"ok"}), 200

# ------------------ AUTH ------------------
@app.route("/login", methods=["POST"])
def login():
    users = read_json(USERS_FILE)
    data = request.json or {}
    username = data.get("name") # Simple Hackathon Auth: Name = Password

    if not username:
        return jsonify({"error": "Name is required"}), 400

    # Find user by name
    user = next((u for u in users if u["name"] == username), None)

    if user:
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found. Please register first."}), 404

# ------------------ USER ------------------
@app.route("/user", methods=["POST"])
def create_user():
    users = read_json(USERS_FILE)
    data = request.json or {}

    incoming_skills = data.get("skills", [])
    skills = [s for s in incoming_skills if s in ALL_SKILLS]

    user = {
        "id": str(uuid.uuid4()),
        "name": data.get("name", "Anonymous"),
        "skills": skills,
        "contact": data.get("contact", {})
    }

    users.append(user)
    write_json(USERS_FILE, users)
    return jsonify(user), 201

# ------------------ TEAM ------------------
@app.route("/team", methods=["POST"])
def create_team():
    teams = read_json(TEAMS_FILE)
    data = request.json or {}

    incoming_skills = data.get("skills_needed", [])
    skills_needed = [s for s in incoming_skills if s in ALL_SKILLS]

    team = {
        "id": str(uuid.uuid4()),
        "name": data.get("name", "Unnamed Team"),
        "leader_id": data.get("leader_id"),
        "members": [data.get("leader_id")],
        "skills_needed": skills_needed
    }

    teams.append(team)
    write_json(TEAMS_FILE, teams)
    return jsonify(team), 201

# ------------------ JOIN REQUEST ------------------
@app.route("/team/request", methods=["POST"])
def request_join():
    requests_db = read_json(REQUESTS_FILE)
    data = request.json or {}

    req = {
        "id": str(uuid.uuid4()),
        "team_id": data.get("team_id"),
        "user_id": data.get("user_id"),
        "status": "pending"
    }

    requests_db.append(req)
    write_json(REQUESTS_FILE, requests_db)
    return jsonify(req), 201

@app.route("/team/accept", methods=["POST"])
def accept_request():
    data = request.json or {}
    request_id = data.get("request_id")

    requests_db = read_json(REQUESTS_FILE)
    teams = read_json(TEAMS_FILE)

    for r in requests_db:
        if r["id"] == request_id:
            r["status"] = "accepted"
            for t in teams:
                if t["id"] == r["team_id"]:
                    if r["user_id"] not in t["members"]:
                        t["members"].append(r["user_id"])
            break

    write_json(REQUESTS_FILE, requests_db)
    write_json(TEAMS_FILE, teams)
    return jsonify({"status": "accepted"}), 200

# ------------------ FAKE AI ------------------
# ------------------ AI RELAY ------------------
# "Internal HTTPS" Relay to Local AI
# We use verify=False because local servers often use self-signed certificates.
LOCAL_AI_URL = "https://localhost:5001/recommend"

@app.route("/ai/recommend", methods=["POST"])
def ai_recommend():
    # 1. Get data from the Frontend
    frontend_data = request.json or {}
    
    # 2. Relay the data to the AI Service (Internal Request)
    try:
        import requests 
        
        # We send the data via HTTPS to the local model
        # verify=False ignores SSL warnings (needed for local self-signed certs)
        response = requests.post(LOCAL_AI_URL, json=frontend_data, timeout=10, verify=False)
        
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "AI Model Error", "details": response.text}), response.status_code

    except Exception as e:
        print(f"Error connecting to Local AI: {e}")
        return jsonify({"error": "Could not restrict AI service. Check if AI server is running."}), 503

# ------------------ RUN SERVER ------------------
if __name__ == "__main__":
    app.run(debug=True)