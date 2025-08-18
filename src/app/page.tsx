"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                DayStack
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              ) : session ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome, {session.user?.name}
                  </span>
                  <Button asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your
            <span className="text-blue-600 dark:text-blue-400"> Daily Progress</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Build better habits and track your daily metrics with beautiful GitHub-style heatmaps. 
            Monitor your mood, energy, productivity, and custom habits all in one place.
          </p>
          
          {!session && (
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/sign-in">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Link href={session ? "/dashboard" : "/sign-in"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Daily Metrics
                </CardTitle>
                <CardDescription>
                  Track your mood, energy, and productivity levels on a 1-10 scale
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={session ? "/habits" : "/sign-in"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✅ Custom Habits
                </CardTitle>
                <CardDescription>
                  Create and track both boolean and quantity-based habits
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={session ? "/insights" : "/sign-in"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔥 Heatmap Visualization
                </CardTitle>
                <CardDescription>
                  Visualize your consistency with beautiful GitHub-style heatmaps
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={session ? "/insights" : "/sign-in"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📈 Analytics
                </CardTitle>
                <CardDescription>
                  View trends, streaks, and detailed progress statistics
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href={session ? "/settings" : "/sign-in"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌙 Dark Mode
                </CardTitle>
                <CardDescription>
                  Beautiful interface that adapts to your preference
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📱 Responsive
              </CardTitle>
              <CardDescription>
                Works seamlessly on desktop and mobile devices
              </CardDescription>
            </CardHeader>
            </Card>
        </div>
      </div>
    </div>
  );
}
