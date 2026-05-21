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

export type StatutModeration = 'en_analyse' | 'validee' | 'signalee' | 'rejetee';
export type NiveauPublication = 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | 'Doctorat' | 'BTS' | 'Autre';
export type TypeDoc = 'cours' | 'td' | 'annales' | 'resume' | 'autre';
export type MotifSignalement = 'inapproprie' | 'plagiat' | 'erreur_grave' | 'hors_sujet' | 'autre';
export type StatutSignalement = 'en_attente' | 'supprime' | 'innocente' | 'averti';
export type TypeSignalement = 'ia' | 'utilisateur';
export type TypeNotification =
  | 'prof_valide' | 'prof_rejete' | 'universite_approuvee' | 'universite_rejetee'
  | 'universite_suspendue' | 'nouveau_document' | 'document_valide' | 'document_signale'
  | 'nouveau_like' | 'nouveau_commentaire' | 'nouveau_abonne' | 'reponse_commentaire'
  | 'message_universite' | 'contenu_signale' | 'alerte_activite';

export interface PublicationRow {
  id: string;
  professeur_id: string;
  universite_id: string;
  titre: string;
  matiere: string;
  niveau: NiveauPublication;
  type_doc: TypeDoc;
  description: string | null;
  pdf_url: string;
  pdf_size_bytes: number | null;
  pdf_pages_count: number | null;
  texte_extrait: string | null;
  resume_ia: string | null;
  score_fiabilite: number | null;
  statut_moderation: StatutModeration;
  rapport_ia: Record<string, unknown> | null;
  audio_url: string | null;
  vues_count: number;
  likes_count: number;
  telechargements_count: number;
  commentaires_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
}

export interface CommentaireRow {
  id: string;
  publication_id: string;
  user_id: string;
  user_role: string;
  contenu: string;
  parent_id: string | null;
  created_at: string;
}

export interface LikeRow {
  id: string;
  publication_id: string;
  user_id: string;
  user_role: string;
  created_at: string;
}

export interface FavoriRow {
  id: string;
  publication_id: string;
  user_id: string;
  user_role: string;
  created_at: string;
}

export interface AbonnementRow {
  id: string;
  follower_id: string;
  follower_role: string;
  cible_id: string;
  cible_type: 'professeur' | 'universite';
  created_at: string;
}

export interface NotificationRow {
  id: string;
  destinataire_id: string;
  destinataire_role: string;
  type: TypeNotification;
  titre: string;
  message: string;
  lien: string | null;
  lu: boolean;
  created_at: string;
}

export interface SignalementRow {
  id: string;
  publication_id: string;
  source: TypeSignalement;
  motif: MotifSignalement | null;
  description: string | null;
  statut: StatutSignalement;
  signale_par: string | null;
  signale_role: string | null;
  traite_par: string | null;
  created_at: string;
  traite_at: string | null;
}

export interface PartageRow {
  id: string;
  publication_id: string;
  token: string;
  created_by: string;
  expires_at: string;
  created_at: string;
}

export interface HistoriqueLectureRow {
  id: string;
  publication_id: string;
  etudiant_id: string;
  type_action: 'vue' | 'telecharge' | 'ecoute';
  created_at: string;
}

export interface HistoriqueLectureRow {
  id: string;
  publication_id: string;
  etudiant_id: string;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  action: string;
  acteur_id: string;
  acteur_role: string;
  cible_id: string | null;
  cible_type: string | null;
  motif: string | null;
  created_at: string;
}
