import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI SDR — Kore.ai Intelligence',
  description: 'AI-powered sales development representative for Kore.ai BDR pipeline'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
