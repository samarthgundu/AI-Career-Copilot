import os
import uuid
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SECRET_KEY")
    or os.getenv("SUPABASE_SERVICE_KEY")
    or os.getenv("SUPABASE_PUBLISHABLE_KEY")
    or ""
)

# Try to connect to Supabase, but provide fallback for demo mode
try:
    from supabase import create_client, Client
    print(f"[Supabase] Attempting connection to: {SUPABASE_URL}")
    print(f"[Supabase] Key preview: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "[Supabase] Key: None")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"[Supabase] Connected successfully!")
    HAS_SUPABASE = True
except Exception as e:
    print(f"[Supabase] Connection failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    print(f"[Supabase] Running in demo/fallback mode.")
    supabase = None
    HAS_SUPABASE = False

class Database:
    @staticmethod
    async def ensure_user_exists(user_id: str, email: str = None) -> str:
        if not HAS_SUPABASE or not user_id:
            return user_id
        try:
            res = supabase.table("users").select("id").eq("id", user_id).execute()
            if not res.data:
                user_email = email or f"user_{user_id[:8]}@example.com"
                supabase.table("users").insert({
                    "id": user_id,
                    "email": user_email
                }).execute()
        except Exception as e:
            print(f"ensure_user_exists error: {e}")
        return user_id

    @staticmethod
    async def create_user(email: str) -> str:
        try:
            user_id = str(uuid.uuid4())
            if HAS_SUPABASE:
                supabase.table("users").insert({
                    "id": user_id,
                    "email": email,
                }).execute()
            return user_id
        except Exception as e:
            print(f"User creation error: {e}")
            return str(uuid.uuid4())

    @staticmethod
    async def create_resume(user_id: str, cloudinary_url: str, parsed_text: str, filename: str) -> str:
        resume_id = str(uuid.uuid4())
        try:
            if HAS_SUPABASE:
                await Database.ensure_user_exists(user_id)
                supabase.table("resumes").insert({
                    "id": resume_id,
                    "user_id": user_id,
                    "cloudinary_url": cloudinary_url,
                    "parsed_text": parsed_text,
                    "filename": filename,
                }).execute()
        except Exception as e:
            print(f"Resume creation error: {e}")
        return resume_id

    @staticmethod
    async def get_resume(resume_id: str) -> dict:
        try:
            if HAS_SUPABASE:
                result = supabase.table("resumes").select("*").eq("id", resume_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Resume retrieval error: {e}")
        return None

    @staticmethod
    async def create_job_target(user_id: str, title: str, company: str, description: str) -> str:
        job_target_id = str(uuid.uuid4())
        try:
            if HAS_SUPABASE:
                await Database.ensure_user_exists(user_id)
                supabase.table("job_targets").insert({
                    "id": job_target_id,
                    "user_id": user_id,
                    "title": title,
                    "company": company,
                    "description": description,
                }).execute()
        except Exception as e:
            print(f"Job target creation error: {e}")
        return job_target_id

    @staticmethod
    async def get_job_target(job_target_id: str) -> dict:
        try:
            if HAS_SUPABASE:
                result = supabase.table("job_targets").select("*").eq("id", job_target_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Job target retrieval error: {e}")
        return None

    @staticmethod
    async def create_analysis(resume_id: str, job_target_id: str, match_score: int, ats_score: int, 
                            matching_skills: list, missing_skills: list, improved_bullets: list, ats_issues: list) -> str:
        analysis_id = str(uuid.uuid4())
        try:
            if HAS_SUPABASE:
                supabase.table("analyses").insert({
                    "id": analysis_id,
                    "resume_id": resume_id,
                    "job_target_id": job_target_id,
                    "match_score": match_score,
                    "ats_score": ats_score,
                    "matching_skills": matching_skills,
                    "missing_skills": missing_skills,
                    "improved_bullets": improved_bullets,
                    "ats_issues": ats_issues,
                }).execute()
        except Exception as e:
            print(f"Analysis creation error: {e}")
        return analysis_id

    @staticmethod
    async def get_analysis(analysis_id: str) -> dict:
        try:
            if HAS_SUPABASE:
                result = supabase.table("analyses").select("*").eq("id", analysis_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Analysis retrieval error: {e}")
        return None

    @staticmethod
    async def create_interview_session(user_id: str, job_target_id: str, initial_message: str) -> str:
        session_id = str(uuid.uuid4())
        try:
            if HAS_SUPABASE:
                await Database.ensure_user_exists(user_id)
                supabase.table("interview_sessions").insert({
                    "id": session_id,
                    "user_id": user_id,
                    "job_target_id": job_target_id,
                    "chat_history": [{"type": "interviewer", "message": initial_message}],
                    "avg_score": 0,
                }).execute()
        except Exception as e:
            print(f"Interview session creation error: {e}")
        return session_id

    @staticmethod
    async def get_interview_session(session_id: str) -> dict:
        try:
            if HAS_SUPABASE:
                result = supabase.table("interview_sessions").select("*").eq("id", session_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Interview session retrieval error: {e}")
        return {"id": session_id, "chat_history": [], "avg_score": 0}

    @staticmethod
    async def update_interview_session(session_id: str, chat_history: list, avg_score: float):
        try:
            if HAS_SUPABASE:
                supabase.table("interview_sessions").update({
                    "chat_history": chat_history,
                    "avg_score": avg_score,
                }).eq("id", session_id).execute()
        except Exception as e:
            print(f"Interview session update error: {e}")

    @staticmethod
    async def create_skill_gap(analysis_id: str, current_skills: list, required_skills: list, 
                             gap_skills: list, priority_order: list) -> str:
        skill_gap_id = str(uuid.uuid4())
        try:
            if HAS_SUPABASE:
                supabase.table("skill_gaps").insert({
                    "id": skill_gap_id,
                    "analysis_id": analysis_id,
                    "current_skills": current_skills,
                    "required_skills": required_skills,
                    "gap_skills": gap_skills,
                    "priority_order": priority_order,
                }).execute()
        except Exception as e:
            print(f"Skill gap creation error: {e}")
        return skill_gap_id

    @staticmethod
    async def get_skill_gap(skill_gap_id: str) -> dict:
        try:
            if HAS_SUPABASE:
                result = supabase.table("skill_gaps").select("*").eq("id", skill_gap_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Skill gap retrieval error: {e}")
        return None

    @staticmethod
    async def create_study_plan(skill_gap_id: str, plan: list, duration_weeks: int) -> str:
        study_plan_id = str(uuid.uuid4())
        try:
            if HAS_SUPABASE:
                supabase.table("study_plans").insert({
                    "id": study_plan_id,
                    "skill_gap_id": skill_gap_id,
                    "plan": plan,
                    "duration_weeks": duration_weeks,
                }).execute()
        except Exception as e:
            print(f"Study plan creation error: {e}")
        return study_plan_id

    @staticmethod
    async def get_study_plan(study_plan_id: str) -> dict:
        try:
            if HAS_SUPABASE:
                result = supabase.table("study_plans").select("*").eq("id", study_plan_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Study plan retrieval error: {e}")
        return None
