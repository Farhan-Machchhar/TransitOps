"use client";

import { useState } from "react";
import { Plus, Search, Filter, AlertTriangle } from "lucide-react";
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
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string; // ISO date string
  contact: string;
  safetyScore: number;
  status: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED" | "EXPIRED_LICENSE";
};

const INITIAL_DRIVERS: Driver[] = [
  { id: "1", name: "Ramesh Kumar", licenseNumber: "TN-12-3456", licenseCategory: "HMV", licenseExpiry: "2027-05-12", contact: "+91 9876543210", safetyScore: 95, status: "AVAILABLE" },
  { id: "2", name: "Suresh Singh", licenseNumber: "MH-45-7890", licenseCategory: "HMV", licenseExpiry: "2024-11-20", contact: "+91 8765432109", safetyScore: 88, status: "ON_TRIP" },
  { id: "3", name: "Kiran Patel", licenseNumber: "GJ-01-2222", licenseCategory: "LMV", licenseExpiry: "2026-07-25", contact: "+91 7654321098", safetyScore: 92, status: "OFF_DUTY" },
  { id: "4", name: "Amit Sharma", licenseNumber: "DL-05-5555", licenseCategory: "HMV", licenseExpiry: "2026-01-10", contact: "+91 6543210987", safetyScore: 65, status: "SUSPENDED" },
  { id: "5", name: "Vikram Reddy", licenseNumber: "TS-09-9999", licenseCategory: "LMV", licenseExpiry: "2026-08-01", contact: "+91 5432109876", safetyScore: 80, status: "AVAILABLE" },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    status: "AVAILABLE",
  });

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const driver: Driver = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDriver.name!,
      licenseNumber: newDriver.licenseNumber!,
      licenseCategory: newDriver.licenseCategory!,
      licenseExpiry: newDriver.licenseExpiry!,
      contact: newDriver.contact!,
      safetyScore: Number(newDriver.safetyScore) || 100,
      status: newDriver.status as Driver["status"],
    };

    setDrivers([...drivers, driver]);
    setIsAddDialogOpen(false);
    setNewDriver({ status: "AVAILABLE" });
  };

  const getExpiryWarning = (dateStr: string) => {
    const expiry = new Date(dateStr);
    const now = new Date();
    // Use the exact date 2026-07-12 for demo purposes as we know the current time
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { variant: "destructive" as const, text: "Expired" };
    } else if (diffDays <= 30) {
      return { variant: "warning" as const, text: `Expires in ${diffDays} days` };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Drivers</h2>
          <p className="text-muted-foreground">Manage your drivers, licenses, and safety scores.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDriver}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input 
                    id="name" 
                    required 
                    value={newDriver.name || ""}
                    onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                  />
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
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select required onValueChange={v => setNewDriver({...newDriver, licenseCategory: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HMV">HMV</SelectItem>
                        <SelectItem value="LMV">LMV</SelectItem>
                        <SelectItem value="2W">2W</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="expiry" className="text-sm font-medium">License Expiry</label>
                    <Input 
                      id="expiry" 
                      type="date" 
                      required 
                      value={newDriver.licenseExpiry || ""}
                      onChange={e => setNewDriver({...newDriver, licenseExpiry: e.target.value})}
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
                        <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="contact" className="text-sm font-medium">Contact Number</label>
                    <Input 
                      id="contact" 
                      required 
                      value={newDriver.contact || ""}
                      onChange={e => setNewDriver({...newDriver, contact: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="safety" className="text-sm font-medium">Initial Safety Score</label>
                    <Input 
                      id="safety" 
                      type="number" 
                      min={0}
                      max={100}
                      value={newDriver.safetyScore || 100}
                      onChange={e => setNewDriver({...newDriver, safetyScore: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Driver</Button>
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
            <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>License No.</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Safety Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No drivers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDrivers.map((driver) => {
                const warning = getExpiryWarning(driver.licenseExpiry);
                return (
                  <TableRow key={driver.id} className="border-border">
                    <TableCell className="font-medium text-foreground">{driver.name}</TableCell>
                    <TableCell>{driver.licenseNumber}</TableCell>
                    <TableCell>{driver.licenseCategory}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {driver.licenseExpiry}
                        {warning && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            warning.variant === 'destructive' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {warning.text}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{driver.contact}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium ${driver.safetyScore >= 90 ? 'text-emerald-500' : driver.safetyScore >= 75 ? 'text-amber-500' : 'text-red-500'}`}>
                        {driver.safetyScore}
                      </span>
                    </TableCell>
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
