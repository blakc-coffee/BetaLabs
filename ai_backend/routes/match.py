from fastapi import APIRouter
from utils.profile_formatter import profile_to_text
from core.embedder import get_embedding
from core.vectorstore import search_vectors
from core.scoring import compute_compatibility

router = APIRouter()

@router.post("/match/person")
def match_person(user: dict):
    query_text = profile_to_text(user)
    query_embedding = get_embedding(query_text)

    candidates = search_vectors(query_embedding, k=5)

    results = []

    for c in candidates:
        candidate_profile = c["profile"]
        scoring = compute_compatibility(user, candidate_profile)

        results.append({
            "candidate_id": candidate_profile.get("user_id"),
            "score": scoring["score"],
            "breakdown": scoring["breakdown"]
        })

    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    return results
