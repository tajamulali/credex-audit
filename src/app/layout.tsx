import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Spend Auditor — Find Out If You\'re Overpaying for AI Tools',
  description: 'Free audit tool for startups. Input your AI tool subscriptions and get an instant report on where you\'re overspending and how much you could save.',
  openGraph: {
    title: 'AI Spend Auditor',
    description: 'Find out if your startup is overpaying for AI tools. Free instant audit.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Auditor',
    description: 'Find out if your startup is overpaying for AI tools. Free instant audit.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}