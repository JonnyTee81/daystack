import AppLayout from "@/components/layout/app-layout";

export default function InsightsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Insights
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Visualize your progress with beautiful charts and analytics.
            </p>
            
            {/* Navigation Confirmation */}
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                ✅ Navigation working! You successfully reached the Insights page.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Analytics & Insights
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                This section will show beautiful heatmaps, charts, and analytics about your habits and daily metrics.
                Coming in Phase 6!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}