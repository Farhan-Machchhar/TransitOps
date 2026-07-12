"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  Fuel, 
  BarChart3, 
  LogOut 
} from "lucide-react";

export function NavSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["ADMIN", "DISPATCHER", "MAINTENANCE", "FINANCE"],
    },
    {
      label: "Vehicles",
      icon: Truck,
      href: "/vehicles",
      roles: ["ADMIN", "DISPATCHER", "MAINTENANCE"],
    },
    {
      label: "Drivers",
      icon: Users,
      href: "/drivers",
      roles: ["ADMIN", "DISPATCHER"],
    },
    {
      label: "Trips",
      icon: Map,
      href: "/trips",
      roles: ["ADMIN", "DISPATCHER"],
    },
    {
      label: "Maintenance",
      icon: Wrench,
      href: "/maintenance",
      roles: ["ADMIN", "MAINTENANCE"],
    },
    {
      label: "Fuel & Expenses",
      icon: Fuel,
      href: "/fuel-expenses",
      roles: ["ADMIN", "FINANCE"],
    },
    {
      label: "Reports",
      icon: BarChart3,
      href: "/reports",
      roles: ["ADMIN", "FINANCE", "DISPATCHER"],
    },
  ];

  const visibleRoutes = routes.filter((route) => !role || route.roles.includes(role));

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border mt-2 mb-2">
        <Image src="/logo.png" alt="TransitOps Logo" width={120} height={28} className="object-contain" />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {visibleRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === route.href 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <route.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  pathname === route.href ? "text-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
                )}
                aria-hidden="true"
              />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center px-3 py-2 mb-2 text-sm text-sidebar-foreground/70">
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-sidebar-foreground">{session?.user?.email}</p>
            <p className="truncate text-xs">{role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground" />
          Sign out
        </button>
      </div>
    </div>
  );
}
