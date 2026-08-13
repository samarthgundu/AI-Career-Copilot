import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare, Bot, User, Award, CheckCircle, AlertTriangle, Sparkles, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react'
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
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
    <div className="h-full flex flex-col md:flex-row overflow-hidden select-none pb-16 md:pb-0">
      
      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col h-full border-r border-white/20 relative min-w-0">
        
        {!sessionId ? (
          /* Pre-Interview Landing State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl glass-vision text-white flex items-center justify-center shadow-2xl border border-white/40">
              <MessageSquare size={36} />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">AI Mock Interview Simulator</h2>
              <p className="text-xs md:text-sm text-white/70 mt-2 leading-relaxed font-medium">
                Practice technical & behavioral questions evaluated dynamically by Gemini 3.6 Flash based on your resume and target job.
              </p>
            </div>
            <motion.button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 btn-vision-primary text-white font-bold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={18} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Initializing Session...' : 'Start Mock Interview'}</span>
            </motion.button>
          </div>
        ) : (
          /* Active Chat Conversation */
          <>
            {/* Mobile Score Bar Toggle */}
            <div className="md:hidden glass-vision-header p-3 flex items-center justify-between border-b border-white/20">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-white" />
                <span className="text-xs font-bold text-white">Live AI Score: <span className="text-white font-mono">{avgScore}%</span></span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="px-2.5 py-1 rounded-lg glass-vision-pill text-xs font-bold text-white flex items-center gap-1 border border-white/30"
              >
                <span>{mobileDrawerOpen ? 'Hide Feedback' : 'View Feedback'}</span>
                {mobileDrawerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
              <AnimatePresence>
                {chatHistory.map((msg, idx) => {
                  const isCandidate = msg.type === 'candidate'

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex items-start gap-2.5 ${isCandidate ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md border ${
                        isCandidate 
                          ? 'bg-white/30 border-white/40' 
                          : 'bg-black/30 border-white/30'
                      }`}>
                        {isCandidate ? <User size={16} /> : <Bot size={16} />}
                      </div>

                      <div className={`max-w-[85%] sm:max-w-xl p-3.5 md:p-5 rounded-2xl space-y-1 ${
                        isCandidate
                          ? 'glass-vision bg-white/30 text-white rounded-tr-none border-white/40 shadow-lg'
                          : 'glass-vision bg-black/30 text-white/95 rounded-tl-none border-white/20 shadow-md'
                      }`}>
                        <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-medium pb-0.5">
                          <span>{isCandidate ? 'You' : 'AI Interviewer'}</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.message}</p>
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
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-black/30 text-white flex items-center justify-center border border-white/30 shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="glass-vision bg-black/30 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-white/80 border-white/20">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span className="font-medium">Evaluating answer...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 md:p-6 glass-vision-header border-t border-white/20">
              <form onSubmit={handleSendMessage} className="flex gap-2.5 items-end max-w-4xl mx-auto">
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
                    placeholder="Type your interview answer... (Ctrl+Enter to send)"
                    className="w-full px-3.5 py-2.5 bg-black/30 border border-white/30 rounded-2xl text-white text-xs md:text-sm placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-black/40 resize-none transition-all pr-20 shadow-sm"
                    disabled={isThinking}
                  />
                  <span className="hidden sm:inline absolute right-3 bottom-3 text-[9px] font-mono text-white/60 bg-white/10 px-1.5 py-0.5 rounded pointer-events-none border border-white/20">
                    Ctrl+Enter
                  </span>
                </div>

                <motion.button
                  type="submit"
                  disabled={!userInput.trim() || isThinking}
                  className="px-4 py-3.5 btn-vision-primary text-white font-bold rounded-2xl shadow-md flex items-center justify-center transition-all disabled:opacity-40"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Send size={16} />
                </motion.button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Right Performance Sidebar */}
      {sessionId && (
        <aside className={`${mobileDrawerOpen ? 'block' : 'hidden md:block'} w-full md:w-80 glass-vision border-t md:border-t-0 md:border-l border-white/20 p-6 overflow-y-auto flex flex-col justify-between`}>
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/20">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Award size={16} className="text-white" />
                Live Performance Meter
              </h3>
            </div>

            {/* Score Gauge */}
            <div className="glass-vision rounded-3xl p-4 flex flex-col items-center justify-center">
              <ScoreGauge score={avgScore} max={100} label="Response Score" />
            </div>

            {/* Feedback Breakdown */}
            {feedback && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl glass-vision-pill border border-emerald-400/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-200 font-bold text-xs">
                    <CheckCircle size={14} className="text-emerald-300" />
                    <span>Key Strengths</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">{feedback.strengths}</p>
                </div>

                <div className="p-4 rounded-2xl glass-vision-pill border border-amber-400/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-200 font-bold text-xs">
                    <AlertTriangle size={14} className="text-amber-300" />
                    <span>Areas for Improvement</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-medium">{feedback.improvement}</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/20 mt-4">
            <button
              onClick={() => {
                setSessionId(null)
                setChatHistory([])
                setFeedback(null)
              }}
              className="w-full py-2.5 px-4 rounded-xl glass-vision-pill hover:bg-white/30 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/30"
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
