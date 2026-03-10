'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import AssignmentCard from '@/components/AssignmentCard';
import { apiClient, Course, Announcement, Discussion } from '@/lib/api';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = parseInt(params.id as string);

  const [course, setCourse] = useState<Course | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'modules' | 'assignments' | 'discussions' | 'announcements'>('home');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseData, announcementsData, discussionsData] = await Promise.all([
          apiClient.getCourse(courseId),
          apiClient.getAnnouncements(courseId),
          apiClient.getDiscussions(courseId),
        ]);

        setCourse(courseData);
        setAnnouncements(announcementsData.results);
        setDiscussions(discussionsData.results);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      await apiClient.enrollInCourse(course.id);
      const updatedCourse = await apiClient.getCourse(courseId);
      setCourse(updatedCourse);
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!course || !confirm('Are you sure you want to unenroll from this course?')) return;
    setEnrolling(true);
    try {
      await apiClient.unenrollFromCourse(course.id);
      const updatedCourse = await apiClient.getCourse(courseId);
      setCourse(updatedCourse);
    } catch (error) {
      console.error('Failed to unenroll:', error);
      alert('Failed to unenroll from course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading course...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course not found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation />

      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm font-semibold uppercase tracking-wide mb-2">
                {course.code}
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg opacity-90 mb-4">{course.description}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div>
                  <span className="opacity-75">Instructor:</span>{' '}
                  <span className="font-semibold">
                    {course.instructor.first_name} {course.instructor.last_name}
                  </span>
                </div>
                <div>
                  <span className="opacity-75">Students:</span>{' '}
                  <span className="font-semibold">{course.enrollment_count || 0}</span>
                </div>
                <div>
                  <span className="opacity-75">Duration:</span>{' '}
                  <span className="font-semibold">
                    {new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div>
              {course.is_enrolled ? (
                <button
                  onClick={handleUnenroll}
                  disabled={enrolling}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {enrolling ? 'Processing...' : 'Unenroll'}
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'modules', label: 'Modules', icon: '📦' },
              { id: 'assignments', label: 'Assignments', icon: '📝' },
              { id: 'discussions', label: 'Discussions', icon: '💬' },
              { id: 'announcements', label: 'Announcements', icon: '📢' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About This Course</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>
                {course.syllabus && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Syllabus</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300">{course.syllabus}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Course Details</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Course Code</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{course.code}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Status</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white capitalize">{course.status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Modules</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{course.modules?.length || 0}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-4">
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module) => (
                <div key={module.id} className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{module.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{module.description}</p>
                  {module.assignments && module.assignments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Assignments:</h4>
                      {module.assignments.map((assignment) => (
                        <AssignmentCard key={assignment.id} assignment={assignment} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">No modules available yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-4">
            {course.modules?.some(m => m.assignments && m.assignments.length > 0) ? (
              course.modules.flatMap(m => m.assignments || []).map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">No assignments available yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-6">
                  {announcement.is_pinned && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                      📌 Pinned
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    By {announcement.author.first_name} {announcement.author.last_name} •{' '}
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{announcement.content}</p>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">No announcements yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {discussions.length > 0 ? (
              discussions.map((discussion) => (
                <div key={discussion.id} className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{discussion.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        By {discussion.author.first_name} {discussion.author.last_name} •{' '}
                        {new Date(discussion.created_at).toLocaleDateString()} • {discussion.comments_count || 0} comments
                      </p>
                    </div>
                    {discussion.is_locked && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{discussion.content}</p>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">No discussions yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
