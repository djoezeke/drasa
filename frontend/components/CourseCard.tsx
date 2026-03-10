import Link from 'next/link';
import { Course } from '@/lib/api';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="block h-full border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        {course.cover_image && (
          <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
            <img
              src={course.cover_image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {!course.cover_image && (
          <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-5xl font-bold text-white">
              {course.code.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div className="p-5">
          <div className="mb-2">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {course.code}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">
              {course.instructor_name || `${course.instructor?.first_name} ${course.instructor?.last_name}`}
            </span>
            {course.enrollment_count !== undefined && (
              <span className="text-gray-500 dark:text-gray-500">
                {course.enrollment_count} students
              </span>
            )}
          </div>
          {course.is_enrolled && (
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Enrolled
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
