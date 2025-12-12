// Bloom's Taxonomy Levels
export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create'

// NBCOT Domain Areas
export type NBCOTDomain =
  | 'evaluation'
  | 'intervention'
  | 'management'
  | 'competency'

// OT Practice Settings
export type OTSetting =
  | 'pediatrics'
  | 'geriatrics'
  | 'physical-disabilities'
  | 'mental-health'
  | 'wellness'
  | 'hand-therapy'

// Question structure
export interface ExamQuestion {
  id: string
  scenario: string
  question: string
  options: {
    id: string
    text: string
    isCorrect: boolean
    rationale: string
  }[]
  bloomLevel: BloomLevel
  nbcotDomains: NBCOTDomain[]
  otSettings: OTSetting[]
  difficulty: 1 | 2 | 3 | 4 | 5
  concepts: string[] // OT concepts being tested
  clinicalReasoning: string // Explanation of the clinical reasoning required
}

// Student answer
export interface StudentAnswer {
  questionId: string
  selectedOptionId: string | null
  timeSpent: number // seconds
  flagged: boolean
  timestamp: Date
}

// Exam session
export interface ExamSession {
  id: string
  studentId: string
  startTime: Date
  endTime?: Date
  answers: StudentAnswer[]
  status: 'in-progress' | 'completed' | 'abandoned'
}

// Performance analytics
export interface PerformanceAnalytics {
  totalQuestions: number
  correctAnswers: number
  percentageScore: number
  timeSpent: number
  byBloomLevel: Record<BloomLevel, { correct: number; total: number }>
  byDomain: Record<NBCOTDomain, { correct: number; total: number }>
  bySetting: Record<OTSetting, { correct: number; total: number }>
  byDifficulty: Record<number, { correct: number; total: number }>
  nbcotPassPrediction: {
    likelihood: 'high' | 'moderate' | 'low'
    confidence: number
    recommendations: string[]
  }
}

// Student profile
export interface Student {
  id: string
  name: string
  email: string
  cohort: string
  enrollmentDate: Date
  examSessions: ExamSession[]
  overallAnalytics?: PerformanceAnalytics
}

// Program milestones that cohorts progress through
export interface ProgramMilestone {
  id: string
  name: string                    // "Mock Exam 1", "Comprehensive Review"
  shortName: string               // "Mock 1", "Comp"
  order: number                   // Sequence position
  passingScore: number            // 70, 75, etc.
  domainThresholds?: Partial<Record<NBCOTDomain, number>>
  description: string
}

// Student's progress through milestones
export type CheckpointStatus = 'upcoming' | 'in-progress' | 'passed' | 'failed' | 'remediation'

export interface StudentCheckpoint {
  studentId: string
  milestoneId: string
  status: CheckpointStatus
  score?: number
  attemptCount: number
  completedAt?: Date
  remediationTier?: 1 | 2 | 3
}

// Remediation tier levels
export type RemediationTier = 1 | 2 | 3

// Remediation assignment
export interface RemediationPlan {
  id: string
  studentId: string
  tier: RemediationTier
  reason: string                  // "Intervention domain < 70%"
  weakDomains: NBCOTDomain[]
  assignedQuestions: string[]     // Question IDs
  questionsCompleted: number
  createdAt: Date
  dueDate: Date
  escalatedAt?: Date
  completedAt?: Date
  advisorNotes?: string
}

// Cohort with milestone tracking
export interface Cohort {
  id: string
  name: string                    // "Fall 2024"
  startDate: Date
  expectedEndDate: Date
  currentMilestoneId: string
  studentIds: string[]
}

// Alert notification for advisors
export type AlertType = 'tier-change' | 'milestone-failed' | 'remediation-complete' | 'deadline-approaching'

export interface AdvisorAlert {
  id: string
  type: AlertType
  studentId: string
  studentName: string
  message: string
  createdAt: Date
  read: boolean
}
