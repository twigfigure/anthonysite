import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  GraduationCap,
  BarChart3,
  BookOpen,
  Brain,
  Settings,
  Users,
  User,
  X,
  Check,
  CheckCheck,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
  AlertTriangle,
  Clock,
  Filter,
} from 'lucide-react'
import { advisorAlerts } from '../data/analytics'
import type { AdvisorAlert } from '../types'

// Alert type styling
const alertTypeStyles: Record<string, { color: string; bg: string; label: string }> = {
  'tier-change': { color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Tier Change' },
  'milestone-failed': { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Milestone Failed' },
  'remediation-complete': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Remediation Complete' },
  'deadline-approaching': { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Deadline Approaching' },
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<AdvisorAlert[]>(advisorAlerts)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all')

  const handleDismissAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a))
  }

  const handleMarkAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })))
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.type === filterType
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'unread' && !alert.read) ||
      (filterStatus === 'read' && alert.read)
    return matchesType && matchesStatus
  })

  const unreadCount = alerts.filter(a => !a.read).length

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
        .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .ot-gradient-text { background: linear-gradient(135deg, #d4a574 0%, #e8c9a0 50%, #d4a574 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#0d1420] border-r border-white/5 p-4 hidden lg:flex flex-col transition-all duration-300`}>
        <Link to="/otexam" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-[#0a0f1a]" />
          </div>
          {!sidebarCollapsed && <span className="ot-font-display text-xl font-semibold">OTexam</span>}
        </Link>

        <nav className="space-y-1 flex-1">
          <Link
            to="/otexam/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Dashboard"
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
          <Link
            to="/otexam/analysis"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Analysis"
          >
            <LineChart className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Analysis</span>}
          </Link>
          <Link
            to="/otexam/students"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Students"
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Students</span>}
          </Link>
          <Link
            to="/otexam/alerts"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#d4a574]/10 text-[#d4a574] ot-font-body ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Alerts"
          >
            <div className="relative flex-shrink-0">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            {!sidebarCollapsed && <span>Alerts</span>}
          </Link>
          <Link
            to="/otexam/exam"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Practice Exams"
          >
            <BookOpen className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Practice Exams</span>}
          </Link>
          <Link
            to="/otexam/questions"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Question Bank"
          >
            <Brain className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Question Bank</span>}
          </Link>
          <Link
            to="/otexam"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title="Settings"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Settings</span>}
          </Link>
        </nav>

        <div className="space-y-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors w-full ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          {!sidebarCollapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 px-3 text-gray-500 hover:text-gray-400 ot-font-body text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 ot-glass border-b border-white/5">
          <div className="pl-16 lg:pl-6 pr-6 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden">
                <span className="ot-font-display text-lg">OTexam</span>
              </div>

              <div className="hidden lg:flex items-center gap-4 flex-1">
                <h1 className="ot-font-display text-xl">Alerts</h1>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Bell className="w-5 h-5 text-[#d4a574]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#0a0f1a]" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Page header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="ot-font-display text-3xl lg:hidden">Alerts</h1>
              <p className="ot-font-body text-gray-400 mt-1">
                Stay updated on student progress and important notifications
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read
              </button>
            )}
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">{alerts.length}</div>
                  <div className="ot-font-body text-xs text-gray-500">Total Alerts</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">{unreadCount}</div>
                  <div className="ot-font-body text-xs text-gray-500">Unread</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">
                    {alerts.filter(a => a.type === 'milestone-failed').length}
                  </div>
                  <div className="ot-font-body text-xs text-gray-500">Failures</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">
                    {alerts.filter(a => a.type === 'remediation-complete').length}
                  </div>
                  <div className="ot-font-body text-xs text-gray-500">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="ot-font-body text-sm text-gray-500">Filter:</span>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm focus:outline-none focus:border-[#d4a574]/50"
            >
              <option value="all">All Types</option>
              <option value="tier-change">Tier Changes</option>
              <option value="milestone-failed">Milestone Failed</option>
              <option value="remediation-complete">Remediation Complete</option>
              <option value="deadline-approaching">Deadline Approaching</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read')}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm focus:outline-none focus:border-[#d4a574]/50"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Alerts list */}
          <div className="ot-glass rounded-xl overflow-hidden">
            <AnimatePresence mode="popLayout">
              {filteredAlerts.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {filteredAlerts.map((alert) => {
                    const style = alertTypeStyles[alert.type] || alertTypeStyles['tier-change']

                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        layout
                        className={`p-4 hover:bg-white/5 transition-colors ${!alert.read ? 'bg-white/[0.02]' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                            <Bell className={`w-5 h-5 ${style.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${style.bg} ${style.color}`}>
                                    {style.label}
                                  </span>
                                  {!alert.read && (
                                    <span className="w-2 h-2 bg-[#d4a574] rounded-full" />
                                  )}
                                </div>
                                <p className="ot-font-body text-sm text-white mb-1">{alert.message}</p>
                                <div className="flex items-center gap-3 text-gray-500">
                                  <span className="ot-font-body text-xs flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(alert.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {alert.studentId && (
                                    <Link
                                      to={`/otexam/pathway/${alert.studentId}`}
                                      className="ot-font-body text-xs text-[#d4a574] hover:underline"
                                    >
                                      View Student
                                    </Link>
                                  )}
                                </div>
                              </div>
                              {!alert.read && (
                                <button
                                  onClick={() => handleDismissAlert(alert.id)}
                                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4 text-gray-400" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="ot-font-body text-gray-500">No alerts matching your filters</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}