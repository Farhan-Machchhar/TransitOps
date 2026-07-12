"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
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

type Vehicle = {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  status: "AVAILABLE" | "IN_USE" | "IN_SHOP" | "RETIRED";
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    status: "AVAILABLE",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/vehicles");
      const json = await res.json();
      if (json.data) {
        setVehicles(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.model?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlate: newVehicle.licensePlate,
          make: newVehicle.make,
          model: newVehicle.model,
          year: Number(newVehicle.year),
          status: newVehicle.status,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
          // Zod error array
          setFormError(json.error.map((err: any) => err.message).join(", "));
        } else {
          setFormError(json.error || "Failed to add vehicle");
        }
        setIsSubmitting(false);
        return;
      }

      setVehicles([json.data, ...vehicles]);
      setIsAddDialogOpen(false);
      setNewVehicle({ status: "AVAILABLE" });
    } catch (error) {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Vehicles</h2>
          <p className="text-muted-foreground">Manage your fleet inventory, status, and details.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />}>
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVehicle}>
              <div className="grid gap-4 py-4">
                {formError && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {formError}
                  </div>
                )}
                <div className="grid gap-2">
                  <label htmlFor="regNo" className="text-sm font-medium">License Plate</label>
                  <Input 
                    id="regNo" 
                    required 
                    value={newVehicle.licensePlate || ""}
                    onChange={e => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                    placeholder="e.g. TN-45-BM-1234" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="make" className="text-sm font-medium">Make</label>
                    <Input 
                      id="make" 
                      required 
                      value={newVehicle.make || ""}
                      onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                      placeholder="e.g. Volvo" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="model" className="text-sm font-medium">Model</label>
                    <Input 
                      id="model" 
                      required 
                      value={newVehicle.model || ""}
                      onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                      placeholder="e.g. FH16" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="year" className="text-sm font-medium">Year</label>
                    <Input 
                      id="year" 
                      type="number" 
                      required 
                      min={1990}
                      max={new Date().getFullYear() + 1}
                      value={newVehicle.year || ""}
                      onChange={e => setNewVehicle({...newVehicle, year: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="status" className="text-sm font-medium">Initial Status</label>
                    <Select defaultValue="AVAILABLE" onValueChange={v => setNewVehicle({...newVehicle, status: v as Vehicle["status"]})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="IN_SHOP">In Shop</SelectItem>
                        <SelectItem value="RETIRED">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Vehicle
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search license plate or make..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="IN_USE">In Use</SelectItem>
            <SelectItem value="IN_SHOP">In Shop</SelectItem>
            <SelectItem value="RETIRED">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>License Plate</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No vehicles found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>
                    <StatusBadge status={vehicle.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">Edit</Button>
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
