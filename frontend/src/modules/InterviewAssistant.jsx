import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, TrendingUp } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { startInterview, sendChatMessage } from '../services/api'

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
  }, [chatHistory])

  const handleStartInterview = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please upload resume and set target job first', 'error')
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
      showNotification('Interview started!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to start interview',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || !sessionId) return

    const userMessage = userInput
    setUserInput('')

    // Add user message to chat
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

      // Add AI response
      setChatHistory(prev => [
        ...prev,
        {
          type: 'interviewer',
          message: result.next_question,
          timestamp: new Date()
        }
      ])

      // Update feedback
      if (result.feedback) {
        setFeedback(result.feedback)
        setAvgScore(result.feedback.score)
      }

      if (result.is_complete) {
        showNotification('Interview completed!', 'success')
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
    <div className="flex h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!sessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle size={64} className="mb-4 opacity-30" />
            <h2 className="text-3xl font-bold mb-3">AI Interview Assistant</h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Practice answering interview questions with real-time AI feedback. Get personalized suggestions to improve your responses.
            </p>
            <motion.button
              onClick={handleStartInterview}
              disabled={loading}
              className="px-8 py-4 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Starting...' : 'Start Interview'}
            </motion.button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <AnimatePresence>
                {chatHistory.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.type === 'candidate' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-6 py-4 rounded-xl ${
                        msg.type === 'candidate'
                          ? 'bg-accent text-primary rounded-br-none'
                          : 'bg-secondary text-white rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                      <span className="text-xs opacity-70 mt-2 block">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="flex items-center gap-2 bg-secondary px-6 py-4 rounded-xl">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-accent rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-400 ml-2">
                      Interviewer is thinking...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-secondary border-t border-slate-700">
              <div className="flex gap-4">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSendMessage()
                    }
                  }}
                  placeholder="Type your answer here... (Ctrl+Enter to send)"
                  className="flex-1 px-4 py-3 bg-primary border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-none"
                  rows="3"
                  disabled={isThinking}
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isThinking}
                  className="px-6 h-full bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Side Panel - Feedback */}
      {sessionId && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-72 bg-secondary border-l border-slate-700 p-6 overflow-y-auto"
        >
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-accent" />
                <h3 className="font-bold">Average Score</h3>
              </div>
              <div className="text-4xl font-bold text-accent">{avgScore}</div>
              <div className="text-xs text-slate-400 mt-1">/100</div>
            </div>

            {feedback && (
              <div className="space-y-4 pt-6 border-t border-slate-700">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">
                    ✓ Strengths
                  </h4>
                  <p className="text-sm text-slate-300">
                    {feedback.strengths}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">
                    △ Areas to Improve
                  </h4>
                  <p className="text-sm text-slate-300">
                    {feedback.improvement}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="text-xs text-slate-500 text-center">
                    Keep practicing to improve your score!
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default InterviewAssistant
