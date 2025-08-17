"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

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

  if (!session) {
    return null; // Will redirect to sign-in
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {session.user?.name}
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="outline"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Check-in</CardTitle>
              <CardDescription>
                Track your mood, energy, and productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Add Today&apos;s Metrics</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Habits</CardTitle>
              <CardDescription>
                Manage and track your daily habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Habits
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                View your progress and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Progress Heatmap</CardTitle>
            <CardDescription>
              Your activity over the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <span className="text-gray-500">Heatmap coming soon...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}