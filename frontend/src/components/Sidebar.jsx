import React from 'react'
import { FileText, MessageSquare, Zap, BookOpen, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = ({ activeModule, onModuleChange }) => {
  const modules = [
    {
      id: 'resume-analyzer',
      label: 'Resume Analyzer',
      icon: FileText,
      description: 'ATS match & bullet optimizer',
      badge: 'Gemini 3.6'
    },
    {
      id: 'interview-assistant',
      label: 'AI Mock Interview',
      icon: MessageSquare,
      description: 'Real-time practice & scoring',
      badge: 'Live'
    },
    {
      id: 'skill-gap',
      label: 'Skill Gap Analysis',
      icon: Zap,
      description: 'Bridge missing competencies',
      badge: 'Priority'
    },
    {
      id: 'study-planner',
      label: '4-Week Study Plan',
      icon: BookOpen,
      description: 'Week-by-week learning roadmap',
      badge: 'Roadmap'
    }
  ]

  return (
    <aside className="w-72 bg-[#0E1422] border-r border-slate-800/80 flex flex-col justify-between select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                AI Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Copilot</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Powered by Gemini 3.6 Flash</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Core Modules
          </div>
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id

            return (
              <button
                key={module.id}
                onClick={() => onModuleChange(module.id)}
                className={`w-full relative text-left p-3.5 rounded-xl transition-all duration-200 group flex items-center gap-3.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white border border-indigo-500/30 shadow-md shadow-indigo-500/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1.5 h-7 bg-gradient-to-b from-indigo-500 to-cyan-400 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                }`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">{module.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{module.description}</p>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Info Card */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl glass-panel text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Backend Ready
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight pt-1">LlamaParse + Gemini 3.6 Flash + Supabase active</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
