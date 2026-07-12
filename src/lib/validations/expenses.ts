import { z } from "zod";

export const expenseSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be a positive number"),
  date: z.coerce.date().optional(),
});
