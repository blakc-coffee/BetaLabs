from fastapi import FastAPI
from routes.match import router as match_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Hackmate AI Backend")

app.include_router(match_router, prefix="/ai")

@app.get("/")
def health_check():
    return {"status": "Hackmate AI backend running"}
