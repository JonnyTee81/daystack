"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Target, Flame, Trophy, TrendingUp, Calendar } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  color: string;
  type: "boolean" | "quantity";
  target?: number;
}

interface HabitLog {
  date: string;
  habitId: string;
  completed: boolean;
  value?: number;
}

interface HabitStatsProps {
  habits: Habit[];
  logs: HabitLog[];
  timeRange?: number; // days to look back
}

interface HabitStatistic {
  habitId: string;
  name: string;
  color: string;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  averageValue?: number;
}

export default function HabitStats({ habits, logs, timeRange = 30 }: HabitStatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000);
    
    return habits.map((habit): HabitStatistic => {
      const habitLogs = logs
        .filter(log => log.habitId === habit.id)
        .filter(log => new Date(log.date) >= cutoffDate)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate completion rate
      const totalDays = timeRange;
      const completedDays = habitLogs.filter(log => log.completed).length;
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < timeRange; i++) {
        const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = checkDate.toISOString().split('T')[0];
        const log = habitLogs.find(l => l.date === dateStr);
        
        if (log && log.completed) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Create a full date range and check each day
      for (let i = timeRange - 1; i >= 0; i--) {
        const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = checkDate.toISOString().split('T')[0];
        const log = habitLogs.find(l => l.date === dateStr);
        
        if (log && log.completed) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Calculate average value for quantity habits
      let averageValue: number | undefined;
      if (habit.type === "quantity") {
        const values = habitLogs
          .filter(log => log.completed && log.value !== undefined)
          .map(log => log.value!);
        averageValue = values.length > 0 
          ? values.reduce((sum, val) => sum + val, 0) / values.length 
          : 0;
      }

      return {
        habitId: habit.id,
        name: habit.name,
        color: habit.color,
        completionRate,
        currentStreak,
        longestStreak,
        totalCompletions: completedDays,
        averageValue,
      };
    });
  }, [habits, logs, timeRange]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const totalHabits = habits.length;
    const averageCompletionRate = stats.length > 0 
      ? stats.reduce((sum, stat) => sum + stat.completionRate, 0) / stats.length 
      : 0;
    const totalStreaks = stats.reduce((sum, stat) => sum + stat.currentStreak, 0);
    const bestHabit = stats.reduce((best, current) => 
      current.completionRate > best.completionRate ? current : best
    , stats[0]);

    return {
      totalHabits,
      averageCompletionRate,
      totalStreaks,
      bestHabit,
    };
  }, [stats, habits.length]);

  // Data for completion rate chart
  const chartData = stats.map(stat => ({
    name: stat.name.length > 15 ? stat.name.substring(0, 15) + "..." : stat.name,
    rate: Math.round(stat.completionRate),
    color: stat.color,
  }));

  // Data for pie chart
  const pieData = stats.map(stat => ({
    name: stat.name,
    value: stat.totalCompletions,
    color: stat.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Completion Rate: {data.rate}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (!habits.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Habit Statistics
          </CardTitle>
          <CardDescription>
            Create some habits to see your progress statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No habits to analyze yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Habits
                </p>
                <p className="text-2xl font-bold">{overallStats.totalHabits}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Completion
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(overallStats.averageCompletionRate)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Streaks
                </p>
                <p className="text-2xl font-bold">{overallStats.totalStreaks}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Best Habit
                </p>
                <p className="text-sm font-bold truncate">
                  {overallStats.bestHabit?.name || "None"}
                </p>
                <p className="text-xs text-gray-500">
                  {Math.round(overallStats.bestHabit?.completionRate || 0)}%
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Habit Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Habit Details
          </CardTitle>
          <CardDescription>
            Individual habit performance over the last {timeRange} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.habitId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <h4 className="font-medium">{stat.name}</h4>
                  </div>
                  <Badge variant="outline">
                    {Math.round(stat.completionRate)}% complete
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current Streak</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      {stat.currentStreak} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</p>
                    <p className="text-lg font-semibold">{stat.longestStreak} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Completions</p>
                    <p className="text-lg font-semibold">{stat.totalCompletions}</p>
                  </div>
                  {stat.averageValue !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Average Value</p>
                      <p className="text-lg font-semibold">{stat.averageValue.toFixed(1)}</p>
                    </div>
                  )}
                </div>
                
                <Progress value={stat.completionRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Rates</CardTitle>
            <CardDescription>
              Percentage of days each habit was completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="name" 
                    className="text-gray-500 dark:text-gray-400"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis className="text-gray-500 dark:text-gray-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rate" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Completion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Distribution</CardTitle>
            <CardDescription>
              Proportion of total completions by habit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}