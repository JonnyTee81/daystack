"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Calendar, TrendingUp, Award, Target, ChevronLeft, ChevronRight } from "lucide-react";

interface ProgressData {
  date: string;
  mood: number;
  energy: number;
  productivity: number;
  habitsCompleted: number;
  totalHabits: number;
}

interface ProgressSummaryProps {
  data: ProgressData[];
  title?: string;
}

type Period = "week" | "month" | "quarter";

interface SummaryStats {
  period: string;
  averageMood: number;
  averageEnergy: number;
  averageProductivity: number;
  averageHabitCompletion: number;
  totalDays: number;
  bestDay: ProgressData | null;
  improvementTrend: "up" | "down" | "stable";
}

export default function ProgressSummary({ data, title = "Progress Summary" }: ProgressSummaryProps) {
  const [period, setPeriod] = useState<Period>("week");
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState(0);

  // Group data by selected period
  const periodData = useMemo(() => {
    const grouped: ProgressData[][] = [];
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (period === "week") {
      // Group by weeks (7 days)
      for (let i = 0; i < sortedData.length; i += 7) {
        grouped.push(sortedData.slice(i, i + 7));
      }
    } else if (period === "month") {
      // Group by months
      const monthGroups: { [key: string]: ProgressData[] } = {};
      sortedData.forEach(item => {
        const monthKey = new Date(item.date).toISOString().slice(0, 7); // YYYY-MM
        if (!monthGroups[monthKey]) monthGroups[monthKey] = [];
        monthGroups[monthKey].push(item);
      });
      grouped.push(...Object.values(monthGroups));
    } else {
      // Group by quarters
      const quarterGroups: { [key: string]: ProgressData[] } = {};
      sortedData.forEach(item => {
        const date = new Date(item.date);
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const quarterKey = `${date.getFullYear()}-Q${quarter}`;
        if (!quarterGroups[quarterKey]) quarterGroups[quarterKey] = [];
        quarterGroups[quarterKey].push(item);
      });
      grouped.push(...Object.values(quarterGroups));
    }
    
    return grouped.reverse(); // Most recent first
  }, [data, period]);

  // Calculate summary statistics for current period
  const currentPeriodStats: SummaryStats | null = useMemo(() => {
    if (!periodData[currentPeriodIndex] || periodData[currentPeriodIndex].length === 0) {
      return null;
    }

    const currentData = periodData[currentPeriodIndex];
    const totalDays = currentData.length;

    // Calculate averages
    const averageMood = currentData.reduce((sum, day) => sum + day.mood, 0) / totalDays;
    const averageEnergy = currentData.reduce((sum, day) => sum + day.energy, 0) / totalDays;
    const averageProductivity = currentData.reduce((sum, day) => sum + day.productivity, 0) / totalDays;
    
    // Calculate habit completion rate
    const totalHabitsCompleted = currentData.reduce((sum, day) => sum + day.habitsCompleted, 0);
    const totalHabitsAvailable = currentData.reduce((sum, day) => sum + day.totalHabits, 0);
    const averageHabitCompletion = totalHabitsAvailable > 0 ? (totalHabitsCompleted / totalHabitsAvailable) * 100 : 0;

    // Find best day
    const bestDay = currentData.reduce((best, current) => {
      const currentScore = (current.mood + current.energy + current.productivity) / 3;
      const bestScore = (best.mood + best.energy + best.productivity) / 3;
      return currentScore > bestScore ? current : best;
    });

    // Calculate improvement trend compared to previous period
    let improvementTrend: "up" | "down" | "stable" = "stable";
    if (periodData[currentPeriodIndex + 1]) {
      const previousData = periodData[currentPeriodIndex + 1];
      const previousAvg = previousData.reduce((sum, day) => sum + day.mood + day.energy + day.productivity, 0) / (previousData.length * 3);
      const currentAvg = (averageMood + averageEnergy + averageProductivity) / 3;
      
      if (currentAvg > previousAvg + 0.2) improvementTrend = "up";
      else if (currentAvg < previousAvg - 0.2) improvementTrend = "down";
    }

    // Generate period label
    const firstDay = new Date(currentData[0].date);
    const lastDay = new Date(currentData[currentData.length - 1].date);
    
    let periodLabel: string;
    if (period === "week") {
      periodLabel = `Week of ${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else if (period === "month") {
      periodLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      const quarter = Math.floor(firstDay.getMonth() / 3) + 1;
      periodLabel = `Q${quarter} ${firstDay.getFullYear()}`;
    }

    return {
      period: periodLabel,
      averageMood,
      averageEnergy,
      averageProductivity,
      averageHabitCompletion,
      totalDays,
      bestDay,
      improvementTrend,
    };
  }, [periodData, currentPeriodIndex, period]);

  // Prepare chart data for the current period
  const chartData = useMemo(() => {
    if (!periodData[currentPeriodIndex]) return [];
    
    return periodData[currentPeriodIndex].map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: day.mood,
      energy: day.energy,
      productivity: day.productivity,
      habitCompletion: day.totalHabits > 0 ? (day.habitsCompleted / day.totalHabits) * 100 : 0,
    }));
  }, [periodData, currentPeriodIndex]);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return "📈";
      case "down": return "📉";
      default: return "➡️";
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  if (!currentPeriodStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No data available for the selected period
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              {currentPeriodStats.period} • {currentPeriodStats.totalDays} days
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPeriodIndex(Math.min(currentPeriodIndex + 1, periodData.length - 1))}
                disabled={currentPeriodIndex >= periodData.length - 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPeriodIndex(Math.max(currentPeriodIndex - 1, 0))}
                disabled={currentPeriodIndex <= 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Avg Mood
                </p>
                <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                  {currentPeriodStats.averageMood.toFixed(1)}
                </p>
              </div>
              <span className="text-2xl">😊</span>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Avg Energy
                </p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {currentPeriodStats.averageEnergy.toFixed(1)}
                </p>
              </div>
              <span className="text-2xl">⚡</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Avg Productivity
                </p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {currentPeriodStats.averageProductivity.toFixed(1)}
                </p>
              </div>
              <span className="text-2xl">🎯</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Habit Completion
                </p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                  {Math.round(currentPeriodStats.averageHabitCompletion)}%
                </p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <h4 className="font-medium">Best Day</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(currentPeriodStats.bestDay!.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Progress 
                value={((currentPeriodStats.bestDay!.mood + currentPeriodStats.bestDay!.energy + currentPeriodStats.bestDay!.productivity) / 3) * 10} 
                className="flex-1 h-2" 
              />
              <span className="text-sm font-medium">
                {(((currentPeriodStats.bestDay!.mood + currentPeriodStats.bestDay!.energy + currentPeriodStats.bestDay!.productivity) / 3)).toFixed(1)}/10
              </span>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium">Trend</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getTrendIcon(currentPeriodStats.improvementTrend)}</span>
              <span className={`text-sm font-medium ${getTrendColor(currentPeriodStats.improvementTrend)}`}>
                {currentPeriodStats.improvementTrend === "up" && "Improving"}
                {currentPeriodStats.improvementTrend === "down" && "Declining"}
                {currentPeriodStats.improvementTrend === "stable" && "Stable"}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Compared to previous {period}
            </p>
          </div>
        </div>

        {/* Daily Breakdown Chart */}
        <div>
          <h4 className="font-medium mb-4">Daily Breakdown</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis 
                  domain={[0, 10]}
                  className="text-gray-500 dark:text-gray-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}