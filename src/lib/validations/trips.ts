import { z } from "zod";
import { TripStatus } from "@prisma/client";

export const tripSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  driverId: z.string().min(1, "Driver ID is required"),
  status: z.nativeEnum(TripStatus).optional(),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  cargoWeight: z.number().min(0, "Cargo weight is required"),
  plannedDistance: z.number().min(1, "Planned distance is required"),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

export const updateTripSchema = tripSchema.partial();
