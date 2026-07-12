import { z } from "zod";
import { VehicleStatus } from "@prisma/client";

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Type is required"),
  year: z.number().int().min(1900, "Invalid year"),
  licensePlate: z.string().min(1, "License plate is required"),
  maxLoadCapacity: z.number().min(1, "Max load capacity is required"),
  odometer: z.number().min(0, "Odometer must be positive"),
  acquisitionCost: z.number().min(0, "Acquisition cost must be positive"),
  status: z.nativeEnum(VehicleStatus).optional(),
});

export const updateVehicleSchema = vehicleSchema.partial();
