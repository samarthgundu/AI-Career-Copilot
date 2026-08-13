from fastapi import APIRouter, HTTPException
from models import AnalysisRequest, AnalysisResponse, ATSCheckRequest, ATSCheckResponse, ResumeRewriteRequest, ResumeRewriteResponse
from database import Database
from ai_service import AIService
from services import PDFGenerator, CloudinaryService
import uuid

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(request: AnalysisRequest):
    """Analyze resume against job target"""
    try:
        # Get resume and job target data
        resume = await Database.get_resume(request.resume_id)
        job_target = await Database.get_job_target(request.job_target_id)

        if not resume or not job_target:
            raise HTTPException(status_code=404, detail="Resume or job target not found")

        # Analyze with OpenAI
        analysis_result = await AIService.analyze_resume(
            resume['parsed_text'],
            job_target['description']
        )

        # Store analysis in database
        analysis_id = await Database.create_analysis(
            request.resume_id,
            request.job_target_id,
            analysis_result['match_score'],
            0,  # ATS score will be set separately
            analysis_result['matching_skills'],
            analysis_result['missing_skills'],
            analysis_result['improved_bullets'],
            []  # ATS issues will be set separately
        )

        return AnalysisResponse(
            analysis_id=analysis_id,
            match_score=analysis_result['match_score'],
            matching_skills=analysis_result['matching_skills'],
            missing_skills=analysis_result['missing_skills'],
            improved_bullets=analysis_result['improved_bullets']
        )

    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ats-check", response_model=ATSCheckResponse)
async def check_ats(request: ATSCheckRequest):
    """Check ATS compliance"""
    try:
        resume = await Database.get_resume(request.resume_id)
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        # Check ATS with OpenAI
        ats_result = await AIService.check_ats(resume['parsed_text'])

        return ATSCheckResponse(
            ats_score=ats_result['ats_score'],
            ats_issues=ats_result['ats_issues']
        )

    except Exception as e:
        print(f"ATS check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resume/rewrite", response_model=ResumeRewriteResponse)
async def rewrite_resume(request: ResumeRewriteRequest):
    """Rewrite and optimize resume for job target"""
    try:
        resume = await Database.get_resume(request.resume_id)
        job_target = await Database.get_job_target(request.job_target_id)

        if not resume or not job_target:
            raise HTTPException(status_code=404, detail="Resume or job target not found")

        # Rewrite with OpenAI
        rewritten_text = await AIService.rewrite_resume_bullets(
            resume['parsed_text'],
            job_target['description']
        )

        # Generate PDF
        pdf_content = await PDFGenerator.generate_resume_pdf(rewritten_text)

        # Upload to Cloudinary
        pdf_url = await CloudinaryService.upload_pdf(pdf_content, f"optimized_resume_{request.resume_id}.pdf")

        return ResumeRewriteResponse(
            rewritten_text=rewritten_text,
            pdf_url=pdf_url
        )

    except Exception as e:
        print(f"Resume rewrite error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
