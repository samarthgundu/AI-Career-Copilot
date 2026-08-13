from fastapi import APIRouter, HTTPException
from models import InterviewStartRequest, InterviewStartResponse, ChatMessage, ChatResponse, FeedbackData
from database import Database
from ai_service import AIService
import uuid

router = APIRouter()

@router.post("/interview/start", response_model=InterviewStartResponse)
async def start_interview(request: InterviewStartRequest):
    """Start an interview session"""
    try:
        # Get job target and resume
        job_target = await Database.get_job_target(request.job_target_id)
        resume = await Database.get_resume(request.resume_id)

        if not job_target or not resume:
            raise HTTPException(status_code=404, detail="Job target or resume not found")

        # Generate greeting and first question
        greeting, first_question = await AIService.generate_interview_greeting(
            job_target['description'],
            resume['parsed_text']
        )

        # Create interview session
        user_id = str(uuid.uuid4())  # In production, use authenticated user
        session_id = await Database.create_interview_session(
            user_id,
            request.job_target_id,
            greeting
        )

        return InterviewStartResponse(
            session_id=session_id,
            greeting=greeting,
            first_question=first_question
        )

    except Exception as e:
        print(f"Interview start error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interview/chat", response_model=ChatResponse)
async def handle_chat(request: ChatMessage):
    """Handle chat message during interview"""
    try:
        # Get session
        session = await Database.get_interview_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        # Get the last question (for context)
        chat_history = session.get('chat_history', [])
        last_question = ""
        for msg in reversed(chat_history):
            if msg.get('type') == 'interviewer':
                last_question = msg.get('message', '')
                break

        # Evaluate the answer
        evaluation = await AIService.evaluate_answer(
            request.user_message,
            last_question,
            ""  # Could add resume context here
        )

        # Prepare feedback
        feedback = FeedbackData(
            score=evaluation['score'],
            strengths=evaluation['strengths'],
            improvement=evaluation['improvement']
        )

        # Update chat history
        updated_history = chat_history + [
            {"type": "candidate", "message": request.user_message},
            {"type": "interviewer", "message": evaluation['next_question']}
        ]

        # Calculate average score
        scores = []
        for msg in updated_history:
            if msg.get('type') == 'feedback':
                scores.append(msg.get('score', 0))
        scores.append(evaluation['score'])
        avg_score = sum(scores) / len(scores) if scores else 0

        # Update session
        await Database.update_interview_session(request.session_id, updated_history, avg_score)

        # Check if interview should end (after 5 questions)
        question_count = sum(1 for msg in updated_history if msg.get('type') == 'interviewer')
        is_complete = question_count >= 5

        return ChatResponse(
            feedback=feedback,
            next_question=evaluation['next_question'] if not is_complete else "Great job! That concludes our interview.",
            is_complete=is_complete
        )

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
