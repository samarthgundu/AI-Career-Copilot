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
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all shadow-sm ${
        isMatching
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/20'
          : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:border-rose-400/50 hover:bg-rose-500/20'
      }`}
    >
      {isMatching ? (
        <Check size={14} className="text-emerald-400 flex-shrink-0" />
      ) : (
        <X size={14} className="text-rose-400 flex-shrink-0" />
      )}
      <span className="truncate">{skill}</span>
    </motion.div>
  )
}

export default SkillChip
