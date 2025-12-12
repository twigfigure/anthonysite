import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from 'lucide-react'

const payments = [
  {
    id: 'pay_1',
    date: '2024-12-11',
    customer: 'Alex Martinez',
    service: 'Complete Detail',
    amount: 29900,
    status: 'succeeded',
    method: 'Visa •••• 4242',
  },
  {
    id: 'pay_2',
    date: '2024-12-11',
    customer: 'Sarah Johnson',
    service: 'Ceramic Coating',
    amount: 59900,
    status: 'succeeded',
    method: 'Mastercard •••• 5555',
  },
  {
    id: 'pay_3',
    date: '2024-12-10',
    customer: 'Michael Chen',
    service: 'Paint Correction',
    amount: 44900,
    status: 'succeeded',
    method: 'Amex •••• 3782',
  },
  {
    id: 'pay_4',
    date: '2024-12-10',
    customer: 'Emily Brown',
    service: 'Interior Detail',
    amount: 17900,
    status: 'pending',
    method: 'Visa •••• 1234',
  },
  {
    id: 'pay_5',
    date: '2024-12-09',
    customer: 'David Lee',
    service: 'ECO Wash',
    amount: 9500,
    status: 'succeeded',
    method: 'Visa •••• 9876',
  },
  {
    id: 'pay_6',
    date: '2024-12-09',
    customer: 'James Wilson',
    service: 'Complete Detail',
    amount: 35900,
    status: 'refunded',
    method: 'Mastercard •••• 8888',
  },
]

const stats = [
  {
    label: 'Revenue Today',
    value: 89800,
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Revenue This Week',
    value: 428000,
    change: '+8%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    label: 'Revenue This Month',
    value: 1856000,
    change: '+15%',
    trend: 'up',
    icon: Calendar,
  },
  {
    label: 'Pending Payments',
    value: 17900,
    change: '1 payment',
    trend: 'neutral',
    icon: Clock,
  },
]

const statusColors = {
  succeeded: { bg: 'bg-green-500/10', text: 'text-green-400', icon: CheckCircle },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: Clock },
  refunded: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400', icon: XCircle },
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default function Payments() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('week')

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="ds-font-display text-3xl">Payments</h1>
          <p className="text-obsidian-400 text-sm">
            Track revenue and manage transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button className="ds-btn-secondary text-sm py-2 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn-primary text-sm py-2 flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Stripe Dashboard
          </a>
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
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
              {stat.trend === 'down' && (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <ArrowDownRight className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
              {stat.trend === 'neutral' && (
                <span className="text-xs text-obsidian-500">{stat.change}</span>
              )}
            </div>
            <div className="ds-font-display text-3xl text-white mb-1">
              {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
            </div>
            <div className="text-sm text-obsidian-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Chart Placeholder */}
      <div className="ds-glass rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="ds-font-display text-xl">Revenue Overview</h2>
          <div className="flex ds-glass rounded-sm overflow-hidden">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-sm capitalize ${
                  dateRange === range
                    ? 'bg-champagne-500/20 text-champagne-400'
                    : 'text-obsidian-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder chart */}
        <div className="h-64 flex items-center justify-center border border-dashed border-obsidian-700 rounded-sm">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-obsidian-700 mx-auto mb-2" />
            <p className="text-obsidian-500">Revenue chart visualization</p>
            <p className="text-xs text-obsidian-600">Connect to Stripe for live data</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-obsidian-900 border border-obsidian-700 rounded-sm px-4 py-2 text-white placeholder:text-obsidian-500 focus:outline-none focus:border-champagne-500/50"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-obsidian-900 border border-obsidian-700 rounded-sm px-4 py-2 text-white focus:outline-none focus:border-champagne-500/50"
        >
          <option value="all">All Status</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="ds-glass rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-obsidian-800">
              <tr className="text-left text-sm text-obsidian-400">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Payment Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {filteredPayments.map((payment) => {
                const StatusIcon = statusColors[payment.status as keyof typeof statusColors].icon
                return (
                  <tr
                    key={payment.id}
                    className="hover:bg-obsidian-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{payment.customer}</td>
                    <td className="px-6 py-4 text-obsidian-300">{payment.service}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-obsidian-400">
                        <CreditCard className="w-4 h-4" />
                        <span>{payment.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        statusColors[payment.status as keyof typeof statusColors].bg
                      } ${statusColors[payment.status as keyof typeof statusColors].text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${
                        payment.status === 'refunded' ? 'text-red-400' : 'text-champagne-400'
                      }`}>
                        {payment.status === 'refunded' ? '-' : ''}{formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-obsidian-500 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-obsidian-500">
            No transactions found
          </div>
        )}
      </div>

      {/* Stripe Connect Info */}
      <div className="ds-glass rounded-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-sm bg-[#635BFF]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#635BFF">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1">Powered by Stripe</h3>
            <p className="text-sm text-obsidian-400 mb-4">
              Secure payments processed through Stripe. All transactions are encrypted and PCI compliant.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://dashboard.stripe.com/payouts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-champagne-400 hover:text-champagne-300"
              >
                View Payouts →
              </a>
              <a
                href="https://dashboard.stripe.com/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-champagne-400 hover:text-champagne-300"
              >
                Payment Settings →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
