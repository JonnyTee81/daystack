"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Smile, Zap, TrendingUp, Edit, Calendar, StickyNote } from "lucide-react";
import { api } from "@/trpc/client";
import DailyMetricsForm from "./daily-metrics-form";

interface TodayMetricsDisplayProps {
  date?: Date;
}

const MetricDisplay = ({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  emoji 
}: { 
  icon: any; 
  label: string; 
  value: number; 
  color: string; 
  emoji: string;
}) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className="font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-2xl">{emoji}</span>
      <Badge variant="secondary" className="text-sm font-bold">
        {value}/10
      </Badge>
    </div>
  </div>
);

export default function TodayMetricsDisplay({ date = new Date() }: TodayMetricsDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Normalize date to start of day for consistent querying
  const queryDate = new Date(date);
  queryDate.setHours(0, 0, 0, 0);

  const { data: metrics, isLoading, refetch } = api.metrics.getDay.useQuery({
    date: queryDate,
  });

  const handleEditComplete = () => {
    setIsEditing(false);
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              Loading...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <DailyMetricsForm
        initialData={metrics ? {
          mood: metrics.mood,
          energy: metrics.energy,
          productivity: metrics.productivity,
          note: metrics.note,
        } : undefined}
        onSuccess={handleEditComplete}
      />
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Metrics
          </CardTitle>
          <CardDescription>
            You haven't recorded your metrics for today yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-16 w-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Take a moment to reflect on your day and record how you're feeling.
            </p>
            <Button onClick={() => setIsEditing(true)}>
              Record Today's Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get emoji and color for metrics
  const getMoodEmoji = (value: number) => {
    if (value <= 2) return "😞";
    if (value <= 4) return "😕";
    if (value <= 6) return "😐";
    if (value <= 8) return "😊";
    return "😁";
  };

  const getEnergyEmoji = (value: number) => {
    if (value <= 2) return "🔋";
    if (value <= 4) return "😴";
    if (value <= 6) return "😌";
    if (value <= 8) return "⚡";
    return "🚀";
  };

  const getProductivityEmoji = (value: number) => {
    if (value <= 2) return "🐌";
    if (value <= 4) return "😞";
    if (value <= 6) return "😐";
    if (value <= 8) return "💪";
    return "🔥";
  };

  const getMetricColor = (value: number) => {
    if (value <= 3) return "text-red-500";
    if (value <= 5) return "text-orange-500";
    if (value <= 7) return "text-yellow-500";
    return "text-green-500";
  };

  const averageScore = Math.round((metrics.mood + metrics.energy + metrics.productivity) / 3 * 10) / 10;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Metrics
            </CardTitle>
            <CardDescription>
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Average: {averageScore}/10
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <MetricDisplay
            icon={Smile}
            label="Mood"
            value={metrics.mood}
            color={getMetricColor(metrics.mood)}
            emoji={getMoodEmoji(metrics.mood)}
          />
          <MetricDisplay
            icon={Zap}
            label="Energy"
            value={metrics.energy}
            color={getMetricColor(metrics.energy)}
            emoji={getEnergyEmoji(metrics.energy)}
          />
          <MetricDisplay
            icon={TrendingUp}
            label="Productivity"
            value={metrics.productivity}
            color={getMetricColor(metrics.productivity)}
            emoji={getProductivityEmoji(metrics.productivity)}
          />
        </div>

        {metrics.note && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <StickyNote className="h-4 w-4" />
                Daily Note
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-400">
                {metrics.note}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}