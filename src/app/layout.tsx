import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'T4N Ads - AI Video Ad Generation Platform',
  description: 'Create professional AI video ads in seconds. Generate, customize, and deploy video ads for social media, marketing, and more.',
  keywords: ['AI video', 'video ads', 'ad generation', 'marketing', 'social media ads'],
  authors: [{ name: 'T4N Tech' }],
  openGraph: {
    type: 'website',
    title: 'T4N Ads - AI Video Ad Generation Platform',
    description: 'Create professional AI video ads in seconds.',
    siteName: 'T4N Ads',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T4N Ads - AI Video Ad Generation Platform',
    description: 'Create professional AI video ads in seconds.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}