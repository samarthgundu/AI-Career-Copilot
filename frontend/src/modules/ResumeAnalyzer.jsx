import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { analyzeResume, checkATS, rewriteResume } from '../services/api'
import ScoreGauge from '../components/ScoreGauge'
import SkillChip from '../components/SkillChip'
import { Download, Sparkles, AlertCircle, FileCheck, CheckCircle, Copy, Check } from 'lucide-react'

const ResumeAnalyzer = () => {
  const { resumeId, jobTargetId, showNotification } = useAppContext()
  const [analysis, setAnalysis] = useState(null)
  const [atsResult, setAtsResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)

  const handleAnalyze = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please upload your resume and configure target job first', 'error')
      return
    }

    setLoading(true)
    try {
      const [analysisData, atsData] = await Promise.all([
        analyzeResume(resumeId, jobTargetId),
        checkATS(resumeId)
      ])
      setAnalysis(analysisData)
      setAtsResult(atsData)
      showNotification('Resume analysis & ATS audit complete!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Analysis failed',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadResume = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please complete analysis first', 'error')
      return
    }

    setDownloading(true)
    try {
      const result = await rewriteResume(resumeId, jobTargetId)
      const link = document.createElement('a')
      link.href = result.pdf_url
      link.download = 'optimized-resume.pdf'
      link.click()
      showNotification('Optimized Resume downloaded!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Download failed',
        'error'
      )
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyBullet = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(index)
    setTimeout(() => setCopiedIdx(null), 2000)
    showNotification('Bullet point copied to clipboard!', 'info')
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Module 01
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Resume Match & ATS Auditor</h1>
          </div>
          <p className="text-sm text-slate-400">
            Instant Gemini AI comparison against your target job requirements & Applicant Tracking Systems.
          </p>
        </div>

        <motion.button
          onClick={handleAnalyze}
          disabled={loading || !resumeId || !jobTargetId}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles size={18} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Analyzing with Gemini...' : 'Analyze Resume'}</span>
        </motion.button>
      </div>

      {analysis ? (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            
            {/* Score Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col items-center justify-center">
                <ScoreGauge score={analysis.match_score} max={100} label="Job Match Score" />
              </div>
              <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col items-center justify-center">
                <ScoreGauge score={atsResult?.ats_score || 0} max={100} label="ATS Compliance Score" />
              </div>
            </div>

            {/* Matching & Missing Skills Matrix */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} className="text-emerald-400" />
                  <h3 className="text-base font-bold text-emerald-300">
                    Matching Skills Found ({analysis.matching_skills?.length || 0})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {analysis.matching_skills?.length > 0 ? (
                    analysis.matching_skills.map((skill, i) => (
                      <SkillChip key={i} skill={skill} type="matching" />
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No direct matching skills detected.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={18} className="text-rose-400" />
                  <h3 className="text-base font-bold text-rose-300">
                    Missing Required Skills ({analysis.missing_skills?.length || 0})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {analysis.missing_skills?.length > 0 ? (
                    analysis.missing_skills.map((skill, i) => (
                      <SkillChip key={i} skill={skill} type="missing" />
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">All required job skills are covered!</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Tailored Bullet Rewrites */}
            {analysis.improved_bullets?.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={20} className="text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">AI-Rewritten Impact Bullets</h3>
                  </div>
                  <span className="text-xs text-slate-400">Optimized for ATS keyphrases</span>
                </div>

                <div className="space-y-3">
                  {analysis.improved_bullets.map((bullet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-200 leading-relaxed">{bullet}</p>
                      </div>

                      <button
                        onClick={() => handleCopyBullet(bullet, i)}
                        className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === i ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ATS Compliance Checklist */}
            {atsResult?.ats_issues?.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 md:p-8 border-l-4 border-amber-500 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <FileCheck size={20} />
                  <h3>ATS Format & Parser Warnings</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {atsResult.ats_issues.map((issue, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Bar */}
            <motion.button
              onClick={handleDownloadResume}
              disabled={downloading}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Download size={20} />
              <span>{downloading ? 'Generating PDF...' : 'Download Tailored Resume PDF'}</span>
            </motion.button>

          </motion.div>
        </AnimatePresence>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Sparkles size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">Ready for AI Analysis</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload your resume and select a target job above, then click <strong>"Analyze Resume"</strong> to run instant Gemini 3.6 Flash comparison.
          </p>
        </div>
      )}

    </div>
  )
}

export default ResumeAnalyzer
