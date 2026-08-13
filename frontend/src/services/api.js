import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await axios.post(`${API_BASE_URL}/resume/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const createJobTarget = async (title, company, description) => {
  const response = await api.post('/job-target', {
    title,
    company,
    description,
  })
  return response.data
}

export const analyzeResume = async (resumeId, jobTargetId) => {
  const response = await api.post('/analyze', {
    resume_id: resumeId,
    job_target_id: jobTargetId,
  })
  return response.data
}

export const checkATS = async (resumeId) => {
  const response = await api.post('/ats-check', {
    resume_id: resumeId,
  })
  return response.data
}

export const rewriteResume = async (resumeId, jobTargetId) => {
  const response = await api.post('/resume/rewrite', {
    resume_id: resumeId,
    job_target_id: jobTargetId,
  })
  return response.data
}

export const startInterview = async (jobTargetId, resumeId) => {
  const response = await api.post('/interview/start', {
    job_target_id: jobTargetId,
    resume_id: resumeId,
  })
  return response.data
}

export const sendChatMessage = async (sessionId, userMessage, chatHistory) => {
  const response = await api.post('/interview/chat', {
    session_id: sessionId,
    user_message: userMessage,
    chat_history: chatHistory,
  })
  return response.data
}

export const getSkillGap = async (analysisId) => {
  const response = await api.post('/skill-gap', {
    analysis_id: analysisId,
  })
  return response.data
}

export const getStudyPlan = async (skillGapId, weeks = 4) => {
  const response = await api.post('/study-plan', {
    skill_gap_id: skillGapId,
    weeks,
  })
  return response.data
}

export default api
