import React from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const SkillChip = ({ skill, type = 'matching' }) => {
  const isMatching = type === 'matching'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-all ${
        isMatching
          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
          : 'bg-red-500/20 text-red-300 border border-red-500/30'
      }`}
    >
      {isMatching ? (
        <Check size={16} className="flex-shrink-0" />
      ) : (
        <X size={16} className="flex-shrink-0" />
      )}
      <span>{skill}</span>
    </motion.div>
  )
}

export default SkillChip
