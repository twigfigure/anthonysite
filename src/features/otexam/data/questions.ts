import type { ExamQuestion } from '../types'

export const sampleQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    scenario: `A 7-year-old child with autism spectrum disorder (ASD) has been referred to outpatient occupational therapy. During the initial evaluation, the OT observes that the child becomes extremely distressed when transitioning between activities, covers ears frequently, and avoids touching certain textures. The child's teacher reports difficulty participating in classroom activities and frequent meltdowns during unstructured time. The parents note that mealtimes are challenging due to food texture aversions, and the child only wears specific clothing.`,
    question: 'Based on this clinical presentation, which assessment approach would BEST inform the development of a comprehensive intervention plan?',
    options: [
      {
        id: 'a',
        text: 'Administer the Sensory Profile 2 and conduct systematic observation across multiple environments to identify sensory processing patterns and their functional impact',
        isCorrect: true,
        rationale: 'This approach combines standardized assessment with ecological observation, allowing the therapist to understand both the sensory processing patterns (through SP2) and how they manifest functionally across contexts. This information is essential for developing targeted interventions that address the child\'s specific sensory needs in natural environments.'
      },
      {
        id: 'b',
        text: 'Complete a developmental milestone checklist to determine areas of delay',
        isCorrect: false,
        rationale: 'While developmental information is valuable, a milestone checklist alone does not address the sensory processing concerns that are central to this child\'s presentation. The clinical picture clearly indicates sensory-based challenges requiring specialized assessment.'
      },
      {
        id: 'c',
        text: 'Observe the child in a quiet therapy room to minimize external stimuli during assessment',
        isCorrect: false,
        rationale: 'Assessing only in a controlled environment would not capture how sensory processing challenges affect the child in natural contexts. The referral concerns specifically mention difficulties in classroom, home, and mealtime situations.'
      },
      {
        id: 'd',
        text: 'Interview the parents about the child\'s birth history and early developmental milestones',
        isCorrect: false,
        rationale: 'While birth and developmental history provides context, it does not directly assess current sensory processing patterns or functional performance. This information would be supplementary rather than primary for intervention planning.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['evaluation', 'competency'],
    otSettings: ['pediatrics'],
    difficulty: 3,
    concepts: ['sensory processing', 'autism spectrum disorder', 'assessment selection', 'ecological validity', 'functional impact'],
    clinicalReasoning: 'This question requires candidates to evaluate multiple assessment approaches and determine which provides the most comprehensive and functionally relevant information. The correct answer demonstrates understanding of sensory processing assessment, the importance of ecological validity, and how assessment drives intervention planning.'
  },
  {
    id: 'q2',
    scenario: `An 82-year-old woman with moderate dementia resides in a skilled nursing facility. She was previously independent in self-feeding but has recently begun refusing meals, pushing food away, and becoming agitated at mealtimes. The nursing staff reports she has lost 8 pounds in the past month. Medical workup has ruled out acute illness, pain, and medication side effects. The OT is consulted to address feeding and eating concerns.`,
    question: 'Which intervention strategy demonstrates the MOST effective application of person-centered dementia care principles while addressing the immediate safety concern of weight loss?',
    options: [
      {
        id: 'a',
        text: 'Modify the dining environment to reduce sensory overload, offer finger foods that align with her food preferences from her life history, and provide hand-over-hand assistance using familiar mealtime routines',
        isCorrect: true,
        rationale: 'This intervention integrates multiple evidence-based dementia care principles: environmental modification to reduce overwhelming stimuli, honoring the person\'s identity through life history and preferences, maintaining dignity through appropriate food presentation, and using procedural memory through familiar routines. It addresses both the behavioral symptoms and nutritional needs.'
      },
      {
        id: 'b',
        text: 'Recommend a speech-language pathology consult for a swallowing evaluation and modified diet texture',
        isCorrect: false,
        rationale: 'While dysphagia screening is appropriate, the clinical picture suggests behavioral/environmental factors rather than swallowing dysfunction. Medical workup was negative, and the presentation (refusing, pushing away, agitation) indicates cognitive/sensory factors rather than physical swallowing difficulty.'
      },
      {
        id: 'c',
        text: 'Train nursing staff to use verbal cues and reminders to encourage eating throughout the meal',
        isCorrect: false,
        rationale: 'Excessive verbal cueing can increase agitation in persons with moderate dementia, as it places demands on impaired explicit memory and processing. This approach does not address the environmental or person-centered factors likely contributing to meal refusal.'
      },
      {
        id: 'd',
        text: 'Recommend nutritional supplements between meals to ensure adequate caloric intake',
        isCorrect: false,
        rationale: 'While nutritional supplementation may be a component of care, it does not address the underlying occupational performance issue. As occupational therapists, our role is to enable participation in the meaningful occupation of eating, not simply to ensure caloric intake through supplements.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['geriatrics'],
    difficulty: 4,
    concepts: ['dementia care', 'person-centered practice', 'environmental modification', 'procedural memory', 'mealtime intervention', 'behavioral symptoms of dementia'],
    clinicalReasoning: 'Candidates must apply knowledge of dementia progression, behavioral symptoms, and person-centered care principles to select an intervention that honors the person\'s identity while addressing functional decline. The question requires integration of multiple concepts: environmental factors in dementia, the role of procedural memory, and OT\'s focus on occupation.'
  },
  {
    id: 'q3',
    scenario: `A 45-year-old construction worker sustained a complex proximal phalanx fracture of the dominant index finger 6 weeks ago, treated with ORIF. He has been attending hand therapy and currently presents with: active PIP flexion 45°, extension lag 20°, DIP flexion 30°, and significant edema. Scar tissue is adherent over the dorsal incision. The patient is anxious about returning to work and reports he cannot grip his tools or make a full fist. His workers' compensation case manager is pressuring for a return-to-work date.`,
    question: 'Considering the clinical findings, healing timeline, and psychosocial factors, which combination of interventions would be MOST appropriate at this stage of recovery?',
    options: [
      {
        id: 'a',
        text: 'Scar mobilization and silicone gel sheeting, edema management with retrograde massage and compression, AROM exercises emphasizing tendon gliding, and collaborative goal-setting addressing work concerns',
        isCorrect: true,
        rationale: 'At 6 weeks post-ORIF, bone healing allows for progression of activity. This comprehensive approach addresses all identified impairments: scar adhesion (mobilization/silicone), edema (retrograde massage/compression), limited ROM (tendon gliding exercises), while acknowledging psychosocial factors through collaborative goal-setting. This reflects client-centered practice within tissue healing parameters.'
      },
      {
        id: 'b',
        text: 'Fabricate a dynamic PIP extension splint, initiate passive stretching to end range, and begin grip strengthening with therapy putty',
        isCorrect: false,
        rationale: 'At 6 weeks, aggressive passive stretching and resistive exercises may be premature and risk damage to healing structures. Dynamic splinting for extension may be appropriate, but should be part of a comprehensive program addressing all impairments, not the primary focus. Strengthening typically begins 8-12 weeks post-fracture.'
      },
      {
        id: 'c',
        text: 'Continue protective splinting, focus on edema reduction, and advise the patient he cannot return to work for at least 3 more months',
        isCorrect: false,
        rationale: 'This approach is overly conservative for 6 weeks post-ORIF. Continued immobilization would promote joint stiffness and scar adhesion. Additionally, providing absolute return-to-work timelines without considering modified duty options is not within OT scope and doesn\'t address the patient\'s psychological concerns.'
      },
      {
        id: 'd',
        text: 'Initiate work hardening program with simulated construction tasks to expedite return to full duty',
        isCorrect: false,
        rationale: 'Work hardening with full construction simulation is premature at 6 weeks and could compromise healing. The patient hasn\'t yet achieved sufficient ROM for basic grip, making full work simulation inappropriate. Work conditioning/hardening is typically appropriate in later rehabilitation phases.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['hand-therapy'],
    difficulty: 4,
    concepts: ['tissue healing', 'scar management', 'edema control', 'tendon gliding', 'return to work', 'client-centered practice', 'workers compensation'],
    clinicalReasoning: 'This question requires analysis of multiple clinical factors: tissue healing timelines, current impairments, functional limitations, and psychosocial considerations. Candidates must synthesize knowledge from anatomy, kinesiology, and therapeutic intervention to select a comprehensive, stage-appropriate treatment plan.'
  },
  {
    id: 'q4',
    scenario: `A 28-year-old woman with a 10-year history of bipolar I disorder is admitted to an inpatient psychiatric unit during a severe depressive episode. She reports inability to get out of bed, neglecting personal hygiene for 2 weeks, not eating regular meals, and withdrawing from all social contacts. She was previously employed as a graphic designer but has been on medical leave for 3 months. She expresses feelings of worthlessness and questions whether she will ever be able to work again. The treatment team requests OT evaluation and intervention.`,
    question: 'Which therapeutic approach BEST addresses this client\'s occupational dysfunction while considering her current mental health status and recovery goals?',
    options: [
      {
        id: 'a',
        text: 'Use a graded activity approach starting with basic self-care routines, incorporate meaningful creative activities connected to her identity as a designer, and collaborate on a daily structure that balances rest with gentle activation',
        isCorrect: true,
        rationale: 'This approach applies behavioral activation principles appropriate for depression, uses graded activity to prevent overwhelming the client, incorporates meaningful occupation connected to her vocational identity, and addresses the disrupted daily routine. It respects her current capacity while building toward recovery goals.'
      },
      {
        id: 'b',
        text: 'Focus intervention on vocational rehabilitation to address her concerns about returning to work as soon as possible',
        isCorrect: false,
        rationale: 'While vocational concerns are significant to this client, immediately focusing on work return is inappropriate during acute depression. She currently cannot manage basic self-care, indicating her capacity for vocational demands is significantly limited. Vocational goals should be addressed progressively as acute symptoms stabilize.'
      },
      {
        id: 'c',
        text: 'Encourage participation in all available group activities on the unit to address social withdrawal',
        isCorrect: false,
        rationale: 'Pushing full group participation may be overwhelming for someone in severe depression and could reinforce feelings of failure if she cannot participate. A graded approach to social engagement, starting with lower-demand interactions, would be more therapeutic.'
      },
      {
        id: 'd',
        text: 'Provide education about bipolar disorder and the importance of medication compliance to prevent future episodes',
        isCorrect: false,
        rationale: 'While psychoeducation has a role, it is not the primary OT intervention for acute depression. Education about condition management is more appropriate as the client stabilizes. During acute episodes, occupation-based intervention addressing functional performance is the OT priority.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['mental-health'],
    difficulty: 3,
    concepts: ['depression', 'behavioral activation', 'graded activity', 'meaningful occupation', 'daily structure', 'occupational identity', 'acute psychiatric care'],
    clinicalReasoning: 'Candidates must apply understanding of depression\'s impact on occupational performance, therapeutic use of activity, and client-centered practice. The question requires integration of mental health knowledge with core OT principles of meaningful occupation and graded therapeutic intervention.'
  },
  {
    id: 'q5',
    scenario: `A 58-year-old man is 3 days post-CVA affecting the left MCA territory. He presents with right hemiplegia, right homonymous hemianopsia, and mild receptive aphasia. During morning ADL, the OT observes he neglects items on his right side, has difficulty following multi-step instructions, and becomes frustrated when he cannot complete tasks he previously performed independently. His wife is present and repeatedly tries to complete tasks for him, stating "he gets so upset when he can't do things." The patient is expected to discharge home with his wife in 5 days.`,
    question: 'Which intervention approach BEST addresses this client\'s complex presentation while preparing for safe discharge?',
    options: [
      {
        id: 'a',
        text: 'Implement visual scanning training with anchoring techniques, break tasks into single steps with demonstration, train the wife in cueing strategies that support participation rather than dependence, and conduct home safety assessment',
        isCorrect: true,
        rationale: 'This comprehensive approach addresses the visual field deficit (scanning/anchoring), aphasia (simplified instructions with demonstration), emotional adjustment (supporting rather than doing for), and discharge planning (home safety, caregiver training). It promotes participation and prepares for safe transition home.'
      },
      {
        id: 'b',
        text: 'Focus on intensive motor recovery of the right upper extremity using neurodevelopmental techniques to maximize function before discharge',
        isCorrect: false,
        rationale: 'At 3 days post-CVA, intensive motor recovery focus is premature and unrealistic for the 5-day discharge timeline. The complex cognitive-perceptual deficits (neglect, hemianopsia, aphasia) pose more immediate safety concerns than motor limitations and must be addressed for safe discharge.'
      },
      {
        id: 'c',
        text: 'Recommend extended inpatient stay to allow more time for recovery before attempting discharge home',
        isCorrect: false,
        rationale: 'While additional rehabilitation time may be beneficial, recommending extended stay without providing intervention during the current admission is not appropriate. The OT role is to maximize function and safety within the given timeframe while advocating for appropriate post-acute services.'
      },
      {
        id: 'd',
        text: 'Teach the wife to provide maximum assistance with all ADLs to prevent patient frustration and ensure task completion',
        isCorrect: false,
        rationale: 'This approach promotes learned helplessness and dependence, contrary to rehabilitation principles. Supporting the wife to enable participation maintains the patient\'s dignity, supports neuroplasticity, and addresses the emotional component of adjustment to disability.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['intervention', 'management', 'competency'],
    otSettings: ['physical-disabilities'],
    difficulty: 5,
    concepts: ['stroke rehabilitation', 'visual field deficits', 'aphasia', 'caregiver training', 'discharge planning', 'learned helplessness', 'visual scanning', 'home safety'],
    clinicalReasoning: 'This complex question requires candidates to evaluate multiple intervention options considering neurological deficits, psychosocial factors, caregiver dynamics, and discharge constraints. The correct answer demonstrates synthesis of stroke rehabilitation principles, family-centered care, and practical discharge planning.'
  },
  {
    id: 'q6',
    scenario: `An occupational therapist working in a community wellness center is developing a falls prevention program for community-dwelling older adults. The center serves a diverse population including recent immigrants with limited English proficiency, individuals with various cultural beliefs about aging and exercise, and adults with different socioeconomic backgrounds. The program needs to be sustainable within limited funding and should demonstrate measurable outcomes for grant reporting.`,
    question: 'Which program development approach BEST reflects evidence-based practice, cultural humility, and occupational therapy\'s distinct value?',
    options: [
      {
        id: 'a',
        text: 'Conduct focus groups with community members to understand cultural perspectives on falls and aging, integrate evidence-based exercises into culturally meaningful activities, train bilingual community health workers as co-facilitators, and use occupation-based outcome measures',
        isCorrect: true,
        rationale: 'This approach demonstrates cultural humility through community engagement, applies evidence-based interventions adapted to cultural context, addresses language barriers through community health worker model, and emphasizes occupation-based outcomes that reflect OT\'s distinct contribution. It builds community capacity and sustainability.'
      },
      {
        id: 'b',
        text: 'Implement the Otago Exercise Programme as designed in the research literature, as it has the strongest evidence base for falls prevention',
        isCorrect: false,
        rationale: 'While Otago has strong evidence, implementing a program without cultural adaptation ignores the population\'s diverse needs and may result in poor participation and outcomes. Evidence-based practice requires integrating research evidence with client values and clinical expertise, not simply applying protocols.'
      },
      {
        id: 'c',
        text: 'Focus the program on home modification assessments and recommendations, as environmental factors are primary contributors to falls',
        isCorrect: false,
        rationale: 'Home modifications address only environmental factors, neglecting intrinsic fall risk factors (strength, balance, cognition) and behavioral factors. A comprehensive falls prevention program should address multiple risk factors. Additionally, home visits are resource-intensive and may not be feasible within limited funding.'
      },
      {
        id: 'd',
        text: 'Create standardized educational materials about fall risk factors and prevention strategies to distribute throughout the community',
        isCorrect: false,
        rationale: 'Passive education alone is insufficient for falls prevention and does not reflect OT\'s expertise in occupation-based intervention. Educational materials without cultural adaptation, language accessibility, and active skill-building are unlikely to produce meaningful outcomes.'
      }
    ],
    bloomLevel: 'create',
    nbcotDomains: ['management', 'competency'],
    otSettings: ['wellness'],
    difficulty: 4,
    concepts: ['program development', 'cultural humility', 'evidence-based practice', 'community health', 'falls prevention', 'health disparities', 'outcome measurement'],
    clinicalReasoning: 'This question requires candidates to integrate knowledge of evidence-based falls prevention, cultural competence, program development principles, and OT\'s role in community health. The correct answer demonstrates understanding of how to adapt evidence-based interventions to community context while maintaining fidelity to core principles.'
  }
]

// Bloom's taxonomy level descriptions
export const bloomsDescriptions: Record<string, { level: number; description: string; verbs: string[] }> = {
  remember: {
    level: 1,
    description: 'Recall facts and basic concepts',
    verbs: ['define', 'list', 'recall', 'identify', 'name']
  },
  understand: {
    level: 2,
    description: 'Explain ideas or concepts',
    verbs: ['describe', 'explain', 'summarize', 'interpret', 'classify']
  },
  apply: {
    level: 3,
    description: 'Use information in new situations',
    verbs: ['apply', 'demonstrate', 'implement', 'solve', 'use']
  },
  analyze: {
    level: 4,
    description: 'Draw connections among ideas',
    verbs: ['analyze', 'compare', 'contrast', 'differentiate', 'examine']
  },
  evaluate: {
    level: 5,
    description: 'Justify a decision or course of action',
    verbs: ['evaluate', 'judge', 'critique', 'defend', 'prioritize']
  },
  create: {
    level: 6,
    description: 'Produce new or original work',
    verbs: ['create', 'design', 'develop', 'formulate', 'construct']
  }
}

// NBCOT domain descriptions
export const domainDescriptions: Record<string, { name: string; percentage: string; description: string }> = {
  evaluation: {
    name: 'Acquire Information & Evaluate',
    percentage: '25%',
    description: 'Gathering and evaluating information through methods including interview, observation, formal/standardized testing, and review of records'
  },
  intervention: {
    name: 'Develop Intervention Plan & Implement',
    percentage: '45%',
    description: 'Formulating goals and intervention approaches, selecting activities, and delivering interventions'
  },
  management: {
    name: 'Manage & Direct Services',
    percentage: '15%',
    description: 'Managing services including documentation, supervision, and coordination with team members'
  },
  competency: {
    name: 'Professional Responsibility',
    percentage: '15%',
    description: 'Demonstrating ethical practice, professional development, and advocacy'
  }
}

// OT Setting descriptions
export const settingDescriptions: Record<string, { name: string; icon: string; color: string }> = {
  'pediatrics': {
    name: 'Pediatrics',
    icon: '👶',
    color: 'from-pink-500 to-rose-500'
  },
  'geriatrics': {
    name: 'Geriatrics',
    icon: '👴',
    color: 'from-purple-500 to-violet-500'
  },
  'physical-disabilities': {
    name: 'Physical Disabilities',
    icon: '🦿',
    color: 'from-blue-500 to-cyan-500'
  },
  'mental-health': {
    name: 'Mental Health',
    icon: '🧠',
    color: 'from-emerald-500 to-teal-500'
  },
  'wellness': {
    name: 'Wellness & Prevention',
    icon: '🌱',
    color: 'from-amber-500 to-orange-500'
  },
  'hand-therapy': {
    name: 'Hand Therapy',
    icon: '🤲',
    color: 'from-red-500 to-pink-500'
  }
}
