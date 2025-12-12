import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  Brain,
  Target,
  ArrowRight,
  Home,
  RotateCcw,
  BarChart3,
} from 'lucide-react'
import { sampleQuestions, settingDescriptions } from '../data/questions'

type ExamState = 'intro' | 'exam' | 'review' | 'results'

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

type QuestionCountOption = 5 | 10 | 15 | 'all'

export default function Exam() {
  const [examState, setExamState] = useState<ExamState>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | null>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showRationale, setShowRationale] = useState(false)
  const [questionCount, setQuestionCount] = useState<QuestionCountOption>('all')
  const [selectedQuestions, setSelectedQuestions] = useState(sampleQuestions)

  const questions = selectedQuestions
  const currentQuestion = questions[currentIndex]

  // Timer
  useEffect(() => {
    if (examState !== 'exam') return
    const timer = setInterval(() => setTimeElapsed(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [examState])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelectAnswer = (optionId: string) => {
    if (examState === 'review') return
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  const toggleFlag = () => {
    setFlagged(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id)
      } else {
        newSet.add(currentQuestion.id)
      }
      return newSet
    })
  }

  const startExam = () => {
    const shuffled = shuffleArray(sampleQuestions)
    const count = questionCount === 'all' ? shuffled.length : questionCount
    setSelectedQuestions(shuffled.slice(0, count))
    setExamState('exam')
  }

  const getEstimatedTime = () => {
    const count = questionCount === 'all' ? sampleQuestions.length : questionCount
    return Math.ceil(count * 2) // ~2 minutes per question
  }

  const goToQuestion = (index: number) => {
    setCurrentIndex(index)
    setShowRationale(false)
  }

  const calculateResults = () => {
    let correct = 0
    const byBloom: Record<string, { correct: number; total: number }> = {}
    const byDomain: Record<string, { correct: number; total: number }> = {}
    const bySetting: Record<string, { correct: number; total: number }> = {}

    questions.forEach(q => {
      const selectedId = answers[q.id]
      const isCorrect = q.options.find(o => o.id === selectedId)?.isCorrect

      if (isCorrect) correct++

      // By Bloom's level
      if (!byBloom[q.bloomLevel]) byBloom[q.bloomLevel] = { correct: 0, total: 0 }
      byBloom[q.bloomLevel].total++
      if (isCorrect) byBloom[q.bloomLevel].correct++

      // By domain
      q.nbcotDomains.forEach(d => {
        if (!byDomain[d]) byDomain[d] = { correct: 0, total: 0 }
        byDomain[d].total++
        if (isCorrect) byDomain[d].correct++
      })

      // By setting
      q.otSettings.forEach(s => {
        if (!bySetting[s]) bySetting[s] = { correct: 0, total: 0 }
        bySetting[s].total++
        if (isCorrect) bySetting[s].correct++
      })
    })

    const percentage = Math.round((correct / questions.length) * 100)

    return {
      correct,
      total: questions.length,
      percentage,
      byBloom,
      byDomain,
      bySetting,
      passPrediction: percentage >= 75 ? 'high' : percentage >= 60 ? 'moderate' : 'low'
    }
  }

  // Intro screen
  if (examState === 'intro') {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
          .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
          .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
          .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
          .ot-gradient-text { background: linear-gradient(135deg, #d4a574 0%, #e8c9a0 50%, #d4a574 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        `}</style>

        <div className="max-w-3xl mx-auto px-6 py-20">
          <Link to="/otexam" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 ot-font-body">
            <ChevronLeft className="w-4 h-4" />
            Back to OTexam
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ot-glass rounded-2xl p-8 lg:p-12"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-[#0a0f1a]" />
              </div>
              <h1 className="ot-font-display text-3xl lg:text-4xl mb-4">Practice Exam</h1>
              <p className="ot-font-body text-gray-400">
                Clinical reasoning scenarios across all OT practice settings
              </p>
            </div>

            {/* Question count selector */}
            <div className="mb-8">
              <h3 className="ot-font-display text-lg mb-4">Number of Questions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([5, 10, 15, 'all'] as QuestionCountOption[]).map((option) => {
                  const isSelected = questionCount === option
                  const displayCount = option === 'all' ? sampleQuestions.length : option
                  const displayLabel = option === 'all' ? `All (${sampleQuestions.length})` : option.toString()

                  return (
                    <button
                      key={option}
                      onClick={() => setQuestionCount(option)}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#d4a574] bg-[#d4a574]/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`ot-font-display text-2xl ${isSelected ? 'text-[#d4a574]' : 'text-gray-300'}`}>
                        {displayLabel}
                      </div>
                      <div className="ot-font-body text-xs text-gray-500">
                        ~{Math.ceil((typeof displayCount === 'number' ? displayCount : sampleQuestions.length) * 2)} min
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="ot-font-display text-2xl text-[#d4a574]">
                  {questionCount === 'all' ? sampleQuestions.length : questionCount}
                </div>
                <div className="ot-font-body text-sm text-gray-400">Questions</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="ot-font-display text-2xl text-[#d4a574]">~{getEstimatedTime()}</div>
                <div className="ot-font-body text-sm text-gray-400">Minutes</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="ot-font-display text-2xl text-[#d4a574]">6</div>
                <div className="ot-font-body text-sm text-gray-400">Settings</div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 mb-8">
              <h3 className="ot-font-display text-lg mb-4">Exam Guidelines</h3>
              <ul className="space-y-3 ot-font-body text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Each question presents a clinical scenario requiring analysis and evaluation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Select the BEST answer from the four options provided</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Flag questions you want to review before submitting</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Review detailed rationales after completing the exam</span>
                </li>
              </ul>
            </div>

            <button
              onClick={startExam}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] ot-font-body font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Begin Exam
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Results screen
  if (examState === 'results') {
    const results = calculateResults()

    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
          .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
          .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
          .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
          .ot-gradient-text { background: linear-gradient(135deg, #d4a574 0%, #e8c9a0 50%, #d4a574 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        `}</style>

        <div className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Score header */}
            <div className="text-center mb-12">
              <h1 className="ot-font-display text-3xl mb-2">Exam Complete</h1>
              <p className="ot-font-body text-gray-400">Here's your performance analysis</p>
            </div>

            {/* Main score card */}
            <div className="ot-glass rounded-2xl p-8 mb-8 text-center">
              <div className="ot-font-display text-7xl font-semibold mb-2">
                <span className={
                  results.percentage >= 75 ? 'text-emerald-400' :
                  results.percentage >= 60 ? 'text-amber-400' : 'text-red-400'
                }>
                  {results.percentage}%
                </span>
              </div>
              <p className="ot-font-body text-gray-400 mb-6">
                {results.correct} of {results.total} questions correct
              </p>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                results.passPrediction === 'high' ? 'bg-emerald-500/10 text-emerald-400' :
                results.passPrediction === 'moderate' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <Target className="w-4 h-4" />
                <span className="ot-font-body text-sm font-medium">
                  {results.passPrediction === 'high' ? 'High likelihood of NBCOT success' :
                   results.passPrediction === 'moderate' ? 'Moderate - continue practicing' :
                   'More preparation recommended'}
                </span>
              </div>
            </div>

            {/* Breakdown cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* By Bloom's Level */}
              <div className="ot-glass rounded-xl p-6">
                <h3 className="ot-font-display text-lg mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#d4a574]" />
                  By Cognitive Level
                </h3>
                <div className="space-y-3">
                  {Object.entries(results.byBloom).map(([level, data]) => (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="ot-font-body text-sm text-gray-400 capitalize">{level}</span>
                        <span className="ot-font-body text-sm">{data.correct}/{data.total}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#d4a574] to-[#c49a6c] rounded-full"
                          style={{ width: `${(data.correct / data.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Domain */}
              <div className="ot-glass rounded-xl p-6">
                <h3 className="ot-font-display text-lg mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#d4a574]" />
                  By NBCOT Domain
                </h3>
                <div className="space-y-3">
                  {Object.entries(results.byDomain).map(([domain, data]) => (
                    <div key={domain}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="ot-font-body text-sm text-gray-400 capitalize">{domain}</span>
                        <span className="ot-font-body text-sm">{data.correct}/{data.total}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{ width: `${(data.correct / data.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Time spent */}
            <div className="ot-glass rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#d4a574]" />
                  <span className="ot-font-body">Time Spent</span>
                </div>
                <span className="ot-font-display text-xl">{formatTime(timeElapsed)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setExamState('review')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] ot-font-body font-semibold flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Review Answers
              </button>
              <button
                onClick={() => {
                  setAnswers({})
                  setFlagged(new Set())
                  setTimeElapsed(0)
                  setCurrentIndex(0)
                  setSelectedQuestions(sampleQuestions)
                  setExamState('intro')
                }}
                className="px-6 py-3 rounded-xl border border-white/10 ot-font-body flex items-center gap-2 hover:bg-white/5"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Exam
              </button>
              <Link
                to="/otexam/dashboard"
                className="px-6 py-3 rounded-xl border border-white/10 ot-font-body flex items-center gap-2 hover:bg-white/5"
              >
                <BarChart3 className="w-4 h-4" />
                View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Main exam/review screen
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
        .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .ot-gradient-text { background: linear-gradient(135deg, #d4a574 0%, #e8c9a0 50%, #d4a574 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 ot-glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/otexam" className="text-gray-400 hover:text-white">
                <Home className="w-5 h-5" />
              </Link>
              <span className="ot-font-display text-lg">
                {examState === 'review' ? 'Review Mode' : 'Practice Exam'}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="ot-font-body text-sm">{formatTime(timeElapsed)}</span>
              </div>
              <span className="ot-font-body text-sm text-gray-400">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Question navigation sidebar */}
        <aside className="hidden lg:block w-64 border-r border-white/5 p-4 overflow-y-auto">
          <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-4">Questions</div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined
              const isFlagged = flagged.has(q.id)
              const isCurrent = i === currentIndex

              let bgColor = 'bg-white/5'
              if (examState === 'review') {
                const isCorrect = q.options.find(o => o.id === answers[q.id])?.isCorrect
                bgColor = isCorrect ? 'bg-emerald-500/20' : answers[q.id] ? 'bg-red-500/20' : 'bg-white/5'
              } else if (isAnswered) {
                bgColor = 'bg-[#d4a574]/20'
              }

              return (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(i)}
                  className={`relative aspect-square rounded-lg ${bgColor} ${
                    isCurrent ? 'ring-2 ring-[#d4a574]' : ''
                  } hover:bg-white/10 transition-colors`}
                >
                  <span className="ot-font-body text-sm">{i + 1}</span>
                  {isFlagged && (
                    <Flag className="absolute top-0.5 right-0.5 w-3 h-3 text-amber-400 fill-amber-400" />
                  )}
                </button>
              )
            })}
          </div>

          {examState === 'exam' && (
            <button
              onClick={() => setExamState('results')}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] ot-font-body font-semibold"
            >
              Submit Exam
            </button>
          )}

          {examState === 'review' && (
            <button
              onClick={() => setExamState('results')}
              className="w-full mt-6 py-3 rounded-xl border border-white/10 ot-font-body hover:bg-white/5"
            >
              Back to Results
            </button>
          )}
        </aside>

        {/* Question content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Question metadata */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/5 ot-font-body text-xs text-gray-400">
                    {settingDescriptions[currentQuestion.otSettings[0]]?.name || currentQuestion.otSettings[0]}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#d4a574]/10 ot-font-body text-xs text-[#d4a574] capitalize">
                    Bloom's: {currentQuestion.bloomLevel}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 ot-font-body text-xs text-blue-400">
                    Difficulty: {currentQuestion.difficulty}/5
                  </span>
                  <button
                    onClick={toggleFlag}
                    className={`ml-auto p-2 rounded-lg transition-colors ${
                      flagged.has(currentQuestion.id)
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Flag className={`w-4 h-4 ${flagged.has(currentQuestion.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Scenario */}
                <div className="ot-glass rounded-xl p-6 mb-6">
                  <div className="ot-font-body text-xs text-[#d4a574] uppercase tracking-wider mb-3">Clinical Scenario</div>
                  <p className="ot-font-body text-gray-300 leading-relaxed">{currentQuestion.scenario}</p>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <h2 className="ot-font-display text-xl mb-6">{currentQuestion.question}</h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = answers[currentQuestion.id] === option.id
                      const showCorrectness = examState === 'review' || showRationale

                      let optionStyle = 'border-white/10 hover:border-white/20 bg-white/5'
                      if (showCorrectness) {
                        if (option.isCorrect) {
                          optionStyle = 'border-emerald-500/50 bg-emerald-500/10'
                        } else if (isSelected && !option.isCorrect) {
                          optionStyle = 'border-red-500/50 bg-red-500/10'
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-[#d4a574]/50 bg-[#d4a574]/10'
                      }

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelectAnswer(option.id)}
                          disabled={examState === 'review'}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${optionStyle}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                              isSelected ? 'border-[#d4a574] bg-[#d4a574]' : 'border-gray-600'
                            }`}>
                              {showCorrectness && option.isCorrect && (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              )}
                              {showCorrectness && isSelected && !option.isCorrect && (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              {!showCorrectness && isSelected && (
                                <div className="w-2 h-2 rounded-full bg-[#0a0f1a]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="ot-font-body text-gray-200">{option.text}</div>
                              {showCorrectness && (
                                <div className={`mt-2 ot-font-body text-sm ${
                                  option.isCorrect ? 'text-emerald-400' : 'text-gray-500'
                                }`}>
                                  {option.rationale}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Clinical reasoning explanation (in review mode) */}
                {examState === 'review' && (
                  <div className="ot-glass rounded-xl p-6 mb-6 border-l-4 border-[#d4a574]">
                    <div className="ot-font-body text-xs text-[#d4a574] uppercase tracking-wider mb-3">
                      Clinical Reasoning Required
                    </div>
                    <p className="ot-font-body text-gray-400 leading-relaxed">
                      {currentQuestion.clinicalReasoning}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentQuestion.concepts.map(concept => (
                        <span key={concept} className="px-2 py-1 rounded bg-white/5 ot-font-body text-xs text-gray-400">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Footer navigation */}
      <footer className="sticky bottom-0 ot-glass border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg bg-white/5 ot-font-body text-sm flex items-center gap-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Mobile question indicator */}
            <div className="lg:hidden flex items-center gap-2">
              <span className="ot-font-body text-sm text-gray-400">
                {currentIndex + 1} of {questions.length}
              </span>
              {examState === 'exam' && (
                <button
                  onClick={() => setExamState('results')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] ot-font-body text-sm font-semibold"
                >
                  Submit
                </button>
              )}
            </div>

            <button
              onClick={() => goToQuestion(Math.min(questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 rounded-lg bg-white/5 ot-font-body text-sm flex items-center gap-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
