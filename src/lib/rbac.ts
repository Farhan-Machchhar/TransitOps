// Maps Prisma enum role values to accessible routes
export const ROLE_ACCESS: Record<string, string[]> = {
  // Prisma enum: ADMIN
  ADMIN: [
    "/dashboard",
    "/vehicles",
    "/fleet",
    "/drivers",
    "/trips",
    "/maintenance",
    "/fuel-expenses",
    "/fuel",
    "/reports",
    "/analytics",
    "/settings",
  ],
  // Prisma enum: DISPATCHER
  DISPATCHER: [
    "/dashboard",
    "/vehicles",
    "/drivers",
    "/trips",
  ],
  // Prisma enum: MAINTENANCE
  MAINTENANCE: [
    "/dashboard",
    "/vehicles",
    "/drivers",
    "/maintenance",
  ],
  // Prisma enum: FINANCE
  FINANCE: [
    "/dashboard",
    "/fuel-expenses",
    "/fuel",
    "/reports",
    "/analytics",
  ],
  // Legacy display-name roles (kept for backward compat)
  "Fleet Manager": [
    "/dashboard",
    "/vehicles",
    "/fleet",
    "/drivers",
    "/trips",
    "/maintenance",
    "/fuel-expenses",
    "/fuel",
    "/reports",
    "/analytics",
    "/settings",
  ],
  Dispatcher: ["/dashboard", "/vehicles", "/drivers", "/trips"],
  "Safety Officer": ["/dashboard", "/vehicles", "/drivers", "/maintenance"],
  "Financial Analyst": ["/dashboard", "/fuel-expenses", "/fuel", "/reports", "/analytics"],
};

export type UserRole = string;