"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Download, 
  FileText, 
  Calendar, 
  Database, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { toast } from "sonner";

interface ExportData {
  metrics: any[];
  habits: any[];
  habitLogs: any[];
}

interface DataExportProps {
  data: ExportData;
  isLoading?: boolean;
}

type ExportFormat = "csv" | "json" | "pdf";
type ExportRange = "7d" | "30d" | "90d" | "1y" | "all";

interface ExportOptions {
  format: ExportFormat;
  range: ExportRange;
  includeMetrics: boolean;
  includeHabits: boolean;
  includeHabitLogs: boolean;
  includePersonalInfo: boolean;
}

export default function DataExport({ data, isLoading = false }: DataExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    range: "30d",
    includeMetrics: true,
    includeHabits: true,
    includeHabitLogs: true,
    includePersonalInfo: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formatSizes = {
    csv: "Comma-separated values, ideal for Excel and data analysis",
    json: "JavaScript Object Notation, perfect for technical users",
    pdf: "Formatted report, great for sharing and archiving",
  };

  const rangeLabels = {
    "7d": "Last 7 days",
    "30d": "Last 30 days", 
    "90d": "Last 90 days",
    "1y": "Last year",
    "all": "All time",
  };

  const getDataCount = () => {
    const counts = {
      metrics: data.metrics?.length || 0,
      habits: data.habits?.length || 0,
      habitLogs: data.habitLogs?.length || 0,
    };

    let total = 0;
    if (exportOptions.includeMetrics) total += counts.metrics;
    if (exportOptions.includeHabits) total += counts.habits;
    if (exportOptions.includeHabitLogs) total += counts.habitLogs;

    return { ...counts, total };
  };

  const generateCSV = (data: any[], filename: string) => {
    if (!data.length) return null;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === "string" && value.includes(",") 
          ? `"${value}"` 
          : value
      ).join(",")
    );

    return {
      content: [headers, ...rows].join("\n"),
      filename: `${filename}.csv`,
      mimeType: "text/csv",
    };
  };

  const generateJSON = (exportData: any, filename: string) => {
    return {
      content: JSON.stringify(exportData, null, 2),
      filename: `${filename}.json`,
      mimeType: "application/json",
    };
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Filter data based on range
      const now = new Date();
      const cutoffDate = exportOptions.range === "all" ? new Date(0) : 
        new Date(now.getTime() - 
          (exportOptions.range === "7d" ? 7 : 
           exportOptions.range === "30d" ? 30 : 
           exportOptions.range === "90d" ? 90 : 365) * 24 * 60 * 60 * 1000
        );

      const filteredData: any = {
        exportInfo: {
          exportDate: now.toISOString(),
          range: rangeLabels[exportOptions.range],
          format: exportOptions.format,
        }
      };

      if (exportOptions.includeMetrics) {
        filteredData.metrics = data.metrics?.filter(
          metric => new Date(metric.date) >= cutoffDate
        ) || [];
      }

      if (exportOptions.includeHabits) {
        filteredData.habits = data.habits || [];
      }

      if (exportOptions.includeHabitLogs) {
        filteredData.habitLogs = data.habitLogs?.filter(
          log => new Date(log.createdAt) >= cutoffDate
        ) || [];
      }

      const timestamp = now.toISOString().split('T')[0];

      if (exportOptions.format === "csv") {
        // Export each data type as separate CSV files
        const exports = [];
        
        if (exportOptions.includeMetrics && filteredData.metrics?.length) {
          exports.push(generateCSV(filteredData.metrics, `daystack-metrics-${timestamp}`));
        }
        
        if (exportOptions.includeHabits && filteredData.habits?.length) {
          exports.push(generateCSV(filteredData.habits, `daystack-habits-${timestamp}`));
        }
        
        if (exportOptions.includeHabitLogs && filteredData.habitLogs?.length) {
          exports.push(generateCSV(filteredData.habitLogs, `daystack-habit-logs-${timestamp}`));
        }

        // Download each file
        exports.forEach(exp => {
          if (exp) {
            downloadFile(exp.content, exp.filename, exp.mimeType);
          }
        });

        toast.success(`${exports.length} CSV files downloaded successfully! 📁`);
      } else if (exportOptions.format === "json") {
        const jsonExport = generateJSON(filteredData, `daystack-data-${timestamp}`);
        downloadFile(jsonExport.content, jsonExport.filename, jsonExport.mimeType);
        toast.success("JSON file downloaded successfully! 📄");
      } else {
        // PDF export would require a PDF library like jsPDF
        toast.info("PDF export coming soon! Use CSV or JSON for now. 📝");
      }

    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const previewData = () => {
    const counts = getDataCount();
    return {
      totalRecords: counts.total,
      breakdown: [
        exportOptions.includeMetrics && `${counts.metrics} daily metrics`,
        exportOptions.includeHabits && `${counts.habits} habits`,
        exportOptions.includeHabitLogs && `${counts.habitLogs} habit logs`,
      ].filter(Boolean),
    };
  };

  const counts = getDataCount();
  const preview = previewData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Your Data
        </CardTitle>
        <CardDescription>
          Download your DayStack data for backup, analysis, or migration
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Export Format</label>
          <Select 
            value={exportOptions.format} 
            onValueChange={(value: ExportFormat) => 
              setExportOptions(prev => ({ ...prev, format: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <div>
                    <div className="font-medium">CSV</div>
                    <div className="text-xs text-gray-500">Best for spreadsheets</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <div>
                    <div className="font-medium">JSON</div>
                    <div className="text-xs text-gray-500">Best for developers</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <div>
                    <div className="font-medium">PDF Report</div>
                    <div className="text-xs text-gray-500">Best for sharing</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatSizes[exportOptions.format]}
          </p>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Date Range</label>
          <Select 
            value={exportOptions.range} 
            onValueChange={(value: ExportRange) => 
              setExportOptions(prev => ({ ...prev, range: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(rangeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Data Types */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Include Data Types</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="metrics"
                checked={exportOptions.includeMetrics}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeMetrics: checked as boolean }))
                }
              />
              <label htmlFor="metrics" className="flex items-center gap-2 text-sm">
                Daily Metrics
                <Badge variant="outline">{counts.metrics} records</Badge>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="habits"
                checked={exportOptions.includeHabits}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeHabits: checked as boolean }))
                }
              />
              <label htmlFor="habits" className="flex items-center gap-2 text-sm">
                Habits
                <Badge variant="outline">{counts.habits} records</Badge>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="habitLogs"
                checked={exportOptions.includeHabitLogs}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeHabitLogs: checked as boolean }))
                }
              />
              <label htmlFor="habitLogs" className="flex items-center gap-2 text-sm">
                Habit Completion Logs
                <Badge variant="outline">{counts.habitLogs} records</Badge>
              </label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Privacy Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Privacy Options</label>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="personalInfo"
              checked={exportOptions.includePersonalInfo}
              onCheckedChange={(checked) => 
                setExportOptions(prev => ({ ...prev, includePersonalInfo: checked as boolean }))
              }
            />
            <label htmlFor="personalInfo" className="text-sm">
              Include personal information (email, name)
            </label>
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-xs text-blue-700 dark:text-blue-300">
              Personal information is excluded by default to protect your privacy. 
              Only enable if you need it for account migration or backup purposes.
            </div>
          </div>
        </div>

        <Separator />

        {/* Export Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Export Preview</label>
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Preview Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Preview</DialogTitle>
                  <DialogDescription>
                    Review what will be included in your export
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Export Summary</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Format: {exportOptions.format.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Range: {rangeLabels[exportOptions.range]}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Records: {preview.totalRecords}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Data Breakdown</h4>
                    <ul className="text-sm space-y-1">
                      {preview.breakdown.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Ready to export {preview.totalRecords} records</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {preview.breakdown.join(" • ")}
            </p>
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport}
          disabled={isExporting || isLoading || counts.total === 0}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
              Exporting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export {exportOptions.format.toUpperCase()}
            </div>
          )}
        </Button>

        {counts.total === 0 && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-700 dark:text-amber-300">
              No data available to export. Start tracking to generate data!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}