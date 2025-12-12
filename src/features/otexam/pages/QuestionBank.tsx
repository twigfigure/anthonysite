import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Plus,
  Bell,
  User,
  Edit,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Filter,
  Copy,
  Brain,
  BarChart3,
  BookOpen,
  Image as ImageIcon,
  ExternalLink,
  BookMarked,
  Lightbulb,
} from 'lucide-react'
import { Sidebar } from '../components/Sidebar'
import { useSidebarWidth } from '../hooks/useSidebarWidth'
import { sampleQuestions, settingDescriptions, bloomsDescriptions, domainDescriptions } from '../data/questions'
import type { ExamQuestion, BloomLevel, NBCOTDomain, OTSetting } from '../types'

const difficultyLabels = ['', 'Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard']

export default function QuestionBank() {
  const [questions, setQuestions] = useState<ExamQuestion[]>(sampleQuestions)
  const [searchQuery, setSearchQuery] = useState('')
  const sidebarMargin = useSidebarWidth()
  const [filterSetting, setFilterSetting] = useState<string>('all')
  const [filterBloom, setFilterBloom] = useState<string>('all')
  const [filterDomain, setFilterDomain] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  // Modal states
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [showEditQuestion, setShowEditQuestion] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null)
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null)

  // Form state
  const emptyForm: ExamQuestion = {
    id: '',
    scenario: '',
    question: '',
    options: [
      { id: 'a', text: '', isCorrect: true, rationale: '' },
      { id: 'b', text: '', isCorrect: false, rationale: '' },
      { id: 'c', text: '', isCorrect: false, rationale: '' },
      { id: 'd', text: '', isCorrect: false, rationale: '' },
    ],
    bloomLevel: 'apply',
    nbcotDomains: ['intervention'],
    otSettings: ['physical-disabilities'],
    difficulty: 3,
    concepts: [],
    clinicalReasoning: '',
    image: '',
    suggestedReading: [],
  }
  const [questionForm, setQuestionForm] = useState<ExamQuestion>(emptyForm)
  const [conceptInput, setConceptInput] = useState('')
  const [suggestedReadingInput, setSuggestedReadingInput] = useState({ title: '', source: '', url: '' })

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.concepts.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSetting = filterSetting === 'all' || q.otSettings.includes(filterSetting as OTSetting)
    const matchesBloom = filterBloom === 'all' || q.bloomLevel === filterBloom
    const matchesDomain = filterDomain === 'all' || q.nbcotDomains.includes(filterDomain as NBCOTDomain)
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === parseInt(filterDifficulty)
    return matchesSearch && matchesSetting && matchesBloom && matchesDomain && matchesDifficulty
  })

  // CRUD handlers
  const handleAddQuestion = () => {
    if (!questionForm.scenario || !questionForm.question) return
    const newQuestion: ExamQuestion = {
      ...questionForm,
      id: `q${Date.now()}`,
    }
    setQuestions([...questions, newQuestion])
    setQuestionForm(emptyForm)
    setShowAddQuestion(false)
  }

  const handleEditQuestion = () => {
    if (!editingQuestion) return
    setQuestions(questions.map(q =>
      q.id === editingQuestion.id ? questionForm : q
    ))
    setShowEditQuestion(false)
    setEditingQuestion(null)
    setQuestionForm(emptyForm)
  }

  const handleDeleteQuestion = () => {
    if (!deletingQuestionId) return
    setQuestions(questions.filter(q => q.id !== deletingQuestionId))
    setShowDeleteConfirm(false)
    setDeletingQuestionId(null)
  }

  const handleDuplicateQuestion = (question: ExamQuestion) => {
    const duplicated: ExamQuestion = {
      ...question,
      id: `q${Date.now()}`,
    }
    setQuestions([...questions, duplicated])
  }

  const openEditModal = (question: ExamQuestion) => {
    setEditingQuestion(question)
    setQuestionForm({ ...question })
    setShowEditQuestion(true)
  }

  const openDeleteConfirm = (questionId: string) => {
    setDeletingQuestionId(questionId)
    setShowDeleteConfirm(true)
  }

  const updateOption = (index: number, field: 'text' | 'rationale', value: string) => {
    const newOptions = [...questionForm.options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setQuestionForm({ ...questionForm, options: newOptions })
  }

  const setCorrectAnswer = (index: number) => {
    const newOptions = questionForm.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }))
    setQuestionForm({ ...questionForm, options: newOptions })
  }

  const addConcept = () => {
    if (!conceptInput.trim()) return
    setQuestionForm({
      ...questionForm,
      concepts: [...questionForm.concepts, conceptInput.trim()]
    })
    setConceptInput('')
  }

  const removeConcept = (index: number) => {
    setQuestionForm({
      ...questionForm,
      concepts: questionForm.concepts.filter((_, i) => i !== index)
    })
  }

  const addSuggestedReading = () => {
    if (!suggestedReadingInput.title.trim() || !suggestedReadingInput.source.trim()) return
    setQuestionForm({
      ...questionForm,
      suggestedReading: [
        ...(questionForm.suggestedReading || []),
        {
          title: suggestedReadingInput.title.trim(),
          source: suggestedReadingInput.source.trim(),
          url: suggestedReadingInput.url.trim() || undefined
        }
      ]
    })
    setSuggestedReadingInput({ title: '', source: '', url: '' })
  }

  const removeSuggestedReading = (index: number) => {
    setQuestionForm({
      ...questionForm,
      suggestedReading: (questionForm.suggestedReading || []).filter((_, i) => i !== index)
    })
  }

  const toggleDomain = (domain: NBCOTDomain) => {
    const current = questionForm.nbcotDomains
    if (current.includes(domain)) {
      if (current.length > 1) {
        setQuestionForm({ ...questionForm, nbcotDomains: current.filter(d => d !== domain) })
      }
    } else {
      setQuestionForm({ ...questionForm, nbcotDomains: [...current, domain] })
    }
  }

  const toggleSetting = (setting: OTSetting) => {
    const current = questionForm.otSettings
    if (current.includes(setting)) {
      if (current.length > 1) {
        setQuestionForm({ ...questionForm, otSettings: current.filter(s => s !== setting) })
      }
    } else {
      setQuestionForm({ ...questionForm, otSettings: [...current, setting] })
    }
  }

  // Question form component
  const QuestionFormContent = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      {/* Scenario */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2">Clinical Scenario *</label>
        <textarea
          value={questionForm.scenario}
          onChange={(e) => setQuestionForm({ ...questionForm, scenario: e.target.value })}
          placeholder="Describe the clinical scenario..."
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50 resize-none"
        />
      </div>

      {/* Question */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2">Question *</label>
        <textarea
          value={questionForm.question}
          onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
          placeholder="What is the question?"
          rows={2}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50 resize-none"
        />
      </div>

      {/* Options */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2">Answer Options</label>
        <div className="space-y-4">
          {questionForm.options.map((option, index) => (
            <div key={option.id} className={`p-4 rounded-lg border ${option.isCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5'}`}>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(index)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    option.isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-gray-600'
                  }`}
                >
                  {option.isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <span className="ot-font-body text-sm text-gray-400 uppercase">{option.id}.</span>
                {option.isCorrect && <span className="text-xs text-emerald-400">Correct Answer</span>}
              </div>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(index, 'text', e.target.value)}
                placeholder="Option text"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50 mb-2"
              />
              <textarea
                value={option.rationale}
                onChange={(e) => updateOption(index, 'rationale', e.target.value)}
                placeholder="Rationale for this option..."
                rows={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50 resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block ot-font-body text-sm text-gray-400 mb-2">Bloom's Level</label>
          <select
            value={questionForm.bloomLevel}
            onChange={(e) => setQuestionForm({ ...questionForm, bloomLevel: e.target.value as BloomLevel })}
            className="w-full px-4 py-3 bg-[#1a2332] border border-white/10 rounded-lg ot-font-body text-white focus:outline-none focus:border-[#d4a574]/50"
          >
            {Object.entries(bloomsDescriptions).map(([key, val]) => (
              <option key={key} value={key} style={{ background: '#1a2332', color: 'white' }}>{val.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block ot-font-body text-sm text-gray-400 mb-2">Difficulty</label>
          <select
            value={questionForm.difficulty}
            onChange={(e) => setQuestionForm({ ...questionForm, difficulty: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
            className="w-full px-4 py-3 bg-[#1a2332] border border-white/10 rounded-lg ot-font-body text-white focus:outline-none focus:border-[#d4a574]/50"
          >
            {[1, 2, 3, 4, 5].map(d => (
              <option key={d} value={d} style={{ background: '#1a2332', color: 'white' }}>{d} - {difficultyLabels[d]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* NBCOT Domains */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2">NBCOT Domains</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(domainDescriptions) as NBCOTDomain[]).map(domain => (
            <button
              key={domain}
              type="button"
              onClick={() => toggleDomain(domain)}
              className={`px-3 py-1 rounded-full text-xs ot-font-body transition-colors ${
                questionForm.nbcotDomains.includes(domain)
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }`}
            >
              {domainDescriptions[domain].name}
            </button>
          ))}
        </div>
      </div>

      {/* Practice Settings */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2">Practice Settings</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(settingDescriptions) as OTSetting[]).map(setting => (
            <button
              key={setting}
              type="button"
              onClick={() => toggleSetting(setting)}
              className={`px-3 py-1 rounded-full text-xs ot-font-body transition-colors ${
                questionForm.otSettings.includes(setting)
                  ? 'bg-[#d4a574]/20 text-[#d4a574] border border-[#d4a574]/50'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }`}
            >
              {settingDescriptions[setting].name}
            </button>
          ))}
        </div>
      </div>

      {/* Concepts */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2">Key Concepts</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={conceptInput}
            onChange={(e) => setConceptInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addConcept(); } }}
            placeholder="Add a concept..."
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
          />
          <button
            type="button"
            onClick={addConcept}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {questionForm.concepts.map((concept, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 text-xs text-gray-300"
            >
              {concept}
              <button type="button" onClick={() => removeConcept(i)} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Clinical Reasoning */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2">Clinical Reasoning Explanation</label>
        <textarea
          value={questionForm.clinicalReasoning}
          onChange={(e) => setQuestionForm({ ...questionForm, clinicalReasoning: e.target.value })}
          placeholder="Explain the clinical reasoning required to answer this question..."
          rows={3}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50 resize-none"
        />
      </div>

      {/* Reference Image */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Reference Image URL (optional)
        </label>
        <input
          type="text"
          value={questionForm.image || ''}
          onChange={(e) => setQuestionForm({ ...questionForm, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg ot-font-body text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
        />
        {questionForm.image && (
          <div className="mt-2">
            <img
              src={questionForm.image}
              alt="Preview"
              className="max-w-xs h-auto rounded-lg border border-white/10"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        )}
      </div>

      {/* Suggested Reading */}
      <div>
        <label className="block ot-font-body text-sm text-gray-400 mb-2 flex items-center gap-2">
          <BookMarked className="w-4 h-4" />
          Suggested Reading Resources
        </label>
        <div className="space-y-2 mb-3">
          <input
            type="text"
            value={suggestedReadingInput.title}
            onChange={(e) => setSuggestedReadingInput({ ...suggestedReadingInput, title: e.target.value })}
            placeholder="Resource title"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={suggestedReadingInput.source}
              onChange={(e) => setSuggestedReadingInput({ ...suggestedReadingInput, source: e.target.value })}
              placeholder="Source (e.g., AOTA, Journal name)"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
            />
            <input
              type="text"
              value={suggestedReadingInput.url}
              onChange={(e) => setSuggestedReadingInput({ ...suggestedReadingInput, url: e.target.value })}
              placeholder="URL (optional)"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
            />
          </div>
          <button
            type="button"
            onClick={addSuggestedReading}
            disabled={!suggestedReadingInput.title || !suggestedReadingInput.source}
            className="w-full py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Resource
          </button>
        </div>

        {/* Existing resources list */}
        {questionForm.suggestedReading && questionForm.suggestedReading.length > 0 && (
          <div className="space-y-2">
            {questionForm.suggestedReading.map((resource, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex-1 min-w-0">
                  <p className="ot-font-body text-sm text-gray-200 truncate">{resource.title}</p>
                  <p className="ot-font-body text-xs text-gray-500 truncate">
                    {resource.source}
                    {resource.url && <span className="ml-2 text-[#d4a574]">• Has link</span>}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white/10 rounded-lg text-[#d4a574]"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeSuggestedReading(i)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');
        .ot-font-display { font-family: 'Fraunces', Georgia, serif; }
        .ot-font-body { font-family: 'Source Sans 3', system-ui, sans-serif; }
        .ot-glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      <Sidebar activePage="questions" />

      {/* Main content */}
      <main className={`${sidebarMargin} transition-all duration-300`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 ot-glass border-b border-white/5">
          <div className="pl-16 lg:pl-6 pr-6 py-4">
            <div className="flex items-center justify-between">
              <div className="lg:hidden">
                <span className="ot-font-display text-lg">OTexam</span>
              </div>

              <div className="hidden lg:flex items-center gap-4 flex-1">
                <h1 className="ot-font-display text-xl">Question Bank</h1>
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
          {/* Page header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="ot-font-display text-3xl lg:hidden">Question Bank</h1>
              <p className="ot-font-body text-gray-400 mt-1">
                Manage exam questions and clinical scenarios
              </p>
            </div>

            <button
              onClick={() => {
                setQuestionForm(emptyForm)
                setShowAddQuestion(true)
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search scenarios, questions, or concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg ot-font-body text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4a574]/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filterSetting}
                onChange={(e) => setFilterSetting(e.target.value)}
                className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg ot-font-body text-sm text-white focus:outline-none focus:border-[#d4a574]/50"
              >
                <option value="all" style={{ background: '#1a2332', color: 'white' }}>All Settings</option>
                {Object.entries(settingDescriptions).map(([key, val]) => (
                  <option key={key} value={key} style={{ background: '#1a2332', color: 'white' }}>{val.name}</option>
                ))}
              </select>

              <select
                value={filterBloom}
                onChange={(e) => setFilterBloom(e.target.value)}
                className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg ot-font-body text-sm text-white focus:outline-none focus:border-[#d4a574]/50"
              >
                <option value="all" style={{ background: '#1a2332', color: 'white' }}>All Bloom's</option>
                {Object.entries(bloomsDescriptions).map(([key, val]) => (
                  <option key={key} value={key} style={{ background: '#1a2332', color: 'white' }}>{val.name}</option>
                ))}
              </select>

              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg ot-font-body text-sm text-white focus:outline-none focus:border-[#d4a574]/50"
              >
                <option value="all" style={{ background: '#1a2332', color: 'white' }}>All Domains</option>
                {Object.entries(domainDescriptions).map(([key, val]) => (
                  <option key={key} value={key} style={{ background: '#1a2332', color: 'white' }}>{val.name}</option>
                ))}
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg ot-font-body text-sm text-white focus:outline-none focus:border-[#d4a574]/50"
              >
                <option value="all" style={{ background: '#1a2332', color: 'white' }}>All Difficulty</option>
                {[1, 2, 3, 4, 5].map(d => (
                  <option key={d} value={d} style={{ background: '#1a2332', color: 'white' }}>{d} - {difficultyLabels[d]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#d4a574]/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">{filteredQuestions.length}</div>
                  <div className="ot-font-body text-xs text-gray-500">Questions</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">{Object.keys(settingDescriptions).length}</div>
                  <div className="ot-font-body text-xs text-gray-500">Settings</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">{Object.keys(domainDescriptions).length}</div>
                  <div className="ot-font-body text-xs text-gray-500">Domains</div>
                </div>
              </div>
            </div>
            <div className="ot-glass rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="ot-font-display text-2xl">
                    {Math.round(filteredQuestions.reduce((acc, q) => acc + q.difficulty, 0) / filteredQuestions.length * 10) / 10 || 0}
                  </div>
                  <div className="ot-font-body text-xs text-gray-500">Avg Difficulty</div>
                </div>
              </div>
            </div>
          </div>

          {/* Question list */}
          <div className="space-y-4">
            {filteredQuestions.map((question) => {
              const isExpanded = expandedQuestion === question.id

              return (
                <motion.div
                  key={question.id}
                  layout
                  className="ot-glass rounded-xl overflow-hidden"
                >
                  {/* Question header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-[#d4a574]/10 text-[#d4a574] text-xs ot-font-body">
                            {settingDescriptions[question.otSettings[0]]?.name || question.otSettings[0]}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs ot-font-body capitalize">
                            {question.bloomLevel}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400 text-xs ot-font-body">
                            Difficulty: {question.difficulty}/5
                          </span>
                        </div>
                        <p className="ot-font-body text-gray-300 line-clamp-2">{question.scenario}</p>
                        <p className="ot-font-body text-sm text-[#d4a574] mt-2 font-medium">{question.question}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDuplicateQuestion(question); }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditModal(question); }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); openDeleteConfirm(question.id); }}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5"
                      >
                        <div className="p-4 space-y-4">
                          {/* Reference Image */}
                          {question.image && (
                            <div>
                              <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" />
                                Reference Image
                              </div>
                              <img
                                src={question.image}
                                alt="Question reference"
                                className="max-w-md h-auto rounded-lg border border-white/10"
                              />
                            </div>
                          )}

                          {/* Options */}
                          <div>
                            <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Answer Choices & Rationales</div>
                            <div className="grid gap-2">
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className={`p-3 rounded-lg ${
                                    option.isCorrect
                                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                                      : 'bg-white/5 border border-white/5'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                                      option.isCorrect ? 'bg-emerald-500/20' : 'bg-white/10'
                                    }`}>
                                      {option.isCorrect && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                                    </div>
                                    <div className="flex-1">
                                      <p className={`ot-font-body text-sm ${option.isCorrect ? 'text-emerald-300' : 'text-gray-300'}`}>
                                        <span className="text-gray-500 uppercase mr-2">{option.id}.</span>
                                        {option.text}
                                        {option.isCorrect && <span className="ml-2 text-xs text-emerald-400">(Correct)</span>}
                                      </p>
                                      <p className={`ot-font-body text-xs mt-1 ${option.isCorrect ? 'text-emerald-400/70' : 'text-gray-500'}`}>
                                        <span className="font-medium">Rationale: </span>{option.rationale}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Clinical Reasoning */}
                          <div className="p-4 rounded-lg bg-[#d4a574]/5 border border-[#d4a574]/20">
                            <div className="ot-font-body text-xs text-[#d4a574] uppercase tracking-wider mb-2 flex items-center gap-2">
                              <Lightbulb className="w-3 h-3" />
                              Clinical Reasoning Summary
                            </div>
                            <p className="ot-font-body text-sm text-gray-300">{question.clinicalReasoning}</p>
                          </div>

                          {/* Metadata */}
                          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                              <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">NBCOT Domains</div>
                              <div className="flex flex-wrap gap-1">
                                {question.nbcotDomains.map(d => (
                                  <span key={d} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs capitalize">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2">Key Concepts</div>
                              <div className="flex flex-wrap gap-1">
                                {question.concepts.map((c, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-gray-400 text-xs">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Suggested Reading */}
                          {question.suggestedReading && question.suggestedReading.length > 0 && (
                            <div className="pt-4 border-t border-white/5">
                              <div className="ot-font-body text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <BookMarked className="w-3 h-3" />
                                Suggested Reading
                              </div>
                              <div className="space-y-2">
                                {question.suggestedReading.map((resource, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                    <div>
                                      <p className="ot-font-body text-sm text-gray-200">{resource.title}</p>
                                      <p className="ot-font-body text-xs text-gray-500">{resource.source}</p>
                                    </div>
                                    {resource.url && (
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-white/10 text-[#d4a574]"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="ot-font-body text-gray-500">No questions found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Question Modal */}
      <AnimatePresence>
        {showAddQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddQuestion(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="ot-font-display text-xl">Add New Question</h3>
                <button onClick={() => setShowAddQuestion(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <QuestionFormContent />

              <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowAddQuestion(false)}
                  className="flex-1 py-3 border border-white/10 rounded-lg ot-font-body hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  className="flex-1 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body font-semibold"
                >
                  Add Question
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Question Modal */}
      <AnimatePresence>
        {showEditQuestion && editingQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditQuestion(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="ot-font-display text-xl">Edit Question</h3>
                <button onClick={() => setShowEditQuestion(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <QuestionFormContent />

              <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowEditQuestion(false)}
                  className="flex-1 py-3 border border-white/10 rounded-lg ot-font-body hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditQuestion}
                  className="flex-1 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49a6c] text-[#0a0f1a] rounded-lg ot-font-body font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && deletingQuestionId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1420] border border-white/10 rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="ot-font-display text-xl">Delete Question</h3>
                  <p className="ot-font-body text-gray-400 text-sm">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="ot-font-body text-gray-300 mb-6">
                Are you sure you want to delete this question? It will be permanently removed from the question bank.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 border border-white/10 rounded-lg ot-font-body hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteQuestion}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg ot-font-body font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete Question
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
