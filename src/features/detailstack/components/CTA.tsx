import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Phone } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-obsidian-950" />

      {/* Gradient orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne-500/10 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-champagne-600/5 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="ds-font-display text-5xl sm:text-6xl lg:text-7xl mb-6">
            Ready to Give Your Car
            <br />
            <span className="ds-text-gradient-gold">the Treatment it Deserves?</span>
          </h2>

          <p className="text-obsidian-400 text-lg mb-10 max-w-xl mx-auto">
            Book online in 60 seconds or call us at (323) 371-4373
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/detailstack/book" className="ds-btn-primary text-lg flex items-center gap-2">
              Book Now
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="tel:+13233714373" className="ds-btn-secondary text-lg flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
