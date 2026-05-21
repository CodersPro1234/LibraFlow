import { z } from 'zod';

export const updateProfileSchema = z.object({
  nom_complet: z.string().min(2).max(200).optional(),
  matieres: z.string().optional(), // JSON stringifié côté multipart
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
