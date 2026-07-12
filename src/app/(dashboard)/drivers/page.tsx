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

type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: number;
  status: "AVAILABLE" | "ON_TRIP" | "SUSPENDED" | "OFF_DUTY";
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Edit State
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Delete State
  const [deletingDriverId, setDeletingDriverId] = useState<string | null>(null);

  // Form State
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    status: "AVAILABLE",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/drivers");
      const json = await res.json();
      if (json.data) {
        setDrivers(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch drivers", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(d => {
    const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          d.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newDriver.firstName,
          lastName: newDriver.lastName,
          licenseNumber: newDriver.licenseNumber,
          licenseCategory: newDriver.licenseCategory || "Standard",
          licenseExpiryDate: newDriver.licenseExpiryDate || new Date().toISOString(),
          contactNumber: newDriver.contactNumber || "555-0000",
          safetyScore: Number(newDriver.safetyScore) || 100,
          status: newDriver.status,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
          setFormError(json.error.map((err: any) => err.message).join(", "));
        } else {
          setFormError(json.error || "Failed to add driver");
        }
        setIsSubmitting(false);
        return;
      }

      setDrivers([json.data, ...drivers]);
      setIsAddDialogOpen(false);
      setNewDriver({ status: "AVAILABLE" });
    } catch (error) {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;
    
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/drivers/${editingDriver.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editingDriver.firstName,
          lastName: editingDriver.lastName,
          licenseNumber: editingDriver.licenseNumber,
          licenseCategory: editingDriver.licenseCategory,
          licenseExpiryDate: editingDriver.licenseExpiryDate,
          contactNumber: editingDriver.contactNumber,
          safetyScore: Number(editingDriver.safetyScore),
          status: editingDriver.status,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
          setFormError(json.error.map((err: any) => err.message).join(", "));
        } else {
          setFormError(json.error || "Failed to update driver");
        }
        setIsSubmitting(false);
        return;
      }

      setDrivers(drivers.map(d => d.id === editingDriver.id ? json.data : d));
      setIsEditDialogOpen(false);
      setEditingDriver(null);
    } catch (error) {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver? This action cannot be undone.")) return;
    
    setDeletingDriverId(id);
    try {
      const res = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete driver");
      }

      setDrivers(drivers.filter(d => d.id !== id));
    } catch (error) {
      alert("Failed to delete driver");
    } finally {
      setDeletingDriverId(null);
    }
  };

  const openEditDialog = (driver: Driver) => {
    setEditingDriver({ ...driver });
    setFormError("");
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Drivers</h2>
          <p className="text-muted-foreground">Manage your drivers, licenses, and status.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />}>
            <Plus className="mr-2 h-4 w-4" /> Add Driver
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDriver}>
              <div className="grid gap-4 py-4">
                {formError && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input 
                      id="firstName" 
                      required 
                      value={newDriver.firstName || ""}
                      onChange={e => setNewDriver({...newDriver, firstName: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input 
                      id="lastName" 
                      required 
                      value={newDriver.lastName || ""}
                      onChange={e => setNewDriver({...newDriver, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="licenseNo" className="text-sm font-medium">License No.</label>
                    <Input 
                      id="licenseNo" 
                      required 
                      value={newDriver.licenseNumber || ""}
                      onChange={e => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <Select defaultValue="AVAILABLE" onValueChange={v => setNewDriver({...newDriver, status: v as Driver["status"]})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="ON_TRIP">On Trip</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="licenseCategory" className="text-sm font-medium">License Category</label>
                    <Input 
                      id="licenseCategory" 
                      required 
                      value={newDriver.licenseCategory || ""}
                      onChange={e => setNewDriver({...newDriver, licenseCategory: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="licenseExpiryDate" className="text-sm font-medium">Expiry Date</label>
                    <Input 
                      id="licenseExpiryDate" 
                      type="date"
                      required 
                      value={newDriver.licenseExpiryDate ? new Date(newDriver.licenseExpiryDate).toISOString().split('T')[0] : ""}
                      onChange={e => setNewDriver({...newDriver, licenseExpiryDate: new Date(e.target.value).toISOString()})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</label>
                    <Input 
                      id="contactNumber" 
                      required 
                      value={newDriver.contactNumber || ""}
                      onChange={e => setNewDriver({...newDriver, contactNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="safetyScore" className="text-sm font-medium">Safety Score</label>
                    <Input 
                      id="safetyScore" 
                      type="number"
                      min={0}
                      max={100}
                      required 
                      value={newDriver.safetyScore || ""}
                      onChange={e => setNewDriver({...newDriver, safetyScore: Number(e.target.value)})}
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
                  Save Driver
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
            placeholder="Search drivers by name or license..." 
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
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>License No.</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Score</TableHead>
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
            ) : filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => {
                return (
                  <TableRow key={driver.id} className="border-border">
                    <TableCell className="font-medium text-foreground">{driver.firstName}</TableCell>
                    <TableCell className="font-medium text-foreground">{driver.lastName}</TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>{driver.licenseCategory}</TableCell>
                    <TableCell>{driver.safetyScore}</TableCell>
                    <TableCell>
                      <StatusBadge status={driver.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(driver)}
                          className="text-muted-foreground hover:text-emerald-500"
                          title="Edit Driver"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteDriver(driver.id)}
                          disabled={deletingDriverId === driver.id}
                          className="text-muted-foreground hover:text-destructive"
                          title="Delete Driver"
                        >
                          {deletingDriverId === driver.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
          </DialogHeader>
          {editingDriver && (
            <form onSubmit={handleEditDriver}>
              <div className="grid gap-4 py-4">
                {formError && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {formError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-firstName" className="text-sm font-medium">First Name</label>
                    <Input 
                      id="edit-firstName" 
                      required 
                      value={editingDriver.firstName}
                      onChange={e => setEditingDriver({...editingDriver, firstName: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-lastName" className="text-sm font-medium">Last Name</label>
                    <Input 
                      id="edit-lastName" 
                      required 
                      value={editingDriver.lastName}
                      onChange={e => setEditingDriver({...editingDriver, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-licenseNo" className="text-sm font-medium">License No.</label>
                    <Input 
                      id="edit-licenseNo" 
                      required 
                      value={editingDriver.licenseNumber}
                      onChange={e => setEditingDriver({...editingDriver, licenseNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-status" className="text-sm font-medium">Status</label>
                    <Select 
                      value={editingDriver.status} 
                      onValueChange={v => setEditingDriver({...editingDriver, status: v as Driver["status"]})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="ON_TRIP">On Trip</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-licenseCategory" className="text-sm font-medium">License Category</label>
                    <Input 
                      id="edit-licenseCategory" 
                      required 
                      value={editingDriver.licenseCategory}
                      onChange={e => setEditingDriver({...editingDriver, licenseCategory: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-licenseExpiryDate" className="text-sm font-medium">Expiry Date</label>
                    <Input 
                      id="edit-licenseExpiryDate" 
                      type="date"
                      required 
                      value={editingDriver.licenseExpiryDate ? new Date(editingDriver.licenseExpiryDate).toISOString().split('T')[0] : ""}
                      onChange={e => setEditingDriver({...editingDriver, licenseExpiryDate: new Date(e.target.value).toISOString()})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-contactNumber" className="text-sm font-medium">Contact Number</label>
                    <Input 
                      id="edit-contactNumber" 
                      required 
                      value={editingDriver.contactNumber}
                      onChange={e => setEditingDriver({...editingDriver, contactNumber: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="edit-safetyScore" className="text-sm font-medium">Safety Score</label>
                    <Input 
                      id="edit-safetyScore" 
                      type="number"
                      min={0}
                      max={100}
                      required 
                      value={editingDriver.safetyScore}
                      onChange={e => setEditingDriver({...editingDriver, safetyScore: Number(e.target.value)})}
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
