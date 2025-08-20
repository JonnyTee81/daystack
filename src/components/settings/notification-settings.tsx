"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Target,
  TrendingUp,
  Calendar,
  Save
} from "lucide-react";
import { toast } from "sonner";

interface NotificationPreferences {
  emailNotifications: {
    weeklyProgress: boolean;
    habitReminders: boolean;
    milestones: boolean;
    accountUpdates: boolean;
  };
  pushNotifications: {
    dailyReminders: boolean;
    streakAlerts: boolean;
    goalAchievements: boolean;
    weeklyReports: boolean;
  };
  reminderTime: string;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const defaultPreferences: NotificationPreferences = {
  emailNotifications: {
    weeklyProgress: true,
    habitReminders: false,
    milestones: true,
    accountUpdates: true,
  },
  pushNotifications: {
    dailyReminders: true,
    streakAlerts: true,
    goalAchievements: true,
    weeklyReports: false,
  },
  reminderTime: "09:00",
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "08:00",
  },
};

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  const updateEmailPreference = (key: keyof NotificationPreferences['emailNotifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: value,
      },
    }));
  };

  const updatePushPreference = (key: keyof NotificationPreferences['pushNotifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: value,
      },
    }));
  };

  const updateQuietHours = (field: 'enabled' | 'start' | 'end', value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Here you would typically call an API to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Notification preferences saved! 🔔");
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
      console.error("Save preferences error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Control what email notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Weekly Progress Reports</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get a summary of your weekly achievements and insights
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications.weeklyProgress}
                onCheckedChange={(checked) => updateEmailPreference('weeklyProgress', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Habit Reminders</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Email reminders for incomplete habits
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications.habitReminders}
                onCheckedChange={(checked) => updateEmailPreference('habitReminders', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  Milestones & Achievements
                  <Badge variant="outline" className="text-xs">Recommended</Badge>
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Celebrate your progress milestones and streak achievements
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications.milestones}
                onCheckedChange={(checked) => updateEmailPreference('milestones', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Account Updates</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Important security and account-related notifications
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications.accountUpdates}
                onCheckedChange={(checked) => updateEmailPreference('accountUpdates', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Manage browser and mobile push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Bell className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Enable Notifications:</strong> Allow notifications in your browser to receive real-time updates about your progress.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Daily Reminders
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gentle reminders to log your daily metrics
                </p>
              </div>
              <Switch
                checked={preferences.pushNotifications.dailyReminders}
                onCheckedChange={(checked) => updatePushPreference('dailyReminders', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Streak Alerts
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Notifications when you&apos;re at risk of breaking a streak
                </p>
              </div>
              <Switch
                checked={preferences.pushNotifications.streakAlerts}
                onCheckedChange={(checked) => updatePushPreference('streakAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Goal Achievements
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Celebrate when you reach important milestones
                </p>
              </div>
              <Switch
                checked={preferences.pushNotifications.goalAchievements}
                onCheckedChange={(checked) => updatePushPreference('goalAchievements', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Weekly Reports
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Weekly summary of your progress and insights
                </p>
              </div>
              <Switch
                checked={preferences.pushNotifications.weeklyReports}
                onCheckedChange={(checked) => updatePushPreference('weeklyReports', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timing & Schedule
          </CardTitle>
          <CardDescription>
            Customize when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Daily Reminder Time</Label>
              <input
                id="reminder-time"
                type="time"
                value={preferences.reminderTime}
                onChange={(e) => setPreferences(prev => ({ ...prev, reminderTime: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Best time to send daily habit reminders
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Quiet Hours</Label>
                <Switch
                  checked={preferences.quietHours.enabled}
                  onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
                />
              </div>
              
              {preferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start" className="text-sm">Start</Label>
                    <input
                      id="quiet-start"
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => updateQuietHours('start', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-gray-200 bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-end" className="text-sm">End</Label>
                    <input
                      id="quiet-end"
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => updateQuietHours('end', e.target.value)}
                      className="flex h-9 w-full rounded-md border border-gray-200 bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
                    />
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No notifications will be sent during quiet hours
              </p>
            </div>
          </div>

          <Separator />

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}