'use client'

import { useState } from 'react'
import {
  Settings,
  User,
  Bell,
  CreditCard,
  Globe,
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Save,
} from 'lucide-react'

const tabs = [
  { id: 'business', label: 'Business Info', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Settings },
  { id: 'account', label: 'Account', icon: User },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="text-obsidian-400 text-sm">
          Manage your business settings and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="glass rounded-sm p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-champagne-500/10 text-champagne-400'
                    : 'text-obsidian-400 hover:text-white hover:bg-obsidian-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'business' && (
            <div className="glass rounded-sm p-6 space-y-6">
              <h2 className="font-display text-xl">Business Information</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <input type="text" defaultValue="DetailStack" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Email</label>
                  <input type="email" defaultValue="hello@detailstack.com" className="w-full" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="tel" defaultValue="(323) 371-4373" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input type="url" defaultValue="https://detailstack.com" className="w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Address</label>
                <input type="text" defaultValue="8500 Sunset Blvd, West Hollywood, CA 90069" className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Hours</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" defaultValue="8:00 AM" placeholder="Open" className="w-full" />
                  <input type="text" defaultValue="7:00 PM" placeholder="Close" className="w-full" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Zone</label>
                <select className="w-full" defaultValue="America/Los_Angeles">
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                </select>
              </div>

              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass rounded-sm p-6 space-y-6">
              <h2 className="font-display text-xl">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-obsidian-800">
                  <div>
                    <div className="font-medium text-white">New Booking Alerts</div>
                    <div className="text-sm text-obsidian-400">Get notified when a new appointment is booked</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-obsidian-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-champagne-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-obsidian-800">
                  <div>
                    <div className="font-medium text-white">Cancellation Alerts</div>
                    <div className="text-sm text-obsidian-400">Get notified when an appointment is cancelled</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-obsidian-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-champagne-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-obsidian-800">
                  <div>
                    <div className="font-medium text-white">Payment Received</div>
                    <div className="text-sm text-obsidian-400">Get notified when a payment is processed</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-obsidian-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-champagne-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-obsidian-800">
                  <div>
                    <div className="font-medium text-white">Daily Summary</div>
                    <div className="text-sm text-obsidian-400">Receive a daily summary of your appointments</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-obsidian-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-champagne-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-medium text-white">SMS Notifications</div>
                    <div className="text-sm text-obsidian-400">Receive text messages for important alerts</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-obsidian-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-champagne-500"></div>
                  </label>
                </div>
              </div>

              <button className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* Stripe */}
              <div className="glass rounded-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-sm bg-[#635BFF]/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#635BFF]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">Stripe</h3>
                      <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full">Connected</span>
                    </div>
                    <p className="text-sm text-obsidian-400 mb-4">Process payments securely with Stripe</p>
                    <button className="text-sm text-champagne-400 hover:text-champagne-300">
                      Manage Connection →
                    </button>
                  </div>
                </div>
              </div>

              {/* Google Calendar */}
              <div className="glass rounded-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-sm bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">Google Calendar</h3>
                      <span className="px-2 py-1 text-xs bg-obsidian-700 text-obsidian-400 rounded-full">Not Connected</span>
                    </div>
                    <p className="text-sm text-obsidian-400 mb-4">Sync appointments with Google Calendar</p>
                    <button className="btn-secondary text-sm py-2">
                      Connect Google Calendar
                    </button>
                  </div>
                </div>
              </div>

              {/* Twilio SMS */}
              <div className="glass rounded-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-sm bg-red-500/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">Twilio SMS</h3>
                      <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full">Connected</span>
                    </div>
                    <p className="text-sm text-obsidian-400 mb-4">Send SMS reminders to customers</p>
                    <button className="text-sm text-champagne-400 hover:text-champagne-300">
                      Configure SMS Templates →
                    </button>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="glass rounded-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-sm bg-champagne-500/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-champagne-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">Email Notifications</h3>
                      <span className="px-2 py-1 text-xs bg-green-500/10 text-green-400 rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-obsidian-400 mb-4">Automated booking confirmations and reminders</p>
                    <button className="text-sm text-champagne-400 hover:text-champagne-300">
                      Customize Email Templates →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="glass rounded-sm p-6 space-y-6">
                <h2 className="font-display text-xl">Account Settings</h2>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-champagne-500/30 to-champagne-600/10 flex items-center justify-center">
                    <span className="font-display text-2xl text-champagne-400">JD</span>
                  </div>
                  <div>
                    <button className="text-sm text-champagne-400 hover:text-champagne-300">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input type="text" defaultValue="John Detailer" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" defaultValue="john@detailstack.com" className="w-full" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input type="tel" defaultValue="(323) 555-0000" className="w-full" />
                </div>

                <button className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Update Profile
                </button>
              </div>

              <div className="glass rounded-sm p-6 space-y-6">
                <h2 className="font-display text-xl flex items-center gap-2">
                  <Lock className="w-5 h-5 text-champagne-500" />
                  Security
                </h2>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full" />
                  </div>
                </div>

                <button className="btn-secondary">
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}