import './globals.css'
import type { Metadata } from 'next'
import ThreeBackground from '@/components/ThreeBackground';
import ClientWrapper from './ClientWrapper';

export const metadata: Metadata = {
  title: 'Aegis Nexus | Agentic AI Resource Allocation',
  description: 'AI-driven Resource Allocation System for NGOs — powered by Google Cloud, Vertex AI & Gemini',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="relative min-h-screen text-gray-100 font-body bg-[#070A12]">
        <ThreeBackground />
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}
