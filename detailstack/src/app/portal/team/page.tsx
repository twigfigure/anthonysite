'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Star,
  X,
  Edit,
  Trash2,
  Shield,
  Clock,
  CheckCircle,
  Car,
} from 'lucide-react'

// Mock team data
const teamMembers = [
  {
    id: 1,
    name: 'Mike Thompson',
    role: 'Lead Technician',
    email: 'mike.t@detailstack.com',
    phone: '(323) 555-0101',
    avatar: 'MT',
    status: 'active',
    permissions: ['view_appointments', 'edit_appointments', 'view_customers', 'complete_jobs'],
    stats: {
      jobsCompleted: 847,
      rating: 4.9,
      yearsExperience: 5,
    },
    specialties: ['Ceramic Coating', 'Paint Correction'],
    schedule: 'Mon-Fri, 8AM-5PM',
  },
  {
    id: 2,
    name: 'James Rodriguez',
    role: 'Senior Detailer',
    email: 'james.r@detailstack.com',
    phone: '(323) 555-0102',
    avatar: 'JR',
    status: 'active',
    permissions: ['view_appointments', 'view_customers', 'complete_jobs'],
    stats: {
      jobsCompleted: 523,
      rating: 4.8,
      yearsExperience: 3,
    },
    specialties: ['Interior Detail', 'Leather Care'],
    schedule: 'Mon-Fri, 9AM-6PM',
  },
  {
    id: 3,
    name: 'Sarah Kim',
    role: 'Detailer',
    email: 'sarah.k@detailstack.com',
    phone: '(323) 555-0103',
    avatar: 'SK',
    status: 'active',
    permissions: ['view_appointments', 'complete_jobs'],
    stats: {
      jobsCompleted: 234,
      rating: 4.7,
      yearsExperience: 1,
    },
    specialties: ['ECO Wash', 'Express Detail'],
    schedule: 'Tue-Sat, 8AM-5PM',
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Detailer',
    email: 'david.c@detailstack.com',
    phone: '(323) 555-0104',
    avatar: 'DC',
    status: 'on-break',
    permissions: ['view_appointments', 'complete_jobs'],
    stats: {
      jobsCompleted: 189,
      rating: 4.6,
      yearsExperience: 1,
    },
    specialties: ['Full Detail', 'Wheel Care'],
    schedule: 'Wed-Sun, 9AM-6PM',
  },
  {
    id: 5,
    name: 'Emily Watson',
    role: 'Receptionist',
    email: 'emily.w@detailstack.com',
    phone: '(323) 555-0105',
    avatar: 'EW',
    status: 'active',
    permissions: ['view_appointments', 'edit_appointments', 'view_customers', 'manage_schedule'],
    stats: {
      jobsCompleted: 0,
      rating: 5.0,
      yearsExperience: 2,
    },
    specialties: ['Customer Service', 'Scheduling'],
    schedule: 'Mon-Fri, 8AM-4PM',
  },
]

const roles = [
  { value: 'owner', label: 'Owner', description: 'Full access to everything' },
  { value: 'manager', label: 'Manager', description: 'Manage team, appointments, and settings' },
  { value: 'lead-tech', label: 'Lead Technician', description: 'View and complete jobs, manage other techs' },
  { value: 'technician', label: 'Technician', description: 'View and complete assigned jobs' },
  { value: 'receptionist', label: 'Receptionist', description: 'Manage appointments and customers' },
]

const statusColors = {
  active: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Active' },
  'on-break': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'On Break' },
  offline: { bg: 'bg-obsidian-500/10', text: 'text-obsidian-400', label: 'Offline' },
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Team Management</h1>
          <p className="text-obsidian-400 text-sm">
            Manage your team members and their permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-sm py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-sm p-4">
          <div className="text-2xl font-display text-champagne-400">
            {teamMembers.length}
          </div>
          <div className="text-sm text-obsidian-400">Team Members</div>
        </div>
        <div className="glass rounded-sm p-4">
          <div className="text-2xl font-display text-green-400">
            {teamMembers.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-obsidian-400">Currently Active</div>
        </div>
        <div className="glass rounded-sm p-4">
          <div className="text-2xl font-display text-white">
            {Math.round(teamMembers.reduce((acc, m) => acc + m.stats.rating, 0) / teamMembers.length * 10) / 10}
          </div>
          <div className="text-sm text-obsidian-400">Avg. Rating</div>
        </div>
        <div className="glass rounded-sm p-4">
          <div className="text-2xl font-display text-white">
            {teamMembers.reduce((acc, m) => acc + m.stats.jobsCompleted, 0).toLocaleString()}
          </div>
          <div className="text-sm text-obsidian-400">Total Jobs Completed</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-500" />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
        />
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-sm p-6 cursor-pointer hover:border-champagne-500/30 transition-all"
            onClick={() => setSelectedMember(member)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-champagne-500/30 to-champagne-600/10 flex items-center justify-center">
                  <span className="font-display text-xl text-champagne-400">{member.avatar}</span>
                </div>
                <div>
                  <div className="font-medium text-white">{member.name}</div>
                  <div className="text-sm text-obsidian-400">{member.role}</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                statusColors[member.status as keyof typeof statusColors].bg
              } ${statusColors[member.status as keyof typeof statusColors].text}`}>
                {statusColors[member.status as keyof typeof statusColors].label}
              </span>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-obsidian-400">
                <Mail className="w-4 h-4" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-obsidian-400">
                <Phone className="w-4 h-4" />
                <span>{member.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {member.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 py-1 text-xs bg-obsidian-800 text-obsidian-300 rounded"
                >
                  {specialty}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-obsidian-800">
              <div className="text-center">
                <div className="font-display text-lg text-white">{member.stats.jobsCompleted}</div>
                <div className="text-xs text-obsidian-500">Jobs</div>
              </div>
              <div className="text-center">
                <div className="font-display text-lg text-white flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-champagne-500 fill-champagne-500" />
                  {member.stats.rating}
                </div>
                <div className="text-xs text-obsidian-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="font-display text-lg text-white">{member.stats.yearsExperience}y</div>
                <div className="text-xs text-obsidian-500">Exp.</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Member Detail Slideout */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
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
                  <h2 className="font-display text-2xl">Team Member Details</h2>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="p-2 text-obsidian-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-champagne-500/30 to-champagne-600/10 flex items-center justify-center">
                    <span className="font-display text-2xl text-champagne-400">{selectedMember.avatar}</span>
                  </div>
                  <div>
                    <div className="font-display text-xl text-white">{selectedMember.name}</div>
                    <div className="text-obsidian-400">{selectedMember.role}</div>
                    <span className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs ${
                      statusColors[selectedMember.status as keyof typeof statusColors].bg
                    } ${statusColors[selectedMember.status as keyof typeof statusColors].text}`}>
                      {statusColors[selectedMember.status as keyof typeof statusColors].label}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="glass rounded-sm p-4 mb-4">
                  <h3 className="font-medium mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-obsidian-300">
                      <Mail className="w-4 h-4 text-champagne-500" />
                      <a href={`mailto:${selectedMember.email}`} className="hover:text-champagne-400">
                        {selectedMember.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-obsidian-300">
                      <Phone className="w-4 h-4 text-champagne-500" />
                      <a href={`tel:${selectedMember.phone}`} className="hover:text-champagne-400">
                        {selectedMember.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="glass rounded-sm p-4 mb-4">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-champagne-500" />
                    Schedule
                  </h3>
                  <div className="text-sm text-obsidian-300">{selectedMember.schedule}</div>
                </div>

                {/* Specialties */}
                <div className="glass rounded-sm p-4 mb-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4 text-champagne-500" />
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 text-sm bg-champagne-500/10 text-champagne-400 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="glass rounded-sm p-4 mb-4">
                  <h3 className="font-medium mb-3">Performance Stats</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-display text-2xl text-white">
                        {selectedMember.stats.jobsCompleted}
                      </div>
                      <div className="text-xs text-obsidian-500">Jobs Completed</div>
                    </div>
                    <div>
                      <div className="font-display text-2xl text-white flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-champagne-500 fill-champagne-500" />
                        {selectedMember.stats.rating}
                      </div>
                      <div className="text-xs text-obsidian-500">Customer Rating</div>
                    </div>
                    <div>
                      <div className="font-display text-2xl text-white">
                        {selectedMember.stats.yearsExperience}
                      </div>
                      <div className="text-xs text-obsidian-500">Years Exp.</div>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="glass rounded-sm p-4 mb-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-champagne-500" />
                    Permissions
                  </h3>
                  <div className="space-y-2">
                    {selectedMember.permissions.map((permission) => (
                      <div key={permission} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-obsidian-300 capitalize">
                          {permission.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Member
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-obsidian-900 border border-obsidian-800 rounded-sm z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl">Add Team Member</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-obsidian-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input type="text" placeholder="John Smith" className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" placeholder="john@detailstack.com" className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input type="tel" placeholder="(323) 555-1234" className="w-full" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select className="w-full">
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 btn-primary">
                    Send Invite
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