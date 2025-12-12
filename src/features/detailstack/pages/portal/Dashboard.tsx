import { motion } from 'framer-motion'
import {
  Calendar,
  DollarSign,
  Users,
  Car,
  TrendingUp,
  CheckCircle,
  ChevronRight,
  MoreVertical,
} from 'lucide-react'

const stats = [
  {
    label: "Today's Appointments",
    value: '8',
    change: '+2 from yesterday',
    trend: 'up',
    icon: Calendar,
  },
  {
    label: 'Revenue This Week',
    value: '$4,280',
    change: '+12% vs last week',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Active Customers',
    value: '342',
    change: '+18 this month',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Vehicles Detailed',
    value: '156',
    change: 'This month',
    trend: 'neutral',
    icon: Car,
  },
]

const todaysAppointments = [
  {
    id: 1,
    time: '9:00 AM',
    customer: 'Alex Martinez',
    vehicle: '2023 BMW M4',
    service: 'Complete Detail',
    status: 'in-progress',
    price: 299,
  },
  {
    id: 2,
    time: '10:30 AM',
    customer: 'Sarah Johnson',
    vehicle: '2022 Tesla Model S',
    service: 'Ceramic Coating',
    status: 'confirmed',
    price: 599,
  },
  {
    id: 3,
    time: '1:00 PM',
    customer: 'Michael Chen',
    vehicle: '2024 Porsche 911',
    service: 'Paint Correction',
    status: 'confirmed',
    price: 449,
  },
  {
    id: 4,
    time: '3:30 PM',
    customer: 'Emily Brown',
    vehicle: '2023 Mercedes GLE',
    service: 'Interior Detail',
    status: 'pending',
    price: 179,
  },
  {
    id: 5,
    time: '5:00 PM',
    customer: 'David Lee',
    vehicle: '2022 Audi RS6',
    service: 'ECO Wash',
    status: 'confirmed',
    price: 95,
  },
]

const recentActivity = [
  {
    type: 'booking',
    message: 'New booking from James Wilson',
    detail: 'Complete Detail - Dec 15 at 2:00 PM',
    time: '5 min ago',
  },
  {
    type: 'payment',
    message: 'Payment received from Lisa Taylor',
    detail: '$249.00 - Ceramic Coating',
    time: '1 hour ago',
  },
  {
    type: 'completed',
    message: 'Job completed by Mike (Technician)',
    detail: '2023 BMW X5 - Interior Detail',
    time: '2 hours ago',
  },
  {
    type: 'review',
    message: 'New 5-star review received',
    detail: '"Best detailer in LA! Absolutely amazing work."',
    time: '3 hours ago',
  },
]

const statusColors = {
  'in-progress': 'text-blue-400 bg-blue-500/10',
  confirmed: 'text-green-400 bg-green-500/10',
  pending: 'text-yellow-400 bg-yellow-500/10',
  cancelled: 'text-red-400 bg-red-500/10',
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="ds-font-display text-3xl">Dashboard</h1>
          <p className="text-obsidian-400 text-sm">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="ds-btn-secondary text-sm py-2">
            <Calendar className="w-4 h-4 mr-2 inline" />
            Dec 11, 2024
          </button>
          <button className="ds-btn-primary text-sm py-2">
            + New Appointment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="ds-glass rounded-sm p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-sm bg-champagne-500/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-champagne-500" />
              </div>
              {stat.trend === 'up' && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  Up
                </span>
              )}
            </div>
            <div className="ds-font-display text-3xl text-white mb-1">{stat.value}</div>
            <div className="text-sm text-obsidian-400">{stat.label}</div>
            <div className="text-xs text-obsidian-500 mt-1">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 ds-glass rounded-sm">
          <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
            <h2 className="ds-font-display text-xl">Today&apos;s Appointments</h2>
            <button className="text-sm text-champagne-400 hover:text-champagne-300 flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-obsidian-800">
            {todaysAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 hover:bg-obsidian-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Time */}
                  <div className="w-20 text-center">
                    <div className="text-sm font-medium text-white">{appointment.time}</div>
                  </div>

                  {/* Customer & Vehicle */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">{appointment.customer}</div>
                    <div className="text-sm text-obsidian-400 truncate">{appointment.vehicle}</div>
                  </div>

                  {/* Service */}
                  <div className="hidden sm:block text-sm text-obsidian-400">
                    {appointment.service}
                  </div>

                  {/* Price */}
                  <div className="hidden md:block text-sm font-medium text-champagne-400">
                    ${appointment.price}
                  </div>

                  {/* Status */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    statusColors[appointment.status as keyof typeof statusColors]
                  }`}>
                    {appointment.status.replace('-', ' ')}
                  </div>

                  {/* Actions */}
                  <button className="p-2 text-obsidian-500 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="ds-glass rounded-sm">
          <div className="flex items-center justify-between p-6 border-b border-obsidian-800">
            <h2 className="ds-font-display text-xl">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'booking' ? 'bg-blue-500/10' :
                  activity.type === 'payment' ? 'bg-green-500/10' :
                  activity.type === 'completed' ? 'bg-champagne-500/10' :
                  'bg-purple-500/10'
                }`}>
                  {activity.type === 'booking' && <Calendar className="w-4 h-4 text-blue-400" />}
                  {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-green-400" />}
                  {activity.type === 'completed' && <CheckCircle className="w-4 h-4 text-champagne-400" />}
                  {activity.type === 'review' && <TrendingUp className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">{activity.message}</div>
                  <div className="text-xs text-obsidian-500 truncate">{activity.detail}</div>
                  <div className="text-xs text-obsidian-600 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="ds-glass rounded-sm p-6 text-left hover:border-champagne-500/30 transition-all group">
          <Calendar className="w-8 h-8 text-champagne-500 mb-3" />
          <div className="font-medium text-white group-hover:text-champagne-400 transition-colors">
            Manage Schedule
          </div>
          <div className="text-sm text-obsidian-500">View and edit calendar</div>
        </button>

        <button className="ds-glass rounded-sm p-6 text-left hover:border-champagne-500/30 transition-all group">
          <Users className="w-8 h-8 text-champagne-500 mb-3" />
          <div className="font-medium text-white group-hover:text-champagne-400 transition-colors">
            Team Members
          </div>
          <div className="text-sm text-obsidian-500">Manage your team</div>
        </button>

        <button className="ds-glass rounded-sm p-6 text-left hover:border-champagne-500/30 transition-all group">
          <DollarSign className="w-8 h-8 text-champagne-500 mb-3" />
          <div className="font-medium text-white group-hover:text-champagne-400 transition-colors">
            Payments & Invoices
          </div>
          <div className="text-sm text-obsidian-500">Track revenue</div>
        </button>

        <button className="ds-glass rounded-sm p-6 text-left hover:border-champagne-500/30 transition-all group">
          <Car className="w-8 h-8 text-champagne-500 mb-3" />
          <div className="font-medium text-white group-hover:text-champagne-400 transition-colors">
            Service Menu
          </div>
          <div className="text-sm text-obsidian-500">Edit packages & pricing</div>
        </button>
      </div>
    </div>
  )
}
