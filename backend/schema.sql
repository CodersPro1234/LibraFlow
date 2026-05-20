-- ============================================================
-- LIBRAFLOW V2 — Schéma SQL Complet
-- Supabase (PostgreSQL 15) + pgvector + RLS
-- Généré pour l'équipe Coders Pro
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE statut_universite AS ENUM ('en_attente', 'approuvee', 'rejetee', 'suspendue');
CREATE TYPE statut_professeur AS ENUM ('en_attente', 'actif', 'rejete', 'suspendu');
CREATE TYPE statut_etudiant AS ENUM ('actif', 'suspendu');
CREATE TYPE niveau_doc AS ENUM ('L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat', 'BTS', 'Autre');
CREATE TYPE type_doc AS ENUM ('cours', 'td', 'annales', 'resume', 'autre');
CREATE TYPE statut_moderation AS ENUM ('en_analyse', 'validee', 'signalee', 'rejetee');
CREATE TYPE region_burkina AS ENUM (
  'Boucle_du_Mouhoun', 'Cascades', 'Centre', 'Centre_Est', 'Centre_Nord',
  'Centre_Ouest', 'Centre_Sud', 'Est', 'Hauts_Bassins', 'Nord',
  'Plateau_Central', 'Sahel', 'Sud_Ouest'
);
CREATE TYPE type_notif AS ENUM (
  'prof_valide', 'prof_rejete', 'universite_approuvee', 'universite_rejetee',
  'universite_suspendue', 'nouveau_document', 'document_valide', 'document_signale',
  'nouveau_like', 'nouveau_commentaire', 'nouveau_abonne', 'reponse_commentaire',
  'message_universite', 'contenu_signale', 'alerte_activite'
);
CREATE TYPE type_signalement AS ENUM ('ia', 'utilisateur');
CREATE TYPE motif_signalement AS ENUM ('inapproprie', 'plagiat', 'erreur_grave', 'hors_sujet', 'autre');
CREATE TYPE statut_signalement AS ENUM ('en_attente', 'supprime', 'innocente', 'averti');
CREATE TYPE action_audit AS ENUM (
  'approuver_universite', 'rejeter_universite', 'suspendre_universite',
  'valider_professeur', 'rejeter_professeur', 'suspendre_professeur',
  'supprimer_publication', 'innocenter_signalement', 'suspendre_etudiant'
);

-- ============================================================
-- TABLE : ministere
-- ============================================================

CREATE TABLE ministere (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nom_officiel  TEXT NOT NULL DEFAULT 'Ministère de l''Éducation Nationale du Burkina Faso',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : universites
-- ============================================================

CREATE TABLE universites (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom_officiel        TEXT NOT NULL,
  adresse             TEXT NOT NULL,
  email               TEXT UNIQUE NOT NULL,
  password_hash       TEXT NOT NULL,
  logo_url            TEXT,
  nom_administrateur  TEXT NOT NULL,
  numero_agrement     TEXT,
  region              region_burkina,
  latitude            FLOAT,
  longitude           FLOAT,
  statut              statut_universite NOT NULL DEFAULT 'en_attente',
  motif_decision      TEXT,
  valide_par          UUID REFERENCES ministere(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validated_at        TIMESTAMPTZ
);

-- ============================================================
-- TABLE : professeurs
-- ============================================================

CREATE TABLE professeurs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universite_id   UUID NOT NULL REFERENCES universites(id) ON DELETE RESTRICT,
  nom_complet     TEXT NOT NULL,
  email_pro       TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  photo_url       TEXT,
  matieres        TEXT[] NOT NULL DEFAULT '{}',
  statut          statut_professeur NOT NULL DEFAULT 'en_attente',
  motif_decision  TEXT,
  valide_par      UUID,  -- universite admin user
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validated_at    TIMESTAMPTZ
);

-- ============================================================
-- TABLE : etudiants
-- ============================================================

CREATE TABLE etudiants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universite_id   UUID NOT NULL REFERENCES universites(id) ON DELETE RESTRICT,
  numero_ine      TEXT UNIQUE NOT NULL,
  nom_complet     TEXT NOT NULL,
  password_hash   TEXT NOT NULL,
  photo_url       TEXT,
  statut          statut_etudiant NOT NULL DEFAULT 'actif',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : refresh_tokens
-- ============================================================

CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL,
  user_role   TEXT NOT NULL,  -- ministere | universite | professeur | etudiant
  token_hash  TEXT UNIQUE NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : publications
-- ============================================================

CREATE TABLE publications (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professeur_id           UUID NOT NULL REFERENCES professeurs(id) ON DELETE CASCADE,
  universite_id           UUID NOT NULL REFERENCES universites(id) ON DELETE CASCADE,
  titre                   TEXT NOT NULL,
  matiere                 TEXT NOT NULL,
  niveau                  niveau_doc NOT NULL,
  type_doc                type_doc NOT NULL,
  description             TEXT,
  pdf_url                 TEXT NOT NULL,
  pdf_size_bytes          BIGINT,
  pdf_pages_count         INT,
  texte_extrait           TEXT,          -- pour full-text search et IA
  resume_ia               TEXT,          -- résumé généré par Gemini
  score_fiabilite         INT CHECK (score_fiabilite BETWEEN 0 AND 100),
  statut_moderation       statut_moderation NOT NULL DEFAULT 'en_analyse',
  rapport_ia              JSONB,         -- détail analyse IA
  embedding               vector(768),   -- pgvector pour plagiat/recommandations
  audio_url               TEXT,          -- TTS généré
  vues_count              INT NOT NULL DEFAULT 0,
  likes_count             INT NOT NULL DEFAULT 0,
  telechargements_count   INT NOT NULL DEFAULT 0,
  commentaires_count      INT NOT NULL DEFAULT 0,
  shares_count            INT NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : likes
-- ============================================================

CREATE TABLE likes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id  UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL,
  user_role       TEXT NOT NULL,  -- etudiant | professeur
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (publication_id, user_id)
);

-- ============================================================
-- TABLE : commentaires
-- ============================================================

CREATE TABLE commentaires (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id  UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL,
  user_role       TEXT NOT NULL,
  contenu         TEXT NOT NULL,
  parent_id       UUID REFERENCES commentaires(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : favoris (saves)
-- ============================================================

CREATE TABLE favoris (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id  UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL,
  user_role       TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (publication_id, user_id)
);

-- ============================================================
-- TABLE : abonnements (follows)
-- ============================================================

CREATE TABLE abonnements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id   UUID NOT NULL,
  follower_role TEXT NOT NULL,
  cible_id      UUID NOT NULL,
  cible_type    TEXT NOT NULL,   -- professeur | universite
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (follower_id, cible_id, cible_type)
);

-- ============================================================
-- TABLE : historique_lecture
-- ============================================================

CREATE TABLE historique_lecture (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id  UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  etudiant_id     UUID NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
  type_action     TEXT NOT NULL,   -- vue | telecharge | ecoute
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : notifications
-- ============================================================

CREATE TABLE notifications (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  destinataire_id     UUID NOT NULL,
  destinataire_role   TEXT NOT NULL,
  type                type_notif NOT NULL,
  titre               TEXT NOT NULL,
  message             TEXT NOT NULL,
  lien                TEXT,
  payload             JSONB,
  lu                  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : signalements
-- ============================================================

CREATE TABLE signalements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id  UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  source          type_signalement NOT NULL,
  motif           motif_signalement,
  description     TEXT,
  statut          statut_signalement NOT NULL DEFAULT 'en_attente',
  signale_par     UUID,
  signale_role    TEXT,
  traite_par      UUID,           -- ministere id
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  traite_at       TIMESTAMPTZ
);

-- ============================================================
-- TABLE : partages (share tokens)
-- ============================================================

CREATE TABLE partages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  publication_id  UUID NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  token           TEXT UNIQUE NOT NULL,
  created_by      UUID NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE : audit_logs
-- ============================================================

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action      action_audit NOT NULL,
  acteur_id   UUID NOT NULL,
  acteur_role TEXT NOT NULL,
  cible_id    UUID NOT NULL,
  cible_type  TEXT NOT NULL,
  motif       TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Publications : index critiques
CREATE INDEX idx_publications_created_at ON publications (created_at DESC);
CREATE INDEX idx_publications_universite ON publications (universite_id, created_at DESC);
CREATE INDEX idx_publications_professeur ON publications (professeur_id, created_at DESC);
CREATE INDEX idx_publications_statut ON publications (statut_moderation);
CREATE INDEX idx_publications_matiere ON publications (matiere);
CREATE INDEX idx_publications_niveau ON publications (niveau);
-- Full-text search
CREATE INDEX idx_publications_fts ON publications USING GIN (
  to_tsvector('french', coalesce(titre, '') || ' ' || coalesce(description, '') || ' ' || coalesce(matiere, ''))
);
-- pgvector pour similitudes
CREATE INDEX idx_publications_embedding ON publications USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Notifications
CREATE INDEX idx_notifications_destinataire ON notifications (destinataire_id, lu, created_at DESC);

-- Likes
CREATE INDEX idx_likes_publication ON likes (publication_id);
CREATE INDEX idx_likes_user ON likes (user_id);

-- Commentaires
CREATE INDEX idx_commentaires_publication ON commentaires (publication_id, created_at DESC);

-- Abonnements
CREATE INDEX idx_abonnements_follower ON abonnements (follower_id);
CREATE INDEX idx_abonnements_cible ON abonnements (cible_id, cible_type);

-- Refresh tokens
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id, user_role);

-- Historique
CREATE INDEX idx_historique_etudiant ON historique_lecture (etudiant_id, created_at DESC);

-- Universités
CREATE INDEX idx_universites_statut ON universites (statut);
CREATE INDEX idx_universites_region ON universites (region);

-- ============================================================
-- TRIGGERS — Compteurs dénormalisés (pas de COUNT(*) en runtime)
-- ============================================================

-- likes_count
CREATE OR REPLACE FUNCTION update_likes_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE publications SET likes_count = likes_count + 1 WHERE id = NEW.publication_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE publications SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.publication_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_likes_count
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- commentaires_count
CREATE OR REPLACE FUNCTION update_commentaires_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE publications SET commentaires_count = commentaires_count + 1 WHERE id = NEW.publication_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE publications SET commentaires_count = GREATEST(commentaires_count - 1, 0) WHERE id = OLD.publication_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_commentaires_count
  AFTER INSERT OR DELETE ON commentaires
  FOR EACH ROW EXECUTE FUNCTION update_commentaires_count();

-- updated_at automatique
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_publications_updated_at
  BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_commentaires_updated_at
  BEFORE UPDATE ON commentaires
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- tsvector colonne générée pour full-text
ALTER TABLE publications ADD COLUMN IF NOT EXISTS fts_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('french',
      coalesce(titre, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(matiere, '') || ' ' ||
      coalesce(resume_ia, '')
    )
  ) STORED;

-- ============================================================
-- MATERIALIZED VIEWS — Stats lourdes (rafraîchies par pg_cron)
-- ============================================================

CREATE MATERIALIZED VIEW mv_universite_stats AS
SELECT
  u.id AS universite_id,
  u.nom_officiel,
  u.region,
  COUNT(DISTINCT e.id)  AS etudiants_count,
  COUNT(DISTINCT p.id)  AS professeurs_count,
  COUNT(DISTINCT pub.id) AS publications_count,
  COALESCE(SUM(pub.vues_count), 0) AS total_vues,
  COALESCE(SUM(pub.telechargements_count), 0) AS total_telechargements,
  COALESCE(SUM(pub.likes_count), 0) AS total_likes
FROM universites u
LEFT JOIN etudiants e ON e.universite_id = u.id
LEFT JOIN professeurs p ON p.universite_id = u.id AND p.statut = 'actif'
LEFT JOIN publications pub ON pub.universite_id = u.id AND pub.statut_moderation = 'validee'
WHERE u.statut = 'approuvee'
GROUP BY u.id, u.nom_officiel, u.region;

CREATE UNIQUE INDEX ON mv_universite_stats (universite_id);

CREATE MATERIALIZED VIEW mv_ministere_stats AS
SELECT
  COUNT(DISTINCT u.id) FILTER (WHERE u.statut = 'approuvee') AS universites_actives,
  COUNT(DISTINCT u.id) FILTER (WHERE u.statut = 'en_attente') AS universites_en_attente,
  COUNT(DISTINCT p.id) FILTER (WHERE p.statut = 'actif') AS professeurs_actifs,
  COUNT(DISTINCT e.id) FILTER (WHERE e.statut = 'actif') AS etudiants_inscrits,
  COUNT(DISTINCT pub.id) FILTER (WHERE pub.statut_moderation = 'validee') AS documents_publies,
  COALESCE(SUM(pub.vues_count), 0) AS total_vues,
  COALESCE(SUM(pub.telechargements_count), 0) AS total_telechargements
FROM universites u
CROSS JOIN professeurs p
CROSS JOIN etudiants e
CROSS JOIN publications pub;

CREATE MATERIALIZED VIEW mv_evolution_mensuelle AS
SELECT
  DATE_TRUNC('month', created_at) AS mois,
  COUNT(*) AS nouvelles_publications,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) AS cumul
FROM publications
WHERE statut_moderation = 'validee'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mois DESC
LIMIT 12;

-- Rafraîchissement horaire via pg_cron
SELECT cron.schedule('refresh-materialized-views', '0 * * * *', $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_universite_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ministere_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_evolution_mensuelle;
$$);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE etudiants ENABLE ROW LEVEL SECURITY;
ALTER TABLE professeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoris ENABLE ROW LEVEL SECURITY;

-- Publications : lecture publique si validée
CREATE POLICY "publications_select_public"
  ON publications FOR SELECT
  USING (statut_moderation = 'validee');

-- Publications : update/delete par l'auteur seulement (via service_role bypass en backend)
CREATE POLICY "publications_owner_update"
  ON publications FOR UPDATE
  USING (professeur_id = auth.uid());

CREATE POLICY "publications_owner_delete"
  ON publications FOR DELETE
  USING (professeur_id = auth.uid());

-- Notifications : chacun voit les siennes
CREATE POLICY "notifications_own"
  ON notifications FOR SELECT
  USING (destinataire_id = auth.uid());

-- Note : Le backend utilise service_role (bypass RLS) pour les opérations admin.
-- Les policies ci-dessus s'appliquent aux clients directs Supabase (frontend).

-- ============================================================
-- FONCTION : recherche full-text publications
-- ============================================================

CREATE OR REPLACE FUNCTION search_publications(
  query TEXT,
  p_universite_id UUID DEFAULT NULL,
  p_matiere TEXT DEFAULT NULL,
  p_niveau niveau_doc DEFAULT NULL,
  p_type_doc type_doc DEFAULT NULL,
  p_date_from TIMESTAMPTZ DEFAULT NULL,
  p_date_to TIMESTAMPTZ DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID, titre TEXT, matiere TEXT, niveau niveau_doc,
  type_doc type_doc, pdf_url TEXT, score_fiabilite INT,
  vues_count INT, likes_count INT, telechargements_count INT,
  professeur_nom TEXT, universite_nom TEXT, logo_url TEXT,
  rank FLOAT, created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    pub.id, pub.titre, pub.matiere, pub.niveau, pub.type_doc,
    pub.pdf_url, pub.score_fiabilite,
    pub.vues_count, pub.likes_count, pub.telechargements_count,
    prof.nom_complet AS professeur_nom,
    u.nom_officiel AS universite_nom,
    u.logo_url,
    ts_rank(pub.fts_vector, plainto_tsquery('french', query)) AS rank,
    pub.created_at
  FROM publications pub
  JOIN professeurs prof ON prof.id = pub.professeur_id
  JOIN universites u ON u.id = pub.universite_id
  WHERE
    pub.statut_moderation = 'validee'
    AND (query IS NULL OR pub.fts_vector @@ plainto_tsquery('french', query))
    AND (p_universite_id IS NULL OR pub.universite_id = p_universite_id)
    AND (p_matiere IS NULL OR pub.matiere ILIKE '%' || p_matiere || '%')
    AND (p_niveau IS NULL OR pub.niveau = p_niveau)
    AND (p_type_doc IS NULL OR pub.type_doc = p_type_doc)
    AND (p_date_from IS NULL OR pub.created_at >= p_date_from)
    AND (p_date_to IS NULL OR pub.created_at <= p_date_to)
  ORDER BY rank DESC, pub.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
