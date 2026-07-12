"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Loader2, Edit, Trash2 } from "lucide-react";
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
  type: string;
  year: number;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Edit State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete State
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

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
          type: newVehicle.type || "Truck",
          year: Number(newVehicle.year),
          maxLoadCapacity: Number(newVehicle.maxLoadCapacity),
          odometer: Number(newVehicle.odometer),
          acquisitionCost: Number(newVehicle.acquisitionCost),
          status: newVehicle.status,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
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

  const handleEditVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licensePlate: editingVehicle.licensePlate,
          make: editingVehicle.make,
          model: editingVehicle.model,
          type: editingVehicle.type,
          year: Number(editingVehicle.year),
          maxLoadCapacity: Number(editingVehicle.maxLoadCapacity),
          odometer: Number(editingVehicle.odometer),
          acquisitionCost: Number(editingVehicle.acquisitionCost),
          status: editingVehicle.status,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
          setFormError(json.error.map((err: any) => err.message).join(", "));
        } else {
          setFormError(json.error || "Failed to update vehicle");
        }
        setIsSubmitting(false);
        return;
      }

      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? json.data : v));
      setIsEditDialogOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) return;
    
    setDeletingVehicleId(id);
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete vehicle");
      }

      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      alert("Failed to delete vehicle");
    } finally {
      setDeletingVehicleId(null);
    }
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setEditingVehicle({ ...vehicle });
    setFormError("");
    setIsEditDialogOpen(true);
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
                        <SelectItem value="ON_TRIP">On Trip</SelectItem>
                        <SelectItem value="IN_SHOP">In Shop</SelectItem>
                        <SelectItem value="RETIRED">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">Type</label>
                    <Input 
                      id="type" 
                      required 
                      value={newVehicle.type || ""}
                      onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
                      placeholder="e.g. Truck, Van" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="maxLoadCapacity" className="text-sm font-medium">Max Load (kg)</label>
                    <Input 
                      id="maxLoadCapacity" 
                      type="number" 
                      required 
                      value={newVehicle.maxLoadCapacity || ""}
                      onChange={e => setNewVehicle({...newVehicle, maxLoadCapacity: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="odometer" className="text-sm font-medium">Odometer</label>
                    <Input 
                      id="odometer" 
                      type="number" 
                      required 
                      value={newVehicle.odometer || ""}
                      onChange={e => setNewVehicle({...newVehicle, odometer: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="acquisitionCost" className="text-sm font-medium">Acquisition Cost</label>
                    <Input 
                      id="acquisitionCost" 
                      type="number" 
                      required 
                      value={newVehicle.acquisitionCost || ""}
                      onChange={e => setNewVehicle({...newVehicle, acquisitionCost: Number(e.target.value)})}
                    />
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
            placeholder="Search license plate, make or model..." 
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
              <TableHead>License Plate</TableHead>
              <TableHead>Make/Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity (kg)</TableHead>
              <TableHead>Odometer</TableHead>
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
                  <TableCell>{vehicle.make} {vehicle.model} ({vehicle.year})</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.maxLoadCapacity}</TableCell>
                  <TableCell>{vehicle.odometer}</TableCell>
                  <TableCell>
                    <StatusBadge status={vehicle.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(vehicle)}
                        className="text-muted-foreground hover:text-emerald-500"
                        title="Edit Vehicle"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        disabled={deletingVehicleId === vehicle.id}
                        className="text-muted-foreground hover:text-destructive"
                        title="Delete Vehicle"
                      >
                        {deletingVehicleId === vehicle.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <form onSubmit={handleEditVehicle}>
              <div className="grid gap-4 py-4">
                {formError && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {formError}
                  </div>
                )}
                <div className="grid gap-2">
                  <label htmlFor="edit-regNo" className="text-sm font-medium">License Plate</label>
                  <Input 
                    id="edit-regNo" 
                    required 
                    value={editingVehicle.licensePlate}
                    onChange={e => setEditingVehicle({...editingVehicle, licensePlate: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-make" className="text-sm font-medium">Make</label>
                    <Input 
                      id="edit-make" 
                      required 
                      value={editingVehicle.make}
                      onChange={e => setEditingVehicle({...editingVehicle, make: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-model" className="text-sm font-medium">Model</label>
                    <Input 
                      id="edit-model" 
                      required 
                      value={editingVehicle.model}
                      onChange={e => setEditingVehicle({...editingVehicle, model: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-year" className="text-sm font-medium">Year</label>
                    <Input 
                      id="edit-year" 
                      type="number" 
                      required 
                      min={1990}
                      max={new Date().getFullYear() + 1}
                      value={editingVehicle.year}
                      onChange={e => setEditingVehicle({...editingVehicle, year: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                    <Select 
                      value={editingVehicle.status} 
                      onValueChange={v => setEditingVehicle({...editingVehicle, status: v as Vehicle["status"]})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="ON_TRIP">On Trip</SelectItem>
                        <SelectItem value="IN_SHOP">In Shop</SelectItem>
                        <SelectItem value="RETIRED">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-type" className="text-sm font-medium">Type</label>
                    <Input 
                      id="edit-type" 
                      required 
                      value={editingVehicle.type}
                      onChange={e => setEditingVehicle({...editingVehicle, type: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-maxLoadCapacity" className="text-sm font-medium">Max Load (kg)</label>
                    <Input 
                      id="edit-maxLoadCapacity" 
                      type="number" 
                      required 
                      value={editingVehicle.maxLoadCapacity}
                      onChange={e => setEditingVehicle({...editingVehicle, maxLoadCapacity: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-odometer" className="text-sm font-medium">Odometer</label>
                    <Input 
                      id="edit-odometer" 
                      type="number" 
                      required 
                      value={editingVehicle.odometer}
                      onChange={e => setEditingVehicle({...editingVehicle, odometer: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-acquisitionCost" className="text-sm font-medium">Acquisition Cost</label>
                    <Input 
                      id="edit-acquisitionCost" 
                      type="number" 
                      required 
                      value={editingVehicle.acquisitionCost}
                      onChange={e => setEditingVehicle({...editingVehicle, acquisitionCost: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
