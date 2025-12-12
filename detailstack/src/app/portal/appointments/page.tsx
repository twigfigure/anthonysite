'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Car,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  X,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react'

// Mock appointments data
const appointments = [
  {
    id: 1,
    date: '2024-12-11',
    time: '9:00 AM',
    endTime: '12:00 PM',
    customer: {
      name: 'Alex Martinez',
      email: 'alex.m@email.com',
      phone: '(323) 555-1234',
    },
    vehicle: {
      year: 2023,
      make: 'BMW',
      model: 'M4',
      color: 'Alpine White',
    },
    service: 'Complete Detail',
    location: 'West Hollywood',
    price: 299,
    status: 'in-progress',
    notes: 'Customer requested extra attention on wheels',
    assignedTo: 'Mike T.',
  },
  {
    id: 2,
    date: '2024-12-11',
    time: '10:30 AM',
    endTime: '5:30 PM',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(310) 555-5678',
    },
    vehicle: {
      year: 2022,
      make: 'Tesla',
      model: 'Model S',
      color: 'Midnight Silver',
    },
    service: 'Ceramic Coating',
    location: 'Hollywood',
    price: 599,
    status: 'confirmed',
    notes: '',
    assignedTo: 'James R.',
  },
  {
    id: 3,
    date: '2024-12-11',
    time: '1:00 PM',
    endTime: '5:00 PM',
    customer: {
      name: 'Michael Chen',
      email: 'mchen@email.com',
      phone: '(424) 555-9012',
    },
    vehicle: {
      year: 2024,
      make: 'Porsche',
      model: '911 GT3',
      color: 'Racing Yellow',
    },
    service: 'Paint Correction',
    location: 'West Hollywood',
    price: 449,
    status: 'confirmed',
    notes: 'VIP customer - offer complimentary interior wipe',
    assignedTo: 'Mike T.',
  },
  {
    id: 4,
    date: '2024-12-11',
    time: '3:30 PM',
    endTime: '5:30 PM',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@email.com',
      phone: '(213) 555-3456',
    },
    vehicle: {
      year: 2023,
      make: 'Mercedes',
      model: 'GLE 450',
      color: 'Obsidian Black',
    },
    service: 'Interior Detail',
    location: 'Mobile',
    price: 179,
    status: 'pending',
    notes: 'Mobile service - address: 1234 Sunset Blvd',
    assignedTo: 'Unassigned',
  },
  {
    id: 5,
    date: '2024-12-12',
    time: '9:00 AM',
    endTime: '10:00 AM',
    customer: {
      name: 'David Lee',
      email: 'dlee@email.com',
      phone: '(818) 555-7890',
    },
    vehicle: {
      year: 2022,
      make: 'Audi',
      model: 'RS6 Avant',
      color: 'Nardo Gray',
    },
    service: 'ECO Wash',
    location: 'Downtown LA',
    price: 95,
    status: 'confirmed',
    notes: '',
    assignedTo: 'Sarah K.',
  },
]

const statusColors = {
  'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'In Progress' },
  confirmed: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Confirmed' },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pending' },
  completed: { bg: 'bg-champagne-500/10', text: 'text-champagne-400', label: 'Completed' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Cancelled' },
}

export default function AppointmentsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Appointments</h1>
          <p className="text-obsidian-400 text-sm">
            Manage and view all your scheduled appointments
          </p>
        </div>
        <button className="btn-primary text-sm py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-500" />
          <input
            type="text"
            placeholder="Search by customer, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-obsidian-900 border-obsidian-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex glass rounded-sm overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm ${view === 'list' ? 'bg-champagne-500/20 text-champagne-400' : 'text-obsidian-400'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm ${view === 'calendar' ? 'bg-champagne-500/20 text-champagne-400' : 'text-obsidian-400'}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="glass rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-obsidian-800">
              <tr className="text-left text-sm text-obsidian-400">
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Price</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {filteredAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className="hover:bg-obsidian-800/30 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-obsidian-500">{apt.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{apt.customer.name}</div>
                    <div className="text-sm text-obsidian-500">{apt.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      {apt.vehicle.year} {apt.vehicle.make} {apt.vehicle.model}
                    </div>
                    <div className="text-sm text-obsidian-500">{apt.vehicle.color}</div>
                  </td>
                  <td className="px-6 py-4 text-obsidian-300">{apt.service}</td>
                  <td className="px-6 py-4 text-obsidian-400">{apt.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[apt.status as keyof typeof statusColors].bg
                    } ${statusColors[apt.status as keyof typeof statusColors].text}`}>
                      {statusColors[apt.status as keyof typeof statusColors].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-champagne-400">
                    ${apt.price}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-obsidian-500 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-obsidian-500">
            No appointments found matching your criteria
          </div>
        )}
      </div>

      {/* Appointment Detail Slideout */}
      <AnimatePresence>
        {selectedAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppointment(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-obsidian-900 border-l border-obsidian-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl">Appointment Details</h2>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="p-2 text-obsidian-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                    statusColors[selectedAppointment.status as keyof typeof statusColors].bg
                  } ${statusColors[selectedAppointment.status as keyof typeof statusColors].text}`}>
                    {statusColors[selectedAppointment.status as keyof typeof statusColors].label}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 glass rounded-sm text-obsidian-400 hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 glass rounded-sm text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="glass rounded-sm p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-champagne-500" />
                    <span className="font-medium">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-obsidian-400">
                    <Clock className="w-5 h-5 text-champagne-500" />
                    <span>{selectedAppointment.time} - {selectedAppointment.endTime}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="glass rounded-sm p-4 mb-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-champagne-500" />
                    Customer
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-white font-medium">{selectedAppointment.customer.name}</div>
                    <div className="flex items-center gap-2 text-obsidian-400">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${selectedAppointment.customer.phone}`} className="hover:text-champagne-400">
                        {selectedAppointment.customer.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-obsidian-400">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selectedAppointment.customer.email}`} className="hover:text-champagne-400">
                        {selectedAppointment.customer.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="glass rounded-sm p-4 mb-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-champagne-500" />
                    Vehicle
                  </h3>
                  <div className="text-white">
                    {selectedAppointment.vehicle.year} {selectedAppointment.vehicle.make} {selectedAppointment.vehicle.model}
                  </div>
                  <div className="text-sm text-obsidian-400">{selectedAppointment.vehicle.color}</div>
                </div>

                {/* Service & Location */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="glass rounded-sm p-4">
                    <h3 className="text-xs text-obsidian-500 uppercase mb-1">Service</h3>
                    <div className="font-medium">{selectedAppointment.service}</div>
                  </div>
                  <div className="glass rounded-sm p-4">
                    <h3 className="text-xs text-obsidian-500 uppercase mb-1">Location</h3>
                    <div className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-champagne-500" />
                      {selectedAppointment.location}
                    </div>
                  </div>
                </div>

                {/* Assigned Technician */}
                <div className="glass rounded-sm p-4 mb-4">
                  <h3 className="text-xs text-obsidian-500 uppercase mb-2">Assigned To</h3>
                  <div className="font-medium">{selectedAppointment.assignedTo}</div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div className="glass rounded-sm p-4 mb-4">
                    <h3 className="text-xs text-obsidian-500 uppercase mb-2">Notes</h3>
                    <div className="text-sm text-obsidian-300">{selectedAppointment.notes}</div>
                  </div>
                )}

                {/* Price */}
                <div className="glass rounded-sm p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-obsidian-400">Total</span>
                    <span className="font-display text-2xl text-champagne-400">
                      ${selectedAppointment.price}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                  <button className="btn-primary flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
