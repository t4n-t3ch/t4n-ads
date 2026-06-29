"use client";
import React from 'react';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Download, Share2, Calendar, Clock, Tag, Eye, ThumbsUp } from "lucide-react";

// Mock data type - replace with actual Prisma Video type
type VideoItem = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  createdAt: Date;
  views: number;
  likes: number;
  tags: string[];
  status: "processing" | "completed" | "failed";
};

export default function GalleryPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockVideos: VideoItem[] = [
      {
        id: "1",
        title: "Summer Product Launch",
        description: "Dynamic video showcasing our latest summer collection with energetic music and smooth transitions.",
        thumbnailUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 45,
        createdAt: new Date("2024-01-15"),
        views: 1245,
        likes: 89,
        tags: ["product", "summer", "launch"],
        status: "completed"
      },
      {
        id: "2",
        title: "Brand Story Animation",
        description: "Animated explainer video telling our brand story with custom illustrations and voiceover.",
        thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 60,
        createdAt: new Date("2024-01-10"),
        views: 892,
        likes: 67,
        tags: ["animation", "brand", "explainer"],
        status: "completed"
      },
      {
        id: "3",
        title: "Social Media Ad Series",
        description: "Short, punchy ads optimized for Instagram and TikTok with captions and trending audio.",
        thumbnailUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 30,
        createdAt: new Date("2024-01-05"),
        views: 2103,
        likes: 145,
        tags: ["social", "ads", "short-form"],
        status: "completed"
      },
      {
        id: "4",
        title: "Holiday Campaign",
        description: "Festive holiday campaign video with warm lighting and seasonal messaging.",
        thumbnailUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 90,
        createdAt: new Date("2023-12-20"),
        views: 3156,
        likes: 203,
        tags: ["holiday", "campaign", "festive"],
        status: "completed"
      },
      {
        id: "5",
        title: "Product Tutorial",
        description: "Step-by-step tutorial video showing how to use our flagship product.",
        thumbnailUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 120,
        createdAt: new Date("2023-12-15"),
        views: 987,
        likes: 56,
        tags: ["tutorial", "how-to", "educational"],
        status: "completed"
      },
      {
        id: "6",
        title: "Customer Testimonial",
        description: "Real customer sharing their positive experience with our service.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 75,
        createdAt: new Date("2023-12-10"),
        views: 743,
        likes: 42,
        tags: ["testimonial", "customer", "review"],
        status: "completed"
      },
      {
        id: "7",
        title: "New Video in Progress",
        description: "This video is currently being processed and will be available soon.",
        thumbnailUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 0,
        createdAt: new Date(),
        views: 0,
        likes: 0,
        tags: ["processing", "new"],
        status: "processing"
      },
      {
        id: "8",
        title: "Year in Review",
        description: "Compilation of our best moments and achievements from the past year.",
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "#",
        duration: 150,
        createdAt: new Date("2023-11-30"),
        views: 1890,
        likes: 134,
        tags: ["review", "compilation", "highlights"],
        status: "completed"
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setVideos(mockVideos);
      setLoading(false);
    }, 800);
  }, []);

  // Extract all unique tags
  const allTags = Array.from(new Set(videos.flatMap(video => video.tags)));

  // Filter videos based on selected tag
  const filteredVideos = selectedTag
    ? videos.filter(video => video.tags.includes(selectedTag))
    : videos;

  // Sort videos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.views - a.views;
    }
  });

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "Processing";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Video Gallery</h1>
          <p className="text-gray-400 mb-6">
            Browse and manage all your generated videos. Click on any video to view details and download.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-500">{videos.length}</div>
              <div className="text-sm text-gray-400">Total Videos</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-500">
                {videos.filter(v => v.status === "completed").length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-500">
                {videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Views</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-500">
                {videos.reduce((sum, v) => sum + v.likes, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Likes</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTag === null
                    ? "bg-orange-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                All Videos
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedTag === tag
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "popular")}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              
              <Link
                href="/generate"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Play size={20} />
                Create New Video
              </Link>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800/30 rounded-xl p-4 animate-pulse">
                <div className="aspect-video bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-gray-700 rounded"></div>
                  <div className="h-3 w-20 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedVideos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">No videos found</div>
            <Link
              href="/generate"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedVideos.map(video => (
              <div
                key={video.id}
                className="group bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded-md text-sm font-medium">
                    {formatDuration(video.duration)}
                  </div>
                  
                  {/* Status Badge */}
                  {video.status === "processing" && (
                    <div className="absolute top-3 left-3 bg-yellow-500/90 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Processing
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Play size={24} fill="white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {video.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTag(tag === selectedTag ? null : tag);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{video.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp size={14} />
                        <span>{video.likes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                    <button
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      disabled={video.status === "processing"}
                    >
                      <Play size={16} />
                      Play
                    </button>
                    <button
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      disabled={video.status === "processing"}
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      disabled={video.status === "processing"}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State for Filter */}
        {!loading && selectedTag && filteredVideos.length === 0 && (
          <div className="text-center py-12">