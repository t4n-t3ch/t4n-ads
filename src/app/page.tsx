'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, Play, Sparkles, Zap, Shield, Users, BarChart } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would subscribe to newsletter
    alert('Thank you for subscribing! Check your email for updates.')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Video Ads
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Create <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">AI Video Ads</span> in Seconds
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
              Transform your ideas into stunning video advertisements with our cutting-edge AI technology. No video editing skills required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/generate"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-800/50 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-gray-600 hover:bg-gray-800">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-400">No credit card required • 10 free credits every month</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Everything you need to create amazing ads</h2>
            <p className="mt-4 text-xl text-gray-300">Powerful features designed for marketers, creators, and businesses</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-gray-900"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <feature.icon className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">How it works</h2>
            <p className="mt-4 text-xl text-gray-300">Create professional video ads in three simple steps</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-4 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-2xl font-bold">
                  {index + 1}
                </div>
                <div className="ml-8 rounded-2xl border border-gray-800 bg-gray-900/50 p-8 pt-12 backdrop-blur-sm">
                  <h3 className="mb-4 text-2xl font-semibold">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Trusted by creators worldwide</h2>
            <p className="mt-4 text-xl text-gray-300">Join thousands of satisfied users creating better ads faster</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm"
              >
                <div className="mb-6 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Start creating for free</h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-300">
              Get 10 free credits every month. No credit card required.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/generate"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-lg border border-gray-700 bg-gray-800/50 px-10 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-gray-600 hover:bg-gray-800"
              >
                View Pricing Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
            <Zap className="mr-2 h-4 w-4" />
            Stay Updated
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Get the latest AI video tips</h2>
          <p className="mt-4 text-xl text-gray-300">
            Subscribe to our newsletter for tutorials, case studies, and product updates.
          </p>
          <form onSubmit={handleSubmit} className="mt-10 flex max-w-md mx-auto gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-6 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3 font-semibold text-white transition-all hover:scale-105"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-400">No spam. Unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate professional video ads in under 60 seconds with our optimized AI pipeline.',
  },
  {
    icon: Shield,
    title: 'Commercial Rights',
    description: 'All videos come with full commercial rights. Use them anywhere, forever.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, share projects, and collaborate in real-time.',
  },
  {
    icon: BarChart,
    title: 'Performance Analytics',
    description: 'Track engagement, views, and conversion rates for every video you create.',
  },
]

const steps = [
  {
    title: 'Describe Your Ad',
    description: 'Enter a simple text prompt describing your product, service, or message. Our AI understands natural language.',
  },
  {
    title: 'Customize & Style',
    description: 'Choose aspect ratio, duration, and visual style. Pick from cinematic, animated, minimal, or bold themes.',
  },
  {
    title: 'Generate & Download',
    description: 'Click generate and watch your video come to life. Download in MP4 format ready for any platform.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director at TechFlow',
    quote: 'Cut our video production time by 90%. The quality is incredible and our engagement rates have doubled.',
  },
  {
    name: 'Marcus Johnson',
    role: 'E-commerce Founder',
    quote: 'As a solo entrepreneur, I couldn\'t afford professional video ads. T4N Ads changed everything for my business.',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Content Creator',
    quote: 'The AI understands exactly what I need. I\'ve created over 50 videos for my social media channels in just two weeks.',
  },
]