export const ROLE_ACCESS = {
  "Fleet Manager": [
    "/dashboard",
    "/fleet",
    "/drivers",
    "/trips",
    "/maintenance",
    "/fuel",
    "/analytics",
    "/settings",
  ],

  Dispatcher: [
    "/dashboard",
    "/drivers",
    "/trips",
  ],

  "Safety Officer": [
    "/dashboard",
    "/drivers",
    "/maintenance",
  ],

  "Financial Analyst": [
    "/dashboard",
    "/fuel",
    "/analytics",
  ],
} as const;

export type UserRole = keyof typeof ROLE_ACCESS;