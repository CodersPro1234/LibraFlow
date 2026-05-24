import { z } from 'zod';

export const postCommentaireSchema = z.object({
  contenu: z.string().min(1).max(1000),
  parent_id: z.string().uuid().optional(),
});
export type PostCommentaireInput = z.infer<typeof postCommentaireSchema>;

export const cursorQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
