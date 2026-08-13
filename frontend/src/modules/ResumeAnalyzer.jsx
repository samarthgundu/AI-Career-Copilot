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
      showNotification('Please upload your resume and set target job first', 'error')
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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 select-none pb-24 md:pb-8">
      
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 md:pb-6 border-b border-white/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold glass-vision-pill text-white">
              Module 01
            </span>
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">Resume Match & ATS Auditor</h1>
          </div>
          <p className="text-xs md:text-sm text-white/70">
            Gemini 3.6 Flash comparison against target job requirements & Applicant Tracking Systems.
          </p>
        </div>

        <motion.button
          onClick={handleAnalyze}
          disabled={loading || !resumeId || !jobTargetId}
          className="w-full sm:w-auto px-6 py-3.5 btn-vision-primary text-white font-bold text-xs md:text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
            className="space-y-6 md:space-y-8"
          >
            
            {/* Score Gauges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="glass-vision glass-vision-hover rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center">
                <ScoreGauge score={analysis.match_score} max={100} label="Job Match Score" />
              </div>
              <div className="glass-vision glass-vision-hover rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center">
                <ScoreGauge score={atsResult?.ats_score || 0} max={100} label="ATS Compliance Score" />
              </div>
            </div>

            {/* Matching & Missing Skills Matrix */}
            <div className="glass-vision rounded-3xl p-5 md:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} className="text-emerald-300 flex-shrink-0" />
                  <h3 className="text-sm md:text-base font-bold text-emerald-200">
                    Matching Skills Found ({analysis.matching_skills?.length || 0})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.matching_skills?.length > 0 ? (
                    analysis.matching_skills.map((skill, i) => (
                      <SkillChip key={i} skill={skill} type="matching" />
                    ))
                  ) : (
                    <p className="text-xs text-white/50 italic">No direct matching skills detected.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/15">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={18} className="text-rose-300 flex-shrink-0" />
                  <h3 className="text-sm md:text-base font-bold text-rose-200">
                    Missing Required Skills ({analysis.missing_skills?.length || 0})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills?.length > 0 ? (
                    analysis.missing_skills.map((skill, i) => (
                      <SkillChip key={i} skill={skill} type="missing" />
                    ))
                  ) : (
                    <p className="text-xs text-white/50 italic">All required job skills are covered!</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Tailored Bullet Rewrites */}
            {analysis.improved_bullets?.length > 0 && (
              <div className="glass-vision rounded-3xl p-5 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-white flex-shrink-0" />
                    <h3 className="text-base md:text-lg font-bold text-white">AI-Rewritten Impact Bullets</h3>
                  </div>
                  <span className="text-[10px] md:text-xs text-white/60 font-mono">ATS Keyphrase Optimized</span>
                </div>

                <div className="space-y-3">
                  {analysis.improved_bullets.map((bullet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-start justify-between gap-3 p-4 rounded-2xl glass-vision-pill border border-white/25 hover:border-white/40 transition-all shadow-md"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20 text-white font-bold text-xs flex-shrink-0 mt-0.5 border border-white/30">
                          {i + 1}
                        </span>
                        <p className="text-xs md:text-sm text-white/90 leading-relaxed font-medium">{bullet}</p>
                      </div>

                      <button
                        onClick={() => handleCopyBullet(bullet, i)}
                        className="p-2 rounded-xl bg-white/15 text-white/80 hover:text-white hover:bg-white/30 transition-colors flex-shrink-0 border border-white/20"
                        title="Copy to clipboard"
                      >
                        {copiedIdx === i ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ATS Compliance Checklist */}
            {atsResult?.ats_issues?.length > 0 && (
              <div className="glass-vision rounded-3xl p-5 md:p-8 border-l-4 border-amber-400 space-y-3">
                <div className="flex items-center gap-2 text-amber-200 font-bold text-sm md:text-base">
                  <FileCheck size={18} />
                  <h3>ATS Format & Parser Warnings</h3>
                </div>
                <ul className="space-y-2 text-xs md:text-sm text-white/80 font-medium">
                  {atsResult.ats_issues.map((issue, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
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
              className="w-full py-4 px-6 btn-vision-green text-white font-bold text-sm md:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
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
        <div className="glass-vision rounded-3xl p-8 md:p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto shadow-inner border border-white/30">
            <Sparkles size={32} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white">Ready for AI Analysis</h3>
          <p className="text-xs text-white/70 leading-relaxed font-medium">
            Upload your resume and select a target job above, then click <strong>"Analyze Resume"</strong> to run instant Gemini 3.6 Flash comparison.
          </p>
        </div>
      )}

    </div>
  )
}

export default ResumeAnalyzer
