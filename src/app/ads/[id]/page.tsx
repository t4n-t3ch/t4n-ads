// src/app/ads/[id]/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Ad } from '@/types'

export default function AdDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAd() {
      const { data: adData, error } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching ad:', error)
      } else {
        setAd(adData)
      }
      setLoading(false)
    }

    if (id) {
      fetchAd()
    }
  }, [id])

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!ad) {
    return <div className="p-8 text-center">Ad not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {ad.image && (
          <div className="relative h-96">
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
          <p className="text-gray-600 mb-6">{ad.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              ${ad.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              Posted on {new Date(ad.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}