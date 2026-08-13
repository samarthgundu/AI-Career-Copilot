import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { analyzeResume, getSkillGap, getStudyPlan } from '../services/api'

const StudyPlanner = () => {
  const { resumeId, jobTargetId, showNotification } = useAppContext()
  const [studyPlan, setStudyPlan] = useState(null)
  const [expandedWeek, setExpandedWeek] = useState(0)
  const [loading, setLoading] = useState(false)
  const [weeks, setWeeks] = useState(4)

  const handleCreateStudyPlan = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please upload resume and set target job first', 'error')
      return
    }

    setLoading(true)
    try {
      // Get analysis
      const analysisData = await analyzeResume(resumeId, jobTargetId)

      // Get skill gap
      const gapData = await getSkillGap(analysisData.analysis_id)

      // Get study plan
      const planData = await getStudyPlan(gapData.skill_gap_id, weeks)
      setStudyPlan(planData)
      setExpandedWeek(0)
      showNotification('Study plan created!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to create plan',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Personalized Study Planner</h1>
            <p className="text-slate-400">
              A week-by-week learning roadmap tailored to your career goals
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <select
              value={weeks}
              onChange={(e) => setWeeks(parseInt(e.target.value))}
              disabled={loading || !!studyPlan}
              className="px-4 py-2 bg-primary border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value={2}>2 Weeks</option>
              <option value={4}>4 Weeks</option>
              <option value={8}>8 Weeks</option>
              <option value={12}>12 Weeks</option>
            </select>
            <motion.button
              onClick={handleCreateStudyPlan}
              disabled={loading || !!studyPlan}
              className="px-6 py-3 bg-accent hover:bg-blue-600 text-primary font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen size={20} />
              {loading ? 'Creating...' : 'Create Plan'}
            </motion.button>
          </div>
        </div>

        {studyPlan ? (
          <div className="space-y-4">
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {studyPlan.weeks?.map((week, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-secondary rounded-xl overflow-hidden border border-slate-700 hover:border-accent transition-colors"
                >
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === idx ? -1 : idx)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-accent">W{idx + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {week.title || `Week ${idx + 1}`}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {week.focus || 'Focus on key learning outcomes'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedWeek === idx ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={24} className="text-accent" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedWeek === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-700 bg-primary/50 p-6"
                      >
                        {/* Topics */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-accent mb-3">
                            📚 Topics to Study
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {week.topics?.map((topic, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="p-3 bg-secondary rounded-lg border border-slate-700 text-sm text-slate-300"
                              >
                                {topic}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Action Items */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-green-400 mb-3">
                            ✓ Action Items
                          </h4>
                          <ul className="space-y-2">
                            {week.actions?.map((action, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex gap-3 text-slate-300 text-sm"
                              >
                                <span className="text-green-400 font-bold">
                                  →
                                </span>
                                <span>{action}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        {week.resources && week.resources.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-blue-400 mb-3">
                              🔗 Resources
                            </h4>
                            <ul className="space-y-2">
                              {week.resources?.map((resource, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="text-slate-300 text-sm hover:text-accent transition-colors"
                                >
                                  • {resource}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-4 mt-8"
            >
              <div className="bg-secondary rounded-xl p-6 text-center border border-slate-700">
                <div className="text-3xl font-bold text-accent mb-2">
                  {studyPlan.weeks?.length || weeks}
                </div>
                <div className="text-sm text-slate-400">Total Weeks</div>
              </div>
              <div className="bg-secondary rounded-xl p-6 text-center border border-slate-700">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {studyPlan.weeks?.reduce((acc, w) => acc + (w.topics?.length || 0), 0) || 0}
                </div>
                <div className="text-sm text-slate-400">Topics to Master</div>
              </div>
              <div className="bg-secondary rounded-xl p-6 text-center border border-slate-700">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {Math.ceil((studyPlan.weeks?.reduce((acc, w) => acc + (w.actions?.length || 0), 0) || 0) / (studyPlan.weeks?.length || weeks))}h/wk
                </div>
                <div className="text-sm text-slate-400">Avg Hours per Week</div>
              </div>
            </motion.div>

            {/* Reset Button */}
            <motion.button
              onClick={() => setStudyPlan(null)}
              className="w-full mt-8 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create New Plan
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>Click "Create Plan" to generate your personalized study roadmap</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyPlanner
