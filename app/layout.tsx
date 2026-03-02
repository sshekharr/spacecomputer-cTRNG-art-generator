import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'COSMIC ART — True Random Art from Space',
  description: 'Generative art powered by cosmic true random numbers harvested from satellite instrumentation in orbit.',
  keywords: 'cosmic art, generative art, random art, space, satellite, cTRNG',
  openGraph: {
    title: 'COSMIC ART',
    description: 'Generative art from the cosmos',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body className="bg-void text-white overflow-x-hidden">{children}</body>
    </html>
  )
}
