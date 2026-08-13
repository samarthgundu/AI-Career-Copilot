import React, { useRef, useState } from 'react'
import { Upload, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const [jobDescriptionExpanded, setJobDescriptionExpanded] = useState(false)

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const result = await uploadResume(file)
      setResume(result.parsed_text)
      setResumeId(result.resume_id)
      showNotification('Resume uploaded successfully!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to upload resume',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleJobTargetChange = async () => {
    if (!jobTarget.title || !jobTarget.company) {
      showNotification('Please fill in job title and company', 'error')
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
      showNotification('Job target saved!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to save job target',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-secondary border-b border-slate-700 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">AI Career Copilot</h2>
            <p className="text-slate-400">Your personal career AI assistant</p>
          </div>
          <motion.button
            onClick={loadDemoData}
            className="px-4 py-2 bg-accent hover:bg-blue-600 text-primary font-semibold rounded-lg flex items-center gap-2 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={18} />
            Load Demo
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Resume Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              📄 Your Resume
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={loading}
              />
              {resume ? (
                <div className="text-green-400">
                  <div className="text-2xl mb-2">✓</div>
                  <p className="text-sm">Resume uploaded</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {resume.split('\n')[0]}
                  </p>
                </div>
              ) : (
                <div className="text-slate-400">
                  <Upload size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="font-semibold">Drop your resume here</p>
                  <p className="text-xs mt-1">or click to browse (PDF/DOCX)</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Target Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              🎯 Target Job
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTarget.title}
                onChange={(e) => setJobTarget({ ...jobTarget, title: e.target.value })}
                className="w-full px-3 py-2 bg-primary border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="Company"
                value={jobTarget.company}
                onChange={(e) => setJobTarget({ ...jobTarget, company: e.target.value })}
                className="w-full px-3 py-2 bg-primary border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => setJobDescriptionExpanded(!jobDescriptionExpanded)}
                className="text-xs text-slate-400 hover:text-accent transition-colors"
              >
                {jobDescriptionExpanded ? '▼' : '▶'} Job Description
              </button>
              {jobDescriptionExpanded && (
                <textarea
                  placeholder="Paste job description here..."
                  value={jobTarget.description}
                  onChange={(e) => setJobTarget({ ...jobTarget, description: e.target.value })}
                  className="w-full h-20 px-3 py-2 bg-primary border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-accent resize-none text-sm"
                />
              )}
              <motion.button
                onClick={handleJobTargetChange}
                disabled={loading}
                className="w-full px-4 py-2 bg-accent hover:bg-blue-600 text-primary font-semibold rounded-lg transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Saving...' : 'Save Job Target'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SharedHeader
