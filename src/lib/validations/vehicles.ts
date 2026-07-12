import { z } from "zod";
import { VehicleStatus } from "@prisma/client";

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Invalid year"),
  licensePlate: z.string().min(1, "License plate is required"),
  status: z.nativeEnum(VehicleStatus).optional(),
});

export const updateVehicleSchema = vehicleSchema.partial();
