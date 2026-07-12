'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: string;
  cargoCapacity: number;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  IN_USE: 'bg-blue-100 text-blue-800',
  IN_SHOP: 'bg-yellow-100 text-yellow-800',
  RETIRED: 'bg-red-100 text-red-800',
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vehicles');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setVehicles(json?.data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const filtered = vehicles.filter((v) => {
    const matchesSearch =
      v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === 'AVAILABLE').length,
    inUse: vehicles.filter((v) => v.status === 'IN_USE').length,
    inShop: vehicles.filter((v) => v.status === 'IN_SHOP').length,
    retired: vehicles.filter((v) => v.status === 'RETIRED').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Vehicles" description="Manage your fleet vehicles" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: counts.total, color: 'bg-slate-100 text-slate-800' },
          { label: 'Available', value: counts.available, color: 'bg-green-100 text-green-800' },
          { label: 'In Use', value: counts.inUse, color: 'bg-blue-100 text-blue-800' },
          { label: 'In Shop', value: counts.inShop, color: 'bg-yellow-100 text-yellow-800' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Search by plate, make, or model…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="ALL">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="IN_USE">In Use</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>
        <button
          onClick={fetchVehicles}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">{error}</div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading vehicles…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            {vehicles.length === 0 ? 'No vehicles in database. Run the seed script to add sample data.' : 'No vehicles match the current filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Vehicle</th>
                  <th className="px-6 py-3 text-left">Year</th>
                  <th className="px-6 py-3 text-left">License Plate</th>
                  <th className="px-6 py-3 text-left">Cargo Capacity</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {v.make} {v.model}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{v.year}</td>
                    <td className="px-6 py-4 font-mono text-slate-700">{v.licensePlate}</td>
                    <td className="px-6 py-4 text-slate-600">{v.cargoCapacity} kg</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[v.status] ?? 'bg-gray-100 text-gray-800'}`}>
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {vehicles.length} vehicles</p>
    </div>
  );
}
