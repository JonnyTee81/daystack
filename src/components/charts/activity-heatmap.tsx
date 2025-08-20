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
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface ActivityData {
  date: string;
  value: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no data, 1-4 = activity levels
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  title?: string;
  description?: string;
  showControls?: boolean;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ActivityHeatmap({ 
  data, 
  title = "Activity Overview",
  description = "Your daily activity over the past year",
  showControls = true 
}: ActivityHeatmapProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredCell, setHoveredCell] = useState<ActivityData | null>(null);

  // Generate a full year of dates with activity data
  const yearData = useMemo(() => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    const dataMap = new Map(data.map(d => [d.date, d]));
    
    const result: ActivityData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const existingData = dataMap.get(dateStr);
      
      result.push(existingData || {
        date: dateStr,
        value: 0,
        level: 0
      });
      
      currentDate.setDate(currentDate.setDate() + 1);
    }
    
    return result;
  }, [data, selectedYear]);

  // Organize data into weeks
  const weeks = useMemo(() => {
    const weeks: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];
    
    // Find the first Sunday of the year or add padding
    const firstDate = new Date(selectedYear, 0, 1);
    const firstDayOfWeek = firstDate.getDay();
    
    // Add padding for the first week if needed
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({
        date: '',
        value: 0,
        level: 0
      });
    }
    
    yearData.forEach((day, index) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    // Add the final partial week if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          value: 0,
          level: 0
        });
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [yearData, selectedYear]);

  const getCellColor = (level: number) => {
    switch (level) {
      case 0: return "bg-gray-100 dark:bg-gray-800";
      case 1: return "bg-green-100 dark:bg-green-900";
      case 2: return "bg-green-300 dark:bg-green-700";
      case 3: return "bg-green-500 dark:bg-green-500";
      case 4: return "bg-green-700 dark:bg-green-300";
      default: return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMonthLabels = () => {
    const labels: { month: string; week: number }[] = [];
    let currentMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find(day => day.date);
      if (firstValidDay) {
        const date = new Date(firstValidDay.date);
        const month = date.getMonth();
        
        if (month !== currentMonth) {
          labels.push({
            month: MONTHS[month],
            week: weekIndex
          });
          currentMonth = month;
        }
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();
  const totalContributions = data.filter(d => d.level > 0).length;
  const currentStreak = 7; // This would be calculated from actual data
  const longestStreak = 15; // This would be calculated from actual data

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedYear(selectedYear - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedYear(selectedYear + 1)}
                disabled={selectedYear >= new Date().getFullYear()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{totalContributions} contributions in {selectedYear}</span>
          <Badge variant="outline">Current streak: {currentStreak} days</Badge>
          <Badge variant="outline">Longest streak: {longestStreak} days</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Heatmap */}
        <div className="relative">
          {/* Month labels */}
          <div className="flex mb-2 text-xs text-gray-500 dark:text-gray-400">
            {monthLabels.map(({ month, week }) => (
              <div
                key={`${month}-${week}`}
                className="text-center"
                style={{
                  marginLeft: `${week * 12}px`,
                  width: '36px'
                }}
              >
                {month}
              </div>
            ))}
          </div>
          
          {/* Day labels and grid */}
          <div className="flex gap-1">
            {/* Day of week labels */}
            <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 mr-2">
              {DAYS.map((day, index) => (
                <div key={day} className="h-3 flex items-center">
                  {index % 2 === 1 && <span>{day}</span>}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-blue-400 ${
                        day.date ? getCellColor(day.level) : 'bg-transparent'
                      }`}
                      onMouseEnter={() => day.date && setHoveredCell(day)}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={day.date ? `${formatDate(day.date)}: ${day.value} activities` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getCellColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
        
        {/* Tooltip */}
        {hoveredCell && (
          <div className="text-sm p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
            <strong>{formatDate(hoveredCell.date)}</strong>
            <br />
            {hoveredCell.value} contributions
          </div>
        )}
      </CardContent>
    </Card>
  );
}