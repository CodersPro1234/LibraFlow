export type StatutUniversite = 'en_attente' | 'approuvee' | 'rejetee' | 'suspendue';
export type StatutProfesseur = 'en_attente' | 'actif' | 'rejete' | 'suspendu';
export type StatutEtudiant = 'actif' | 'suspendu';

export interface MinistereRow {
  id: string;
  email: string;
  password_hash: string;
  nom_officiel: string;
  created_at: string;
}

export interface UniversiteRow {
  id: string;
  nom_officiel: string;
  adresse: string;
  email: string;
  password_hash: string;
  logo_url: string | null;
  nom_administrateur: string;
  numero_agrement: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  statut: StatutUniversite;
  motif_decision: string | null;
  valide_par: string | null;
  created_at: string;
  validated_at: string | null;
}

export interface ProfesseurRow {
  id: string;
  universite_id: string;
  nom_complet: string;
  email_pro: string;
  password_hash: string;
  photo_url: string | null;
  matieres: string[];
  statut: StatutProfesseur;
  motif_decision: string | null;
  valide_par: string | null;
  created_at: string;
  validated_at: string | null;
}

export interface EtudiantRow {
  id: string;
  universite_id: string;
  numero_ine: string;
  nom_complet: string;
  password_hash: string;
  photo_url: string | null;
  statut: StatutEtudiant;
  created_at: string;
}

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  user_role: string;
  token_hash: string;
  expires_at: string;
  revoked: boolean;
  created_at: string;
}
