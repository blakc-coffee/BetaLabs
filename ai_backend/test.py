from core.embedder import get_embedding
from core.vectorstore import add_vector, search_vectors
from core.scoring import compute_compatibility
from utils.profile_formatter import profile_to_text

dummy_users = [
    {
        "user_id": "u1",
        "role": "Frontend",
        "skills": ["React", "Tailwind"],
        "goals": "Win"
    },
    {
        "user_id": "u2",
        "role": "Backend",
        "skills": ["Node", "Firebase"],
        "goals": "Win"
    }
]

for u in dummy_users:
    add_vector(get_embedding(profile_to_text(u)), u)

query = {
    "user_id": "test",
    "role": "Frontend",
    "skills": ["React"],
    "goals": "Win"
}

query_vec = get_embedding(profile_to_text(query))
results = search_vectors(query_vec)

for r in results:
    print(compute_compatibility(query, r["profile"]))
