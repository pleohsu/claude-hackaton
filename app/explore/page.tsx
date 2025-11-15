'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../components/MapView'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />,
});

interface Restaurant {
  id: string;
  restaurant_name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  storage_method: string;
  cleanliness_level: string;
  contact_phone: string;
}

interface Lab {
  id: string;
  institution_name: string;
  lab_name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  application: string;
  max_pickup_radius_km: number;
}

interface SupplyStream {
  id: string;
  shell_type: string;
  weekly_quantity_kg: number;
  status: string;
  restaurant: Restaurant;
}

interface DemandStream {
  id: string;
  shell_type_needed: string;
  weekly_quantity_needed_kg: number;
  status: string;
  lab: Lab;
}

export default function ExplorePage() {
  const [view, setView] = useState<'restaurants' | 'labs'>('restaurants');
  const [supplies, setSupplies] = useState<SupplyStream[]>([]);
  const [demands, setDemands] = useState<DemandStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all supplies
      const suppliesResponse = await fetch('/api/supply');
      if (suppliesResponse.ok) {
        const suppliesData = await suppliesResponse.json();
        setSupplies(suppliesData.supplies || []);
      }

      // Fetch all demands
      const demandsResponse = await fetch('/api/demand');
      if (demandsResponse.ok) {
        const demandsData = await demandsResponse.json();
        setDemands(demandsData.demands || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique restaurants from supplies
  const restaurants = Array.from(
    new Map(
      supplies
        .filter((s) => s.restaurant)
        .map((s) => [s.restaurant.id, s.restaurant])
    ).values()
  );

  // Get unique labs from demands
  const labs = Array.from(
    new Map(
      demands
        .filter((d) => d.lab)
        .map((d) => [d.lab.id, d.lab])
    ).values()
  );

  // Filter based on search
  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.restaurant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLabs = labs.filter(
    (l) =>
      l.institution_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.lab_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map locations
  const mapLocations =
    view === 'restaurants'
      ? filteredRestaurants
          .filter((r) => r.latitude && r.longitude)
          .map((r) => ({
            id: r.id,
            name: r.restaurant_name,
            latitude: r.latitude!,
            longitude: r.longitude!,
            type: 'restaurant' as const,
            details: r.address,
          }))
      : filteredLabs
          .filter((l) => l.latitude && l.longitude)
          .map((l) => ({
            id: l.id,
            name: l.institution_name,
            latitude: l.latitude!,
            longitude: l.longitude!,
            type: 'lab' as const,
            details: l.lab_name || l.address,
          }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Explore the Network
          </h1>
          <p className="text-gray-600 mt-2">
            Browse restaurants providing shells and labs conducting research
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('restaurants')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              view === 'restaurants'
                ? 'bg-ocean-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🍤 Restaurants ({restaurants.length})
          </button>
          <button
            onClick={() => setView('labs')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              view === 'labs'
                ? 'bg-ocean-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔬 Research Labs ({labs.length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Search ${view === 'restaurants' ? 'restaurants' : 'labs'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>

        {/* Map */}
        {mapLocations.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Map View</h2>
            <MapView locations={mapLocations} height="500px" />
          </div>
        )}

        {/* List View */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            {view === 'restaurants' ? 'Restaurant Listings' : 'Lab Listings'}
          </h2>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : view === 'restaurants' ? (
            <div className="space-y-4">
              {filteredRestaurants.length === 0 ? (
                <p className="text-center py-12 text-gray-600">
                  No restaurants found
                </p>
              ) : (
                filteredRestaurants.map((restaurant) => {
                  const restaurantSupplies = supplies.filter(
                    (s) => s.restaurant?.id === restaurant.id
                  );
                  return (
                    <div
                      key={restaurant.id}
                      className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {restaurant.restaurant_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            📍 {restaurant.address}
                          </p>
                          {restaurant.contact_phone && (
                            <p className="text-sm text-gray-600">
                              📞 {restaurant.contact_phone}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {restaurantSupplies.length} Shell Types
                          </span>
                        </div>
                      </div>

                      {restaurantSupplies.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Available Shells:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {restaurantSupplies.map((supply) => (
                              <div
                                key={supply.id}
                                className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-sm"
                              >
                                <span className="font-medium capitalize">
                                  {supply.shell_type.replace('_', ' ')}
                                </span>
                                {' · '}
                                <span className="text-gray-600">
                                  {supply.weekly_quantity_kg} kg/week
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex gap-4 text-sm text-gray-600">
                        <span className="capitalize">
                          Storage: {restaurant.storage_method?.replace('_', ' ')}
                        </span>
                        <span className="capitalize">
                          Cleanliness: {restaurant.cleanliness_level?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLabs.length === 0 ? (
                <p className="text-center py-12 text-gray-600">No labs found</p>
              ) : (
                filteredLabs.map((lab) => {
                  const labDemands = demands.filter((d) => d.lab?.id === lab.id);
                  return (
                    <div
                      key={lab.id}
                      className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {lab.institution_name}
                          </h3>
                          {lab.lab_name && (
                            <p className="text-sm font-medium text-gray-700">
                              {lab.lab_name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            📍 {lab.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {labDemands.length} Research Needs
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold">Research:</span>{' '}
                        {lab.application}
                      </p>

                      {labDemands.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Shells Needed:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {labDemands.map((demand) => (
                              <div
                                key={demand.id}
                                className="px-3 py-1 bg-white rounded-lg border border-gray-200 text-sm"
                              >
                                <span className="font-medium capitalize">
                                  {demand.shell_type_needed.replace('_', ' ')}
                                </span>
                                {' · '}
                                <span className="text-gray-600">
                                  {demand.weekly_quantity_needed_kg} kg/week
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 text-sm text-gray-600">
                        <span>
                          Pickup radius: {lab.max_pickup_radius_km} km
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
