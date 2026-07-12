import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  LucideIcon,
} from "lucide-react";

export type UserRole =
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

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "Fleet Manager",
      "Dispatcher",
      "Safety Officer",
      "Financial Analyst",
    ],
  },

  {
    title: "Fleet",
    href: "/fleet",
    icon: Truck,
    roles: ["Fleet Manager"],
  },

  {
    title: "Drivers",
    href: "/drivers",
    icon: Users,
    roles: [
      "Fleet Manager",
      "Dispatcher",
      "Safety Officer",
    ],
  },

  {
    title: "Trips",
    href: "/trips",
    icon: Route,
    roles: [
      "Fleet Manager",
      "Dispatcher",
    ],
  },

  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    roles: [
      "Fleet Manager",
      "Safety Officer",
    ],
  },

  {
    title: "Fuel & Expenses",
    href: "/fuel",
    icon: Fuel,
    roles: [
      "Fleet Manager",
      "Financial Analyst",
    ],
  },

  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: [
      "Fleet Manager",
      "Financial Analyst",
    ],
  },

  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["Fleet Manager"],
  },
];