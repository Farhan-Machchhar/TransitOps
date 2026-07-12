'use client';

import { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/shared/page-header';

interface Vehicle { id: string; make: string; model: string; licensePlate: string; }
interface FuelLog { id: string; vehicleId: string; gallons: number; cost: number; date: string; vehicle?: Vehicle; }
interface Expense { id: string; vehicleId: string; description: string; amount: number; date: string; vehicle?: Vehicle; }

export default function FuelExpensesPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'fuel' | 'expenses'>('fuel');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fuelForm, setFuelForm] = useState({ vehicleId: '', gallons: '', cost: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ vehicleId: '', description: '', amount: '', date: '' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fRes, eRes, vRes] = await Promise.all([
        fetch('/api/fuel-logs'),
        fetch('/api/expenses'),
        fetch('/api/vehicles'),
      ]);
      const fJson = await fRes.json();
      const eJson = await eRes.json();
      const vJson = await vRes.json();
      setFuelLogs(fJson?.data ?? []);
      setExpenses(eJson?.data ?? []);
      setVehicles(vJson?.data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/fuel-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fuelForm, gallons: parseFloat(fuelForm.gallons), cost: parseFloat(fuelForm.cost) }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j?.message); }
      setFuelForm({ vehicleId: '', gallons: '', cost: '', date: '' });
      setShowForm(false);
      fetchAll();
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...expenseForm, amount: parseFloat(expenseForm.amount) }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j?.message); }
      setExpenseForm({ vehicleId: '', description: '', amount: '', date: '' });
      setShowForm(false);
      fetchAll();
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const totalFuel = fuelLogs.reduce((s, l) => s + l.cost, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Fuel & Expenses" description="Track fuel consumption and vehicle expenses" />
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          {showForm ? '✕ Cancel' : `+ Add ${tab === 'fuel' ? 'Fuel Log' : 'Expense'}`}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-blue-100 p-4">
          <p className="text-2xl font-bold text-blue-800">{fuelLogs.length}</p>
          <p className="text-sm text-blue-600">Fuel Logs</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-2xl font-bold text-blue-700">${totalFuel.toFixed(2)}</p>
          <p className="text-sm text-blue-500">Fuel Cost</p>
        </div>
        <div className="rounded-xl bg-orange-100 p-4">
          <p className="text-2xl font-bold text-orange-800">{expenses.length}</p>
          <p className="text-sm text-orange-600">Expenses</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-2xl font-bold text-orange-700">${totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-orange-500">Total Expenses</p>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">{error}</div>}

      {/* Tabs */}
      <div className="flex gap-2">
        {(['fuel', 'expenses'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setShowForm(false); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {t === 'fuel' ? 'Fuel Logs' : 'Expenses'}
          </button>
        ))}
      </div>

      {/* Form */}
      {showForm && tab === 'fuel' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">Add Fuel Log</h3>
          <form onSubmit={handleFuelSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
              <select required value={fuelForm.vehicleId} onChange={(e) => setFuelForm((f) => ({ ...f, vehicleId: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gallons</label>
              <input required type="number" min="0" step="0.01" value={fuelForm.gallons} onChange={(e) => setFuelForm((f) => ({ ...f, gallons: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
              <input required type="number" min="0" step="0.01" value={fuelForm.cost} onChange={(e) => setFuelForm((f) => ({ ...f, cost: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" value={fuelForm.date} onChange={(e) => setFuelForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={submitting} className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">{submitting ? 'Saving…' : 'Save Fuel Log'}</button>
            </div>
          </form>
        </div>
      )}
      {showForm && tab === 'expenses' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">Add Expense</h3>
          <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
              <select required value={expenseForm.vehicleId} onChange={(e) => setExpenseForm((f) => ({ ...f, vehicleId: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <input required type="number" min="0" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input required value={expenseForm.description} onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm((f) => ({ ...f, date: e.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={submitting} className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">{submitting ? 'Saving…' : 'Save Expense'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading…</div>
        ) : tab === 'fuel' ? (
          fuelLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No fuel logs yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Vehicle</th>
                  <th className="px-6 py-3 text-right">Gallons</th>
                  <th className="px-6 py-3 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fuelLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-600">{new Date(l.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{l.vehicle ? `${l.vehicle.make} ${l.vehicle.model} (${l.vehicle.licensePlate})` : l.vehicleId}</td>
                    <td className="px-6 py-4 text-right text-slate-600">{l.gallons}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">${l.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No expenses yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Vehicle</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-600">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{e.vehicle ? `${e.vehicle.make} ${e.vehicle.model} (${e.vehicle.licensePlate})` : e.vehicleId}</td>
                    <td className="px-6 py-4 text-slate-600">{e.description}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">${e.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}
