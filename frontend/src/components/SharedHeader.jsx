import React, { useRef, useState } from 'react'
import { Upload, Zap, Target, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { uploadResume, createJobTarget } from '../services/api'

const SharedHeader = () => {
  const { 
    resume, 
    setResume, 
    setResumeId,
    jobTarget, 
    setJobTarget, 
    setJobTargetId,
    loading, 
    setLoading, 
    showNotification,
    loadDemoData
  } = useAppContext()

  const fileInputRef = useRef(null)
  const [showTargetModal, setShowTargetModal] = useState(false)

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const result = await uploadResume(file)
      setResume(result.parsed_text)
      setResumeId(result.resume_id)
      showNotification('Resume parsed successfully with LlamaParse!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to upload resume',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleJobTargetSave = async (e) => {
    e?.preventDefault()
    if (!jobTarget.title || !jobTarget.company) {
      showNotification('Please fill in both Job Title and Company', 'error')
      return
    }

    setLoading(true)
    try {
      const result = await createJobTarget(
        jobTarget.title,
        jobTarget.company,
        jobTarget.description
      )
      setJobTargetId(result.job_target_id)
      setShowTargetModal(false)
      showNotification('Target job saved successfully!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to save target job',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="glass-header px-4 md:px-8 py-3.5 sticky top-0 z-30 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand Logo visible on Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-md">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">AI Career Copilot</span>
          </div>

          {/* Context Control Pills */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            
            {/* Resume Upload Pill */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={loading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  resume 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700/80 hover:border-purple-500/50 hover:bg-slate-800'
                }`}
              >
                {resume ? (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                    <span className="truncate max-w-[120px] md:max-w-[160px]">Resume Parsed</span>
                    <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-300 font-mono">Ready</span>
                  </>
                ) : (
                  <>
                    <Upload size={15} className="text-purple-400 flex-shrink-0" />
                    <span className="truncate">Upload Resume</span>
                  </>
                )}
              </button>
            </div>

            {/* Target Job Pill */}
            <button
              onClick={() => setShowTargetModal(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                jobTarget.title 
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/40 hover:bg-purple-500/20'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700/80 hover:border-purple-500/50 hover:bg-slate-800'
              }`}
            >
              <Target size={15} className={jobTarget.title ? 'text-purple-400 flex-shrink-0' : 'text-slate-400 flex-shrink-0'} />
              {jobTarget.title ? (
                <div className="flex items-center gap-1 truncate max-w-[140px] md:max-w-[220px]">
                  <span className="font-bold text-white truncate">{jobTarget.title}</span>
                  <span className="hidden sm:inline text-slate-400">@ {jobTarget.company}</span>
                </div>
              ) : (
                <span>Set Target Job</span>
              )}
              <ChevronRight size={14} className="opacity-60 flex-shrink-0" />
            </button>
          </div>

          {/* Load Demo Quick Action Button */}
          <motion.button
            onClick={loadDemoData}
            className="px-3.5 py-2 gradient-btn-primary text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all ml-auto md:ml-0"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Zap size={14} className="fill-current text-cyan-200" />
            <span className="hidden sm:inline">Load Demo Profile</span>
            <span className="sm:hidden">Demo</span>
          </motion.button>
        </div>
      </header>

      {/* Target Job Settings Modal */}
      <AnimatePresence>
        {showTargetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg glass-card bg-[#0B0F19]/95 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Target size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Target Role Configuration</h3>
                    <p className="text-xs text-slate-400">Gemini AI will analyze your resume against this job</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTargetModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleJobTargetSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={jobTarget.title}
                    onChange={(e) => setJobTarget({ ...jobTarget, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google / Microsoft / Tech Startup"
                    value={jobTarget.company}
                    onChange={(e) => setJobTarget({ ...jobTarget, company: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Job Description (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Paste job description, required skills, or key responsibilities..."
                    value={jobTarget.description}
                    onChange={(e) => setJobTarget({ ...jobTarget, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowTargetModal(false)}
                    className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 gradient-btn-primary text-white text-xs font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Saving Target...' : 'Save & Close'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SharedHeader
