import type { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import * as pubService from '../services/publications.service';
import { AppError, NotFoundError } from '../utils/errors';

/** GET /api/v1/public/universites */
export async function getUniversitesPubliques(_req: Request, res: Response): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from('universites')
    .select('id, nom_officiel, adresse, logo_url, region, latitude, longitude, created_at')
    .eq('statut', 'approuvee')
    .order('nom_officiel');

  if (error) throw new AppError(error.message, 500, 'DB_ERROR', undefined, false);
  res.json({ data });
}

/** GET /api/v1/public/universites/:id */
export async function getUniversitePublique(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };

  const { data: univ, error } = await supabaseAdmin
    .from('universites')
    .select('id, nom_officiel, adresse, logo_url, region, latitude, longitude, numero_agrement, created_at')
    .eq('id', id)
    .eq('statut', 'approuvee')
    .maybeSingle();

  if (error) throw new AppError(error.message, 500, 'DB_ERROR', undefined, false);
  if (!univ) throw new NotFoundError('Université');

  // Stats depuis la materialized view
  const { data: stats } = await supabaseAdmin
    .from('mv_universite_stats')
    .select('etudiants_count, professeurs_count, publications_count, total_vues, total_likes')
    .eq('universite_id', id)
    .maybeSingle();

  res.json({ ...univ, stats: stats ?? {} });
}

/** GET /api/v1/public/professeurs/:id */
export async function getProfesseurPublic(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };

  const { data: prof, error } = await supabaseAdmin
    .from('professeurs')
    .select('id, nom_complet, photo_url, matieres, created_at, universite:universites(id, nom_officiel, logo_url)')
    .eq('id', id)
    .eq('statut', 'actif')
    .maybeSingle();

  if (error) throw new AppError(error.message, 500, 'DB_ERROR', undefined, false);
  if (!prof) throw new NotFoundError('Professeur');

  const { data: pubs } = await supabaseAdmin
    .from('publications')
    .select('id, titre, matiere, niveau, type_doc, likes_count, telechargements_count, vues_count, created_at')
    .eq('professeur_id', id)
    .eq('statut_moderation', 'validee')
    .order('created_at', { ascending: false })
    .limit(20);

  res.json({ ...prof, publications: pubs ?? [] });
}

/** GET /api/v1/share/:token */
export async function getSharedPublication(req: Request, res: Response): Promise<void> {
  const { token } = req.params as { token: string };
  const pub = await pubService.getSharedPublication(token);
  res.json(pub);
}
