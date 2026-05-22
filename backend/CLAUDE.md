# LibraFlow V2 — Backend

## Qui tu es et ce que tu fais

Tu es le binôme technique backend de l'équipe **Coders Pro** sur le projet **LibraFlow V2**.
Tu travailles **exclusivement sur le backend**. Ne touche jamais au frontend, ni aux fichiers React/Vite/Tailwind.

L'équipe backend est composée de :
- **Moussa KIENDREBEOGO** — Backend Lead (architecture, BDD, sécurité, infra, IA pipeline)
- **Abdoul Ben Fatao SANON** — Backend (endpoints métier, notifications, dashboards, tests)

---

## Contexte du projet

LibraFlow V2 est un **réseau académique national burkinabè** qui connecte toutes les institutions éducatives sur une seule plateforme intelligente, avec ou sans Internet.

### Les 4 acteurs (hiérarchie stricte)

```
Ministère de l'Éducation  ← compte créé par seed script, PAS d'inscription publique
        ↓ approuve
Université                 ← s'inscrit, attend approbation ministère
        ↓ valide
Professeur                 ← s'inscrit, attend validation université. Publie les cours.
        ↓ consomme
Étudiant                   ← s'inscrit avec numéro INE via API Campus Faso. Ne publie PAS.
```

---

## Stack backend

| Couche | Techno |
|--------|--------|
| Runtime | Node.js 20 LTS |
| Framework | Express 4 |
| Langage | TypeScript strict |
| BDD | Supabase (PostgreSQL 15) |
| ORM/Client | Supabase JS Client + Knex.js |
| Stockage fichiers | Supabase Storage |
| Auth | JWT (access 15min / refresh 7j) + bcrypt |
| Validation | Zod |
| Vector DB | pgvector (plagiat + recommandations) |
| Cache | Redis via Upstash |
| Queue async | BullMQ (modération IA, TTS) |
| Real-time | Supabase Realtime |
| Upload | Multer + Sharp |
| PDF | pdf-parse + pdf-lib |
| HTTP client | Axios + Opossum (circuit breaker) |
| Logs | Pino + pino-pretty |
| Monitoring | Sentry |
| Rate limiting | express-rate-limit + rate-limit-redis |
| Tests | Vitest + Supertest |
| CI/CD | GitHub Actions |
| Déploiement | Railway ou Render |

---

## Structure du projet

```
libraflow-backend/
├── src/
│   ├── config/
│   │   ├── env.ts              # Variables d'env centralisées (dotenv-safe)
│   │   ├── supabase.ts         # Client Supabase (anon + service_role)
│   │   └── redis.ts            # Client IORedis (Upstash)
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── ministere.routes.ts
│   │   ├── universite.routes.ts
│   │   ├── professeur.routes.ts
│   │   ├── etudiant.routes.ts
│   │   ├── publications.routes.ts
│   │   ├── interactions.routes.ts
│   │   ├── notifications.routes.ts
│   │   ├── sync.routes.ts
│   │   └── public.routes.ts
│   ├── controllers/            # Logique HTTP, request/response UNIQUEMENT
│   ├── services/               # Logique métier pure, testable, sans Express
│   ├── repositories/           # Accès BDD, requêtes SQL/Supabase
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # Vérif JWT + injection user dans req
│   │   ├── roles.middleware.ts # requireRole('ministere'), requireRole('professeur'), etc.
│   │   ├── validate.middleware.ts # Validation Zod
│   │   ├── upload.middleware.ts   # Multer config
│   │   └── errorHandler.middleware.ts
│   ├── validators/             # Schémas Zod par endpoint
│   ├── jobs/
│   │   ├── moderation.worker.ts  # Worker BullMQ modération IA
│   │   └── tts.worker.ts         # Worker BullMQ Text-to-Speech
│   ├── types/
│   │   └── index.ts            # Types partagés (User, Role, etc.)
│   ├── utils/
│   │   └── errors.ts           # AppError, AuthError, NotFoundError, ValidationError
│   └── server.ts
├── scripts/
│   ├── seed-ministere.ts       # Crée le compte Ministère
│   └── seed-demo.ts            # Données de démo (hackathon)
├── tests/
│   ├── auth.test.ts
│   ├── publications.test.ts
│   └── ...
├── CLAUDE.md                   # Ce fichier
├── .env.example
├── .env                        # Ne jamais committer
├── package.json
├── tsconfig.json
├── schema.sql                  # Schéma BDD complet
└── openapi.yaml                # Spec API complète
```

---

## Règles de code — OBLIGATOIRES

### Architecture
- **Toujours** séparer controller / service / repository. Un controller ne fait jamais de requête BDD directe.
- Les services ne connaissent pas `req` ni `res`. Ils reçoivent des données, retournent des données.
- Les repositories encapsulent tout accès Supabase/Knex.

### TypeScript
- `strict: true` dans tsconfig. Pas de `any` sauf exception justifiée en commentaire.
- Types explicites sur toutes les fonctions publiques.
- Utilise Zod pour valider toutes les entrées HTTP.

### Gestion d'erreurs
- Toutes les erreurs passent par `errorHandler.middleware.ts`.
- Utilise les classes custom (`AppError`, `AuthError`, `NotFoundError`).
- Format de réponse erreur uniforme : `{ error: { code, message, details } }`.
- Wrap tous les controllers async dans un try/catch ou utilise un wrapper `asyncHandler`.

### Sécurité
- **Ne jamais** exposer `password_hash` dans une réponse.
- Le backend utilise le client `service_role` Supabase (bypass RLS) pour les opérations admin. Le client `anon` est pour le front uniquement.
- Toujours valider les permissions AVANT d'exécuter une action (ex: vérifier que le prof appartient bien à l'université qui le valide).
- Valider les fichiers uploadés par magic bytes, pas seulement l'extension.

### Base de données
- **Jamais** de `COUNT(*)` sur les tables principales — utiliser les compteurs dénormalisés (`likes_count`, etc.) mis à jour par triggers.
- **Jamais** de `OFFSET` sur les grosses tables — pagination cursor-based partout.
- Les stats lourdes viennent des materialized views (`mv_universite_stats`, `mv_ministere_stats`).

### Tests
- Coverage cible : > 75%
- Chaque endpoint critique a un test d'intégration Supertest.
- Les services métier ont des tests unitaires.

---

## Contrat avec le microservice IA (Sarifatou)

Base URL : `http://localhost:5000` (dev) | `https://ai.libraflow.bf` (prod)  
Le backend communique via HTTP. Timeout max : 30s (chat) / 60s (moderate) / 120s (tts).

```typescript
// POST /ai/moderate
// Body: { publicationId, titre, matiere, niveau, type_doc, pdf_url }
// Response:
{
  status: 'validee' | 'signalee',
  score_fiabilite: number,          // 0-100
  resume: string,
  embedding: number[],              // vecteur pgvector
  raisons: {
    pertinence: { score: number, detail: string },
    coherence_matiere: { score: number, detail: string },
    plagiat: { score: number, similaires: { publication_id: string, score: number }[] },
    contenu_inapproprie: { detected: boolean, detail: string },
  },
  duree_analyse_ms: number,
}

// POST /ai/tts
// Body: { texte: string, voix: 'fr-FR-Wavenet-C', vitesse: 1.0 }
// Response: { audio_url: string, duree_seconds: number }

// POST /ai/recommend
// Body: { etudiantId, historique: [{ publication_id, type, duree_seconds }], preferences: { matieres?, niveau?, universite_id? }, limit }
// Response: { recommandations: [{ publication_id, score, raison }] }

// POST /ai/chat
// Body: { publicationId, question, contexte_pdf: string, historique_session: [{ role, content }] }
// Response: { reponse: string, sources_pages: number[] }

// POST /ai/plagiarism-check
// Body: { embedding: number[], universite_id: string }
// Response: { similaires: [{ publication_id: string, score: number }] }

// POST /ai/summarize
// Body: { texte: string, max_lines: number }
// Response: { resume: string, mots_cles: string[] }
```

---

## Points de synchronisation avec le Frontend (Marc, Balkissa)

- La spec complète est dans `openapi.yaml` à la racine.
- Format pagination : `{ data: [], cursor_next: string|null, has_more: boolean }`
- Toutes les réponses de liste sont paginées (cursor-based).
- Les flags `is_liked`, `is_saved`, `is_followed` sont inclus dans les publications quand un user est connecté.
- Supabase Realtime est activé sur : `notifications`, `publications`, `likes`, `commentaires`.

---

## Variables d'environnement requises

```bash
# Server
PORT=4000
NODE_ENV=development

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

# Redis (Upstash)
REDIS_URL=

# API Campus Faso
CAMPUS_FASO_API_URL=
CAMPUS_FASO_API_KEY=

# Service IA (Sarifatou)
IA_SERVICE_URL=

# Ministère (seed)
MINISTERE_EMAIL=
MINISTERE_PASSWORD=

# Sentry
SENTRY_DSN=

# Frontend (CORS whitelist)
FRONTEND_URL=http://localhost:5173
FRONTEND_STAGING_URL=
FRONTEND_PROD_URL=
```

---

## Priorités d'implémentation (JAMAIS sacrifiées)

1. Auth des 4 acteurs avec validation hiérarchique complète
2. Upload PDF + pipeline modération IA (BullMQ)
3. Feed + recherche full-text
4. Likes / commentaires / follows
5. Sync offline (`/sync/pending-actions`)
6. Dashboards université + ministère
7. Carte interactive (coordonnées GPS universités)

## Sacrifiables si retard

1. Détection activité suspecte (cron)
2. Rapport mensuel PDF auto (Puppeteer)
3. Modération Gemini Nano offline → Gemini API en ligne seulement
4. Chatbot par document → garder juste le résumé IA
5. Détection plagiat par embeddings → vérification basique IA

---

## Commandes utiles

```bash
npm run dev          # Démarre le serveur en watch mode (port 4000)
npm run test         # Lance les tests
npm run test:coverage
npm run lint
npm run seed:ministere  # Crée le compte Ministère (à faire une seule fois)
npm run seed:demo       # Données de démo hackathon
npm run migrate         # Applique les migrations Knex
```

---

## Ce que tu ne fais PAS

- Tu ne modifies pas les fichiers frontend (`.jsx`, `.tsx` côté React, `vite.config`, `tailwind.config`).
- Tu ne touches pas aux dossiers `libraflow-frontend/` s'ils existent dans le workspace.
- Tu ne crées pas de composants UI.
- Tu ne gères pas le Service Worker ni IndexedDB (c'est le front).
- Tu ne génères pas de prompts pour le service IA (c'est Sarifatou).
