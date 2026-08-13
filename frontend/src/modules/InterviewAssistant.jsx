import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare, Bot, User, Award, CheckCircle, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { startInterview, sendChatMessage } from '../services/api'
import ScoreGauge from '../components/ScoreGauge'

const InterviewAssistant = () => {
  const { resumeId, jobTargetId, showNotification } = useAppContext()
  const [sessionId, setSessionId] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [avgScore, setAvgScore] = useState(0)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, isThinking])

  const handleStartInterview = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please upload your resume and set target job first', 'error')
      return
    }

    setLoading(true)
    try {
      const result = await startInterview(jobTargetId, resumeId)
      setSessionId(result.session_id)
      setChatHistory([
        {
          type: 'interviewer',
          message: result.greeting,
          timestamp: new Date()
        },
        {
          type: 'interviewer',
          message: result.first_question,
          timestamp: new Date()
        }
      ])
      showNotification('AI Interview session initialized!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to start interview session',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e?.preventDefault()
    if (!userInput.trim() || !sessionId || isThinking) return

    const userMessage = userInput.trim()
    setUserInput('')

    setChatHistory(prev => [
      ...prev,
      {
        type: 'candidate',
        message: userMessage,
        timestamp: new Date()
      }
    ])

    setIsThinking(true)
    try {
      const result = await sendChatMessage(sessionId, userMessage, chatHistory)

      setChatHistory(prev => [
        ...prev,
        {
          type: 'interviewer',
          message: result.next_question,
          timestamp: new Date()
        }
      ])

      if (result.feedback) {
        setFeedback(result.feedback)
        setAvgScore(result.feedback.score)
      }

      if (result.is_complete) {
        showNotification('Interview session complete!', 'success')
      }
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to send message',
        'error'
      )
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden select-none bg-[#090D16]">
      
      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full border-r border-slate-800/80">
        
        {!sessionId ? (
          /* Pre-Interview Landing State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-2xl shadow-indigo-500/10">
              <MessageSquare size={40} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">AI Mock Interview Simulator</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed">
                Practice technical & behavioral interview questions evaluated dynamically by Gemini 3.6 Flash based on your uploaded resume and target job requirements.
              </p>
            </div>
            <motion.button
              onClick={handleStartInterview}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-3 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={20} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Initializing Session...' : 'Start Mock Interview'}</span>
            </motion.button>
          </div>
        ) : (
          /* Active Chat Conversation */
          <>
            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <AnimatePresence>
                {chatHistory.map((msg, idx) => {
                  const isCandidate = msg.type === 'candidate'

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex items-start gap-3 ${isCandidate ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md ${
                        isCandidate 
                          ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-cyan-500/20' 
                          : 'bg-slate-800 text-indigo-400 border border-slate-700'
                      }`}>
                        {isCandidate ? <User size={18} /> : <Bot size={18} />}
                      </div>

                      <div className={`max-w-xl p-4 md:p-5 rounded-2xl space-y-1 shadow-sm ${
                        isCandidate
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'glass-panel bg-slate-900/90 text-slate-100 rounded-tl-none border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 font-medium pb-1">
                          <span>{isCandidate ? 'You (Candidate)' : 'AI Interviewer'}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div className="glass-panel bg-slate-900/90 px-5 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-indigo-400"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span>Interviewer is evaluating your response...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 md:p-6 bg-[#0D1322] border-t border-slate-800">
              <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <textarea
                    rows={2}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        handleSendMessage(e)
                      }
                    }}
                    placeholder="Type your interview answer... (Press Ctrl+Enter to send)"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-all pr-24"
                    disabled={isThinking}
                  />
                  <span className="absolute right-3 bottom-3 text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded pointer-events-none">
                    Ctrl + Enter
                  </span>
                </div>

                <motion.button
                  type="submit"
                  disabled={!userInput.trim() || isThinking}
                  className="px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center transition-all disabled:opacity-40"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Send size={18} />
                </motion.button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Right Performance Sidebar */}
      {sessionId && (
        <aside className="w-full md:w-80 bg-[#0E1422] border-t md:border-t-0 md:border-l border-slate-800 p-6 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Award size={16} className="text-indigo-400" />
                Live Performance Meter
              </h3>
            </div>

            {/* Score Gauge */}
            <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center">
              <ScoreGauge score={avgScore} max={100} label="Response Score" />
            </div>

            {/* Feedback Breakdown */}
            {feedback && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle size={15} />
                    <span>Key Strengths</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{feedback.strengths}</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <AlertTriangle size={15} />
                    <span>Areas for Improvement</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{feedback.improvement}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800">
            <button
              onClick={() => {
                setSessionId(null)
                setChatHistory([])
                setFeedback(null)
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw size={14} />
              <span>Reset Interview Session</span>
            </button>
          </div>
        </aside>
      )}

    </div>
  )
}

export default InterviewAssistant
