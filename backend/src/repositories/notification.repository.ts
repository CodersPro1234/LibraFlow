import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';
import type { Role } from '../types';

type NotifType =
  | 'prof_valide' | 'prof_rejete'
  | 'universite_approuvee' | 'universite_rejetee' | 'universite_suspendue'
  | 'nouveau_document' | 'document_valide' | 'document_signale'
  | 'nouveau_like' | 'nouveau_commentaire' | 'nouveau_abonne'
  | 'reponse_commentaire' | 'message_universite' | 'contenu_signale' | 'alerte_activite';

export interface CreateNotificationData {
  destinataire_id: string;
  destinataire_role: Role;
  type: NotifType;
  titre: string;
  message: string;
  lien?: string;
  payload?: Record<string, unknown>;
}

/** Insère une notification. Erreur non-bloquante : loggée mais ne fait pas échouer l'action parente. */
export async function createNotification(data: CreateNotificationData): Promise<void> {
  const { error } = await supabaseAdmin.from('notifications').insert(data);
  if (error) {
    throw new AppError(`Erreur création notification : ${error.message}`, 500, 'DB_ERROR', undefined, false);
  }
}
