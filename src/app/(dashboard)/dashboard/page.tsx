"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<any>(null);
  const [lineData, setLineData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/kpis");
        const data = await res.json();
        setKpis(data.kpis);
        setLineData(data.lineData);
        setBarData(data.barData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Overview</h2>
          <p className="text-muted-foreground">Monitor your fleet performance and current active operations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all-types">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="heavy">Heavy Duty</SelectItem>
              <SelectItem value="medium">Medium Duty</SelectItem>
              <SelectItem value="light">Light Duty</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-regions">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-regions">All Regions</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!kpis || loading ? (
        <div className="flex h-64 items-center justify-center">
          <Activity className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Active Vehicles" data={kpis.activeVehicles} />
            <KpiCard title="Available Vehicles" data={kpis.availableVehicles} />
            <KpiCard title="In Maintenance" data={kpis.maintenanceVehicles} />
            <KpiCard title="Fleet Utilization %" data={kpis.fleetUtilization} suffix="%" />
            <KpiCard title="Active Trips" data={kpis.activeTrips} />
            <KpiCard title="Pending Trips" data={kpis.pendingTrips} />
            <KpiCard title="Drivers On Duty" data={kpis.driversOnDuty} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Trips Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                      <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#17181A", borderColor: "#27272A", color: "#F8FAFC" }}
                        itemStyle={{ color: "#22C55E" }}
                      />
                      <Line type="monotone" dataKey="trips" stroke="#22C55E" strokeWidth={3} dot={{ fill: "#22C55E", strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Fleet Composition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                      <XAxis dataKey="name" stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#A1A1AA" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: '#27272A' }}
                        contentStyle={{ backgroundColor: "#17181A", borderColor: "#27272A", color: "#F8FAFC" }}
                        itemStyle={{ color: "#22C55E" }}
                      />
                      <Bar dataKey="value" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ title, data, suffix = "" }: { title: string; data: { value: number; delta: string; positive: boolean }; suffix?: string }) {
  if (!data) return null;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={`flex items-center text-xs font-medium ${data.positive ? 'text-emerald-500' : 'text-red-500'}`}>
            {data.delta}
            {data.positive ? <ArrowUpRight className="ml-1 h-4 w-4" /> : <ArrowDownRight className="ml-1 h-4 w-4" />}
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <h2 className="text-3xl font-bold text-foreground">
            {data.value}{suffix}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
