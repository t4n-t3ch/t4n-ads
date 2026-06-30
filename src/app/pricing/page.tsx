'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Check, X, Zap, Crown, Building } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: '£0',
    description: 'Perfect for trying out AI video generation',
    icon: Zap,
    color: 'from-gray-500 to-gray-700',
    buttonColor: 'bg-gray-700 hover:bg-gray-600',
    features: [
      { text: '10 credits per month', included: true },
      { text: '720p video resolution', included: true },
      { text: '10 second max duration', included: true },
      { text: 'Basic templates', included: true },
      { text: 'Watermarked videos', included: true },
      { text: 'Standard generation speed', included: true },
      { text: 'Community support', included: true },
      { text: '1080p resolution', included: false },
      { text: 'Priority generation', included: false },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
      { text: 'Dedicated support', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '£19',
    description: 'For creators and small businesses',
    icon: Crown,
    color: 'from-orange-500 to-orange-700',
    buttonColor: 'bg-orange-600 hover:bg-orange-500',
    features: [
      { text: '500 credits per month', included: true },
      { text: '1080p video resolution', included: true },
      { text: '60 second max duration', included: true },
      { text: 'All templates', included: true },
      { text: 'No watermark', included: true },
      { text: 'Priority generation', included: true },
      { text: 'Email support', included: true },
      { text: '4K resolution', included: false },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
      { text: 'Dedicated support', included: false },
      { text: 'Custom templates', included: false },
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Business',
    price: '£49',
    description: 'For agencies and large teams',
    icon: Building,
    color: 'from-purple-500 to-purple-700',
    buttonColor: 'bg-purple-600 hover:bg-purple-500',
    features: [
      { text: 'Unlimited credits', included: true },
      { text: '4K video resolution', included: true },
      { text: 'Unlimited duration', included: true },
      { text: 'All templates + custom', included: true },
      { text: 'Custom branding', included: true },
      { text: 'Highest priority', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'White-label option', included: true },
      { text: 'Custom AI training', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  {
    question: 'What are credits?',
    answer: 'Credits are used to generate videos. Each video generation consumes credits based on duration and resolution. 1 credit = 1 second of 720p video.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You\'ll retain access until the end of your billing period.',
  },
  {
    question: 'Do unused credits roll over?',
    answer: 'Unused credits roll over for up to 3 months on Pro and Business plans. Free plan credits reset monthly.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for Business plans.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! The Free plan is completely free forever. You can upgrade to Pro with a 14-day money-back guarantee.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Free') {
      router.push('/generate')
    } else if (planName === 'Pro') {
      // In a real app, this would redirect to Stripe checkout
      alert('Pro plan checkout would open here. In production, this would integrate with Stripe.')
    } else {
      router.push('mailto:sales@t4n-ads.com?subject=Business%20Plan%20Inquiry')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Choose the perfect plan for your video creation needs. No hidden fees, no surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-800 rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-all',
                billingCycle === 'monthly'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-medium transition-all',
                billingCycle === 'yearly'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Yearly <span className="ml-1 text-xs bg-green-600 px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-2xl p-8 border transition-all hover:scale-[1.02]',
                tier.popular
                  ? 'border-orange-500 bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl shadow-orange-500/20'
                  : 'border-gray-800 bg-gray-900/50'
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${tier.color}`}>
                    <tier.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>
                
                <div className="mb-4">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  <span className="text-gray-400">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                </div>
                
                <p className="text-gray-300">{tier.description}</p>
              </div>

              <button
                onClick={() => handleSelectPlan(tier.name)}
                className={cn(
                  'w-full py-3 rounded-lg font-semibold transition-all mb-8',
                  tier.buttonColor,
                  tier.popular && 'shadow-lg shadow-orange-500/30'
                )}
              >
                {tier.cta}
              </button>

              <ul className="space-y-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-200' : 'text-gray-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Plan Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-6 font-semibold text-gray-300">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.name} className="text-center p-6 font-semibold">
                      <div className="flex flex-col items-center">
                        <span className="text-lg">{tier.name}</span>
                        <span className="text-sm text-gray-400">{tier.price}/month</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Video Credits', free: '10/mo', pro: '500/mo', business: 'Unlimited' },
                  { feature: 'Max Resolution', free: '720p', pro: '1080p', business: '4K' },
                  { feature: 'Max Duration', free: '10s', pro: '60s', business: 'Unlimited' },
                  { feature: 'Watermark', free: 'Yes', pro: 'No', business: 'No' },
                  { feature: 'Generation Priority', free: 'Standard', pro: 'High', business: 'Highest' },
                  { feature: 'Custom Branding', free: 'No', pro: 'No', business: 'Yes' },
                  { feature: 'API Access', free: 'No', pro: 'No', business: 'Yes' },
                  { feature: 'Support', free: 'Community', pro: 'Email', business: 'Dedicated' },
                  { feature: 'Team Collaboration', free: 'No', pro: 'No', business: 'Yes' },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-900/50' : ''}>
                    <td className="p-6 font-medium text-gray-300">{row.feature}</td>
                    <td className="text-center p-6">
                      <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">{row.free}</span>
                    </td>
                    <td className="text-center p-6">
                      <span className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-sm">{row.pro}</span>
                    </td>
                    <td className="text-center p-6">
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm">{row.business}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-200">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-4">Ready to create amazing videos?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of creators and businesses using T4N Ads
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/generate')}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-400 transition-all"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="px-8 py-3 border border-gray-700 rounded-lg font-semibold hover:border-gray-600 hover:bg-gray-800/50 transition-all"
              >
                Schedule a Demo
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              No credit card required for Free plan • 14-day money-back guarantee on Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}