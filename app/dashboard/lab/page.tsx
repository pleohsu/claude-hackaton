'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardCard from '../../components/DashboardCard';
import MatchCard from '../../components/MatchCard';
import dynamic from 'next/dynamic';
import { MatchWithDetails, DemandStream } from '../../util/supabaseClient';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('../../components/MapView'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />,
});

export default function LabDashboard() {
  const [demands, setDemands] = useState<DemandStream[]>([]);
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual data from API
    // For now, this is a placeholder
    setIsLoading(false);
  }, []);

  const totalWeeklyDemand = demands.reduce(
    (sum, demand) => sum + demand.weekly_quantity_needed_kg,
    0
  );
  const activeMatches = matches.filter((m) => m.status === 'active').length;
  const fulfilledDemands = demands.filter((d) => d.status === 'fulfilled').length;

  // Map locations for matched restaurants
  const mapLocations = matches
    .filter((m) => m.restaurant.latitude && m.restaurant.longitude)
    .map((m) => ({
      id: m.restaurant.id,
      name: m.restaurant.restaurant_name,
      latitude: m.restaurant.latitude!,
      longitude: m.restaurant.longitude!,
      type: 'restaurant' as const,
      details: `${m.shell_type} - ${m.matched_quantity_kg} kg/week`,
    }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lab Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your shell requirements and matches</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Weekly Demand"
            value={`${totalWeeklyDemand.toFixed(1)} kg`}
            subtitle="Total across all types"
            icon="🔬"
            color="blue"
          />
          <DashboardCard
            title="Active Matches"
            value={activeMatches}
            subtitle="With restaurants"
            icon="🔄"
            color="green"
          />
          <DashboardCard
            title="Demand Streams"
            value={demands.length}
            subtitle="Shell types needed"
            icon="📊"
            color="purple"
          />
          <DashboardCard
            title="Fulfilled"
            value={fulfilledDemands}
            subtitle="Demand streams met"
            icon="✓"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/demand/new"
              className="btn btn-primary"
            >
              + Add New Demand Request
            </Link>
            <Link
              href="/dashboard/matches"
              className="btn btn-secondary"
            >
              View All Matches
            </Link>
          </div>
        </div>

        {/* Map of Matched Restaurants */}
        {mapLocations.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Matched Restaurants</h2>
            <MapView locations={mapLocations} height="400px" />
          </div>
        )}

        {/* Current Demand Streams */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Demand Streams</h2>
          {demands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                You haven't added any demand requests yet.
              </p>
              <Link href="/demand/new" className="btn btn-primary">
                Add Your First Demand Request
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
                      Max Radius
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
                  {demands.map((demand) => (
                    <tr key={demand.id}>
                      <td className="px-4 py-3 capitalize">
                        {demand.shell_type_needed.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3">
                        {demand.weekly_quantity_needed_kg} kg
                      </td>
                      <td className="px-4 py-3">
                        {demand.max_pickup_radius_km} km
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            demand.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : demand.status === 'fulfilled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {demand.status}
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

        {/* Active Matches */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Active Matches</h2>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No matches yet. Add a demand request to get matched with restaurants!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} viewType="lab" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
