// src/app/ads/[id]/page.tsx
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Ad } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const { data: ad, error } = await supabase
    .from('ads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !ad) {
    notFound();
  }

  const typedAd = ad as Ad;

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{typedAd.title}</h1>
          <p className="text-gray-400">
            Posted on {formatDate(typedAd.createdAt)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900">
            {typedAd.image ? (
              <Image
                src={typedAd.image}
                alt={typedAd.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No image available
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <h2 className="text-2xl font-bold mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Description</h3>
                  <p className="text-gray-300 whitespace-pre-line">{typedAd.description}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Price</h3>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-[#f97316]">
                      ${typedAd.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">Ad ID</h3>
                  <p className="text-gray-400 font-mono">{typedAd.id}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-[#f97316] hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Contact Seller
              </button>
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}