"use client";
import React from 'react';

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Film, Type, Tag, Palette, Sparkles } from "lucide-react";

export default function GeneratePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    script: "",
    voiceover: "male-energetic",
    music: "upbeat",
    captionStyle: "modern",
    tags: "",
    backgroundColor: "#0f0f11",
    primaryColor: "#f97316",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate video generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setProgress(0);
            router.push("/gallery");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const voiceoverOptions = [
    { value: "male-energetic", label: "Male - Energetic" },
    { value: "female-calm", label: "Female - Calm" },
    { value: "male-authoritative", label: "Male - Authoritative" },
    { value: "female-friendly", label: "Female - Friendly" },
  ];

  const musicOptions = [
    { value: "upbeat", label: "Upbeat & Energetic" },
    { value: "corporate", label: "Corporate & Professional" },
    { value: "cinematic", label: "Cinematic & Epic" },
    { value: "chill", label: "Chill & Relaxed" },
  ];

  const captionStyleOptions = [
    { value: "modern", label: "Modern (Clean)" },
    { value: "bold", label: "Bold & Impactful" },
    { value: "minimal", label: "Minimal & Subtle" },
    { value: "animated", label: "Animated & Dynamic" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Generate <span className="text-orange-500">AI Video Ads</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Create stunning video ads in minutes. Fill out the form below and let AI do the magic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Video Title */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Film className="text-orange-500" size={24} />
                  <h2 className="text-xl font-semibold">Video Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter a catchy title for your video"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Script / Description *
                    </label>
                    <textarea
                      name="script"
                      value={formData.script}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Describe what you want in your video ad. Be specific about scenes, messaging, and call-to-action."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Tip: Include target audience, key benefits, and desired mood.
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Upload className="text-orange-500" size={24} />
                  <h2 className="text-xl font-semibold">Audio Settings</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Voiceover Style
                    </label>
                    <select
                      name="voiceover"
                      value={formData.voiceover}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {voiceoverOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Music
                    </label>
                    <select
                      name="music"
                      value={formData.music}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {musicOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Visual Settings */}
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="text-orange-500" size={24} />
                  <h2 className="text-xl font-semibold">Visual Settings</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Caption Style
                    </label>
                    <select
                      name="captionStyle"
                      value={formData.captionStyle}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {captionStyleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="marketing, product, social-media, etc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={handleInputChange}
                        className="w-12 h-12 cursor-pointer rounded-lg border border-gray-700"
                      />
                      <span className="text-gray-400">{formData.backgroundColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Primary Color (Accent)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className="w-12 h-12 cursor-pointer rounded-lg border border-gray-700"
                      />
                      <span className="text-gray-400">{formData.primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating Video ({progress}%)
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Video Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <Type className="text-orange-500" size={24} />
                  Live Preview
                </h2>

                <div className="space-y-6">
                  {/* Preview Card */}
                  <div 
                    className="rounded-xl overflow-hidden border-2 border-gray-700"
                    style={{ backgroundColor: formData.backgroundColor }}
                  >
                    <div className="p-4">
                      <div className="h-40 bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" 
                               style={{ backgroundColor: formData.primaryColor }}>
                            <Film size={24} />
                          </div>
                          <p className="text-sm text-gray-300">Video Preview</p>
                          <p className="text-xs text-gray-500 mt-1">AI Generated Content</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-semibold text-lg truncate">
                          {formData.title || "Your Video Title"}
                        </h3>
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {formData.script || "Your video description will appear here..."}
                        </p>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          {formData.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: formData.primaryColor + '20',
                                color: formData.primaryColor 
                              }}
                            >
                              {tag.trim()}
                            </span>
                          ))}
                          {!formData.tags && (
                            <span className="text-gray-500 text-sm">No tags added</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Summary */}
                  <div className="bg-gray-900/50 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 text-gray-300">Settings Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Voiceover:</span>
                        <span className="text-white">
                          {voiceoverOptions.find(v => v.value === formData.voiceover)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Music:</span>
                        <span className="text-white">
                          {musicOptions.find(m => m.value === formData.music)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Caption Style:</span>
                        <span className="text-white">
                          {captionStyleOptions.find(c => c.value === formData.captionStyle)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Colors:</span>
                        <div className="flex gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-700"
                            style={{ backgroundColor: formData.backgroundColor }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-700"
                            style={{ backgroundColor: formData.primaryColor }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-4 border border-gray-700">
                    <h3 className="font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <Sparkles size={16} className="text-orange-500" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                        Be specific about your target audience
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                        Include a clear call-to-action
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                        Use tags for better organization
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                        Preview colors before generating
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}