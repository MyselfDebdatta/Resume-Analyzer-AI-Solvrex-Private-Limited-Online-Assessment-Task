from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import analyze

app = FastAPI(title="Resume Analyzer AI - Backend API")

# Configure CORS for Frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api/v1/analyze", tags=["analyze"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Resume Analyzer AI Backend is running perfectly."}
