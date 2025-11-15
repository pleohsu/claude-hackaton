'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchCard from '../../components/MatchCard';
import { MatchWithDetails } from '../../util/supabaseClient';
import { getSession } from '../../util/session';

export default function MatchesDashboard() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [viewType, setViewType] = useState<'restaurant' | 'lab'>('restaurant');

  useEffect(() => {
    const session = getSession();
    if (!session) {
      // Redirect to home if not logged in
      router.push('/');
      return;
    }

    setViewType(session.userType);

    async function fetchMatches() {
      try {
        const queryParam = session.userType === 'restaurant'
          ? `restaurant_id=${session.entityId}`
          : `lab_id=${session.entityId}`;

        const response = await fetch(`/api/matches?${queryParam}`);
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMatches();
  }, [router]);

  const filteredMatches =
    filter === 'all'
      ? matches
      : matches.filter((m) => m.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Matches</h1>
          <p className="text-gray-600 mt-2">View and manage your matches</p>
        </div>

        {/* Filter Tabs */}
        <div className="card mb-8">
          <div className="flex space-x-4 border-b border-gray-200">
            {(['all', 'pending', 'active', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  filter === status
                    ? 'border-b-2 border-ocean-600 text-ocean-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
                {status !== 'all' && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({matches.filter((m) => m.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">
              No {filter !== 'all' ? filter : ''} matches found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                viewType={viewType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
