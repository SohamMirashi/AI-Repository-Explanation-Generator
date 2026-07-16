from fastapi import FastAPI
from api.upload import router as upload_router
from api.analyze import router as analyze_router

app = FastAPI(title="RepoInsight Backend")

app.include_router(upload_router)
app.include_router(analyze_router)

@app.get("/")
def home():
    return {"message": "Backend is running!"}