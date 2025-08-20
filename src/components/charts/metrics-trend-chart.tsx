"use client";

import { useState } from "react";
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
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

interface MetricsData {
  date: string;
  mood: number;
  energy: number;
  productivity: number;
  momentum: number;
}

interface MetricsTrendChartProps {
  data: MetricsData[];
  title?: string;
  description?: string;
  showMomentum?: boolean;
  chartType?: "line" | "area";
}

export default function MetricsTrendChart({
  data,
  title = "Daily Metrics Trends",
  description = "Your mood, energy, and productivity over time",
  showMomentum = true,
  chartType = "line"
}: MetricsTrendChartProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "mood", "energy", "productivity"
  ]);

  // Filter data based on time range
  const filteredData = data.slice(0, timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365);

  // Calculate averages for the period
  const averages = selectedMetrics.reduce((acc, metric) => {
    const values = filteredData.map(d => d[metric as keyof MetricsData] as number).filter(Boolean);
    acc[metric] = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
    return acc;
  }, {} as Record<string, number>);

  // Calculate trends (simple slope calculation)
  const trends = selectedMetrics.reduce((acc, metric) => {
    const values = filteredData.map(d => d[metric as keyof MetricsData] as number).filter(Boolean);
    if (values.length > 1) {
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
      acc[metric] = secondAvg - firstAvg;
    } else {
      acc[metric] = 0;
    }
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeRange === "7d") {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeRange === "30d") {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "mood": return "#F59E0B"; // Amber
      case "energy": return "#10B981"; // Emerald
      case "productivity": return "#3B82F6"; // Blue
      case "momentum": return "#8B5CF6"; // Violet
      default: return "#6B7280"; // Gray
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "mood": return "😊";
      case "energy": return "⚡";
      case "productivity": return "🎯";
      case "momentum": return "📈";
      default: return "📊";
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0.2) return "📈";
    if (trend < -0.2) return "📉";
    return "➡️";
  };

  const getTrendText = (trend: number) => {
    if (trend > 0.2) return "Improving";
    if (trend < -0.2) return "Declining";
    return "Stable";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{formatDate(label)}</p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize">{entry.dataKey}:</span>
              <span className="font-medium">{entry.value}/10</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="1y">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metric summaries */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {selectedMetrics.map((metric) => (
            <div key={metric} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getMetricIcon(metric)}</span>
                <div>
                  <p className="text-sm font-medium capitalize">{metric}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Avg: {averages[metric]?.toFixed(1)}/10
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{getTrendIcon(trends[metric])}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getTrendText(trends[metric])}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis 
                  domain={[0, 10]}
                  className="text-gray-500 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes("mood") && (
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#F59E0B"
                    fillOpacity={1}
                    fill="url(#moodGradient)"
                    strokeWidth={2}
                  />
                )}
                {selectedMetrics.includes("energy") && (
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#energyGradient)"
                    strokeWidth={2}
                  />
                )}
                {selectedMetrics.includes("productivity") && (
                  <Area
                    type="monotone"
                    dataKey="productivity"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#productivityGradient)"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  className="text-gray-500 dark:text-gray-400"
                />
                <YAxis 
                  domain={[0, 10]}
                  className="text-gray-500 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {selectedMetrics.includes("mood") && (
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {selectedMetrics.includes("energy") && (
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {selectedMetrics.includes("productivity") && (
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {showMomentum && selectedMetrics.includes("momentum") && (
                  <Line
                    type="monotone"
                    dataKey="momentum"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}