import React, { useState } from 'react'
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
    <div className="flex h-screen bg-primary text-white">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col">
        <SharedHeader />
        <div className="flex-1 overflow-auto">
          {renderModule()}
        </div>
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
