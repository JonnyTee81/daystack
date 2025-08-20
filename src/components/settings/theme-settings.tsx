"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Check,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "Clean and bright interface",
    icon: Sun,
    preview: "bg-white text-gray-900 border-gray-200",
  },
  {
    value: "dark", 
    label: "Dark",
    description: "Easy on the eyes, perfect for night use",
    icon: Moon,
    preview: "bg-gray-900 text-white border-gray-700",
  },
  {
    value: "system",
    label: "System",
    description: "Automatically matches your device settings", 
    icon: Monitor,
    preview: "bg-gradient-to-r from-white to-gray-900 text-gray-600 border-gray-400",
  },
];

const accentColors = [
  { name: "Blue", value: "blue", color: "#3B82F6" },
  { name: "Green", value: "green", color: "#10B981" },
  { name: "Purple", value: "purple", color: "#8B5CF6" },
  { name: "Orange", value: "orange", color: "#F97316" },
  { name: "Pink", value: "pink", color: "#EC4899" },
  { name: "Indigo", value: "indigo", color: "#6366F1" },
];

export default function ThemeSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedAccent, setSelectedAccent] = useState("blue");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Theme switched to ${newTheme} mode! 🎨`);
  };

  const handleAccentChange = (accent: string) => {
    setSelectedAccent(accent);
    // Here you would typically save this to user preferences
    toast.success(`Accent color changed to ${accent}! ✨`);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Preference
          </CardTitle>
          <CardDescription>
            Choose how DayStack looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup 
            value={theme} 
            onValueChange={handleThemeChange}
            className="grid grid-cols-1 gap-4"
          >
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = theme === option.value;
              
              return (
                <div key={option.value} className="relative">
                  <Label
                    htmlFor={option.value}
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                      isSelected 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${option.preview}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{option.label}</h4>
                          {isSelected && (
                            <Badge variant="outline" className="text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="hidden sm:block">
                      <div className={`w-16 h-12 rounded border ${option.preview} flex items-center justify-center`}>
                        <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                      </div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Monitor className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Current appearance: <strong className="capitalize">{resolvedTheme}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Accent Color Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Accent Color
          </CardTitle>
          <CardDescription>
            Choose your preferred accent color for highlights and interactive elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleAccentChange(color.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all hover:border-gray-400 ${
                  selectedAccent === color.value
                    ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color.color }}
                />
                <span className="text-xs font-medium">{color.name}</span>
                {selectedAccent === color.value && (
                  <Check className="h-3 w-3 text-green-600" />
                )}
              </button>
            ))}
          </div>

          <Separator />

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Coming Soon:</strong> Custom accent colors will be applied throughout the app including buttons, progress bars, and chart elements.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>
            Customize how information is displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Density</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Control spacing and information density
              </p>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="density" value="compact" className="text-blue-600" />
                  Compact
                </Label>
                <Label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="density" value="comfortable" defaultChecked className="text-blue-600" />
                  Comfortable
                </Label>
                <Label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="density" value="spacious" className="text-blue-600" />
                  Spacious
                </Label>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Animations</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Control interface animations and transitions
              </p>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="animations" value="full" defaultChecked className="text-blue-600" />
                  Full animations
                </Label>
                <Label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="animations" value="reduced" className="text-blue-600" />
                  Reduced animations
                </Label>
                <Label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="animations" value="none" className="text-blue-600" />
                  No animations
                </Label>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              These preferences will be applied in a future update. Currently using comfortable density and full animations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}