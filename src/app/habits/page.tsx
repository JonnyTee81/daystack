"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import HabitForm from "@/components/habits/habit-form";
import HabitList from "@/components/habits/habit-list";
import HabitTracker from "@/components/habits/habit-tracker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, Calendar } from "lucide-react";

export default function HabitsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState("track");

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setActiveTab("manage"); // Switch to manage tab to see the new habit
  };

  const handleCreateNew = () => {
    setShowCreateForm(true);
    setActiveTab("manage");
  };

  if (showCreateForm) {
    return (
      <AppLayout>
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <HabitForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
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
              Habits
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track your daily habits and build better routines.
            </p>
            
            {/* Navigation Confirmation */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ✅ Full habit management system now available! Create, track, and manage your daily habits.
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-auto grid-cols-2">
                <TabsTrigger value="track" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Track Today
                </TabsTrigger>
                <TabsTrigger value="manage" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Manage Habits
                </TabsTrigger>
              </TabsList>
              
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                New Habit
              </Button>
            </div>

            <TabsContent value="track" className="space-y-6">
              <HabitTracker />
            </TabsContent>

            <TabsContent value="manage" className="space-y-6">
              <HabitList onCreateNew={handleCreateNew} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}