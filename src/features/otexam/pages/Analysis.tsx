import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  GraduationCap,
  Download,
  Search,
  Bell,
  User,
  Users,
  Calendar,
  Layers,
  Clock,
  Brain,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { useSidebarWidth } from '../hooks/useSidebarWidth'
import {
  programMilestones,
  cohorts,
  getCohortMilestoneProgress,
} from '../data/analytics'

// Mock data for demonstration
const cohortPerformance = [
  { cohort: 'Fall 2024', students: 82, avgScore: 76, passRate: 92, atRisk: 6 },
  { cohort: 'Spring 2024', students: 78, avgScore: 71, passRate: 85, atRisk: 11 },
  { cohort: 'Fall 2023', students: 87, avgScore: 73, passRate: 88, atRisk: 8 },
]

const domainPerformance = [
  { domain: 'Evaluation', avgScore: 78, questions: 342, color: 'bg-blue-500' },
  { domain: 'Intervention', avgScore: 72, questions: 580, color: 'bg-emerald-500' },
  { domain: 'Management', avgScore: 68, questions: 198, color: 'bg-orange-500' },
  { domain: 'Competency', avgScore: 81, questions: 176, color: 'bg-violet-500' },
]

const settingPerformance = [
  { setting: 'Pediatrics', avgScore: 75, color: 'from-pink-500 to-rose-500' },
  { setting: 'Geriatrics', avgScore: 72, color: 'from-purple-500 to-violet-500' },
  { setting: 'Physical Disabilities', avgScore: 78, color: 'from-blue-500 to-cyan-500' },
  { setting: 'Mental Health', avgScore: 69, color: 'from-emerald-500 to-teal-500' },
  { setting: 'Wellness', avgScore: 82, color: 'from-yellow-400 to-orange-400' },
  { setting: 'Hand Therapy', avgScore: 71, color: 'from-red-500 to-pink-500' },
]

// Gantt view types
type GanttView = 'single' | 'multi' | 'forecast'

// Helper to get milestone progress color
function getMilestoneColor(passRate: number): string {
  if (passRate >= 95) return 'bg-emerald-500'
  if (passRate >= 75) return 'bg-orange-500'
  return 'bg-red-500'
}

// Mock forecast data for 12-month view
const forecastData: Record<string, Record<string, { passRate: number; projected: boolean }>> = {
  'c1': { // Fall 2024
    'm1': { passRate: 83, projected: false },
    'm2': { passRate: 88, projected: true },
    'm3': { passRate: 91, projected: true },
    'm4': { passRate: 96, projected: true },
  },
  'c2': { // Spring 2024
    'm1': { passRate: 87, projected: false },
    'm2': { passRate: 82, projected: false },
    'm3': { passRate: 85, projected: true },
    'm4': { passRate: 89, projected: true },
  },
  'c3': { // Fall 2023
    'm1': { passRate: 91, projected: false },
    'm2': { passRate: 88, projected: false },
    'm3': { passRate: 95, projected: false },
    'm4': { passRate: 97, projected: true },
  },
}

// Gantt Timeline Component
function GanttTimeline({
  view,
  selectedCohortId
}: {
  view: GanttView
  selectedCohortId: string
}) {
  const displayCohorts = view === 'single' && selectedCohortId !== 'all'
    ? cohorts.filter(c => c.id === selectedCohortId)
    : cohorts

  return (
    <div className="space-y-4">
      {/* Timeline header */}
      <div className="flex items-center">
        <div className="w-32 flex-shrink-0" />
        <div className="flex-1 flex">
          {programMilestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex-1 text-center"
            >
              <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider">
                {milestone.shortName}
              </div>
              <div className="ot-font-body text-[10px] text-gray-600 mt-0.5">
                Pass: {milestone.passingScore}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort rows */}
      <div className="space-y-3">
        {displayCohorts.map((cohort, cohortIdx) => (
          <motion.div
            key={cohort.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: cohortIdx * 0.1 }}
            className="flex items-center group"
          >
            {/* Cohort label */}
            <div className="w-32 flex-shrink-0 pr-4">
              <div className="ot-font-display text-sm font-medium">{cohort.name}</div>
              <div className="ot-font-body text-[10px] text-gray-500">
                {cohort.studentIds.length} students
              </div>
            </div>

            {/* Milestone progress bars */}
            <div className="flex-1 flex gap-2">
              {programMilestones.map((milestone) => {
                const progress = getCohortMilestoneProgress(cohort.id, milestone.id)
                const isCurrentMilestone = cohort.currentMilestoneId === milestone.id
                const isPastMilestone = programMilestones.findIndex(m => m.id === cohort.currentMilestoneId) >
                                         programMilestones.findIndex(m => m.id === milestone.id)
                const isFutureMilestone = programMilestones.findIndex(m => m.id === cohort.currentMilestoneId) <
                                          programMilestones.findIndex(m => m.id === milestone.id)

                // Use forecast data when in forecast view
                const forecast = view === 'forecast' ? forecastData[cohort.id]?.[milestone.id] : null
                const displayPassRate = forecast ? forecast.passRate : progress.passRate
                const isProjected = forecast?.projected ?? false

                return (
                  <div
                    key={milestone.id}
                    className="flex-1"
                  >
                    <div
                      className={`
                        relative h-10 rounded-lg overflow-hidden cursor-pointer
                        transition-all duration-200
                        ${isCurrentMilestone && view !== 'forecast' ? 'ring-2 ring-[#d4a574] ring-offset-2 ring-offset-[#0a0f1a]' : ''}
                        ${isFutureMilestone && view !== 'forecast' ? 'opacity-40' : ''}
                        ${isProjected ? 'opacity-70' : ''}
                        bg-white/5 hover:bg-white/10
                      `}
                    >
                      {/* Progress fill */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${displayPassRate}%` }}
                        transition={{ duration: 0.8, delay: cohortIdx * 0.1 + 0.2 }}
                        className={`absolute inset-y-0 left-0 ${getMilestoneColor(displayPassRate)} ${isProjected ? 'opacity-60' : ''}`}
                      />

                      {/* Overlay info */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {view === 'forecast' ? (
                          <div className="flex flex-col items-center">
                            <span className="ot-font-body text-xs font-medium text-white drop-shadow-lg">
                              {displayPassRate}%
                            </span>
                            {isProjected && (
                              <span className="ot-font-body text-[9px] text-white/70 italic">
                                projected
                              </span>
                            )}
                          </div>
                        ) : isPastMilestone || isCurrentMilestone ? (
                          <div className="flex items-center gap-2">
                            <span className="ot-font-body text-xs font-medium text-white drop-shadow-lg">
                              {progress.passed}/{progress.total}
                            </span>
                            {progress.remediation > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-500/80 text-[10px] text-white">
                                {progress.remediation} rem
                              </span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="ot-font-body text-xs text-gray-400">95%+ Pass</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span className="ot-font-body text-xs text-gray-400">75-94% Pass</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="ot-font-body text-xs text-gray-400">&lt;75% Pass</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded ring-2 ring-[#d4a574] ring-offset-1 ring-offset-[#0a0f1a]" />
          <span className="ot-font-body text-xs text-gray-400">Current Milestone</span>
        </div>
      </div>
    </div>
  )
}

// Domain Exposure Component
function DomainExposure() {
  const domainsByMilestone = [
    { milestone: 'Mock 1', evaluation: 25, intervention: 40, management: 20, competency: 15 },
    { milestone: 'Mock 2', evaluation: 30, intervention: 35, management: 25, competency: 10 },
    { milestone: 'Comp', evaluation: 25, intervention: 35, management: 25, competency: 15 },
    { milestone: 'Ready', evaluation: 25, intervention: 35, management: 25, competency: 15 },
  ]

  const domainColors = {
    evaluation: 'bg-blue-500',
    intervention: 'bg-emerald-500',
    management: 'bg-orange-500',
    competency: 'bg-violet-500',
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 mb-4">
        {Object.entries(domainColors).map(([domain, color]) => (
          <div key={domain} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded ${color}`} />
            <span className="ot-font-body text-xs text-gray-400 capitalize">{domain}</span>
          </div>
        ))}
      </div>

      {domainsByMilestone.map((item) => (
        <div key={item.milestone} className="flex items-center gap-3">
          <div className="w-16 ot-font-body text-xs text-gray-500">{item.milestone}</div>
          <div className="flex-1 flex h-6 rounded-lg overflow-hidden bg-white/5">
            <div className={`${domainColors.evaluation}`} style={{ width: `${item.evaluation}%` }} />
            <div className={`${domainColors.intervention}`} style={{ width: `${item.intervention}%` }} />
            <div className={`${domainColors.management}`} style={{ width: `${item.management}%` }} />
            <div className={`${domainColors.competency}`} style={{ width: `${item.competency}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Analysis() {
  const [selectedCohort, setSelectedCohort] = useState('all')
  const [dateRange, setDateRange] = useState('month')
  const [ganttView, setGanttView] = useState<GanttView>('multi')
  const sidebarMargin = useSidebarWidth()

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
        .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .ot-gradient-text { background: linear-gradient(135deg, #d4a574 0%, #e8c9a0 50%, #d4a574 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      <Sidebar activePage="analysis" />

      {/* Main content */}
      <main className={`${sidebarMargin} transition-all duration-300`}>
        {/* Top header */}
        <header className="sticky top-0 z-50 ot-glass border-b border-white/5">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden">
                <Link to="/otexam" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-[#0a0f1a]" />
                  </div>
                  <span className="ot-font-display">OTexam</span>
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search students, exams..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#d4a574] rounded-full" />
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
              <h1 className="ot-font-display text-3xl">Program Analysis</h1>
              <p className="ot-font-body text-gray-400 mt-1">Deep dive into program performance and NBCOT readiness metrics</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm focus:outline-none focus:border-[#d4a574]/50"
              >
                <option value="all">All Cohorts</option>
                {cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
                ))}
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm focus:outline-none focus:border-[#d4a574]/50"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>

              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Program Timeline (Gantt) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ot-glass rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d4a574]/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <h2 className="ot-font-display text-xl">Program Timeline</h2>
                  <p className="ot-font-body text-sm text-gray-500">
                    Cohort progress through NBCOT preparation milestones
                  </p>
                </div>
              </div>

              {/* View toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGanttView('single')}
                  className={`
                    px-3 py-1.5 rounded-lg ot-font-body text-sm flex items-center gap-2 transition-all
                    ${ganttView === 'single'
                      ? 'bg-[#d4a574] text-[#0a0f1a]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                  `}
                >
                  <User className="w-4 h-4" />
                  Single Cohort
                </button>
                <button
                  onClick={() => setGanttView('multi')}
                  className={`
                    px-3 py-1.5 rounded-lg ot-font-body text-sm flex items-center gap-2 transition-all
                    ${ganttView === 'multi'
                      ? 'bg-[#d4a574] text-[#0a0f1a]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                  `}
                >
                  <Layers className="w-4 h-4" />
                  All Cohorts
                </button>
                <button
                  onClick={() => setGanttView('forecast')}
                  className={`
                    px-3 py-1.5 rounded-lg ot-font-body text-sm flex items-center gap-2 transition-all
                    ${ganttView === 'forecast'
                      ? 'bg-[#d4a574] text-[#0a0f1a]'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                  `}
                >
                  <Clock className="w-4 h-4" />
                  12-Month Forecast
                </button>
              </div>
            </div>

            <GanttTimeline view={ganttView} selectedCohortId={selectedCohort} />
          </motion.div>

          {/* Domain Exposure + Predicted Pass Rate */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* NBCOT Domain Exposure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="ot-glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="ot-font-display text-lg">NBCOT Domain Exposure</h3>
                  <p className="ot-font-body text-xs text-gray-500">Question distribution by milestone</p>
                </div>
              </div>
              <DomainExposure />
            </motion.div>

            {/* Predicted Pass Rate by Cohort */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="ot-glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="ot-font-display text-lg">Predicted NBCOT Pass Rate</h3>
                  <p className="ot-font-body text-xs text-gray-500">Rolling prediction based on performance</p>
                </div>
              </div>
              <div className="space-y-4">
                {cohorts.map((cohort) => {
                  // Mock prediction - in real app, calculate from student data
                  const predictions: Record<string, number> = {
                    'c1': 87,
                    'c2': 78,
                    'c3': 92,
                  }
                  const prediction = predictions[cohort.id] || 80

                  return (
                    <div key={cohort.id} className="flex items-center gap-4">
                      <div className="w-24 ot-font-body text-sm text-gray-400">{cohort.name}</div>
                      <div className="flex-1">
                        <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${prediction}%` }}
                            transition={{ duration: 0.8 }}
                            className={`absolute inset-y-0 left-0 ${
                              prediction >= 90 ? 'bg-emerald-500' :
                              prediction >= 80 ? 'bg-emerald-500/80' :
                              prediction >= 70 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                          />
                          <div className="absolute inset-0 flex items-center justify-end pr-3">
                            <span className={`ot-font-body text-sm font-medium ${
                              prediction >= 70 ? 'text-white' : 'text-red-100'
                            }`}>
                              {prediction}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${
                        prediction >= 85 ? 'text-emerald-400' :
                        prediction >= 70 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {prediction >= 85 ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="ot-font-body">On Track</span>
                          </>
                        ) : prediction >= 70 ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="ot-font-body">Monitor</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span className="ot-font-body">At Risk</span>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* National comparison */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="ot-font-body text-xs text-gray-500">
                      National NBCOT Average: ~83%
                    </span>
                    <span className="ot-font-body text-xs text-emerald-400">
                      Your program: Above average
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Domain + Setting Performance */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Domain performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="ot-glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#d4a574]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <h2 className="ot-font-display text-xl">NBCOT Domain Performance</h2>
                  <p className="ot-font-body text-sm text-gray-500">Average scores by exam domain</p>
                </div>
              </div>

              <div className="space-y-4">
                {domainPerformance.map((domain) => (
                  <div key={domain.domain}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="ot-font-body text-sm">{domain.domain}</span>
                      <span className="ot-font-body text-sm font-medium">{domain.avgScore}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${domain.avgScore}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full ${domain.color} rounded-full`}
                      />
                    </div>
                    <div className="ot-font-body text-xs text-gray-500 mt-1">
                      {domain.questions} questions answered
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Setting performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="ot-glass rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="ot-font-display text-xl">Practice Setting Performance</h2>
                  <p className="ot-font-body text-sm text-gray-500">Average scores by OT setting</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {settingPerformance.map((setting) => (
                  <div key={setting.setting} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="ot-font-body text-sm text-gray-400">{setting.setting}</span>
                    </div>
                    <div className={`ot-font-display text-2xl font-semibold bg-gradient-to-r ${setting.color} bg-clip-text text-transparent`}>
                      {setting.avgScore}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Cohort comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="ot-glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="ot-font-display text-xl">Cohort Comparison</h2>
                  <p className="ot-font-body text-sm text-gray-500">Performance metrics by student cohort</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Cohort</th>
                    <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Avg Score</th>
                    <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Predicted Pass Rate</th>
                    <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">At Risk</th>
                    <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortPerformance.map((cohort) => (
                    <tr key={cohort.cohort} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 ot-font-display font-medium">{cohort.cohort}</td>
                      <td className="py-4 px-4 ot-font-body text-gray-400">{cohort.students}</td>
                      <td className="py-4 px-4">
                        <span className={`ot-font-body font-medium ${
                          cohort.avgScore >= 75 ? 'text-emerald-400' :
                          cohort.avgScore >= 60 ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {cohort.avgScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                cohort.passRate >= 90 ? 'bg-emerald-500' :
                                cohort.passRate >= 80 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${cohort.passRate}%` }}
                            />
                          </div>
                          <span className="ot-font-body text-sm">{cohort.passRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs ot-font-body ${
                          cohort.atRisk > 10 ? 'bg-red-500/10 text-red-400' :
                          cohort.atRisk > 5 ? 'bg-orange-500/10 text-orange-400' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {cohort.atRisk} students
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="flex items-center gap-1 text-emerald-400 ot-font-body text-sm">
                          <CheckCircle className="w-4 h-4" />
                          On Track
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
