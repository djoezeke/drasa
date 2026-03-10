'use client';

import Navigation from '@/components/Navigation';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Calendar
        </h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Course Calendar
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            View all your assignments, events, and deadlines in one place
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            This feature is coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
