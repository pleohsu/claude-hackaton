import { MatchWithDetails } from '../util/supabaseClient';

interface MatchCardProps {
  match: MatchWithDetails;
  viewType: 'restaurant' | 'lab';
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function MatchCard({ match, viewType }: MatchCardProps) {
  const partnerName =
    viewType === 'restaurant'
      ? match.lab.institution_name
      : match.restaurant.restaurant_name;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{partnerName}</h3>
          <p className="text-sm text-gray-600">
            {viewType === 'restaurant' ? match.lab.dept : match.restaurant.address}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[match.status]
          }`}
        >
          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Shell Type</p>
          <p className="font-medium capitalize">{match.shell_type.replace('_', ' ')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Quantity</p>
          <p className="font-medium">{match.matched_quantity_kg} kg/week</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Distance</p>
          <p className="font-medium">{match.distance_km?.toFixed(1)} km</p>
        </div>
        {match.next_pickup_date && (
          <div>
            <p className="text-sm text-gray-600">Next Pickup</p>
            <p className="font-medium">
              {new Date(match.next_pickup_date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {match.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Notes</p>
          <p className="text-sm mt-1">{match.notes}</p>
        </div>
      )}
    </div>
  );
}
