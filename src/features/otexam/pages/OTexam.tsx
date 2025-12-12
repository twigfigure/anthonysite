import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  Target,
  BarChart3,
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Activity,
  Stethoscope,
} from 'lucide-react'
import { domainDescriptions } from '../data/questions'

const features = [
  {
    icon: Brain,
    title: 'Clinical Reasoning Focus',
    description: 'Every question requires synthesis of knowledge across multiple OT domains—no rote memorization.',
  },
  {
    icon: Target,
    title: 'NBCOT-Aligned',
    description: 'Questions mapped to all four NBCOT domains with authentic clinical scenarios.',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description: 'AI-powered analysis correlates your performance with NBCOT pass likelihood.',
  },
  {
    icon: Users,
    title: 'Cohort Insights',
    description: 'Faculty dashboard tracks student progress and identifies at-risk learners early.',
  },
]

const bloomsLevels = [
  { level: 'Apply', description: 'Use concepts in clinical contexts', percentage: 35 },
  { level: 'Analyze', description: 'Draw connections across domains', percentage: 30 },
  { level: 'Evaluate', description: 'Judge best courses of action', percentage: 25 },
  { level: 'Create', description: 'Design novel interventions', percentage: 10 },
]

const settings = [
  { icon: '👶', name: 'Pediatrics', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  { icon: '👴', name: 'Geriatrics', color: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  { icon: '🦿', name: 'Physical Disabilities', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { icon: '🧠', name: 'Mental Health', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { icon: '🌱', name: 'Wellness', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  { icon: '🤲', name: 'Hand Therapy', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
]

export default function OTexam() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white overflow-hidden">
      {/* Custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Source+Sans+3:wght@300;400;500;600&display=swap');

        .ot-font-display {
          font-family: 'Fraunces', Georgia, serif;
        }
        .ot-font-body {
          font-family: 'Source Sans 3', system-ui, sans-serif;
        }
        .ot-gradient-text {
          background: linear-gradient(135deg, #d4a574 0%, #e8c9a0 50%, #d4a574 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ot-glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .ot-glow {
          box-shadow: 0 0 60px rgba(212, 165, 116, 0.15);
        }
        .ot-btn-primary {
          background: linear-gradient(135deg, #d4a574 0%, #c49a6c 100%);
          color: #0a0f1a;
          font-weight: 600;
          padding: 1rem 2rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .ot-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(212, 165, 116, 0.3);
        }
        .ot-btn-secondary {
          background: transparent;
          border: 1px solid rgba(212, 165, 116, 0.3);
          color: #d4a574;
          padding: 1rem 2rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .ot-btn-secondary:hover {
          background: rgba(212, 165, 116, 0.1);
          border-color: rgba(212, 165, 116, 0.5);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 ot-glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/otexam" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#0a0f1a]" />
              </div>
              <span className="ot-font-display text-xl font-semibold">OTexam</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 ot-font-body text-sm">
              <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors">Features</button>
              <button onClick={() => document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors">Domains</button>
              <button onClick={() => document.getElementById('settings')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors">Settings</button>
              <Link to="/otexam/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/otexam/exam" className="ot-btn-primary ot-font-body text-sm flex items-center gap-2">
                Start Practice Exam
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[#1e3a5f]/30 rounded-full blur-[150px]" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(212, 165, 116, 0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(212, 165, 116, 0.5) 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}
          />

          {/* Floating medical icons */}
          <motion.div
            className="absolute top-1/3 right-1/4 text-[#d4a574]/10"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Stethoscope className="w-32 h-32" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/3 left-1/4 text-[#1e3a5f]/20"
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-40 h-40" />
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left column - Text */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full ot-glass"
              >
                <Sparkles className="w-4 h-4 text-[#d4a574]" />
                <span className="ot-font-body text-sm text-gray-300">NBCOT Exam Preparation Reimagined</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="ot-font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.1]"
              >
                Master Clinical
                <br />
                <span className="ot-gradient-text">Reasoning</span>
                <br />
                <span className="text-gray-400">Not Just Facts</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="ot-font-body text-lg text-gray-400 max-w-lg leading-relaxed"
              >
                Prepare for the NBCOT with scenario-based questions that test true clinical reasoning
                across all practice settings. Our AI-powered analytics predict your readiness and
                guide your study.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/otexam/exam" className="ot-btn-primary ot-font-body flex items-center gap-2">
                  Begin Practice Exam
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/otexam/dashboard" className="ot-btn-secondary ot-font-body flex items-center gap-2">
                  View Analytics Dashboard
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-8 pt-8 border-t border-white/10"
              >
                <div>
                  <div className="ot-font-display text-3xl font-semibold text-[#d4a574]">94%</div>
                  <div className="ot-font-body text-sm text-gray-500">Pass Rate</div>
                </div>
                <div>
                  <div className="ot-font-display text-3xl font-semibold text-[#d4a574]">500+</div>
                  <div className="ot-font-body text-sm text-gray-500">Clinical Scenarios</div>
                </div>
                <div>
                  <div className="ot-font-display text-3xl font-semibold text-[#d4a574]">6</div>
                  <div className="ot-font-body text-sm text-gray-500">Practice Settings</div>
                </div>
              </motion.div>
            </div>

            {/* Right column - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main card - Sample question preview */}
                <div className="ot-glass rounded-2xl p-8 ot-glow">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-lg">🧠</span>
                    </div>
                    <div>
                      <div className="ot-font-body text-xs text-[#d4a574] uppercase tracking-wider">Mental Health Setting</div>
                      <div className="ot-font-body text-sm text-gray-400">Bloom's Level: Evaluate</div>
                    </div>
                  </div>

                  <p className="ot-font-body text-gray-300 text-sm leading-relaxed mb-6">
                    A 28-year-old woman with bipolar I disorder is admitted during a severe depressive episode.
                    She reports inability to get out of bed and neglecting personal hygiene...
                  </p>

                  <div className="space-y-3">
                    {['Graded activity with meaningful occupation', 'Immediate vocational focus', 'Encourage all group activities', 'Medication education'].map((opt, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border transition-all cursor-pointer ${
                          i === 0
                            ? 'bg-[#d4a574]/10 border-[#d4a574]/30 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            i === 0 ? 'border-[#d4a574] bg-[#d4a574]' : 'border-gray-600'
                          }`}>
                            {i === 0 && <CheckCircle className="w-3 h-3 text-[#0a0f1a]" />}
                          </div>
                          <span className="ot-font-body text-sm">{opt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating analytics card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 ot-glass rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="ot-font-display text-2xl font-semibold text-white">87%</div>
                      <div className="ot-font-body text-xs text-gray-400">Pass Prediction</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating domains card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute -right-4 -bottom-4 ot-glass rounded-xl p-4"
                >
                  <div className="ot-font-body text-xs text-gray-400 mb-2">NBCOT Domains</div>
                  <div className="flex gap-2">
                    {['Evaluation', 'Intervention', 'Management'].map((d) => (
                      <span key={d} className="px-2 py-1 rounded bg-[#1e3a5f]/50 text-xs text-[#d4a574]">
                        {d}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="ot-font-body text-sm text-[#d4a574] uppercase tracking-[0.2em]">Why OTexam</span>
            <h2 className="ot-font-display text-4xl lg:text-5xl mt-4 mb-6">
              Built for <span className="ot-gradient-text">Clinical Excellence</span>
            </h2>
            <p className="ot-font-body text-gray-400 max-w-2xl mx-auto">
              Our platform goes beyond simple test prep—we develop the clinical reasoning skills
              that define exceptional occupational therapists.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="ot-glass rounded-xl p-6 hover:border-[#d4a574]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#d4a574]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4a574]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#d4a574]" />
                </div>
                <h3 className="ot-font-display text-lg font-medium mb-2">{feature.title}</h3>
                <p className="ot-font-body text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloom's Taxonomy Section */}
      <section id="domains" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1e3a5f]/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="ot-font-body text-sm text-[#d4a574] uppercase tracking-[0.2em]">Cognitive Complexity</span>
              <h2 className="ot-font-display text-4xl lg:text-5xl mt-4 mb-6">
                Questions That Demand <span className="ot-gradient-text">Higher-Order Thinking</span>
              </h2>
              <p className="ot-font-body text-gray-400 mb-8 leading-relaxed">
                Every question is tagged with its Bloom's taxonomy level. We focus on application,
                analysis, evaluation, and creation—the cognitive skills that differentiate competent
                practitioners from exceptional ones.
              </p>

              <div className="space-y-4">
                {bloomsLevels.map((level, index) => (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-24 ot-font-display text-lg font-medium text-[#d4a574]">{level.level}</div>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${level.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-[#d4a574] to-[#c49a6c] rounded-full"
                      />
                    </div>
                    <div className="w-12 text-right ot-font-body text-sm text-gray-400">{level.percentage}%</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="ot-glass rounded-2xl p-8"
            >
              <h3 className="ot-font-display text-xl mb-6">NBCOT Domain Coverage</h3>
              <div className="space-y-6">
                {Object.entries(domainDescriptions).map(([key, domain]) => (
                  <div key={key} className="border-b border-white/5 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="ot-font-display font-medium">{domain.name}</span>
                      <span className="ot-font-body text-sm text-[#d4a574]">{domain.percentage}</span>
                    </div>
                    <p className="ot-font-body text-sm text-gray-400">{domain.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Practice Settings Section */}
      <section id="settings" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="ot-font-body text-sm text-[#d4a574] uppercase tracking-[0.2em]">Comprehensive Coverage</span>
            <h2 className="ot-font-display text-4xl lg:text-5xl mt-4 mb-6">
              All <span className="ot-gradient-text">Practice Settings</span>
            </h2>
            <p className="ot-font-body text-gray-400 max-w-2xl mx-auto">
              Clinical scenarios span the full breadth of occupational therapy practice,
              preparing you for questions in any setting.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {settings.map((setting, index) => (
              <motion.div
                key={setting.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`ot-glass rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer border ${setting.color}`}
              >
                <div className="text-4xl mb-3">{setting.icon}</div>
                <div className="ot-font-body text-sm font-medium">{setting.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="ot-glass rounded-3xl p-12 lg:p-16 ot-glow"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-8 h-8 text-[#0a0f1a]" />
            </div>
            <h2 className="ot-font-display text-3xl lg:text-4xl mb-4">
              Ready to Elevate Your Exam Preparation?
            </h2>
            <p className="ot-font-body text-gray-400 mb-8 max-w-lg mx-auto">
              Join thousands of OT students who have transformed their clinical reasoning
              and passed the NBCOT with confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/otexam/exam" className="ot-btn-primary ot-font-body flex items-center gap-2">
                Start Your First Exam
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/otexam/dashboard" className="ot-btn-secondary ot-font-body">
                Explore Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c49a6c] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-[#0a0f1a]" />
              </div>
              <span className="ot-font-display text-lg">OTexam</span>
            </div>
            <div className="ot-font-body text-sm text-gray-500">
              NBCOT® is a registered trademark. OTexam is not affiliated with NBCOT.
            </div>
            <Link to="/" className="ot-font-body text-sm text-[#d4a574] hover:text-[#e8c9a0] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
