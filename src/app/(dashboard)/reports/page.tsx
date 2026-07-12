"use client";

import {
  BarChart3,
  Download,
  TrendingUp,
  Truck,
  Fuel,
  IndianRupee,
  CheckCircle, Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function ReportsPage() {

  const [reports, setReports] = useState<any>(null);
  const [utilization, setUtilization] = useState<any>(null);
  const [roi, setRoi] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      const [reportsRes, utilizationRes, roiRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/reports/utilization"),
        fetch("/api/reports/roi"),
      ]);

      const reportsJson = await reportsRes.json();
      const utilizationJson = await utilizationRes.json();
      const roiJson = await roiRes.json();

      setReports(reportsJson.data);

      setUtilization(utilizationJson.data);

      setRoi(roiJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open("/api/reports/export-csv", "_blank");
  };

  const kpiCards = [
    {
      title: "Total Trips",
      value: reports?.stats?.totalTrips ?? 0,
      icon: Truck,
      color: "text-blue-500",
    },
    {
      title: "Completed Trips",
      value: reports?.stats?.completedTrips ?? 0,
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      title: "Operational Cost",
      value: reports?.stats?.operationalCost ?? 0,
      icon: IndianRupee,
      color: "text-orange-500",
      currency: true,
    },
    {
      title: "Fuel Cost",
      value: reports?.stats?.totalFuelCost ?? 0,
      icon: Fuel,
      color: "text-green-500",
      currency: true,
    },
    {
      title: "Maintenance Cost",
      value: reports?.stats?.totalMaintenanceCost ?? 0,
      icon: Wrench,
      color: "text-red-500",
      currency: true,
    },
    {
      title: "Vehicle Utilization",
      value: utilization?.vehicleUtilization ?? 0,
      icon: TrendingUp,
      color: "text-violet-500",
      percent: true,
    },
    {
      title: "ROI",
      value: roi?.roi ?? 0,
      icon: BarChart3,
      color: "text-cyan-500",
      percent: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Fleet performance insights and operational reports.
          </p>
        </div>

        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-lg border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {card.title}
                </span>

                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>

              <div className="mt-3 text-3xl font-bold">
                {card.currency
                  ? `₹${Number(card.value).toLocaleString()}`
                  : card.percent
                    ? `${card.value}%`
                    : card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="mb-4 font-semibold">
            Monthly Revenue
          </h3>

          <div className="flex h-52 items-end gap-3">
            {reports?.monthlyTrips?.map((month: any) => (
              <div
                key={month.month}
                className="flex-1 rounded-t bg-blue-500/70"
                style={{
                  height: `${Math.max(month.count * 10, 10)}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="mb-4 font-semibold">
            Top Costliest Vehicles
          </h3>

          <div className="space-y-5">
            {reports?.topCostVehicles?.map((vehicle: any) => (
              <div key={vehicle.licensePlate}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{vehicle.licensePlate}</span>
                  <span>{vehicle.cost}</span>
                </div>

                <div className="h-3 rounded-full bg-muted">
                  <div
                    className={`h-3 rounded-full ${vehicle.color}`}
                    style={{
                      width: `${vehicle.value}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h3 className="font-semibold">Generated Reports</h3>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Report</th>
              <th className="p-4">Generated</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {reports?.recentTrips?.map((trip: any) => (
              <tr
                key={trip.id}
                className="border-b last:border-0"
              >
                <td className="p-4">{trip.id.slice(0, 8)}</td>

                <td className="p-4">
                  {trip.origin} → {trip.destination}
                </td>

                <td className="p-4">
                  {new Date(trip.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${trip.status === "COMPLETED"
                      ? "bg-green-500/10 text-green-500"
                      : trip.status === "CANCELLED"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-yellow-500/10 text-yellow-500"
                      }`}
                  >
                    {trip.status}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <Button size="sm" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}