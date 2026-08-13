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
      {/* DESKTOP SIDEBAR (md and above) */}
      <aside className="hidden md:flex w-72 bg-[#070B14]/80 backdrop-blur-xl border-r border-white/5 flex-col justify-between select-none z-20 relative">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Sparkles size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                  Career <span className="gradient-text-indigo">Copilot</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">Gemini 3.6 Flash Engine</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-2">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Core AI Modules
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
                      ? 'glass-card text-white border border-purple-500/40 shadow-xl shadow-purple-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute left-0 w-1.5 h-7 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <div className={`p-2.5 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-slate-900/60 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                  }`}>
                    <Icon size={19} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{module.label}</div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">{module.description}</p>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Footer Info Card */}
        <div className="p-4 border-t border-white/5">
          <div className="p-3.5 rounded-2xl glass-card text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-200 font-bold">
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">PRO MAX</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">LlamaParse + Gemini 3.6 Flash + Supabase connected</p>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (below md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-header bg-[#060911]/90 border-t border-white/10 px-2 py-2 flex items-center justify-around">
        {modules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id

          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-400 font-bold bg-purple-500/10 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-purple-400 scale-110' : ''} />
              <span className="text-[10px] mt-1 truncate max-w-[70px]">{module.shortLabel}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}

export default Sidebar
