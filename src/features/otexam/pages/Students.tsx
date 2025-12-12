import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Download,
  Plus,
  Mail,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Bell,
  User,
  Eye,
  X,
  Edit,
  Trash2,
  FolderPlus,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { useSidebarWidth } from '../hooks/useSidebarWidth'
import { getRemediationQueue, getDomainScores, getStudentCheckpoints, getStudentRemediation, programMilestones } from '../data/analytics'
import type { RemediationTier, NBCOTDomain } from '../types'

interface Student {
  id: string
  name: string
  email: string
  cohort: string
  enrollmentDate: string
  examsCompleted: number
  avgScore: number
  faculty: string
  trend: 'up' | 'down' | 'stable'
  status: 'excellent' | 'on-track' | 'improving' | 'at-risk' | 'critical'
  weakAreas: string[]
  strongAreas: string[]
}

interface Cohort {
  id: string
  name: string
  startDate: string
  studentCount: number
}

// Initial mock data - IDs match analytics data (s1, s2, etc.)
const initialStudents: Student[] = [
  {
    id: 's1',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 12,
    avgScore: 82,
    faculty: 'K.Kadowaki',
    trend: 'up',
    status: 'on-track',
    weakAreas: ['Management'],
    strongAreas: ['Evaluation', 'Intervention'],
  },
  {
    id: 's4',
    name: 'Jordan Williams',
    email: 'j.williams@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 8,
    avgScore: 52,
    faculty: 'M.Persson',
    trend: 'down',
    status: 'at-risk',
    weakAreas: ['Intervention', 'Management'],
    strongAreas: [],
  },
  {
    id: 's3',
    name: 'Taylor Martinez',
    email: 't.martinez@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 6,
    avgScore: 55,
    faculty: 'K.Kadowaki',
    trend: 'stable',
    status: 'at-risk',
    weakAreas: ['Evaluation'],
    strongAreas: ['Mental Health'],
  },
  {
    id: 's5',
    name: 'Casey Johnson',
    email: 'casey.j@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 15,
    avgScore: 78,
    faculty: 'S.Mitchell',
    trend: 'up',
    status: 'on-track',
    weakAreas: ['Hand Therapy'],
    strongAreas: ['Pediatrics', 'Geriatrics'],
  },
  {
    id: 's8',
    name: 'Morgan Lee',
    email: 'morgan.lee@university.edu',
    cohort: 'Spring 2024',
    enrollmentDate: '2024-01-10',
    examsCompleted: 22,
    avgScore: 48,
    faculty: 'J.Chen',
    trend: 'down',
    status: 'critical',
    weakAreas: ['Management', 'Competency', 'Intervention'],
    strongAreas: [],
  },
  {
    id: 's2',
    name: 'Jamie Rivera',
    email: 'j.rivera@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 10,
    avgScore: 68,
    faculty: 'M.Persson',
    trend: 'up',
    status: 'improving',
    weakAreas: ['Physical Disabilities'],
    strongAreas: ['Mental Health', 'Wellness'],
  },
  {
    id: 's7',
    name: 'Sam Wilson',
    email: 's.wilson@university.edu',
    cohort: 'Spring 2024',
    enrollmentDate: '2024-01-10',
    examsCompleted: 9,
    avgScore: 91,
    faculty: 'S.Mitchell',
    trend: 'up',
    status: 'excellent',
    weakAreas: [],
    strongAreas: ['Evaluation', 'Intervention', 'Management', 'Competency'],
  },
  {
    id: 's9',
    name: 'Taylor Kim',
    email: 'taylor.kim@university.edu',
    cohort: 'Fall 2023',
    enrollmentDate: '2023-08-15',
    examsCompleted: 18,
    avgScore: 75,
    faculty: 'J.Chen',
    trend: 'stable',
    status: 'on-track',
    weakAreas: ['Geriatrics'],
    strongAreas: ['Pediatrics'],
  },
]

const initialCohorts: Cohort[] = [
  { id: 'c1', name: 'Fall 2024', startDate: '2024-08-15', studentCount: 6 },
  { id: 'c2', name: 'Spring 2024', startDate: '2024-01-10', studentCount: 2 },
  { id: 'c3', name: 'Fall 2023', startDate: '2023-08-15', studentCount: 0 },
]

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  'excellent': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Excellent' },
  'on-track': { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'On Track' },
  'improving': { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Improving' },
  'at-risk': { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'At Risk' },
  'critical': { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Critical' },
}

// Tier color mapping
const tierColors: Record<RemediationTier, { bg: string; text: string; border: string; label: string }> = {
  1: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Tier 1' },
  2: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Tier 2' },
  3: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Tier 3' },
}

// Domain color mapping
const domainColors: Record<NBCOTDomain, { bg: string; text: string; bar: string }> = {
  evaluation: { bg: 'bg-blue-500/10', text: 'text-blue-400', bar: 'bg-blue-500' },
  intervention: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  management: { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500' },
  competency: { bg: 'bg-violet-500/10', text: 'text-violet-400', bar: 'bg-violet-500' },
}

// Domain labels
const domainLabels: Record<NBCOTDomain, string> = {
  evaluation: 'Evaluation & Assessment',
  intervention: 'Intervention',
  management: 'Management of Services',
  competency: 'Professional Competency',
}

// Tier Badge Component
function TierBadge({ tier }: { tier: RemediationTier }) {
  const colors = tierColors[tier]
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
      T{tier}
    </span>
  )
}

// Remediation Queue Component
function RemediationQueue({ onSelectStudent, studentNotes }: { onSelectStudent: (studentId: string, openModal: boolean) => void; studentNotes: Record<string, string> }) {
  const queue = getRemediationQueue()
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="ot-glass rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-left">
            <h3 className="ot-font-display text-sm font-medium">Remediation Queue</h3>
            <p className="ot-font-body text-[10px] text-gray-500">{queue.length} students need attention</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2 overflow-y-auto">
              {queue.map((item) => {
                const colors = tierColors[item.tier]
                const daysUntilDue = Math.ceil((new Date(item.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isOverdue = daysUntilDue < 0

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => onSelectStudent(item.studentId, true)}
                    className={`w-full text-left p-3 rounded-lg border ${colors.border} ${colors.bg} hover:bg-white/10 transition-colors`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-[10px]">
                          {item.studentName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="ot-font-body text-sm font-medium">{item.studentName}</div>
                          <div className="ot-font-body text-[10px] text-gray-500">{item.cohort}</div>
                        </div>
                      </div>
                      <TierBadge tier={item.tier} />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {item.weakDomains.map(domain => (
                        <span key={domain} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-gray-400 capitalize">
                          {domain}
                        </span>
                      ))}
                    </div>

                    {/* Faculty Note Preview */}
                    {studentNotes[item.studentId] && (
                      <div className="mb-2 p-2 bg-white/5 rounded border border-white/10">
                        <p className="ot-font-body text-[10px] text-gray-400 line-clamp-2">
                          {studentNotes[item.studentId]}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className={`ot-font-body text-[10px] ${isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                          {isOverdue ? `${Math.abs(daysUntilDue)}d overdue` : `${daysUntilDue}d left`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.text.replace('text-', 'bg-')}`}
                            style={{ width: `${(item.questionsCompleted / item.assignedQuestions.length) * 100}%` }}
                          />
                        </div>
                        <span className="ot-font-body text-[10px] text-gray-500">
                          {item.questionsCompleted}/{item.assignedQuestions.length}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                )
              })}

              {queue.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="ot-font-body text-sm text-gray-500">No pending remediation</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Student-to-remediation mapping (mock - in real app, derive from data)
const studentRemediationTiers: Record<string, RemediationTier> = {
  's4': 2, // Jordan Williams
  's5': 1, // Casey Johnson (was Taylor Martinez)
  's8': 3, // Morgan Lee
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [cohorts, setCohorts] = useState<Cohort[]>(initialCohorts)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCohort, setFilterCohort] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  // Modal states
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showEditStudent, setShowEditStudent] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCohortManager, setShowCohortManager] = useState(false)
  const [showAddCohort, setShowAddCohort] = useState(false)
  const [showFullProfile, setShowFullProfile] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null)

  // Faculty notes per student
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({
    's4': 'Scheduled meeting for Dec 15 to discuss intervention strategies. Parent contacted.',
    's8': 'Referred to academic support. Follow up needed on study plan compliance.',
  })

  // Sidebar margin from shared component
  const sidebarMargin = useSidebarWidth()

  // Form state
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    cohort: 'Fall 2024',
  })
  const [cohortForm, setCohortForm] = useState({
    name: '',
    startDate: '',
  })

  // CRUD handlers
  const handleAddStudent = () => {
    if (!studentForm.name || !studentForm.email) return
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: studentForm.name,
      email: studentForm.email,
      cohort: studentForm.cohort,
      enrollmentDate: new Date().toISOString().split('T')[0],
      examsCompleted: 0,
      avgScore: 0,
      faculty: 'K.Kadowaki',
      trend: 'stable',
      status: 'on-track',
      weakAreas: [],
      strongAreas: [],
    }
    setStudents([...students, newStudent])
    setStudentForm({ name: '', email: '', cohort: 'Fall 2024' })
    setShowAddStudent(false)
  }

  const handleEditStudent = () => {
    if (!editingStudent) return
    setStudents(students.map(s =>
      s.id === editingStudent.id ? { ...editingStudent, ...studentForm } : s
    ))
    setShowEditStudent(false)
    setEditingStudent(null)
  }

  const handleDeleteStudent = () => {
    if (!deletingStudentId) return
    setStudents(students.filter(s => s.id !== deletingStudentId))
    setShowDeleteConfirm(false)
    setDeletingStudentId(null)
    if (selectedStudent === deletingStudentId) setSelectedStudent(null)
  }

  const handleAddCohort = () => {
    if (!cohortForm.name || !cohortForm.startDate) return
    const newCohort: Cohort = {
      id: `c${Date.now()}`,
      name: cohortForm.name,
      startDate: cohortForm.startDate,
      studentCount: 0,
    }
    setCohorts([...cohorts, newCohort])
    setCohortForm({ name: '', startDate: '' })
    setShowAddCohort(false)
  }

  const handleDeleteCohort = (cohortId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId)
    if (!cohort) return
    // Move students to 'Unassigned' or delete cohort
    setStudents(students.map(s => s.cohort === cohort.name ? { ...s, cohort: 'Unassigned' } : s))
    setCohorts(cohorts.filter(c => c.id !== cohortId))
  }

  const openEditModal = (student: Student) => {
    setEditingStudent(student)
    setStudentForm({ name: student.name, email: student.email, cohort: student.cohort })
    setShowEditStudent(true)
  }

  const openDeleteConfirm = (studentId: string) => {
    setDeletingStudentId(studentId)
    setShowDeleteConfirm(true)
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCohort = filterCohort === 'all' || student.cohort === filterCohort
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesCohort && matchesStatus
  })

  const selectedStudentData = students.find(s => s.id === selectedStudent)

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
        .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .ot-gradient-text { background: linear-gradient(135deg, #d4a574 0%, #e8c9a0 50%, #d4a574 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      <Sidebar activePage="students" />

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
                <h1 className="ot-font-display text-xl">Student Management</h1>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <Bell className="w-5 h-5 text-gray-400" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#0a0f1a]" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Page header with actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddStudent(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
              <button
                onClick={() => setShowCohortManager(true)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                Cohorts
              </button>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div>
              <h1 className="ot-font-display text-3xl lg:hidden">Student Management</h1>
              <p className="ot-font-body text-gray-400">
                Manage students and track individual performance
              </p>
            </div>
          </div>

          {/* Two-column layout: Main Content + Remediation Queue */}
          <div className="flex gap-6 items-start">
            {/* Main content area */}
            <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
              />
            </div>

            <select
              value={filterCohort}
              onChange={(e) => setFilterCohort(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm focus:outline-none focus:border-[#d4a574]/50"
            >
              <option value="all">All Cohorts</option>
              {cohorts.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm focus:outline-none focus:border-[#d4a574]/50"
            >
              <option value="all">All Status</option>
              <option value="excellent">Excellent</option>
              <option value="on-track">On Track</option>
              <option value="improving">Improving</option>
              <option value="at-risk">At Risk</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">{filteredStudents.length}</div>
                  <div className="ot-font-body text-xs text-gray-500">Total Students</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">
                    {filteredStudents.filter(s => s.status === 'excellent' || s.status === 'on-track').length}
                  </div>
                  <div className="ot-font-body text-xs text-gray-500">On Track</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">
                    {filteredStudents.filter(s => s.status === 'at-risk').length}
                  </div>
                  <div className="ot-font-body text-xs text-gray-500">At Risk</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">
                    {filteredStudents.filter(s => s.status === 'critical').length}
                  </div>
                  <div className="ot-font-body text-xs text-gray-500">Critical</div>
                </div>
              </div>
            </div>
          </div>

          {/* Student table */}
          <div className="ot-glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Cohort</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Exams</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Avg Score</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Trend</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Faculty</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const status = statusColors[student.status]
                    return (
                      <tr
                        key={student.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student.id)
                                  setShowFullProfile(true)
                                }}
                                className="ot-font-body font-medium hover:text-[#d4a574] transition-colors text-left"
                              >
                                {student.name}
                              </button>
                              <div className="ot-font-body text-xs text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 ot-font-body text-sm text-gray-400">{student.cohort}</td>
                        <td className="py-4 px-6 ot-font-body text-sm">{student.examsCompleted}</td>
                        <td className="py-4 px-6">
                          <span className={`ot-font-body font-medium ${
                            student.avgScore >= 75 ? 'text-emerald-400' :
                            student.avgScore >= 60 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {student.avgScore}%
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {student.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                          {student.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                          {student.trend === 'stable' && <Activity className="w-4 h-4 text-gray-400" />}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs ot-font-body ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {studentRemediationTiers[student.id] ? (
                            <TierBadge tier={studentRemediationTiers[student.id]} />
                          ) : (
                            <span className="ot-font-body text-xs text-gray-600">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 ot-font-body text-sm text-gray-400">{student.faculty}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedStudent(student.id)
                                setShowFullProfile(true)
                              }}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => {
                                // TODO: Implement send report functionality
                                alert(`Sending report for ${student.name}`)
                              }}
                              className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                              title="Send Report"
                            >
                              <Mail className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={() => openEditModal(student)}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Edit Student"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(student.id)}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="py-12 text-center">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="ot-font-body text-gray-500">No students found matching your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="ot-font-body text-sm text-gray-500">
              Showing {filteredStudents.length} of {students.length} students
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 bg-[#d4a574]/10 text-[#d4a574] rounded-lg ot-font-body text-sm">1</span>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
            </div>

            {/* Right sidebar: Remediation Queue */}
            <div className="hidden xl:block w-80 flex-shrink-0 sticky top-24 self-start">
              <RemediationQueue
                studentNotes={studentNotes}
                onSelectStudent={(studentId, openModal) => {
                  setSelectedStudent(studentId)
                  if (openModal) setShowFullProfile(true)
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddStudent(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="ot-font-display text-xl">Add New Student</h3>
                <button onClick={() => setShowAddStudent(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block ot-font-body text-sm text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="Enter student name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
                  />
                </div>
                <div>
                  <label className="block ot-font-body text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="student@university.edu"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
                  />
                </div>
                <div>
                  <label className="block ot-font-body text-sm text-gray-400 mb-2">Cohort</label>
                  <select
                    value={studentForm.cohort}
                    onChange={(e) => setStudentForm({ ...studentForm, cohort: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white focus:outline-none focus:border-[#d4a574]/50"
                  >
                    {cohorts.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddStudent(false)}
                  className="flex-1 py-3 border border-white/10 rounded-lg ot-font-body hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="flex-1 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body font-semibold"
                >
                  Add Student
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {showEditStudent && editingStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditStudent(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="ot-font-display text-xl">Edit Student</h3>
                <button onClick={() => setShowEditStudent(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block ot-font-body text-sm text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white focus:outline-none focus:border-[#d4a574]/50"
                  />
                </div>
                <div>
                  <label className="block ot-font-body text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white focus:outline-none focus:border-[#d4a574]/50"
                  />
                </div>
                <div>
                  <label className="block ot-font-body text-sm text-gray-400 mb-2">Cohort</label>
                  <select
                    value={studentForm.cohort}
                    onChange={(e) => setStudentForm({ ...studentForm, cohort: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white focus:outline-none focus:border-[#d4a574]/50"
                  >
                    {cohorts.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditStudent(false)}
                  className="flex-1 py-3 border border-white/10 rounded-lg ot-font-body hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditStudent}
                  className="flex-1 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && deletingStudentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="ot-font-display text-xl">Delete Student</h3>
                  <p className="ot-font-body text-gray-400 text-sm">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="ot-font-body text-gray-300 mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-white">
                  {students.find(s => s.id === deletingStudentId)?.name}
                </span>
                ? All their exam history and progress will be permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 border border-white/10 rounded-lg ot-font-body hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg ot-font-body font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete Student
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cohort Manager Modal */}
      <AnimatePresence>
        {showCohortManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCohortManager(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="ot-font-display text-xl">Manage Cohorts</h3>
                <button onClick={() => setShowCohortManager(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {cohorts.map(cohort => {
                  const studentCount = students.filter(s => s.cohort === cohort.name).length
                  return (
                    <div
                      key={cohort.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                    >
                      <div>
                        <div className="ot-font-body font-medium">{cohort.name}</div>
                        <div className="ot-font-body text-sm text-gray-500">
                          Started {cohort.startDate} • {studentCount} students
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCohort(cohort.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Cohort"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  )
                })}

                {cohorts.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="ot-font-body text-gray-500">No cohorts yet</p>
                  </div>
                )}
              </div>

              {!showAddCohort ? (
                <button
                  onClick={() => setShowAddCohort(true)}
                  className="w-full py-3 border border-dashed border-white/20 rounded-xl ot-font-body text-gray-400 hover:border-[#d4a574]/50 hover:text-[#d4a574] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Cohort
                </button>
              ) : (
                <div className="p-4 bg-white/5 rounded-xl space-y-4">
                  <div>
                    <label className="block ot-font-body text-sm text-gray-400 mb-2">Cohort Name</label>
                    <input
                      type="text"
                      value={cohortForm.name}
                      onChange={(e) => setCohortForm({ ...cohortForm, name: e.target.value })}
                      placeholder="e.g., Spring 2025"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
                    />
                  </div>
                  <div>
                    <label className="block ot-font-body text-sm text-gray-400 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={cohortForm.startDate}
                      onChange={(e) => setCohortForm({ ...cohortForm, startDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white focus:outline-none focus:border-[#d4a574]/50"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowAddCohort(false)
                        setCohortForm({ name: '', startDate: '' })
                      }}
                      className="flex-1 py-2 border border-white/10 rounded-lg ot-font-body text-sm hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCohort}
                      className="flex-1 py-2 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body text-sm font-semibold"
                    >
                      Create Cohort
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Profile Modal */}
      <AnimatePresence>
        {showFullProfile && selectedStudentData && (() => {
          // Get analytics data for the selected student
          const domainScores = getDomainScores(selectedStudentData.id)
          const checkpoints = getStudentCheckpoints(selectedStudentData.id)
          const remediation = getStudentRemediation(selectedStudentData.id)

          // Calculate readiness score
          const passedMilestones = checkpoints.filter(cp => cp.status === 'passed').length
          const avgDomainScore = Object.values(domainScores).reduce((a, b) => a + b, 0) / 4
          const readinessScore = Math.round(passedMilestones / 4 * 40 + avgDomainScore * 0.6)

          // Get current milestone
          const currentCheckpoint = checkpoints.find(cp => cp.status === 'in-progress' || cp.status === 'remediation')
            || checkpoints.filter(cp => cp.status === 'passed').slice(-1)[0]
            || checkpoints[0]
          const currentMilestone = currentCheckpoint ? programMilestones.find(m => m.id === currentCheckpoint.milestoneId) : null

          return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#0d1420] border-b border-white/10 p-6 z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xl font-medium">
                      {selectedStudentData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="ot-font-display text-2xl">{selectedStudentData.name}</h3>
                        {/* Status & Tier Badges */}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs ot-font-body ${statusColors[selectedStudentData.status].bg} ${statusColors[selectedStudentData.status].text}`}>
                          {statusColors[selectedStudentData.status].label}
                        </span>
                        {studentRemediationTiers[selectedStudentData.id] && (
                          <TierBadge tier={studentRemediationTiers[selectedStudentData.id]} />
                        )}
                        {/* Current Milestone */}
                        {currentMilestone && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-[#d4a574]/10 text-[#d4a574] border border-[#d4a574]/20">
                            {currentMilestone.name}
                          </span>
                        )}
                        {/* Trend Indicator */}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          selectedStudentData.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' :
                          selectedStudentData.trend === 'down' ? 'bg-red-500/10 text-red-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {selectedStudentData.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                          {selectedStudentData.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                          {selectedStudentData.trend === 'stable' && <Activity className="w-3 h-3" />}
                          <span>{selectedStudentData.trend === 'up' ? 'Improving' : selectedStudentData.trend === 'down' ? 'Declining' : 'Stable'}</span>
                        </div>
                      </div>
                      <p className="ot-font-body text-gray-400">{selectedStudentData.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="ot-font-body text-sm text-gray-500">{selectedStudentData.cohort}</span>
                        <span className="text-gray-600">•</span>
                        <span className="ot-font-body text-sm text-gray-500">Enrolled {selectedStudentData.enrollmentDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Readiness Score */}
                    <div className="text-right mr-2">
                      <div className="ot-font-body text-[10px] text-gray-500 uppercase tracking-wider">Readiness</div>
                      <div className="ot-font-display text-2xl font-semibold">
                        <span className={readinessScore >= 70 ? 'text-emerald-400' : readinessScore >= 50 ? 'text-amber-400' : 'text-red-400'}>
                          {readinessScore}
                        </span>
                        <span className="text-gray-500 text-sm">/100</span>
                      </div>
                    </div>
                    <button onClick={() => setShowFullProfile(false)} className="p-2 hover:bg-white/5 rounded-lg">
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
                {/* Faculty Notes */}
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="ot-font-body text-[10px] text-gray-500 uppercase tracking-wider">Faculty Notes</span>
                    <span className="ot-font-body text-[10px] text-gray-600">Auto-saved</span>
                  </div>
                  <textarea
                    value={studentNotes[selectedStudentData.id] || ''}
                    onChange={(e) => setStudentNotes(prev => ({
                      ...prev,
                      [selectedStudentData.id]: e.target.value
                    }))}
                    placeholder="Add notes about this student (actions needed, follow-ups, reminders...)"
                    className="w-full bg-transparent text-sm ot-font-body text-gray-300 placeholder:text-gray-600 resize-none focus:outline-none min-h-[60px]"
                    rows={2}
                  />
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="ot-font-body text-[10px] text-gray-500 uppercase tracking-wider mb-1">Average Score</div>
                    <div className={`ot-font-display text-2xl ${
                      selectedStudentData.avgScore >= 75 ? 'text-emerald-400' :
                      selectedStudentData.avgScore >= 60 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {selectedStudentData.avgScore}%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="ot-font-body text-[10px] text-gray-500 uppercase tracking-wider mb-1">Exams Completed</div>
                    <div className="ot-font-display text-2xl">{selectedStudentData.examsCompleted}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="ot-font-body text-[10px] text-gray-500 uppercase tracking-wider mb-1">Milestones Passed</div>
                    <div className="ot-font-display text-2xl">
                      <span className="text-emerald-400">{passedMilestones}</span>
                      <span className="text-gray-500 text-sm">/4</span>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="ot-font-body text-[10px] text-gray-500 uppercase tracking-wider mb-1">Faculty Advisor</div>
                    <div className="ot-font-body text-sm text-gray-300 mt-1">{selectedStudentData.faculty}</div>
                  </div>
                </div>

                {/* Domain Competency */}
                <div className="bg-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="ot-font-display text-base">NBCOT Domain Competency</h4>
                    <span className="ot-font-body text-xs text-gray-500">Threshold: 70%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(Object.keys(domainColors) as NBCOTDomain[]).map((domain) => {
                      const score = domainScores[domain]
                      const colors = domainColors[domain]
                      const isAboveThreshold = score >= 70
                      return (
                        <div key={domain} className={`p-3 rounded-lg border ${colors.bg} ${isAboveThreshold ? 'border-white/5' : 'border-red-500/20'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="ot-font-body text-sm capitalize">{domainLabels[domain]}</span>
                            <span className={`ot-font-display font-semibold ${isAboveThreshold ? colors.text : 'text-red-400'}`}>
                              {score}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-white/10 rounded-full overflow-visible">
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full transition-all ${isAboveThreshold ? colors.bar : 'bg-red-500'}`}
                              style={{ width: `${Math.min(score, 100)}%` }}
                            />
                            {/* Threshold marker */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-white/40" style={{ left: '70%' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Weak & Strong Areas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-3">Weak Areas</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudentData.weakAreas.length > 0 ? (
                        selectedStudentData.weakAreas.map(area => (
                          <span key={area} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                            {area}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">None identified</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-3">Strong Areas</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudentData.strongAreas.length > 0 ? (
                        selectedStudentData.strongAreas.map(area => (
                          <span key={area} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">
                            {area}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">Building proficiency</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Remediation Alert */}
                {remediation && (
                  <div className={`p-4 rounded-xl border ${tierColors[remediation.tier].border} ${tierColors[remediation.tier].bg}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${tierColors[remediation.tier].bg} border ${tierColors[remediation.tier].border} flex items-center justify-center flex-shrink-0`}>
                        <Target className={`w-5 h-5 ${tierColors[remediation.tier].text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="ot-font-display text-sm">Active Remediation</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${tierColors[remediation.tier].bg} ${tierColors[remediation.tier].text} border ${tierColors[remediation.tier].border}`}>
                            {tierColors[remediation.tier].label}
                          </span>
                        </div>
                        <p className="ot-font-body text-sm text-gray-400 mb-2">{remediation.reason}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${tierColors[remediation.tier].text.replace('text-', 'bg-')}`}
                                style={{ width: `${(remediation.questionsCompleted / remediation.assignedQuestions.length) * 100}%` }}
                              />
                            </div>
                            <span className="ot-font-body text-xs text-gray-500">
                              {remediation.questionsCompleted}/{remediation.assignedQuestions.length} questions
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span className="ot-font-body text-xs">
                              Due {new Date(remediation.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-[#0d1420] border-t border-white/10 p-6 flex gap-3 z-10">
                <button
                  onClick={() => {
                    alert(`Sending report for ${selectedStudentData.name}`)
                  }}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Report
                </button>
                <Link
                  to={`/otexam/pathway/${selectedStudentData.id}`}
                  onClick={() => setShowFullProfile(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body font-semibold flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Full Learning Pathway
                </Link>
              </div>
            </motion.div>
          </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
