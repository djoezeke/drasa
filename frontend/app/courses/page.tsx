'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import CourseCard from '@/components/CourseCard';
import { apiClient, Course } from '@/lib/api';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<'all' | 'enrolled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getCourses({ 
          enrolled: filter === 'enrolled' ? true : undefined 
        });
        setCourses(data.results);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Courses
          </h1>

          {/* Filter Tabs */}
          <div className="flex space-x-4 border-b dark:border-zinc-800">
            <button
              onClick={() => setFilter('all')}
              className={`pb-4 px-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setFilter('enrolled')}
              className={`pb-4 px-2 font-medium transition-colors ${
                filter === 'enrolled'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              My Courses
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading courses...</div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'enrolled' ? 'No enrolled courses' : 'No courses available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter === 'enrolled' 
                ? "You haven't enrolled in any courses yet. Browse all courses to get started."
                : 'There are no courses available at the moment. Check back later!'}
            </p>
            {filter === 'enrolled' && (
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Courses
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
