"use client";

import { useSession } from "next-auth/react";
import { useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/layout/app-layout";
import TodayMetricsDisplay from "@/components/metrics/today-metrics-display";
import { Calendar, Target, TrendingUp, Plus } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const metricsRef = useRef<HTMLDivElement>(null);

  // Show welcome toast for new sign-ins
  useEffect(() => {
    if (status === "authenticated" && session) {
      // Check if this is a fresh sign-in by looking for auth-related URL params
      const isNewSignIn = window.location.href.includes("callbackUrl") || 
                          window.location.href.includes("callback") ||
                          sessionStorage.getItem("justSignedIn");
      
      if (isNewSignIn) {
        toast.success(`Welcome back, ${session.user?.name || session.user?.email}! 🎉`, {
          description: "You've successfully signed in to DayStack",
          duration: 4000,
        });
        
        // Clear the flag
        sessionStorage.removeItem("justSignedIn");
        
        // Clean up the URL
        if (window.location.href.includes("callbackUrl")) {
          window.history.replaceState({}, document.title, "/dashboard");
        }
      }
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          Loading...
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const scrollToMetrics = () => {
    metricsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Good morning, {session?.user?.name || 'there'}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {currentDate} • Let's make today count
            </p>
            
            {/* Navigation Test */}
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ Authentication successful! You can now navigate to:
                <span className="ml-2 space-x-2">
                  <Link href="/habits" className="text-green-600 dark:text-green-400 hover:underline font-medium">Habits</Link>
                  <span className="text-green-400">•</span>
                  <Link href="/insights" className="text-green-600 dark:text-green-400 hover:underline font-medium">Insights</Link>
                  <span className="text-green-400">•</span>
                  <Link href="/settings" className="text-green-600 dark:text-green-400 hover:underline font-medium">Settings</Link>
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Daily Check-in</CardTitle>
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription>
                  Record today's mood, energy, and productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={scrollToMetrics}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Today's Metrics
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Habits</CardTitle>
                  <Target className="h-5 w-5 text-green-500" />
                </div>
                <CardDescription>
                  Track and manage your daily habits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/habits">
                  <Button className="w-full" variant="outline">
                    Manage Habits
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Insights</CardTitle>
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                </div>
                <CardDescription>
                  View your progress and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/insights">
                  <Button className="w-full" variant="outline">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Today's Metrics */}
          <div ref={metricsRef} className="mb-8">
            <TodayMetricsDisplay />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Heatmap</CardTitle>
                <CardDescription>
                  Your activity over the past 90 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-3 text-gray-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Heatmap coming in Phase 6!
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your metrics and habit completion over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-3 text-blue-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 text-sm">
                      Activity history coming in Phase 6!
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}