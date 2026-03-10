import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <main className="flex flex-col items-center justify-center px-8 py-16 text-center max-w-4xl">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Drasa
            </span>
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
            Learning Management System
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500">
            Built with Django & Next.js
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard →
          </Link>
          <Link
            href="/courses"
            className="px-8 py-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-lg font-semibold text-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200 shadow-lg hover:shadow-xl border dark:border-zinc-800"
          >
            Browse Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Course Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organize courses, modules, and learning materials
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Assignments & Grading
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create, submit, and grade assignments with ease
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border dark:border-zinc-800">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Discussions & Collaboration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Engage in course discussions and announcements
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
