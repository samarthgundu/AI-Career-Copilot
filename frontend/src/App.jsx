import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import SharedHeader from './components/SharedHeader'
import ResumeAnalyzer from './modules/ResumeAnalyzer'
import InterviewAssistant from './modules/InterviewAssistant'
import SkillGapAnalyzer from './modules/SkillGapAnalyzer'
import StudyPlanner from './modules/StudyPlanner'
import Notification from './components/Notification'

function AppContent() {
  const [activeModule, setActiveModule] = useState('resume-analyzer')

  const renderModule = () => {
    switch (activeModule) {
      case 'resume-analyzer':
        return <ResumeAnalyzer />
      case 'interview-assistant':
        return <InterviewAssistant />
      case 'skill-gap':
        return <SkillGapAnalyzer />
      case 'study-planner':
        return <StudyPlanner />
      default:
        return <ResumeAnalyzer />
    }
  }

  return (
    <div className="relative flex h-screen bg-[#060911] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Background Animated Ambient Glow Orbs */}
      <div className="bg-glow-orb-1 top-[-100px] left-[-100px] animate-orb-float-1" />
      <div className="bg-glow-orb-2 bottom-[-100px] right-[-100px] animate-orb-float-2" />

      {/* Main Layout Container */}
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden z-10 relative">
        <SharedHeader />
        
        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="h-full"
            >
              {renderModule()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Notification />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
