import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, Calendar, CheckSquare, ExternalLink, Sparkles, RefreshCw } from 'lucide-react'
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
      showNotification('Please upload your resume and set target job first', 'error')
      return
    }

    setLoading(true)
    try {
      const analysisData = await analyzeResume(resumeId, jobTargetId)
      const gapData = await getSkillGap(analysisData.analysis_id)
      const planData = await getStudyPlan(gapData.skill_gap_id, weeks)
      setStudyPlan(planData)
      setExpandedWeek(0)
      showNotification(`${weeks}-Week Personalized Study Plan generated!`, 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Failed to generate study plan',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Module 04
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Personalized Learning Roadmap</h1>
          </div>
          <p className="text-sm text-slate-400">
            A week-by-week structured curriculum customized to bridge your specific skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={weeks}
            onChange={(e) => setWeeks(parseInt(e.target.value))}
            disabled={loading || !!studyPlan}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value={2}>2 Weeks Accelerated</option>
            <option value={4}>4 Weeks Standard</option>
            <option value={8}>8 Weeks Deep Dive</option>
            <option value={12}>12 Weeks Comprehensive</option>
          </select>

          <motion.button
            onClick={handleCreateStudyPlan}
            disabled={loading || !!studyPlan}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen size={16} className={loading ? 'animate-bounce' : ''} />
            <span>{loading ? 'Generating Roadmap...' : 'Generate Plan'}</span>
          </motion.button>
        </div>
      </div>

      {studyPlan ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            
            {/* Week Accordion Cards */}
            <div className="space-y-4">
              {studyPlan.weeks?.map((week, idx) => {
                const isExpanded = expandedWeek === idx

                return (
                  <div
                    key={idx}
                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 transition-all"
                  >
                    <button
                      onClick={() => setExpandedWeek(isExpanded ? -1 : idx)}
                      className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm font-mono ${
                          isExpanded 
                            ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20' 
                            : 'bg-slate-800 text-indigo-400 border border-slate-700'
                        }`}>
                          W{idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-white">{week.title || `Week ${idx + 1} Focus`}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{week.focus || 'Key technical topics & hands-on exercises'}</p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-2 rounded-lg bg-slate-800/80 text-slate-400"
                      >
                        <ChevronDown size={18} />
                      </motion.div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="border-t border-slate-800 bg-slate-950/60 p-6 md:p-8 space-y-6"
                        >
                          
                          {/* Topics to Study */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
                              <BookOpen size={14} />
                              Core Study Topics
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {week.topics?.map((topic, i) => (
                                <div
                                  key={i}
                                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-200"
                                >
                                  {topic}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Items */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                              <CheckSquare size={14} />
                              Practical Deliverables & Exercises
                            </h4>
                            <div className="space-y-2">
                              {week.actions?.map((action, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80"
                                >
                                  <span className="w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                                    ✓
                                  </span>
                                  <span className="leading-relaxed">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recommended Resources */}
                          {week.resources?.length > 0 && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                                <ExternalLink size={14} />
                                Learning Resources & Documentation
                              </h4>
                              <ul className="space-y-2">
                                {week.resources.map((res, i) => (
                                  <li key={i} className="text-xs text-slate-400 flex items-center gap-2 hover:text-cyan-300 transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                                    <span>{res}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="glass-panel rounded-2xl p-6 text-center space-y-1">
                <span className="text-3xl font-extrabold text-white font-mono">{studyPlan.weeks?.length || weeks}</span>
                <p className="text-xs font-semibold text-slate-400">Total Program Weeks</p>
              </div>

              <div className="glass-panel rounded-2xl p-6 text-center space-y-1">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {studyPlan.weeks?.reduce((acc, w) => acc + (w.topics?.length || 0), 0) || 0}
                </span>
                <p className="text-xs font-semibold text-slate-400">Modules & Topics Covered</p>
              </div>

              <div className="glass-panel rounded-2xl p-6 text-center space-y-1">
                <span className="text-3xl font-extrabold text-cyan-400 font-mono">
                  {studyPlan.weeks?.reduce((acc, w) => acc + (w.actions?.length || 0), 0) || 0}
                </span>
                <p className="text-xs font-semibold text-slate-400">Action Items Completed</p>
              </div>
            </div>

            {/* Reset / Regenerate */}
            <button
              onClick={() => setStudyPlan(null)}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw size={14} />
              <span>Configure Different Duration</span>
            </button>

          </motion.div>
        </AnimatePresence>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">Study Roadmap Generator</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select your target timeframe above and click <strong>"Generate Plan"</strong> to construct a weekly upskilling schedule customized to your career gap analysis.
          </p>
        </div>
      )}

    </div>
  )
}

export default StudyPlanner
