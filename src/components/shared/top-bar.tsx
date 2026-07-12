"use client";

import { usePathname } from "next/navigation";
import { Search, Settings, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const pathname = usePathname();
  
  // Format pathname into a title (e.g., /fuel-expenses -> Fuel Expenses)
  const title = pathname === "/dashboard" 
    ? "Dashboard" 
    : pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full bg-background pl-9 border-border"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-secondary text-secondary-foreground">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
