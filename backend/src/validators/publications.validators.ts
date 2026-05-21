import { z } from 'zod';

export const createPublicationSchema = z.object({
  titre: z.string().min(3).max(300),
  matiere: z.string().min(2).max(100),
  niveau: z.enum(['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat', 'BTS', 'Autre']),
  type_doc: z.enum(['cours', 'td', 'annales', 'resume', 'autre']),
  description: z.string().max(2000).optional(),
});
export type CreatePublicationInput = z.infer<typeof createPublicationSchema>;

export const updatePublicationSchema = z.object({
  titre: z.string().min(3).max(300).optional(),
  description: z.string().max(2000).optional(),
}).refine((d) => d.titre !== undefined || d.description !== undefined, {
  message: 'Au moins un champ à modifier est requis',
});
export type UpdatePublicationInput = z.infer<typeof updatePublicationSchema>;

export const searchPublicationsSchema = z.object({
  q: z.string().optional(),
  universite_id: z.string().uuid().optional(),
  matiere: z.string().optional(),
  niveau: z.enum(['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat', 'BTS', 'Autre']).optional(),
  type_doc: z.enum(['cours', 'td', 'annales', 'resume', 'autre']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
export type SearchPublicationsInput = z.infer<typeof searchPublicationsSchema>;

export const feedQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const signalerSchema = z.object({
  motif: z.enum(['inapproprie', 'plagiat', 'erreur_grave', 'hors_sujet', 'autre']),
  description: z.string().max(1000).optional(),
});
export type SignalerInput = z.infer<typeof signalerSchema>;

export const askSchema = z.object({
  question: z.string().min(5).max(500),
});
export type AskInput = z.infer<typeof askSchema>;
