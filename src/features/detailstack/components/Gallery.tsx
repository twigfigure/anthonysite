import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

// Premium vehicle images from Unsplash - luxury cars in dramatic lighting
const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80',
    alt: 'Porsche 911 GT3 in dramatic lighting',
    category: 'Ceramic Coating',
    vehicle: 'Porsche 911 GT3',
    description: 'Full ceramic coating with paint correction - mirror finish achieved',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&q=80',
    alt: 'Mercedes AMG GT Black Series',
    category: 'Complete Detail',
    vehicle: 'Mercedes-AMG GT',
    description: 'Complete interior and exterior detail with leather conditioning',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
    alt: 'BMW M4 Competition in blue',
    category: 'Paint Correction',
    vehicle: 'BMW M4 Competition',
    description: 'Multi-stage paint correction removing 95% of swirl marks',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
    alt: 'Lamborghini Huracan',
    category: 'Ceramic Coating',
    vehicle: 'Lamborghini Huracán',
    description: '5-year ceramic coating with hydrophobic finish',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
    alt: 'Tesla Model S Plaid',
    category: 'Complete Detail',
    vehicle: 'Tesla Model S Plaid',
    description: 'Full detail with glass coating and interior deep clean',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&q=80',
    alt: 'Audi RS6 Avant',
    category: 'Paint Correction',
    vehicle: 'Audi RS6 Avant',
    description: 'Single-stage polish restoring factory finish',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
    alt: 'BMW M3 in white',
    category: 'ECO Wash',
    vehicle: 'BMW M3',
    description: 'Premium ECO wash with ceramic spray sealant',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=90',
    thumb: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',
    alt: 'Ferrari 488 in red',
    category: 'Ceramic Coating',
    vehicle: 'Ferrari 488 GTB',
    description: 'Rosso Corsa paint protected with 3-year ceramic coating',
  },
]

const categories = ['All', 'Ceramic Coating', 'Paint Correction', 'Complete Detail', 'ECO Wash']

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1))
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  return (
    <section id="gallery" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/50 to-obsidian-950" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-champagne-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-champagne-600/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-champagne-500 text-sm tracking-[0.3em] uppercase">Our Work</span>
          <h2 className="ds-font-display text-5xl lg:text-6xl mt-4 mb-6">
            Transformations That <span className="ds-text-gradient-gold">Speak</span>
          </h2>
          <p className="text-obsidian-400 max-w-2xl mx-auto">
            Every vehicle tells a story. Here's a glimpse of the masterpieces we've created
            for our clients across Los Angeles.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-champagne-500 text-obsidian-950'
                  : 'ds-glass-light text-obsidian-300 hover:text-white hover:border-champagne-500/30'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`group relative cursor-pointer ${
                  index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
                onClick={() => openLightbox(index)}
              >
                <div className={`relative overflow-hidden rounded-sm ${
                  index === 0 ? 'aspect-square' : 'aspect-[4/3]'
                }`}>
                  {/* Image */}
                  <img
                    src={image.thumb}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Hover border glow */}
                  <div className="absolute inset-0 rounded-sm border border-transparent group-hover:border-champagne-500/50 transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_rgba(220,187,130,0.1)]" />

                  {/* Content overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    {/* Category badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2 mb-2"
                    >
                      <Sparkles className="w-3 h-3 text-champagne-500" />
                      <span className="text-xs text-champagne-400 uppercase tracking-wider">
                        {image.category}
                      </span>
                    </motion.div>

                    {/* Vehicle name */}
                    <h3 className={`ds-font-display text-white transition-colors duration-300 group-hover:text-champagne-400 ${
                      index === 0 ? 'text-2xl' : 'text-lg'
                    }`}>
                      {image.vehicle}
                    </h3>

                    {/* Description - only on large cards */}
                    {index === 0 && (
                      <p className="text-sm text-obsidian-400 mt-1 line-clamp-2">
                        {image.description}
                      </p>
                    )}

                    {/* View indicator */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full ds-glass-light flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <svg className="w-5 h-5 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-obsidian-500 text-sm">
            Follow us on Instagram for more transformations
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-champagne-400 hover:text-champagne-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @detailstack
          </a>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-obsidian-950/98 backdrop-blur-xl"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full ds-glass flex items-center justify-center text-white hover:text-champagne-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full ds-glass flex items-center justify-center text-white hover:text-champagne-400 hover:border-champagne-500/30 transition-all"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full ds-glass flex items-center justify-center text-white hover:text-champagne-400 hover:border-champagne-500/30 transition-all"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Image container */}
            <div
              className="absolute inset-0 flex items-center justify-center p-4 lg:p-20"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-6xl w-full"
              >
                {/* Main image */}
                <div className="relative rounded-sm overflow-hidden shadow-2xl">
                  <img
                    src={filteredImages[currentIndex]?.src}
                    alt={filteredImages[currentIndex]?.alt}
                    className="w-full h-auto max-h-[70vh] object-contain bg-obsidian-900"
                  />

                  {/* Gold corner accents */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-champagne-500/50" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-champagne-500/50" />
                </div>

                {/* Image info */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-champagne-500" />
                    <span className="text-sm text-champagne-400 uppercase tracking-wider">
                      {filteredImages[currentIndex]?.category}
                    </span>
                  </div>
                  <h3 className="ds-font-display text-3xl text-white mb-2">
                    {filteredImages[currentIndex]?.vehicle}
                  </h3>
                  <p className="text-obsidian-400 max-w-lg mx-auto">
                    {filteredImages[currentIndex]?.description}
                  </p>
                </div>

                {/* Thumbnail navigation */}
                <div className="flex justify-center gap-2 mt-6">
                  {filteredImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-16 h-12 rounded-sm overflow-hidden transition-all duration-300 ${
                        idx === currentIndex
                          ? 'ring-2 ring-champagne-500 scale-110'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={img.thumb}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Counter */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-sm text-obsidian-500">
                  <span className="text-champagne-400">{currentIndex + 1}</span>
                  <span className="mx-2">/</span>
                  <span>{filteredImages.length}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
