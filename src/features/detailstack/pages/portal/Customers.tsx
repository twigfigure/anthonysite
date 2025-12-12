import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Plus,
  Mail,
  Phone,
  Car,
  Star,
  ChevronRight,
} from 'lucide-react'

const customers = [
  {
    id: 1,
    name: 'Alex Martinez',
    email: 'alex.m@email.com',
    phone: '(323) 555-1234',
    vehicles: [{ year: 2023, make: 'BMW', model: 'M4' }],
    totalSpent: 1847,
    visits: 12,
    lastVisit: '2024-12-11',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(310) 555-5678',
    vehicles: [{ year: 2022, make: 'Tesla', model: 'Model S' }],
    totalSpent: 2456,
    visits: 8,
    lastVisit: '2024-12-10',
    rating: 5,
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'mchen@email.com',
    phone: '(424) 555-9012',
    vehicles: [
      { year: 2024, make: 'Porsche', model: '911 GT3' },
      { year: 2022, make: 'Mercedes', model: 'AMG GT' },
    ],
    totalSpent: 5680,
    visits: 15,
    lastVisit: '2024-12-09',
    rating: 5,
  },
  {
    id: 4,
    name: 'Emily Brown',
    email: 'emily.brown@email.com',
    phone: '(213) 555-3456',
    vehicles: [{ year: 2023, make: 'Mercedes', model: 'GLE 450' }],
    totalSpent: 890,
    visits: 4,
    lastVisit: '2024-12-08',
    rating: 4,
  },
  {
    id: 5,
    name: 'David Lee',
    email: 'dlee@email.com',
    phone: '(818) 555-7890',
    vehicles: [{ year: 2022, make: 'Audi', model: 'RS6 Avant' }],
    totalSpent: 1234,
    visits: 6,
    lastVisit: '2024-12-07',
    rating: 5,
  },
]

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="ds-font-display text-3xl">Customers</h1>
          <p className="text-obsidian-400 text-sm">
            Manage your customer database
          </p>
        </div>
        <button className="ds-btn-primary text-sm py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="ds-glass rounded-sm p-4">
          <div className="text-2xl ds-font-display text-champagne-400">{customers.length}</div>
          <div className="text-sm text-obsidian-400">Total Customers</div>
        </div>
        <div className="ds-glass rounded-sm p-4">
          <div className="text-2xl ds-font-display text-white">
            ${Math.round(customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length)}
          </div>
          <div className="text-sm text-obsidian-400">Avg. Lifetime Value</div>
        </div>
        <div className="ds-glass rounded-sm p-4">
          <div className="text-2xl ds-font-display text-white">
            {Math.round(customers.reduce((acc, c) => acc + c.visits, 0) / customers.length)}
          </div>
          <div className="text-sm text-obsidian-400">Avg. Visits</div>
        </div>
        <div className="ds-glass rounded-sm p-4">
          <div className="text-2xl ds-font-display text-white flex items-center gap-1">
            <Star className="w-5 h-5 text-champagne-500 fill-champagne-500" />
            {(customers.reduce((acc, c) => acc + c.rating, 0) / customers.length).toFixed(1)}
          </div>
          <div className="text-sm text-obsidian-400">Avg. Rating</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-500" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 bg-obsidian-900 border border-obsidian-700 rounded-sm px-4 py-2 text-white placeholder:text-obsidian-500 focus:outline-none focus:border-champagne-500/50"
        />
      </div>

      {/* Customers Table */}
      <div className="ds-glass rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-obsidian-800">
              <tr className="text-left text-sm text-obsidian-400">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Vehicles</th>
                <th className="px-6 py-4 font-medium">Visits</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Last Visit</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-obsidian-800/30 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-500/30 to-champagne-600/10 flex items-center justify-center">
                        <span className="ds-font-display text-champagne-400">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: customer.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-champagne-500 fill-champagne-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-obsidian-400 mb-1">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-obsidian-400">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.vehicles.map((vehicle, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-obsidian-300">
                        <Car className="w-4 h-4 text-champagne-500" />
                        <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-white">{customer.visits}</td>
                  <td className="px-6 py-4 font-medium text-champagne-400">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-obsidian-400">
                    {new Date(customer.lastVisit).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-obsidian-500 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
