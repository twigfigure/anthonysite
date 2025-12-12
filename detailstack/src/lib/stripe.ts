// Stripe integration utilities for DetailStack
// Supports both direct Stripe and Stripe Connect for multi-tenant

import { loadStripe, Stripe } from '@stripe/stripe-js'

// Initialize Stripe
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Service pricing configuration
export const services = {
  'eco-wash': {
    name: 'ECO Wash Package',
    basePrice: 7900, // cents
    description: 'Waterless hand wash exterior',
    duration: '45 min',
  },
  'complete-detail': {
    name: 'Complete Detail',
    basePrice: 24900,
    description: 'Full interior and exterior detail',
    duration: '3 hours',
  },
  'interior-detail': {
    name: 'Interior Detail',
    basePrice: 14900,
    description: 'Deep clean with steam and treatment',
    duration: '2 hours',
  },
  'ceramic-coating': {
    name: 'Ceramic Coating',
    basePrice: 59900,
    description: 'Professional-grade protection',
    duration: '1 day',
  },
  'paint-correction': {
    name: 'Paint Correction',
    basePrice: 39900,
    description: 'Multi-stage polish',
    duration: '4-6 hours',
  },
  'express-detail': {
    name: 'Express Detail',
    basePrice: 4900,
    description: 'Quick maintenance detail',
    duration: '30 min',
  },
}

// Vehicle type price modifiers
export const vehicleModifiers = {
  sedan: 1.0,
  suv: 1.2,
  truck: 1.3,
  luxury: 1.5,
}

// Add-ons
export const addOns = {
  headlight: { name: 'Headlight Restoration', price: 4900 },
  engine: { name: 'Engine Bay Detail', price: 7900 },
  'pet-hair': { name: 'Pet Hair Removal', price: 3900 },
  odor: { name: 'Odor Elimination', price: 4900 },
  scratch: { name: 'Scratch Removal (per panel)', price: 9900 },
}

// Calculate total price
export function calculatePrice(
  serviceId: keyof typeof services,
  vehicleType: keyof typeof vehicleModifiers,
  selectedAddOns: (keyof typeof addOns)[],
  isMobile: boolean = false
): number {
  const service = services[serviceId]
  if (!service) return 0

  let total = service.basePrice * vehicleModifiers[vehicleType]

  // Add add-ons
  for (const addOnId of selectedAddOns) {
    const addOn = addOns[addOnId]
    if (addOn) {
      total += addOn.price
    }
  }

  // Mobile service fee
  if (isMobile) {
    total += 2500 // $25
  }

  return Math.round(total)
}

// Types for checkout session
export interface BookingDetails {
  service: keyof typeof services
  vehicleType: keyof typeof vehicleModifiers
  addOns: (keyof typeof addOns)[]
  date: string
  time: string
  location: string
  customerName: string
  customerEmail: string
  customerPhone: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  notes?: string
}

// Create checkout session (to be called from API route)
export async function createCheckoutSession(booking: BookingDetails) {
  const price = calculatePrice(
    booking.service,
    booking.vehicleType,
    booking.addOns,
    booking.location === 'mobile'
  )

  // This would be called from an API route
  // For Stripe Connect, add the connected account ID
  const sessionConfig = {
    payment_method_types: ['card'],
    mode: 'payment' as const,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: services[booking.service].name,
            description: `${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel} - ${booking.date} at ${booking.time}`,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    customer_email: booking.customerEmail,
    metadata: {
      service: booking.service,
      vehicleType: booking.vehicleType,
      addOns: booking.addOns.join(','),
      date: booking.date,
      time: booking.time,
      location: booking.location,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      vehicleMake: booking.vehicleMake,
      vehicleModel: booking.vehicleModel,
      vehicleYear: booking.vehicleYear,
      notes: booking.notes || '',
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book`,
  }

  return sessionConfig
}

// Stripe Connect - Create connected account for a new business
export async function createConnectedAccount(businessEmail: string, businessName: string) {
  // This would be called from an API route using the Stripe server SDK
  return {
    accountId: 'acct_placeholder',
    onboardingUrl: '/stripe/onboarding',
  }
}

// Format price for display
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}