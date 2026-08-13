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
    <div className="flex h-screen bg-[#090D16] text-slate-100 overflow-hidden font-sans">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <SharedHeader />
        
        <main className="flex-1 overflow-y-auto relative bg-[#090D16]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
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
