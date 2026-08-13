import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, CheckSquare, ExternalLink, RefreshCw } from 'lucide-react'
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 select-none pb-24 md:pb-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 md:pb-6 border-b border-white/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold glass-vision-pill text-white">
              Module 04
            </span>
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">Personalized Learning Roadmap</h1>
          </div>
          <p className="text-xs md:text-sm text-white/70">
            A week-by-week structured curriculum customized to bridge your specific skill gaps.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={weeks}
            onChange={(e) => setWeeks(parseInt(e.target.value))}
            disabled={loading || !!studyPlan}
            className="flex-1 sm:flex-none px-3.5 py-3 bg-black/30 border border-white/30 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-white/60 transition-all cursor-pointer shadow-sm"
          >
            <option value={2} className="bg-slate-900 text-white">2 Weeks Accelerated</option>
            <option value={4} className="bg-slate-900 text-white">4 Weeks Standard</option>
            <option value={8} className="bg-slate-900 text-white">8 Weeks Deep Dive</option>
            <option value={12} className="bg-slate-900 text-white">12 Weeks Comprehensive</option>
          </select>

          <motion.button
            onClick={handleCreateStudyPlan}
            disabled={loading || !!studyPlan}
            className="w-full sm:w-auto px-5 py-3.5 btn-vision-primary text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
            className="space-y-5"
          >
            
            {/* Week Accordion Cards */}
            <div className="space-y-3.5">
              {studyPlan.weeks?.map((week, idx) => {
                const isExpanded = expandedWeek === idx

                return (
                  <div
                    key={idx}
                    className="glass-vision glass-vision-hover rounded-3xl overflow-hidden border border-white/20 transition-all"
                  >
                    <button
                      onClick={() => setExpandedWeek(isExpanded ? -1 : idx)}
                      className="w-full p-4 md:p-6 flex items-center justify-between gap-3 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center font-bold text-xs md:text-sm font-mono flex-shrink-0 ${
                          isExpanded 
                            ? 'bg-white/30 text-white border border-white/40 shadow-md' 
                            : 'bg-white/15 text-white/80 border border-white/20'
                        }`}>
                          W{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm md:text-base text-white truncate">{week.title || `Week ${idx + 1} Focus`}</h3>
                          <p className="text-[11px] md:text-xs text-white/70 truncate mt-0.5 font-medium">{week.focus || 'Key technical topics & hands-on exercises'}</p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-2 rounded-xl bg-white/15 text-white/80 flex-shrink-0 border border-white/20"
                      >
                        <ChevronDown size={16} />
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
                          className="border-t border-white/20 bg-black/20 p-5 md:p-8 space-y-5"
                        >
                          
                          {/* Topics to Study */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-2.5 flex items-center gap-2">
                              <BookOpen size={14} />
                              Core Study Topics
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {week.topics?.map((topic, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-xl glass-vision-pill border border-white/20 text-xs font-medium text-white shadow-sm"
                                >
                                  {topic}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Items */}
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2.5 flex items-center gap-2">
                              <CheckSquare size={14} />
                              Practical Exercises & Projects
                            </h4>
                            <div className="space-y-2">
                              {week.actions?.map((action, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2.5 text-xs text-white/90 glass-vision-pill p-3 rounded-xl border border-white/20 shadow-sm font-medium"
                                >
                                  <span className="w-4 h-4 rounded bg-emerald-400/30 text-emerald-200 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
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
                              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2.5 flex items-center gap-2">
                                <ExternalLink size={14} />
                                Learning Resources & Specs
                              </h4>
                              <ul className="space-y-1.5">
                                {week.resources.map((res, i) => (
                                  <li key={i} className="text-xs text-white/80 flex items-center gap-2 hover:text-white transition-colors font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="glass-vision rounded-3xl p-5 text-center space-y-1">
                <span className="text-2xl md:text-3xl font-bold text-white font-mono">{studyPlan.weeks?.length || weeks}</span>
                <p className="text-xs font-bold text-white/70">Total Program Weeks</p>
              </div>

              <div className="glass-panel-light rounded-3xl p-5 text-center space-y-1 glass-vision">
                <span className="text-2xl md:text-3xl font-bold text-emerald-300 font-mono">
                  {studyPlan.weeks?.reduce((acc, w) => acc + (w.topics?.length || 0), 0) || 0}
                </span>
                <p className="text-xs font-bold text-white/70">Topics & Modules</p>
              </div>

              <div className="glass-vision rounded-3xl p-5 text-center space-y-1">
                <span className="text-2xl md:text-3xl font-bold text-sky-300 font-mono">
                  {studyPlan.weeks?.reduce((acc, w) => acc + (w.actions?.length || 0), 0) || 0}
                </span>
                <p className="text-xs font-bold text-white/70">Action Items Completed</p>
              </div>
            </div>

            {/* Reset / Regenerate */}
            <button
              onClick={() => setStudyPlan(null)}
              className="w-full py-3.5 px-4 rounded-2xl glass-vision-pill hover:bg-white/30 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/30"
            >
              <RefreshCw size={14} />
              <span>Configure Different Duration</span>
            </button>

          </motion.div>
        </AnimatePresence>
      ) : (
        /* Empty State */
        <div className="glass-vision rounded-3xl p-8 md:p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto shadow-inner border border-white/30">
            <BookOpen size={32} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white">Study Roadmap Generator</h3>
          <p className="text-xs text-white/70 leading-relaxed font-medium">
            Select your target timeframe above and click <strong>"Generate Plan"</strong> to construct a weekly upskilling schedule customized to your career gap analysis.
          </p>
        </div>
      )}

    </div>
  )
}

export default StudyPlanner
