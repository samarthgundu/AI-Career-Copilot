from fastapi import APIRouter, UploadFile, File, HTTPException
from models import ResumeUploadResponse
from database import Database
from services import CloudinaryService, LlamaParseService
import uuid

router = APIRouter()

@router.post("/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse resume file"""
    try:
        # Read file
        file_content = await file.read()
        if not file_content:
            raise HTTPException(status_code=400, detail="File is empty")

        filename = file.filename or f"resume_{uuid.uuid4()}"

        # Upload to Cloudinary
        cloudinary_url = await CloudinaryService.upload_resume(file_content, filename)

        # Parse with LlamaParse
        parsed_text = await LlamaParseService.parse_resume(file_content, filename)

        # Save to database
        user_id = str(uuid.uuid4())  # In production, use authenticated user
        resume_id = await Database.create_resume(user_id, cloudinary_url, parsed_text, filename)

        # Get preview (first 500 chars)
        preview = parsed_text[:500] + "..." if len(parsed_text) > 500 else parsed_text

        return ResumeUploadResponse(
            resume_id=resume_id,
            parsed_text=preview,
            cloudinary_url=cloudinary_url,
            filename=filename
        )

    except Exception as e:
        print(f"Resume upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
