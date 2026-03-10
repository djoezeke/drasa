'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import CourseCard from '@/components/CourseCard';
import AssignmentCard from '@/components/AssignmentCard';
import { apiClient, Course, Assignment, Announcement } from '@/lib/api';

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, assignmentsData, announcementsData] = await Promise.all([
          apiClient.getCourses({ enrolled: true }),
          apiClient.getAssignments(),
          apiClient.getAnnouncements(),
        ]);

        setCourses(coursesData.results.slice(0, 4));
        setAssignments(assignmentsData.results.slice(0, 5));
        setAnnouncements(announcementsData.results.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening in your courses
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border dark:border-zinc-800">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrolled Courses</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border dark:border-zinc-800">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Assignments</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {assignments.filter(a => !a.submission_status?.submitted).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border dark:border-zinc-800">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <span className="text-2xl">📢</span>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Announcements</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{announcements.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Assignments */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Upcoming Assignments
                </h2>
                <a href="/assignments" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View all →
                </a>
              </div>
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No upcoming assignments</p>
                </div>
              )}
            </section>

            {/* My Courses */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Courses
                </h2>
                <a href="/courses" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View all →
                </a>
              </div>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">You're not enrolled in any courses yet</p>
                  <a
                    href="/courses"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Browse Courses
                  </a>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Announcements */}
            <section className="bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Announcements
              </h3>
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-b dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {announcement.course_code}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No recent announcements</p>
              )}
            </section>

            {/* Quick Links */}
            <section className="bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                <a href="/courses" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
                  📚 All Courses
                </a>
                <a href="/assignments" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
                  📝 All Assignments
                </a>
                <a href="/grades" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
                  📈 My Grades
                </a>
                <a href="/calendar" className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300">
                  📅 Calendar
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
