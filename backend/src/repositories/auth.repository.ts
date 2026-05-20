import { supabaseAdmin } from '../config/supabase';
import { AppError, ConflictError } from '../utils/errors';
import type { Role } from '../types';
import type {
  EtudiantRow,
  ProfesseurRow,
  UniversiteRow,
  MinistereRow,
  RefreshTokenRow,
} from '../types/db';

export interface FoundUser {
  id: string;
  role: Role;
  nom: string;
  password_hash: string;
  statut?: string;
  motif_decision?: string | null;
  universite_id?: string;
}

function throwDbError(error: { code?: string; message: string }, conflictMsg?: string): never {
  if (error.code === '23505' && conflictMsg) {
    throw new ConflictError(conflictMsg);
  }
  throw new AppError(`Erreur base de données : ${error.message}`, 500, 'DB_ERROR', undefined, false);
}

/** Cherche un utilisateur par email dans ministere → universites → professeurs */
export async function findUserByEmail(email: string): Promise<FoundUser | null> {
  const { data: ministere, error: e1 } = await supabaseAdmin
    .from('ministere')
    .select('id, email, password_hash, nom_officiel')
    .eq('email', email)
    .maybeSingle<MinistereRow>();

  if (e1) throwDbError(e1);
  if (ministere) {
    return { id: ministere.id, role: 'ministere', nom: ministere.nom_officiel, password_hash: ministere.password_hash };
  }

  const { data: universite, error: e2 } = await supabaseAdmin
    .from('universites')
    .select('id, email, password_hash, nom_officiel, statut, motif_decision')
    .eq('email', email)
    .maybeSingle<UniversiteRow>();

  if (e2) throwDbError(e2);
  if (universite) {
    return {
      id: universite.id, role: 'universite', nom: universite.nom_officiel,
      password_hash: universite.password_hash, statut: universite.statut,
      motif_decision: universite.motif_decision,
    };
  }

  const { data: professeur, error: e3 } = await supabaseAdmin
    .from('professeurs')
    .select('id, email_pro, password_hash, nom_complet, statut, motif_decision, universite_id')
    .eq('email_pro', email)
    .maybeSingle<ProfesseurRow>();

  if (e3) throwDbError(e3);
  if (professeur) {
    return {
      id: professeur.id, role: 'professeur', nom: professeur.nom_complet,
      password_hash: professeur.password_hash, statut: professeur.statut,
      motif_decision: professeur.motif_decision, universite_id: professeur.universite_id,
    };
  }

  return null;
}

/** Cherche un étudiant par numéro INE */
export async function findUserByIne(ine: string): Promise<FoundUser | null> {
  const { data, error } = await supabaseAdmin
    .from('etudiants')
    .select('id, numero_ine, password_hash, nom_complet, statut, universite_id')
    .eq('numero_ine', ine)
    .maybeSingle<EtudiantRow>();

  if (error) throwDbError(error);
  if (!data) return null;

  return {
    id: data.id, role: 'etudiant', nom: data.nom_complet,
    password_hash: data.password_hash, statut: data.statut, universite_id: data.universite_id,
  };
}

/** Vérifie si un INE est déjà enregistré */
export async function ineExists(ine: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('etudiants')
    .select('id')
    .eq('numero_ine', ine)
    .maybeSingle<{ id: string }>();
  return data !== null;
}

/** Vérifie si un email professeur est déjà enregistré */
export async function professorEmailExists(email: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('professeurs')
    .select('id')
    .eq('email_pro', email)
    .maybeSingle<{ id: string }>();
  return data !== null;
}

/** Récupère une université par ID (pour valider universite_id à l'inscription) */
export async function findUniversiteById(id: string): Promise<Pick<UniversiteRow, 'id' | 'nom_officiel' | 'statut'> | null> {
  const { data, error } = await supabaseAdmin
    .from('universites')
    .select('id, nom_officiel, statut')
    .eq('id', id)
    .maybeSingle<UniversiteRow>();

  if (error) throwDbError(error);
  return data ? { id: data.id, nom_officiel: data.nom_officiel, statut: data.statut } : null;
}

export async function createEtudiant(data: {
  universite_id: string;
  numero_ine: string;
  nom_complet: string;
  password_hash: string;
  photo_url?: string | null;
}): Promise<EtudiantRow> {
  const { data: row, error } = await supabaseAdmin
    .from('etudiants')
    .insert(data)
    .select()
    .single<EtudiantRow>();

  if (error) throwDbError(error, 'Ce numéro INE est déjà utilisé');
  return row!;
}

export async function createProfesseur(data: {
  universite_id: string;
  nom_complet: string;
  email_pro: string;
  password_hash: string;
  matieres: string[];
  photo_url?: string | null;
}): Promise<ProfesseurRow> {
  const { data: row, error } = await supabaseAdmin
    .from('professeurs')
    .insert(data)
    .select()
    .single<ProfesseurRow>();

  if (error) throwDbError(error, 'Cet email professionnel est déjà utilisé');
  return row!;
}

export async function createUniversite(data: {
  nom_officiel: string;
  adresse: string;
  email: string;
  password_hash: string;
  nom_administrateur: string;
  logo_url: string;
  numero_agrement?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}): Promise<UniversiteRow> {
  const { data: row, error } = await supabaseAdmin
    .from('universites')
    .insert(data)
    .select()
    .single<UniversiteRow>();

  if (error) throwDbError(error, 'Cet email est déjà utilisé');
  return row!;
}

export async function saveRefreshToken(data: {
  user_id: string;
  user_role: string;
  token_hash: string;
  expires_at: Date;
}): Promise<void> {
  const { error } = await supabaseAdmin.from('refresh_tokens').insert(data);
  if (error) throwDbError(error);
}

/** Trouve un refresh token non révoqué et non expiré */
export async function findActiveRefreshToken(tokenHash: string): Promise<RefreshTokenRow | null> {
  const { data, error } = await supabaseAdmin
    .from('refresh_tokens')
    .select('*')
    .eq('token_hash', tokenHash)
    .eq('revoked', false)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle<RefreshTokenRow>();

  if (error) throwDbError(error);
  return data;
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('refresh_tokens')
    .update({ revoked: true })
    .eq('token_hash', tokenHash);

  if (error) throwDbError(error);
}

/** Trouve un user actif par id + role (pour refresh token) */
export async function findUserById(
  userId: string,
  role: Role
): Promise<{ nom: string; statut?: string } | null> {
  if (role === 'ministere') {
    const { data } = await supabaseAdmin
      .from('ministere')
      .select('id, nom_officiel')
      .eq('id', userId)
      .maybeSingle<MinistereRow>();
    return data ? { nom: data.nom_officiel } : null;
  }

  if (role === 'universite') {
    const { data } = await supabaseAdmin
      .from('universites')
      .select('id, nom_officiel, statut')
      .eq('id', userId)
      .maybeSingle<UniversiteRow>();
    return data ? { nom: data.nom_officiel, statut: data.statut } : null;
  }

  if (role === 'professeur') {
    const { data } = await supabaseAdmin
      .from('professeurs')
      .select('id, nom_complet, statut')
      .eq('id', userId)
      .maybeSingle<ProfesseurRow>();
    return data ? { nom: data.nom_complet, statut: data.statut } : null;
  }

  const { data } = await supabaseAdmin
    .from('etudiants')
    .select('id, nom_complet, statut')
    .eq('id', userId)
    .maybeSingle<EtudiantRow>();
  return data ? { nom: data.nom_complet, statut: data.statut } : null;
}
