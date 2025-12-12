import type { ExamQuestion } from '../types'

export const sampleQuestions: ExamQuestion[] = [
  // PEDIATRICS - Sensory Processing
  {
    id: 'q1',
    scenario: `A 7-year-old child with autism spectrum disorder (ASD) has been referred to outpatient occupational therapy. During the initial evaluation, the OT observes that the child becomes extremely distressed when transitioning between activities, covers ears frequently, and avoids touching certain textures. The child's teacher reports difficulty participating in classroom activities and frequent meltdowns during unstructured time. The parents note that mealtimes are challenging due to food texture aversions, and the child only wears specific clothing.`,
    question: 'Based on this clinical presentation, which assessment approach would BEST inform the development of a comprehensive intervention plan?',
    options: [
      {
        id: 'a',
        text: 'Complete a developmental milestone checklist to determine areas of delay and compare to age-matched peers',
        isCorrect: false,
        rationale: 'While developmental information is valuable, a milestone checklist alone does not address the sensory processing concerns that are central to this child\'s presentation. The clinical picture clearly indicates sensory-based challenges requiring specialized assessment.'
      },
      {
        id: 'b',
        text: 'Observe the child in a quiet therapy room to minimize external stimuli and obtain baseline performance data',
        isCorrect: false,
        rationale: 'Assessing only in a controlled environment would not capture how sensory processing challenges affect the child in natural contexts. The referral concerns specifically mention difficulties in classroom, home, and mealtime situations—ecological validity is essential.'
      },
      {
        id: 'c',
        text: 'Administer the Sensory Profile 2 and conduct systematic observation across multiple environments to identify sensory processing patterns and their functional impact',
        isCorrect: true,
        rationale: 'This approach combines standardized assessment with ecological observation, allowing the therapist to understand both the sensory processing patterns (through SP2) and how they manifest functionally across contexts. This information is essential for developing targeted interventions that address the child\'s specific sensory needs in natural environments.'
      },
      {
        id: 'd',
        text: 'Interview the parents about the child\'s birth history and early developmental milestones to establish etiology',
        isCorrect: false,
        rationale: 'While birth and developmental history provides context, it does not directly assess current sensory processing patterns or functional performance. This information would be supplementary rather than primary for intervention planning at this stage.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['evaluation', 'competency'],
    otSettings: ['pediatrics'],
    difficulty: 3,
    concepts: ['sensory processing', 'autism spectrum disorder', 'assessment selection', 'ecological validity', 'functional impact'],
    clinicalReasoning: 'This question requires candidates to evaluate multiple assessment approaches and determine which provides the most comprehensive and functionally relevant information. All options represent legitimate assessment activities, but candidates must prioritize based on the presenting concerns.',
    suggestedReading: [
      {
        title: 'Sensory Profile 2 User\'s Manual',
        source: 'Pearson Clinical Assessment',
        url: 'https://www.pearsonassessments.com/store/usassessments/en/Store/Professional-Assessments/Behavior/Sensory-Profile-2/p/100000822.html'
      },
      {
        title: 'Sensory Processing in Children with ASD',
        source: 'American Journal of Occupational Therapy'
      },
      {
        title: 'Ecological Assessment in Pediatric OT',
        source: 'AOTA Practice Guidelines'
      }
    ]
  },

  // GERIATRICS - Dementia Care
  {
    id: 'q2',
    scenario: `An 82-year-old woman with moderate dementia resides in a skilled nursing facility. She was previously independent in self-feeding but has recently begun refusing meals, pushing food away, and becoming agitated at mealtimes. The nursing staff reports she has lost 8 pounds in the past month. Medical workup has ruled out acute illness, pain, and medication side effects. The OT is consulted to address feeding and eating concerns.`,
    question: 'Which intervention strategy demonstrates the MOST effective application of person-centered dementia care principles while addressing the immediate safety concern of weight loss?',
    options: [
      {
        id: 'a',
        text: 'Recommend a speech-language pathology consult for a swallowing evaluation and implement a modified texture diet as a precaution',
        isCorrect: false,
        rationale: 'While dysphagia screening is appropriate in many cases, the clinical picture suggests behavioral/environmental factors rather than swallowing dysfunction. Medical workup was negative, and the presentation (refusing, pushing away, agitation) indicates cognitive/sensory factors rather than physical swallowing difficulty.'
      },
      {
        id: 'b',
        text: 'Modify the dining environment to reduce sensory overload, offer finger foods that align with her food preferences from her life history, and provide hand-over-hand assistance using familiar mealtime routines',
        isCorrect: true,
        rationale: 'This intervention integrates multiple evidence-based dementia care principles: environmental modification to reduce overwhelming stimuli, honoring the person\'s identity through life history and preferences, maintaining dignity through appropriate food presentation, and using procedural memory through familiar routines. It addresses both the behavioral symptoms and nutritional needs.'
      },
      {
        id: 'c',
        text: 'Train nursing staff to use clear verbal cues and reminders to encourage eating throughout the meal',
        isCorrect: false,
        rationale: 'Excessive verbal cueing can increase agitation in persons with moderate dementia, as it places demands on impaired explicit memory and processing. This approach does not address the environmental or person-centered factors likely contributing to meal refusal.'
      },
      {
        id: 'd',
        text: 'Recommend nutritional supplements between meals and monitor weight weekly to ensure adequate caloric intake',
        isCorrect: false,
        rationale: 'While nutritional supplementation may be a component of care, it does not address the underlying occupational performance issue. As occupational therapists, our role is to enable participation in the meaningful occupation of eating, not simply to ensure caloric intake through supplements.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['geriatrics'],
    difficulty: 4,
    concepts: ['dementia care', 'person-centered practice', 'environmental modification', 'procedural memory', 'mealtime intervention', 'behavioral symptoms of dementia'],
    clinicalReasoning: 'Candidates must apply knowledge of dementia progression, behavioral symptoms, and person-centered care principles to select an intervention that honors the person\'s identity while addressing functional decline. All options represent reasonable clinical considerations, but the best answer addresses root causes rather than symptoms.',
    suggestedReading: [
      {
        title: 'Person-Centered Dementia Care: Making Services Better',
        source: 'AOTA Dementia Practice Guidelines'
      },
      {
        title: 'Mealtime Difficulties in Dementia',
        source: 'Journal of Clinical Nursing'
      },
      {
        title: 'Environmental Modifications for Persons with Dementia',
        source: 'Alzheimer\'s Association'
      }
    ]
  },

  // HAND THERAPY - Complex Fracture Rehabilitation
  {
    id: 'q3',
    scenario: `A 45-year-old construction worker sustained a complex proximal phalanx fracture of the dominant index finger 6 weeks ago, treated with ORIF. He has been attending hand therapy and currently presents with: active PIP flexion 45°, extension lag 20°, DIP flexion 30°, and significant edema. Scar tissue is adherent over the dorsal incision. The patient is anxious about returning to work and reports he cannot grip his tools or make a full fist. His workers' compensation case manager is pressuring for a return-to-work date.`,
    question: 'Considering the clinical findings, healing timeline, and psychosocial factors, which combination of interventions would be MOST appropriate at this stage of recovery?',
    options: [
      {
        id: 'a',
        text: 'Fabricate a dynamic PIP extension splint, initiate passive stretching to end range, and begin grip strengthening with therapy putty to address functional concerns',
        isCorrect: false,
        rationale: 'At 6 weeks, aggressive passive stretching and resistive exercises may be premature and risk damage to healing structures. Dynamic splinting for extension may be appropriate, but should be part of a comprehensive program addressing all impairments. Strengthening typically begins 8-12 weeks post-fracture.'
      },
      {
        id: 'b',
        text: 'Continue protective splinting between sessions, focus primarily on edema reduction, and advise the patient he cannot return to work for at least 3 more months',
        isCorrect: false,
        rationale: 'This approach is overly conservative for 6 weeks post-ORIF. Continued immobilization would promote joint stiffness and scar adhesion. Additionally, providing absolute return-to-work timelines without considering modified duty options is not within OT scope and doesn\'t address the patient\'s psychological concerns.'
      },
      {
        id: 'c',
        text: 'Initiate work hardening program with simulated construction tasks to expedite return to full duty and address the case manager\'s concerns',
        isCorrect: false,
        rationale: 'Work hardening with full construction simulation is premature at 6 weeks and could compromise healing. The patient hasn\'t yet achieved sufficient ROM for basic grip, making full work simulation inappropriate. Work conditioning/hardening is typically appropriate in later rehabilitation phases.'
      },
      {
        id: 'd',
        text: 'Scar mobilization and silicone gel sheeting, edema management with retrograde massage and compression, AROM exercises emphasizing tendon gliding, and collaborative goal-setting addressing work concerns',
        isCorrect: true,
        rationale: 'At 6 weeks post-ORIF, bone healing allows for progression of activity. This comprehensive approach addresses all identified impairments: scar adhesion (mobilization/silicone), edema (retrograde massage/compression), limited ROM (tendon gliding exercises), while acknowledging psychosocial factors through collaborative goal-setting. This reflects client-centered practice within tissue healing parameters.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['hand-therapy'],
    difficulty: 4,
    concepts: ['tissue healing', 'scar management', 'edema control', 'tendon gliding', 'return to work', 'client-centered practice', 'workers compensation'],
    clinicalReasoning: 'This question requires analysis of multiple clinical factors: tissue healing timelines, current impairments, functional limitations, and psychosocial considerations. All options contain elements that might be appropriate at different stages; candidates must synthesize knowledge to select the stage-appropriate comprehensive approach.'
  },

  // MENTAL HEALTH - Acute Inpatient
  {
    id: 'q4',
    scenario: `A 28-year-old woman with a 10-year history of bipolar I disorder is admitted to an inpatient psychiatric unit during a severe depressive episode. She reports inability to get out of bed, neglecting personal hygiene for 2 weeks, not eating regular meals, and withdrawing from all social contacts. She was previously employed as a graphic designer but has been on medical leave for 3 months. She expresses feelings of worthlessness and questions whether she will ever be able to work again. The treatment team requests OT evaluation and intervention.`,
    question: 'Which therapeutic approach BEST addresses this client\'s occupational dysfunction while considering her current mental health status and recovery goals?',
    options: [
      {
        id: 'a',
        text: 'Focus intervention on vocational rehabilitation to address her concerns about returning to work as quickly as possible',
        isCorrect: false,
        rationale: 'While vocational concerns are significant to this client, immediately focusing on work return is inappropriate during acute depression. She currently cannot manage basic self-care, indicating her capacity for vocational demands is significantly limited. Vocational goals should be addressed progressively as acute symptoms stabilize.'
      },
      {
        id: 'b',
        text: 'Encourage participation in all available group activities on the unit to address social withdrawal and build support networks',
        isCorrect: false,
        rationale: 'Pushing full group participation may be overwhelming for someone in severe depression and could reinforce feelings of failure if she cannot participate fully. A graded approach to social engagement, starting with lower-demand interactions, would be more therapeutic.'
      },
      {
        id: 'c',
        text: 'Provide comprehensive education about bipolar disorder and the importance of medication compliance to prevent future episodes',
        isCorrect: false,
        rationale: 'While psychoeducation has a role in recovery, it is not the primary OT intervention for acute depression. Education about condition management is more appropriate as the client stabilizes. During acute episodes, occupation-based intervention addressing functional performance is the OT priority.'
      },
      {
        id: 'd',
        text: 'Use a graded activity approach starting with basic self-care routines, incorporate meaningful creative activities connected to her identity as a designer, and collaborate on a daily structure that balances rest with gentle activation',
        isCorrect: true,
        rationale: 'This approach applies behavioral activation principles appropriate for depression, uses graded activity to prevent overwhelming the client, incorporates meaningful occupation connected to her vocational identity, and addresses the disrupted daily routine. It respects her current capacity while building toward recovery goals.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['mental-health'],
    difficulty: 3,
    concepts: ['depression', 'behavioral activation', 'graded activity', 'meaningful occupation', 'daily structure', 'occupational identity', 'acute psychiatric care'],
    clinicalReasoning: 'Candidates must apply understanding of depression\'s impact on occupational performance, therapeutic use of activity, and client-centered practice. All options address legitimate concerns; the best answer demonstrates understanding of staging interventions appropriately and meeting the client where she is.'
  },

  // PHYSICAL DISABILITIES - CVA/Stroke
  {
    id: 'q5',
    scenario: `A 58-year-old man is 3 days post-CVA affecting the left MCA territory. He presents with right hemiplegia, right homonymous hemianopsia, and mild receptive aphasia. During morning ADL, the OT observes he neglects items on his right side, has difficulty following multi-step instructions, and becomes frustrated when he cannot complete tasks he previously performed independently. His wife is present and repeatedly tries to complete tasks for him, stating "he gets so upset when he can't do things." The patient is expected to discharge home with his wife in 5 days.`,
    question: 'Which intervention approach BEST addresses this client\'s complex presentation while preparing for safe discharge?',
    options: [
      {
        id: 'a',
        text: 'Focus on intensive motor recovery of the right upper extremity using neurodevelopmental techniques to maximize function before discharge',
        isCorrect: false,
        rationale: 'At 3 days post-CVA, intensive motor recovery focus is premature and unrealistic for the 5-day discharge timeline. The complex cognitive-perceptual deficits (neglect, hemianopsia, aphasia) pose more immediate safety concerns than motor limitations and must be addressed for safe discharge.'
      },
      {
        id: 'b',
        text: 'Recommend extended inpatient stay to allow more time for neurological recovery before attempting discharge home',
        isCorrect: false,
        rationale: 'While additional rehabilitation time may be beneficial, recommending extended stay without providing intervention during the current admission is not appropriate. The OT role is to maximize function and safety within the given timeframe while advocating for appropriate post-acute services.'
      },
      {
        id: 'c',
        text: 'Implement visual scanning training with anchoring techniques, break tasks into single steps with demonstration, train the wife in cueing strategies that support participation rather than dependence, and conduct home safety assessment',
        isCorrect: true,
        rationale: 'This comprehensive approach addresses the visual field deficit (scanning/anchoring), aphasia (simplified instructions with demonstration), emotional adjustment (supporting rather than doing for), and discharge planning (home safety, caregiver training). It promotes participation and prepares for safe transition home.'
      },
      {
        id: 'd',
        text: 'Teach the wife to provide maximum assistance with all ADLs to prevent patient frustration and ensure task completion during the acute recovery phase',
        isCorrect: false,
        rationale: 'This approach promotes learned helplessness and dependence, contrary to rehabilitation principles. Supporting the wife to enable participation maintains the patient\'s dignity, supports neuroplasticity, and addresses the emotional component of adjustment to disability.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['intervention', 'management', 'competency'],
    otSettings: ['physical-disabilities'],
    difficulty: 5,
    concepts: ['stroke rehabilitation', 'visual field deficits', 'aphasia', 'caregiver training', 'discharge planning', 'learned helplessness', 'visual scanning', 'home safety'],
    clinicalReasoning: 'This complex question requires candidates to evaluate multiple intervention options considering neurological deficits, psychosocial factors, caregiver dynamics, and discharge constraints. All options have merit in different contexts; the best answer demonstrates synthesis of acute stroke rehabilitation principles with practical discharge planning.',
    suggestedReading: [
      {
        title: 'Visual Scanning Training for Hemianopia',
        source: 'Archives of Physical Medicine and Rehabilitation'
      },
      {
        title: 'Caregiver Training in Stroke Rehabilitation',
        source: 'Stroke Journal - American Heart Association'
      },
      {
        title: 'Discharge Planning After Stroke',
        source: 'AOTA Stroke Rehabilitation Guidelines'
      }
    ]
  },

  // WELLNESS/COMMUNITY - Falls Prevention
  {
    id: 'q6',
    scenario: `An occupational therapist working in a community wellness center is developing a falls prevention program for community-dwelling older adults. The center serves a diverse population including recent immigrants with limited English proficiency, individuals with various cultural beliefs about aging and exercise, and adults with different socioeconomic backgrounds. The program needs to be sustainable within limited funding and should demonstrate measurable outcomes for grant reporting.`,
    question: 'Which program development approach BEST reflects evidence-based practice, cultural humility, and occupational therapy\'s distinct value?',
    options: [
      {
        id: 'a',
        text: 'Implement the Otago Exercise Programme exactly as designed in the research literature, as it has the strongest evidence base for falls prevention in older adults',
        isCorrect: false,
        rationale: 'While Otago has strong evidence, implementing a program without cultural adaptation ignores the population\'s diverse needs and may result in poor participation and outcomes. Evidence-based practice requires integrating research evidence with client values and clinical expertise, not simply applying protocols.'
      },
      {
        id: 'b',
        text: 'Conduct focus groups with community members to understand cultural perspectives on falls and aging, integrate evidence-based exercises into culturally meaningful activities, train bilingual community health workers as co-facilitators, and use occupation-based outcome measures',
        isCorrect: true,
        rationale: 'This approach demonstrates cultural humility through community engagement, applies evidence-based interventions adapted to cultural context, addresses language barriers through community health worker model, and emphasizes occupation-based outcomes that reflect OT\'s distinct contribution. It builds community capacity and sustainability.'
      },
      {
        id: 'c',
        text: 'Focus the program on comprehensive home modification assessments and recommendations, as environmental factors are primary contributors to falls in older adults',
        isCorrect: false,
        rationale: 'Home modifications address only environmental factors, neglecting intrinsic fall risk factors (strength, balance, cognition) and behavioral factors. A comprehensive falls prevention program should address multiple risk factors. Additionally, home visits are resource-intensive and may not be feasible within limited funding.'
      },
      {
        id: 'd',
        text: 'Create standardized educational materials in multiple languages about fall risk factors and prevention strategies to distribute throughout the community',
        isCorrect: false,
        rationale: 'Passive education alone is insufficient for falls prevention and does not reflect OT\'s expertise in occupation-based intervention. While multilingual materials show cultural consideration, educational materials without cultural adaptation, and active skill-building are unlikely to produce meaningful outcomes.'
      }
    ],
    bloomLevel: 'create',
    nbcotDomains: ['management', 'competency'],
    otSettings: ['wellness'],
    difficulty: 4,
    concepts: ['program development', 'cultural humility', 'evidence-based practice', 'community health', 'falls prevention', 'health disparities', 'outcome measurement'],
    clinicalReasoning: 'This question requires candidates to integrate knowledge of evidence-based falls prevention, cultural competence, program development principles, and OT\'s role in community health. All options contain valid elements; the best answer demonstrates understanding of how to adapt evidence-based interventions to community context while maintaining program effectiveness.'
  },

  // BURNS - Acute Care
  {
    id: 'q7',
    scenario: `A 35-year-old firefighter sustained 30% TBSA burns including circumferential burns to the right upper extremity and anterior trunk following a structural fire. He is currently 5 days post-injury in the acute burn unit. The wound care team has completed the initial debridement and grafting on the right forearm. The patient is alert but anxious, reports severe pain (8/10), and is reluctant to move his right arm. The surgeon has ordered OT for positioning, splinting, and early mobilization.`,
    question: 'What is the MOST appropriate initial OT intervention approach for this patient?',
    options: [
      {
        id: 'a',
        text: 'Wait until pain is better controlled before initiating ROM exercises to prevent psychological trauma and ensure patient cooperation',
        isCorrect: false,
        rationale: 'Delaying intervention until pain resolves can result in significant contracture development. Early mobilization is critical in burn rehabilitation, and pain management strategies should be coordinated with the medical team to allow participation in therapy, not used as a reason to delay intervention.'
      },
      {
        id: 'b',
        text: 'Fabricate an elbow extension splint and wrist cock-up splint, coordinate timing of ROM with pain medication, use slow sustained stretching with the patient actively involved in the process, and provide education about scar management',
        isCorrect: true,
        rationale: 'This approach addresses the critical need for anti-deformity positioning through appropriate splinting, coordinates with the pain management plan, uses evidence-based ROM techniques (slow, sustained stretching is better tolerated than rapid movements), involves the patient as an active participant, and provides foundational education. The anti-deformity position for elbow burns is extension.'
      },
      {
        id: 'c',
        text: 'Begin aggressive passive ROM exercises to full available range to prevent contractures, as the first two weeks post-burn are the most critical window for maintaining mobility',
        isCorrect: false,
        rationale: 'While early intervention is important, aggressive passive ROM 5 days post-grafting could disrupt graft adherence and cause further psychological distress. The approach should be assertive but graded, with consideration for graft stability and pain tolerance.'
      },
      {
        id: 'd',
        text: 'Focus primarily on emotional support and ADL adaptations, referring ROM and splinting to physical therapy since the patient is resistant to movement',
        isCorrect: false,
        rationale: 'While psychosocial support is important, splinting and ROM for upper extremity burns is within OT scope and a primary role in burn rehabilitation. Resistance to movement is common and should be addressed through therapeutic approaches, not avoided through referral to another discipline.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['physical-disabilities'],
    difficulty: 4,
    concepts: ['burn rehabilitation', 'anti-deformity positioning', 'splinting', 'pain management', 'scar prevention', 'graft precautions', 'patient education'],
    clinicalReasoning: 'Candidates must apply knowledge of burn wound healing, anti-deformity positioning principles, and patient-centered approaches to pain management. The question tests understanding of timing and intensity of intervention in acute burn care.'
  },

  // EDEMA MANAGEMENT - Lymphedema
  {
    id: 'q8',
    scenario: `A 52-year-old woman is referred to outpatient OT 8 weeks after right mastectomy with axillary lymph node dissection for breast cancer. She reports her right arm feels "heavy and tight," and she has difficulty putting on her watch and rings. Circumferential measurements show the right forearm is 2.5 cm larger than the left at 10 cm below the elbow. She works as an elementary school teacher and is concerned about returning to work. She has no history of infection and the surgical site is well-healed.`,
    question: 'Based on this clinical presentation, which intervention approach is MOST appropriate for initial management?',
    options: [
      {
        id: 'a',
        text: 'Refer to a certified lymphedema therapist for complete decongestive therapy (CDT) before initiating any OT intervention',
        isCorrect: false,
        rationale: 'While CDT is the gold standard for lymphedema treatment, the measurement difference indicates Stage I-II lymphedema that can be initially addressed with conservative management. Many OTs are trained in lymphedema management, and immediate referral without any intervention delays care. However, if symptoms don\'t improve, referral would be appropriate.'
      },
      {
        id: 'b',
        text: 'Prescribe a compression sleeve and instruct in home exercises, scheduling follow-up in one month to reassess',
        isCorrect: false,
        rationale: 'Compression garments are important for maintenance but should not be the first-line treatment for active lymphedema. Without initial volume reduction through other techniques, compression alone may be insufficient and poorly tolerated. Additionally, a one-month follow-up is too long for initial management.'
      },
      {
        id: 'c',
        text: 'Instruct in manual lymph drainage self-massage techniques, prescribe remedial exercises, apply short-stretch compression bandaging, provide skin care education, and address work-related upper extremity demands',
        isCorrect: true,
        rationale: 'This comprehensive approach incorporates the key components of lymphedema management: MLD to mobilize fluid, exercises to stimulate lymphatic flow, compression to prevent re-accumulation, and skin care to prevent infection. Addressing work demands reflects the occupational focus and this patient\'s stated concerns.'
      },
      {
        id: 'd',
        text: 'Recommend avoiding all use of the right upper extremity to prevent worsening of the lymphedema and infection',
        isCorrect: false,
        rationale: 'Activity restriction is outdated advice that promotes deconditioning and learned nonuse. Current evidence supports gradual return to activity with appropriate precautions. Teaching the patient to use the arm safely is more appropriate than avoidance.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'evaluation'],
    otSettings: ['physical-disabilities'],
    difficulty: 3,
    concepts: ['lymphedema', 'complete decongestive therapy', 'compression', 'manual lymph drainage', 'breast cancer rehabilitation', 'return to work'],
    clinicalReasoning: 'This question tests knowledge of lymphedema staging, treatment components, and the OT role in cancer rehabilitation. All options contain elements that might be appropriate; candidates must select the most comprehensive initial approach.'
  },

  // ERGONOMICS - Workplace
  {
    id: 'q9',
    scenario: `A software company has contracted with an OT consultant to address rising rates of musculoskeletal complaints among their 200 employees. Initial data shows 35% of employees report neck/shoulder pain and 28% report wrist/hand discomfort. The company has an open office layout with hot-desking (no assigned workstations), and employees use a mix of laptops and desktop computers. Many employees work remotely 2-3 days per week. The company wants a cost-effective solution that addresses the problem comprehensively.`,
    question: 'Which intervention approach would be MOST effective for addressing this workplace health concern?',
    options: [
      {
        id: 'a',
        text: 'Conduct individual ergonomic assessments for all 200 employees and provide personalized workstation modifications',
        isCorrect: false,
        rationale: 'While individual assessments are valuable, this approach is not cost-effective for 200 employees, especially in a hot-desking environment where employees don\'t have permanent workstations. It also doesn\'t address the remote work component.'
      },
      {
        id: 'b',
        text: 'Purchase ergonomic chairs and adjustable desks for all workstations to ensure equipment meets ergonomic standards',
        isCorrect: false,
        rationale: 'Equipment alone doesn\'t ensure proper use. Employees need education on how to adjust and use equipment properly. This approach also doesn\'t address laptop use, remote work, or behavioral factors contributing to discomfort.'
      },
      {
        id: 'c',
        text: 'Implement a multi-tiered program including group ergonomic education, self-assessment tools for office and home setups, adjustable shared equipment, "ergo champions" peer support, and targeted individual consultations for high-risk employees',
        isCorrect: true,
        rationale: 'This tiered approach is cost-effective and comprehensive: group education reaches all employees efficiently, self-assessment tools empower employees at home and office, adjustable shared equipment accommodates hot-desking, peer champions create sustainable support, and individual consultations address complex cases. It addresses both office and remote work contexts.'
      },
      {
        id: 'd',
        text: 'Develop a mandatory stretch break program with software reminders every 30 minutes to interrupt prolonged static postures',
        isCorrect: false,
        rationale: 'While micro-breaks are beneficial, mandatory interruptions every 30 minutes may not be well-received and don\'t address workstation setup, posture, or equipment issues. A stretch program is one component of a comprehensive approach but insufficient alone.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['management', 'intervention'],
    otSettings: ['wellness'],
    difficulty: 4,
    concepts: ['ergonomics', 'workplace health', 'program development', 'musculoskeletal prevention', 'cost-effectiveness', 'remote work'],
    clinicalReasoning: 'Candidates must evaluate program design options considering organizational context, cost-effectiveness, and comprehensive coverage. This tests understanding of population-based intervention strategies in occupational health.'
  },

  // UNIVERSAL DESIGN - Home Modification
  {
    id: 'q10',
    scenario: `A 45-year-old man with multiple sclerosis (relapsing-remitting type) is currently ambulatory with a cane but has experienced two significant relapses in the past year, each resulting in temporary wheelchair use for 4-6 weeks. He and his wife are purchasing a new two-story home and want to incorporate modifications that will accommodate his current needs while planning for potential future decline. They have a budget of $25,000 for modifications. The builder is willing to incorporate changes during construction.`,
    question: 'Which home modification approach BEST applies universal design principles while being most practical for this client\'s situation?',
    options: [
      {
        id: 'a',
        text: 'Install a residential elevator during construction to ensure access to both floors regardless of mobility status',
        isCorrect: false,
        rationale: 'While an elevator provides excellent accessibility, it would consume most of the $25,000 budget, leaving little for other important modifications. During relapses, he may also need bathroom modifications, wider doorways, and other adaptations that the remaining budget couldn\'t cover.'
      },
      {
        id: 'b',
        text: 'Focus all modifications on the first floor to create a fully accessible living space, recommending against purchasing a two-story home',
        isCorrect: false,
        rationale: 'While single-floor living is practical advice, it doesn\'t respect the client\'s choice to purchase this home. OT\'s role is to enable participation in chosen life activities, and the client and his wife have made a decision about their home. The therapist should work within their preferences.'
      },
      {
        id: 'c',
        text: 'Design the first floor with a full bedroom and accessible bathroom, install a stairlift, widen doorways to 36 inches throughout, install blocking in walls for future grab bars, and use lever handles and rocker switches',
        isCorrect: true,
        rationale: 'This approach applies universal design by incorporating accessibility features that benefit everyone (lever handles, rocker switches, wider doors) while addressing specific MS-related needs. The first-floor bedroom/bathroom ensures livability during relapses, the stairlift provides second-floor access when using a cane, and blocking allows for future grab bar installation without wall damage.'
      },
      {
        id: 'd',
        text: 'Recommend minimal modifications now and plan to reassess after each relapse to determine what specific adaptations are needed',
        isCorrect: false,
        rationale: 'This reactive approach misses the opportunity for cost-effective modifications during construction. Making changes after construction is significantly more expensive, and the client\'s condition is likely to fluctuate. Anticipatory planning based on disease trajectory is more appropriate.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['physical-disabilities'],
    difficulty: 4,
    concepts: ['universal design', 'home modification', 'multiple sclerosis', 'anticipatory planning', 'aging in place', 'client-centered practice', 'cost-effectiveness'],
    clinicalReasoning: 'This question requires analysis of universal design principles, disease trajectory, budget constraints, and client preferences. Candidates must balance current needs with future planning while respecting client choices.'
  },

  // PEDIATRICS - Handwriting/School Function
  {
    id: 'q11',
    scenario: `A 6-year-old first-grader is referred to school-based OT for handwriting difficulties. The teacher reports his letters are poorly formed, inconsistently sized, and he cannot stay on the lines. He holds his pencil in a fisted grasp and presses very hard, frequently breaking pencil tips. He avoids writing tasks and becomes frustrated quickly. Fine motor screening reveals difficulty with in-hand manipulation and bilateral coordination. Visual-motor integration testing places him at the 15th percentile. His reading and math skills are age-appropriate.`,
    question: 'Which intervention approach would be MOST appropriate for this student\'s handwriting difficulties?',
    options: [
      {
        id: 'a',
        text: 'Recommend he use a keyboard for all written work to bypass the handwriting difficulties and reduce frustration',
        isCorrect: false,
        rationale: 'While assistive technology has a role, completely bypassing handwriting at age 6 eliminates opportunities to develop these foundational skills. Handwriting instruction is still appropriate in first grade, and a keyboard doesn\'t address the underlying motor and visual-motor integration deficits.'
      },
      {
        id: 'b',
        text: 'Focus intervention on intensive visual-motor integration worksheets since this is the lowest score and likely the root cause of his difficulties',
        isCorrect: false,
        rationale: 'While VMI is a contributing factor, isolated worksheet practice doesn\'t generalize well to functional handwriting. The intervention should address multiple factors (grasp, pressure, motor control) and occur within meaningful writing contexts.'
      },
      {
        id: 'c',
        text: 'Address underlying motor components through hand strengthening and in-hand manipulation activities, provide pencil grip adaptation, use multi-sensory handwriting instruction with appropriate paper, and collaborate with teacher on classroom accommodations',
        isCorrect: true,
        rationale: 'This comprehensive approach addresses foundational skills (in-hand manipulation, hand strength), provides immediate support (grip adaptation), uses evidence-based handwriting instruction (multi-sensory approach), and ensures carryover (teacher collaboration). The hard pressing suggests he needs increased proprioceptive feedback, addressed through both strengthening and adaptive paper.'
      },
      {
        id: 'd',
        text: 'Provide the teacher with a handwriting curriculum to implement daily in the classroom, as handwriting instruction is an educational rather than therapeutic concern',
        isCorrect: false,
        rationale: 'While classroom-wide handwriting instruction is valuable, this student has identified motor and visual-motor deficits that require therapeutic intervention beyond typical curriculum. OT has a distinct role in addressing underlying skill deficits affecting handwriting performance.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['pediatrics'],
    difficulty: 3,
    concepts: ['handwriting intervention', 'visual-motor integration', 'grasp patterns', 'school-based OT', 'multi-sensory instruction', 'motor learning'],
    clinicalReasoning: 'Candidates must apply knowledge of handwriting development, motor learning principles, and school-based practice to select a comprehensive intervention. All options contain valid elements; the best answer addresses underlying deficits while supporting functional performance.'
  },

  // MENTAL HEALTH - Community Integration
  {
    id: 'q12',
    scenario: `A 32-year-old man with schizophrenia has been living in a supervised group home for 3 years. His symptoms are well-controlled with medication, and he has been stable for 18 months. He expresses strong interest in moving to his own apartment and returning to work. He previously worked in retail before his first hospitalization at age 24. He has basic cooking skills and manages his own medications but has never paid bills or managed a budget. His case manager supports the goal but wants OT assessment and intervention to prepare him for transition.`,
    question: 'Which intervention approach BEST supports this client\'s community integration goals?',
    options: [
      {
        id: 'a',
        text: 'Recommend he remain in the group home until he demonstrates mastery of all independent living skills in the current setting before attempting transition',
        isCorrect: false,
        rationale: 'This approach assumes skills must be learned before transition, but evidence supports that people learn best in the actual environment where skills will be used. Delaying transition indefinitely can perpetuate institutionalization and doesn\'t respect his self-determination.'
      },
      {
        id: 'b',
        text: 'Conduct an assessment of financial management and IADL skills, provide training in budgeting and bill-paying, arrange graduated community experiences including volunteer work in retail, and coordinate with the case manager for supported housing options',
        isCorrect: true,
        rationale: 'This approach assesses current skills, addresses the identified gap (financial management), builds on his previous work experience through graduated exposure, and coordinates with existing supports for appropriate housing. It balances skill building with forward movement toward his goals.'
      },
      {
        id: 'c',
        text: 'Focus intervention on stress management and symptom identification to prevent relapse during the transition, as maintaining stability is the priority',
        isCorrect: false,
        rationale: 'While relapse prevention is important, this client has been stable for 18 months on medication. Focusing only on illness management doesn\'t address his expressed goals of independent living and employment. Recovery-oriented practice emphasizes building a meaningful life beyond symptom management.'
      },
      {
        id: 'd',
        text: 'Refer to a supported employment program immediately so he can begin working while continuing to live in the group home to earn money for the transition',
        isCorrect: false,
        rationale: 'While supported employment is appropriate for this client, this option doesn\'t address the housing goal or the identified skill gaps in financial management. A comprehensive approach should address both employment and independent living goals concurrently.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['mental-health'],
    difficulty: 4,
    concepts: ['community integration', 'recovery model', 'supported housing', 'IADL training', 'schizophrenia', 'self-determination', 'transition planning'],
    clinicalReasoning: 'This question tests understanding of recovery-oriented practice, community integration principles, and balancing skill building with self-determination. Candidates must analyze the client\'s readiness and select an approach that supports his goals.'
  },

  // PHYSICAL DISABILITIES - Spinal Cord Injury
  {
    id: 'q13',
    scenario: `A 22-year-old college student sustained a complete C6 spinal cord injury in a diving accident 3 months ago. He has completed acute rehabilitation and is preparing for discharge to his parents' home while he continues outpatient therapy. He is independent in power wheelchair mobility, requires moderate assistance for transfers, and can feed himself with adaptive equipment. He was majoring in computer science before his injury and wants to return to school. He reports feeling depressed about his situation and uncertain about his future.`,
    question: 'Which discharge planning approach BEST addresses this client\'s comprehensive needs?',
    options: [
      {
        id: 'a',
        text: 'Focus on maximizing independence in self-care before discharge, as these are the foundational skills needed for returning to school',
        isCorrect: false,
        rationale: 'While self-care independence is important, it should not delay discharge or be the sole focus. With C6 SCI, some level of assistance with certain self-care tasks may always be needed. The focus should be on setting up supports that enable participation in his meaningful roles, including student.'
      },
      {
        id: 'b',
        text: 'Coordinate home modifications for accessibility, train family in safe transfer techniques, connect with peer mentorship through a SCI support organization, explore adaptive technology for computer use, and initiate contact with the university disability services office',
        isCorrect: true,
        rationale: 'This comprehensive approach addresses physical accessibility (home modifications), caregiver training (transfers), psychosocial support (peer mentorship for depression and uncertainty), vocational preparation (adaptive technology for his major), and educational access (disability services). It addresses his immediate needs and future goals.'
      },
      {
        id: 'c',
        text: 'Recommend he take a year off from school to focus on rehabilitation and adjustment before attempting to return to his previous roles',
        isCorrect: false,
        rationale: 'Delaying meaningful activities like education doesn\'t support recovery and may worsen depression. Research shows early return to productive activities supports psychological adjustment after SCI. The approach should facilitate engagement rather than delay it.'
      },
      {
        id: 'd',
        text: 'Refer to psychology for depression treatment before addressing school return, as mental health must be stabilized first',
        isCorrect: false,
        rationale: 'While psychology consultation may be appropriate, waiting to address school goals until depression is "treated" creates a false dichotomy. Engagement in meaningful occupation often supports mental health recovery. Both can be addressed concurrently.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['intervention', 'management', 'competency'],
    otSettings: ['physical-disabilities'],
    difficulty: 5,
    concepts: ['spinal cord injury', 'discharge planning', 'caregiver training', 'adaptive technology', 'vocational rehabilitation', 'peer support', 'adjustment to disability'],
    clinicalReasoning: 'This complex question requires evaluation of multiple discharge needs including physical, psychosocial, and vocational factors. Candidates must prioritize and select an approach that addresses immediate safety while supporting long-term goals.'
  },

  // GERIATRICS - Low Vision
  {
    id: 'q14',
    scenario: `A 78-year-old retired librarian with age-related macular degeneration (dry AMD) affecting both eyes is referred to OT for low vision rehabilitation. She has 20/200 central vision with intact peripheral vision. She lives alone in a two-story home and has been independent in all activities until recently. She reports she can no longer read books or her mail, has difficulty recognizing faces, and burned herself while cooking last week because she couldn't see the burner was on. She is motivated to remain independent and stay in her home.`,
    question: 'Which intervention approach is MOST appropriate for this client\'s low vision rehabilitation?',
    options: [
      {
        id: 'a',
        text: 'Recommend she move to assisted living where staff can help monitor her safety, as cooking accidents indicate she cannot live safely alone',
        isCorrect: false,
        rationale: 'One cooking accident does not indicate she cannot live safely alone. With appropriate environmental modifications, adaptive techniques, and low vision devices, many people with AMD maintain independence. This recommendation doesn\'t respect her goal of aging in place.'
      },
      {
        id: 'b',
        text: 'Train in eccentric viewing and scanning techniques to use peripheral vision, provide magnification devices for reading, implement kitchen safety modifications including high-contrast markings and tactile cues, and ensure adequate lighting throughout the home',
        isCorrect: true,
        rationale: 'This approach addresses her specific visual deficit (central loss) through eccentric viewing training, supports her valued occupation of reading through appropriate magnification, addresses the safety concern through environmental modification, and provides the foundational intervention of proper lighting. It supports her goal of maintaining independence at home.'
      },
      {
        id: 'c',
        text: 'Provide large-print books and audiobooks to replace regular reading, as magnification devices are difficult to learn to use at her age',
        isCorrect: false,
        rationale: 'This approach makes an ageist assumption about her learning capacity. Many older adults successfully learn to use magnification devices. Additionally, she was a librarian - reading is likely highly meaningful to her, and alternative formats may not fully replace this valued occupation.'
      },
      {
        id: 'd',
        text: 'Focus intervention on using remaining peripheral vision for mobility and safety, referring to a vision rehabilitation therapist for reading-related interventions',
        isCorrect: false,
        rationale: 'While OTs may collaborate with vision rehabilitation therapists, OTs are trained in low vision rehabilitation and can address the full range of concerns presented. Reading, cooking, and home safety are all within OT scope. Fragmented care through multiple referrals delays intervention.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'evaluation'],
    otSettings: ['geriatrics'],
    difficulty: 3,
    concepts: ['low vision rehabilitation', 'macular degeneration', 'eccentric viewing', 'environmental modification', 'magnification', 'aging in place'],
    clinicalReasoning: 'Candidates must apply knowledge of visual deficits in AMD and appropriate low vision interventions. The question tests understanding of how to address functional limitations while respecting client goals.'
  },

  // PEDIATRICS - Feeding/Oral Motor
  {
    id: 'q15',
    scenario: `An 18-month-old child born at 28 weeks gestation is referred to early intervention OT for feeding difficulties. He was on tube feeding for 4 months in the NICU. Currently, he takes purees from a spoon but gags and vomits when offered any textured foods. He drinks from a bottle but refuses sippy cups. He eats only 5 foods (all smooth consistency) and meals are described as "battles." His weight is at the 10th percentile and he has dropped from the 25th percentile over the past 6 months. Medical evaluation has ruled out structural abnormalities, reflux, and allergies.`,
    question: 'Which intervention approach is MOST appropriate for this child\'s feeding difficulties?',
    options: [
      {
        id: 'a',
        text: 'Implement a behavioral feeding approach with positive reinforcement for accepting new foods and ignoring food refusal behaviors',
        isCorrect: false,
        rationale: 'Pure behavioral approaches may not be appropriate when there are underlying sensory-motor factors. This child\'s history (prematurity, prolonged tube feeding) and presentation (gagging on textures) suggest sensory and oral-motor components that need to be addressed, not just behavioral modification.'
      },
      {
        id: 'b',
        text: 'Recommend a gastrostomy tube for supplemental nutrition while continuing oral feeding therapy to take pressure off mealtimes',
        isCorrect: false,
        rationale: 'While nutritional status is concerning, a G-tube is a significant medical intervention that should be considered only when less invasive approaches have been exhausted. The child is taking some oral nutrition, and intervention should first attempt to improve oral intake.'
      },
      {
        id: 'c',
        text: 'Provide oral-motor exercises and desensitization activities, implement a systematic texture progression using the SOS approach principles, coach parents in responsive feeding strategies that reduce mealtime stress, and coordinate with the pediatrician regarding nutritional supplementation',
        isCorrect: true,
        rationale: 'This approach addresses the likely sensory-motor contributions (oral hypersensitivity from NICU history) through desensitization and oral-motor work, uses evidence-based systematic desensitization (SOS approach), addresses the parent-child feeding dynamic through coaching, and ensures nutritional needs are monitored. It takes a comprehensive view of the feeding problem.'
      },
      {
        id: 'd',
        text: 'Encourage parents to continue offering new foods at each meal, as children need to be exposed to a food 10-15 times before accepting it',
        isCorrect: false,
        rationale: 'While repeated exposure is a principle of typical feeding development, this approach doesn\'t address the underlying sensory-motor issues or the negative mealtime dynamics. Repeated unsuccessful exposures to aversive textures may actually reinforce food refusal and increase stress.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['pediatrics'],
    difficulty: 4,
    concepts: ['pediatric feeding', 'oral motor development', 'NICU follow-up', 'sensory processing', 'SOS approach', 'parent coaching', 'food selectivity'],
    clinicalReasoning: 'This question tests understanding of complex feeding issues in children with medical histories, including the interplay of sensory, motor, behavioral, and relational factors. Candidates must select an approach that addresses underlying causes while supporting the parent-child relationship.'
  },

  // BURNS - Scar Management
  {
    id: 'q16',
    scenario: `A 28-year-old woman sustained deep partial thickness burns to bilateral hands and forearms from a kitchen grease fire 3 weeks ago. The wounds are now healed and she has been discharged from the burn unit to outpatient therapy. She presents with significant hypertrophic scarring beginning to develop, decreased ROM in bilateral wrists (45° flexion, 30° extension bilaterally), and hypersensitivity to light touch. She works as a hair stylist and is highly motivated to return to work.`,
    question: 'Which scar management protocol would be MOST effective for this patient at this stage of healing?',
    options: [
      {
        id: 'a',
        text: 'Wait until scars mature (12-18 months) before initiating aggressive scar management, as early intervention may disrupt healing',
        isCorrect: false,
        rationale: 'Scar management should begin as soon as wounds are healed, typically 2-4 weeks post-injury. Early intervention during the active remodeling phase (up to 2 years) is most effective for preventing and reducing hypertrophic scarring. Waiting allows collagen to become more organized and difficult to remodel.'
      },
      {
        id: 'b',
        text: 'Apply custom pressure garments 23 hours/day, use silicone gel sheeting under the garments, implement scar massage with sustained pressure, and fabricate resting hand splints in anti-deformity position for night use',
        isCorrect: true,
        rationale: 'This comprehensive protocol addresses all aspects of scar management: pressure garments (23 hrs/day for optimal effect), silicone (hydrates scar, reduces collagen production), massage (improves pliability), and splinting (maintains ROM while sleeping). Starting 2-3 weeks post-healing is optimal timing for preventing hypertrophic scarring.'
      },
      {
        id: 'c',
        text: 'Focus primarily on desensitization activities for the hypersensitivity using graded texture exposure, as the sensory issues will limit functional use',
        isCorrect: false,
        rationale: 'While desensitization is important, it should be one component of a comprehensive program. At 3 weeks post-healing with developing hypertrophic scarring and ROM limitations, scar management and mobility are higher priorities. The hypersensitivity will often improve as scarring is addressed.'
      },
      {
        id: 'd',
        text: 'Prescribe over-the-counter compression gloves and recommend cocoa butter massage, as medical-grade interventions are typically not covered by insurance',
        isCorrect: false,
        rationale: 'Over-the-counter compression provides inadequate pressure (medical-grade garments provide 25-30 mmHg) and cocoa butter has no evidence for scar management. Given the occupational importance for this patient and the critical window for intervention, advocating for appropriate medical-grade interventions is essential.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['burns', 'hand-therapy'],
    difficulty: 4,
    concepts: ['burn rehabilitation', 'hypertrophic scar', 'pressure therapy', 'silicone', 'scar massage', 'anti-deformity positioning'],
    clinicalReasoning: 'This question tests understanding of the scar maturation timeline and evidence-based scar management interventions. The timing (3 weeks post-healing) is critical for initiating comprehensive scar management during the active remodeling phase.'
  },

  // BURNS - Functional Contracture Prevention
  {
    id: 'q17',
    scenario: `A 42-year-old electrician sustained electrical burns to the right upper extremity 10 days ago, requiring fasciotomy and grafting to the anterior elbow. He is in the acute care unit with wounds still healing. The surgeon has requested OT for positioning and early intervention. The patient is fearful of moving the arm and reports significant pain with any motion. Edema is present throughout the right arm and hand.`,
    question: 'What is the PRIMARY positioning consideration for preventing contracture at the anterior elbow burn site?',
    options: [
      {
        id: 'a',
        text: 'Position the elbow in comfortable flexion (approximately 45°) to reduce tension on the graft and minimize pain',
        isCorrect: false,
        rationale: 'Positioning in flexion, while more comfortable, promotes elbow flexion contracture as scar tissue matures. Anterior burns naturally pull into flexion, so positioning must counteract this tendency. Comfort positioning leads to significant contracture development.'
      },
      {
        id: 'b',
        text: 'Position the elbow in full extension using a thermoplastic splint, with the forearm in supination, removing only for wound care and supervised ROM',
        isCorrect: true,
        rationale: 'The anti-deformity position for anterior elbow burns is full extension with supination. This counteracts the natural pull of scar contracture. Extension splinting should be maintained 23 hours/day initially, with removal only for wound care and gentle ROM. Early splinting is critical while wounds are healing.'
      },
      {
        id: 'c',
        text: 'Alternate between flexion and extension positioning every 4 hours to prevent stiffness while allowing periods of comfort',
        isCorrect: false,
        rationale: 'Alternating positions does not provide adequate time in the anti-deformity position to counteract scar contracture forces. Consistent positioning in extension is necessary during the early healing phase. ROM can be addressed during designated therapy sessions.'
      },
      {
        id: 'd',
        text: 'Allow the patient to self-position for comfort until graft take is confirmed, then begin aggressive positioning',
        isCorrect: false,
        rationale: 'Waiting delays critical intervention. Patients naturally position in flexion for comfort, and even 10 days of this positioning can initiate contracture development. Positioning should begin immediately with surgeon collaboration regarding graft precautions.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['burns', 'acute-care'],
    difficulty: 3,
    concepts: ['burn positioning', 'anti-deformity position', 'contracture prevention', 'electrical burns', 'splinting protocols'],
    clinicalReasoning: 'Understanding anti-deformity positioning principles is fundamental to burn rehabilitation. The anterior elbow requires extension to counteract the flexion pull of scar contracture.'
  },

  // EDEMA - Chronic Venous Insufficiency
  {
    id: 'q18',
    scenario: `A 68-year-old woman with a 15-year history of chronic venous insufficiency (CVI) presents to home health OT following a recent hospitalization for cellulitis in the left lower extremity. She has bilateral lower extremity edema (left greater than right), with the left calf measuring 4 cm larger than baseline. She has brownish discoloration of the skin (hemosiderin staining) and early venous stasis changes. She is diabetic and lives alone in a second-floor apartment with no elevator.`,
    question: 'Which edema management approach is MOST appropriate for this patient?',
    options: [
      {
        id: 'a',
        text: 'Apply high-compression bandaging (40 mmHg) immediately to achieve rapid reduction of the edema before transitioning to garments',
        isCorrect: false,
        rationale: 'High compression (40 mmHg) requires adequate arterial circulation. Given her diabetes and age, ankle-brachial index (ABI) testing should be completed before applying high compression. Starting with high compression without arterial assessment risks tissue ischemia.'
      },
      {
        id: 'b',
        text: 'Verify adequate arterial circulation through ABI testing, then initiate graduated compression starting with lower pressure, combined with elevation strategies, skin care education, and safe mobility training given her living situation',
        isCorrect: true,
        rationale: 'This approach addresses safety first (ABI to rule out arterial compromise), uses appropriate graduated compression, incorporates multi-component management (elevation, skin care), and considers her functional context (second-floor apartment, living alone, recent infection). Diabetic patients require careful arterial assessment before compression.'
      },
      {
        id: 'c',
        text: 'Focus on diuretic management through her physician, as CVI-related edema is a medical rather than therapeutic concern',
        isCorrect: false,
        rationale: 'Diuretics are not first-line treatment for CVI edema and can cause electrolyte imbalances. Compression therapy and lifestyle modifications are the primary treatments for CVI. OT plays a significant role in edema management, skin care education, and functional adaptation.'
      },
      {
        id: 'd',
        text: 'Recommend she relocate to a first-floor apartment to eliminate stair climbing, as this will reduce venous pressure and prevent edema worsening',
        isCorrect: false,
        rationale: 'While environmental factors are relevant, recommending relocation is not appropriate as a primary intervention. Actually, calf muscle pump activation from walking (including stairs) helps venous return. The focus should be on compression, skin care, and safe mobility rather than activity restriction.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'evaluation'],
    otSettings: ['lymphedema', 'home-health', 'geriatrics'],
    difficulty: 4,
    concepts: ['chronic venous insufficiency', 'compression therapy', 'arterial screening', 'diabetic precautions', 'skin integrity', 'home health'],
    clinicalReasoning: 'This question integrates knowledge of edema pathophysiology, contraindications for compression, and home health considerations. The diabetic history requires arterial assessment before compression application.'
  },

  // ERGONOMICS - Remote Work
  {
    id: 'q19',
    scenario: `A 34-year-old accountant contacts a telehealth OT service reporting bilateral wrist pain and numbness in the thumb, index, and middle fingers that has worsened over the past 6 months since transitioning to full-time remote work. She works 50+ hours per week from a home office setup consisting of a dining room chair and table with a laptop. She admits to working from her couch in the evenings. Phalen's test and Tinel's sign are positive bilaterally via video assessment.`,
    question: 'Which telehealth intervention approach would be MOST effective for this patient?',
    options: [
      {
        id: 'a',
        text: 'Refer to a physician for nerve conduction studies and possible carpal tunnel release surgery, as the positive clinical tests indicate advanced CTS requiring medical intervention',
        isCorrect: false,
        rationale: 'While referral for NCS may be appropriate, conservative management should be attempted first, especially since the symptoms correlate clearly with poor ergonomic setup. Positive Phalen\'s and Tinel\'s indicate CTS but don\'t necessarily indicate surgical severity. Addressing contributing factors is appropriate first-line treatment.'
      },
      {
        id: 'b',
        text: 'Conduct a virtual home office assessment, provide specific recommendations for workstation setup including external keyboard/mouse and monitor, prescribe wrist splints for nighttime use, teach nerve gliding exercises, and establish work-rest schedules',
        isCorrect: true,
        rationale: 'This comprehensive approach addresses the primary contributing factors (poor laptop-based ergonomics), provides symptom management (night splints reduce nighttime wrist flexion, a major CTS contributor), teaches self-management (nerve glides), and addresses behavioral factors (work-rest balance). Virtual assessment can effectively evaluate home office setup.'
      },
      {
        id: 'c',
        text: 'Recommend she return to office-based work where proper ergonomic workstations are available, as home environments cannot be adequately modified',
        isCorrect: false,
        rationale: 'This doesn\'t address the patient\'s current work situation and assumes home environments can\'t be ergonomically optimized. Many people can create effective home workstations with proper guidance. The OT role is to enable participation in chosen work arrangements.'
      },
      {
        id: 'd',
        text: 'Provide general ergonomic handouts about workstation setup and suggest she purchase an ergonomic chair when budget allows',
        isCorrect: false,
        rationale: 'Generic handouts without individualized assessment and the laptop-specific issues (wrist extension, neck flexion) don\'t address this patient\'s specific contributing factors. The laptop itself is a significant issue regardless of chair quality. A comprehensive approach addressing all factors is needed.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'evaluation'],
    otSettings: ['ergonomics', 'wellness', 'hand-therapy'],
    difficulty: 3,
    concepts: ['carpal tunnel syndrome', 'ergonomics', 'telehealth', 'remote work', 'conservative management', 'night splinting', 'nerve gliding'],
    clinicalReasoning: 'This question tests knowledge of CTS contributing factors, ergonomic assessment, and conservative management approaches. The remote work context is increasingly relevant to current OT practice.'
  },

  // UNIVERSAL DESIGN - Aging in Place
  {
    id: 'q20',
    scenario: `A 70-year-old couple is building a new single-story home and has consulted an OT for universal design recommendations. Both are currently healthy and active but want to plan for aging in place. The husband has early-stage Parkinson's disease with mild tremor and occasional balance difficulties. The wife has osteoarthritis in her hands. They enjoy cooking together and hosting family gatherings. Their budget allows for approximately $15,000 in accessibility-related upgrades.`,
    question: 'Which universal design recommendations would provide the BEST value for this couple\'s current and anticipated needs?',
    options: [
      {
        id: 'a',
        text: 'Install a wheelchair-accessible roll-in shower, lower all countertops to wheelchair height, and widen all doorways to 36 inches',
        isCorrect: false,
        rationale: 'This approach assumes future wheelchair use that may not occur and creates a medicalized environment. Lowering all countertops would actually be problematic for current standing use and cooking activities. Universal design should accommodate a range of abilities, not assume worst-case scenarios.'
      },
      {
        id: 'b',
        text: 'Focus budget on medical alert system, bathroom grab bars, and ramp to the front entrance to address safety concerns',
        isCorrect: false,
        rationale: 'While safety features are important, this approach is reactive rather than truly universal design. The couple is currently active, and this approach doesn\'t address their valued occupations (cooking, entertaining) or create an environment that works well at all stages of aging.'
      },
      {
        id: 'c',
        text: 'Install zero-threshold entrances, curbless shower with blocking for future grab bars, varied-height kitchen work surfaces, lever handles throughout, rocker light switches, and task lighting in kitchen—features that benefit everyone while accommodating future needs',
        isCorrect: true,
        rationale: 'This approach embodies universal design principles: features work well for everyone now (zero-threshold is easier for groceries, varied heights accommodate different tasks, lever handles help with arthritic hands) while anticipating future needs (curbless shower, grab bar blocking). It supports their valued activities (cooking with varied heights, entertaining with accessible entrances).'
      },
      {
        id: 'd',
        text: 'Recommend waiting to make modifications until specific needs arise, as the couple is currently healthy and modifications may not be needed',
        isCorrect: false,
        rationale: 'This misses the opportunity for cost-effective modifications during construction. Retrofitting is significantly more expensive than building-in features. Given the husband\'s Parkinson\'s diagnosis and both partners\' aging process, anticipatory planning is appropriate and cost-effective.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['home-health', 'geriatrics', 'neuro-rehab'],
    difficulty: 4,
    concepts: ['universal design', 'aging in place', 'Parkinson\'s disease', 'arthritis', 'anticipatory planning', 'home modification'],
    clinicalReasoning: 'This question requires evaluation of universal design principles, anticipatory planning, and client-centered practice. Candidates must balance current function with future needs while respecting the couple\'s preferences and valued activities.'
  },

  // NEURO - Traumatic Brain Injury
  {
    id: 'q21',
    scenario: `A 19-year-old college student is 6 weeks post-severe TBI from a motor vehicle accident. He is at Rancho Level VI (confused-appropriate) and has been transferred to acute rehabilitation. He demonstrates significant executive function deficits, impulsivity, and decreased safety awareness. He insists he is ready to return to college and becomes agitated when staff suggest otherwise. His parents are anxious and want to know when he can drive again.`,
    question: 'Which intervention approach is MOST appropriate for addressing this patient\'s cognitive and behavioral presentation?',
    options: [
      {
        id: 'a',
        text: 'Focus on reorientation strategies and memory aids to help him understand his deficits and accept the need for continued rehabilitation',
        isCorrect: false,
        rationale: 'At Rancho VI, the patient can retain new information but lacks insight into deficits. Trying to convince him of his limitations often increases agitation. Insight typically develops through experience rather than explanation. Confrontational approaches are counterproductive at this stage.'
      },
      {
        id: 'b',
        text: 'Structure the environment to reduce demands and prevent failures, use errorless learning techniques, establish consistent routines, provide concrete feedback during functional tasks, and educate family about Rancho levels and recovery trajectory',
        isCorrect: true,
        rationale: 'This approach addresses his current cognitive level appropriately: structured environment reduces confusion, errorless learning prevents frustration, routines support procedural memory, and concrete feedback in context helps develop insight through experience. Family education helps manage expectations about driving and return to school.'
      },
      {
        id: 'c',
        text: 'Support his autonomy by allowing him to attempt college coursework online, as engagement in meaningful activity may promote recovery',
        isCorrect: false,
        rationale: 'While meaningful activity is important, he lacks the executive function skills to manage college coursework at Rancho VI. Failure at something important to his identity could damage self-esteem and increase agitation. Activities should be graded to ensure success while building skills.'
      },
      {
        id: 'd',
        text: 'Recommend a comprehensive driving evaluation to address the parents\' concerns and demonstrate to the patient why driving is not currently safe',
        isCorrect: false,
        rationale: 'At 6 weeks post-severe TBI and Rancho VI, a driving evaluation is premature and potentially dangerous. Most patients require 6-12 months post-injury and Rancho VIII before driving evaluation. Using a driving eval to demonstrate deficits is not an appropriate use of the assessment.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['neuro-rehab', 'acute-care'],
    difficulty: 4,
    concepts: ['traumatic brain injury', 'Rancho Los Amigos levels', 'executive function', 'impaired insight', 'family education', 'errorless learning'],
    clinicalReasoning: 'This question tests understanding of TBI recovery stages and appropriate interventions for each level. The Rancho VI level presentation (confused-appropriate with impaired insight) requires specific approaches that work with rather than against the patient\'s cognitive state.'
  },

  // PARKINSON'S DISEASE - Home Safety
  {
    id: 'q22',
    scenario: `A 72-year-old retired engineer with Parkinson's disease (Hoehn & Yahr Stage 3) is referred for home health OT after a fall in his bathroom. He exhibits bradykinesia, moderate rigidity, and episodes of freezing, particularly when approaching doorways or changing direction. He lives with his wife in a two-story home. He is motivated to maintain independence but admits to using furniture for support and having near-falls daily. His wife has begun helping him dress, which frustrates him.`,
    question: 'Which combination of interventions would MOST effectively address this patient\'s mobility and ADL concerns?',
    options: [
      {
        id: 'a',
        text: 'Recommend a wheelchair for household mobility to prevent falls and preserve energy, as Hoehn & Yahr Stage 3 indicates significant mobility impairment',
        isCorrect: false,
        rationale: 'Stage 3 PD involves postural instability but patients remain ambulatory. A wheelchair would promote deconditioning and is not appropriate for this stage. Strategies to improve walking safety and address freezing are more appropriate than eliminating ambulation.'
      },
      {
        id: 'b',
        text: 'Install bathroom grab bars and recommend his wife continue assisting with dressing for safety, focusing OT on fall risk education',
        isCorrect: false,
        rationale: 'While grab bars are helpful, this approach doesn\'t address the specific PD-related challenges (freezing, bradykinesia) or his desire for independence. Having his wife continue dressing him doesn\'t address the underlying skills or preserve his independence and identity.'
      },
      {
        id: 'c',
        text: 'Teach external cueing strategies for freezing episodes (visual floor tape, rhythmic auditory cues), train in specific techniques for ADL tasks that accommodate bradykinesia, modify bathroom and doorway environments, and educate wife in appropriate assistance that supports rather than replaces his participation',
        isCorrect: true,
        rationale: 'This approach addresses PD-specific challenges: cueing strategies (visual lines, auditory rhythm) are evidence-based for freezing, task-specific training addresses bradykinesia, environmental modification reduces fall risk, and caregiver training preserves his independence while ensuring safety. This comprehensive approach addresses all identified concerns.'
      },
      {
        id: 'd',
        text: 'Focus on strengthening and balance exercises to address the underlying impairments causing his mobility difficulties',
        isCorrect: false,
        rationale: 'While exercise is beneficial in PD, the primary issues (freezing, bradykinesia) are neurological and not adequately addressed through strengthening alone. PD requires compensatory strategies targeting the specific movement disorders, not just general conditioning.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'evaluation'],
    otSettings: ['home-health', 'neuro-rehab', 'geriatrics'],
    difficulty: 4,
    concepts: ['Parkinson\'s disease', 'freezing of gait', 'external cueing', 'Hoehn & Yahr staging', 'caregiver training', 'ADL modifications'],
    clinicalReasoning: 'This question tests knowledge of PD-specific interventions, particularly external cueing strategies for freezing and understanding of disease staging. The best answer addresses the multifactorial nature of PD disability.'
  },

  // ALS - Adaptive Equipment
  {
    id: 'q23',
    scenario: `A 56-year-old woman with ALS diagnosed 18 months ago presents for outpatient OT. She has progressive upper and lower extremity weakness with current manual muscle testing showing bilateral shoulder flexion 3/5, elbow flexion 3+/5, grip 2+/5. She has mild bulbar symptoms with slight speech changes. She uses a standard cane for community mobility but has fallen twice in the past month. She continues to work part-time from home as a writer and is concerned about her ability to type. She has not yet discussed end-of-life issues with her family.`,
    question: 'Which intervention approach BEST addresses this patient\'s current needs while anticipating disease progression?',
    options: [
      {
        id: 'a',
        text: 'Focus intervention on strengthening exercises to maintain function as long as possible, as muscle weakness is the primary limiting factor in ALS',
        isCorrect: false,
        rationale: 'Resistive exercise can accelerate muscle fatigue and is generally avoided in ALS. The focus should be on energy conservation, adaptive equipment, and anticipatory planning rather than strengthening. ALS requires working with the disease progression, not against it.'
      },
      {
        id: 'b',
        text: 'Provide adaptive typing solutions (voice recognition software, adapted keyboard) now, coordinate wheeled mobility evaluation, introduce energy conservation strategies, and facilitate discussion about her values and goals to guide future planning',
        isCorrect: true,
        rationale: 'This approach addresses immediate concerns (typing for work, fall risk) while anticipating progression. Introducing voice recognition now allows her to learn while speech is intact. Wheeled mobility addresses safety. Energy conservation preserves function. Discussing values (not end-of-life specifically, but goals) supports client-centered anticipatory planning.'
      },
      {
        id: 'c',
        text: 'Recommend she stop working to conserve energy, as continued work will accelerate muscle fatigue and disease progression',
        isCorrect: false,
        rationale: 'Writing is a meaningful occupation for her identity and likely psychological wellbeing. The goal is to support continued engagement through adaptation, not to recommend cessation of meaningful activities. There is no evidence that mental activity accelerates ALS.'
      },
      {
        id: 'd',
        text: 'Wait until she requests specific equipment to avoid overwhelming her, respecting her right to determine when she is ready for adaptive devices',
        isCorrect: false,
        rationale: 'In ALS, anticipatory planning is essential. Waiting until crisis points means she may lose the ability to learn new technology (e.g., voice recognition while speech is still clear) or be without necessary equipment. Proactive planning while respecting her choices is appropriate.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['physical-disabilities', 'neuro-rehab'],
    difficulty: 5,
    concepts: ['ALS', 'anticipatory planning', 'adaptive technology', 'energy conservation', 'progressive neurological conditions', 'client-centered practice'],
    clinicalReasoning: 'This question tests understanding of progressive neurological disease management, particularly the need for anticipatory planning while respecting client autonomy. The timing of interventions in ALS is critical.'
  },

  // ORTHOPEDICS - Total Hip Replacement
  {
    id: 'q24',
    scenario: `A 67-year-old woman is post-operative day 2 following a posterior approach total hip arthroplasty. She is medically stable and weight-bearing as tolerated with a walker. The surgeon has ordered OT for ADL training with hip precautions. She lives alone in a single-story home and drove herself to all pre-operative appointments. She is eager to return home and resume her normal activities, including caring for her garden.`,
    question: 'Which ADL training approach is MOST appropriate for this patient?',
    options: [
      {
        id: 'a',
        text: 'Train in lower body dressing, bathing, and toileting using adaptive equipment, emphasize hip precautions (no flexion >90°, no adduction past midline, no internal rotation), and provide written and illustrated instructions for reference at home',
        isCorrect: true,
        rationale: 'This approach addresses the key ADL challenges post-THR (lower body dressing, bathing, toileting), teaches proper use of required adaptive equipment (reacher, sock aid, long-handled shoe horn), and reinforces critical precautions. Written instructions support carryover and independence. Posterior approach precautions are correctly identified.'
      },
      {
        id: 'b',
        text: 'Focus training on upper body dressing and grooming, as these are the safest activities initially and she can resume lower body care when the hip has healed',
        isCorrect: false,
        rationale: 'Upper body ADLs typically don\'t require precaution modification. The OT\'s primary role is enabling safe independence in challenging ADLs (lower body dressing, bathing, toileting) using adaptive equipment and techniques. Avoiding these activities delays independence and doesn\'t address her goal of returning home.'
      },
      {
        id: 'c',
        text: 'Recommend she stay with family or in a rehabilitation facility until precautions are lifted in 6-12 weeks, as living alone makes compliance unsafe',
        isCorrect: false,
        rationale: 'Living alone doesn\'t preclude safe discharge with proper training and equipment. Many patients successfully return home alone after THR. The OT role is to prepare her for safe independence through training, not to recommend alternative living arrangements based on assumptions.'
      },
      {
        id: 'd',
        text: 'Provide adaptive equipment and a brief demonstration, as she is motivated and will learn through practice at home',
        isCorrect: false,
        rationale: 'Brief demonstration is insufficient for safe use of adaptive equipment while maintaining precautions. Patients need hands-on practice with feedback to develop safe techniques before discharge. Simply providing equipment without thorough training increases fall and dislocation risk.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['orthopedics', 'acute-care'],
    difficulty: 3,
    concepts: ['total hip arthroplasty', 'hip precautions', 'adaptive equipment', 'posterior approach', 'ADL training', 'patient education'],
    clinicalReasoning: 'This question tests knowledge of hip precautions following posterior approach THR and the OT role in ADL training. The key is understanding which ADLs require modification and equipment.'
  },

  // DRIVING REHABILITATION
  {
    id: 'q25',
    scenario: `A 48-year-old sales executive who sustained a mild stroke 3 months ago is referred for a driving evaluation. He has returned to work (taking taxis) and is eager to resume driving for his job. He has residual left visual field cut (left homonymous hemianopia), mild left-sided inattention on paper-pencil tests, but good motor recovery. He reports no difficulty with IADLs at home and states he has "compensated well." His wife expresses concern about his safety awareness.`,
    question: 'Which is the MOST appropriate next step in the driving evaluation process?',
    options: [
      {
        id: 'a',
        text: 'Clear him for driving since he has good motor recovery and is functioning well in IADLs, which indicates adequate cognitive recovery',
        isCorrect: false,
        rationale: 'IADL performance does not predict driving safety, as driving places much higher demands on visual scanning, divided attention, and rapid decision-making. The visual field cut and left inattention are significant safety concerns that require comprehensive evaluation before any driving clearance.'
      },
      {
        id: 'b',
        text: 'Recommend permanent driving cessation due to the visual field deficit, as homonymous hemianopia is an absolute contraindication to driving',
        isCorrect: false,
        rationale: 'Hemianopia is not an absolute contraindication in all jurisdictions, and many people with hemianopia can learn to compensate with increased scanning. A comprehensive evaluation including behind-the-wheel assessment with a driver rehabilitation specialist is needed before making recommendations.'
      },
      {
        id: 'c',
        text: 'Complete a comprehensive clinical evaluation including visual scanning efficiency, useful field of view testing, and cognitive assessments targeting attention and executive function, then refer to a certified driver rehabilitation specialist for behind-the-wheel evaluation',
        isCorrect: true,
        rationale: 'This systematic approach gathers clinical data on specific skills required for driving (visual scanning, attention, executive function), then uses behind-the-wheel evaluation with a CDRS for real-world driving assessment. The clinical findings inform the on-road evaluation focus areas. Both components are necessary for a complete evaluation.'
      },
      {
        id: 'd',
        text: 'Have him complete a driving simulator evaluation to objectively measure his driving abilities in a controlled environment',
        isCorrect: false,
        rationale: 'While simulator evaluations can provide useful data, they don\'t replace behind-the-wheel evaluation and aren\'t sufficient as the sole assessment method. Simulators also have limitations in assessing real-world scanning and don\'t evaluate ability to compensate for deficits in actual traffic conditions.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['evaluation', 'management'],
    otSettings: ['driving-rehab', 'neuro-rehab'],
    difficulty: 4,
    concepts: ['driver rehabilitation', 'visual field deficits', 'hemispatial neglect', 'stroke', 'CDRS referral', 'comprehensive evaluation'],
    clinicalReasoning: 'This question tests understanding of driving rehabilitation evaluation, particularly the limitations of clinical measures and the need for behind-the-wheel assessment. The visual field cut and inattention require thorough evaluation before driving recommendations.'
  },

  // WHEELCHAIR SEATING
  {
    id: 'q26',
    scenario: `A 32-year-old man with T10 complete SCI who has been using a manual wheelchair for 2 years presents with complaints of low back pain and reports he "slides out" of his wheelchair throughout the day. Observation reveals a posterior pelvic tilt with kyphotic posture and sacral sitting. He has a sling seat and sling back on his current chair. He works full-time as an accountant and propels independently, including on outdoor surfaces. He denies pressure injury history.`,
    question: 'Which seating intervention would MOST effectively address his postural and functional concerns?',
    options: [
      {
        id: 'a',
        text: 'Add a seatbelt and anti-thrust cushion to prevent sliding and hold pelvis in position',
        isCorrect: false,
        rationale: 'Restraints and anti-thrust cushions address symptoms but not causes. The sling seat and back are the primary contributors to his posterior pelvic tilt. Additionally, seatbelts are generally not recommended for positioning (only safety) and don\'t address the underlying postural issues.'
      },
      {
        id: 'b',
        text: 'Replace sling seat with a solid seat insert and pressure-redistributing cushion, add a solid back with appropriate lumbar support, and ensure proper seat-to-back angle that promotes anterior pelvic tilt',
        isCorrect: true,
        rationale: 'This addresses the root causes: solid seat eliminates hammock effect of sling seat, pressure cushion maintains skin integrity, solid back with lumbar support promotes neutral spine alignment, and proper seat-to-back angle (typically 95-100°) facilitates anterior pelvic positioning. This comprehensive approach addresses posture while maintaining function.'
      },
      {
        id: 'c',
        text: 'Recommend a power wheelchair with tilt-in-space feature to allow pressure relief and position changes throughout the day',
        isCorrect: false,
        rationale: 'Transitioning to power wheelchair is not appropriate for this active, independent manual wheelchair user. He propels on outdoor surfaces and works full-time—power would significantly decrease his independence and activity level. His seating surface issues can be addressed within manual wheelchair options.'
      },
      {
        id: 'd',
        text: 'Focus on strengthening his core muscles through therapeutic exercise, as weak abdominals are likely contributing to his postural difficulties',
        isCorrect: false,
        rationale: 'With T10 complete SCI, he has no voluntary abdominal function below the injury level. While trunk strengthening is valuable, it cannot address the primary issue of the hammock effect from sling seating. Equipment modification is necessary for proper positioning.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'evaluation'],
    otSettings: ['physical-disabilities', 'orthopedics'],
    difficulty: 4,
    concepts: ['wheelchair seating', 'spinal cord injury', 'pelvic positioning', 'pressure management', 'sling seat effects', 'postural support'],
    clinicalReasoning: 'This question tests understanding of wheelchair seating principles and the effects of different seating surfaces on posture. The posterior pelvic tilt pattern is commonly caused by sling seating, and the solution requires addressing the seating system rather than adding restraints.'
  },

  // PEDIATRICS - Cerebral Palsy
  {
    id: 'q27',
    scenario: `A 4-year-old girl with spastic diplegic cerebral palsy (GMFCS Level III) attends preschool and receives OT services. She ambulates short distances with a posterior walker but uses a wheelchair for longer distances. She has difficulty with fine motor tasks due to mild upper extremity involvement and requires setup assistance for self-feeding. Her IEP team is meeting to discuss goals for the upcoming year. Her parents want her to "walk without the walker."`,
    question: 'Which goal-setting approach BEST reflects collaborative, family-centered, and evidence-based practice?',
    options: [
      {
        id: 'a',
        text: 'Defer to the parents\' priority and write an IEP goal for independent ambulation without assistive device, as family-centered practice requires respecting parent goals',
        isCorrect: false,
        rationale: 'Family-centered practice includes providing accurate information to inform decision-making. With GMFCS Level III, independent ambulation without a device is unlikely and focusing intensive efforts on this goal may take time from achievable functional gains. Collaboration includes honest discussion about prognosis.'
      },
      {
        id: 'b',
        text: 'Explain to parents that GMFCS Level III indicates she will likely always need mobility aids, so resources should focus on wheelchair skills and academics rather than ambulation',
        isCorrect: false,
        rationale: 'While accurate about GMFCS prognosis, this dismisses the parents\' priorities without exploring what underlies their goals. Abruptly redirecting focus doesn\'t honor their perspective or engage in collaborative goal-setting.'
      },
      {
        id: 'c',
        text: 'Explore with parents what independent walking would mean for their daughter\'s participation, share information about GMFCS trajectories, collaboratively identify functional priorities that align with their values (e.g., playground mobility, peer participation), and develop goals that address these priorities',
        isCorrect: true,
        rationale: 'This approach honors family-centered practice through exploring values behind the stated goal, provides education to inform decisions, and collaboratively develops meaningful goals. The parents\' desire for "walking" likely reflects desires for participation and inclusion that can be addressed through alternative means while being realistic about prognosis.'
      },
      {
        id: 'd',
        text: 'Focus IEP goals exclusively on fine motor and self-feeding skills since these are areas of documented need and are within typical OT scope in school settings',
        isCorrect: false,
        rationale: 'While fine motor and feeding are appropriate areas, excluding mobility from discussion doesn\'t engage with parent priorities. School-based OT can address mobility as it relates to educational participation. Goals should emerge from collaborative discussion, not be predetermined by discipline scope.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['management', 'competency'],
    otSettings: ['pediatrics'],
    difficulty: 4,
    concepts: ['cerebral palsy', 'GMFCS', 'family-centered practice', 'IEP goals', 'collaborative goal-setting', 'prognosis education'],
    clinicalReasoning: 'This question tests the ability to balance family-centered practice with evidence-based prognostic information. The candidate must navigate parent hopes while being honest about realistic outcomes and finding meaningful goals that honor family values.'
  },

  // MENTAL HEALTH - Substance Use Disorder
  {
    id: 'q28',
    scenario: `A 35-year-old man with opioid use disorder is in a 28-day residential treatment program. He has been sober for 3 weeks and is preparing for discharge. Before his addiction, he worked as an electrician but lost his job and his apartment. He will be discharged to a sober living facility. He expresses both motivation to stay sober and fear of relapse. He has no current social supports outside of the treatment program. The treatment team requests OT involvement in discharge planning.`,
    question: 'Which intervention approach BEST supports this client\'s recovery and transition to community living?',
    options: [
      {
        id: 'a',
        text: 'Focus on vocational counseling to help him return to work as an electrician as quickly as possible, since employment is a protective factor against relapse',
        isCorrect: false,
        rationale: 'While employment is a protective factor, rushing back to work without addressing other recovery supports may be overwhelming. He needs to establish daily structure, sober social connections, and coping strategies first. Additionally, his previous work environment may have triggers that need to be addressed.'
      },
      {
        id: 'b',
        text: 'Develop a structured daily routine that includes recovery meetings, productive activities, and healthy habits; identify high-risk situations and coping strategies; build sober leisure interests; and connect with vocational rehabilitation for supported employment',
        isCorrect: true,
        rationale: 'This comprehensive approach addresses multiple recovery factors: daily structure (critical for early recovery), recovery community (meetings, peer support), relapse prevention (identifying triggers, coping strategies), and meaningful occupation (leisure, eventual employment). The graduated approach to employment through vocational rehabilitation provides support for this transition.'
      },
      {
        id: 'c',
        text: 'Recommend extended inpatient treatment since his lack of social supports and housing instability are significant risk factors for relapse',
        isCorrect: false,
        rationale: 'While risk factors are present, the appropriate response is to develop a discharge plan that addresses these factors, not to extend inpatient stay indefinitely. He is going to sober living, which provides structured housing, and OT can help develop other supports for community transition.'
      },
      {
        id: 'd',
        text: 'Provide education about the neurological effects of opioids and the importance of medication-assisted treatment compliance',
        isCorrect: false,
        rationale: 'While psychoeducation may have a role, this is primarily a medical/nursing intervention. OT\'s distinct contribution is in enabling occupational engagement that supports recovery—establishing routines, meaningful activities, and skills for community living.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['mental-health'],
    difficulty: 4,
    concepts: ['substance use disorder', 'recovery', 'relapse prevention', 'daily structure', 'sober leisure', 'vocational rehabilitation', 'discharge planning'],
    clinicalReasoning: 'This question tests understanding of OT\'s role in substance use recovery, particularly the importance of occupation-based approaches including daily routine, meaningful activity, and graduated return to productive roles.'
  },

  // HOME MODIFICATIONS - Chronic Conditions
  {
    id: 'q29',
    scenario: `A 58-year-old woman with long-standing rheumatoid arthritis and recent bilateral knee replacements is being discharged from acute rehabilitation to her two-story colonial home. She lives with her husband who works full-time. The master bedroom and full bathroom are on the second floor. She can climb 12 stairs with bilateral handrails and supervision but fatigues easily and has significant morning stiffness lasting 1-2 hours. Her surgeon expects full recovery but advises 6-8 weeks of limited stair climbing.`,
    question: 'Which discharge planning approach MOST appropriately balances safety, function, and practical constraints?',
    options: [
      {
        id: 'a',
        text: 'Recommend temporary first-floor living with a commode and sponge bathing until she can safely navigate stairs, avoiding the second floor entirely for 8 weeks',
        isCorrect: false,
        rationale: 'This approach is overly restrictive and doesn\'t account for her ability to climb stairs with supervision. It also significantly impacts dignity (commode, sponge bathing) when other options exist. The goal should be to enable safe function, not maximum restriction.'
      },
      {
        id: 'b',
        text: 'Arrange for limited stair trips (1-2 times daily) timed to avoid morning stiffness, install temporary first-floor sleeping arrangements as backup, provide tub transfer bench for safe bathing, and arrange husband\'s schedule to be present for stair supervision during the first weeks',
        isCorrect: true,
        rationale: 'This practical approach works within her abilities while minimizing risk. Timing stair trips to avoid morning stiffness (when she is weakest) is RA-specific; first-floor backup provides options; tub bench enables safe bathing; husband supervision addresses the "supervision required" finding. This balances safety with dignity and practical constraints.'
      },
      {
        id: 'c',
        text: 'Recommend installation of a stair lift to eliminate fall risk on stairs during the recovery period',
        isCorrect: false,
        rationale: 'A stair lift is a significant expense for a temporary situation (6-8 week recovery). She can safely climb stairs with supervision and will likely return to independent stair climbing. Equipment recommendations should be proportionate to the expected duration of need.'
      },
      {
        id: 'd',
        text: 'Extend rehabilitation stay until she can independently manage stairs safely without supervision',
        isCorrect: false,
        rationale: 'Extended inpatient stay for supervision needs is not appropriate when safe home discharge with caregiver support is possible. The husband can provide supervision, and the goal of rehabilitation is to prepare for home, not to achieve complete independence before discharge.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['orthopedics', 'home-health'],
    difficulty: 3,
    concepts: ['discharge planning', 'rheumatoid arthritis', 'knee replacement', 'home modification', 'caregiver coordination', 'temporary adaptations'],
    clinicalReasoning: 'This question requires analysis of multiple factors: surgical precautions, RA-related considerations (morning stiffness), current function (stairs with supervision), home environment, and caregiver availability. The best answer creates a practical plan addressing all factors.'
  },

  // HAND THERAPY - Tendon Repair
  {
    id: 'q30',
    scenario: `A 30-year-old chef sustained a laceration to the volar aspect of his dominant index finger 4 weeks ago, resulting in zone II flexor tendon repair (both FDS and FDP). He was placed in a dorsal blocking splint and referred to hand therapy. He has been compliant with his home program and the surgeon has now cleared him for progression. Current ROM shows: DIP active flexion 25°, PIP active flexion 50°, MP active flexion 70°. There is mild resistance to passive extension and the repair site is adhered.`,
    question: 'At this stage of healing, which intervention approach is MOST appropriate?',
    options: [
      {
        id: 'a',
        text: 'Continue protected passive flexion exercises and maintain the dorsal blocking splint full-time, as active flexion exercises are not safe until 6 weeks post-repair',
        isCorrect: false,
        rationale: 'Modern evidence supports early active motion protocols beginning at 3-4 weeks. The surgeon has cleared for progression, and continued immobilization and passive-only motion at this stage increases adhesion formation and delays functional return. Place-and-hold exercises are appropriate at 4 weeks.'
      },
      {
        id: 'b',
        text: 'Begin gentle active flexion exercises (place-and-hold progressing to active fist), continue dorsal blocking splint between exercises, initiate scar mobilization and tendon gliding exercises, and monitor for signs of tendon rupture',
        isCorrect: true,
        rationale: 'At 4 weeks post-repair with surgeon clearance, progression to place-and-hold and gentle active flexion is appropriate. The adhesion and limited ROM indicate need for scar mobilization and tendon gliding. The dorsal blocking splint continues to protect during the day but active motion within protected range promotes healing and prevents adhesions.'
      },
      {
        id: 'c',
        text: 'Discontinue the dorsal blocking splint and begin aggressive passive extension and resistive flexion exercises to address the adhesion and limited ROM',
        isCorrect: false,
        rationale: 'This is too aggressive for 4 weeks post-repair. The tendon is not strong enough for resistive exercise or aggressive passive extension, which could rupture the repair. Splint protection continues until 6 weeks minimum, and resistance is typically introduced at 8-10 weeks.'
      },
      {
        id: 'd',
        text: 'Refer back to surgeon for consideration of tenolysis given the adhesion, as conservative management is unlikely to restore functional motion',
        isCorrect: false,
        rationale: 'Tenolysis is considered only after extensive conservative management has plateaued, typically 6-9 months post-repair. At 4 weeks, adhesions are expected and can often be addressed through appropriate therapy progression. It is premature to recommend surgical intervention.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['hand-therapy'],
    difficulty: 4,
    concepts: ['flexor tendon repair', 'zone II', 'early active motion protocol', 'tendon gliding', 'scar mobilization', 'tissue healing timeline'],
    clinicalReasoning: 'This question tests knowledge of flexor tendon healing timelines and appropriate progression. Understanding when to advance from passive to active motion and recognizing normal versus problematic adhesion patterns are key concepts.'
  },

  // GERIATRICS - Hip Fracture
  {
    id: 'q31',
    scenario: `An 84-year-old woman with mild cognitive impairment is post-operative day 3 following ORIF for an intertrochanteric hip fracture after a fall at home. She is weight-bearing as tolerated and has been participating in PT. She appears confused at times, doesn't recall the surgery, and asks repeatedly where she is. Before the fall, she lived alone and was independent in ADLs. Her daughter, who lives nearby, is concerned about taking her home. The team is discussing discharge disposition.`,
    question: 'Which OT approach BEST addresses the team\'s need for discharge planning information?',
    options: [
      {
        id: 'a',
        text: 'Recommend skilled nursing facility placement given her cognitive impairment and the daughter\'s concerns, as safe discharge home is unlikely',
        isCorrect: false,
        rationale: 'Confusion post-operatively in elderly patients is common and often temporary (delirium). A recommendation based on current confusion without assessing her functional capacity or considering her baseline function and living situation is premature. Thorough evaluation should inform recommendations.'
      },
      {
        id: 'b',
        text: 'Conduct a comprehensive functional assessment including observation of ADL performance with appropriate cues, assess safety awareness in mobility and transfers, gather detailed information about her pre-operative function and home setup, and present findings to inform team discussion',
        isCorrect: true,
        rationale: 'This approach provides the data needed for discharge planning: current functional performance (what can she do with cueing?), safety awareness (critical for home), baseline function (was she truly independent?), and home environment (supports available, barriers). The OT contributes assessment findings rather than making unilateral disposition recommendations.'
      },
      {
        id: 'c',
        text: 'Focus on hip precaution training and adaptive equipment provision, leaving discharge disposition decisions to the social worker and physician',
        isCorrect: false,
        rationale: 'While hip precaution training is appropriate, OT has valuable information to contribute to disposition decisions based on functional assessment. Limiting OT role to equipment provision doesn\'t utilize the profession\'s expertise in functional evaluation and activity analysis.'
      },
      {
        id: 'd',
        text: 'Await resolution of her confusion before conducting functional assessment, as current performance won\'t reflect her true abilities',
        isCorrect: false,
        rationale: 'While her confusion may improve, discharge planning decisions are being made now. Her current function is relevant information, and assessment can identify how she responds to cueing and environmental modifications. Additionally, her cognitive status may not fully resolve, making current assessment essential.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['evaluation', 'management'],
    otSettings: ['acute-care', 'geriatrics', 'orthopedics'],
    difficulty: 3,
    concepts: ['hip fracture', 'post-operative delirium', 'discharge planning', 'functional assessment', 'cognitive impairment', 'team communication'],
    clinicalReasoning: 'This question tests understanding of OT\'s role in discharge planning, particularly the importance of functional assessment in complex cases. Post-operative confusion is common in elderly patients and should not automatically determine discharge disposition.'
  },

  // SCHOOL-BASED OT - Autism/Behavior
  {
    id: 'q32',
    scenario: `A 10-year-old boy with autism spectrum disorder is on the OT caseload for fine motor and sensory regulation goals. The teacher reports increasing behavioral outbursts in the classroom, particularly during transitions and written assignments. The behavior specialist has implemented a token economy system but behaviors persist. The teacher requests that OT address the behaviors since they occur during activities involving OT goals. The student has an IEP and receives services in a general education classroom.`,
    question: 'How should the OT BEST respond to this situation?',
    options: [
      {
        id: 'a',
        text: 'Decline involvement in the behavior plan as behavior intervention is outside OT scope; focus services on fine motor skills during pull-out sessions to avoid behavioral disruption',
        isCorrect: false,
        rationale: 'This misunderstands OT scope and the interconnection between sensory needs, task demands, and behavior. OT has valuable perspective on why behaviors occur during transitions and writing (both related to OT goals). Pull-out eliminates opportunity to support classroom participation.'
      },
      {
        id: 'b',
        text: 'Take over the behavior plan from the behavior specialist since the behaviors are related to OT-addressed areas',
        isCorrect: false,
        rationale: 'OT should collaborate with, not replace, the behavior specialist. The behaviors likely have multiple contributing factors, and team collaboration is essential. OT can contribute sensory and task-demand perspective while the behavior specialist addresses behavioral components.'
      },
      {
        id: 'c',
        text: 'Analyze the sensory and task demands during transition and writing times, assess whether current sensory strategies and task modifications are effective, collaborate with the behavior specialist to integrate sensory-informed strategies into the behavior plan, and train the teacher in implementing supports',
        isCorrect: true,
        rationale: 'This approach recognizes OT\'s unique contribution (sensory processing analysis, activity analysis of writing demands) while maintaining collaborative relationships. The behaviors during transitions and writing suggest possible sensory dysregulation and task difficulty—OT can address these contributors while the behavior specialist addresses behavioral components.'
      },
      {
        id: 'd',
        text: 'Recommend a more restrictive classroom placement where he can receive more individualized support for his behavioral and sensory needs',
        isCorrect: false,
        rationale: 'Recommending placement change is not the OT role and doesn\'t address the behaviors. The IEP team, including parents, makes placement decisions. The OT role is to support participation in the current least restrictive environment through appropriate modifications and strategies.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['pediatrics'],
    difficulty: 4,
    concepts: ['autism spectrum disorder', 'school-based OT', 'sensory regulation', 'team collaboration', 'behavior', 'activity demands', 'IEP'],
    clinicalReasoning: 'This question tests understanding of OT scope in behavioral situations, particularly how sensory and task demands contribute to behavior. It emphasizes collaborative practice and the distinction between OT and behavioral intervention roles.'
  },

  // ACUTE CARE - ICU Early Mobilization
  {
    id: 'q33',
    scenario: `A 54-year-old man with COVID-19 pneumonia has been in the ICU for 10 days, including 7 days of mechanical ventilation. He was extubated 3 days ago and is now on 4L nasal cannula with O2 saturation 93-95%. He is alert and oriented but extremely weak (MRC score 36/60). He is receiving physical therapy for mobility but nursing reports he is "too tired" to participate in self-care and needs maximum assistance for bathing and bed mobility. He was previously independent and worked as a building contractor.`,
    question: 'What is the MOST appropriate initial OT intervention approach for this patient?',
    options: [
      {
        id: 'a',
        text: 'Defer OT intervention until he has more strength and endurance, as ICU-acquired weakness requires resolution before meaningful functional gains can occur',
        isCorrect: false,
        rationale: 'ICU-acquired weakness is addressed through early mobilization and activity, not waiting. OT can contribute to early mobility through functional activity, which may be more motivating than exercise alone. Waiting prolongs deconditioning and delays recovery.'
      },
      {
        id: 'b',
        text: 'Coordinate with PT and nursing to optimize activity timing, use energy conservation strategies and task modification to enable participation in basic self-care, gradually increase activity demands as tolerated, and provide education about ICU-acquired weakness and recovery trajectory',
        isCorrect: true,
        rationale: 'This approach integrates OT with the care team, uses energy conservation to enable participation despite fatigue, grades activity appropriately, and addresses patient understanding of his condition. Early self-care participation promotes recovery from ICU-acquired weakness and addresses psychological factors (depression, loss of identity as an active person).'
      },
      {
        id: 'c',
        text: 'Focus intervention on cognitive assessment given his prolonged ICU stay, as delirium and cognitive impairment are common after mechanical ventilation',
        isCorrect: false,
        rationale: 'While post-ICU cognitive impairment is a concern, he is described as alert and oriented. Comprehensive assessment is appropriate, but the presenting problem is physical weakness affecting participation, not cognition. Intervention should target the identified problem.'
      },
      {
        id: 'd',
        text: 'Provide maximum assistance with ADLs to conserve his energy for PT sessions, since mobility is the priority for ICU recovery',
        isCorrect: false,
        rationale: 'Doing ADLs for the patient doesn\'t promote recovery and may perpetuate weakness and dependence. The "too tired" complaint should be addressed through energy conservation and activity grading, not avoidance. Both mobility (PT) and functional activity (OT) contribute to ICU recovery.'
      }
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention', 'management'],
    otSettings: ['acute-care'],
    difficulty: 4,
    concepts: ['ICU-acquired weakness', 'early mobilization', 'energy conservation', 'COVID-19', 'team coordination', 'activity grading'],
    clinicalReasoning: 'This question tests understanding of ICU rehabilitation principles, particularly the importance of early mobilization through functional activity and the OT role in acute care. The fatigue complaint should be addressed through therapeutic strategies, not activity avoidance.'
  },

  // MENTAL HEALTH - Eating Disorders
  {
    id: 'q34',
    scenario: `A 17-year-old female with anorexia nervosa is admitted to an adolescent eating disorder program. She is medically stable but significantly underweight. The treatment team includes psychiatry, psychology, nursing, dietetics, and OT. She is a high-achieving junior in high school and expresses intense anxiety about falling behind academically during treatment. She demonstrates rigid thinking, perfectionism, and difficulty with unstructured time. She becomes distressed during meals, which are supervised by nursing.`,
    question: 'Which OT intervention focus is MOST appropriate for this client\'s eating disorder treatment?',
    options: [
      {
        id: 'a',
        text: 'Focus on meal planning and nutrition education to support the dietitian\'s goals, as food and eating are occupations within OT scope',
        isCorrect: false,
        rationale: 'While eating is an occupation, meal planning and nutrition education are primarily dietitian roles in eating disorder treatment. OT duplicating dietetic intervention doesn\'t add value and may confuse treatment boundaries. OT brings a different perspective to eating disorder treatment.'
      },
      {
        id: 'b',
        text: 'Address occupational balance and identity beyond academics, develop coping strategies for anxiety and unstructured time, work on flexibility in activities and reducing perfectionism, and explore leisure and social participation as part of identity development',
        isCorrect: true,
        rationale: 'OT\'s unique contribution in eating disorder treatment addresses the occupational imbalance (over-focus on academics), rigid patterns, difficulty with unstructured time, and identity beyond achievement. These factors often maintain eating disorders and are distinct from dietary and psychological interventions.'
      },
      {
        id: 'c',
        text: 'Create structured academic work time during treatment to reduce her anxiety about falling behind in school',
        isCorrect: false,
        rationale: 'Accommodating her academic anxiety perpetuates the over-focus on achievement that is part of the disorder. Treatment should help her develop identity and coping beyond academics, not maintain the patterns that contribute to her illness.'
      },
      {
        id: 'd',
        text: 'Provide individual counseling sessions to process her feelings about her body image and develop healthy self-esteem',
        isCorrect: false,
        rationale: 'Individual counseling on body image is primarily the psychology role. While OT addresses self-concept through doing, insight-oriented therapy on body image is not the OT contribution. Overlap in team roles is less effective than each discipline contributing their unique expertise.'
      }
    ],
    bloomLevel: 'analyze',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['mental-health', 'pediatrics'],
    difficulty: 4,
    concepts: ['eating disorders', 'occupational identity', 'adolescence', 'perfectionism', 'leisure', 'team roles', 'occupational balance'],
    clinicalReasoning: 'This question tests understanding of OT\'s unique role in eating disorder treatment, which differs from dietary and psychological approaches. The focus on occupational balance, identity beyond achievement, and flexibility distinguishes OT contribution.'
  },

  // UPPER EXTREMITY AMPUTATION
  {
    id: 'q35',
    scenario: `A 45-year-old right-hand dominant farmer sustained a traumatic below-elbow amputation of his right arm in a farming accident 8 weeks ago. The residual limb is well-healed and he has been fitted with a body-powered prosthesis. He attends outpatient OT for prosthetic training. He is struggling with terminal device operation and reports frustration that he "can't do anything useful" with the prosthesis. His wife has been doing most household tasks and farm management. He appears withdrawn and mentions that farming is "all he's ever known."`,
    question: 'Which intervention approach BEST addresses this client\'s comprehensive rehabilitation needs?',
    options: [
      {
        id: 'a',
        text: 'Focus intensively on prosthetic training drills until he achieves proficiency with the terminal device, as functional use depends on mastering the components',
        isCorrect: false,
        rationale: 'Component training alone often leads to prosthetic rejection because skills don\'t transfer to meaningful activities. The repetitive drills don\'t address his frustration or connect to his identity as a farmer. Training should be contextualized in meaningful activities.'
      },
      {
        id: 'b',
        text: 'Integrate prosthetic training into simulated farm tasks that are meaningful to him, address bilateral coordination using the prosthesis as an assist, explore modifications to farm equipment, and address psychological adjustment through peer support resources and discussion of his identity and valued roles',
        isCorrect: true,
        rationale: 'This approach embeds prosthetic training in meaningful occupation (farming tasks), develops realistic expectations (prosthesis as assist), addresses practical return to work (equipment modifications), and acknowledges psychological factors (identity, withdrawal). Peer support from other amputees can be particularly valuable.'
      },
      {
        id: 'c',
        text: 'Recommend he consider a different career path that doesn\'t require bimanual tasks, as farming with a prosthesis may not be safe or practical',
        isCorrect: false,
        rationale: 'This dismisses his stated identity and doesn\'t explore adaptive options. Many farmers continue working with upper extremity amputations using adapted equipment and techniques. The OT role is to enable return to valued occupations, not redirect to alternatives without exploration.'
      },
      {
        id: 'd',
        text: 'Address his depression first through referral to psychology before continuing prosthetic training, as his psychological state is limiting his engagement in therapy',
        isCorrect: false,
        rationale: 'While psychological support may be valuable, occupation-based intervention often supports adjustment to disability. Waiting for depression to resolve before meaningful activity perpetuates the cycle. Engagement in valued activities is therapeutic for adjustment.'
      }
    ],
    bloomLevel: 'evaluate',
    nbcotDomains: ['intervention', 'competency'],
    otSettings: ['physical-disabilities', 'hand-therapy'],
    difficulty: 5,
    concepts: ['upper extremity amputation', 'prosthetic training', 'occupational identity', 'adjustment to disability', 'return to work', 'peer support'],
    clinicalReasoning: 'This complex question addresses prosthetic rehabilitation within the context of identity, meaningful occupation, and psychological adjustment. The best answer integrates skill training with valued activities and addresses the whole person.'
  },

  // REMEMBER - Basic OT Concepts
  {
    id: 'q36',
    scenario: `An occupational therapy student is preparing for their certification exam and reviewing foundational OT concepts.`,
    question: 'According to the Occupational Therapy Practice Framework (OTPF-4), which of the following is classified as an Area of Occupation?',
    options: [
      {
        id: 'a',
        text: 'Motor skills',
        isCorrect: false,
        rationale: 'Motor skills are classified as Performance Skills in the OTPF-4, not Areas of Occupation. Performance skills are goal-directed actions that are observable and include motor, process, and social interaction skills.'
      },
      {
        id: 'b',
        text: 'Instrumental activities of daily living (IADLs)',
        isCorrect: true,
        rationale: 'IADLs are one of the nine Areas of Occupation identified in the OTPF-4. The Areas of Occupation include: ADLs, IADLs, health management, rest and sleep, education, work, play, leisure, and social participation.'
      },
      {
        id: 'c',
        text: 'Values and beliefs',
        isCorrect: false,
        rationale: 'Values and beliefs are classified as Client Factors in the OTPF-4, not Areas of Occupation. Client factors include values, beliefs, spirituality, body functions, and body structures.'
      },
      {
        id: 'd',
        text: 'Physical environment',
        isCorrect: false,
        rationale: 'Physical environment is part of Context in the OTPF-4, not an Area of Occupation. Context includes environmental factors (physical and social) and personal factors.'
      }
    ],
    bloomLevel: 'remember',
    nbcotDomains: ['competency'],
    otSettings: ['wellness'],
    difficulty: 1,
    concepts: ['OTPF-4', 'areas of occupation', 'OT framework', 'foundational knowledge'],
    clinicalReasoning: 'This question tests recall of the fundamental structure of the OTPF-4, which is essential knowledge for all OT practitioners. Understanding how the framework categorizes different aspects of occupation and practice is foundational to clinical reasoning.'
  },

  // REMEMBER - Anatomy/Medical Knowledge
  {
    id: 'q37',
    scenario: `A new occupational therapist is reviewing nerve distributions to prepare for hand therapy patients.`,
    question: 'Which nerve provides sensory innervation to the palmar surface of the thumb, index finger, middle finger, and radial half of the ring finger?',
    options: [
      {
        id: 'a',
        text: 'Ulnar nerve',
        isCorrect: false,
        rationale: 'The ulnar nerve provides sensory innervation to the small finger and ulnar half of the ring finger on both palmar and dorsal surfaces. It does not innervate the thumb or index finger.'
      },
      {
        id: 'b',
        text: 'Radial nerve',
        isCorrect: false,
        rationale: 'The radial nerve provides sensory innervation primarily to the dorsal (back) surface of the hand, thumb, and first two fingers. It does not innervate the palmar surface of the digits.'
      },
      {
        id: 'c',
        text: 'Median nerve',
        isCorrect: true,
        rationale: 'The median nerve provides sensory innervation to the palmar surface of the thumb, index finger, middle finger, and radial half of the ring finger. This is essential knowledge for understanding carpal tunnel syndrome symptoms.'
      },
      {
        id: 'd',
        text: 'Musculocutaneous nerve',
        isCorrect: false,
        rationale: 'The musculocutaneous nerve innervates muscles of the anterior arm (biceps, brachialis, coracobrachialis) and provides sensory innervation to the lateral forearm, not the hand.'
      }
    ],
    bloomLevel: 'remember',
    nbcotDomains: ['evaluation'],
    otSettings: ['hand-therapy'],
    difficulty: 2,
    concepts: ['peripheral nerve anatomy', 'sensory innervation', 'median nerve', 'hand anatomy'],
    clinicalReasoning: 'Knowledge of peripheral nerve distributions is essential for understanding sensory deficits, diagnosing conditions like carpal tunnel syndrome, and planning appropriate interventions in hand therapy.'
  },

  // UNDERSTAND - Interpreting Assessment Results
  {
    id: 'q38',
    scenario: `An OT reviews the results of a Sensory Profile 2 completed by a parent for their 6-year-old child. The child scores in the "Much More Than Others" range for Sensory Sensitivity and Sensory Avoiding quadrants.`,
    question: 'Which statement BEST explains what these Sensory Profile 2 results indicate about the child\'s sensory processing patterns?',
    options: [
      {
        id: 'a',
        text: 'The child has low neurological thresholds and uses passive and active behavioral responses to manage sensory input',
        isCorrect: true,
        rationale: 'Both Sensory Sensitivity and Sensory Avoiding are associated with low neurological thresholds (the nervous system responds quickly to stimuli). Sensitivity involves passive responses (noticing/being bothered by input), while Avoiding involves active responses (limiting exposure to input). This interpretation aligns with Dunn\'s Model of Sensory Processing.'
      },
      {
        id: 'b',
        text: 'The child has high neurological thresholds and seeks additional sensory input to meet their needs',
        isCorrect: false,
        rationale: 'High thresholds with sensation seeking would present differently on the Sensory Profile. Children with high thresholds need more input to register sensations and may actively seek intense sensory experiences. This does not match Sensitivity and Avoiding patterns.'
      },
      {
        id: 'c',
        text: 'The child has difficulty with praxis and motor planning related to sensory integration dysfunction',
        isCorrect: false,
        rationale: 'While sensory processing challenges can co-occur with dyspraxia, the Sensory Profile 2 specifically measures sensory processing patterns, not motor planning. The quadrant scores indicate threshold and response patterns, not praxis abilities.'
      },
      {
        id: 'd',
        text: 'The child demonstrates typical sensory processing with minor variations that require monitoring',
        isCorrect: false,
        rationale: '"Much More Than Others" indicates significant differences from typical peers, not minor variations. This range suggests the child\'s responses are notably different and likely impact daily functioning.'
      }
    ],
    bloomLevel: 'understand',
    nbcotDomains: ['evaluation'],
    otSettings: ['pediatrics'],
    difficulty: 3,
    concepts: ['Sensory Profile 2', 'Dunn\'s Model', 'neurological thresholds', 'sensory processing patterns', 'assessment interpretation'],
    clinicalReasoning: 'Understanding how to interpret standardized assessment results is crucial for developing appropriate interventions. This question requires comprehension of Dunn\'s Model of Sensory Processing and how quadrant scores relate to thresholds and behavioral responses.'
  },

  // UNDERSTAND - Theoretical Concepts
  {
    id: 'q39',
    scenario: `An OT student is studying different occupational therapy theoretical models for their comprehensive exam.`,
    question: 'Which statement BEST describes the primary focus of the Model of Human Occupation (MOHO)?',
    options: [
      {
        id: 'a',
        text: 'Understanding how sensory input is processed and integrated for adaptive motor responses',
        isCorrect: false,
        rationale: 'This description aligns with Sensory Integration theory, developed by A. Jean Ayres, which focuses on the neurological processing of sensory information. MOHO has a different theoretical focus.'
      },
      {
        id: 'b',
        text: 'Explaining how motivation, patterns of behavior, and performance capacity interact to influence occupational participation',
        isCorrect: true,
        rationale: 'MOHO, developed by Gary Kielhofner, explains human occupation through three interrelated components: volition (motivation), habituation (patterns/roles), and performance capacity (physical/mental abilities). It emphasizes how these interact with the environment to shape occupational engagement.'
      },
      {
        id: 'c',
        text: 'Addressing the biomechanical factors that affect range of motion, strength, and endurance for functional tasks',
        isCorrect: false,
        rationale: 'This describes the Biomechanical Frame of Reference, which focuses on physical capacity factors like ROM, strength, and endurance. MOHO takes a broader view of occupation beyond biomechanical components.'
      },
      {
        id: 'd',
        text: 'Promoting neuroplasticity through task-specific practice and repetitive motor learning',
        isCorrect: false,
        rationale: 'This aligns with Motor Learning Theory and contemporary neuroscience approaches to rehabilitation. While MOHO acknowledges performance capacity, its primary focus is on motivation, habits, and the occupational nature of humans.'
      }
    ],
    bloomLevel: 'understand',
    nbcotDomains: ['competency'],
    otSettings: ['mental-health', 'physical-disabilities'],
    difficulty: 2,
    concepts: ['MOHO', 'theoretical models', 'volition', 'habituation', 'performance capacity', 'OT theory'],
    clinicalReasoning: 'Understanding theoretical models helps therapists select appropriate assessments and interventions. This question requires comprehension of MOHO\'s core concepts and the ability to differentiate it from other theoretical approaches.'
  },

  // REMEMBER - Precautions and Contraindications
  {
    id: 'q40',
    scenario: `An occupational therapist is reviewing hip precautions before treating a patient who had a posterolateral approach total hip arthroplasty 3 days ago.`,
    question: 'Which combination of movements must be AVOIDED to protect the hip replacement following a posterolateral surgical approach?',
    options: [
      {
        id: 'a',
        text: 'Hip flexion beyond 90 degrees, hip adduction past midline, and internal rotation',
        isCorrect: true,
        rationale: 'The posterolateral approach requires avoiding hip flexion beyond 90 degrees, adduction past midline, and internal rotation. These movements can cause posterior dislocation of the prosthesis. Patients must follow these precautions during all ADLs including bathing, dressing, and transfers.'
      },
      {
        id: 'b',
        text: 'Hip extension, hip abduction, and external rotation',
        isCorrect: false,
        rationale: 'These movements are generally safe following posterolateral THA and do not increase dislocation risk. In fact, maintaining the hip in slight abduction and external rotation is protective for this surgical approach.'
      },
      {
        id: 'c',
        text: 'Hip flexion beyond 90 degrees, hip abduction, and external rotation',
        isCorrect: false,
        rationale: 'While hip flexion beyond 90 degrees should be avoided, abduction and external rotation are safe movements following posterolateral THA. This combination confuses posterolateral and anterior approach precautions.'
      },
      {
        id: 'd',
        text: 'Hip extension beyond neutral, hip adduction, and external rotation',
        isCorrect: false,
        rationale: 'Extension beyond neutral and external rotation are precautions for anterior approach THA, not posterolateral. It\'s important to know the surgical approach to provide correct precautions.'
      }
    ],
    bloomLevel: 'remember',
    nbcotDomains: ['intervention'],
    otSettings: ['orthopedics', 'acute-care'],
    difficulty: 2,
    concepts: ['hip precautions', 'total hip arthroplasty', 'posterolateral approach', 'surgical precautions', 'patient safety'],
    clinicalReasoning: 'Knowledge of hip precautions is essential for safe treatment of post-surgical patients. Therapists must recall the specific precautions associated with different surgical approaches to prevent serious complications like hip dislocation.'
  },

  // UNDERSTAND - Explaining Clinical Concepts
  {
    id: 'q41',
    scenario: `A caregiver asks the occupational therapist why their family member with moderate dementia can still play familiar songs on the piano but cannot remember what they ate for breakfast.`,
    question: 'Which explanation BEST helps the caregiver understand this phenomenon?',
    options: [
      {
        id: 'a',
        text: 'The patient is likely exaggerating memory problems to get attention, since they can clearly remember how to play piano',
        isCorrect: false,
        rationale: 'This explanation is incorrect and dismissive. The differential preservation of procedural memory compared to episodic memory in dementia is well-documented and not indicative of malingering or attention-seeking behavior.'
      },
      {
        id: 'b',
        text: 'Playing piano uses procedural memory stored in different brain areas than the episodic memory needed to recall recent events like meals',
        isCorrect: true,
        rationale: 'Procedural memory (motor skills, routines) is stored primarily in the basal ganglia and cerebellum, which are often preserved longer in dementia. Episodic memory (specific events) relies on the hippocampus, which is typically affected early in Alzheimer\'s disease. This explains why well-learned skills may persist while recent memories are lost.'
      },
      {
        id: 'c',
        text: 'Music therapy has cured the parts of the brain affected by dementia, allowing the patient to retain musical abilities',
        isCorrect: false,
        rationale: 'While music can be therapeutic and engaging for people with dementia, it does not cure or reverse brain changes. The preservation of musical abilities is due to the type of memory involved, not healing of damaged brain areas.'
      },
      {
        id: 'd',
        text: 'The dementia diagnosis is probably incorrect since true dementia would affect all types of memory equally',
        isCorrect: false,
        rationale: 'Dementia does not affect all memory types equally. Different memory systems involve different brain structures, and the pattern of preserved procedural memory with impaired episodic memory is characteristic of Alzheimer\'s disease and other dementias.'
      }
    ],
    bloomLevel: 'understand',
    nbcotDomains: ['competency', 'management'],
    otSettings: ['geriatrics'],
    difficulty: 2,
    concepts: ['procedural memory', 'episodic memory', 'dementia', 'caregiver education', 'memory systems'],
    clinicalReasoning: 'Understanding different memory systems helps therapists explain patient behavior to caregivers and leverage preserved abilities in intervention. This question requires comprehension of memory neuroscience and the ability to communicate it in accessible terms.'
  }
]

// Bloom's taxonomy level descriptions
export const bloomsDescriptions: Record<string, { name: string; level: number; description: string; verbs: string[] }> = {
  remember: {
    name: 'Remember',
    level: 1,
    description: 'Recall facts and basic concepts',
    verbs: ['define', 'list', 'recall', 'identify', 'name']
  },
  understand: {
    name: 'Understand',
    level: 2,
    description: 'Explain ideas or concepts',
    verbs: ['describe', 'explain', 'summarize', 'interpret', 'classify']
  },
  apply: {
    name: 'Apply',
    level: 3,
    description: 'Use information in new situations',
    verbs: ['apply', 'demonstrate', 'implement', 'solve', 'use']
  },
  analyze: {
    name: 'Analyze',
    level: 4,
    description: 'Draw connections among ideas',
    verbs: ['analyze', 'compare', 'contrast', 'differentiate', 'examine']
  },
  evaluate: {
    name: 'Evaluate',
    level: 5,
    description: 'Justify a decision or course of action',
    verbs: ['evaluate', 'judge', 'critique', 'defend', 'prioritize']
  },
  create: {
    name: 'Create',
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
  },
  'burns': {
    name: 'Burn Rehabilitation',
    icon: '🔥',
    color: 'from-orange-500 to-red-500'
  },
  'lymphedema': {
    name: 'Lymphedema Management',
    icon: '💧',
    color: 'from-cyan-500 to-blue-500'
  },
  'ergonomics': {
    name: 'Ergonomics',
    icon: '🪑',
    color: 'from-slate-500 to-gray-600'
  },
  'driving-rehab': {
    name: 'Driving Rehabilitation',
    icon: '🚗',
    color: 'from-indigo-500 to-blue-500'
  },
  'neuro-rehab': {
    name: 'Neuro Rehabilitation',
    icon: '⚡',
    color: 'from-yellow-500 to-amber-500'
  },
  'orthopedics': {
    name: 'Orthopedics',
    icon: '🦴',
    color: 'from-stone-500 to-neutral-600'
  },
  'home-health': {
    name: 'Home Health',
    icon: '🏠',
    color: 'from-green-500 to-emerald-500'
  },
  'acute-care': {
    name: 'Acute Care',
    icon: '🏥',
    color: 'from-red-500 to-rose-500'
  }
}
