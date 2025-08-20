"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Calendar, 
  Clock, 
  Save,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

interface TimezonePreferences {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  weekStart: string;
  detectLocation: boolean;
}

const defaultPreferences: TimezonePreferences = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: "MM/dd/yyyy",
  timeFormat: "12h",
  weekStart: "sunday",
  detectLocation: true,
};

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)", offset: "UTC+0" },
  { value: "Europe/Paris", label: "Central European Time (CET)", offset: "UTC+1" },
  { value: "Europe/Berlin", label: "Central European Time (CET)", offset: "UTC+1" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", offset: "UTC+9" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)", offset: "UTC+8" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)", offset: "UTC+5:30" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)", offset: "UTC+10" },
];

const dateFormats = [
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY", example: "12/31/2024" },
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY", example: "31/12/2024" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD", example: "2024-12-31" },
  { value: "MMM dd, yyyy", label: "MMM DD, YYYY", example: "Dec 31, 2024" },
  { value: "dd MMM yyyy", label: "DD MMM YYYY", example: "31 Dec 2024" },
];

const timeFormats = [
  { value: "12h", label: "12-hour (AM/PM)", example: "2:30 PM" },
  { value: "24h", label: "24-hour", example: "14:30" },
];

const weekStarts = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
];

export default function TimezoneSettings() {
  const [preferences, setPreferences] = useState<TimezonePreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Here you would typically call an API to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Timezone and date preferences saved! 🌍");
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
      console.error("Save preferences error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const detectTimezone = () => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setPreferences(prev => ({ ...prev, timezone: detectedTimezone }));
    toast.success(`Detected timezone: ${detectedTimezone} ⏰`);
  };

  const formatDateExample = (format: string) => {
    const now = new Date();
    try {
      switch (format) {
        case "MM/dd/yyyy":
          return `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`;
        case "dd/MM/yyyy":
          return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        case "yyyy-MM-dd":
          return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        case "MMM dd, yyyy":
          return now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        case "dd MMM yyyy":
          return now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        default:
          return "Today";
      }
    } catch {
      return "Today";
    }
  };

  const formatTimeExample = (format: string) => {
    const now = new Date();
    if (format === "12h") {
      return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else {
      return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  };

  const getCurrentTimezone = () => {
    const selected = timezones.find(tz => tz.value === preferences.timezone);
    return selected || { value: preferences.timezone, label: preferences.timezone, offset: "UTC" };
  };

  return (
    <div className="space-y-6">
      {/* Timezone Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Timezone
          </CardTitle>
          <CardDescription>
            Set your timezone for accurate time tracking and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Current: <strong>{getCurrentTimezone().label}</strong>
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {getCurrentTimezone().offset}
            </Badge>
          </div>

          <div className="space-y-3">
            <Label htmlFor="timezone">Select Timezone</Label>
            <Select value={preferences.timezone} onValueChange={(value) => 
              setPreferences(prev => ({ ...prev, timezone: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{tz.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{tz.offset}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={detectTimezone}
            className="w-full sm:w-auto"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Auto-detect Timezone
          </Button>
        </CardContent>
      </Card>

      {/* Date Format Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date & Time Format
          </CardTitle>
          <CardDescription>
            Customize how dates and times are displayed throughout the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={preferences.dateFormat} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, dateFormat: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{format.label}</span>
                        <span className="text-xs text-gray-500 ml-2">{format.example}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Preview: {formatDateExample(preferences.dateFormat)}
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="time-format">Time Format</Label>
              <Select value={preferences.timeFormat} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, timeFormat: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  {timeFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{format.label}</span>
                        <span className="text-xs text-gray-500 ml-2">{format.example}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Preview: {formatTimeExample(preferences.timeFormat)}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="week-start">Week Starts On</Label>
            <Select value={preferences.weekStart} onValueChange={(value) => 
              setPreferences(prev => ({ ...prev, weekStart: value }))
            }>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select week start" />
              </SelectTrigger>
              <SelectContent>
                {weekStarts.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This affects calendar views and weekly reports
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Format Preview
          </CardTitle>
          <CardDescription>
            See how your selected formats will appear in the app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Date Examples</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Today: <strong>{formatDateExample(preferences.dateFormat)}</strong></p>
                <p>Time: <strong>{formatTimeExample(preferences.timeFormat)}</strong></p>
                <p>Week starts: <strong>{preferences.weekStart === 'sunday' ? 'Sunday' : 'Monday'}</strong></p>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Timezone Info</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>Zone: <strong>{getCurrentTimezone().label}</strong></p>
                <p>Offset: <strong>{getCurrentTimezone().offset}</strong></p>
                <p>Local time: <strong>{formatTimeExample(preferences.timeFormat)}</strong></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
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
      </div>
    </div>
  );
}