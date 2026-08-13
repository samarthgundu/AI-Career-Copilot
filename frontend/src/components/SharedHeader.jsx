import React, { useRef, useState } from 'react'
import { Upload, Zap, FileCheck, Target, CheckCircle2, ChevronRight, X } from 'lucide-react'
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
      <header className="bg-[#0D1322]/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Active Context Badges */}
          <div className="flex items-center gap-4 flex-1">
            
            {/* Resume Upload Pill */}
            <div className="relative group">
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
                className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  resume 
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800'
                }`}
              >
                {resume ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span className="truncate max-w-[160px]">Resume Uploaded</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-300 font-mono">Parsed</span>
                  </>
                ) : (
                  <>
                    <Upload size={16} className="text-indigo-400" />
                    <span>Upload Resume (PDF/DOCX)</span>
                  </>
                )}
              </button>
            </div>

            {/* Target Job Pill */}
            <button
              onClick={() => setShowTargetModal(true)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                jobTarget.title 
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800'
              }`}
            >
              <Target size={16} className={jobTarget.title ? 'text-indigo-400' : 'text-slate-400'} />
              {jobTarget.title ? (
                <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                  <span className="font-bold text-white truncate">{jobTarget.title}</span>
                  <span className="text-slate-400">@ {jobTarget.company}</span>
                </div>
              ) : (
                <span>Set Target Job</span>
              )}
              <ChevronRight size={14} className="opacity-60" />
            </button>
          </div>

          {/* Quick Load Demo Action Button */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={loadDemoData}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap size={15} className="fill-current text-cyan-200" />
              <span>Load Demo Profile</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Target Job Settings Modal */}
      <AnimatePresence>
        {showTargetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg glass-panel bg-[#121827] border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Target size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Target Role Configuration</h3>
                </div>
                <button 
                  onClick={() => setShowTargetModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleJobTargetSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={jobTarget.title}
                    onChange={(e) => setJobTarget({ ...jobTarget, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google / Microsoft / Tech Startup"
                    value={jobTarget.company}
                    onChange={(e) => setJobTarget({ ...jobTarget, company: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Job Description (Optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Paste job requirements, required technologies, or responsibility bullet points here..."
                    value={jobTarget.description}
                    onChange={(e) => setJobTarget({ ...jobTarget, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowTargetModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
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
