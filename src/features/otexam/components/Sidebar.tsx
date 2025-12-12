import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Users,
  BookOpen,
  Brain,
  Settings,
  Bell,
  GraduationCap,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

type ActivePage = 'dashboard' | 'analysis' | 'students' | 'alerts' | 'exams' | 'questions' | 'settings'

interface SidebarProps {
  activePage: ActivePage
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/otexam/dashboard' },
  { id: 'analysis', label: 'Analysis', icon: LineChart, path: '/otexam/analysis' },
  { id: 'students', label: 'Students', icon: Users, path: '/otexam/students' },
  { id: 'alerts', label: 'Alerts', icon: Bell, path: '/otexam/alerts' },
  { id: 'exams', label: 'Practice Exams', icon: BookOpen, path: '/otexam/exam' },
  { id: 'questions', label: 'Question Bank', icon: Brain, path: '/otexam/questions' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/otexam' },
]

export function Sidebar({ activePage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('otexam-sidebar-collapsed')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('otexam-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  return (
    <aside className={`fixed left-0 top-0 bottom-0 ${collapsed ? 'w-16' : 'w-64'} bg-[#0d1420] border-r border-white/5 p-4 hidden lg:flex flex-col transition-all duration-300 z-50`}>
      <Link to="/otexam" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-[#0a0f1a]" />
        </div>
        {!collapsed && <span className="ot-font-display text-xl font-semibold text-white">OTexam</span>}
      </Link>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = item.id === activePage
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ot-font-body transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-[#d4a574]/10 text-[#d4a574]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors w-full ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
        {!collapsed && (
          <Link
            to="/"
            className="flex items-center gap-2 px-3 text-gray-500 hover:text-gray-400 ot-font-body text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        )}
      </div>
    </aside>
  )
}

