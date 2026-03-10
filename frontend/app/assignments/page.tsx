'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import AssignmentCard from '@/components/AssignmentCard';
import { apiClient, Assignment } from '@/lib/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<'all' | 'todo' | 'submitted'>('all');
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getAssignments();
        setAssignments(data.results);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'todo') {
      return !assignment.submission_status?.submitted;
    }
    if (filter === 'submitted') {
      return assignment.submission_status?.submitted;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Assignments
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
              All Assignments
            </button>
            <button
              onClick={() => setFilter('todo')}
              className={`pb-4 px-2 font-medium transition-colors ${
                filter === 'todo'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              To Do ({assignments.filter(a => !a.submission_status?.submitted).length})
            </button>
            <button
              onClick={() => setFilter('submitted')}
              className={`pb-4 px-2 font-medium transition-colors ${
                filter === 'submitted'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Submitted ({assignments.filter(a => a.submission_status?.submitted).length})
            </button>
          </div>
        </div>

        {/* Assignments List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading assignments...</div>
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No assignments found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'todo' && "Great! You're all caught up on assignments."}
              {filter === 'submitted' && "You haven't submitted any assignments yet."}
              {filter === 'all' && "There are no assignments available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
