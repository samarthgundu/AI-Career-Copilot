import React from 'react'
import { motion } from 'framer-motion'

const ScoreGauge = ({ score, max = 100, label = 'Match Score' }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((score / max) * 100)))

  // SVG dimensions & radius calculation
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getTheme = () => {
    if (percentage >= 75) return {
      stroke: '#10B981',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      text: '🎯 Excellent Match'
    }
    if (percentage >= 55) return {
      stroke: '#3B82F6',
      badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      text: '✓ Good Alignment'
    }
    if (percentage >= 35) return {
      stroke: '#F59E0B',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      text: '⚡ Moderate Gaps'
    }
    return {
      stroke: '#EF4444',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      text: '⚠️ Requires Optimization'
    }
  }

  const theme = getTheme()

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Ambient Glow */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-all duration-1000"
          style={{ backgroundColor: theme.stroke }}
        />

        {/* Circular Progress SVG */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background Track Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated Animated Score Circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={theme.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score Counter */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-4xl font-extrabold tracking-tight text-white font-mono"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {label}
          </span>
        </div>
      </div>

      {/* Status Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`mt-3 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${theme.badgeBg}`}
      >
        {theme.text}
      </motion.div>
    </div>
  )
}

export default ScoreGauge
