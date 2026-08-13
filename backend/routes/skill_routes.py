from fastapi import APIRouter, HTTPException
from models import SkillGapRequest, SkillGapResponse, StudyPlanRequest, StudyPlanResponse, WeekPlan
from database import Database
from ai_service import AIService
import uuid

router = APIRouter()

@router.post("/skill-gap", response_model=SkillGapResponse)
async def get_skill_gap(request: SkillGapRequest):
    """Get skill gap analysis"""
    try:
        # Get analysis
        analysis = await Database.get_analysis(request.analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")

        # Get resume and job target
        resume = await Database.get_resume(analysis['resume_id'])
        job_target = await Database.get_job_target(analysis['job_target_id'])

        if not resume or not job_target:
            raise HTTPException(status_code=404, detail="Resume or job target not found")

        # Analyze skill gap
        gap_data = await AIService.analyze_skill_gap(
            resume['parsed_text'],
            job_target['description']
        )

        # Store in database
        skill_gap_id = await Database.create_skill_gap(
            request.analysis_id,
            gap_data.get('current_skills', []),
            gap_data.get('required_skills', []),
            gap_data.get('gap_skills', []),
            gap_data.get('priority_order', [])
        )

        return SkillGapResponse(
            skill_gap_id=skill_gap_id,
            current_skills=gap_data.get('current_skills', []),
            required_skills=gap_data.get('required_skills', []),
            gap_skills=gap_data.get('gap_skills', []),
            priority_order=gap_data.get('priority_order', [])
        )

    except Exception as e:
        print(f"Skill gap error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/study-plan", response_model=StudyPlanResponse)
async def get_study_plan(request: StudyPlanRequest):
    """Generate personalized study plan"""
    try:
        # Get skill gap
        skill_gap = await Database.get_skill_gap(request.skill_gap_id)
        if not skill_gap:
            raise HTTPException(status_code=404, detail="Skill gap not found")

        # Generate study plan
        plan_data = await AIService.generate_study_plan(skill_gap, request.weeks)

        # Convert to WeekPlan objects
        weeks = []
        for week_data in plan_data.get('weeks', []):
            weeks.append(WeekPlan(
                week_number=week_data.get('week_number', 1),
                title=week_data.get('title', 'Week'),
                focus=week_data.get('focus', ''),
                topics=week_data.get('topics', []),
                actions=week_data.get('actions', []),
                resources=week_data.get('resources', [])
            ))

        # Store in database
        study_plan_id = await Database.create_study_plan(
            request.skill_gap_id,
            [w.dict() for w in weeks],
            request.weeks
        )

        return StudyPlanResponse(
            study_plan_id=study_plan_id,
            weeks=weeks,
            duration_weeks=request.weeks
        )

    except Exception as e:
        print(f"Study plan error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
