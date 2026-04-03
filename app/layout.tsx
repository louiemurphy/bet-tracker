import type { Metadata } from 'next'
import { Rajdhani } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-raj',
})

export const metadata: Metadata = {
  title: 'Bet Tracker',
  description: 'Personal bet tracking',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} antialiased`}>{children}</body>
    </html>
  )
}