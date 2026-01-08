import faiss
import numpy as np
import os
import pickle

DIMENSION = 384
DATA_DIR = "data"
INDEX_PATH = os.path.join(DATA_DIR, "faiss.index")
META_PATH = os.path.join(DATA_DIR, "metadata.pkl")

os.makedirs(DATA_DIR, exist_ok=True)

if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
    with open(META_PATH, "rb") as f:
        metadata_store = pickle.load(f)
else:
    index = faiss.IndexFlatL2(DIMENSION)
    metadata_store = []

def save():
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "wb") as f:
        pickle.dump(metadata_store, f)

def add_vector(vector: list[float], metadata: dict):
    index.add(np.array([vector]).astype("float32"))
    metadata_store.append(metadata)
    save()

def search_vectors(vector: list[float], k: int = 5):
    distances, indices = index.search(
        np.array([vector]).astype("float32"), k
    )

    results = []
    for idx, dist in zip(indices[0], distances[0]):
        if idx == -1:
            continue
        results.append({
            "distance": float(dist),
            "profile": metadata_store[idx]
        })
    return results
