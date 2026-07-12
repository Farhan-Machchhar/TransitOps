"use client";

import { useState } from "react";
import { Plus, Search, Filter, Play, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shared/status-badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- MOCK DATA FOR DEMO PURPOSES --- //
type MockVehicle = { id: string; reg: string; maxLoad: number; status: string };
type MockDriver = { id: string; name: string; expiry: string; status: string };

const INITIAL_VEHICLES: MockVehicle[] = [
  { id: "v1", reg: "TN-45-BM-1234", maxLoad: 40000, status: "AVAILABLE" },
  { id: "v2", reg: "MH-12-PQ-9876", maxLoad: 35000, status: "AVAILABLE" },
  { id: "v3", reg: "KA-05-XY-5555", maxLoad: 2500, status: "IN_SHOP" },
];

const INITIAL_DRIVERS: MockDriver[] = [
  { id: "d1", name: "Ramesh Kumar", expiry: "2027-05-12", status: "AVAILABLE" },
  { id: "d2", name: "Suresh Singh", expiry: "2024-11-20", status: "AVAILABLE" }, // Expired
  { id: "d3", name: "Kiran Patel", expiry: "2026-07-25", status: "OFF_DUTY" },
];

type Trip = {
  id: string;
  source: string;
  destination: string;
  cargoWeight: number;
  plannedDistance: number;
  vehicleId: string;
  driverId: string;
  status: "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";
  
  // Denormalized for display
  vehicleReg: string;
  driverName: string;
};

const INITIAL_TRIPS: Trip[] = [
  { 
    id: "t1", source: "Mumbai", destination: "Pune", 
    cargoWeight: 12000, plannedDistance: 150, 
    vehicleId: "v4", driverId: "d4", 
    status: "DISPATCHED", vehicleReg: "DL-01-AB-1111", driverName: "Amit Sharma" 
  },
];

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [vehicles, setVehicles] = useState<MockVehicle[]>(INITIAL_VEHICLES);
  const [drivers, setDrivers] = useState<MockDriver[]>(INITIAL_DRIVERS);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Form State
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({});
  const [cargoError, setCargoError] = useState("");
  const [completeForm, setCompleteForm] = useState({ odometer: "", fuel: "" });

  const getAvailableVehicles = () => vehicles.filter(v => v.status === "AVAILABLE");
  const getAvailableDrivers = () => {
    const now = new Date(); // In a real app this would be today's date
    return drivers.filter(d => {
      const isAvailable = d.status === "AVAILABLE";
      const isNotExpired = new Date(d.expiry) > now;
      return isAvailable && isNotExpired;
    });
  };

  const selectedVehicle = vehicles.find(v => v.id === newTrip.vehicleId);

  // Validate Cargo Weight on blur/change
  const validateCargoWeight = (weight: number, vehicleId: string) => {
    const v = vehicles.find(vx => vx.id === vehicleId);
    if (v && weight > v.maxLoad) {
      setCargoError(`Cargo weight exceeds vehicle's max load capacity (${v.maxLoad.toLocaleString()} kg).`);
      return false;
    }
    setCargoError("");
    return true;
  };

  const handleCargoChange = (val: string) => {
    const weight = Number(val);
    setNewTrip({ ...newTrip, cargoWeight: weight });
    if (newTrip.vehicleId) validateCargoWeight(weight, newTrip.vehicleId);
  };

  const handleVehicleChange = (vId: string) => {
    setNewTrip({ ...newTrip, vehicleId: vId });
    if (newTrip.cargoWeight) validateCargoWeight(newTrip.cargoWeight, vId);
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (cargoError) return; // Prevent submission

    const v = vehicles.find(vx => vx.id === newTrip.vehicleId);
    const d = drivers.find(dx => dx.id === newTrip.driverId);

    const trip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      source: newTrip.source!,
      destination: newTrip.destination!,
      cargoWeight: Number(newTrip.cargoWeight),
      plannedDistance: Number(newTrip.plannedDistance),
      vehicleId: newTrip.vehicleId!,
      driverId: newTrip.driverId!,
      status: "DRAFT",
      vehicleReg: v?.reg || "",
      driverName: d?.name || "",
    };

    setTrips([trip, ...trips]);
    setIsCreateOpen(false);
    setNewTrip({});
  };

  const handleDispatch = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    // Optimistic Update
    setTrips(trips.map(t => t.id === tripId ? { ...t, status: "DISPATCHED" } : t));
    setVehicles(vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: "ON_TRIP" } : v));
    setDrivers(drivers.map(d => d.id === trip.driverId ? { ...d, status: "ON_TRIP" } : d));
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const trip = trips.find(t => t.id === selectedTripId);
    if (!trip) return;

    // Optimistic Update
    setTrips(trips.map(t => t.id === selectedTripId ? { ...t, status: "COMPLETED" } : t));
    setVehicles(vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: "AVAILABLE" } : v));
    setDrivers(drivers.map(d => d.id === trip.driverId ? { ...d, status: "AVAILABLE" } : d));
    
    setIsCompleteOpen(false);
    setSelectedTripId(null);
    setCompleteForm({ odometer: "", fuel: "" });
  };

  const handleCancel = (tripId: string) => {
    if (!confirm("Are you sure you want to cancel this trip?")) return;
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    // Optimistic Update
    setTrips(trips.map(t => t.id === tripId ? { ...t, status: "CANCELLED" } : t));
    setVehicles(vehicles.map(v => v.id === trip.vehicleId ? { ...v, status: "AVAILABLE" } : v));
    setDrivers(drivers.map(d => d.id === trip.driverId ? { ...d, status: "AVAILABLE" } : d));
  };

  const isSubmitDisabled = !!cargoError || !newTrip.source || !newTrip.destination || !newTrip.cargoWeight || !newTrip.vehicleId || !newTrip.driverId;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Trips</h2>
          <p className="text-muted-foreground">Manage fleet dispatch, routing, and trip status.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Create Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Trip (Draft)</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTrip}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Source</label>
                    <Input required value={newTrip.source || ""} onChange={e => setNewTrip({...newTrip, source: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Destination</label>
                    <Input required value={newTrip.destination || ""} onChange={e => setNewTrip({...newTrip, destination: e.target.value})} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Assign Vehicle <span className="text-muted-foreground font-normal">(Available only)</span></label>
                  <Select onValueChange={handleVehicleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableVehicles().map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                            {v.reg} (Max Load: {v.maxLoad}kg)
                          </div>
                        </SelectItem>
                      ))}
                      {getAvailableVehicles().length === 0 && <SelectItem value="none" disabled>No vehicles available</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Assign Driver <span className="text-muted-foreground font-normal">(Available, valid license)</span></label>
                  <Select onValueChange={v => setNewTrip({...newTrip, driverId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDrivers().map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          <div className="flex items-center">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                            {d.name}
                          </div>
                        </SelectItem>
                      ))}
                      {getAvailableDrivers().length === 0 && <SelectItem value="none" disabled>No valid drivers available</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Cargo Weight (kg)</label>
                    <Input 
                      type="number" required 
                      className={cargoError ? "border-destructive focus-visible:ring-destructive" : ""}
                      value={newTrip.cargoWeight || ""} 
                      onChange={e => handleCargoChange(e.target.value)} 
                    />
                    {cargoError && <span className="text-xs text-destructive">{cargoError}</span>}
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Planned Dist. (km)</label>
                    <Input type="number" required value={newTrip.plannedDistance || ""} onChange={e => setNewTrip({...newTrip, plannedDistance: Number(e.target.value)})} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitDisabled}>Save Draft</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Complete Trip Dialog */}
      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Trip</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleComplete}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Final Odometer Reading</label>
                <Input required type="number" value={completeForm.odometer} onChange={e => setCompleteForm({...completeForm, odometer: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Fuel Consumed (Liters)</label>
                <Input required type="number" value={completeForm.fuel} onChange={e => setCompleteForm({...completeForm, fuel: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCompleteOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm Completion</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Route</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No trips found.</TableCell>
              </TableRow>
            ) : (
              trips.map((trip) => (
                <TableRow key={trip.id} className="border-border">
                  <TableCell>
                    <div className="font-medium text-foreground">{trip.source} → {trip.destination}</div>
                    <div className="text-xs text-muted-foreground">{trip.plannedDistance} km</div>
                  </TableCell>
                  <TableCell>{trip.vehicleReg}</TableCell>
                  <TableCell>{trip.driverName}</TableCell>
                  <TableCell className="text-right">{trip.cargoWeight} kg</TableCell>
                  <TableCell>
                    <StatusBadge status={trip.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {trip.status === "DRAFT" && (
                      <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400" onClick={() => handleDispatch(trip.id)}>
                        <Play className="mr-1.5 h-3.5 w-3.5" /> Dispatch
                      </Button>
                    )}
                    {trip.status === "DISPATCHED" && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400" onClick={() => { setSelectedTripId(trip.id); setIsCompleteOpen(true); }}>
                          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Complete
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400" onClick={() => handleCancel(trip.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {(trip.status === "COMPLETED" || trip.status === "CANCELLED") && (
                      <span className="text-sm text-muted-foreground/50 italic">None</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
