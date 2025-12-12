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
