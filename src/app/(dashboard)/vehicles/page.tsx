"use client";

import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
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
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
};

const INITIAL_VEHICLES: Vehicle[] = [
  { id: "1", registrationNumber: "TN-45-BM-1234", nameModel: "Volvo FH16", type: "Heavy Duty", maxLoadCapacity: 40000, odometer: 125000, status: "AVAILABLE" },
  { id: "2", registrationNumber: "MH-12-PQ-9876", nameModel: "Scania R500", type: "Heavy Duty", maxLoadCapacity: 35000, odometer: 85000, status: "ON_TRIP" },
  { id: "3", registrationNumber: "DL-01-AB-1111", nameModel: "Tata Prima", type: "Medium Duty", maxLoadCapacity: 15000, odometer: 42000, status: "IN_SHOP" },
  { id: "4", registrationNumber: "KA-05-XY-5555", nameModel: "Ashok Leyland Dost", type: "Light Duty", maxLoadCapacity: 2500, odometer: 150000, status: "RETIRED" },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    status: "AVAILABLE",
  });
  const [formError, setFormError] = useState("");

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.nameModel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Client-side validate unique registration number
    const isDuplicate = vehicles.some(
      v => v.registrationNumber.toLowerCase() === newVehicle.registrationNumber?.toLowerCase()
    );

    if (isDuplicate) {
      setFormError("A vehicle with this Registration Number already exists.");
      return;
    }

    const vehicle: Vehicle = {
      id: Math.random().toString(36).substr(2, 9),
      registrationNumber: newVehicle.registrationNumber!,
      nameModel: newVehicle.nameModel!,
      type: newVehicle.type!,
      maxLoadCapacity: Number(newVehicle.maxLoadCapacity),
      odometer: Number(newVehicle.odometer),
      status: newVehicle.status as Vehicle["status"],
    };

    setVehicles([...vehicles, vehicle]);
    setIsAddDialogOpen(false);
    setNewVehicle({ status: "AVAILABLE" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Vehicles</h2>
          <p className="text-muted-foreground">Manage your fleet inventory, status, and capacities.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
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
                  <label htmlFor="regNo" className="text-sm font-medium">Registration Number</label>
                  <Input 
                    id="regNo" 
                    required 
                    value={newVehicle.registrationNumber || ""}
                    onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value})}
                    placeholder="e.g. TN-45-BM-1234" 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="nameModel" className="text-sm font-medium">Name / Model</label>
                  <Input 
                    id="nameModel" 
                    required 
                    value={newVehicle.nameModel || ""}
                    onChange={e => setNewVehicle({...newVehicle, nameModel: e.target.value})}
                    placeholder="e.g. Volvo FH16" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">Type</label>
                    <Select required onValueChange={v => setNewVehicle({...newVehicle, type: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Heavy Duty">Heavy Duty</SelectItem>
                        <SelectItem value="Medium Duty">Medium Duty</SelectItem>
                        <SelectItem value="Light Duty">Light Duty</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="capacity" className="text-sm font-medium">Max Load (kg)</label>
                    <Input 
                      id="capacity" 
                      type="number" 
                      required 
                      min={0}
                      value={newVehicle.maxLoadCapacity || ""}
                      onChange={e => setNewVehicle({...newVehicle, maxLoadCapacity: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="odometer" className="text-sm font-medium">Odometer (km)</label>
                    <Input 
                      id="odometer" 
                      type="number" 
                      required 
                      min={0}
                      value={newVehicle.odometer || ""}
                      onChange={e => setNewVehicle({...newVehicle, odometer: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Vehicle</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search registration or model..." 
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
            <SelectItem value="ON_TRIP">On Trip</SelectItem>
            <SelectItem value="IN_SHOP">In Shop</SelectItem>
            <SelectItem value="RETIRED">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Registration</TableHead>
              <TableHead>Name / Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Max Load</TableHead>
              <TableHead className="text-right">Odometer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No vehicles found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.nameModel}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell className="text-right">{vehicle.maxLoadCapacity.toLocaleString()} kg</TableCell>
                  <TableCell className="text-right">{vehicle.odometer.toLocaleString()} km</TableCell>
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
