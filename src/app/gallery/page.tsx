"use client";

import React, { useEffect, useState } from 'react';
import { Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  status: 'completed' | 'processing' | 'failed';
  thumbnailUrl: string;
  downloadUrl: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getStatusIcon = (status: Video['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: Video['status']) => {
    switch (status) {
      case 'completed':
        return 'Ready';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
    }
  };

  const handleDownload = (video: Video) => {
    if (video.status === 'completed' && video.downloadUrl) {
      window.open(video.downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold">Error loading gallery</h2>
          <p className="mt-2 text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Video Gallery</h1>
          <p className="text-gray-400 mt-2">View and download your generated videos</p>
        </header>

        {videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">No videos yet</h3>
            <p className="text-gray-400 mt-2">Your generated videos will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <div className="relative aspect-video bg-gray-800">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-gray-600">No thumbnail</div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {getStatusIcon(video.status)}
                      <span className="text-sm font-medium">
                        {getStatusText(video.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{video.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Created {new Date(video.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-4">
                    <button
                      onClick={() => handleDownload(video)}
                      disabled={video.status !== 'completed'}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                        video.status === 'completed'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      {video.status === 'completed' ? 'Download' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}