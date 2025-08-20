"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Save, X, Target, Hash } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";

const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(50, "Name must be 50 characters or less"),
  type: z.enum(["boolean", "quantity"]),
  target: z.number().min(1).max(999).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
});

type HabitForm = z.infer<typeof habitSchema>;

interface HabitFormProps {
  initialData?: {
    id: string;
    name: string;
    type: "boolean" | "quantity";
    target: number | null;
    color: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultColors = [
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#EC4899", // Pink
  "#6366F1", // Indigo
];

export default function HabitForm({ initialData, onSuccess, onCancel }: HabitFormProps) {
  const [selectedColor, setSelectedColor] = useState(initialData?.color || "#10B981");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HabitForm>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "boolean",
      target: initialData?.target || undefined,
      color: initialData?.color || "#10B981",
    },
  });

  const watchedType = form.watch("type");

  const createHabit = api.habits.create.useMutation({
    onSuccess: () => {
      toast.success("Habit created successfully! 🎉");
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to create habit: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const updateHabit = api.habits.update.useMutation({
    onSuccess: () => {
      toast.success("Habit updated successfully! ✨");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to update habit: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: HabitForm) => {
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        // Update existing habit
        await updateHabit.mutateAsync({
          id: initialData.id,
          name: data.name,
          type: data.type,
          target: data.type === "quantity" ? data.target || null : null,
          color: data.color,
        });
      } else {
        // Create new habit
        await createHabit.mutateAsync({
          name: data.name,
          type: data.type,
          target: data.type === "quantity" ? data.target || null : null,
          color: data.color,
        });
      }
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {initialData ? "Edit Habit" : "Create New Habit"}
        </CardTitle>
        <CardDescription>
          {initialData 
            ? "Update your habit details below."
            : "Add a new habit to track your daily progress."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Habit Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Drink 8 glasses of water"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a clear, specific name for your habit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Habit Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select habit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="boolean">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Yes/No</div>
                            <div className="text-xs text-gray-500">Simple completion tracking</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="quantity">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          <div>
                            <div className="font-medium">Quantity</div>
                            <div className="text-xs text-gray-500">Track specific amounts</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how you want to track this habit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target (for quantity habits) */}
            {watchedType === "quantity" && (
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Target</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="999"
                        placeholder="e.g., 8"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Set your daily target for this habit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Color Selection */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <Badge variant="outline" style={{ color: selectedColor }}>
                          {selectedColor}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {defaultColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                              selectedColor === color 
                                ? "border-gray-900 dark:border-white shadow-lg" 
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setSelectedColor(color);
                              field.onChange(color);
                            }}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => {
                          setSelectedColor(e.target.value);
                          field.onChange(e.target.value);
                        }}
                        className="w-20 h-8"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose a color to represent this habit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Form Actions */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                    {initialData ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {initialData ? "Update Habit" : "Create Habit"}
                  </div>
                )}
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}