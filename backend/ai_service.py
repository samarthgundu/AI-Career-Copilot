import os
import json
from dotenv import load_dotenv

load_dotenv()

def call_gemini(prompt: str) -> str:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise Exception("Invalid API key. Please set GEMINI_API_KEY in backend/.env")
    
    from google import genai
    client = genai.Client(api_key=key)
    
    models = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite"]
    last_err = None
    
    for model_name in models:
        try:
            interaction = client.interactions.create(
                model=model_name,
                input=prompt
            )
            if interaction and hasattr(interaction, "output_text") and interaction.output_text:
                return interaction.output_text
        except Exception as e:
            last_err = e
            err_str = str(e)
            if "400" in err_str or "INVALID_ARGUMENT" in err_str or "API key not valid" in err_str:
                raise Exception("Invalid API key. Please set a valid GEMINI_API_KEY in backend/.env")
            continue
            
    if last_err:
        err_msg = str(last_err)
        if "quota" in err_msg.lower() or "429" in err_msg or "rate limit" in err_msg.lower():
            raise Exception("Gemini API rate limit reached (20 reqs/min). Please wait a few seconds and try again.")
        raise Exception(f"Gemini API Error: {err_msg}")
    raise Exception("Empty response received from Gemini API")

def clean_json_response(text: str) -> str:
    text = text.strip()
    if '```json' in text:
        text = text.split('```json')[1].split('```')[0]
    elif '```' in text:
        text = text.split('```')[1].split('```')[0]
    return text.strip()

class AIService:

    @staticmethod
    async def analyze_resume(resume_text: str, job_description: str) -> dict:
        """Analyze resume against job description using Gemini"""
        prompt = f"""You are an expert AI recruiter. Analyze this resume text against the target job description.
Return JSON ONLY with NO markdown, NO code blocks, using these exact keys:
{{
  "match_score": <integer 0-100>,
  "matching_skills": [<list of strings matching skills found in resume>],
  "missing_skills": [<list of strings of required skills missing from resume>],
  "improved_bullets": [<list of 5 customized improved bullet points tailored to the job>]
}}

Resume Text:
{resume_text}

Job Description:
{job_description}"""

        response_text = call_gemini(prompt)
        cleaned = clean_json_response(response_text)
        result = json.loads(cleaned)
        return {
            "match_score": int(result.get("match_score", 50)),
            "matching_skills": list(result.get("matching_skills", [])),
            "missing_skills": list(result.get("missing_skills", [])),
            "improved_bullets": list(result.get("improved_bullets", []))
        }

    @staticmethod
    async def check_ats(resume_text: str) -> dict:
        """Check ATS compliance of resume using Gemini"""
        prompt = f"""Evaluate the ATS (Applicant Tracking System) readability and formatting of this resume.
Return JSON ONLY with NO markdown, NO code blocks:
{{
  "ats_score": <integer 0-100>,
  "ats_issues": [<list of specific actionable formatting and section issues found>]
}}

Resume Text:
{resume_text}"""

        response_text = call_gemini(prompt)
        cleaned = clean_json_response(response_text)
        result = json.loads(cleaned)
        return {
            "ats_score": int(result.get("ats_score", 75)),
            "ats_issues": list(result.get("ats_issues", []))
        }

    @staticmethod
    async def rewrite_resume_bullets(resume_text: str, job_description: str) -> str:
        """Rewrite resume bullets to match job requirements using Gemini"""
        prompt = f"""Rewrite and optimize this resume content specifically for the target job description. 
Quantify achievements, add technical keywords, and fix formatting. Return the full updated resume in text format.

Original Resume:
{resume_text}

Target Job:
{job_description}"""

        return call_gemini(prompt)

    @staticmethod
    async def generate_interview_greeting(job_description: str, resume_text: str) -> tuple:
        """Generate interview greeting and dynamic first question using Gemini"""
        prompt = f"""You are a technical hiring manager conducting a job interview.
Based on the job description and candidate resume below, provide a JSON response ONLY with:
{{
  "greeting": "<warm greeting introducing yourself>",
  "first_question": "<specific first interview question based on candidate background and job requirements>"
}}

Job Description:
{job_description}

Resume:
{resume_text}"""

        try:
            res = call_gemini(prompt)
            cleaned = clean_json_response(res)
            data = json.loads(cleaned)
            return data.get("greeting", "Hello! Thanks for joining me today."), data.get("first_question", "Can you introduce yourself and tell me about your relevant experience?")
        except Exception:
            return "Hello! Welcome to your mock interview.", "Can you walk me through your technical background and experience?"

    @staticmethod
    async def evaluate_answer(user_answer: str, question: str, candidate_context: str) -> dict:
        """Evaluate a candidate's interview answer dynamically using Gemini"""
        prompt = f"""You are an interviewer evaluating a candidate's answer.
Analyze what the candidate specifically said and evaluate their performance.
Return JSON ONLY with NO markdown using these keys:
{{
  "score": <integer 0-100>,
  "strengths": "<specific analysis of what they answered well>",
  "improvement": "<actionable constructive feedback on what was missing>",
  "next_question": "<dynamic follow-up interview question based on their answer and job context>"
}}

Question Asked: {question}
Candidate's Answer: {user_answer}
Candidate Context: {candidate_context}"""

        response_text = call_gemini(prompt)
        cleaned = clean_json_response(response_text)
        result = json.loads(cleaned)
        return {
            "score": int(result.get("score", 70)),
            "strengths": str(result.get("strengths", "")),
            "improvement": str(result.get("improvement", "")),
            "next_question": str(result.get("next_question", ""))
        }

    @staticmethod
    async def analyze_skill_gap(resume_text: str, job_description: str) -> dict:
        """Analyze skill gaps using Gemini"""
        prompt = f"""Analyze the candidate's resume against the target job description to identify skill gaps.
Return JSON ONLY with NO markdown:
{{
  "current_skills": [<skills found in resume>],
  "required_skills": [<all skills required in job description>],
  "gap_skills": [<skills required but missing in resume>],
  "priority_order": [
    {{"skill": "<skill_name>", "impact": "<why it matters>", "priority_score": <0-100>}}
  ]
}}

Resume:
{resume_text}

Job Description:
{job_description}"""

        response_text = call_gemini(prompt)
        cleaned = clean_json_response(response_text)
        return json.loads(cleaned)

    @staticmethod
    async def generate_study_plan(skill_gap_data: dict, weeks: int = 4) -> dict:
        """Generate a personalized 4-week study plan using Gemini"""
        prompt = f"""Create a detailed {weeks}-week learning roadmap for a software developer to bridge these skill gaps:
Skill Gap Data: {json.dumps(skill_gap_data)}

Return JSON ONLY with NO markdown:
{{
  "weeks": [
    {{
      "week_number": 1,
      "title": "<Week title>",
      "focus": "<Main learning focus>",
      "topics": [<list of topics>],
      "actions": [<list of actionable projects/tutorials>],
      "resources": [<list of top documentation/learning resources>]
    }}
  ]
}}"""

        response_text = call_gemini(prompt)
        cleaned = clean_json_response(response_text)
        return json.loads(cleaned)
