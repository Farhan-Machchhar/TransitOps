'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';

export default function DashboardPage() {
  const [counts, setCounts] = useState({ vehicles: 0, drivers: 0, trips: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      const [vRes, dRes, tRes, mRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/drivers'),
        fetch('/api/trips'),
        fetch('/api/maintenance'),
      ]);
      const [vJson, dJson, tJson, mJson] = await Promise.all([
        vRes.json(),
        dRes.json(),
        tRes.json(),
        mRes.json(),
      ]);
      setCounts({
        vehicles: (vJson?.data ?? []).length,
        drivers: (dJson?.data ?? []).length,
        trips: (tJson?.data ?? []).length,
        maintenance: (mJson?.data ?? []).length,
      });
    } catch (e) {
      console.error('Dashboard load error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const cards = [
    { label: 'Vehicles', value: counts.vehicles, bg: 'bg-emerald-100 text-emerald-800' },
    { label: 'Drivers', value: counts.drivers, bg: 'bg-sky-100 text-sky-800' },
    { label: 'Trips', value: counts.trips, bg: 'bg-orange-100 text-orange-800' },
    { label: 'Maintenance', value: counts.maintenance, bg: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="System overview" />
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className={`rounded-xl p-6 ${c.bg}`}>
              <p className="text-3xl font-bold">{c.value}</p>
              <p className="text-sm font-medium">{c.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
