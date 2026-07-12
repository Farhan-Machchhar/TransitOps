import { z } from "zod";
import { DriverStatus } from "@prisma/client";

export const driverSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  status: z.nativeEnum(DriverStatus).optional(),
});

export const updateDriverSchema = driverSchema.partial();
