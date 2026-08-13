from fastapi import APIRouter, HTTPException
from models import JobTargetCreate, JobTargetResponse
from database import Database
import uuid

router = APIRouter()

@router.post("/job-target", response_model=JobTargetResponse)
async def create_job_target(job: JobTargetCreate):
    """Create or update target job"""
    try:
        user_id = str(uuid.uuid4())  # In production, use authenticated user
        job_target_id = await Database.create_job_target(
            user_id,
            job.title,
            job.company,
            job.description
        )

        return JobTargetResponse(
            job_target_id=job_target_id,
            title=job.title,
            company=job.company,
            description=job.description
        )

    except Exception as e:
        print(f"Job target creation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
