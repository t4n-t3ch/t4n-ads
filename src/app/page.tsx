"use client";
import React from 'react';

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Play, CheckCircle } from "lucide-react";

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      title: "AI-Powered Generation",
      description: "Create professional video ads in minutes with our advanced AI.",
      icon: Sparkles,
    },
    {
      title: "Custom Templates",
      description: "Choose from dozens of templates or create your own.",
      icon: Play,
    },
    {
      title: "One-Click Export",
      description: "Download your videos in multiple formats ready for any platform.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
          <span className="text-xl font-bold">t4n-ads</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/login" className="hover:text-orange-400 transition-colors">
            Sign In
          </Link>
          <Link
            href="/generate"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create <span className="text-orange-500">Stunning</span> Video Ads
            <br />
            <span className="text-gray-300">In Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Transform your ideas into engaging video content with our AI-powered platform.
            No design skills needed — just your creativity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/generate"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/gallery"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-gray-700"
            >
              View Gallery
            </Link>
          </div>

          {/* Preview Video Placeholder */}
          <div className="relative mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-2">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-orange-500" fill="currentColor" />
                  </div>
                  <p className="text-gray-400">Video preview will appear here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all hover:scale-105 cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${hoveredFeature === index ? 'text-orange-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your content?</h2>
            <p className="text-gray-400 mb-6">
              Join thousands of creators already using t4n-ads to boost their engagement.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Start Your First Video
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-orange-500 rounded"></div>
            <span className="text-lg font-bold">t4n-ads</span>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <Link href="/generate" className="hover:text-orange-400 transition-colors">
              Generate
            </Link>
            <Link href="/gallery" className="hover:text-orange-400 transition-colors">
              Gallery
            </Link>
            <Link href="/login" className="hover:text-orange-400 transition-colors">
              Account
            </Link>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">
          © {new Date().getFullYear()} t4n-ads. All rights reserved.
        </p>
      </footer>
    </div>
  );
}