import type {
  ProgramMilestone,
  StudentCheckpoint,
  RemediationPlan,
  Cohort,
  AdvisorAlert,
  NBCOTDomain,
} from '../types'

// Program milestones
export const programMilestones: ProgramMilestone[] = [
  {
    id: 'm1',
    name: 'Mock Exam 1',
    shortName: 'Mock 1',
    order: 1,
    passingScore: 65,
    description: 'Initial assessment of NBCOT readiness',
  },
  {
    id: 'm2',
    name: 'Mock Exam 2',
    shortName: 'Mock 2',
    order: 2,
    passingScore: 70,
    description: 'Mid-program checkpoint with increased difficulty',
  },
  {
    id: 'm3',
    name: 'Comprehensive Review',
    shortName: 'Comp',
    order: 3,
    passingScore: 75,
    domainThresholds: {
      evaluation: 70,
      intervention: 70,
      management: 70,
      competency: 70,
    },
    description: 'Full-length exam covering all domains',
  },
  {
    id: 'm4',
    name: 'NBCOT Ready',
    shortName: 'Ready',
    order: 4,
    passingScore: 80,
    domainThresholds: {
      evaluation: 75,
      intervention: 75,
      management: 75,
      competency: 75,
    },
    description: 'Final certification of exam readiness',
  },
]

// Cohorts
export const cohorts: Cohort[] = [
  {
    id: 'c1',
    name: 'Fall 2024',
    startDate: new Date('2024-08-15'),
    expectedEndDate: new Date('2025-05-15'),
    currentMilestoneId: 'm1',
    studentIds: ['s1', 's2', 's3', 's4', 's5', 's6'],
  },
  {
    id: 'c2',
    name: 'Spring 2024',
    startDate: new Date('2024-01-10'),
    expectedEndDate: new Date('2024-12-15'),
    currentMilestoneId: 'm2',
    studentIds: ['s7', 's8'],
  },
  {
    id: 'c3',
    name: 'Fall 2023',
    startDate: new Date('2023-08-15'),
    expectedEndDate: new Date('2024-05-15'),
    currentMilestoneId: 'm3',
    studentIds: ['s9', 's10', 's11'],
  },
]

// Student checkpoints - tracks each student's progress through milestones
export const studentCheckpoints: StudentCheckpoint[] = [
  // Fall 2024 - currently at Mock 1
  { studentId: 's1', milestoneId: 'm1', status: 'passed', score: 78, attemptCount: 1, completedAt: new Date('2024-10-15') },
  { studentId: 's1', milestoneId: 'm2', status: 'upcoming', attemptCount: 0 },
  { studentId: 's2', milestoneId: 'm1', status: 'passed', score: 82, attemptCount: 1, completedAt: new Date('2024-10-14') },
  { studentId: 's2', milestoneId: 'm2', status: 'upcoming', attemptCount: 0 },
  { studentId: 's3', milestoneId: 'm1', status: 'passed', score: 71, attemptCount: 2, completedAt: new Date('2024-10-20') },
  { studentId: 's3', milestoneId: 'm2', status: 'upcoming', attemptCount: 0 },
  { studentId: 's4', milestoneId: 'm1', status: 'failed', score: 52, attemptCount: 1, remediationTier: 2 },
  { studentId: 's5', milestoneId: 'm1', status: 'remediation', score: 58, attemptCount: 1, remediationTier: 1 },
  { studentId: 's6', milestoneId: 'm1', status: 'in-progress', attemptCount: 0 },

  // Spring 2024 - at Mock 2
  { studentId: 's7', milestoneId: 'm1', status: 'passed', score: 75, attemptCount: 1, completedAt: new Date('2024-04-10') },
  { studentId: 's7', milestoneId: 'm2', status: 'passed', score: 72, attemptCount: 1, completedAt: new Date('2024-07-15') },
  { studentId: 's7', milestoneId: 'm3', status: 'in-progress', attemptCount: 0 },
  { studentId: 's8', milestoneId: 'm1', status: 'passed', score: 68, attemptCount: 2, completedAt: new Date('2024-05-01') },
  { studentId: 's8', milestoneId: 'm2', status: 'failed', score: 48, attemptCount: 2, remediationTier: 3 },

  // Fall 2023 - at Comprehensive
  { studentId: 's9', milestoneId: 'm1', status: 'passed', score: 85, attemptCount: 1, completedAt: new Date('2023-11-10') },
  { studentId: 's9', milestoneId: 'm2', status: 'passed', score: 82, attemptCount: 1, completedAt: new Date('2024-02-15') },
  { studentId: 's9', milestoneId: 'm3', status: 'passed', score: 79, attemptCount: 1, completedAt: new Date('2024-05-20') },
  { studentId: 's9', milestoneId: 'm4', status: 'in-progress', attemptCount: 0 },
  { studentId: 's10', milestoneId: 'm1', status: 'passed', score: 76, attemptCount: 1, completedAt: new Date('2023-11-12') },
  { studentId: 's10', milestoneId: 'm2', status: 'passed', score: 74, attemptCount: 1, completedAt: new Date('2024-02-18') },
  { studentId: 's10', milestoneId: 'm3', status: 'passed', score: 77, attemptCount: 2, completedAt: new Date('2024-06-01') },
  { studentId: 's10', milestoneId: 'm4', status: 'upcoming', attemptCount: 0 },
  { studentId: 's11', milestoneId: 'm1', status: 'passed', score: 72, attemptCount: 1, completedAt: new Date('2023-11-15') },
  { studentId: 's11', milestoneId: 'm2', status: 'passed', score: 70, attemptCount: 2, completedAt: new Date('2024-03-10') },
  { studentId: 's11', milestoneId: 'm3', status: 'remediation', score: 68, attemptCount: 1, remediationTier: 1 },
]

// Active remediation plans
export const remediationPlans: RemediationPlan[] = [
  {
    id: 'r1',
    studentId: 's4',
    tier: 2,
    reason: 'Failed Mock Exam 1 with score 52%',
    weakDomains: ['intervention', 'management'],
    assignedQuestions: ['q3', 'q4', 'q7', 'q8', 'q9', 'q12', 'q13'],
    questionsCompleted: 3,
    createdAt: new Date('2024-10-18'),
    dueDate: new Date('2024-11-01'),
    advisorNotes: 'Scheduled meeting for 10/25. Student reports test anxiety.',
  },
  {
    id: 'r2',
    studentId: 's5',
    tier: 1,
    reason: 'Intervention domain below 70% threshold',
    weakDomains: ['intervention'],
    assignedQuestions: ['q3', 'q7', 'q12', 'q13'],
    questionsCompleted: 2,
    createdAt: new Date('2024-10-20'),
    dueDate: new Date('2024-10-27'),
  },
  {
    id: 'r3',
    studentId: 's8',
    tier: 3,
    reason: 'Failed Mock Exam 2 twice',
    weakDomains: ['evaluation', 'intervention', 'management'],
    assignedQuestions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'],
    questionsCompleted: 6,
    createdAt: new Date('2024-08-15'),
    dueDate: new Date('2024-09-15'),
    escalatedAt: new Date('2024-08-01'),
    advisorNotes: 'Formal remediation plan documented. Weekly check-ins scheduled.',
  },
  {
    id: 'r4',
    studentId: 's11',
    tier: 1,
    reason: 'Comprehensive Review score 68% - below 75% threshold',
    weakDomains: ['management'],
    assignedQuestions: ['q9', 'q13'],
    questionsCompleted: 0,
    createdAt: new Date('2024-10-22'),
    dueDate: new Date('2024-10-29'),
  },
]

// Advisor alerts
export const advisorAlerts: AdvisorAlert[] = [
  {
    id: 'a1',
    type: 'tier-change',
    studentId: 's4',
    studentName: 'Jordan Williams',
    message: 'Moved to Tier 2 remediation after failing Mock Exam 1',
    createdAt: new Date('2024-10-18'),
    read: false,
  },
  {
    id: 'a2',
    type: 'remediation-complete',
    studentId: 's3',
    studentName: 'Taylor Martinez',
    message: 'Completed Tier 1 remediation - ready for Mock Exam 1 reattempt',
    createdAt: new Date('2024-10-19'),
    read: true,
  },
  {
    id: 'a3',
    type: 'deadline-approaching',
    studentId: 's5',
    studentName: 'Casey Johnson',
    message: 'Tier 1 remediation due in 3 days - 2/4 questions completed',
    createdAt: new Date('2024-10-24'),
    read: false,
  },
  {
    id: 'a4',
    type: 'milestone-failed',
    studentId: 's8',
    studentName: 'Morgan Lee',
    message: 'Failed Mock Exam 2 for the second time - escalated to Tier 3',
    createdAt: new Date('2024-08-15'),
    read: true,
  },
  {
    id: 'a5',
    type: 'tier-change',
    studentId: 's11',
    studentName: 'Sam Wilson',
    message: 'Entered Tier 1 remediation for Management domain',
    createdAt: new Date('2024-10-22'),
    read: false,
  },
]

// Helper functions

export function getMilestoneById(id: string): ProgramMilestone | undefined {
  return programMilestones.find(m => m.id === id)
}

export function getCohortById(id: string): Cohort | undefined {
  return cohorts.find(c => c.id === id)
}

export function getStudentCheckpoints(studentId: string): StudentCheckpoint[] {
  return studentCheckpoints.filter(cp => cp.studentId === studentId)
}

export function getStudentRemediation(studentId: string): RemediationPlan | undefined {
  return remediationPlans.find(r => r.studentId === studentId && !r.completedAt)
}

export function getCohortMilestoneProgress(cohortId: string, milestoneId: string): {
  passed: number
  failed: number
  inProgress: number
  remediation: number
  total: number
  passRate: number
} {
  const cohort = getCohortById(cohortId)
  if (!cohort) return { passed: 0, failed: 0, inProgress: 0, remediation: 0, total: 0, passRate: 0 }

  const checkpoints = studentCheckpoints.filter(
    cp => cohort.studentIds.includes(cp.studentId) && cp.milestoneId === milestoneId
  )

  const passed = checkpoints.filter(cp => cp.status === 'passed').length
  const failed = checkpoints.filter(cp => cp.status === 'failed').length
  const inProgress = checkpoints.filter(cp => cp.status === 'in-progress' || cp.status === 'upcoming').length
  const remediation = checkpoints.filter(cp => cp.status === 'remediation').length
  const total = cohort.studentIds.length

  return {
    passed,
    failed,
    inProgress,
    remediation,
    total,
    passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
  }
}

export function getRemediationQueue(): Array<RemediationPlan & { studentName: string; cohort: string }> {
  // Mock student names mapping
  const studentNames: Record<string, { name: string; cohort: string }> = {
    's1': { name: 'Alex Chen', cohort: 'Fall 2024' },
    's2': { name: 'Jamie Rivera', cohort: 'Fall 2024' },
    's3': { name: 'Taylor Martinez', cohort: 'Fall 2024' },
    's4': { name: 'Jordan Williams', cohort: 'Fall 2024' },
    's5': { name: 'Casey Johnson', cohort: 'Fall 2024' },
    's6': { name: 'Riley Kim', cohort: 'Fall 2024' },
    's7': { name: 'Morgan Lee', cohort: 'Spring 2024' },
    's8': { name: 'Sam Wilson', cohort: 'Spring 2024' },
    's9': { name: 'Taylor Kim', cohort: 'Fall 2023' },
    's10': { name: 'Jordan Park', cohort: 'Fall 2023' },
    's11': { name: 'Alex Rivera', cohort: 'Fall 2023' },
  }

  return remediationPlans
    .filter(r => !r.completedAt)
    .map(r => ({
      ...r,
      studentName: studentNames[r.studentId]?.name || 'Unknown',
      cohort: studentNames[r.studentId]?.cohort || 'Unknown',
    }))
    .sort((a, b) => b.tier - a.tier) // Sort by tier descending (Tier 3 first)
}

export function getDomainScores(studentId: string): Record<NBCOTDomain, number> {
  // Mock domain scores - in real app, calculate from exam sessions
  const mockScores: Record<string, Record<NBCOTDomain, number>> = {
    's1': { evaluation: 82, intervention: 75, management: 78, competency: 80 },
    's2': { evaluation: 85, intervention: 80, management: 82, competency: 84 },
    's3': { evaluation: 72, intervention: 68, management: 74, competency: 70 },
    's4': { evaluation: 55, intervention: 48, management: 52, competency: 58 },
    's5': { evaluation: 70, intervention: 58, management: 72, competency: 68 },
    's6': { evaluation: 65, intervention: 62, management: 68, competency: 64 },
    's7': { evaluation: 76, intervention: 72, management: 74, competency: 78 },
    's8': { evaluation: 52, intervention: 45, management: 48, competency: 55 },
    's9': { evaluation: 88, intervention: 85, management: 82, competency: 86 },
    's10': { evaluation: 78, intervention: 76, management: 74, competency: 80 },
    's11': { evaluation: 75, intervention: 72, management: 65, competency: 74 },
  }
  return mockScores[studentId] || { evaluation: 0, intervention: 0, management: 0, competency: 0 }
}
