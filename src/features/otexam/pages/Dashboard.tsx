import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Search,
  Bell,
  User,
  Target,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { useSidebarWidth } from '../hooks/useSidebarWidth'

// Mock data for demonstration
const overviewStats = [
  {
    label: 'Total Students',
    value: '247',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'Exams Completed',
    value: '1,834',
    change: '+23%',
    trend: 'up',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Avg. Score',
    value: '74%',
    change: '+3%',
    trend: 'up',
    icon: Target,
    color: 'from-[#d4a574] to-[#c49a6c]',
  },
  {
    label: 'Pass Prediction',
    value: '89%',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp,
    color: 'from-violet-500 to-purple-500',
  },
]

const atRiskStudents = [
  { name: 'Jordan Williams', cohort: 'Fall 2024', avgScore: 52, exams: 8, weakArea: 'Intervention', trend: 'down' },
  { name: 'Taylor Martinez', cohort: 'Fall 2024', avgScore: 55, exams: 6, weakArea: 'Evaluation', trend: 'stable' },
  { name: 'Casey Johnson', cohort: 'Fall 2024', avgScore: 58, exams: 12, weakArea: 'Mental Health', trend: 'up' },
  { name: 'Morgan Lee', cohort: 'Spring 2024', avgScore: 48, exams: 4, weakArea: 'Management', trend: 'down' },
]

const recentActivity = [
  { student: 'Alex Chen', action: 'Completed Practice Exam', score: 82, time: '2 hours ago' },
  { student: 'Jamie Rivera', action: 'Completed Practice Exam', score: 68, time: '3 hours ago' },
  { student: 'Sam Wilson', action: 'Started Practice Exam', score: null, time: '4 hours ago' },
  { student: 'Morgan Lee', action: 'Completed Practice Exam', score: 51, time: '5 hours ago' },
  { student: 'Taylor Kim', action: 'Completed Practice Exam', score: 91, time: '6 hours ago' },
]

export default function Dashboard() {
  const [selectedCohort, setSelectedCohort] = useState('all')
  const [dateRange, setDateRange] = useState('month')
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

      <Sidebar activePage="dashboard" />

      {/* Main content */}
      <main className={`${sidebarMargin} transition-all duration-300`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 ot-glass border-b border-white/5">
          <div className="pl-16 lg:pl-6 pr-6 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden">
                <span className="ot-font-display text-lg">OTexam</span>
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
              <h1 className="ot-font-display text-3xl">Analytics Dashboard</h1>
              <p className="ot-font-body text-gray-400 mt-1">Monitor student performance and NBCOT readiness</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm focus:outline-none focus:border-[#d4a574]/50"
              >
                <option value="all">All Cohorts</option>
                <option value="fall-2024">Fall 2024</option>
                <option value="spring-2024">Spring 2024</option>
                <option value="fall-2023">Fall 2023</option>
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

          {/* Overview stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {overviewStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="ot-glass rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs ${
                    stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="ot-font-display text-3xl mb-1">{stat.value}</div>
                <div className="ot-font-body text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* NBCOT Readiness - links to Analysis */}
          <Link to="/otexam/analysis" className="block mb-8 group">
            <div className="ot-glass rounded-xl p-6 hover:border-[#d4a574]/30 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="ot-font-display text-xl">NBCOT Readiness</h2>
                    <p className="ot-font-body text-sm text-gray-500">Predicted pass rates by cohort</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="ot-font-body text-xs text-gray-500">National Average</div>
                    <div className="ot-font-display text-lg text-gray-400">~83%</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#d4a574] group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Fall 2024', prediction: 92, students: 82, trend: 'up' },
                  { name: 'Spring 2024', prediction: 78, students: 78, trend: 'stable' },
                  { name: 'Fall 2023', prediction: 87, students: 87, trend: 'up' },
                ].map((cohort) => (
                  <div
                    key={cohort.name}
                    className="bg-white/5 rounded-xl p-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="ot-font-body text-sm text-gray-400">{cohort.name}</span>
                      <span className="ot-font-body text-xs text-gray-500">{cohort.students} students</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`ot-font-display text-3xl font-semibold ${
                        cohort.prediction >= 85 ? 'text-emerald-400' :
                        cohort.prediction >= 75 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {cohort.prediction}%
                      </span>
                      {cohort.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400 mb-1" />}
                      {cohort.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400 mb-1" />}
                      {cohort.trend === 'stable' && <Activity className="w-4 h-4 text-gray-400 mb-1" />}
                    </div>
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cohort.prediction >= 85 ? 'bg-emerald-500' :
                          cohort.prediction >= 75 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${cohort.prediction}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      {cohort.prediction >= 83 ? (
                        <span className="ot-font-body text-xs text-emerald-400">Above national avg</span>
                      ) : (
                        <span className="ot-font-body text-xs text-orange-400">Below national avg</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* At-risk students */}
            <div className="lg:col-span-2 ot-glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="ot-font-display text-xl">At-Risk Students</h2>
                    <p className="ot-font-body text-sm text-gray-500">Students scoring below 60% average</p>
                  </div>
                </div>
                <Link to="/otexam/students" className="text-[#d4a574] ot-font-body text-sm flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Cohort</th>
                      <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Avg Score</th>
                      <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Exams</th>
                      <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Weak Area</th>
                      <th className="text-left py-3 px-4 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atRiskStudents.map((student) => (
                      <tr key={student.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="ot-font-body">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 ot-font-body text-sm text-gray-400">{student.cohort}</td>
                        <td className="py-3 px-4">
                          <span className={`ot-font-body font-medium ${
                            student.avgScore < 50 ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            {student.avgScore}%
                          </span>
                        </td>
                        <td className="py-3 px-4 ot-font-body text-sm text-gray-400">{student.exams}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 ot-font-body text-xs">
                            {student.weakArea}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                          {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                          {student.trend === 'stable' && <Activity className="w-4 h-4 text-gray-400" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent activity */}
            <div className="ot-glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="ot-font-display text-xl">Recent Activity</h2>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs flex-shrink-0">
                      {activity.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="ot-font-body text-sm">
                        <span className="font-medium">{activity.student}</span>
                      </div>
                      <div className="ot-font-body text-xs text-gray-500">{activity.action}</div>
                      <div className="ot-font-body text-xs text-gray-600 mt-1">{activity.time}</div>
                    </div>
                    {activity.score !== null && (
                      <span className={`ot-font-body text-sm font-medium ${
                        activity.score >= 75 ? 'text-emerald-400' :
                        activity.score >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {activity.score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
