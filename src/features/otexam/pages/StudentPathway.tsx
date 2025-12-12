import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  User,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Play,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  XCircle,
  Award,
  Layers,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { useSidebarWidth } from '../hooks/useSidebarWidth'
import {
  programMilestones,
  getDomainScores,
  getStudentCheckpoints,
  getStudentRemediation,
} from '../data/analytics'
import type { NBCOTDomain, RemediationTier, StudentCheckpoint, RemediationPlan } from '../types'

// Mock student data - in real app, fetch from API
const studentsData: Record<string, {
  id: string
  name: string
  email: string
  cohort: string
  enrollmentDate: Date
}> = {
  's1': { id: 's1', name: 'Alex Chen', email: 'alex.chen@university.edu', cohort: 'Fall 2024', enrollmentDate: new Date('2024-08-15') },
  's2': { id: 's2', name: 'Jamie Rivera', email: 'j.rivera@university.edu', cohort: 'Fall 2024', enrollmentDate: new Date('2024-08-15') },
  's3': { id: 's3', name: 'Taylor Martinez', email: 't.martinez@university.edu', cohort: 'Fall 2024', enrollmentDate: new Date('2024-08-15') },
  's4': { id: 's4', name: 'Jordan Williams', email: 'j.williams@university.edu', cohort: 'Fall 2024', enrollmentDate: new Date('2024-08-15') },
  's5': { id: 's5', name: 'Casey Johnson', email: 'casey.j@university.edu', cohort: 'Fall 2024', enrollmentDate: new Date('2024-08-15') },
  's6': { id: 's6', name: 'Riley Kim', email: 'riley.k@university.edu', cohort: 'Fall 2024', enrollmentDate: new Date('2024-08-15') },
  's7': { id: 's7', name: 'Morgan Lee', email: 'morgan.lee@university.edu', cohort: 'Spring 2024', enrollmentDate: new Date('2024-01-10') },
  's8': { id: 's8', name: 'Sam Wilson', email: 's.wilson@university.edu', cohort: 'Spring 2024', enrollmentDate: new Date('2024-01-10') },
  's9': { id: 's9', name: 'Taylor Kim', email: 'taylor.kim@university.edu', cohort: 'Fall 2023', enrollmentDate: new Date('2023-08-15') },
  's10': { id: 's10', name: 'Jordan Park', email: 'jordan.park@university.edu', cohort: 'Fall 2023', enrollmentDate: new Date('2023-08-15') },
  's11': { id: 's11', name: 'Alex Rivera', email: 'alex.rivera@university.edu', cohort: 'Fall 2023', enrollmentDate: new Date('2023-08-15') },
}

// Tier color mapping
const tierColors: Record<RemediationTier, { bg: string; text: string; border: string; label: string }> = {
  1: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Tier 1 - Automated' },
  2: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Tier 2 - Advisor-Assisted' },
  3: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Tier 3 - Formal' },
}

// Mock course data
interface Course {
  id: string
  name: string
  code: string
  progress: number
  status: 'active' | 'completed' | 'upcoming'
  instructor: string
  dueDate?: Date
}

const studentCourses: Record<string, Course[]> = {
  's1': [
    { id: 'c1', name: 'Foundations of OT Practice', code: 'OT 501', progress: 100, status: 'completed', instructor: 'Dr. Sarah Mitchell' },
    { id: 'c2', name: 'Clinical Reasoning & Assessment', code: 'OT 502', progress: 85, status: 'active', instructor: 'Dr. James Chen', dueDate: new Date('2025-01-15') },
    { id: 'c3', name: 'Physical Rehabilitation', code: 'OT 510', progress: 72, status: 'active', instructor: 'Dr. Maria Garcia', dueDate: new Date('2025-01-20') },
    { id: 'c4', name: 'Pediatric OT Interventions', code: 'OT 520', progress: 0, status: 'upcoming', instructor: 'Dr. Emily Wong' },
  ],
  's2': [
    { id: 'c1', name: 'Foundations of OT Practice', code: 'OT 501', progress: 100, status: 'completed', instructor: 'Dr. Sarah Mitchell' },
    { id: 'c2', name: 'Clinical Reasoning & Assessment', code: 'OT 502', progress: 60, status: 'active', instructor: 'Dr. James Chen', dueDate: new Date('2025-01-15') },
    { id: 'c3', name: 'Mental Health OT', code: 'OT 515', progress: 45, status: 'active', instructor: 'Dr. Lisa Park', dueDate: new Date('2025-02-01') },
  ],
  's3': [
    { id: 'c1', name: 'Foundations of OT Practice', code: 'OT 501', progress: 100, status: 'completed', instructor: 'Dr. Sarah Mitchell' },
    { id: 'c2', name: 'Clinical Reasoning & Assessment', code: 'OT 502', progress: 92, status: 'active', instructor: 'Dr. James Chen', dueDate: new Date('2025-01-15') },
    { id: 'c3', name: 'Physical Rehabilitation', code: 'OT 510', progress: 88, status: 'active', instructor: 'Dr. Maria Garcia', dueDate: new Date('2025-01-20') },
    { id: 'c4', name: 'Hand Therapy Fundamentals', code: 'OT 525', progress: 65, status: 'active', instructor: 'Dr. Robert Kim', dueDate: new Date('2025-02-10') },
  ],
}

// Mock exam history with question-level results
interface ExamAttempt {
  id: string
  examName: string
  date: Date
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number // minutes
  questionResults: {
    questionId: string
    questionText: string
    correct: boolean
    selectedAnswer: string
    correctAnswer: string
    domain: NBCOTDomain
    difficulty: number
  }[]
}

const studentExamHistory: Record<string, ExamAttempt[]> = {
  's1': [
    {
      id: 'e1',
      examName: 'Mock Exam 1 - Comprehensive',
      date: new Date('2024-12-01'),
      score: 78,
      totalQuestions: 20,
      correctAnswers: 16,
      timeSpent: 45,
      questionResults: [
        { questionId: 'q1', questionText: 'Sensory Profile assessment approach for 7-year-old with ASD', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'evaluation', difficulty: 3 },
        { questionId: 'q2', questionText: 'Person-centered dementia care for meal refusal', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'intervention', difficulty: 4 },
        { questionId: 'q3', questionText: 'Complex proximal phalanx fracture intervention timing', correct: false, selectedAnswer: 'A', correctAnswer: 'D', domain: 'intervention', difficulty: 4 },
        { questionId: 'q5', questionText: 'PTSD intervention in acute mental health setting', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'intervention', difficulty: 4 },
        { questionId: 'q7', questionText: 'Stroke patient bilateral integration activities', correct: false, selectedAnswer: 'B', correctAnswer: 'D', domain: 'intervention', difficulty: 3 },
        { questionId: 'q10', questionText: 'Spinal cord injury community reintegration', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'intervention', difficulty: 4 },
        { questionId: 'q16', questionText: 'Burn scar management hypertrophic scarring', correct: false, selectedAnswer: 'C', correctAnswer: 'B', domain: 'intervention', difficulty: 4 },
        { questionId: 'q24', questionText: 'Total hip replacement ADL training', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'intervention', difficulty: 3 },
        { questionId: 'q36', questionText: 'OTPF-4 Areas of Occupation classification', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'competency', difficulty: 1 },
        { questionId: 'q40', questionText: 'Posterolateral THA hip precautions', correct: false, selectedAnswer: 'C', correctAnswer: 'A', domain: 'intervention', difficulty: 2 },
      ],
    },
    {
      id: 'e2',
      examName: 'Domain Focus: Evaluation',
      date: new Date('2024-12-08'),
      score: 85,
      totalQuestions: 15,
      correctAnswers: 13,
      timeSpent: 32,
      questionResults: [
        { questionId: 'q1', questionText: 'Sensory Profile assessment approach for 7-year-old with ASD', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'evaluation', difficulty: 3 },
        { questionId: 'q37', questionText: 'Median nerve sensory innervation distribution', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'evaluation', difficulty: 2 },
        { questionId: 'q38', questionText: 'Sensory Profile 2 interpretation - low thresholds', correct: false, selectedAnswer: 'B', correctAnswer: 'A', domain: 'evaluation', difficulty: 3 },
        { questionId: 'q6', questionText: 'Client-centered goal setting in inpatient rehab', correct: true, selectedAnswer: 'D', correctAnswer: 'D', domain: 'evaluation', difficulty: 3 },
        { questionId: 'q21', questionText: 'TBI Rancho levels errorless learning', correct: false, selectedAnswer: 'A', correctAnswer: 'C', domain: 'evaluation', difficulty: 4 },
      ],
    },
    {
      id: 'e3',
      examName: 'Quick Practice - 10 Questions',
      date: new Date('2024-12-10'),
      score: 90,
      totalQuestions: 10,
      correctAnswers: 9,
      timeSpent: 18,
      questionResults: [
        { questionId: 'q39', questionText: 'Model of Human Occupation (MOHO) primary focus', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'competency', difficulty: 2 },
        { questionId: 'q41', questionText: 'Procedural vs episodic memory in dementia', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'competency', difficulty: 2 },
        { questionId: 'q28', questionText: 'Substance use disorder recovery occupations', correct: false, selectedAnswer: 'A', correctAnswer: 'C', domain: 'intervention', difficulty: 3 },
        { questionId: 'q30', questionText: 'Zone II flexor tendon repair protocol', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'intervention', difficulty: 4 },
        { questionId: 'q25', questionText: 'Hemianopia driving evaluation referral', correct: true, selectedAnswer: 'D', correctAnswer: 'D', domain: 'evaluation', difficulty: 4 },
      ],
    },
  ],
  's2': [
    {
      id: 'e1',
      examName: 'Mock Exam 1 - Comprehensive',
      date: new Date('2024-12-05'),
      score: 62,
      totalQuestions: 20,
      correctAnswers: 12,
      timeSpent: 55,
      questionResults: [
        { questionId: 'q1', questionText: 'Sensory Profile assessment approach for 7-year-old with ASD', correct: false, selectedAnswer: 'A', correctAnswer: 'C', domain: 'evaluation', difficulty: 3 },
        { questionId: 'q2', questionText: 'Person-centered dementia care for meal refusal', correct: false, selectedAnswer: 'C', correctAnswer: 'B', domain: 'intervention', difficulty: 4 },
        { questionId: 'q3', questionText: 'Complex proximal phalanx fracture intervention timing', correct: false, selectedAnswer: 'B', correctAnswer: 'D', domain: 'intervention', difficulty: 4 },
        { questionId: 'q36', questionText: 'OTPF-4 Areas of Occupation classification', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'competency', difficulty: 1 },
        { questionId: 'q37', questionText: 'Median nerve sensory innervation distribution', correct: false, selectedAnswer: 'A', correctAnswer: 'C', domain: 'evaluation', difficulty: 2 },
        { questionId: 'q40', questionText: 'Posterolateral THA hip precautions', correct: false, selectedAnswer: 'B', correctAnswer: 'A', domain: 'intervention', difficulty: 2 },
        { questionId: 'q24', questionText: 'Total hip replacement ADL training', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'intervention', difficulty: 3 },
        { questionId: 'q28', questionText: 'Substance use disorder recovery occupations', correct: false, selectedAnswer: 'D', correctAnswer: 'C', domain: 'intervention', difficulty: 3 },
      ],
    },
  ],
  's3': [
    {
      id: 'e1',
      examName: 'Mock Exam 1 - Comprehensive',
      date: new Date('2024-12-02'),
      score: 92,
      totalQuestions: 20,
      correctAnswers: 18,
      timeSpent: 38,
      questionResults: [
        { questionId: 'q1', questionText: 'Sensory Profile assessment approach for 7-year-old with ASD', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'evaluation', difficulty: 3 },
        { questionId: 'q2', questionText: 'Person-centered dementia care for meal refusal', correct: true, selectedAnswer: 'B', correctAnswer: 'B', domain: 'intervention', difficulty: 4 },
        { questionId: 'q3', questionText: 'Complex proximal phalanx fracture intervention timing', correct: true, selectedAnswer: 'D', correctAnswer: 'D', domain: 'intervention', difficulty: 4 },
        { questionId: 'q16', questionText: 'Burn scar management hypertrophic scarring', correct: false, selectedAnswer: 'A', correctAnswer: 'B', domain: 'intervention', difficulty: 4 },
        { questionId: 'q30', questionText: 'Zone II flexor tendon repair protocol', correct: false, selectedAnswer: 'C', correctAnswer: 'B', domain: 'intervention', difficulty: 4 },
      ],
    },
    {
      id: 'e2',
      examName: 'Mock Exam 2 - Advanced',
      date: new Date('2024-12-09'),
      score: 88,
      totalQuestions: 25,
      correctAnswers: 22,
      timeSpent: 52,
      questionResults: [
        { questionId: 'q5', questionText: 'PTSD intervention in acute mental health setting', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'intervention', difficulty: 4 },
        { questionId: 'q10', questionText: 'Spinal cord injury community reintegration', correct: true, selectedAnswer: 'C', correctAnswer: 'C', domain: 'intervention', difficulty: 4 },
        { questionId: 'q21', questionText: 'TBI Rancho levels errorless learning', correct: false, selectedAnswer: 'B', correctAnswer: 'C', domain: 'evaluation', difficulty: 4 },
        { questionId: 'q35', questionText: 'Upper extremity amputation prosthetic training', correct: false, selectedAnswer: 'D', correctAnswer: 'B', domain: 'intervention', difficulty: 5 },
        { questionId: 'q34', questionText: 'Eating disorders occupational identity', correct: false, selectedAnswer: 'A', correctAnswer: 'D', domain: 'intervention', difficulty: 4 },
      ],
    },
  ],
}

// Get courses for a student (fallback to default)
function getStudentCourses(studentId: string): Course[] {
  return studentCourses[studentId] || [
    { id: 'c1', name: 'Foundations of OT Practice', code: 'OT 501', progress: 100, status: 'completed', instructor: 'Dr. Sarah Mitchell' },
    { id: 'c2', name: 'Clinical Reasoning & Assessment', code: 'OT 502', progress: 50, status: 'active', instructor: 'Dr. James Chen', dueDate: new Date('2025-01-15') },
  ]
}

// Get exam history for a student (fallback to empty)
function getStudentExamHistory(studentId: string): ExamAttempt[] {
  return studentExamHistory[studentId] || []
}

// Domain color mapping
const domainColors: Record<NBCOTDomain, { bg: string; text: string; border: string }> = {
  evaluation: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  intervention: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  management: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  competency: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
}

// Calculate overall readiness score
function calculateReadiness(checkpoints: StudentCheckpoint[], domainScores: Record<NBCOTDomain, number>): number {
  const passedMilestones = checkpoints.filter(cp => cp.status === 'passed').length
  const totalMilestones = 4 // Mock: 4 milestones
  const avgDomainScore = Object.values(domainScores).reduce((a, b) => a + b, 0) / 4

  // Weighted: 40% milestone progress, 60% domain scores
  return Math.round(passedMilestones / totalMilestones * 40 + avgDomainScore * 0.6)
}

// Get readiness status
function getReadinessStatus(score: number, remediation?: RemediationPlan): {
  label: string
  color: string
  bg: string
} {
  if (remediation) {
    const tierLabel = tierColors[remediation.tier].label
    return {
      label: tierLabel,
      color: tierColors[remediation.tier].text,
      bg: tierColors[remediation.tier].bg,
    }
  }
  if (score >= 80) return { label: 'On Track', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
  if (score >= 65) return { label: 'Monitoring', color: 'text-amber-400', bg: 'bg-amber-500/10' }
  return { label: 'Needs Support', color: 'text-red-400', bg: 'bg-red-500/10' }
}

// Visual Timeline Component
function MilestoneTimeline({ checkpoints }: { checkpoints: StudentCheckpoint[] }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10" />

      {/* Milestone nodes */}
      <div className="relative flex justify-between">
        {programMilestones.map((milestone, idx) => {
          const checkpoint = checkpoints.find(cp => cp.milestoneId === milestone.id)
          const status = checkpoint?.status || 'upcoming'

          let nodeStyle = 'bg-white/10 border-white/20'
          let iconElement = <span className="w-2 h-2 rounded-full bg-white/30" />

          if (status === 'passed') {
            nodeStyle = 'bg-emerald-500 border-emerald-400'
            iconElement = <CheckCircle className="w-4 h-4 text-white" />
          } else if (status === 'in-progress') {
            nodeStyle = 'bg-[#d4a574] border-[#d4a574]'
            iconElement = <Play className="w-3 h-3 text-white fill-white" />
          } else if (status === 'failed' || status === 'remediation') {
            nodeStyle = 'bg-red-500 border-red-400'
            iconElement = <AlertTriangle className="w-4 h-4 text-white" />
          }

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              {/* Node */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${nodeStyle}`}
              >
                {iconElement}
              </div>

              {/* Label */}
              <div className="mt-3 text-center">
                <div className="ot-font-display text-sm font-medium">{milestone.shortName}</div>
                {checkpoint?.score !== undefined && (
                  <div className={`ot-font-body text-xs mt-0.5 ${
                    checkpoint.score >= milestone.passingScore ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {checkpoint.score}%
                  </div>
                )}
                {status === 'upcoming' && (
                  <div className="ot-font-body text-[10px] text-gray-500 mt-0.5">
                    Pass: {milestone.passingScore}%
                  </div>
                )}
              </div>

              {/* Attempt count */}
              {checkpoint && checkpoint.attemptCount > 0 && (
                <div className="ot-font-body text-[10px] text-gray-500 mt-1">
                  {checkpoint.attemptCount} attempt{checkpoint.attemptCount > 1 ? 's' : ''}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Domain Competency Card
function DomainCard({
  domain,
  score,
  threshold = 70,
  trend = 'stable',
  isWeak = false,
}: {
  domain: NBCOTDomain
  score: number
  threshold?: number
  trend?: 'up' | 'down' | 'stable'
  isWeak?: boolean
}) {
  const colors = domainColors[domain]
  const isAboveThreshold = score >= threshold

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl border ${colors.border} ${colors.bg}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="ot-font-display text-sm font-medium capitalize">{domain}</div>
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
          {trend === 'stable' && <Activity className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Score with threshold line */}
      <div className="relative mb-2">
        <div className="ot-font-display text-3xl font-semibold">
          <span className={isAboveThreshold ? 'text-emerald-400' : 'text-red-400'}>
            {score}%
          </span>
        </div>
      </div>

      {/* Progress bar with threshold marker */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-visible">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(score, 100)}%` }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-y-0 left-0 rounded-full ${
            isAboveThreshold ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />
        {/* Threshold marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white/50"
          style={{ left: `${threshold}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="ot-font-body text-[10px] text-gray-500">0%</span>
        <span className="ot-font-body text-[10px] text-gray-500">Threshold: {threshold}%</span>
      </div>

      {/* Practice button for weak domains */}
      {isWeak && (
        <Link
          to="/otexam/exam"
          className={`mt-3 w-full py-2 rounded-lg ${colors.bg} border ${colors.border} ot-font-body text-xs ${colors.text} flex items-center justify-center gap-1 hover:bg-white/10 transition-colors`}
        >
          <Play className="w-3 h-3" />
          Practice Now
        </Link>
      )}
    </motion.div>
  )
}

// Active Remediation Panel
function RemediationPanel({ remediation }: { remediation: RemediationPlan }) {
  const colors = tierColors[remediation.tier]
  const daysUntilDue = Math.ceil((new Date(remediation.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysUntilDue < 0
  const progress = (remediation.questionsCompleted / remediation.assignedQuestions.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border ${colors.border} ${colors.bg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
            <Target className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div>
            <h3 className="ot-font-display text-lg">Active Remediation</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
              {colors.label}
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
          <Clock className="w-4 h-4" />
          <span className="ot-font-body text-sm">
            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days remaining`}
          </span>
        </div>
      </div>

      {/* Trigger reason */}
      <div className="mb-4 p-3 bg-white/5 rounded-lg">
        <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-1">Trigger Reason</div>
        <p className="ot-font-body text-sm">{remediation.reason}</p>
      </div>

      {/* Weak domains */}
      <div className="mb-4">
        <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Focus Areas</div>
        <div className="flex flex-wrap gap-2">
          {remediation.weakDomains.map(domain => (
            <span
              key={domain}
              className={`px-2 py-1 rounded text-xs capitalize ${domainColors[domain].bg} ${domainColors[domain].text}`}
            >
              {domain}
            </span>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="ot-font-body text-xs text-gray-500 uppercase tracking-wider">Practice Progress</span>
          <span className="ot-font-body text-sm">
            {remediation.questionsCompleted}/{remediation.assignedQuestions.length} questions
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${colors.text.replace('text-', 'bg-')}`}
          />
        </div>
      </div>

      {/* Advisor notes */}
      {remediation.advisorNotes && (
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="ot-font-body text-xs text-gray-500 uppercase tracking-wider">Advisor Notes</span>
          </div>
          <p className="ot-font-body text-sm text-gray-300">{remediation.advisorNotes}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <Link
          to="/otexam/exam"
          className={`flex-1 py-2 rounded-lg bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] ot-font-body text-sm font-medium flex items-center justify-center gap-2`}
        >
          <Play className="w-4 h-4" />
          Continue Practice
        </Link>
        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 ot-font-body text-sm hover:bg-white/10 transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  )
}

// Enrolled Courses Section
function CoursesSection({ courses }: { courses: Course[] }) {
  const activeCourses = courses.filter(c => c.status === 'active')
  const completedCourses = courses.filter(c => c.status === 'completed')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ot-glass rounded-xl p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="ot-font-display text-lg">Enrolled Courses</h2>
          <p className="ot-font-body text-sm text-gray-500">
            {activeCourses.length} active, {completedCourses.length} completed
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {courses.map((course) => {
          const statusColors = {
            active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
            completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
            upcoming: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' },
          }
          const colors = statusColors[course.status]

          return (
            <div
              key={course.id}
              className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="ot-font-body text-xs text-gray-500">{course.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {course.status}
                    </span>
                  </div>
                  <h4 className="ot-font-display text-sm font-medium mt-1">{course.name}</h4>
                  <p className="ot-font-body text-xs text-gray-500">{course.instructor}</p>
                </div>
                {course.status === 'completed' && (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Award className="w-4 h-4" />
                  </div>
                )}
              </div>

              {course.status !== 'upcoming' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="ot-font-body text-xs text-gray-500">Progress</span>
                    <span className="ot-font-body text-xs">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${course.status === 'completed' ? 'bg-blue-400' : 'bg-emerald-400'}`}
                    />
                  </div>
                  {course.dueDate && course.status === 'active' && (
                    <div className="flex items-center gap-1 mt-2 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span className="ot-font-body text-[10px]">Due: {course.dueDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}

              {course.status === 'upcoming' && (
                <p className="ot-font-body text-xs text-gray-500 mt-2">Starts next semester</p>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// Exam History Section with Question Breakdown
function ExamHistorySection({ examHistory }: { examHistory: ExamAttempt[] }) {
  const [expandedExam, setExpandedExam] = useState<string | null>(null)

  if (examHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ot-glass rounded-xl p-6 text-center"
      >
        <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <h3 className="ot-font-display text-lg mb-2">No Practice Exams Yet</h3>
        <p className="ot-font-body text-gray-400 mb-4">
          This student hasn't taken any practice exams.
        </p>
        <Link
          to="/otexam/exam"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body text-sm font-medium"
        >
          <Play className="w-4 h-4" />
          Start Practice Exam
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ot-glass rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="ot-font-display text-lg">Recent Practice Exams</h2>
          <p className="ot-font-body text-sm text-gray-500">
            {examHistory.length} exam{examHistory.length > 1 ? 's' : ''} taken
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {examHistory.map((exam) => {
          const isExpanded = expandedExam === exam.id
          const incorrectQuestions = exam.questionResults.filter(q => !q.correct)
          const scoreColor = exam.score >= 80 ? 'text-emerald-400' : exam.score >= 70 ? 'text-amber-400' : 'text-red-400'

          return (
            <div key={exam.id} className="border border-white/10 rounded-lg overflow-hidden">
              {/* Exam Header */}
              <div
                onClick={() => setExpandedExam(isExpanded ? null : exam.id)}
                className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="ot-font-display text-sm font-medium">{exam.examName}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${scoreColor} bg-white/5`}>
                        {exam.score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="ot-font-body text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exam.date.toLocaleDateString()}
                      </span>
                      <span className="ot-font-body text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exam.timeSpent} min
                      </span>
                      <span className="ot-font-body text-xs">
                        {exam.correctAnswers}/{exam.totalQuestions} correct
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {incorrectQuestions.length > 0 && (
                      <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs ot-font-body">
                        {incorrectQuestions.length} missed
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content - Question Breakdown */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-4">
                      {/* Incorrect Questions */}
                      {incorrectQuestions.length > 0 && (
                        <div className="mb-4">
                          <div className="ot-font-body text-xs text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <XCircle className="w-3 h-3" />
                            Questions Missed ({incorrectQuestions.length})
                          </div>
                          <div className="space-y-2">
                            {incorrectQuestions.map((q) => (
                              <div
                                key={q.questionId}
                                className="p-3 rounded-lg bg-red-500/5 border border-red-500/20"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="ot-font-body text-sm text-gray-200">{q.questionText}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className={`px-2 py-0.5 rounded text-[10px] capitalize ${domainColors[q.domain].bg} ${domainColors[q.domain].text}`}>
                                        {q.domain}
                                      </span>
                                      <span className="ot-font-body text-xs text-gray-500">
                                        Difficulty: {q.difficulty}/5
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="ot-font-body text-xs text-red-400">
                                      Selected: {q.selectedAnswer}
                                    </div>
                                    <div className="ot-font-body text-xs text-emerald-400">
                                      Correct: {q.correctAnswer}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Correct Questions Summary */}
                      {exam.questionResults.filter(q => q.correct).length > 0 && (
                        <div>
                          <div className="ot-font-body text-xs text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            Questions Correct ({exam.questionResults.filter(q => q.correct).length})
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {exam.questionResults.filter(q => q.correct).map((q) => (
                              <div
                                key={q.questionId}
                                className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
                              >
                                <p className="ot-font-body text-xs text-gray-300 line-clamp-1">{q.questionText}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] capitalize ${domainColors[q.domain].bg} ${domainColors[q.domain].text}`}>
                                    {q.domain}
                                  </span>
                                  <span className="ot-font-body text-[10px] text-emerald-400">
                                    Answer: {q.correctAnswer}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action to review */}
                      <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                        <Link
                          to="/otexam/exam"
                          className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 ot-font-body text-sm text-center hover:bg-white/10 transition-colors"
                        >
                          Retake Similar Exam
                        </Link>
                        <Link
                          to="/otexam/questions"
                          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] ot-font-body text-sm font-medium text-center"
                        >
                          Review Questions
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function StudentPathway() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const sidebarMargin = useSidebarWidth()

  // Get student data - memoize to prevent recalculation on every render
  const student = studentId ? studentsData[studentId] : null

  const checkpoints = useMemo(
    () => studentId ? getStudentCheckpoints(studentId) : [],
    [studentId]
  )

  const domainScores = useMemo(
    () => studentId ? getDomainScores(studentId) : { evaluation: 0, intervention: 0, management: 0, competency: 0 },
    [studentId]
  )

  const remediation = useMemo(
    () => studentId ? getStudentRemediation(studentId) : undefined,
    [studentId]
  )

  const courses = useMemo(
    () => studentId ? getStudentCourses(studentId) : [],
    [studentId]
  )

  const examHistory = useMemo(
    () => studentId ? getStudentExamHistory(studentId) : [],
    [studentId]
  )

  // Calculate readiness
  const readinessScore = useMemo(
    () => calculateReadiness(checkpoints, domainScores),
    [checkpoints, domainScores]
  )
  const readinessStatus = getReadinessStatus(readinessScore, remediation)

  // Identify weak domains (below 70%)
  const weakDomains = useMemo(
    () => Object.entries(domainScores)
      .filter(([_, score]) => score < 70)
      .map(([domain]) => domain as NBCOTDomain),
    [domainScores]
  )

  // Mock trend data - in real app, calculate from historical data
  const domainTrends: Record<NBCOTDomain, 'up' | 'down' | 'stable'> = {
    evaluation: 'up',
    intervention: 'stable',
    management: 'down',
    competency: 'up',
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="ot-font-display text-xl mb-2">Student Not Found</h2>
          <p className="ot-font-body text-gray-400 mb-4">The requested student profile could not be found.</p>
          <button
            onClick={() => navigate('/otexam/students')}
            className="px-4 py-2 bg-[#d4a574] text-[#0a0f1a] rounded-lg ot-font-body"
          >
            Back to Students
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
        .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      <Sidebar activePage="students" />

      {/* Main content */}
      <main className={`${sidebarMargin} transition-all duration-300`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 ot-glass border-b border-white/5">
          <div className="pl-16 lg:pl-6 pr-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/otexam/students')}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <span className="ot-font-body text-sm text-gray-400">
                  Student Pathway
                </span>
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
          {/* Student Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ot-glass rounded-xl p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xl font-medium">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h1 className="ot-font-display text-2xl">{student.name}</h1>
                  <p className="ot-font-body text-gray-400">{student.email}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="ot-font-body text-sm text-gray-500">{student.cohort}</span>
                    <span className="text-gray-600">•</span>
                    <span className="ot-font-body text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Enrolled {student.enrollmentDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Readiness Score */}
                <div className="text-right">
                  <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Readiness Score
                  </div>
                  <div className="ot-font-display text-3xl font-semibold">
                    <span className={readinessScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                      {readinessScore}
                    </span>
                    <span className="text-gray-500 text-lg">/100</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`px-4 py-2 rounded-lg ${readinessStatus.bg} border ${
                  remediation ? tierColors[remediation.tier].border : 'border-transparent'
                }`}>
                  <span className={`ot-font-body text-sm font-medium ${readinessStatus.color}`}>
                    {readinessStatus.label}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Milestone Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ot-glass rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#d4a574]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#d4a574]" />
              </div>
              <div>
                <h2 className="ot-font-display text-lg">Progress Timeline</h2>
                <p className="ot-font-body text-sm text-gray-500">Journey through NBCOT preparation milestones</p>
              </div>
            </div>

            <MilestoneTimeline checkpoints={checkpoints} />
          </motion.div>

          {/* Domain Competency Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="ot-font-display text-lg">Domain Competency</h2>
                  <p className="ot-font-body text-sm text-gray-500">Performance across NBCOT domains</p>
                </div>
              </div>
              {weakDomains.length > 0 && (
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="ot-font-body text-sm">{weakDomains.length} domain{weakDomains.length > 1 ? 's' : ''} below threshold</span>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(domainColors) as NBCOTDomain[]).map((domain) => (
                <DomainCard
                  key={domain}
                  domain={domain}
                  score={domainScores[domain]}
                  trend={domainTrends[domain]}
                  isWeak={weakDomains.includes(domain)}
                />
              ))}
            </div>
          </motion.div>

          {/* Active Remediation Panel */}
          {remediation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RemediationPanel remediation={remediation} />
            </motion.div>
          )}

          {/* No remediation - show encouragement */}
          {!remediation && readinessScore >= 70 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="ot-glass rounded-xl p-6 text-center mb-6"
            >
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="ot-font-display text-lg mb-2">Great Progress!</h3>
              <p className="ot-font-body text-gray-400 mb-4">
                {student.name.split(' ')[0]} is performing well and on track for NBCOT success.
              </p>
              <Link
                to="/otexam/exam"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                Continue Practice
              </Link>
            </motion.div>
          )}

          {/* Two Column Layout for Courses and Exam History */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Enrolled Courses */}
            <CoursesSection courses={courses} />

            {/* Recent Practice Exams */}
            <ExamHistorySection examHistory={examHistory} />
          </div>
        </div>
      </main>
    </div>
  )
}
