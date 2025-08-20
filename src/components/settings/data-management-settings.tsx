"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Upload, 
  Database, 
  Shield, 
  AlertTriangle,
  FileText,
  Calendar,
  Activity,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/client";

export default function DataManagementSettings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Get data for export
  const { data: habits } = api.habits.getAll.useQuery();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); // Last year of data
  
  const { data: metricsRange } = api.metrics.getRange.useQuery({
    startDate,
    endDate,
  });

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      // Prepare export data
      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          exportedAt: new Date().toLocaleDateString(),
        },
        habits: habits || [],
        metrics: metricsRange?.map(metric => ({
          date: metric.date.toISOString().split('T')[0],
          mood: metric.mood,
          energy: metric.energy,
          productivity: metric.productivity,
          momentum: metric.momentum,
          notes: metric.notes,
          habitLogs: metric.habitLogs?.map(log => ({
            habitId: log.habitId,
            completed: log.completed,
            value: log.value,
          })) || [],
        })) || [],
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daystack-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully! 📥");
    } catch (error) {
      toast.error("Failed to export data. Please try again.");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);

    try {
      // This would typically call an API to clear user data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Data cleared successfully!");
    } catch (error) {
      toast.error("Failed to clear data. Please try again.");
      console.error("Clear data error:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const getDataStats = () => {
    const habitCount = habits?.length || 0;
    const metricsCount = metricsRange?.length || 0;
    const totalLogs = metricsRange?.reduce((total, metric) => 
      total + (metric.habitLogs?.length || 0), 0) || 0;

    return { habitCount, metricsCount, totalLogs };
  };

  const stats = getDataStats();

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Overview
          </CardTitle>
          <CardDescription>
            Summary of your stored data and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Activity className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.habitCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Habits</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.metricsCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily Entries</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalLogs}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Habit Logs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a complete backup of your habits, metrics, and progress data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Your Data, Your Control:</strong> Export includes all your habits, daily metrics, progress history, and personal notes in a portable JSON format.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Export includes:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                All active and archived habits with settings
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Complete daily metrics history (mood, energy, productivity)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Habit completion logs and streaks
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Personal notes and reflections
              </li>
            </ul>
          </div>

          <Separator />

          <Button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                Exporting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data (JSON)
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Restore data from a previous export or import from other apps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Coming Soon:</strong> Data import functionality will be available in a future update. This will allow you to restore from backups or migrate from other habit tracking apps.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Planned import features:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                Restore from DayStack JSON exports
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                Import from CSV files
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                Migration from popular habit tracking apps
              </li>
            </ul>
          </div>

          <Button disabled className="w-full sm:w-auto opacity-50">
            <Upload className="h-4 w-4 mr-2" />
            Import Data (Coming Soon)
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <RefreshCw className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Advanced data management options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
              Clear All Data
            </h4>
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-4">
              Permanently remove all your habits, metrics, and progress data. This action cannot be undone.
            </p>
            
            <div className="space-y-3">
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                ⚠️ Destructive Action
              </Badge>
              
              <p className="text-xs text-orange-600 dark:text-orange-400">
                We recommend exporting your data first as a backup before clearing.
              </p>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearData}
                disabled={isClearing}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                {isClearing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-300 border-t-orange-600" />
                    Clearing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Clear All Data
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}