'use client';

import { useState } from 'react';

interface DatabaseStatus {
  users: number;
  restaurants: number;
  labs: number;
  supply_streams: number;
  demand_streams: number;
  matches: number;
}

interface SeedResults {
  users: number;
  restaurants: number;
  labs: number;
  supplies: number;
  demands: number;
  errors: string[];
}

export default function AdminPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [seedResults, setSeedResults] = useState<SeedResults | null>(null);
  const [matchResults, setMatchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();
      setStatus(data.database_status);
    } catch (err) {
      setError('Failed to check database status');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    if (!confirm('This will add mock data to the database. Continue?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSeedResults(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setSeedResults(data.results);
        // Refresh status
        await checkStatus();
      } else {
        setError(data.message || 'Failed to seed database');
      }
    } catch (err) {
      setError('Failed to seed database');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runMatching = async () => {
    setIsLoading(true);
    setError(null);
    setMatchResults(null);

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto_match: true }),
      });
      const data = await response.json();

      if (response.ok) {
        setMatchResults(data);
        // Refresh status
        await checkStatus();
      } else {
        setError(data.message || 'Failed to run matching algorithm');
      }
    } catch (err) {
      setError('Failed to run matching algorithm');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Manage mock data and test the matching algorithm
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Database Status */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Database Status</h2>
              <button
                onClick={checkStatus}
                disabled={isLoading}
                className="btn btn-secondary"
              >
                {isLoading ? 'Checking...' : 'Check Status'}
              </button>
            </div>

            {status && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {status.users}
                  </div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {status.restaurants}
                  </div>
                  <div className="text-sm text-gray-600">Restaurants</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {status.labs}
                  </div>
                  <div className="text-sm text-gray-600">Labs</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {status.supply_streams}
                  </div>
                  <div className="text-sm text-gray-600">Supply Streams</div>
                </div>
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="text-2xl font-bold text-pink-600">
                    {status.demand_streams}
                  </div>
                  <div className="text-sm text-gray-600">Demand Streams</div>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">
                    {status.matches}
                  </div>
                  <div className="text-sm text-gray-600">Matches</div>
                </div>
              </div>
            )}
          </div>

          {/* Seed Database */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Seed Mock Data</h2>
            <p className="text-gray-600 mb-4">
              Add mock restaurants, labs, supply streams, and demand streams to the
              database for testing.
            </p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Includes:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>8 Boston-area seafood restaurants</li>
                <li>5 research labs (MIT, Harvard, Northeastern, BU, Tufts)</li>
                <li>18 supply streams (various shell types)</li>
                <li>10 demand streams (research needs)</li>
                <li>Real addresses with geocoding</li>
              </ul>
            </div>
            <button
              onClick={seedDatabase}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Seeding...' : 'Seed Database'}
            </button>

            {seedResults && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">
                  Seeding Results:
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>✓ Users created: {seedResults.users}</p>
                  <p>✓ Restaurants created: {seedResults.restaurants}</p>
                  <p>✓ Labs created: {seedResults.labs}</p>
                  <p>✓ Supply streams created: {seedResults.supplies}</p>
                  <p>✓ Demand streams created: {seedResults.demands}</p>
                </div>
                {seedResults.errors.length > 0 && (
                  <div className="mt-3 text-sm text-orange-600">
                    <p className="font-semibold">Warnings:</p>
                    <ul className="list-disc list-inside">
                      {seedResults.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                    {seedResults.errors.length > 5 && (
                      <p className="mt-1">
                        ... and {seedResults.errors.length - 5} more
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Run Matching Algorithm */}
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Matching Algorithm</h2>
            <p className="text-gray-600 mb-4">
              Run the automatic matching algorithm to connect restaurants with labs
              based on shell type, location, and quantity.
            </p>
            <button
              onClick={runMatching}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? 'Running...' : 'Run Matching Algorithm'}
            </button>

            {matchResults && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">
                  Matching Results:
                </h3>
                <div className="text-sm text-gray-700">
                  <p>
                    ✓ Matches created:{' '}
                    {matchResults.matches?.length || 'Check database for results'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Test Credentials */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Credentials</h2>
            <p className="text-sm text-gray-600 mb-4">
              All test accounts use password: <code className="bg-white px-2 py-1 rounded">password123</code>
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">🍤 Restaurants:</h3>
                <ul className="text-sm space-y-1 font-mono">
                  <li>manager@legalseafoods.com</li>
                  <li>chef@neptuneoyster.com</li>
                  <li>operations@islandcreek.com</li>
                  <li>manager@barkingcrab.com</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔬 Labs:</h3>
                <ul className="text-sm space-y-1 font-mono">
                  <li>s.chen@mit.edu</li>
                  <li>m.rodriguez@harvard.edu</li>
                  <li>e.patel@northeastern.edu</li>
                  <li>j.wilson@bu.edu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
