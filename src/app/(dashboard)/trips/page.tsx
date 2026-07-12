'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';

interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
}
interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
}
interface Trip {
  id: string;
  origin: string;
  destination: string;
  requiredCargo: number;
  plannedDistance: number;
  status: string;
  vehicle?: Vehicle;
  driver?: Driver;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-600 text-gray-100',
  DISPATCHED: 'bg-blue-600 text-white',
  COMPLETED: 'bg-green-600 text-white',
  CANCELLED: 'bg-red-600 text-white',
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    source: '',
    destination: '',
    cargoWeight: '',
    plannedDistance: '',
    vehicleId: '',
    driverId: '',
  });

  const fetchTrips = useCallback(async () => {
    try {
      const res = await fetch('/api/trips');
      const json = await res.json();
      setTrips(json?.data ?? []);
    } catch {
      setError('Failed to load trips');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailable = useCallback(async () => {
    try {
      const res = await fetch('/api/trips/available');
      const json = await res.json();
      setVehicles(json?.data?.vehicles ?? []);
      setDrivers(json?.data?.drivers ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchTrips();
    fetchAvailable();
  }, [fetchTrips, fetchAvailable]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('create');
    setError(null);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          cargoWeight: parseFloat(form.cargoWeight),
          plannedDistance: parseFloat(form.plannedDistance),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? 'Failed to create trip');
      setForm({ source: '', destination: '', cargoWeight: '', plannedDistance: '', vehicleId: '', driverId: '' });
      setShowForm(false);
      fetchTrips();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAction = async (tripId: string, action: 'dispatch' | 'complete' | 'cancel') => {
    setActionLoading(tripId + action);
    setError(null);
    try {
      const res = await fetch(`/api/trips/${tripId}/${action}`, { method: 'PATCH' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? `Failed to ${action} trip`);
      fetchTrips();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Trip Management" description="Create, dispatch, and track logistics trips" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ New Trip'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Create Trip Form */}
      {showForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create Draft Trip</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Source</label>
              <input
                required
                value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                placeholder="e.g. Mumbai"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Destination</label>
              <input
                required
                value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                placeholder="e.g. Delhi"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cargo Weight (kg)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.cargoWeight}
                onChange={e => setForm(f => ({ ...f, cargoWeight: e.target.value }))}
                placeholder="e.g. 1500"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Planned Distance (km)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.plannedDistance}
                onChange={e => setForm(f => ({ ...f, plannedDistance: e.target.value }))}
                placeholder="e.g. 1400"
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Vehicle</label>
              <select
                required
                value={form.vehicleId}
                onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select vehicle…</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.licensePlate} — {v.make} {v.model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Driver</label>
              <select
                required
                value={form.driverId}
                onChange={e => setForm(f => ({ ...f, driverId: e.target.value }))}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select driver…</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.licenseNumber})</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={actionLoading === 'create'}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {actionLoading === 'create' ? 'Creating…' : 'Create Draft Trip'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trips Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">All Trips</h3>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading trips…</div>
        ) : trips.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No trips found. Create your first trip above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Cargo (kg)</th>
                  <th className="px-6 py-3">Distance (km)</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Driver</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {trips.map(trip => (
                  <tr key={trip.id} className="text-gray-200 hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {trip.origin} → {trip.destination}
                    </td>
                    <td className="px-6 py-4">{trip.requiredCargo ?? '—'}</td>
                    <td className="px-6 py-4">—</td>
                    <td className="px-6 py-4">{trip.vehicle?.licensePlate ?? '—'}</td>
                    <td className="px-6 py-4">
                      {trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[trip.status] ?? 'bg-gray-700 text-gray-300'}`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {trip.status === 'DRAFT' && (
                          <button
                            onClick={() => handleAction(trip.id, 'dispatch')}
                            disabled={actionLoading === trip.id + 'dispatch'}
                            className="px-2 py-1 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white rounded text-xs transition-colors"
                          >
                            Dispatch
                          </button>
                        )}
                        {trip.status === 'DISPATCHED' && (
                          <button
                            onClick={() => handleAction(trip.id, 'complete')}
                            disabled={actionLoading === trip.id + 'complete'}
                            className="px-2 py-1 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white rounded text-xs transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {(trip.status === 'DRAFT' || trip.status === 'DISPATCHED') && (
                          <button
                            onClick={() => handleAction(trip.id, 'cancel')}
                            disabled={actionLoading === trip.id + 'cancel'}
                            className="px-2 py-1 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white rounded text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {(trip.status === 'COMPLETED' || trip.status === 'CANCELLED') && (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
