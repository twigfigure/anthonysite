import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Play, Star, Shield, Clock } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-obsidian-950/90 to-obsidian-950 z-10" />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-champagne-500/5 rounded-full blur-[120px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(220, 187, 130, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(220, 187, 130, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Decorative lines */}
        <svg className="absolute top-0 right-0 w-1/2 h-full opacity-10" viewBox="0 0 400 800">
          <motion.path
            d="M 400 0 L 200 400 L 400 800"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dcbb82" stopOpacity="0" />
              <stop offset="50%" stopColor="#dcbb82" stopOpacity="1" />
              <stop offset="100%" stopColor="#dcbb82" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full ds-glass-light"
            >
              <span className="w-2 h-2 bg-champagne-500 rounded-full animate-pulse" />
              <span className="text-sm text-obsidian-300">Los Angeles's Premier Detailing Studio</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="ds-font-display text-6xl sm:text-7xl lg:text-8xl tracking-wide leading-[0.9]">
                <span className="text-white">YOUR CAR</span>
                <br />
                <span className="text-white">DESERVES</span>
                <br />
                <span className="ds-text-gradient-gold">PERFECTION</span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-obsidian-400 max-w-lg leading-relaxed"
            >
              Experience the art of automotive excellence. Our master detailers transform
              your vehicle into a showroom masterpiece with meticulous attention to every detail.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/detailstack/book" className="ds-btn-primary flex items-center gap-2 text-lg">
                Book Your Detail
                <ChevronRight className="w-5 h-5" />
              </Link>
              <button className="ds-btn-secondary flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-champagne-500/30 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                Watch Our Process
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-obsidian-400">
                <Star className="w-4 h-4 text-champagne-500 fill-champagne-500" />
                <span>4.9 Rating (500+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-obsidian-400">
                <Shield className="w-4 h-4 text-champagne-500" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-obsidian-400">
                <Clock className="w-4 h-4 text-champagne-500" />
                <span>Same-Day Available</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Decorative car silhouette placeholder */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden">
              {/* Placeholder gradient for car image */}
              <div className="absolute inset-0 bg-gradient-to-br from-obsidian-800 to-obsidian-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-champagne-500/20 to-champagne-600/10 flex items-center justify-center">
                      <svg className="w-16 h-16 text-champagne-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-obsidian-500 text-sm">Premium Vehicle Image</p>
                  </div>
                </div>
              </div>

              {/* Reflection effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-obsidian-950 to-transparent" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-champagne-500/30" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-champagne-500/30" />
            </div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -left-8 bottom-12 ds-glass rounded-sm p-6 ds-glow-gold"
            >
              <div className="text-4xl ds-font-display text-champagne-400">10,000+</div>
              <div className="text-sm text-obsidian-400">Vehicles Detailed</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-obsidian-500">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-champagne-500 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  )
}