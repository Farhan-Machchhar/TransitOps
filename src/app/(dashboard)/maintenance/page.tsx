'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';

interface Vehicle { id: string; make: string; model: string; licensePlate: string; }
interface MaintenanceLog {
  id: string;
  vehicleId: string;
  description: string;
  cost: number;
  date: string;
  vehicle?: Vehicle;
}

export default function MaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Include optional id for edit mode
  const [form, setForm] = useState({ id: '', vehicleId: '', description: '', cost: '', date: '' });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/maintenance');
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = await res.json();
      setLogs(json?.data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load maintenance logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles');
      if (!res.ok) return;
      const json = await res.json();
      setVehicles(json?.data ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, [fetchLogs, fetchVehicles]);

  const totalCost = logs.reduce((sum, l) => sum + l.cost, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const isEdit = !!form.id;
      const endpoint = isEdit ? `/api/maintenance/${form.id}` : '/api/maintenance';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cost: parseFloat(form.cost) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? `Failed to ${isEdit ? 'update' : 'create'} log`);
      setForm({ id: '', vehicleId: '', description: '', cost: '', date: '' });
      setShowForm(false);
      fetchLogs();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Maintenance" description="Vehicle maintenance tracking" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ Log Maintenance'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-100 p-4">
          <p className="text-2xl font-bold text-slate-800">{logs.length}</p>
          <p className="text-sm text-slate-600">Total Logs</p>
        </div>
        <div className="rounded-xl bg-yellow-100 p-4">
          <p className="text-2xl font-bold text-yellow-800">${totalCost.toFixed(2)}</p>
          <p className="text-sm text-yellow-600">Total Cost</p>
        </div>
        <div className="rounded-xl bg-blue-100 p-4">
          <p className="text-2xl font-bold text-blue-800">{vehicles.length}</p>
          <p className="text-sm text-blue-600">Vehicles</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">{error}</div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Log Maintenance</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
              <select
                required
                value={form.vehicleId}
                onChange={(e) => setForm((f) => ({ ...f, vehicleId: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.licensePlate})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                placeholder="e.g. 250.00"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the maintenance work…"
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Saving…' : 'Save Log'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Maintenance History</h3>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading…</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No maintenance logs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Vehicle</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-right">Cost</th>
                  <th className="px-6 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {log.vehicle ? `${log.vehicle.make} ${log.vehicle.model} (${log.vehicle.licensePlate})` : log.vehicleId}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{log.description}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">${log.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setForm({
                            id: log.id,
                            vehicleId: log.vehicleId,
                            description: log.description,
                            cost: log.cost.toString(),
                            date: log.date.substring(0, 10),
                          });
                          setShowForm(true);
                        }}
                        className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >Edit</button>
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
