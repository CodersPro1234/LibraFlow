import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import { supabaseAdmin } from '../config/supabase';
import { AuthError, NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';
import type { Role } from '../types';

// ── Profil ────────────────────────────────────────────────────────────────────

export async function getProfile(userId: string, role: Role): Promise<Record<string, unknown>> {
  let data: Record<string, unknown> | null = null;
  let error: { message: string } | null = null;

  if (role === 'etudiant') {
    const result = await supabaseAdmin
      .from('etudiants')
      .select('id, universite_id, numero_ine, nom_complet, photo_url, statut, created_at, universite:universites(id, nom_officiel, logo_url)')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  } else if (role === 'professeur') {
    const result = await supabaseAdmin
      .from('professeurs')
      .select('id, universite_id, nom_complet, email_pro, photo_url, matieres, statut, created_at, validated_at, universite:universites(id, nom_officiel, logo_url)')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  } else if (role === 'universite') {
    const result = await supabaseAdmin
      .from('universites')
      .select('id, nom_officiel, adresse, email, logo_url, nom_administrateur, numero_agrement, region, latitude, longitude, statut, created_at, validated_at')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  } else if (role === 'ministere') {
    const result = await supabaseAdmin
      .from('ministere')
      .select('id, email, nom_officiel, created_at')
      .eq('id', userId)
      .maybeSingle();
    data = result.data as Record<string, unknown> | null;
    error = result.error;
  }

  if (error) throw new ValidationError(`Erreur base de données : ${error.message}`);
  if (!data) throw new NotFoundError('Profil');

  return data;
}

export interface UpdateProfileInput {
  nom_complet?: string;
  matieres?: string[];
  photoBuffer?: Buffer;
  photoMimetype?: string;
  photoOriginalname?: string;
}

export async function updateProfile(userId: string, role: Role, input: UpdateProfileInput): Promise<void> {
  if (role !== 'professeur' && role !== 'etudiant') {
    throw new ValidationError('Modification de profil non supportée pour ce rôle');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {};

  if (input.nom_complet) patch['nom_complet'] = input.nom_complet;

  if (role === 'professeur' && input.matieres) {
    patch['matieres'] = input.matieres;
  }

  if (input.photoBuffer) {
    const compressed = await sharp(input.photoBuffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const ext = 'jpg';
    const storagePath = `photos/${role}s/${userId}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('avatars')
      .upload(storagePath, compressed, { contentType: 'image/jpeg', upsert: true });

    if (uploadError) throw new ValidationError(`Erreur upload photo : ${uploadError.message}`);

    const { data: urlData } = supabaseAdmin.storage.from('avatars').getPublicUrl(storagePath);
    patch['photo_url'] = urlData.publicUrl;
  }

  if (Object.keys(patch).length === 0) return;

  const table = role === 'professeur' ? 'professeurs' : 'etudiants';
  const { error } = await supabaseAdmin.from(table).update(patch).eq('id', userId);
  if (error) throw new ValidationError(`Erreur mise à jour profil : ${error.message}`);

  logger.info({ userId, role }, 'Profil mis à jour');
}

// ── Mot de passe ──────────────────────────────────────────────────────────────

export async function changePassword(
  userId: string,
  role: Role,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const table = role === 'ministere' ? 'ministere'
    : role === 'universite' ? 'universites'
    : role === 'professeur' ? 'professeurs'
    : 'etudiants';

  const { data, error } = await supabaseAdmin
    .from(table)
    .select('id, password_hash')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) throw new NotFoundError('Utilisateur');

  const isValid = await bcrypt.compare(currentPassword, (data as { password_hash: string }).password_hash);
  if (!isValid) throw new AuthError('Mot de passe actuel incorrect');

  const newHash = await bcrypt.hash(newPassword, 12);
  const { error: updateError } = await supabaseAdmin
    .from(table)
    .update({ password_hash: newHash })
    .eq('id', userId);

  if (updateError) throw new ValidationError(`Erreur mise à jour mot de passe : ${updateError.message}`);

  logger.info({ userId, role }, 'Mot de passe changé');
}
