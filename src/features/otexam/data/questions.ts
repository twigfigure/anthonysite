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
    clinicalReasoning: 'This question requires candidates to evaluate multiple assessment approaches and determine which provides the most comprehensive and functionally relevant information. All options represent legitimate assessment activities, but candidates must prioritize based on the presenting concerns.'
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
    clinicalReasoning: 'Candidates must apply knowledge of dementia progression, behavioral symptoms, and person-centered care principles to select an intervention that honors the person\'s identity while addressing functional decline. All options represent reasonable clinical considerations, but the best answer addresses root causes rather than symptoms.'
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
    clinicalReasoning: 'This complex question requires candidates to evaluate multiple intervention options considering neurological deficits, psychosocial factors, caregiver dynamics, and discharge constraints. All options have merit in different contexts; the best answer demonstrates synthesis of acute stroke rehabilitation principles with practical discharge planning.'
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
