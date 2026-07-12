'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  status: string;
  licenseExpiry: string | null;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ON_TRIP: 'bg-blue-100 text-blue-800',
  SUSPENDED: 'bg-red-100 text-red-800',
  EXPIRED_LICENSE: 'bg-orange-100 text-orange-800',
};

function isExpired(date: string | null): boolean {
  if (!date) return false;
  return new Date(date) <= new Date();
}

function isExpiringSoon(date: string | null): boolean {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= 30;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/drivers');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setDrivers(json?.data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  const filtered = drivers.filter((d) => {
    const name = `${d.firstName} ${d.lastName}`.toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: drivers.length,
    available: drivers.filter((d) => d.status === 'AVAILABLE').length,
    onTrip: drivers.filter((d) => d.status === 'ON_TRIP').length,
    suspended: drivers.filter((d) => d.status === 'SUSPENDED').length,
    expired: drivers.filter((d) => d.status === 'EXPIRED_LICENSE').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Drivers" description="Manage your fleet drivers" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: counts.total, color: 'bg-slate-100 text-slate-800' },
          { label: 'Available', value: counts.available, color: 'bg-green-100 text-green-800' },
          { label: 'On Trip', value: counts.onTrip, color: 'bg-blue-100 text-blue-800' },
          { label: 'Suspended', value: counts.suspended, color: 'bg-red-100 text-red-800' },
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
          placeholder="Search by name or license number…"
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
          <option value="ON_TRIP">On Trip</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="EXPIRED_LICENSE">Expired License</option>
        </select>
        <button
          onClick={fetchDrivers}
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
          <div className="p-12 text-center text-slate-400">Loading drivers…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            {drivers.length === 0 ? 'No drivers in database. Run the seed script to add sample data.' : 'No drivers match the current filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">License #</th>
                  <th className="px-6 py-3 text-left">License Expiry</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d) => {
                  const expired = isExpired(d.licenseExpiry);
                  const expiringSoon = isExpiringSoon(d.licenseExpiry);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {d.firstName} {d.lastName}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-700">{d.licenseNumber}</td>
                      <td className="px-6 py-4">
                        {d.licenseExpiry ? (
                          <span className={expired ? 'text-red-600 font-semibold' : expiringSoon ? 'text-orange-600 font-semibold' : 'text-slate-600'}>
                            {new Date(d.licenseExpiry).toLocaleDateString()}
                            {expired && ' (Expired)'}
                            {expiringSoon && !expired && ' (Expiring soon)'}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[d.status] ?? 'bg-gray-100 text-gray-800'}`}>
                          {d.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400">Showing {filtered.length} of {drivers.length} drivers</p>
    </div>
  );
}
