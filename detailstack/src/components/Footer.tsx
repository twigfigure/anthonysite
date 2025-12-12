'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  services: [
    { label: 'ECO Wash', href: '#packages' },
    { label: 'Complete Detail', href: '#packages' },
    { label: 'Interior Detail', href: '#packages' },
    { label: 'Ceramic Coating', href: '#packages' },
    { label: 'Paint Correction', href: '#packages' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Our Team', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Contact', href: '#contact' },
  ],
  support: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Booking Policy', href: '#' },
    { label: 'Gift Cards', href: '#' },
    { label: 'Refer a Friend', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="relative bg-obsidian-900/50 border-t border-obsidian-800/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-champagne-400 to-champagne-600 rounded-sm flex items-center justify-center">
                <span className="font-display text-obsidian-950 text-xl tracking-wider">DS</span>
              </div>
              <div>
                <span className="font-display text-xl tracking-[0.2em] text-white">DETAIL</span>
                <span className="font-display text-xl tracking-[0.2em] text-champagne-400">STACK</span>
              </div>
            </Link>

            <p className="text-obsidian-400 text-sm mb-6 max-w-xs leading-relaxed">
              Los Angeles&apos;s premier auto detailing studio. Transforming vehicles into showroom
              masterpieces since 2018.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <a
                href="tel:+13233714373"
                className="flex items-center gap-2 text-obsidian-400 hover:text-champagne-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (323) 371-4373
              </a>
              <a
                href="mailto:hello@detailstack.com"
                className="flex items-center gap-2 text-obsidian-400 hover:text-champagne-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@detailstack.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full glass-light flex items-center justify-center text-obsidian-400 hover:text-champagne-400 hover:border-champagne-500/30 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-obsidian-400 hover:text-champagne-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-obsidian-400 hover:text-champagne-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-obsidian-400 hover:text-champagne-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg tracking-wider text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-obsidian-400 hover:text-champagne-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-obsidian-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-obsidian-500">
            &copy; {new Date().getFullYear()} DetailStack. All rights reserved.
          </p>
          <p className="text-sm text-obsidian-600">
            Crafted with precision in Los Angeles
          </p>
        </div>
      </div>
    </footer>
  )
}