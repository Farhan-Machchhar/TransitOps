"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Vehicle = { id: string; licensePlate: string; status: string };
type Driver = { id: string; firstName: string; lastName: string; status: string };

type Trip = {
  id: string;
  origin: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  status: "DRAFT" | "DISPATCHED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  vehicle?: Vehicle;
  driver?: Driver;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch("/api/trips"),
        fetch("/api/vehicles"),
        fetch("/api/drivers")
      ]);
      const tripsJson = await tripsRes.json();
      const vehiclesJson = await vehiclesRes.json();
      const driversJson = await driversRes.json();

      if (tripsJson.data) setTrips(tripsJson.data);
      if (vehiclesJson.data) setVehicles(vehiclesJson.data);
      if (driversJson.data) setDrivers(driversJson.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableVehicles = () => vehicles.filter(v => v.status === "AVAILABLE");
  const getAvailableDrivers = () => drivers.filter(d => d.status === "AVAILABLE");

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: newTrip.origin,
          destination: newTrip.destination,
          vehicleId: newTrip.vehicleId,
          driverId: newTrip.driverId,
          status: "DRAFT"
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
          setFormError(json.error.map((err: any) => err.message).join(", "));
        } else {
          setFormError(json.error || "Failed to create trip");
        }
        setIsSubmitting(false);
        return;
      }

      // Attach nested objects for optimistic UI
      const createdTrip = json.data;
      createdTrip.vehicle = vehicles.find(v => v.id === createdTrip.vehicleId);
      createdTrip.driver = drivers.find(d => d.id === createdTrip.driverId);

      setTrips([createdTrip, ...trips]);
      setIsCreateOpen(false);
      setNewTrip({});
    } catch (error) {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDispatch = async (tripId: string) => {
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DISPATCHED" })
      });
      if (res.ok) fetchData(); // refresh all to get accurate statuses
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (tripId: string) => {
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (tripId: string) => {
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELLED",
        }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isSubmitDisabled = !newTrip.origin || !newTrip.destination || !newTrip.vehicleId || !newTrip.driverId || isSubmitting;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Trips</h2>
          <p className="text-muted-foreground">Manage fleet dispatch, routing, and trip status.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />}>
            <Plus className="mr-2 h-4 w-4" /> Create Trip
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Trip (Draft)</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTrip}>
              <div className="grid gap-4 py-4">
                {formError && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Origin</label>
                    <Input required value={newTrip.origin || ""} onChange={e => setNewTrip({ ...newTrip, origin: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Destination</label>
                    <Input required value={newTrip.destination || ""} onChange={e => setNewTrip({ ...newTrip, destination: e.target.value })} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Assign Vehicle <span className="text-muted-foreground font-normal">(Available only)</span></label>
                  <Select value={newTrip.vehicleId || ""} onValueChange={(v) => setNewTrip({ ...newTrip, vehicleId: v })}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select vehicle"
                      >
                        {vehicles.find(v => v.id === newTrip.vehicleId)?.licensePlate}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableVehicles().map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                            {v.licensePlate}
                          </div>
                        </SelectItem>
                      ))}
                      {getAvailableVehicles().length === 0 && <SelectItem value="none" disabled>No vehicles available</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Assign Driver <span className="text-muted-foreground font-normal">(Available only)</span></label>
                  <Select value={newTrip.driverId || ""} onValueChange={v => setNewTrip({ ...newTrip, driverId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver">
                        {drivers.find(d => d.id === newTrip.driverId)
                          ? `${drivers.find(d => d.id === newTrip.driverId)!.firstName} ${drivers.find(d => d.id === newTrip.driverId)!.lastName}`
                          : "Select driver"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDrivers().map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          <div className="flex items-center">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                            {d.firstName} {d.lastName}
                          </div>
                        </SelectItem>
                      ))}
                      {getAvailableDrivers().length === 0 && <SelectItem value="none" disabled>No valid drivers available</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitDisabled}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Draft
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Route</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : trips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No trips found.</TableCell>
              </TableRow>
            ) : (
              trips.map((trip) => (
                <TableRow key={trip.id} className="border-border">
                  <TableCell>
                    <div className="font-medium text-foreground">{trip.origin} → {trip.destination}</div>
                  </TableCell>
                  <TableCell>{trip.vehicle?.licensePlate || trip.vehicleId}</TableCell>
                  <TableCell>{trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : trip.driverId}</TableCell>
                  <TableCell>
                    <StatusBadge status={trip.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {trip.status === "DRAFT" && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400" onClick={() => handleDispatch(trip.id)}>
                          <Play className="mr-1.5 h-3.5 w-3.5" /> Dispatch
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Trip?</AlertDialogTitle>

                              <AlertDialogDescription>
                                This will cancel the trip from{" "}
                                <strong>{trip.origin}</strong> to{" "}
                                <strong>{trip.destination}</strong>.
                                <br />
                                <br />
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Trip
                              </AlertDialogCancel>

                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleCancel(trip.id)}
                              >
                                Cancel Trip
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    {trip.status === "DISPATCHED" && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400" onClick={() => handleComplete(trip.id)}>
                          <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Complete
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Trip?</AlertDialogTitle>

                              <AlertDialogDescription>
                                This will cancel the trip from{" "}
                                <strong>{trip.origin}</strong> to{" "}
                                <strong>{trip.destination}</strong>.
                                <br />
                                <br />
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Trip
                              </AlertDialogCancel>

                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleCancel(trip.id)}
                              >
                                Cancel Trip
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
