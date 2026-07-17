from fastapi import FastAPI

from api.upload import router as upload_router
from api.analyze import router as analyze_router
from api.generate import router as generation_router

app = FastAPI(title="RepoInsight Backend")

app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(generation_router)

@app.get("/")
def home():
    return {"message": "Backend is running!"}