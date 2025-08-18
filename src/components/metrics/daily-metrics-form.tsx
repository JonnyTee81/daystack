"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Smile, Zap, TrendingUp, Save } from "lucide-react";
import { api } from "@/trpc/client";
import { toast } from "sonner";

const metricsSchema = z.object({
  mood: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  productivity: z.number().min(1).max(10),
  note: z.string().optional(),
});

type MetricsForm = z.infer<typeof metricsSchema>;

interface DailyMetricsFormProps {
  initialData?: {
    mood: number;
    energy: number;
    productivity: number;
    note: string | null;
  };
  onSuccess?: () => void;
}

const moodLabels: { [key: number]: { emoji: string; label: string; color: string } } = {
  1: { emoji: "😞", label: "Terrible", color: "text-red-500" },
  2: { emoji: "😟", label: "Very Bad", color: "text-red-400" },
  3: { emoji: "😕", label: "Bad", color: "text-orange-500" },
  4: { emoji: "🙁", label: "Poor", color: "text-orange-400" },
  5: { emoji: "😐", label: "Okay", color: "text-yellow-500" },
  6: { emoji: "🙂", label: "Good", color: "text-yellow-400" },
  7: { emoji: "😊", label: "Great", color: "text-green-400" },
  8: { emoji: "😄", label: "Very Good", color: "text-green-500" },
  9: { emoji: "😁", label: "Excellent", color: "text-green-600" },
  10: { emoji: "🤩", label: "Amazing", color: "text-green-700" },
};

const energyLabels: { [key: number]: { emoji: string; label: string; color: string } } = {
  1: { emoji: "🔋", label: "Exhausted", color: "text-red-500" },
  2: { emoji: "🪫", label: "Drained", color: "text-red-400" },
  3: { emoji: "😴", label: "Tired", color: "text-orange-500" },
  4: { emoji: "😪", label: "Low", color: "text-orange-400" },
  5: { emoji: "😌", label: "Moderate", color: "text-yellow-500" },
  6: { emoji: "🙂", label: "Good", color: "text-yellow-400" },
  7: { emoji: "😊", label: "Energetic", color: "text-green-400" },
  8: { emoji: "⚡", label: "High", color: "text-green-500" },
  9: { emoji: "🚀", label: "Peak", color: "text-green-600" },
  10: { emoji: "⭐", label: "Unstoppable", color: "text-green-700" },
};

const productivityLabels: { [key: number]: { emoji: string; label: string; color: string } } = {
  1: { emoji: "🐌", label: "None", color: "text-red-500" },
  2: { emoji: "😣", label: "Very Low", color: "text-red-400" },
  3: { emoji: "😞", label: "Low", color: "text-orange-500" },
  4: { emoji: "😕", label: "Poor", color: "text-orange-400" },
  5: { emoji: "😐", label: "Average", color: "text-yellow-500" },
  6: { emoji: "🙂", label: "Good", color: "text-yellow-400" },
  7: { emoji: "😊", label: "High", color: "text-green-400" },
  8: { emoji: "💪", label: "Very High", color: "text-green-500" },
  9: { emoji: "🔥", label: "Excellent", color: "text-green-600" },
  10: { emoji: "⚡", label: "Peak", color: "text-green-700" },
};

export default function DailyMetricsForm({ initialData, onSuccess }: DailyMetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MetricsForm>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      mood: initialData?.mood || 5,
      energy: initialData?.energy || 5,
      productivity: initialData?.productivity || 5,
      note: initialData?.note || "",
    },
  });

  const createOrUpdateMetrics = api.metrics.createOrUpdate.useMutation({
    onSuccess: () => {
      toast.success("Daily metrics saved successfully! 🎉");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to save metrics: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: MetricsForm) => {
    setIsSubmitting(true);
    
    try {
      await createOrUpdateMetrics.mutateAsync({
        date: new Date(),
        mood: data.mood,
        energy: data.energy,
        productivity: data.productivity,
        note: data.note || null,
      });
    } catch (error) {
      // Error handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedValues = form.watch();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Daily Check-in
        </CardTitle>
        <CardDescription>
          How are you feeling today? Rate your mood, energy, and productivity on a scale of 1-10.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Mood */}
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Smile className="h-4 w-4" />
                    Mood
                  </FormLabel>
                  <div className="space-y-3">
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-2xl">{moodLabels[watchedValues.mood]?.emoji}</span>
                      <span className={`font-medium ${moodLabels[watchedValues.mood]?.color}`}>
                        {watchedValues.mood}/10 - {moodLabels[watchedValues.mood]?.label}
                      </span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Energy */}
            <FormField
              control={form.control}
              name="energy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Zap className="h-4 w-4" />
                    Energy
                  </FormLabel>
                  <div className="space-y-3">
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-2xl">{energyLabels[watchedValues.energy]?.emoji}</span>
                      <span className={`font-medium ${energyLabels[watchedValues.energy]?.color}`}>
                        {watchedValues.energy}/10 - {energyLabels[watchedValues.energy]?.label}
                      </span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Productivity */}
            <FormField
              control={form.control}
              name="productivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4" />
                    Productivity
                  </FormLabel>
                  <div className="space-y-3">
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                      />
                    </FormControl>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-2xl">{productivityLabels[watchedValues.productivity]?.emoji}</span>
                      <span className={`font-medium ${productivityLabels[watchedValues.productivity]?.color}`}>
                        {watchedValues.productivity}/10 - {productivityLabels[watchedValues.productivity]?.label}
                      </span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How was your day? Any highlights or reflections..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any notes about your day, thoughts, or reflections.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Daily Metrics
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}