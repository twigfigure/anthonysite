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
  GraduationCap,
  BarChart3,
  BookOpen,
  Brain,
  Settings,
  Bell,
  User,
  Eye,
  X,
  Edit,
  Trash2,
  FolderPlus,
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  cohort: string
  enrollmentDate: string
  examsCompleted: number
  avgScore: number
  lastActive: string
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

// Initial mock data
const initialStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 12,
    avgScore: 82,
    lastActive: '2 hours ago',
    trend: 'up',
    status: 'on-track',
    weakAreas: ['Management'],
    strongAreas: ['Evaluation', 'Intervention'],
  },
  {
    id: '2',
    name: 'Jordan Williams',
    email: 'j.williams@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 8,
    avgScore: 52,
    lastActive: '1 day ago',
    trend: 'down',
    status: 'at-risk',
    weakAreas: ['Intervention', 'Management'],
    strongAreas: [],
  },
  {
    id: '3',
    name: 'Taylor Martinez',
    email: 't.martinez@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 6,
    avgScore: 55,
    lastActive: '3 hours ago',
    trend: 'stable',
    status: 'at-risk',
    weakAreas: ['Evaluation'],
    strongAreas: ['Mental Health'],
  },
  {
    id: '4',
    name: 'Casey Johnson',
    email: 'casey.j@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 15,
    avgScore: 78,
    lastActive: '5 hours ago',
    trend: 'up',
    status: 'on-track',
    weakAreas: ['Hand Therapy'],
    strongAreas: ['Pediatrics', 'Geriatrics'],
  },
  {
    id: '5',
    name: 'Morgan Lee',
    email: 'morgan.lee@university.edu',
    cohort: 'Spring 2024',
    enrollmentDate: '2024-01-10',
    examsCompleted: 22,
    avgScore: 48,
    lastActive: '6 hours ago',
    trend: 'down',
    status: 'critical',
    weakAreas: ['Management', 'Competency', 'Intervention'],
    strongAreas: [],
  },
  {
    id: '6',
    name: 'Jamie Rivera',
    email: 'j.rivera@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 10,
    avgScore: 68,
    lastActive: '4 hours ago',
    trend: 'up',
    status: 'improving',
    weakAreas: ['Physical Disabilities'],
    strongAreas: ['Mental Health', 'Wellness'],
  },
  {
    id: '7',
    name: 'Sam Wilson',
    email: 's.wilson@university.edu',
    cohort: 'Fall 2024',
    enrollmentDate: '2024-08-15',
    examsCompleted: 9,
    avgScore: 91,
    lastActive: '1 hour ago',
    trend: 'up',
    status: 'excellent',
    weakAreas: [],
    strongAreas: ['Evaluation', 'Intervention', 'Management', 'Competency'],
  },
  {
    id: '8',
    name: 'Taylor Kim',
    email: 'taylor.kim@university.edu',
    cohort: 'Spring 2024',
    enrollmentDate: '2024-01-10',
    examsCompleted: 18,
    avgScore: 75,
    lastActive: '2 days ago',
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
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null)

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
      lastActive: 'Just now',
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

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d1420] border-r border-white/5 p-6 hidden lg:block">
        <Link to="/otexam" className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-[#0a0f1a]" />
          </div>
          <span className="ot-font-display text-xl font-semibold">OTexam</span>
        </Link>

        <nav className="space-y-2">
          <Link
            to="/otexam/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            to="/otexam/students"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#d4a574]/10 text-[#d4a574] ot-font-body"
          >
            <Users className="w-5 h-5" />
            Students
          </Link>
          <Link
            to="/otexam/exam"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Practice Exams
          </Link>
          <Link
            to="/otexam/questions"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors"
          >
            <Brain className="w-5 h-5" />
            Question Bank
          </Link>
          <Link
            to="/otexam"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ot-font-body transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-400 ot-font-body text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
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
            <div>
              <h1 className="ot-font-display text-3xl lg:hidden">Student Management</h1>
              <p className="ot-font-body text-gray-400 mt-1">
                Manage students and track individual performance
              </p>
            </div>

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
          </div>

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
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="text-left py-4 px-6 ot-font-body text-xs text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const status = statusColors[student.status]
                    return (
                      <tr
                        key={student.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                          selectedStudent === student.id ? 'bg-white/5' : ''
                        }`}
                        onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="ot-font-body font-medium">{student.name}</div>
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
                        <td className="py-4 px-6 ot-font-body text-sm text-gray-500">{student.lastActive}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedStudent(student.id); }}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openEditModal(student); }}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Edit Student"
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); openDeleteConfirm(student.id); }}
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

          {/* Student detail panel */}
          {selectedStudentData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 ot-glass rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xl font-medium">
                    {selectedStudentData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="ot-font-display text-2xl">{selectedStudentData.name}</h3>
                    <p className="ot-font-body text-gray-400">{selectedStudentData.email}</p>
                    <p className="ot-font-body text-sm text-gray-500">{selectedStudentData.cohort} • Enrolled {selectedStudentData.enrollmentDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4" />
                    Send Report
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body text-sm font-medium">
                    View Full Profile
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Average Score</div>
                  <div className={`ot-font-display text-3xl ${
                    selectedStudentData.avgScore >= 75 ? 'text-emerald-400' :
                    selectedStudentData.avgScore >= 60 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {selectedStudentData.avgScore}%
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Exams Completed</div>
                  <div className="ot-font-display text-3xl">{selectedStudentData.examsCompleted}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Weak Areas</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedStudentData.weakAreas.length > 0 ? (
                      selectedStudentData.weakAreas.map(area => (
                        <span key={area} className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs">
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">None identified</span>
                    )}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Strong Areas</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedStudentData.strongAreas.length > 0 ? (
                      selectedStudentData.strongAreas.map(area => (
                        <span key={area} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs">
                          {area}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Building proficiency</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
    </div>
  )
}
