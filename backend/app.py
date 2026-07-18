# from fastapi import FastAPI

# from api.upload import router as upload_router
# from api.analyze import router as analyze_router
# from api.generate import router as generation_router

# app = FastAPI(title="RepoInsight Backend")

# app.include_router(upload_router)
# app.include_router(analyze_router)
# app.include_router(generation_router)

# @app.get("/")
# def home():
#     return {"message": "Backend is running!"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.upload import router as upload_router
from api.analyze import router as analyze_router
from api.generate import router as generation_router

app = FastAPI(title="RepoInsight Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(analyze_router)
app.include_router(generation_router)


@app.get("/")
def home():
    return {
        "message": "Backend is running!"
    }