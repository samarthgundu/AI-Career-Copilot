import React from 'react'
import { motion } from 'framer-motion'

const ScoreGauge = ({ score, max = 100, label = 'Match Score' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((score / max) * 100)))

  const radius = 68
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getTheme = () => {
    if (percentage >= 75) return {
      stroke: '#10B981',
      glow: 'rgba(16, 185, 129, 0.35)',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
      text: '🎯 Excellent Match'
    }
    if (percentage >= 55) return {
      stroke: '#6366F1',
      glow: 'rgba(99, 102, 241, 0.35)',
      badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40',
      text: '✓ Strong Alignment'
    }
    if (percentage >= 35) return {
      stroke: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.35)',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
      text: '⚡ Moderate Gaps'
    }
    return {
      stroke: '#EF4444',
      glow: 'rgba(239, 68, 68, 0.35)',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/40',
      text: '⚠️ Optimization Needed'
    }
  }

  const theme = getTheme()

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none">
      <div className="relative w-40 h-40 md:w-44 md:h-44 flex items-center justify-center">
        {/* Ambient Glow Orb */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-30 transition-all duration-1000"
          style={{ backgroundColor: theme.stroke }}
        />

        {/* Circular Progress SVG */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background Track Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800/60"
            strokeWidth="9"
            fill="transparent"
          />
          {/* Animated Score Circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="9"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score Counter */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`mt-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${theme.badgeBg}`}
      >
        {theme.text}
      </motion.div>
    </div>
  )
}

export default ScoreGauge
