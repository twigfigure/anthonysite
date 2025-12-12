'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Car,
  Sparkles,
  Calendar,
  MapPin,
  User,
  CreditCard,
  Check,
  Clock,
  Shield,
  Droplets,
  PaintBucket,
} from 'lucide-react'

// Service packages
const services = [
  {
    id: 'eco-wash',
    name: 'ECO Wash Package',
    description: 'Waterless hand wash exterior with premium eco-friendly products',
    price: 79,
    duration: '45 min',
    icon: Droplets,
  },
  {
    id: 'complete-detail',
    name: 'Complete Detail',
    description: 'Full interior and exterior detail - our most popular service',
    price: 249,
    duration: '3 hours',
    icon: Sparkles,
    featured: true,
  },
  {
    id: 'interior-detail',
    name: 'Interior Detail',
    description: 'Deep clean with steam, odor elimination, and leather treatment',
    price: 149,
    duration: '2 hours',
    icon: Car,
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    description: 'Professional-grade protection with hydrophobic finish',
    price: 599,
    duration: '1 day',
    icon: Shield,
  },
  {
    id: 'paint-correction',
    name: 'Paint Correction',
    description: 'Multi-stage polish to remove scratches and swirls',
    price: 399,
    duration: '4-6 hours',
    icon: PaintBucket,
  },
]

// Vehicle types with pricing modifiers
const vehicleTypes = [
  { id: 'sedan', name: 'Sedan / Coupe', modifier: 1, description: 'Standard vehicles' },
  { id: 'suv', name: 'SUV / Crossover', modifier: 1.2, description: '+20% for larger vehicles' },
  { id: 'truck', name: 'Truck / Van', modifier: 1.3, description: '+30% for trucks and vans' },
  { id: 'luxury', name: 'Luxury / Exotic', modifier: 1.5, description: 'Premium care for high-end vehicles' },
]

// Add-ons
const addOns = [
  { id: 'headlight', name: 'Headlight Restoration', price: 49 },
  { id: 'engine', name: 'Engine Bay Detail', price: 79 },
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 39 },
  { id: 'odor', name: 'Odor Elimination', price: 49 },
  { id: 'scratch', name: 'Scratch Removal (per panel)', price: 99 },
]

// Time slots
const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

// Locations
const locations = [
  { id: 'west-hollywood', name: 'West Hollywood', address: '8500 Sunset Blvd' },
  { id: 'hollywood', name: 'Hollywood', address: '7741 Santa Monica Bl' },
  { id: 'dtla', name: 'Downtown LA', address: '456 S Grand Ave' },
  { id: 'mobile', name: 'Mobile Service', address: 'We come to you (+$25)' },
]

const steps = [
  { id: 1, name: 'Service', icon: Sparkles },
  { id: 2, name: 'Vehicle', icon: Car },
  { id: 3, name: 'Date & Time', icon: Calendar },
  { id: 4, name: 'Location', icon: MapPin },
  { id: 5, name: 'Details', icon: User },
  { id: 6, name: 'Payment', icon: CreditCard },
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [booking, setBooking] = useState({
    service: '',
    vehicleType: '',
    addOns: [] as string[],
    date: '',
    time: '',
    location: '',
    name: '',
    email: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    notes: '',
  })

  const selectedService = services.find(s => s.id === booking.service)
  const selectedVehicle = vehicleTypes.find(v => v.id === booking.vehicleType)
  const selectedLocation = locations.find(l => l.id === booking.location)

  // Calculate total
  const calculateTotal = () => {
    let total = selectedService?.price || 0
    if (selectedVehicle) {
      total *= selectedVehicle.modifier
    }
    booking.addOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId)
      if (addOn) total += addOn.price
    })
    if (booking.location === 'mobile') {
      total += 25
    }
    return Math.round(total)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  // Generate dates for the next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
    }
  })

  return (
    <div className="min-h-screen bg-obsidian-950">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-obsidian-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-champagne-400 to-champagne-600 rounded-sm flex items-center justify-center">
              <span className="font-display text-obsidian-950 text-sm tracking-wider">DS</span>
            </div>
            <span className="font-display text-lg tracking-[0.15em]">
              <span className="text-white">DETAIL</span>
              <span className="text-champagne-400">STACK</span>
            </span>
          </Link>

          <Link href="/" className="text-sm text-obsidian-400 hover:text-white transition-colors flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      step.id === currentStep
                        ? 'bg-champagne-500 text-obsidian-950'
                        : step.id < currentStep
                        ? 'bg-champagne-500/20 text-champagne-400'
                        : 'bg-obsidian-800 text-obsidian-500'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs hidden sm:block ${
                      step.id === currentStep
                        ? 'text-champagne-400'
                        : step.id < currentStep
                        ? 'text-obsidian-400'
                        : 'text-obsidian-600'
                    }`}
                  >
                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-px mx-2 ${
                      step.id < currentStep ? 'bg-champagne-500/30' : 'bg-obsidian-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-3xl mb-2">Choose Your Service</h2>
                  <p className="text-obsidian-400 mb-8">Select the detailing package that fits your needs</p>

                  <div className="space-y-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setBooking({ ...booking, service: service.id })}
                        className={`w-full glass rounded-sm p-6 text-left transition-all ${
                          booking.service === service.id
                            ? 'border-champagne-500/50 glow-gold'
                            : 'hover:border-obsidian-700'
                        } ${service.featured ? 'relative' : ''}`}
                      >
                        {service.featured && (
                          <span className="absolute -top-2 right-4 bg-champagne-500 text-obsidian-950 text-xs font-semibold px-3 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${
                            booking.service === service.id ? 'bg-champagne-500/20' : 'bg-obsidian-800'
                          }`}>
                            <service.icon className={`w-6 h-6 ${
                              booking.service === service.id ? 'text-champagne-400' : 'text-obsidian-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{service.name}</h3>
                              <span className="text-champagne-400 font-display text-xl">
                                ${service.price}
                              </span>
                            </div>
                            <p className="text-obsidian-400 text-sm mb-2">{service.description}</p>
                            <div className="flex items-center gap-2 text-xs text-obsidian-500">
                              <Clock className="w-3 h-3" />
                              <span>{service.duration}</span>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            booking.service === service.id
                              ? 'border-champagne-500 bg-champagne-500'
                              : 'border-obsidian-600'
                          }`}>
                            {booking.service === service.id && (
                              <Check className="w-4 h-4 text-obsidian-950" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Vehicle Type */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-3xl mb-2">Vehicle Information</h2>
                  <p className="text-obsidian-400 mb-8">Tell us about your vehicle</p>

                  {/* Vehicle Type */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-4">Vehicle Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      {vehicleTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setBooking({ ...booking, vehicleType: type.id })}
                          className={`glass rounded-sm p-4 text-left transition-all ${
                            booking.vehicleType === type.id
                              ? 'border-champagne-500/50'
                              : 'hover:border-obsidian-700'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{type.name}</span>
                            <div className={`w-5 h-5 rounded-full border-2 ${
                              booking.vehicleType === type.id
                                ? 'border-champagne-500 bg-champagne-500'
                                : 'border-obsidian-600'
                            }`}>
                              {booking.vehicleType === type.id && (
                                <Check className="w-4 h-4 text-obsidian-950" />
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-obsidian-500">{type.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <input
                        type="text"
                        placeholder="2024"
                        value={booking.vehicleYear}
                        onChange={(e) => setBooking({ ...booking, vehicleYear: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Make</label>
                      <input
                        type="text"
                        placeholder="BMW"
                        value={booking.vehicleMake}
                        onChange={(e) => setBooking({ ...booking, vehicleMake: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Model</label>
                      <input
                        type="text"
                        placeholder="M4"
                        value={booking.vehicleModel}
                        onChange={(e) => setBooking({ ...booking, vehicleModel: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div>
                    <label className="block text-sm font-medium mb-4">Add-ons (Optional)</label>
                    <div className="space-y-3">
                      {addOns.map((addOn) => (
                        <button
                          key={addOn.id}
                          onClick={() => {
                            const newAddOns = booking.addOns.includes(addOn.id)
                              ? booking.addOns.filter(id => id !== addOn.id)
                              : [...booking.addOns, addOn.id]
                            setBooking({ ...booking, addOns: newAddOns })
                          }}
                          className={`w-full glass rounded-sm p-4 text-left transition-all flex justify-between items-center ${
                            booking.addOns.includes(addOn.id)
                              ? 'border-champagne-500/50'
                              : 'hover:border-obsidian-700'
                          }`}
                        >
                          <span>{addOn.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-champagne-400">+${addOn.price}</span>
                            <div className={`w-5 h-5 rounded border-2 ${
                              booking.addOns.includes(addOn.id)
                                ? 'border-champagne-500 bg-champagne-500'
                                : 'border-obsidian-600'
                            }`}>
                              {booking.addOns.includes(addOn.id) && (
                                <Check className="w-4 h-4 text-obsidian-950" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Date & Time */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-3xl mb-2">Select Date & Time</h2>
                  <p className="text-obsidian-400 mb-8">Choose your preferred appointment slot</p>

                  {/* Date Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium mb-4">Select Date</label>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {availableDates.map((date) => (
                        <button
                          key={date.value}
                          onClick={() => setBooking({ ...booking, date: date.value })}
                          className={`flex-shrink-0 glass rounded-sm p-4 text-center transition-all min-w-[100px] ${
                            booking.date === date.value
                              ? 'border-champagne-500/50 bg-champagne-500/10'
                              : 'hover:border-obsidian-700'
                          }`}
                        >
                          <div className="text-xs text-obsidian-500 mb-1">{date.dayOfWeek}</div>
                          <div className={`font-semibold ${
                            booking.date === date.value ? 'text-champagne-400' : ''
                          }`}>
                            {date.label.split(', ')[0].split(' ').slice(1).join(' ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-4">Select Time</label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setBooking({ ...booking, time })}
                          className={`glass rounded-sm py-3 px-4 text-center transition-all ${
                            booking.time === time
                              ? 'border-champagne-500/50 bg-champagne-500/10 text-champagne-400'
                              : 'hover:border-obsidian-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Location */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-3xl mb-2">Choose Location</h2>
                  <p className="text-obsidian-400 mb-8">Visit us or we&apos;ll come to you</p>

                  <div className="space-y-4">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => setBooking({ ...booking, location: location.id })}
                        className={`w-full glass rounded-sm p-6 text-left transition-all ${
                          booking.location === location.id
                            ? 'border-champagne-500/50 glow-gold'
                            : 'hover:border-obsidian-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${
                            booking.location === location.id ? 'bg-champagne-500/20' : 'bg-obsidian-800'
                          }`}>
                            <MapPin className={`w-6 h-6 ${
                              booking.location === location.id ? 'text-champagne-400' : 'text-obsidian-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{location.name}</h3>
                            <p className="text-obsidian-400 text-sm">{location.address}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            booking.location === location.id
                              ? 'border-champagne-500 bg-champagne-500'
                              : 'border-obsidian-600'
                          }`}>
                            {booking.location === location.id && (
                              <Check className="w-4 h-4 text-obsidian-950" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Mobile Service Address Input */}
                  {booking.location === 'mobile' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6"
                    >
                      <label className="block text-sm font-medium mb-2">Your Address</label>
                      <input
                        type="text"
                        placeholder="Enter your address for mobile service"
                        className="w-full"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Contact Details */}
              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-3xl mb-2">Your Details</h2>
                  <p className="text-obsidian-400 mb-8">How can we reach you?</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Smith"
                        value={booking.name}
                        onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={booking.email}
                          onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          placeholder="(323) 555-1234"
                          value={booking.phone}
                          onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                      <textarea
                        rows={4}
                        placeholder="Any specific concerns or requests for your detail..."
                        value={booking.notes}
                        onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                        className="w-full resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Payment */}
              {currentStep === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-3xl mb-2">Payment</h2>
                  <p className="text-obsidian-400 mb-8">Secure payment powered by Stripe</p>

                  {/* Payment Form Placeholder */}
                  <div className="glass rounded-sm p-8 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVC</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-obsidian-700" />
                    <span className="text-sm text-obsidian-400">
                      I agree to the{' '}
                      <a href="#" className="text-champagne-400 hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-champagne-400 hover:underline">Cancellation Policy</a>
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-8 border-t border-obsidian-800">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-sm transition-all ${
                  currentStep === 1
                    ? 'text-obsidian-600 cursor-not-allowed'
                    : 'text-white hover:bg-obsidian-800'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>

              {currentStep < 6 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !booking.service) ||
                    (currentStep === 2 && !booking.vehicleType) ||
                    (currentStep === 3 && (!booking.date || !booking.time)) ||
                    (currentStep === 4 && !booking.location)
                  }
                  className="btn-primary flex items-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button className="btn-primary flex items-center gap-2 text-lg">
                  Complete Booking — ${calculateTotal()}
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-sm p-6 sticky top-24">
              <h3 className="font-display text-xl mb-6">Booking Summary</h3>

              {selectedService ? (
                <div className="space-y-4">
                  {/* Service */}
                  <div className="flex justify-between">
                    <span className="text-obsidian-400">{selectedService.name}</span>
                    <span>${selectedService.price}</span>
                  </div>

                  {/* Vehicle Type Modifier */}
                  {selectedVehicle && selectedVehicle.modifier > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian-500">{selectedVehicle.name} adjustment</span>
                      <span className="text-obsidian-400">
                        +${Math.round(selectedService.price * (selectedVehicle.modifier - 1))}
                      </span>
                    </div>
                  )}

                  {/* Add-ons */}
                  {booking.addOns.map(addOnId => {
                    const addOn = addOns.find(a => a.id === addOnId)
                    return addOn ? (
                      <div key={addOnId} className="flex justify-between text-sm">
                        <span className="text-obsidian-500">{addOn.name}</span>
                        <span className="text-obsidian-400">+${addOn.price}</span>
                      </div>
                    ) : null
                  })}

                  {/* Mobile Fee */}
                  {booking.location === 'mobile' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-obsidian-500">Mobile service fee</span>
                      <span className="text-obsidian-400">+$25</span>
                    </div>
                  )}

                  {/* Date & Time */}
                  {booking.date && booking.time && (
                    <div className="pt-4 border-t border-obsidian-800">
                      <div className="flex items-center gap-2 text-sm text-obsidian-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })} at {booking.time}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {selectedLocation && (
                    <div className="flex items-center gap-2 text-sm text-obsidian-400">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedLocation.name}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="pt-4 mt-4 border-t border-obsidian-800">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-display text-2xl text-champagne-400">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-obsidian-500 text-sm">
                  Select a service to see your booking summary
                </p>
              )}

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-obsidian-800 space-y-3">
                <div className="flex items-center gap-2 text-xs text-obsidian-500">
                  <Shield className="w-4 h-4 text-champagne-500/50" />
                  <span>Secure payment with Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-obsidian-500">
                  <Check className="w-4 h-4 text-champagne-500/50" />
                  <span>Free cancellation 24h before</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}