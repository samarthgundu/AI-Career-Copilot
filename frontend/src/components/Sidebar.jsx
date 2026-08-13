import React from 'react'
import { FileText, MessageSquare, Zap, BookOpen, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = ({ activeModule, onModuleChange }) => {
  const modules = [
    {
      id: 'resume-analyzer',
      label: 'Resume Analyzer',
      icon: FileText,
      description: 'Analyze & optimize your resume'
    },
    {
      id: 'interview-assistant',
      label: 'Interview Assistant',
      icon: MessageSquare,
      description: 'Practice with AI interviewer'
    },
    {
      id: 'skill-gap',
      label: 'Skill Gap',
      icon: Zap,
      description: 'Identify missing skills'
    },
    {
      id: 'study-planner',
      label: 'Study Planner',
      icon: BookOpen,
      description: 'Get personalized study plan'
    }
  ]

  return (
    <div className="w-64 bg-secondary border-r border-slate-700 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Brain size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Career</h1>
            <p className="text-xs text-slate-400">Copilot</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id

            return (
              <motion.button
                key={module.id}
                onClick={() => onModuleChange(module.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-accent text-primary'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{module.label}</div>
                    <div className="text-xs opacity-75">{module.description}</div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700 text-xs text-slate-400 text-center">
        <p>🚀 Hackathon Edition</p>
        <p>v1.0</p>
      </div>
    </div>
  )
}

export default Sidebar
