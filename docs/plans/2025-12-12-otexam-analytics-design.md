# OTexam Analytics Enhancement Design

## Overview

Enhance OTexam with program-level analytics, advising tools, and automated remediation to maximize NBCOT pass rates.

## Primary Users

1. **Program Director / Faculty** — Bird's-eye view of curriculum pacing, cohort health
2. **Academic Advisors** — Individual student readiness, intervention decisions

## Program Structure

- Cohort-based with milestones
- Students move as groups through exam-based checkpoints
- Milestones: Mock Exam 1 → Mock Exam 2 → Comprehensive Review → NBCOT Ready

---

## Architecture

### Pages (Enhanced + New)

| Page | Route | Changes |
|------|-------|---------|
| Dashboard | `/otexam/dashboard` | ADD Gantt timeline, milestone tracking |
| Students | `/otexam/students` | ADD remediation queue, tier badges, alerts |
| Student Pathway | `/otexam/pathway/:studentId` | NEW individual deep-dive |

### Data Model Additions

```typescript
// Program milestones that cohorts progress through
interface ProgramMilestone {
  id: string
  name: string                    // "Mock Exam 1", "Comprehensive Review"
  order: number                   // Sequence position
  passingScore: number            // 70, 75, etc.
  domainThresholds?: Record<NBCOTDomain, number>
}

// Student's progress through milestones
interface StudentCheckpoint {
  studentId: string
  milestoneId: string
  status: 'upcoming' | 'in-progress' | 'passed' | 'failed' | 'remediation'
  score?: number
  attemptCount: number
  completedAt?: Date
  remediationTier?: 1 | 2 | 3
}

// Remediation assignment
interface RemediationPlan {
  id: string
  studentId: string
  tier: 1 | 2 | 3
  reason: string                  // "Intervention domain < 70%"
  weakDomains: NBCOTDomain[]
  assignedQuestions: string[]     // Question IDs
  questionsCompleted: number
  createdAt: Date
  escalatedAt?: Date
  completedAt?: Date
  advisorNotes?: string
}
```

---

## Dashboard Enhancements

### New: Gantt Timeline (Top Section)

**View toggles:**
- Single Cohort — Full journey of one cohort
- Multi-Cohort — Side-by-side comparison of all active cohorts
- 12-Month Forecast — Projected positions

**Gantt structure:**
```
Cohort        | Mock 1 | Mock 2 | Comprehensive | NBCOT Ready |
─────────────────────────────────────────────────────────────────
Fall 2024     | ████░░ |        |               |             |
Spring 2024   | ██████ | ████░░ |               |             |
Fall 2023     | ██████ | ██████ | ██████        | ░░░░        |
```

**Milestone bar details:**
- Fill = % of cohort passed
- Color: Green (90%+), Amber (75-89%), Red (<75%)
- Click to drill down to individual students

### New: Below Gantt

- NBCOT Domain Exposure — Which domains tested at each milestone
- Predicted Pass Rate — Rolling prediction based on performance

### Keep Existing

- Overview stats cards
- At-risk students table
- Domain performance bars
- Setting performance grid
- Recent activity feed
- Cohort comparison table

---

## Students Page Enhancements

### New: Remediation Queue (Left Sidebar)

- Students sorted by urgency: Tier 3 → Tier 2 → Tier 1
- Card shows: Name, cohort, milestone, days in remediation
- Color badges: Red (Tier 3), Orange (Tier 2), Yellow (Tier 1)
- Click → opens Student Pathway

### New: Alert Notifications (Top)

Auto-generated alerts:
- "Jordan Williams failed Mock Exam 2 — moved to Tier 2"
- "3 students completed Tier 1 remediation — ready for retest"
- "Fall 2024: Mock Exam 1 deadline in 5 days, 6 haven't attempted"

### New: Tier Badges on Student List

- Each student row shows current remediation tier (if any)
- Visual indicator of intervention status

### Keep Existing

- Student list with filters
- Search functionality
- Student detail panel
- CRUD operations

---

## Student Pathway (New Page)

### Header

- Student name, cohort, enrollment date
- Overall readiness score (0-100)
- Status badge: "On Track" / "Tier 1 Remediation" / "Tier 2 - Needs Meeting"

### Visual Timeline

```
○──────●──────●──────◐──────○──────○
Start   Mock 1  Mock 2  [Current]  Comp.  NBCOT
        78%     71%     In Progress
```

- Filled = passed, half-filled = in progress, empty = upcoming
- Click milestone for score breakdown

### Domain Competency Cards

Four cards showing:
- Domain name
- Current score with threshold line (70%)
- Trend arrow (improving/declining)
- "Practice Now" button on weak domains

### Active Remediation Panel

- Current tier and trigger reason
- Assigned practice set with progress bar
- Days remaining before escalation
- Advisor notes field

---

## Automated Remediation System

### Trigger Rules

| Condition | Action |
|-----------|--------|
| Domain score < 70% after any exam | Auto-create Tier 1 |
| Tier 1 not completed in 7 days | Escalate to Tier 2 + alert advisor |
| Failed milestone exam | Tier 2 immediately |
| Failed milestone twice | Tier 3 + formal documentation |

### Tier 1 (Automated)

- System generates practice set from Question Bank
- Filters to weak domain(s), randomizes selection
- Student sees: "Complete 15 questions in [Domain] before [Milestone]"
- Progress tracked automatically
- On completion: Ready for reattempt or advisor review

### Tier 2 (Advisor-Assisted)

- Advisor gets alert with recommended talking points
- Pre-filled meeting agenda based on data
- Advisor logs notes, sets follow-up date
- Can assign custom practice or extend Tier 1

### Tier 3 (Formal)

- Generates documentation template
- Tracks formal remediation plan with sign-off dates
- Links to all prior attempts and interventions

---

## Implementation Order

1. Data model additions (types, mock data)
2. Dashboard Gantt timeline
3. Students page remediation queue + badges
4. Student Pathway page
5. Remediation engine logic

---

## Notes

- Use frontend-design plugin for UI implementation
- No export functionality needed initially (on-screen dashboards only)
- Consolidates with existing features rather than duplicating
