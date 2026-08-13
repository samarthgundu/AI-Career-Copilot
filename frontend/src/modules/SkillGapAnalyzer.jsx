import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { analyzeResume, getSkillGap } from '../services/api'
import SkillChip from '../components/SkillChip'

const SkillGapAnalyzer = () => {
  const { resumeId, jobTargetId, showNotification } = useAppContext()
  const [analysis, setAnalysis] = useState(null)
  const [skillGap, setSkillGap] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyzeSkillGap = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please upload resume and set target job first', 'error')
      return
    }

    setLoading(true)
    try {
      // First get the analysis if we don't have it
      let analysisData = analysis
      if (!analysisData) {
        analysisData = await analyzeResume(resumeId, jobTargetId)
        setAnalysis(analysisData)
      }

      // Then get the skill gap
      const gapData = await getSkillGap(analysisData.analysis_id)
      setSkillGap(gapData)
      showNotification('Skill gap analysis complete!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Analysis failed',
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
            <h1 className="text-4xl font-bold mb-2">Skill Gap Analyzer</h1>
            <p className="text-slate-400">
              Identify the skills you need to master for your dream role
            </p>
          </div>
          <motion.button
            onClick={handleAnalyzeSkillGap}
            disabled={loading || !resumeId || !jobTargetId}
            className="px-6 py-3 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={20} />
            {loading ? 'Analyzing...' : 'Analyze Skills'}
          </motion.button>
        </div>

        {skillGap ? (
          <div className="space-y-8">
            {/* Current Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-xl p-8"
            >
              <h3 className="text-lg font-semibold mb-4 text-green-400">
                ✓ Your Current Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {skillGap.current_skills?.map((skill, i) => (
                  <SkillChip key={i} skill={skill} type="matching" />
                ))}
              </div>
            </motion.div>

            {/* Required Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-xl p-8"
            >
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                🎯 Required Skills for Target Job
              </h3>
              <div className="flex flex-wrap gap-3">
                {skillGap.required_skills?.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 rounded-full font-medium text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skill Gaps - Priority Order */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary rounded-xl p-8"
            >
              <h3 className="text-lg font-semibold mb-6 text-accent">
                ⚡ Priority Skills to Learn
              </h3>
              <div className="space-y-4">
                {skillGap.priority_order?.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-primary rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent text-primary font-bold">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-100 mb-1">
                        {item.skill}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {item.impact || 'Essential skill for this role'}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <motion.div
                            className="bg-accent h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.priority_score || 80}%` }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">
                          {item.priority_score || 80}% priority
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-secondary rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {skillGap.current_skills?.length || 0}
                </div>
                <div className="text-sm text-slate-400">Current Skills</div>
              </div>
              <div className="bg-secondary rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {skillGap.gap_skills?.length || 0}
                </div>
                <div className="text-sm text-slate-400">Skills to Develop</div>
              </div>
              <div className="bg-secondary rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {(skillGap.gap_skills?.length || 0) > 5 ? '4-6w' : '2-4w'}
                </div>
                <div className="text-sm text-slate-400">Est. Learning Time</div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <Zap size={48} className="mx-auto mb-4 opacity-50" />
            <p>Click "Analyze Skills" to identify your skill gaps</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SkillGapAnalyzer
