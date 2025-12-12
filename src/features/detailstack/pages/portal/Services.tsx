import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Clock,
} from 'lucide-react'

const servicePackages = [
  {
    id: 'eco-wash',
    name: 'ECO Wash Package',
    description: 'Waterless hand wash exterior with premium eco-friendly products',
    basePrice: 79,
    duration: '45 min',
    active: true,
    features: ['Waterless Ceramic Hand Wash', 'Vacuum Interior', 'Dashboard Wipe Down', 'Windows Inside & Out'],
  },
  {
    id: 'complete-detail',
    name: 'Complete Detail',
    description: 'Full interior and exterior detail - our most popular service',
    basePrice: 249,
    duration: '3 hours',
    active: true,
    featured: true,
    features: ['Everything in ECO Wash', 'Full Interior Detail', 'Leather Conditioning', 'ECO Wax Protection', 'Exterior Speed Polish'],
  },
  {
    id: 'interior-detail',
    name: 'Interior Detail',
    description: 'Deep clean with steam, odor elimination, and leather treatment',
    basePrice: 149,
    duration: '2 hours',
    active: true,
    features: ['ECO Wash Included', 'Cup Holders, Vents & Crevices', 'Floor Mats, Carpets & Seats', 'Trunk & Lining', 'Leather Treatment'],
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Coating',
    description: 'Professional-grade protection with hydrophobic finish',
    basePrice: 599,
    duration: '1 day',
    active: true,
    features: ['Multi-stage Process', 'Ultimate Paint Protection', 'Scratch and Swirl Removal', '1-5 Year Protection', 'Hydrophobic Finish'],
  },
  {
    id: 'paint-correction',
    name: 'Paint Correction',
    description: 'Multi-stage polish to remove scratches and swirls',
    basePrice: 399,
    duration: '4-6 hours',
    active: true,
    features: ['Paint Inspection', 'Clay Bar Treatment', 'Multi-Stage Polish', 'Swirl Removal', 'Mirror Finish'],
  },
  {
    id: 'express-detail',
    name: 'Express Detail',
    description: 'Quick maintenance detail for busy schedules',
    basePrice: 49,
    duration: '30 min',
    active: false,
    features: ['Exterior Rinse', 'Quick Interior Wipe', 'Window Cleaning', 'Tire Shine'],
  },
]

const addOns = [
  { id: 'headlight', name: 'Headlight Restoration', price: 49, active: true },
  { id: 'engine', name: 'Engine Bay Detail', price: 79, active: true },
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 39, active: true },
  { id: 'odor', name: 'Odor Elimination', price: 49, active: true },
  { id: 'scratch', name: 'Scratch Removal (per panel)', price: 99, active: true },
]

export default function Services() {
  const [packages, setPackages] = useState(servicePackages)
  const [addOnsList, setAddOnsList] = useState(addOns)

  const togglePackage = (id: string) => {
    setPackages(packages.map(pkg =>
      pkg.id === id ? { ...pkg, active: !pkg.active } : pkg
    ))
  }

  const toggleAddOn = (id: string) => {
    setAddOnsList(addOnsList.map(addon =>
      addon.id === id ? { ...addon, active: !addon.active } : addon
    ))
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="ds-font-display text-3xl">Service Menu</h1>
          <p className="text-obsidian-400 text-sm">
            Manage your service packages and pricing
          </p>
        </div>
        <button className="ds-btn-primary text-sm py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {/* Service Packages */}
      <div>
        <h2 className="ds-font-display text-xl mb-4">Service Packages</h2>
        <div className="space-y-4">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`ds-glass rounded-sm p-6 ${!pkg.active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-4">
                <button className="p-2 text-obsidian-500 hover:text-white cursor-grab">
                  <GripVertical className="w-5 h-5" />
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg text-white">{pkg.name}</h3>
                        {pkg.featured && (
                          <span className="px-2 py-0.5 text-xs bg-champagne-500 text-obsidian-950 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-obsidian-400">{pkg.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="ds-font-display text-2xl text-champagne-400">${pkg.basePrice}</div>
                      <div className="text-xs text-obsidian-500">base price</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-obsidian-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pkg.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-obsidian-800 text-obsidian-300 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePackage(pkg.id)}
                    className={`p-2 rounded transition-colors ${
                      pkg.active ? 'text-green-400' : 'text-obsidian-500'
                    }`}
                  >
                    {pkg.active ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                  <button className="p-2 text-obsidian-400 hover:text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="ds-font-display text-xl">Add-ons</h2>
          <button className="text-sm text-champagne-400 hover:text-champagne-300 flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
        <div className="ds-glass rounded-sm overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-obsidian-800">
              <tr className="text-left text-sm text-obsidian-400">
                <th className="px-6 py-4 font-medium">Add-on</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {addOnsList.map((addon) => (
                <tr key={addon.id} className={!addon.active ? 'opacity-60' : ''}>
                  <td className="px-6 py-4 text-white">{addon.name}</td>
                  <td className="px-6 py-4 text-champagne-400">${addon.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAddOn(addon.id)}
                      className={`flex items-center gap-2 text-sm ${
                        addon.active ? 'text-green-400' : 'text-obsidian-500'
                      }`}
                    >
                      {addon.active ? (
                        <>
                          <ToggleRight className="w-5 h-5" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-obsidian-400 hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Type Pricing */}
      <div>
        <h2 className="ds-font-display text-xl mb-4">Vehicle Type Pricing</h2>
        <div className="ds-glass rounded-sm p-6">
          <p className="text-sm text-obsidian-400 mb-4">
            Set price multipliers for different vehicle types. Base prices will be adjusted accordingly.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'Sedan / Coupe', modifier: '1.0x', description: 'Base price' },
              { type: 'SUV / Crossover', modifier: '1.2x', description: '+20%' },
              { type: 'Truck / Van', modifier: '1.3x', description: '+30%' },
              { type: 'Luxury / Exotic', modifier: '1.5x', description: '+50%' },
            ].map((vehicle) => (
              <div key={vehicle.type} className="bg-obsidian-800/50 rounded-sm p-4">
                <div className="font-medium text-white mb-1">{vehicle.type}</div>
                <div className="flex items-center justify-between">
                  <span className="text-champagne-400 ds-font-display text-xl">{vehicle.modifier}</span>
                  <span className="text-xs text-obsidian-500">{vehicle.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
