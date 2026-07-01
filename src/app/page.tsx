"use client";
import { useEffect, useState } from "react";
import { Ad } from "@/types";
import { fetchAds } from "@/lib/supabase";

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAds() {
      const data = await fetchAds();
      setAds(data);
      setLoading(false);
    }
    loadAds();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading ads...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Ads</h1>
      {ads.length === 0 ? (
        <p className="text-gray-500">No ads available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
              <p className="text-gray-600 mb-4">{ad.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-600">
                  ${ad.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  {ad.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}