import { motion } from 'framer-motion'
import { Droplets, Sparkles, Shield, Car, PaintBucket, Gauge } from 'lucide-react'

const services = [
  {
    icon: Droplets,
    title: 'ECO Wash Package',
    description: 'Waterless hand wash exterior with foam cannon pre-treatment. Eco-friendly and thorough.',
    price: 'From $79',
    features: ['Waterless Ceramic Hand Wash', 'Vacuum Interior', 'Dashboard Wipe Down', 'Windows Inside & Out', 'Mirrors & Door Jambs'],
  },
  {
    icon: Sparkles,
    title: 'Complete Detail',
    description: 'The ultimate service to make your car shine inside & out. Our most popular package.',
    price: 'From $249',
    features: ['Everything in ECO Wash', 'Full Interior Detail', 'Leather Conditioning', 'ECO Wax Protection', 'Exterior Speed Polish'],
    featured: true,
  },
  {
    icon: Car,
    title: 'Interior Detail',
    description: 'Deep clean your interior with steam, odor eliminators, and premium products.',
    price: 'From $149',
    features: ['ECO Wash Included', 'Cup Holders, Vents & Crevices', 'Floor Mats, Carpets & Seats', 'Trunk & Lining', 'Leather Treatment'],
  },
  {
    icon: Shield,
    title: 'Ceramic Coating',
    description: 'Professional-grade protection from scratches, dust, and salt. Long-lasting hydrophobic finish.',
    price: 'From $599',
    features: ['Multi-stage Process', 'Ultimate Paint Protection', 'Scratch and Swirl Removal', '1-5 Year Protection', 'Hydrophobic Finish'],
  },
  {
    icon: PaintBucket,
    title: 'Paint Correction',
    description: 'Multi-stage polish to remove scratches, swirls, and oxidation. Restore your paint to showroom condition.',
    price: 'From $399',
    features: ['Paint Inspection', 'Clay Bar Treatment', 'Multi-Stage Polish', 'Swirl Removal', 'Mirror Finish'],
  },
  {
    icon: Gauge,
    title: 'Express Detail',
    description: 'Quick but thorough maintenance detail. Perfect for busy schedules.',
    price: 'From $49',
    features: ['Exterior Rinse', 'Quick Interior Wipe', 'Window Cleaning', 'Tire Shine', '30-Minute Service'],
  },
]

export default function Services() {
  return (
    <section id="packages" className="relative py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-obsidian-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-champagne-500/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-champagne-500 text-sm tracking-[0.3em] uppercase">Our Services</span>
          <h2 className="ds-font-display text-5xl lg:text-6xl mt-4 mb-6">
            Detailing Packages for <span className="ds-text-gradient-gold">Every Need</span>
          </h2>
          <p className="text-obsidian-400 max-w-2xl mx-auto">
            From quick maintenance washes to comprehensive paint correction and ceramic coating.
            Choose the perfect package for your vehicle.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${service.featured ? 'lg:scale-105 z-10' : ''}`}
            >
              <div
                className={`h-full ds-glass rounded-sm p-8 ds-card-hover ${
                  service.featured ? 'border-champagne-500/30 ds-glow-gold' : ''
                }`}
              >
                {/* Featured Badge */}
                {service.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-champagne-500 text-obsidian-950 text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="w-14 h-14 rounded-sm bg-champagne-500/10 flex items-center justify-center mb-6 group-hover:bg-champagne-500/20 transition-colors">
                  <service.icon className="w-7 h-7 text-champagne-500" />
                </div>

                {/* Title & Price */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="ds-font-display text-2xl">{service.title}</h3>
                  <span className="text-champagne-400 font-semibold">{service.price}</span>
                </div>

                {/* Description */}
                <p className="text-obsidian-400 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-obsidian-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-champagne-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-sm transition-all duration-300 ${
                    service.featured
                      ? 'bg-champagne-500 text-obsidian-950 font-semibold hover:bg-champagne-400'
                      : 'border border-obsidian-700 text-white hover:border-champagne-500/50 hover:text-champagne-400'
                  }`}
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-obsidian-500 text-sm mt-12"
        >
          Prices shown for Regular vehicles. SUV pricing available at checkout.
          Looking for something else? We also offer Wheel Restoration, Headlight Restoration, Paint Touch-Up, and more.
        </motion.p>
      </div>
    </section>
  )
}