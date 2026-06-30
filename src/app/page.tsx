'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)

  const features = [
    {
      title: 'AI-Powered Scripts',
      description: 'Generate compelling video scripts in seconds using advanced AI models.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'from-orange-500 to-amber-500'
    },
    {
      title: 'Multiple Aspect Ratios',
      description: 'Create videos for any platform: 16:9, 9:16, 1:1, and custom ratios.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      ),
      color: 'from-amber-500 to-yellow-500'
    },
    {
      title: 'Professional Templates',
      description: 'Start with professionally designed templates for any use case.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: 'from-yellow-500 to-lime-500'
    },
    {
      title: 'Instant Rendering',
      description: 'Get your video ready in minutes, not hours. No rendering queues.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-lime-500 to-emerald-500'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Describe Your Ad',
      description: 'Tell us what you need. Our AI understands your brand voice and goals.'
    },
    {
      number: '2',
      title: 'Customize & Preview',
      description: 'Choose aspect ratio, duration, and style. Preview instantly.'
    },
    {
      number: '3',
      title: 'Download & Share',
      description: 'Get your high-quality video ready for any platform.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director, TechFlow',
      content: 'T4N Ads cut our video production time by 90%. We went from concept to published ad in under 10 minutes.',
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Founder, UrbanBrew',
      content: 'As a small business, we couldn\'t afford professional video ads. T4N gave us agency-quality results at 1/10th the cost.',
      avatar: 'MR'
    },
    {
      name: 'Jessica Park',
      role: 'Social Media Manager, StyleHub',
      content: 'The platform is incredibly intuitive. Our engagement rates tripled after switching to AI-generated video ads.',
      avatar: 'JP'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-purple-900/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Create <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">AI Video Ads</span> in Seconds
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
              Transform your ideas into stunning video advertisements with the power of artificial intelligence. No experience required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/generate"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button
                onClick={() => setIsPlaying(true)}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-300 border border-gray-700"
              >
                <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Demo Video Placeholder */}
          <div className={cn(
            "relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-black",
            isPlaying ? "block" : "hidden"
          )}>
            <div className="aspect-video bg-gradient-to-br from-orange-900/20 to-purple-900/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Demo Video Preview</h3>
                <p className="text-gray-400">See how T4N Ads transforms a simple prompt into a professional video ad</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need to Create Amazing Ads</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with professional video production tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                <div className={`relative mb-6 w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps from idea to published ad
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none md:right-full top-8 md:top-1/2 md:-translate-y-1/2 w-8 h-8">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
                  )}
                </div>
                <div className="relative text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Marketers Worldwide</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what professionals are saying about T4N Ads
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative p-8 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-orange-500/50 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
                <div className="mt-6 flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-purple-900/10" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Video Ads?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of marketers creating better ads faster with AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/generate"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all duration-300 border border-gray-700"
                >
                  View Pricing Plans
                </Link>
              </div>
              <p className="mt-8 text-gray-500 text-sm">
                No credit card required • 10 free credits included • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}