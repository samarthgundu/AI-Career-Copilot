import React from 'react'
import { FileText, MessageSquare, Zap, BookOpen, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = ({ activeModule, onModuleChange }) => {
  const modules = [
    {
      id: 'resume-analyzer',
      label: 'Resume Analyzer',
      shortLabel: 'Resume',
      icon: FileText,
      description: 'ATS match & bullet optimizer',
    },
    {
      id: 'interview-assistant',
      label: 'AI Mock Interview',
      shortLabel: 'Interview',
      icon: MessageSquare,
      description: 'Real-time practice & scoring',
    },
    {
      id: 'skill-gap',
      label: 'Skill Gap Matrix',
      shortLabel: 'Skill Gap',
      icon: Zap,
      description: 'Bridge missing competencies',
    },
    {
      id: 'study-planner',
      label: 'Study Planner',
      shortLabel: 'Roadmap',
      icon: BookOpen,
      description: 'Custom learning roadmap',
    }
  ]

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-72 glass-vision border-r border-white/20 flex-col justify-between select-none z-20 relative m-4 rounded-3xl overflow-hidden">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/25 border border-white/40 flex items-center justify-center shadow-lg text-white">
                <Sparkles size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                  Career <span className="text-white/90">Copilot</span>
                </h1>
                <p className="text-[11px] text-white/70 font-medium">Gemini 3.6 Flash Engine</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-2">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/60">
              Navigation
            </div>
            {modules.map((module) => {
              const Icon = module.icon
              const isActive = activeModule === module.id

              return (
                <button
                  key={module.id}
                  onClick={() => onModuleChange(module.id)}
                  className={`w-full relative text-left p-3.5 rounded-2xl transition-all duration-300 group flex items-center gap-3.5 ${
                    isActive
                      ? 'glass-vision-pill text-white font-bold border border-white/40 shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute left-0 w-1.5 h-7 bg-white rounded-r-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-white/30 text-white border border-white/30' 
                      : 'bg-white/10 text-white/80 group-hover:text-white group-hover:bg-white/20'
                  }`}>
                    <Icon size={19} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{module.label}</div>
                    <p className="text-[11px] text-white/60 truncate mt-0.5 font-normal">{module.description}</p>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer Info Card */}
        <div className="p-4 border-t border-white/15">
          <div className="p-3.5 rounded-2xl glass-vision-pill text-xs space-y-1">
            <div className="flex items-center justify-between text-white font-bold">
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono">VISION OS</span>
            </div>
            <p className="text-[11px] text-white/70 leading-tight pt-1">Frosted Glass + Gemini 3.6 connected</p>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-2 left-2 right-2 z-50 glass-vision rounded-2xl border border-white/30 px-2 py-2 flex items-center justify-around">
        {modules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id

          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-white font-bold bg-white/25 border border-white/40'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white scale-110' : ''} />
              <span className="text-[10px] mt-1 truncate max-w-[70px]">{module.shortLabel}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

export default Sidebar
