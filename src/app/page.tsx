"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Ad } from '@/types';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase()) ||
                         ad.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || ad.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Marketplace <span className="text-blue-600">Ads</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Find the best deals and post your own advertisements
          </p>
        </header>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ads by title or description..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <FiFilter className="text-gray-400" />
              <select
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="vehicles">Vehicles</option>
                <option value="services">Services</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading ads...</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No ads found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {ad.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2">{ad.title}</h3>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">${ad.price}</span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">{ad.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-gray-700">
                          {ad.user_email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{ad.user_email}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(ad.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors duration-300">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{ads.length}</div>
              <div className="text-gray-600 mt-2">Total Ads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {ads.filter(a => a.category === 'electronics').length}
              </div>
              <div className="text-gray-600 mt-2">Electronics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {ads.filter(a => a.category === 'vehicles').length}
              </div>
              <div className="text-gray-600 mt-2">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {new Set(ads.map(a => a.user_email)).size}
              </div>
              <div className="text-gray-600 mt-2">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}