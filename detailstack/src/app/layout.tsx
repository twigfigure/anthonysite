import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DetailStack | Premium Auto Detailing',
  description: 'Experience the art of automotive perfection. Premium hand detailing services that transform your vehicle into a showroom masterpiece.',
  keywords: 'auto detailing, car detailing, ceramic coating, paint correction, premium car care',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-obsidian-950 text-white antialiased">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}