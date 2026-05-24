import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';
import type { ProfesseurRow, StatutProfesseur } from '../types/db';

function throwDbError(error: { message: string }): never {
  throw new AppError(`Erreur base de données : ${error.message}`, 500, 'DB_ERROR', undefined, false);
}

/** Récupère un professeur par ID avec universite_id pour vérification d'appartenance */
export async function findProfesseurById(
  id: string
): Promise<Pick<ProfesseurRow, 'id' | 'universite_id' | 'nom_complet' | 'email_pro' | 'statut'> | null> {
  const { data, error } = await supabaseAdmin
    .from('professeurs')
    .select('id, universite_id, nom_complet, email_pro, statut')
    .eq('id', id)
    .maybeSingle<ProfesseurRow>();

  if (error) throwDbError(error);
  return data
    ? { id: data.id, universite_id: data.universite_id, nom_complet: data.nom_complet, email_pro: data.email_pro, statut: data.statut }
    : null;
}

/** Met à jour le statut d'un professeur avec motif et validateur optionnels */
export async function updateProfesseurStatut(
  professeurId: string,
  statut: StatutProfesseur,
  motif: string | null,
  validePar: string | null
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('professeurs')
    .update({
      statut,
      motif_decision: motif,
      valide_par: validePar,
      ...(statut === 'actif' && { validated_at: new Date().toISOString() }),
    })
    .eq('id', professeurId);

  if (error) throwDbError(error);
}
