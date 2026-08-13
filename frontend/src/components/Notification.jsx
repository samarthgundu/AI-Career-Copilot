import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../context/AppContext'
import { Check, AlertCircle, Info } from 'lucide-react'

const Notification = () => {
  const { notification } = useAppContext()

  if (!notification) return null

  const bgColor =
    notification.type === 'success'
      ? 'bg-green-500'
      : notification.type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500'

  const icon =
    notification.type === 'success' ? (
      <Check size={20} />
    ) : notification.type === 'error' ? (
      <AlertCircle size={20} />
    ) : (
      <Info size={20} />
    )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50`}
      >
        {icon}
        <span>{notification.message}</span>
      </motion.div>
    </AnimatePresence>
  )
}

export default Notification
