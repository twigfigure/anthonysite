'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'What is a waterless car wash?',
    answer: 'Our waterless wash uses just 8 ounces of water and eco-friendly products to remove dirt. This keeps your paint protected from the gallon needed of a regular car wash.',
  },
  {
    question: 'How often should I wax my vehicle?',
    answer: 'Every 3 months, or with each change of season. This keeps your paint protected from weather. Our ceramic coatings can extend this protection to 1-5 years.',
  },
  {
    question: 'Do you offer mobile service?',
    answer: 'Yes, we come to you anywhere in LA - from Sherman Oaks to Newport Beach. Our mobile service brings the full detailing experience to your home or office.',
  },
  {
    question: 'Are automatic car washes bad for my car?',
    answer: 'Yes. Touchless automatic car wash detergents can strip wax and damage your clear coat. Brush washes can leave swirl marks and micro-scratches that dull your paint.',
  },
  {
    question: 'Can you remove swirl marks?',
    answer: 'In most cases, yes. Swirl marks from bad wash jobs or improper buffing can be removed with our paint correction service. We assess each vehicle individually.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, Apple Pay, Google Pay, and cash. Payment is processed securely through Stripe at the time of booking.',
  },
  {
    question: 'Do you detail luxury and exotic cars?',
    answer: 'Absolutely. We specialize in high-end vehicles and use only premium products safe for all paint types, including Ferrari, Lamborghini, McLaren, and other exotics.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We require 24-hour notice for cancellations. Same-day cancellations may be subject to a fee. We understand things come up - just let us know as soon as possible.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-obsidian-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-500/20 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-champagne-500 text-sm tracking-[0.3em] uppercase">FAQ</span>
          <h2 className="font-display text-5xl lg:text-6xl mt-4 mb-6">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-obsidian-400">
            Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for?{' '}
            <a href="#contact" className="text-champagne-400 hover:text-champagne-300 underline underline-offset-4">
              Contact us
            </a>
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="glass rounded-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-medium text-white pr-8">{faq.question}</span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index ? 'bg-champagne-500 text-obsidian-950' : 'bg-obsidian-800 text-obsidian-400'
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-obsidian-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-obsidian-500 mb-4">Still have questions?</p>
          <a
            href="tel:+13235551234"
            className="text-champagne-400 hover:text-champagne-300 text-lg font-semibold"
          >
            Call us at (323) 555-1234
          </a>
        </motion.div>
      </div>
    </section>
  )
}