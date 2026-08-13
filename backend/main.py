from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Import route handlers
from routes import resume_routes, job_routes, analysis_routes, interview_routes, skill_routes

load_dotenv()

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Server] AI Career Copilot backend starting...")
    yield
    print("[Server] AI Career Copilot backend shutting down...")

# Create FastAPI app
app = FastAPI(
    title="AI Career Copilot API",
    description="Your personal career AI assistant",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume_routes.router, tags=["Resume"])
app.include_router(job_routes.router, tags=["Job Target"])
app.include_router(analysis_routes.router, tags=["Analysis"])
app.include_router(interview_routes.router, tags=["Interview"])
app.include_router(skill_routes.router, tags=["Skills"])

@app.get("/")
async def root():
    return {
        "message": "AI Career Copilot API",
        "status": "running",
        "endpoints": [
            "/resume/upload",
            "/job-target",
            "/analyze",
            "/ats-check",
            "/resume/rewrite",
            "/interview/start",
            "/interview/chat",
            "/skill-gap",
            "/study-plan"
        ]
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
