"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Vehicle = { id: string; licensePlate: string };
type FuelLog = {
  id: string;
  vehicleId: string;
  gallons: number;
  cost: number;
  date: string;
  vehicle?: Vehicle;
};

export default function FuelExpensesPage() {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Form State
  const [newLog, setNewLog] = useState<Partial<FuelLog>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [logsRes, vehiclesRes] = await Promise.all([
        fetch("/api/fuel-logs"),
        fetch("/api/vehicles")
      ]);
      const logsJson = await logsRes.json();
      const vehiclesJson = await vehiclesRes.json();
      if (logsJson.data) setLogs(logsJson.data);
      if (vehiclesJson.data) setVehicles(vehiclesJson.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(l => {
    return l.vehicle?.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/fuel-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: newLog.vehicleId,
          gallons: Number(newLog.gallons),
          cost: Number(newLog.cost),
          date: newLog.date ? new Date(newLog.date).toISOString() : undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error && Array.isArray(json.error)) {
          setFormError(json.error.map((err: any) => err.message).join(", "));
        } else {
          setFormError(json.error || "Failed to log fuel");
        }
        setIsSubmitting(false);
        return;
      }

      const createdLog = json.data;
      createdLog.vehicle = vehicles.find(v => v.id === createdLog.vehicleId);
      setLogs([createdLog, ...logs]);
      setIsAddDialogOpen(false);
      setNewLog({});
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Fuel & Expenses</h2>
          <p className="text-muted-foreground">Monitor fuel consumption and operational costs.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-primary-foreground hover:bg-primary/90" />}>
            <Plus className="mr-2 h-4 w-4" /> Log Fuel
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Fuel Purchase</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLog}>
              <div className="grid gap-4 py-4">
                {formError && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {formError}
                  </div>
                )}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Vehicle</label>
                  <Select required onValueChange={v => setNewLog({...newLog, vehicleId: v})}>
                    <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.licensePlate}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Gallons</label>
                    <Input 
                      type="number" 
                      required 
                      min={0.1}
                      step="0.1"
                      value={newLog.gallons || ""}
                      onChange={e => setNewLog({...newLog, gallons: Number(e.target.value)})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Cost ($)</label>
                    <Input 
                      type="number" 
                      required 
                      min={0}
                      step="0.01"
                      value={newLog.cost || ""}
                      onChange={e => setNewLog({...newLog, cost: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    type="date" 
                    value={newLog.date || ""}
                    onChange={e => setNewLog({...newLog, date: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Fuel Log
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
            placeholder="Search by vehicle..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="text-right">Gallons</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No fuel logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-border">
                  <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium text-foreground">{log.vehicle?.licensePlate || log.vehicleId}</TableCell>
                  <TableCell className="text-right">{log.gallons.toFixed(1)} gal</TableCell>
                  <TableCell className="text-right">${log.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
