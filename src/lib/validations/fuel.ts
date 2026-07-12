import { z } from "zod";

export const fuelSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  liters: z.number().min(0.1, "Liters must be greater than 0"),
  cost: z.number().min(0, "Cost must be a positive number"),
  date: z.coerce.date().optional(),
});
