import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useState } from 'react'

const testimonials = [
  {
    name: 'Alex M.',
    role: 'BMW M4 Owner',
    rating: 5,
    text: "One of the best car washes in the entire west coast! I'm beyond impressed with the service and the product. Highly recommend this place!",
    location: 'West Hollywood',
  },
  {
    name: 'Oscar R.',
    role: 'Porsche 911 Owner',
    rating: 5,
    text: "I purchased the coupon for the detail and wasn't disappointed! My car looks brand new. Will never use another detailer again.",
    location: 'Beverly Hills',
  },
  {
    name: 'Lisa C.',
    role: 'Tesla Model S Owner',
    rating: 5,
    text: "Hand car washing like no scratch was. Very believed to try out scratch-free car. Staff are very cool, professional and friendly.",
    location: 'Downtown LA',
  },
  {
    name: 'Marcus J.',
    role: 'Mercedes AMG Owner',
    rating: 5,
    text: "The ceramic coating they did on my AMG is absolutely incredible. Water beads off like magic. Worth every penny.",
    location: 'Santa Monica',
  },
  {
    name: 'Sarah K.',
    role: 'Range Rover Owner',
    rating: 5,
    text: "Finally found a detailer who understands luxury vehicles. The attention to detail is unmatched. My interior looks brand new.",
    location: 'Hollywood Hills',
  },
  {
    name: 'David T.',
    role: 'Audi RS7 Owner',
    rating: 5,
    text: "Mobile service is a game changer. They came to my office and my car was perfect when I left work. Incredible convenience.",
    location: 'Century City',
  },
]

const vehicleTypes = ['All', 'BMW', 'Porsche', 'Tesla', 'Mercedes', 'Range Rover', 'Audi']

export default function Testimonials() {
  const [activeFilter, setActiveFilter] = useState('All')

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/50 to-obsidian-950" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-champagne-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-champagne-500/3 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-champagne-500 text-sm tracking-[0.3em] uppercase">Testimonials</span>
          <h2 className="ds-font-display text-5xl lg:text-6xl mt-4 mb-6">
            Trusted by <span className="ds-text-gradient-gold">Industry Leaders</span>
          </h2>
          <p className="text-obsidian-400 max-w-2xl mx-auto">
            Hear what our clients and fellow car enthusiasts have to say about working with DetailStack.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {vehicleTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                activeFilter === type
                  ? 'bg-champagne-500 text-obsidian-950 font-semibold'
                  : 'ds-glass-light text-obsidian-400 hover:text-white hover:border-champagne-500/30'
              }`}
            >
              {type}
            </button>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="ds-glass rounded-sm p-8 ds-card-hover relative"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-champagne-500/20" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-champagne-500 fill-champagne-500" />
                ))}
              </div>

              {/* Text */}
              <p className="text-obsidian-300 leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-champagne-500/30 to-champagne-600/10 flex items-center justify-center">
                  <span className="ds-font-display text-lg text-champagne-400">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-obsidian-500">{testimonial.role}</div>
                </div>
              </div>

              {/* Location */}
              <div className="mt-4 pt-4 border-t border-obsidian-800">
                <span className="text-xs text-obsidian-500">{testimonial.location}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="ds-btn-primary">
            Book Your Detail
          </button>
        </motion.div>
      </div>
    </section>
  )
}