import React from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const SkillChip = ({ skill, type = 'matching' }) => {
  const isMatching = type === 'matching'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
        isMatching
          ? 'glass-vision-pill text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/20'
          : 'glass-vision-pill text-rose-200 border-rose-400/40 hover:bg-rose-500/20'
      }`}
    >
      {isMatching ? (
        <Check size={14} className="text-emerald-300 flex-shrink-0" />
      ) : (
        <X size={14} className="text-rose-300 flex-shrink-0" />
      )}
      <span className="truncate">{skill}</span>
    </motion.div>
  )
}

export default SkillChip
