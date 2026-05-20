import { z } from 'zod';

const REGION_BURKINA = [
  'Boucle_du_Mouhoun', 'Cascades', 'Centre', 'Centre_Est', 'Centre_Nord',
  'Centre_Ouest', 'Centre_Sud', 'Est', 'Hauts_Bassins', 'Nord',
  'Plateau_Central', 'Sahel', 'Sud_Ouest',
] as const;

export const verifyIneParamsSchema = z.object({
  ine: z.string().min(1).max(50).trim(),
});

export const registerEtudiantSchema = z.object({
  numero_ine: z.string().min(1).max(50).trim().toUpperCase(),
  universite_id: z.string().uuid('universite_id doit être un UUID valide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const registerProfesseurSchema = z.object({
  nom_complet: z.string().min(2, 'Nom trop court').max(200).trim(),
  email_pro: z.string().email('Email invalide').trim().toLowerCase(),
  universite_id: z.string().uuid('universite_id doit être un UUID valide'),
  matieres: z.string().transform((val, ctx): string[] => {
    try {
      const parsed: unknown = JSON.parse(val);
      if (!Array.isArray(parsed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'matieres doit être un tableau JSON' });
        return z.NEVER;
      }
      const arr = parsed as unknown[];
      if (!arr.every((s): s is string => typeof s === 'string')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'matieres doit contenir uniquement des strings' });
        return z.NEVER;
      }
      if (arr.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'matieres ne peut pas être vide' });
        return z.NEVER;
      }
      return arr;
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'matieres doit être du JSON valide' });
      return z.NEVER;
    }
  }),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const registerUniversiteSchema = z.object({
  nom_officiel: z.string().min(3).max(300).trim(),
  adresse: z.string().min(5).max(500).trim(),
  email: z.string().email('Email invalide').trim().toLowerCase(),
  nom_administrateur: z.string().min(2).max(200).trim(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  numero_agrement: z.string().max(100).trim().optional(),
  region: z.enum(REGION_BURKINA).optional(),
  latitude: z.string().optional().transform((v) => {
    if (!v) return undefined;
    const n = parseFloat(v);
    return isNaN(n) ? undefined : n;
  }),
  longitude: z.string().optional().transform((v) => {
    if (!v) return undefined;
    const n = parseFloat(v);
    return isNaN(n) ? undefined : n;
  }),
});

export const loginSchema = z.object({
  identifiant: z.string().min(1).trim(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1),
});

export const logoutSchema = z.object({
  refresh_token: z.string().min(1),
});

export type RegisterEtudiantInput = z.output<typeof registerEtudiantSchema>;
export type RegisterProfesseurInput = z.output<typeof registerProfesseurSchema>;
export type RegisterUniversiteInput = z.output<typeof registerUniversiteSchema>;
export type LoginInput = z.output<typeof loginSchema>;
