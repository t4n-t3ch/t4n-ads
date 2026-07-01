"use client"

import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface AdCardProps {
  id: string
  title: string
  price: number
  imageUrl?: string
}

export default function AdCard({ id, title, price, imageUrl }: AdCardProps) {
  const router = useRouter()

  const handleViewClick = () => {
    router.push(`/ads/${id}`)
  }

  return (
    <div className="bg-[#0f0f11] border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-600">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 truncate">{title}</h3>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-[#f97316] font-bold text-xl">
            ${price.toLocaleString()}
          </div>
          
          <button
            onClick={handleViewClick}
            className="bg-[#f97316] hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
          >
            View
          </button>
        </div>
      </div>
    </div>
  )
}