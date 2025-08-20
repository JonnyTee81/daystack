"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Target, Hash, MoreVertical, Edit, Trash2, Plus, GripVertical } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";
import HabitForm from "./habit-form";

interface Habit {
  id: string;
  name: string;
  type: "boolean" | "quantity";
  target: number | null;
  color: string;
  order: number;
  isActive: boolean;
}

interface HabitListProps {
  onCreateNew?: () => void;
}

export default function HabitList({ onCreateNew }: HabitListProps) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const { data: habits, isLoading, refetch } = api.habits.getAll.useQuery();

  const deleteHabit = api.habits.delete.useMutation({
    onSuccess: () => {
      toast.success("Habit deleted successfully");
      refetch();
      setDeletingHabit(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete habit: ${error.message}`);
    },
  });

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleDelete = async (habit: Habit) => {
    try {
      await deleteHabit.mutateAsync({ id: habit.id });
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleFormSuccess = () => {
    setEditingHabit(null);
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Habits</CardTitle>
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

  if (editingHabit) {
    return (
      <HabitForm
        initialData={editingHabit}
        onSuccess={handleFormSuccess}
        onCancel={() => setEditingHabit(null)}
      />
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Habits</CardTitle>
          <CardDescription>
            Start building better habits by creating your first one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-16 w-16 mx-auto mb-4 text-gray-400">
              <Target className="h-16 w-16" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No habits yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first habit to start tracking your progress.
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Habits</CardTitle>
              <CardDescription>
                Manage and track your daily habits
              </CardDescription>
            </div>
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {habits.map((habit, index) => (
            <div key={habit.id}>
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {/* Drag Handle */}
                <div className="cursor-grab hover:cursor-grabbing text-gray-400">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Color Indicator */}
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: habit.color }}
                />

                {/* Habit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {habit.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {habit.type === "boolean" ? (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Yes/No
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          Target: {habit.target}
                        </div>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {habit.type === "boolean" 
                      ? "Complete or skip each day"
                      : `Track daily progress towards ${habit.target}`
                    }
                  </p>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(habit)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setDeletingHabit(habit)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {index < habits.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingHabit} onOpenChange={() => setDeletingHabit(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingHabit?.name}"? This action cannot be undone and will remove all tracking data for this habit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingHabit && handleDelete(deletingHabit)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Habit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}