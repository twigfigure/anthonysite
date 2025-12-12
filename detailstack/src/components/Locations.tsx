'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation } from 'lucide-react'
import Link from 'next/link'

const locations = [
  {
    name: 'West Hollywood',
    address: '8500 Sunset Blvd',
    city: 'Parking lot east of Sunset Pl',
    hours: 'Mon-Sun: 8AM-7PM',
    phone: '(323) 371-4373',
    mapUrl: '#',
  },
  {
    name: 'Hollywood',
    address: '7741 Santa Monica Bl',
    city: 'Parking lot just east of Fairfax near North Curson Ave',
    hours: 'Mon-Sun: 8AM-6PM',
    phone: '(323) 371-4373',
    mapUrl: '#',
  },
  {
    name: 'Downtown LA',
    address: '456 S Grand Ave',
    city: 'Parking garage Level P1',
    hours: 'Mon-Fri: 8AM-5PM',
    phone: '(323) 371-4373',
    mapUrl: '#',
  },
]

export default function Locations() {
  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 to-obsidian-900/50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-500/20 to-transparent" />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(220, 187, 130, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-champagne-500 text-sm tracking-[0.3em] uppercase">Locations</span>
          <h2 className="font-display text-5xl lg:text-6xl mt-4 mb-6">
            3 Convenient Spots <span className="text-gradient-gold">Across LA</span>
          </h2>
          <p className="text-obsidian-400 max-w-xl mx-auto">
            Walk-ins welcome. We&apos;d love to see you.
          </p>
        </motion.div>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass rounded-sm p-8 card-hover text-center"
            >
              {/* Location Name */}
              <h3 className="font-display text-2xl text-champagne-400 mb-6">{location.name}</h3>

              {/* Details */}
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 justify-center">
                  <MapPin className="w-4 h-4 text-champagne-500 mt-0.5 flex-shrink-0" />
                  <div className="text-obsidian-300">
                    <div>{location.address}</div>
                    <div className="text-obsidian-500">{location.city}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center">
                  <Clock className="w-4 h-4 text-champagne-500 flex-shrink-0" />
                  <span className="text-obsidian-300">{location.hours}</span>
                </div>

                <div className="flex items-center gap-3 justify-center">
                  <Phone className="w-4 h-4 text-champagne-500 flex-shrink-0" />
                  <a
                    href={`tel:${location.phone.replace(/\D/g, '')}`}
                    className="text-obsidian-300 hover:text-champagne-400 transition-colors"
                  >
                    {location.phone}
                  </a>
                </div>
              </div>

              {/* Directions Link */}
              <a
                href={location.mapUrl}
                className="inline-flex items-center gap-2 mt-6 text-champagne-400 hover:text-champagne-300 text-sm transition-colors"
              >
                Get Directions
                <Navigation className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Mobile Service Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="glass rounded-sm p-8 lg:p-12 text-center glow-gold"
        >
          <h3 className="font-display text-3xl mb-4">
            Don&apos;t see a location near you?
          </h3>
          <p className="text-obsidian-400 mb-6 max-w-xl mx-auto">
            We offer full mobile service anywhere in Los Angeles County. Sherman Oaks, Beverly Hills,
            Newport Beach, Pasadena - we&apos;ll come to you!
          </p>
          <Link href="/book" className="btn-primary inline-flex items-center gap-2">
            Book Mobile Service
          </Link>
        </motion.div>
      </div>
    </section>
  )
}