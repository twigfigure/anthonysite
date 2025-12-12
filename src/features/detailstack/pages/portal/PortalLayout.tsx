import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  Settings,
  Menu,
  LogOut,
  Bell,
  ChevronDown,
  Car,
} from 'lucide-react'

const navItems = [
  { href: '/detailstack/portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/detailstack/portal/appointments', label: 'Appointments', icon: Calendar },
  { href: '/detailstack/portal/customers', label: 'Customers', icon: Users },
  { href: '/detailstack/portal/team', label: 'Team', icon: Users },
  { href: '/detailstack/portal/payments', label: 'Payments', icon: CreditCard },
  { href: '/detailstack/portal/services', label: 'Services', icon: Car },
  { href: '/detailstack/portal/settings', label: 'Settings', icon: Settings },
]

export default function PortalLayout() {
  const location = useLocation()
  const pathname = location.pathname
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-obsidian-950 flex ds-page">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-obsidian-900 border-r border-obsidian-800 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-obsidian-800">
            <Link to="/detailstack/portal" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-champagne-400 to-champagne-600 rounded-sm flex items-center justify-center">
                <span className="ds-font-display text-obsidian-950 text-xl tracking-wider">DS</span>
              </div>
              <div>
                <span className="ds-font-display text-lg tracking-[0.15em] text-white">DETAIL</span>
                <span className="ds-font-display text-lg tracking-[0.15em] text-champagne-400">STACK</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/detailstack/portal' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all ${
                    isActive
                      ? 'bg-champagne-500/10 text-champagne-400 border-l-2 border-champagne-500'
                      : 'text-obsidian-400 hover:text-white hover:bg-obsidian-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-obsidian-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-500/30 to-champagne-600/10 flex items-center justify-center">
                <span className="ds-font-display text-champagne-400">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">John Detailer</div>
                <div className="text-xs text-obsidian-500 truncate">Owner</div>
              </div>
              <ChevronDown className="w-4 h-4 text-obsidian-500" />
            </div>
            <Link
              to="/detailstack"
              className="flex items-center gap-2 text-sm text-obsidian-500 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Back to Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 ds-glass border-b border-obsidian-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-obsidian-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-obsidian-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-champagne-500 rounded-full" />
              </button>

              {/* View Site Link */}
              <Link
                to="/detailstack"
                className="hidden sm:flex items-center gap-2 text-sm text-obsidian-400 hover:text-champagne-400 transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
