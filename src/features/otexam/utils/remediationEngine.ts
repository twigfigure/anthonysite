/**
 * Remediation Engine for OTexam
 *
 * Automated system for generating and managing student remediation plans
 * based on exam performance and NBCOT domain scores.
 *
 * Tier System:
 * - Tier 1: Automated practice assignment (7-day window)
 * - Tier 2: Advisor-assisted intervention (after Tier 1 timeout or failed exam)
 * - Tier 3: Formal documentation (after repeated failures)
 */

import type {
  NBCOTDomain,
  RemediationTier,
  RemediationPlan,
  StudentCheckpoint,
  AdvisorAlert,
  AlertType,
  ExamQuestion,
} from '../types'

// Configuration constants
export const REMEDIATION_CONFIG = {
  // Domain threshold for triggering Tier 1
  DOMAIN_THRESHOLD: 70,

  // Days before Tier 1 auto-escalates to Tier 2
  TIER_1_DEADLINE_DAYS: 7,

  // Number of practice questions per weak domain
  QUESTIONS_PER_DOMAIN: {
    1: 4,  // Tier 1: 4 questions per domain
    2: 6,  // Tier 2: 6 questions per domain
    3: 10, // Tier 3: 10 questions per domain
  },

  // Minimum questions for remediation
  MIN_QUESTIONS: 4,

  // Maximum questions for remediation
  MAX_QUESTIONS: 25,
}

// Trigger evaluation result
export interface TriggerEvaluationResult {
  shouldTrigger: boolean
  tier: RemediationTier
  reason: string
  weakDomains: NBCOTDomain[]
}

// Remediation plan creation result
export interface RemediationPlanResult {
  plan: Partial<RemediationPlan>
  alerts: Partial<AdvisorAlert>[]
}

/**
 * Evaluate whether a student should be placed on remediation
 * based on their exam performance.
 */
export function evaluateRemediationTrigger(
  studentId: string,
  examScore: number,
  domainScores: Record<NBCOTDomain, number>,
  milestonePassingScore: number,
  existingCheckpoints: StudentCheckpoint[],
  existingRemediation?: RemediationPlan
): TriggerEvaluationResult {
  // Find weak domains (below threshold)
  const weakDomains = (Object.entries(domainScores) as [NBCOTDomain, number][])
    .filter(([_, score]) => score < REMEDIATION_CONFIG.DOMAIN_THRESHOLD)
    .map(([domain]) => domain)

  // Check for failed milestone
  const failedMilestone = examScore < milestonePassingScore

  // Count previous failures at current milestone
  const currentMilestoneCheckpoint = existingCheckpoints[existingCheckpoints.length - 1]
  const failureCount = currentMilestoneCheckpoint?.attemptCount || 0

  // Determine tier based on conditions
  let tier: RemediationTier = 1
  let reason = ''

  if (failureCount >= 2 || (existingRemediation && existingRemediation.tier === 2)) {
    // Failed milestone twice OR escalated from Tier 2
    tier = 3
    reason = failureCount >= 2
      ? `Failed milestone exam ${failureCount} times - formal remediation required`
      : 'Escalated from Tier 2 due to insufficient progress'
  } else if (failedMilestone || (existingRemediation && existingRemediation.tier === 1)) {
    // Failed milestone OR escalated from Tier 1
    tier = 2
    reason = failedMilestone
      ? `Failed exam with score ${examScore}% (required ${milestonePassingScore}%)`
      : 'Escalated from Tier 1 due to deadline expiration'
  } else if (weakDomains.length > 0) {
    // Domain below threshold
    tier = 1
    reason = `${weakDomains.length} domain${weakDomains.length > 1 ? 's' : ''} below ${REMEDIATION_CONFIG.DOMAIN_THRESHOLD}% threshold: ${weakDomains.join(', ')}`
  }

  const shouldTrigger = weakDomains.length > 0 || failedMilestone

  return {
    shouldTrigger,
    tier,
    reason,
    weakDomains,
  }
}

/**
 * Check if existing Tier 1 remediation should be escalated to Tier 2
 */
export function checkTierEscalation(remediation: RemediationPlan): {
  shouldEscalate: boolean
  newTier: RemediationTier
  reason: string
} {
  if (remediation.completedAt) {
    return { shouldEscalate: false, newTier: remediation.tier, reason: '' }
  }

  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(remediation.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  // Check deadline expiration for Tier 1
  if (remediation.tier === 1 && daysSinceCreation >= REMEDIATION_CONFIG.TIER_1_DEADLINE_DAYS) {
    return {
      shouldEscalate: true,
      newTier: 2,
      reason: `Tier 1 remediation not completed within ${REMEDIATION_CONFIG.TIER_1_DEADLINE_DAYS} days`,
    }
  }

  // Check progress stagnation for Tier 2 (14 days with < 50% progress)
  if (remediation.tier === 2 && daysSinceCreation >= 14) {
    const progress = remediation.questionsCompleted / remediation.assignedQuestions.length
    if (progress < 0.5) {
      return {
        shouldEscalate: true,
        newTier: 3,
        reason: 'Insufficient progress in Tier 2 remediation after 14 days',
      }
    }
  }

  return { shouldEscalate: false, newTier: remediation.tier, reason: '' }
}

/**
 * Generate a practice question set for remediation
 */
export function generatePracticeSet(
  weakDomains: NBCOTDomain[],
  tier: RemediationTier,
  questionBank: ExamQuestion[]
): string[] {
  const questionsPerDomain = REMEDIATION_CONFIG.QUESTIONS_PER_DOMAIN[tier]
  const selectedQuestions: string[] = []

  for (const domain of weakDomains) {
    // Filter questions for this domain
    const domainQuestions = questionBank.filter(
      q => q.nbcotDomains.includes(domain)
    )

    // Sort by difficulty (prefer medium difficulty for remediation)
    const sorted = [...domainQuestions].sort((a, b) => {
      // Prefer difficulty 2-3 for Tier 1, 3-4 for Tier 2/3
      const idealDifficulty = tier === 1 ? 2.5 : 3.5
      return Math.abs(a.difficulty - idealDifficulty) - Math.abs(b.difficulty - idealDifficulty)
    })

    // Select questions
    const selected = sorted
      .slice(0, questionsPerDomain)
      .map(q => q.id)

    selectedQuestions.push(...selected)
  }

  // Ensure we don't exceed max questions
  return selectedQuestions.slice(0, REMEDIATION_CONFIG.MAX_QUESTIONS)
}

/**
 * Create a remediation plan based on trigger evaluation
 */
export function createRemediationPlan(
  studentId: string,
  studentName: string,
  trigger: TriggerEvaluationResult,
  questionBank: ExamQuestion[]
): RemediationPlanResult {
  const assignedQuestions = generatePracticeSet(
    trigger.weakDomains,
    trigger.tier,
    questionBank
  )

  const plan: Partial<RemediationPlan> = {
    id: `r${Date.now()}`,
    studentId,
    tier: trigger.tier,
    reason: trigger.reason,
    weakDomains: trigger.weakDomains,
    assignedQuestions,
    questionsCompleted: 0,
    createdAt: new Date(),
    dueDate: new Date(Date.now() + REMEDIATION_CONFIG.TIER_1_DEADLINE_DAYS * 24 * 60 * 60 * 1000),
  }

  // Generate alerts
  const alerts: Partial<AdvisorAlert>[] = []

  if (trigger.tier >= 2) {
    // Advisor alert for Tier 2+
    alerts.push({
      id: `a${Date.now()}`,
      type: 'tier-change' as AlertType,
      studentId,
      studentName,
      message: `${studentName} moved to Tier ${trigger.tier} remediation: ${trigger.reason}`,
      createdAt: new Date(),
      read: false,
    })
  }

  return { plan, alerts }
}

/**
 * Generate advisor talking points for Tier 2 meetings
 */
export function generateAdvisorTalkingPoints(
  studentName: string,
  remediation: RemediationPlan,
  domainScores: Record<NBCOTDomain, number>
): string[] {
  const points: string[] = []

  // Opening
  points.push(`Check in with ${studentName.split(' ')[0]} about their experience with the practice questions.`)

  // Domain-specific points
  for (const domain of remediation.weakDomains) {
    const score = domainScores[domain]
    if (score < 60) {
      points.push(`${domain.charAt(0).toUpperCase() + domain.slice(1)} score is ${score}% - review foundational concepts.`)
    } else {
      points.push(`${domain.charAt(0).toUpperCase() + domain.slice(1)} score is ${score}% - close to threshold, focus on practice.`)
    }
  }

  // Progress check
  const progress = remediation.questionsCompleted / remediation.assignedQuestions.length
  if (progress < 0.5) {
    points.push('Discuss barriers to completing practice questions.')
  } else {
    points.push('Acknowledge progress and identify remaining challenges.')
  }

  // Test anxiety check
  points.push('Ask about test-taking strategies and anxiety management.')

  // Next steps
  if (remediation.tier === 2) {
    points.push('Set specific goals for the next week with check-in date.')
  } else {
    points.push('Document formal remediation plan and obtain student signature.')
  }

  return points
}

/**
 * Generate formal documentation template for Tier 3
 */
export function generateTier3Documentation(
  studentName: string,
  remediation: RemediationPlan,
  previousAttempts: StudentCheckpoint[]
): {
  title: string
  sections: { heading: string; content: string }[]
} {
  return {
    title: `Formal Remediation Plan - ${studentName}`,
    sections: [
      {
        heading: 'Student Information',
        content: `Student: ${studentName}\nPlan Created: ${new Date().toLocaleDateString()}\nStatus: Tier 3 Formal Remediation`,
      },
      {
        heading: 'Remediation History',
        content: `Previous attempts: ${previousAttempts.length}\n${previousAttempts
          .map(cp => `- ${cp.milestoneId}: ${cp.score}% (${cp.attemptCount} attempts)`)
          .join('\n')}`,
      },
      {
        heading: 'Current Concerns',
        content: remediation.reason,
      },
      {
        heading: 'Focus Areas',
        content: remediation.weakDomains
          .map(d => `- ${d.charAt(0).toUpperCase() + d.slice(1)}`)
          .join('\n'),
      },
      {
        heading: 'Required Actions',
        content: `1. Complete all ${remediation.assignedQuestions.length} assigned practice questions\n2. Weekly advisor check-ins\n3. Score 70%+ on all weak domains before reattempt`,
      },
      {
        heading: 'Timeline',
        content: `Due Date: ${new Date(remediation.dueDate).toLocaleDateString()}\nWeekly check-ins required`,
      },
      {
        heading: 'Signatures',
        content: 'Student: ___________________ Date: ___________\nAdvisor: ___________________ Date: ___________\nProgram Director: ___________________ Date: ___________',
      },
    ],
  }
}

/**
 * Check if student can reattempt milestone after remediation
 */
export function canReattemptMilestone(remediation: RemediationPlan): {
  canReattempt: boolean
  reason: string
} {
  // Must complete all assigned questions
  if (remediation.questionsCompleted < remediation.assignedQuestions.length) {
    const remaining = remediation.assignedQuestions.length - remediation.questionsCompleted
    return {
      canReattempt: false,
      reason: `${remaining} practice question${remaining > 1 ? 's' : ''} remaining`,
    }
  }

  // Tier 2+ requires advisor sign-off
  if (remediation.tier >= 2 && !remediation.advisorNotes?.includes('approved for reattempt')) {
    return {
      canReattempt: false,
      reason: 'Awaiting advisor approval for reattempt',
    }
  }

  return {
    canReattempt: true,
    reason: 'Ready for milestone reattempt',
  }
}

/**
 * Calculate remediation progress percentage
 */
export function calculateRemediationProgress(remediation: RemediationPlan): number {
  if (remediation.assignedQuestions.length === 0) return 0
  return Math.round((remediation.questionsCompleted / remediation.assignedQuestions.length) * 100)
}

/**
 * Get recommended next action for a student on remediation
 */
export function getRecommendedAction(
  remediation: RemediationPlan,
  daysSinceCreation: number
): {
  action: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
} {
  const progress = calculateRemediationProgress(remediation)
  const daysRemaining = REMEDIATION_CONFIG.TIER_1_DEADLINE_DAYS - daysSinceCreation

  if (progress === 100) {
    return {
      action: remediation.tier >= 2 ? 'Schedule advisor review meeting' : 'Ready for milestone reattempt',
      urgency: 'low',
    }
  }

  if (daysRemaining <= 0) {
    return {
      action: 'Deadline passed - escalation required',
      urgency: 'critical',
    }
  }

  if (daysRemaining <= 2) {
    return {
      action: `${100 - progress}% remaining - deadline in ${daysRemaining} days`,
      urgency: 'high',
    }
  }

  if (progress < 50 && daysRemaining <= 4) {
    return {
      action: 'Less than half complete with deadline approaching',
      urgency: 'medium',
    }
  }

  return {
    action: 'Continue practice questions',
    urgency: 'low',
  }
}
