"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Plus, Minus, Target, Hash, Calendar } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";

interface Habit {
  id: string;
  name: string;
  type: "boolean" | "quantity";
  target: number | null;
  color: string;
}

interface HabitLog {
  id: string;
  habitId: string;
  completed: boolean;
  value: number | null;
}

interface HabitTrackerProps {
  date?: Date;
}

export default function HabitTracker({ date = new Date() }: HabitTrackerProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Normalize date to start of day for consistent querying
  const queryDate = new Date(date);
  queryDate.setHours(0, 0, 0, 0);

  const { data: habits, isLoading: habitsLoading } = api.habits.getAll.useQuery();
  const { data: dayMetrics, refetch: refetchMetrics } = api.metrics.getDay.useQuery({
    date: queryDate,
  });

  // Create a map of existing habit logs for quick lookup
  const habitLogs = dayMetrics?.habitLogs?.reduce((acc, log) => {
    acc[log.habitId] = log;
    return acc;
  }, {} as Record<string, HabitLog>) || {};

  const updateHabitLog = api.habits.updateLog?.useMutation({
    onSuccess: () => {
      toast.success("Habit updated! 🎉");
      refetchMetrics();
    },
    onError: (error) => {
      toast.error(`Failed to update habit: ${error.message}`);
    },
  });

  const handleBooleanToggle = async (habit: Habit) => {
    const currentLog = habitLogs[habit.id];
    const newCompleted = !currentLog?.completed;

    try {
      await updateHabitLog?.mutateAsync({
        habitId: habit.id,
        date: queryDate,
        completed: newCompleted,
        value: null,
      });
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleQuantityUpdate = async (habit: Habit, value: number) => {
    const clampedValue = Math.max(0, Math.min(value, 999));
    
    try {
      await updateHabitLog?.mutateAsync({
        habitId: habit.id,
        date: queryDate,
        completed: habit.target ? clampedValue >= habit.target : clampedValue > 0,
        value: clampedValue,
      });
    } catch (error) {
      // Error handled in mutation
    }
  };

  const updateQuantity = (habitId: string, change: number) => {
    const current = quantities[habitId] || habitLogs[habitId]?.value || 0;
    const newValue = Math.max(0, current + change);
    setQuantities(prev => ({ ...prev, [habitId]: newValue }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  if (habitsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
              Loading habits...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Habits
          </CardTitle>
          <CardDescription>
            {formatDate(date)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-16 w-16 mx-auto mb-4 text-gray-400">
              <Target className="h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No habits to track
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create some habits to start tracking your daily progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = habits.filter(habit => habitLogs[habit.id]?.completed).length;
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Habits
            </CardTitle>
            <CardDescription>
              {formatDate(date)}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {completedCount}/{habits.length} completed
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Daily Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {habits.map((habit) => {
          const log = habitLogs[habit.id];
          const currentValue = quantities[habit.id] ?? log?.value ?? 0;
          
          return (
            <div key={habit.id} className="p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: habit.color }}
                />
                <h3 className="font-medium text-gray-900 dark:text-white flex-1">
                  {habit.name}
                </h3>
                {log?.completed && (
                  <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✓ Done
                  </Badge>
                )}
              </div>

              {habit.type === "boolean" ? (
                /* Boolean Habit */
                <Button
                  variant={log?.completed ? "default" : "outline"}
                  className={`w-full justify-center ${
                    log?.completed 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleBooleanToggle(habit)}
                >
                  {log?.completed ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Circle className="h-4 w-4 mr-2" />
                  )}
                  {log?.completed ? "Completed" : "Mark as Done"}
                </Button>
              ) : (
                /* Quantity Habit */
                <div className="space-y-3">
                  {/* Progress for quantity habits */}
                  {habit.target && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium">
                          {currentValue}/{habit.target}
                        </span>
                      </div>
                      <Progress 
                        value={(currentValue / habit.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(habit.id, -1)}
                      disabled={currentValue <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      value={currentValue}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setQuantities(prev => ({ ...prev, [habit.id]: value }));
                      }}
                      onBlur={() => handleQuantityUpdate(habit, currentValue)}
                      className="text-center flex-1"
                      min="0"
                      max="999"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(habit.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityUpdate(habit, currentValue)}
                    className="w-full"
                  >
                    Update Progress
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}