import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle2, Target, ArrowRight, ShieldCheck } from 'lucide-react'
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
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Module 03
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Competency & Skill Gap Analysis</h1>
          </div>
          <p className="text-sm text-slate-400">
            Identify exact missing technical proficiencies and prioritized learning targets for your target role.
          </p>
        </div>

        <motion.button
          onClick={handleAnalyzeSkillGap}
          disabled={loading || !resumeId || !jobTargetId}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
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
            className="space-y-8"
          >
            
            {/* Overview Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xl">
                  {skillGap.current_skills?.length || 0}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Verified Skills</h4>
                  <p className="text-sm font-bold text-white mt-0.5">Found in Resume</p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-xl">
                  {skillGap.gap_skills?.length || 0}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Impact Gaps</h4>
                  <p className="text-sm font-bold text-white mt-0.5">Missing Competencies</p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl">
                  {(skillGap.gap_skills?.length || 0) > 4 ? '4-6w' : '2-4w'}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Upskilling Time</h4>
                  <p className="text-sm font-bold text-white mt-0.5">Target Completion</p>
                </div>
              </div>
            </div>

            {/* Current vs Required Skills Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Current Skills */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <CheckCircle2 size={18} />
                  <h3>Your Existing Skills ({skillGap.current_skills?.length || 0})</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skillGap.current_skills?.map((skill, i) => (
                    <SkillChip key={i} skill={skill} type="matching" />
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                  <Target size={18} />
                  <h3>Target Job Demands ({skillGap.required_skills?.length || 0})</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGap.required_skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Priority Skill Upskill Cards */}
            {skillGap.priority_order?.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <ShieldCheck size={22} className="text-cyan-400" />
                    <h3>Prioritized Learning Roadmap</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Order of ROI</span>
                </div>

                <div className="space-y-4">
                  {skillGap.priority_order.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/20">
                            #{i + 1}
                          </span>
                          <h4 className="font-bold text-white text-sm">{item.skill}</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {item.priority_score || 85}% Priority
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed pl-10">
                        {item.impact || 'Critical skill required for daily engineering deliverables in this role.'}
                      </p>

                      {/* Animated Priority Bar */}
                      <div className="pl-10 flex items-center gap-3">
                        <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
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
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <Zap size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">Competency Analysis Ready</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click <strong>"Analyze Skill Gaps"</strong> to construct a prioritized gap matrix comparing your resume skills against your target role.
          </p>
        </div>
      )}

    </div>
  )
}

export default SkillGapAnalyzer
