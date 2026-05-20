import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';
import type { UniversiteRow, StatutUniversite } from '../types/db';

function throwDbError(error: { message: string }): never {
  throw new AppError(`Erreur base de données : ${error.message}`, 500, 'DB_ERROR', undefined, false);
}

/** Récupère une université par ID pour traitement ministériel */
export async function findUniversiteById(
  id: string
): Promise<Pick<UniversiteRow, 'id' | 'nom_officiel' | 'email' | 'statut' | 'motif_decision'> | null> {
  const { data, error } = await supabaseAdmin
    .from('universites')
    .select('id, nom_officiel, email, statut, motif_decision')
    .eq('id', id)
    .maybeSingle<UniversiteRow>();

  if (error) throwDbError(error);
  return data
    ? { id: data.id, nom_officiel: data.nom_officiel, email: data.email, statut: data.statut, motif_decision: data.motif_decision }
    : null;
}

/** Met à jour le statut d'une université */
export async function updateUniversiteStatut(
  universiteId: string,
  statut: StatutUniversite,
  motif: string | null,
  validePar: string | null
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('universites')
    .update({
      statut,
      motif_decision: motif,
      valide_par: validePar,
      ...(statut === 'approuvee' && { validated_at: new Date().toISOString() }),
    })
    .eq('id', universiteId);

  if (error) throwDbError(error);
}
