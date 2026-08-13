import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle2, Target, ShieldCheck } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { analyzeResume, getSkillGap } from '../services/api'
import SkillChip from '../components/SkillChip'

const SkillGapAnalyzer = () => {
  const { resumeId, jobTargetId, showNotification } = useAppContext()
  const [skillGap, setSkillGap] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyzeSkillGap = async () => {
    if (!resumeId || !jobTargetId) {
      showNotification('Please upload your resume and set target job first', 'error')
      return
    }

    setLoading(true)
    try {
      const analysisData = await analyzeResume(resumeId, jobTargetId)
      const gapData = await getSkillGap(analysisData.analysis_id)
      setSkillGap(gapData)
      showNotification('Skill gap matrix computed!', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.detail || 'Skill gap analysis failed',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 select-none pb-24 md:pb-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 md:pb-6 border-b border-white/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold glass-vision-pill text-white">
              Module 03
            </span>
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">Competency & Skill Gap Matrix</h1>
          </div>
          <p className="text-xs md:text-sm text-white/70">
            Identify missing technical proficiencies and prioritized learning targets for your role.
          </p>
        </div>

        <motion.button
          onClick={handleAnalyzeSkillGap}
          disabled={loading || !resumeId || !jobTargetId}
          className="w-full sm:w-auto px-6 py-3.5 btn-vision-primary text-white font-bold text-xs md:text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap size={18} className={loading ? 'animate-pulse' : ''} />
          <span>{loading ? 'Analyzing Competencies...' : 'Analyze Skill Gaps'}</span>
        </motion.button>
      </div>

      {skillGap ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 md:space-y-8"
          >
            
            {/* Overview Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="glass-vision rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-extrabold text-xl flex-shrink-0">
                  {skillGap.current_skills?.length || 0}
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Current Verified Skills</h4>
                  <p className="text-xs md:text-sm font-bold text-white mt-0.5">Found in Resume</p>
                </div>
              </div>

              <div className="glass-vision rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-400/40 flex items-center justify-center font-extrabold text-xl flex-shrink-0">
                  {skillGap.gap_skills?.length || 0}
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">High Impact Gaps</h4>
                  <p className="text-xs md:text-sm font-bold text-white mt-0.5">Missing Competencies</p>
                </div>
              </div>

              <div className="glass-vision rounded-3xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/40 flex items-center justify-center font-extrabold text-xl flex-shrink-0">
                  {(skillGap.gap_skills?.length || 0) > 4 ? '4-6w' : '2-4w'}
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-wider">Estimated Upskill Time</h4>
                  <p className="text-xs md:text-sm font-bold text-white mt-0.5">Target Completion</p>
                </div>
              </div>
            </div>

            {/* Current vs Required Skills Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* Current Skills */}
              <div className="glass-vision rounded-3xl p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm md:text-base">
                  <CheckCircle2 size={18} className="flex-shrink-0" />
                  <h3>Your Existing Skills ({skillGap.current_skills?.length || 0})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGap.current_skills?.map((skill, i) => (
                    <SkillChip key={i} skill={skill} type="matching" />
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div className="glass-vision rounded-3xl p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2 text-sky-300 font-bold text-sm md:text-base">
                  <Target size={18} className="flex-shrink-0" />
                  <h3>Target Job Demands ({skillGap.required_skills?.length || 0})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGap.required_skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-2xl text-xs font-bold glass-vision-pill text-sky-200 border border-sky-400/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Priority Skill Upskill Cards */}
            {skillGap.priority_order?.length > 0 && (
              <div className="glass-vision rounded-3xl p-5 md:p-8 space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <div className="flex items-center gap-2 text-white font-bold text-base md:text-lg">
                    <ShieldCheck size={20} className="text-white flex-shrink-0" />
                    <h3>Prioritized Upskill Roadmap</h3>
                  </div>
                  <span className="text-[10px] text-white/60 font-mono">Order of ROI</span>
                </div>

                <div className="space-y-3.5">
                  {skillGap.priority_order.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="p-4 md:p-5 rounded-2xl glass-vision-pill border border-white/20 hover:border-white/40 transition-all space-y-2.5 shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30 flex-shrink-0">
                            #{i + 1}
                          </span>
                          <h4 className="font-bold text-white text-xs md:text-sm">{item.skill}</h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-white/20 text-white border border-white/30 flex-shrink-0">
                          {item.priority_score || 85}% Priority
                        </span>
                      </div>

                      <p className="text-xs text-white/80 leading-relaxed pl-8 font-medium">
                        {item.impact || 'Critical skill required for daily engineering deliverables in this role.'}
                      </p>

                      {/* Animated Priority Bar */}
                      <div className="pl-8 flex items-center gap-3">
                        <div className="flex-1 bg-black/20 rounded-full h-2 overflow-hidden border border-white/20">
                          <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.priority_score || 85}%` }}
                            transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      ) : (
        /* Empty State */
        <div className="glass-vision rounded-3xl p-8 md:p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto shadow-inner border border-white/30">
            <Zap size={32} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white">Competency Analysis Ready</h3>
          <p className="text-xs text-white/70 leading-relaxed font-medium">
            Click <strong>"Analyze Skill Gaps"</strong> to construct a prioritized gap matrix comparing your resume skills against your target role.
          </p>
        </div>
      )}

    </div>
  )
}

export default SkillGapAnalyzer
