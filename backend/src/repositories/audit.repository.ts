import { supabaseAdmin } from '../config/supabase';
import type { Role } from '../types';

type AuditAction =
  | 'approuver_universite' | 'rejeter_universite' | 'suspendre_universite'
  | 'valider_professeur' | 'rejeter_professeur' | 'suspendre_professeur'
  | 'supprimer_publication' | 'innocenter_signalement' | 'suspendre_etudiant';

export interface AuditLogData {
  action: AuditAction;
  acteur_id: string;
  acteur_role: Role;
  cible_id: string;
  cible_type: string;
  motif?: string | null;
  metadata?: Record<string, unknown>;
}

/** Enregistre une action administrative dans les logs d'audit. */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  // Audit non-bloquant : on ignore l'erreur pour ne pas faire échouer l'action principale
  await supabaseAdmin.from('audit_logs').insert(data);
}
