'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardCard from '../../components/DashboardCard';
import MatchCard from '../../components/MatchCard';
import { MatchWithDetails, SupplyStream } from '../../util/supabaseClient';

export default function RestaurantDashboard() {
  const router = useRouter();
  const [supplies, setSupplies] = useState<SupplyStream[]>([]);
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check session
      const sessionResponse = await fetch('/api/auth/session');
      if (!sessionResponse.ok) {
        router.push('/login');
        return;
      }

      const sessionData = await sessionResponse.json();
      if (sessionData.user.userType !== 'restaurant') {
        router.push('/login');
        return;
      }

      const restId = sessionData.user.profile?.id;
      setRestaurantId(restId);

      // Fetch supplies
      if (restId) {
        const suppliesResponse = await fetch(`/api/supply?restaurant_id=${restId}`);
        if (suppliesResponse.ok) {
          const suppliesData = await suppliesResponse.json();
          setSupplies(suppliesData.supplies || []);
        }

        // Fetch matches
        const matchesResponse = await fetch(`/api/match?restaurant_id=${restId}`);
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          setMatches(matchesData.matches || []);
        }
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalWeeklySupply = supplies.reduce(
    (sum, supply) => sum + supply.weekly_quantity_kg,
    0
  );
  const activeMatches = matches.filter((m) => m.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your shell supply and matches</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Weekly Supply"
            value={`${totalWeeklySupply.toFixed(1)} kg`}
            subtitle="Total across all types"
            icon="🦐"
            color="blue"
          />
          <DashboardCard
            title="Active Matches"
            value={activeMatches}
            subtitle="With research labs"
            icon="🔄"
            color="green"
          />
          <DashboardCard
            title="Supply Streams"
            value={supplies.length}
            subtitle="Shell types listed"
            icon="📊"
            color="purple"
          />
          <DashboardCard
            title="This Month"
            value="0 kg"
            subtitle="Shells recycled"
            icon="♻️"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/supply/new"
              className="btn btn-primary"
            >
              + Add New Supply Listing
            </Link>
            <Link
              href="/dashboard/matches"
              className="btn btn-secondary"
            >
              View All Matches
            </Link>
          </div>
        </div>

        {/* Current Supply Streams */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Supply Streams</h2>
          {supplies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                You haven't added any supply streams yet.
              </p>
              <Link href="/supply/new" className="btn btn-primary">
                Add Your First Supply Stream
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Shell Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Weekly Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Storage
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {supplies.map((supply) => (
                    <tr key={supply.id}>
                      <td className="px-4 py-3 capitalize">
                        {supply.shell_type.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3">{supply.weekly_quantity_kg} kg</td>
                      <td className="px-4 py-3 capitalize">
                        {supply.storage_method?.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            supply.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {supply.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-ocean-600 hover:text-ocean-700 text-sm">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Matches */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Active Matches</h2>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No matches yet. Add a supply stream to get matched with labs!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} viewType="restaurant" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
