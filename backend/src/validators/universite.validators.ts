import { z } from 'zod';

export const motifSchema = z.object({
  motif: z.string().min(5, 'Le motif doit faire au moins 5 caractères').max(1000).trim(),
});

export type MotifInput = z.infer<typeof motifSchema>;
