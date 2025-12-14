import type { Metadata } from 'next'
import { Outfit, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { PersistentLayout } from '@/components/layout/PersistentLayout'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Xandeum pNode Analytics | Network Dashboard',
  description: 'Real-time analytics and monitoring dashboard for Xandeum pNodes - Track performance, storage capacity, and network health of the decentralized storage layer for Solana.',
  keywords: ['Xandeum', 'pNode', 'Solana', 'analytics', 'blockchain', 'storage', 'decentralized'],
  openGraph: {
    title: 'Xandeum pNode Analytics',
    description: 'Real-time monitoring dashboard for Xandeum decentralized storage network',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-midnight-950 text-white min-h-screen">
        <Providers>
          <PersistentLayout>
            {children}
          </PersistentLayout>
        </Providers>
      </body>
    </html>
  )
}
