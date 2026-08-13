from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Resume Models
class ResumeUploadResponse(BaseModel):
    resume_id: str
    parsed_text: str
    cloudinary_url: str
    filename: str

class ResumeInfo(BaseModel):
    id: str
    user_id: str
    cloudinary_url: str
    parsed_text: str
    filename: str
    created_at: datetime

# Job Target Models
class JobTargetCreate(BaseModel):
    title: str
    company: str
    description: str

class JobTargetResponse(BaseModel):
    job_target_id: str
    title: str
    company: str
    description: str

# Analysis Models
class AnalysisRequest(BaseModel):
    resume_id: str
    job_target_id: str

class AnalysisResponse(BaseModel):
    analysis_id: str
    match_score: int
    matching_skills: List[str]
    missing_skills: List[str]
    improved_bullets: List[str]

class ATSCheckRequest(BaseModel):
    resume_id: str

class ATSCheckResponse(BaseModel):
    ats_score: int
    ats_issues: List[str]

class ResumeRewriteRequest(BaseModel):
    resume_id: str
    job_target_id: str

class ResumeRewriteResponse(BaseModel):
    rewritten_text: str
    pdf_url: str

# Interview Models
class InterviewStartRequest(BaseModel):
    job_target_id: str
    resume_id: str

class InterviewStartResponse(BaseModel):
    session_id: str
    greeting: str
    first_question: str

class ChatMessage(BaseModel):
    session_id: str
    user_message: str
    chat_history: List[Dict[str, Any]]

class FeedbackData(BaseModel):
    score: int
    strengths: str
    improvement: str

class ChatResponse(BaseModel):
    feedback: Optional[FeedbackData]
    next_question: str
    is_complete: bool

# Skill Gap Models
class SkillGapRequest(BaseModel):
    analysis_id: str

class SkillGapResponse(BaseModel):
    skill_gap_id: str
    current_skills: List[str]
    required_skills: List[str]
    gap_skills: List[str]
    priority_order: List[Dict[str, Any]]

# Study Plan Models
class StudyPlanRequest(BaseModel):
    skill_gap_id: str
    weeks: int = 4

class WeekPlan(BaseModel):
    week_number: int
    title: str
    focus: str
    topics: List[str]
    actions: List[str]
    resources: Optional[List[str]] = []

class StudyPlanResponse(BaseModel):
    study_plan_id: str
    weeks: List[WeekPlan]
    duration_weeks: int
