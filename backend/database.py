import os
import uuid
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")

# Global in-memory cache fallback to ensure 100% uptime even if Supabase is offline/misconfigured
IN_MEMORY_STORE = {
    "users": {},
    "resumes": {},
    "job_targets": {},
    "analyses": {},
    "interview_sessions": {},
    "skill_gaps": {},
    "study_plans": {}
}

HAS_SUPABASE = False
supabase = None

if SUPABASE_URL:
    try:
        from supabase import create_client, Client
        print(f"[Supabase] Attempting connection to: {SUPABASE_URL}")

        key_candidates = [
            os.getenv("SUPABASE_KEY"),
            os.getenv("SUPABASE_PUBLISHABLE_KEY"),
            os.getenv("SUPABASE_ANON_KEY"),
            os.getenv("SUPABASE_SECRET_KEY"),
            os.getenv("SUPABASE_SERVICE_KEY"),
        ]
        key_candidates = [k for k in key_candidates if k and not k.startswith("your_")]

        for key in key_candidates:
            try:
                print(f"[Supabase] Testing key candidate: {key[:15]}...")
                client: Client = create_client(SUPABASE_URL, key)
                if client:
                    supabase = client
                    HAS_SUPABASE = True
                    print(f"[Supabase] Connected successfully!")
                    break
            except Exception as key_err:
                print(f"[Supabase] Key candidate failed ({key_err})")

    except Exception as e:
        print(f"[Supabase] Connection error: {e}")
        supabase = None
        HAS_SUPABASE = False

if not HAS_SUPABASE:
    print("[Supabase] Running with resilient in-memory store.")

class Database:
    @staticmethod
    async def ensure_user_exists(user_id: str, email: str = None) -> str:
        IN_MEMORY_STORE["users"][user_id] = {"id": user_id, "email": email or f"user_{user_id[:8]}@example.com"}
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
            print(f"ensure_user_exists note: {e}")
        return user_id

    @staticmethod
    async def create_user(email: str) -> str:
        user_id = str(uuid.uuid4())
        IN_MEMORY_STORE["users"][user_id] = {"id": user_id, "email": email}
        try:
            if HAS_SUPABASE:
                supabase.table("users").insert({
                    "id": user_id,
                    "email": email,
                }).execute()
        except Exception as e:
            print(f"User creation note: {e}")
        return user_id

    @staticmethod
    async def create_resume(user_id: str, cloudinary_url: str, parsed_text: str, filename: str) -> str:
        resume_id = str(uuid.uuid4())
        data = {
            "id": resume_id,
            "user_id": user_id,
            "cloudinary_url": cloudinary_url,
            "parsed_text": parsed_text,
            "filename": filename,
        }
        IN_MEMORY_STORE["resumes"][resume_id] = data
        try:
            if HAS_SUPABASE:
                await Database.ensure_user_exists(user_id)
                supabase.table("resumes").insert(data).execute()
        except Exception as e:
            print(f"Resume database note: {e}")
        return resume_id

    @staticmethod
    async def get_resume(resume_id: str) -> dict:
        if resume_id in IN_MEMORY_STORE["resumes"]:
            return IN_MEMORY_STORE["resumes"][resume_id]
        try:
            if HAS_SUPABASE:
                result = supabase.table("resumes").select("*").eq("id", resume_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Resume retrieval note: {e}")
        return None

    @staticmethod
    async def create_job_target(user_id: str, title: str, company: str, description: str) -> str:
        job_target_id = str(uuid.uuid4())
        data = {
            "id": job_target_id,
            "user_id": user_id,
            "title": title,
            "company": company,
            "description": description or f"{title} role at {company}",
        }
        IN_MEMORY_STORE["job_targets"][job_target_id] = data
        try:
            if HAS_SUPABASE:
                await Database.ensure_user_exists(user_id)
                supabase.table("job_targets").insert(data).execute()
        except Exception as e:
            print(f"Job target database note: {e}")
        return job_target_id

    @staticmethod
    async def get_job_target(job_target_id: str) -> dict:
        if job_target_id in IN_MEMORY_STORE["job_targets"]:
            return IN_MEMORY_STORE["job_targets"][job_target_id]
        try:
            if HAS_SUPABASE:
                result = supabase.table("job_targets").select("*").eq("id", job_target_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Job target retrieval note: {e}")
        return None

    @staticmethod
    async def create_analysis(resume_id: str, job_target_id: str, match_score: int, ats_score: int, 
                            matching_skills: list, missing_skills: list, improved_bullets: list, ats_issues: list) -> str:
        analysis_id = str(uuid.uuid4())
        data = {
            "id": analysis_id,
            "resume_id": resume_id,
            "job_target_id": job_target_id,
            "match_score": match_score,
            "ats_score": ats_score,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "improved_bullets": improved_bullets,
            "ats_issues": ats_issues,
        }
        IN_MEMORY_STORE["analyses"][analysis_id] = data
        try:
            if HAS_SUPABASE:
                supabase.table("analyses").insert(data).execute()
        except Exception as e:
            print(f"Analysis database note: {e}")
        return analysis_id

    @staticmethod
    async def get_analysis(analysis_id: str) -> dict:
        if analysis_id in IN_MEMORY_STORE["analyses"]:
            return IN_MEMORY_STORE["analyses"][analysis_id]
        try:
            if HAS_SUPABASE:
                result = supabase.table("analyses").select("*").eq("id", analysis_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Analysis retrieval note: {e}")
        return None

    @staticmethod
    async def create_interview_session(user_id: str, job_target_id: str, initial_message: str) -> str:
        session_id = str(uuid.uuid4())
        data = {
            "id": session_id,
            "user_id": user_id,
            "job_target_id": job_target_id,
            "chat_history": [{"type": "interviewer", "message": initial_message}],
            "avg_score": 0,
        }
        IN_MEMORY_STORE["interview_sessions"][session_id] = data
        try:
            if HAS_SUPABASE:
                await Database.ensure_user_exists(user_id)
                supabase.table("interview_sessions").insert(data).execute()
        except Exception as e:
            print(f"Interview session creation note: {e}")
        return session_id

    @staticmethod
    async def get_interview_session(session_id: str) -> dict:
        if session_id in IN_MEMORY_STORE["interview_sessions"]:
            return IN_MEMORY_STORE["interview_sessions"][session_id]
        try:
            if HAS_SUPABASE:
                result = supabase.table("interview_sessions").select("*").eq("id", session_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Interview session retrieval note: {e}")
        return {"id": session_id, "chat_history": [], "avg_score": 0}

    @staticmethod
    async def update_interview_session(session_id: str, chat_history: list, avg_score: float):
        if session_id in IN_MEMORY_STORE["interview_sessions"]:
            IN_MEMORY_STORE["interview_sessions"][session_id]["chat_history"] = chat_history
            IN_MEMORY_STORE["interview_sessions"][session_id]["avg_score"] = avg_score
        try:
            if HAS_SUPABASE:
                supabase.table("interview_sessions").update({
                    "chat_history": chat_history,
                    "avg_score": avg_score,
                }).eq("id", session_id).execute()
        except Exception as e:
            print(f"Interview session update note: {e}")

    @staticmethod
    async def create_skill_gap(analysis_id: str, current_skills: list, required_skills: list, 
                             gap_skills: list, priority_order: list) -> str:
        skill_gap_id = str(uuid.uuid4())
        data = {
            "id": skill_gap_id,
            "analysis_id": analysis_id,
            "current_skills": current_skills,
            "required_skills": required_skills,
            "gap_skills": gap_skills,
            "priority_order": priority_order,
        }
        IN_MEMORY_STORE["skill_gaps"][skill_gap_id] = data
        try:
            if HAS_SUPABASE:
                supabase.table("skill_gaps").insert(data).execute()
        except Exception as e:
            print(f"Skill gap creation note: {e}")
        return skill_gap_id

    @staticmethod
    async def get_skill_gap(skill_gap_id: str) -> dict:
        if skill_gap_id in IN_MEMORY_STORE["skill_gaps"]:
            return IN_MEMORY_STORE["skill_gaps"][skill_gap_id]
        try:
            if HAS_SUPABASE:
                result = supabase.table("skill_gaps").select("*").eq("id", skill_gap_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Skill gap retrieval note: {e}")
        return None

    @staticmethod
    async def create_study_plan(skill_gap_id: str, plan: list, duration_weeks: int) -> str:
        study_plan_id = str(uuid.uuid4())
        data = {
            "id": study_plan_id,
            "skill_gap_id": skill_gap_id,
            "plan": plan,
            "duration_weeks": duration_weeks,
        }
        IN_MEMORY_STORE["study_plans"][study_plan_id] = data
        try:
            if HAS_SUPABASE:
                supabase.table("study_plans").insert(data).execute()
        except Exception as e:
            print(f"Study plan creation note: {e}")
        return study_plan_id

    @staticmethod
    async def get_study_plan(study_plan_id: str) -> dict:
        if study_plan_id in IN_MEMORY_STORE["study_plans"]:
            return IN_MEMORY_STORE["study_plans"][study_plan_id]
        try:
            if HAS_SUPABASE:
                result = supabase.table("study_plans").select("*").eq("id", study_plan_id).execute()
                if result.data:
                    return result.data[0]
        except Exception as e:
            print(f"Study plan retrieval note: {e}")
        return None
