"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Zap, TrendingUp, Users, CreditCard } from "lucide-react";

interface DashboardStats {
  totalCredits: number;
  creditsUsed: number;
  creditsRemaining: number;
  totalGenerations: number;
  activeSubscriptions: number;
  monthlyUsage: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCredits: 100,
    creditsUsed: 45,
    creditsRemaining: 55,
    totalGenerations: 127,
    activeSubscriptions: 1,
    monthlyUsage: 32,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: "Image generation", credits: 5, timestamp: "2023-10-15 14:30" },
    { id: 2, action: "Video upscale", credits: 10, timestamp: "2023-10-14 09:15" },
    { id: 3, action: "Text to speech", credits: 3, timestamp: "2023-10-13 16:45" },
    { id: 4, action: "Music generation", credits: 15, timestamp: "2023-10-12 11:20" },
  ]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  const handleGenerate = () => {
    router.push("/generate");
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back! Here&apos;s your usage overview.</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
              onClick={() => router.push("/history")}
            >
              View History
            </Button>
            <Button className="bg-[#f97316] hover:bg-orange-600" onClick={handleGenerate}>
              <Plus className="mr-2 h-4 w-4" />
              New Generation
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#f97316]" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
                  <Zap className="h-4 w-4 text-[#f97316]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.creditsRemaining}</div>
                  <p className="text-xs text-gray-400">
                    {stats.creditsUsed} of {stats.totalCredits} used
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#f97316] h-2 rounded-full"
                      style={{ width: `${(stats.creditsUsed / stats.totalCredits) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#f97316]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalGenerations}</div>
                  <p className="text-xs text-gray-400">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <Users className="h-4 w-4 text-[#f97316]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                  <p className="text-xs text-gray-400">Pro Plan</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                  <CreditCard className="h-4 w-4 text-[#f97316]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.monthlyUsage}%</div>
                  <p className="text-xs text-gray-400">+8% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest generation history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-400">{activity.timestamp}</p>
                        </div>
                        <Badge variant="outline" className="border-[#f97316] text-[#f97316]">
                          -{activity.credits} credits
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account and credits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full bg-[#f97316] hover:bg-orange-600"
                    onClick={handleGenerate}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Content
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800"
                    onClick={handleUpgrade}
                  >
                    Upgrade Plan
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800"
                    onClick={() => router.push("/billing")}
                  >
                    Billing Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800"
                    onClick={() => router.push("/support")}
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Low Credits Warning */}
            {stats.creditsRemaining < 20 && (
              <Card className="mt-6 border-red-800 bg-red-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="rounded-full bg-red-900 p-2 mr-4">
                        <Zap className="h-5 w-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-bold">Low Credits Warning</h3>
                        <p className="text-sm text-gray-300">
                          You have only {stats.creditsRemaining} credits remaining. Upgrade your plan
                          to avoid interruption.
                        </p>
                      </div>
                    </div>
                    <Button className="bg-[#f97316] hover:bg-orange-600" onClick={handleUpgrade}>
                      Add Credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}