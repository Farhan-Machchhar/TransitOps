import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  FileText,
  LucideIcon,
} from "lucide-react";

export type UserRole =
  | "ADMIN"
  | "DISPATCHER"
  | "MAINTENANCE"
  | "FINANCE"
  | "Fleet Manager"
  | "Dispatcher"
  | "Safety Officer"
  | "Financial Analyst";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

const allRoles: UserRole[] = [
  "ADMIN",
  "DISPATCHER",
  "MAINTENANCE",
  "FINANCE",
  "Fleet Manager",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst",
];

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: allRoles,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: Truck,
    roles: ["ADMIN", "DISPATCHER", "MAINTENANCE", "Fleet Manager", "Dispatcher", "Safety Officer"],
  },
  {
    title: "Fleet",
    href: "/fleet",
    icon: Truck,
    roles: ["ADMIN", "Fleet Manager"],
  },
  {
    title: "Drivers",
    href: "/drivers",
    icon: Users,
    roles: ["ADMIN", "DISPATCHER", "MAINTENANCE", "Fleet Manager", "Dispatcher", "Safety Officer"],
  },
  {
    title: "Trips",
    href: "/trips",
    icon: Route,
    roles: ["ADMIN", "DISPATCHER", "Fleet Manager", "Dispatcher"],
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    roles: ["ADMIN", "MAINTENANCE", "Fleet Manager", "Safety Officer"],
  },
  {
    title: "Fuel & Expenses",
    href: "/fuel",
    icon: Fuel,
    roles: ["ADMIN", "FINANCE", "Fleet Manager", "Financial Analyst"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["ADMIN", "FINANCE", "Fleet Manager", "Financial Analyst"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["ADMIN", "FINANCE", "Fleet Manager", "Financial Analyst"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN", "Fleet Manager"],
  },
];
