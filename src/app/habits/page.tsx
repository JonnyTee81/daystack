import AppLayout from "@/components/layout/app-layout";

export default function HabitsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Habits
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your daily habits and track your progress.
            </p>
            
            {/* Navigation Confirmation */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ✅ Navigation working! You successfully reached the Habits page.
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Habit Management
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                This section will allow you to create, edit, and manage your daily habits.
                Coming in Phase 5!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}