import { z } from "zod";

export const fuelSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  gallons: z.number().min(0.1, "Gallons must be greater than 0"),
  cost: z.number().min(0, "Cost must be a positive number"),
  date: z.coerce.date().optional(),
});
