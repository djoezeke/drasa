import Link from 'next/link';
import { Assignment } from '@/lib/api';

interface AssignmentCardProps {
  assignment: Assignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const dueDate = new Date(assignment.due_date);
  const now = new Date();
  const isOverdue = dueDate < now && !assignment.submission_status?.submitted;
  const isUpcoming = dueDate > now && dueDate < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Link href={`/assignments/${assignment.id}`}>
      <div className="block border rounded-lg p-5 hover:shadow-md transition-shadow duration-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {assignment.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {assignment.course_code} • {assignment.module_title}
            </p>
          </div>
          <div className="ml-4">
            {assignment.submission_status?.submitted ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {assignment.submission_status.has_grade ? 'Graded' : 'Submitted'}
              </span>
            ) : isOverdue ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Overdue
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Due Soon
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                Not Submitted
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
            <span className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Points:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {assignment.points_possible}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Type:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {assignment.submission_type.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
