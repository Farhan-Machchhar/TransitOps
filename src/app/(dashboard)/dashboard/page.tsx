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

// USE_MOCK_DATA flag
const USE_MOCK_DATA = true;

// Mock Data
const MOCK_KPIS = {
  activeVehicles: { value: 142, delta: "+12.5%", positive: true },
  availableVehicles: { value: 89, delta: "-2.4%", positive: false },
  maintenanceVehicles: { value: 12, delta: "+1.2%", positive: false },
  activeTrips: { value: 53, delta: "+24.0%", positive: true },
  pendingTrips: { value: 18, delta: "-5.0%", positive: true }, // less pending is good
  driversOnDuty: { value: 138, delta: "+10.1%", positive: true },
  fleetUtilization: { value: 82.5, delta: "+4.3%", positive: true },
};

const MOCK_LINE_DATA = [
  { name: "Mon", trips: 42 },
  { name: "Tue", trips: 38 },
  { name: "Wed", trips: 55 },
  { name: "Thu", trips: 48 },
  { name: "Fri", trips: 62 },
  { name: "Sat", trips: 40 },
  { name: "Sun", trips: 35 },
];

const MOCK_BAR_DATA = [
  { name: "Heavy Duty", value: 45 },
  { name: "Medium Duty", value: 72 },
  { name: "Light Duty", value: 38 },
  { name: "Vans", value: 25 },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<typeof MOCK_KPIS | null>(null);

  useEffect(() => {
    // Simulate fetch
    const fetchData = async () => {
      setLoading(true);
      if (USE_MOCK_DATA) {
        await new Promise(r => setTimeout(r, 800)); // fake delay
        setKpis(MOCK_KPIS);
      } else {
        // Real fetch when ready
        // const res = await fetch("/api/dashboard/kpis");
        // const data = await res.json();
        // setKpis(data);
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
                    <LineChart data={MOCK_LINE_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    <BarChart data={MOCK_BAR_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
