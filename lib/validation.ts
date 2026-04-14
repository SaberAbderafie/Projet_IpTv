import { z } from "zod";

export const planSchema = z.object({
  nomPlan: z.string().min(2).max(50),
  prix: z.number().positive(),
  dureeJours: z.number().int().positive(),
  description: z.string().max(255).optional(),
});

export type PlanInput = z.infer<typeof planSchema>;
