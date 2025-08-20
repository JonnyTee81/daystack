"use client";

import { useState, useMemo } from "react";
import AppLayout from "@/components/layout/app-layout";
import ActivityHeatmap from "@/components/charts/activity-heatmap";
import MetricsTrendChart from "@/components/charts/metrics-trend-chart";
import HabitStats from "@/components/charts/habit-stats";
import ProgressSummary from "@/components/charts/progress-summary";
import DataExport from "@/components/export/data-export";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Download, Target, TrendingUp } from "lucide-react";
import { api } from "@/trpc/client";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch data for analytics
  const { data: habits, isLoading: habitsLoading } = api.habits.getAll.useQuery();
  
  // Get metrics data for the last 90 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  
  const { data: metricsRange, isLoading: metricsLoading } = api.metrics.getRange.useQuery({
    startDate,
    endDate,
  });

  // Transform data for charts
  const chartData = useMemo(() => {
    if (!metricsRange) return [];
    
    return metricsRange.map(metric => ({
      date: metric.date.toISOString().split('T')[0],
      mood: metric.mood,
      energy: metric.energy,
      productivity: metric.productivity,
      momentum: metric.momentum,
      habitsCompleted: metric.habitLogs?.filter(log => log.completed).length || 0,
      totalHabits: metric.habitLogs?.length || 0,
    }));
  }, [metricsRange]);

  // Transform data for heatmap
  const heatmapData = useMemo(() => {
    if (!metricsRange) return [];
    
    return metricsRange.map(metric => {
      const completionRate = metric.habitLogs?.length > 0 
        ? metric.habitLogs.filter(log => log.completed).length / metric.habitLogs.length 
        : 0;
      
      // Convert to activity level 0-4
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (completionRate > 0.8) level = 4;
      else if (completionRate > 0.6) level = 3;
      else if (completionRate > 0.4) level = 2;
      else if (completionRate > 0.2) level = 1;
      
      return {
        date: metric.date.toISOString().split('T')[0],
        value: metric.habitLogs?.filter(log => log.completed).length || 0,
        level,
      };
    });
  }, [metricsRange]);

  // Transform habit logs for habit stats
  const habitLogs = useMemo(() => {
    if (!metricsRange) return [];
    
    return metricsRange.flatMap(metric => 
      metric.habitLogs?.map(log => ({
        date: metric.date.toISOString().split('T')[0],
        habitId: log.habitId,
        completed: log.completed,
        value: log.value,
      })) || []
    );
  }, [metricsRange]);

  // Prepare export data
  const exportData = useMemo(() => ({
    metrics: chartData,
    habits: habits || [],
    habitLogs: habitLogs,
  }), [chartData, habits, habitLogs]);

  if (habitsLoading || metricsLoading) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                Loading analytics...
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Insights & Analytics
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Visualize your progress with beautiful charts and detailed analytics.
            </p>
            
            {/* Navigation Confirmation */}
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                ✅ Full analytics dashboard now available! Explore your data with interactive charts and insights.
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Trends</span>
              </TabsTrigger>
              <TabsTrigger value="habits" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Habits</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressSummary data={chartData} />
                <MetricsTrendChart 
                  data={chartData} 
                  title="Recent Trends"
                  description="Your metrics over the last 30 days"
                  chartType="area"
                />
              </div>
              
              {chartData.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Data Yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Start tracking your daily metrics and habits to see insights here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <MetricsTrendChart data={chartData} />
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <MetricsTrendChart 
                data={chartData} 
                title="Detailed Metrics Analysis"
                description="Comprehensive view of your daily metrics trends"
                showMomentum={true}
                chartType="line"
              />
              
              <ProgressSummary 
                data={chartData}
                title="Weekly Progress Summary" 
              />
            </TabsContent>

            <TabsContent value="habits" className="space-y-6">
              <HabitStats 
                habits={habits || []} 
                logs={habitLogs}
                timeRange={30}
              />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <ActivityHeatmap 
                data={heatmapData}
                title="Activity Heatmap"
                description="Your daily habit completion consistency over the past year"
                showControls={true}
              />
              
              {heatmapData.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Activity Data
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Complete some habits to see your activity heatmap here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <DataExport 
                data={exportData}
                isLoading={habitsLoading || metricsLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}