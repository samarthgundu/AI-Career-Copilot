import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { analyzeResume, checkATS, rewriteResume } from '../services/api'
import ScoreGauge from '../components/ScoreGauge'
import SkillChip from '../components/SkillChip'
import { Download, Sparkles } from 'lucide-react'

const ResumeAnalyzer = () => {
  const { resumeId, jobTargetId, showNotification } = useAppContext()
  const [analysis, setAnalysis] = useState(null)
  const [atsResult, setAtsResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please upload resume and set target job first', 'error')
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
      showNotification('Analysis complete!', 'success')
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

    setLoading(true)
    try {
      const result = await rewriteResume(resumeId, jobTargetId)
      const link = document.createElement('a')
      link.href = result.pdf_url
      link.download = 'optimized-resume.pdf'
      link.click()
      showNotification('Resume downloaded!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Download failed',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-slate-400">
              Get detailed insights on how your resume matches the target job
            </p>
          </div>
          <motion.button
            onClick={handleAnalyze}
            disabled={loading || !resumeId || !jobTargetId}
            className="px-6 py-3 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={20} />
            {loading ? 'Analyzing...' : 'Analyze Now'}
          </motion.button>
        </div>

        {analysis ? (
          <div className="space-y-8">
            {/* Scores Section */}
            <div className="grid grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary rounded-xl p-8"
              >
                <h3 className="text-lg font-semibold mb-6 text-slate-200">
                  Match Score
                </h3>
                <ScoreGauge score={analysis.match_score} max={100} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary rounded-xl p-8"
              >
                <h3 className="text-lg font-semibold mb-6 text-slate-200">
                  ATS Score
                </h3>
                <ScoreGauge score={atsResult?.ats_score || 0} max={100} />
              </motion.div>
            </div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-xl p-8"
            >
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                ✓ Matching Skills ({analysis.matching_skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {analysis.matching_skills?.map((skill, i) => (
                  <SkillChip key={i} skill={skill} type="matching" />
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-4 text-red-400">
                ✗ Missing Skills ({analysis.missing_skills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-3">
                {analysis.missing_skills?.map((skill, i) => (
                  <SkillChip key={i} skill={skill} type="missing" />
                ))}
              </div>
            </motion.div>

            {/* Improved Bullets */}
            {analysis.improved_bullets && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary rounded-xl p-8"
              >
                <h3 className="text-lg font-semibold mb-4 text-accent">
                  📝 Suggested Bullet Points
                </h3>
                <ul className="space-y-3">
                  {analysis.improved_bullets?.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-slate-200 bg-primary rounded p-4"
                    >
                      <span className="text-accent font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* ATS Issues */}
            {atsResult?.ats_issues?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary rounded-xl p-8 border-l-4 border-red-500"
              >
                <h3 className="text-lg font-semibold mb-4 text-red-400">
                  ⚠️ ATS Issues
                </h3>
                <ul className="space-y-2">
                  {atsResult.ats_issues?.map((issue, i) => (
                    <li key={i} className="text-slate-300">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Download Button */}
            <motion.button
              onClick={handleDownloadResume}
              disabled={loading}
              className="w-full px-6 py-4 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={20} />
              Download Optimized Resume PDF
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
            <p>Click "Analyze Now" to start your resume analysis</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeAnalyzer
