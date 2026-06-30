'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingTier {
  id: string
  name: string
  description: string
  price: string
  period: string
  credits: string
  features: string[]
  limitations: string[]
  ctaText: string
  ctaLink: string
  highlighted: boolean
  color: string
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out AI video generation',
    price: '£0',
    period: 'per month',
    credits: '10 credits',
    features: [
      '720p video resolution',
      'Up to 10 seconds per video',
      'Basic video templates',
      'Watermarked output',
      'Community support',
      '5 videos per month'
    ],
    limitations: [
      'No priority generation',
      'No custom branding',
      'Limited to 3 styles'
    ],
    ctaText: 'Get Started Free',
    ctaLink: '/generate',
    highlighted: false,
    color: 'border-gray-700'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For creators and small businesses',
    price: '£19',
    period: 'per month',
    credits: '500 credits',
    features: [
      '1080p video resolution',
      'Up to 60 seconds per video',
      'All premium templates',
      'No watermark',
      'Priority generation',
      'Commercial license',
      'Custom aspect ratios',
      'Advanced styles & effects'
    ],
    limitations: [
      'No 4K resolution',
      'Limited to 1000 videos/month'
    ],
    ctaText: 'Start Pro Trial',
    ctaLink: '/dashboard?plan=pro',
    highlighted: true,
    color: 'border-orange-500'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For agencies and large teams',
    price: '£49',
    period: 'per month',
    credits: 'Unlimited',
    features: [
      '4K video resolution',
      'Unlimited video length',
      'Custom branding',
      'White-label output',
      'Highest priority generation',
      'Team collaboration',
      'API access',
      'Custom templates',
      'Dedicated support',
      'Analytics dashboard'
    ],
    limitations: [],
    ctaText: 'Contact Sales',
    ctaLink: '/contact',
    highlighted: false,
    color: 'border-purple-500'
  }
]

const featureComparison = [
  {
    name: 'Video Resolution',
    free: '720p',
    pro: '1080p',
    business: '4K'
  },
  {
    name: 'Max Video Duration',
    free: '10 seconds',
    pro: '60 seconds',
    business: 'Unlimited'
  },
  {
    name: 'Monthly Credits',
    free: '10',
    pro: '500',
    business: 'Unlimited'
  },
  {
    name: 'Watermark',
    free: 'Yes',
    pro: 'No',
    business: 'No'
  },
  {
    name: 'Priority Generation',
    free: 'No',
    pro: 'Yes',
    business: 'Highest'
  },
  {
    name: 'Commercial License',
    free: 'No',
    pro: 'Yes',
    business: 'Yes'
  },
  {
    name: 'Custom Branding',
    free: 'No',
    pro: 'Limited',
    business: 'Full'
  },
  {
    name: 'API Access',
    free: 'No',
    pro: 'No',
    business: 'Yes'
  },
  {
    name: 'Support',
    free: 'Community',
    pro: 'Email',
    business: 'Dedicated'
  }
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const calculateYearlyPrice = (monthlyPrice: string): string => {
    const price = parseInt(monthlyPrice.replace('£', ''))
    if (isNaN(price)) return monthlyPrice
    const yearlyPrice = price * 12 * 0.8 // 20% discount
    return `£${yearlyPrice.toFixed(0)}`
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Choose the perfect plan for your video creation needs. All plans include our core AI video generation features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-900 rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-all',
                billingPeriod === 'monthly'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-all',
                billingPeriod === 'yearly'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Yearly <span className="ml-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                'relative rounded-2xl border-2 p-8 transition-all hover:scale-[1.02]',
                tier.highlighted
                  ? 'bg-gray-900/50 border-orange-500 shadow-2xl shadow-orange-500/20'
                  : 'bg-gray-900/30 border-gray-700 hover:border-gray-600',
                tier.color
              )}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-bold">
                    {billingPeriod === 'yearly' ? calculateYearlyPrice(tier.price) : tier.price}
                  </span>
                  <span className="text-gray-400 ml-2">{tier.period}</span>
                </div>
                
                <div className="text-lg font-semibold text-orange-400 mb-6">
                  {tier.credits}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-lg">Features</h4>
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {tier.limitations.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-lg text-gray-400">Limitations</h4>
                  <ul className="space-y-3">
                    {tier.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start">
                        <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href={tier.ctaLink}
                className={cn(
                  'block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all',
                  tier.highlighted
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                )}
              >
                {tier.ctaText}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
          
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="text-left p-6 font-semibold">Feature</th>
                  <th className="text-center p-6 font-semibold">Free</th>
                  <th className="text-center p-6 font-semibold bg-orange-500/10">Pro</th>
                  <th className="text-center p-6 font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, index) => (
                  <tr 
                    key={feature.name} 
                    className={cn(
                      'border-t border-gray-800',
                      index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-900/10'
                    )}
                  >
                    <td className="p-6 font-medium">{feature.name}</td>
                    <td className="text-center p-6">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm',
                        feature.free === 'No' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-green-500/20 text-green-400'
                      )}>
                        {feature.free}
                      </span>
                    </td>
                    <td className="text-center p-6 bg-orange-500/5">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-sm',
                        feature.pro === 'No' 
                          ? 'bg-red-500/20 text-red-400' 
                          : feature.pro === 'Limited'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      )}>
                        {feature.pro}
                      </span>
                    </td>
                    <td className="text-center p-6">
                      <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                        {feature.business}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">What counts as a credit?</h3>
              <p className="text-gray-400">
                One credit equals one second of generated video. A 30-second video would use 30 credits. Credits reset at the beginning of each billing cycle.
              </p>
            </div>
            
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-400">
                Yes, you can change your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your current billing cycle.
              </p>
            </div>
            
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Do you offer refunds?</h3>
              <p className="text-gray-400">
                We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team for a full refund.
              </p>
            </div>
            
            <div className="bg-gray-900/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial for paid plans?</h3>
              <p className="text-gray-400">
                Yes! All paid plans come with a 7-day free trial. You won't be charged until the trial ends, and you can cancel anytime during the trial period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6">Ready to create amazing videos?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and businesses using T4N Ads to generate stunning video content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generate"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-all"
              >
                Start Free Trial
              </Link>
              <Link
                href="/contact"
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all border border-gray-700"
              >
                Contact Sales
              </Link>
            </div>
            <p className="text-gray-500 mt-6 text-sm">
              No credit card required for free plan • Cancel anytime • 14-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}