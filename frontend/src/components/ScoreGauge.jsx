import React from 'react'
import { motion } from 'framer-motion'

const ScoreGauge = ({ score, max = 100 }) => {
  const percentage = (score / max) * 100
  const rotation = (percentage / 100) * 180 - 90

  const getColor = () => {
    if (percentage >= 80) return 'from-green-400 to-green-600'
    if (percentage >= 60) return 'from-yellow-400 to-yellow-600'
    if (percentage >= 40) return 'from-orange-400 to-orange-600'
    return 'from-red-400 to-red-600'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-48 h-24 flex items-center justify-center">
        {/* Gauge background */}
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 200 100"
          style={{ overflow: 'visible' }}
        >
          {/* Gauge arc background */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Gauge arc fill */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDasharray: '251 251', stroke: '#94a3b8' }}
            animate={{
              strokeDasharray: `${(percentage / 100) * 251} 251`,
              stroke: percentage >= 80 ? '#4ade80' : percentage >= 60 ? '#facc15' : percentage >= 40 ? '#fb923c' : '#ef4444'
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Center text */}
        <motion.div
          className="absolute text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(score)}
          </motion.div>
          <div className="text-sm text-slate-400">out of {max}</div>
        </motion.div>
      </div>

      {/* Status text */}
      <motion.div
        className={`px-6 py-3 rounded-full font-semibold text-sm ${
          percentage >= 80
            ? 'bg-green-500/20 text-green-300'
            : percentage >= 60
            ? 'bg-yellow-500/20 text-yellow-300'
            : percentage >= 40
            ? 'bg-orange-500/20 text-orange-300'
            : 'bg-red-500/20 text-red-300'
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {percentage >= 80
          ? '🎯 Excellent Match'
          : percentage >= 60
          ? '✓ Good Match'
          : percentage >= 40
          ? '△ Fair Match'
          : '✗ Needs Work'}
      </motion.div>
    </div>
  )
}

export default ScoreGauge
