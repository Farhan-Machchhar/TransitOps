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

type Driver = {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  status: "AVAILABLE" | "ON_TRIP" | "SUSPENDED" | "EXPIRED_LICENSE";
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
          status: newDriver.status,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
          // Zod error array
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
                        <SelectItem value="EXPIRED_LICENSE">Expired License</SelectItem>
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
            placeholder="Search drivers..." 
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
            <SelectItem value="EXPIRED_LICENSE">Expired License</SelectItem>
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
                    <TableCell>
                      <StatusBadge status={driver.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">Edit</Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
