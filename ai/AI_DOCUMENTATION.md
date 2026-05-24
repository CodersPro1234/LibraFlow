# 🎓 LibraFlow — Documentation Technique du Module IA

> **Microservice IA pour les universités du Burkina Faso**
> Responsable IA : Sarifatou | Document de production — Mai 2026

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack Technique IA](#2-stack-technique-ia)
3. [Architecture du Microservice](#3-architecture-du-microservice)
4. [Structure du Projet](#4-structure-du-projet)
5. [Endpoints API — Référence Complète](#5-endpoints-api--référence-complète)
6. [Système de Prompts](#6-système-de-prompts)
7. [Mode Mock & Robustesse](#7-mode-mock--robustesse)
8. [Couche IA Offline (WOW Factor)](#8-couche-ia-offline-wow-factor)
9. [Sécurité & Rate Limiting](#9-sécurité--rate-limiting)
10. [Déploiement & Production](#10-déploiement--production)
11. [Scénarios de Démo pour le Jury](#11-scénarios-de-démo-pour-le-jury)
12. [Points de Synchronisation avec l'Équipe](#12-points-de-synchronisation-avec-léquipe)
13. [Plan de Coupe si Retard](#13-plan-de-coupe-si-retard)

---

## 1. Vue d'ensemble

**LibraFlow** est une plateforme académique numérique conçue pour les universités du Burkina Faso. Le **module IA** est un microservice indépendant qui fournit des capacités d'intelligence artificielle avancées :

| Fonctionnalité | Description | Sprint |
|---|---|---|
| 🔍 **Modération IA** | Analyse automatique de la qualité et pertinence des documents PDF uploadés | Sprint 0 |
| 📊 **Score de fiabilité** | Note de confiance de 0 à 100 pour chaque publication | Sprint 0 |
| 📝 **Résumé automatique** | Synthèse en 3-4 lignes + mots-clés extraits | Sprint 1 |
| 🔄 **Détection de plagiat** | Comparaison vectorielle (embeddings pgvector) pour détecter les copies | Sprint 1 |
| 🏷️ **Classification matière** | Détection automatique de la discipline académique du document | Sprint 1 |
| 📚 **Recommandations** | Moteur hybride personnalisé basé sur l'historique et les préférences | Sprint 2 |
| 💬 **Chatbot PDF** | Assistant pédagogique par document avec streaming SSE en temps réel | Sprint 2 |
| ❓ **Suggestions de questions** | Génération automatique de questions de révision avec cache intelligent | Sprint 2 |
| 🎙️ **Text-to-Speech** | Synthèse vocale en français avec Google Cloud TTS et Wavenet | Sprint 3 |
| 🧠 **IA Offline** | Gemini Nano local (Chrome) + TensorFlow.js fallback pour résumé hors-ligne | Sprint 3 |
| 🚨 **Détection d'activité suspecte** | Analyse comportementale IA pour repérer les abus | Sprint 4 |
| 📋 **Analyse de signalements** | Pré-évaluation automatique des signalements de contenu | Sprint 4 |
| 🏷️ **Génération de tags** | Extraction automatique de mots-clés normalisés | Sprint 4 |
| 📈 **Insights mensuels** | Rapport analytique IA pour le Ministère de l'Enseignement Supérieur | Sprint 4 |

---

## 2. Stack Technique IA

```
┌─────────────────────────────────────────────────────┐
│                    STACK IA LIBRAFLOW                │
├─────────────────────────────────────────────────────┤
│  Runtime         │  Node.js + TypeScript             │
│  Framework       │  Express 5.x                      │
│  LLM Principal   │  Google Gemini 2.0 Flash          │
│  Embeddings      │  gemini-embedding-001 (3072 dim)  │
│  Base Vectorielle│  Supabase + pgvector              │
│  TTS             │  Google Cloud Text-to-Speech      │
│  IA Offline      │  Gemini Nano (Chrome) + TF.js     │
│  Validation      │  Zod v4                           │
│  Rate Limiting   │  Bottleneck                       │
│  Extraction PDF  │  pdf-parse                        │
│  Stockage Audio  │  Supabase Storage                 │
└─────────────────────────────────────────────────────┘
```

### Pourquoi ces choix ?

- **Gemini 2.0 Flash** : Modèle le plus rapide de Google, idéal pour la latence faible en production. Quota gratuit de 15 req/min suffisant pour la phase MVP.
- **pgvector** : Extension PostgreSQL native dans Supabase, permet la recherche de similarité vectorielle sans infrastructure supplémentaire.
- **Zod v4** : Validation stricte des payloads entrants ET des réponses IA pour garantir la fiabilité.
- **Gemini Nano** : IA embarquée dans Chrome 127+, permettant le résumé local **sans aucune connexion internet** — le WOW factor du jury.

---

## 3. Architecture du Microservice

```
                                   ┌──────────────────┐
                                   │   Frontend React  │
                                   │   (Marc/Balkissa) │
                                   └────────┬─────────┘
                                            │ HTTP/SSE
                                   ┌────────▼─────────┐
                                   │   Backend NestJS  │
                                   │  (Moussa/Abdoul)  │
                                   └────────┬─────────┘
                                            │ HTTP REST
                               ┌────────────▼────────────┐
                               │   Microservice IA       │
                               │   Express (Port 5000)   │
                               │   (Sarifatou)           │
                               ├─────────────────────────┤
                               │  ┌───────┐ ┌─────────┐ │
                               │  │Routes │ │ Prompts │ │
                               │  └───┬───┘ └────┬────┘ │
                               │      │          │      │
                               │  ┌───▼──────────▼───┐  │
                               │  │    Services       │  │
                               │  │  (gemini, embed,  │  │
                               │  │  tts, recommend)  │  │
                               │  └───┬──────────┬───┘  │
                               │      │          │      │
                               └──────┼──────────┼──────┘
                                      │          │
                          ┌───────────▼┐    ┌───▼──────────┐
                          │  Gemini API │    │  Supabase    │
                          │  (Google)   │    │  (pgvector)  │
                          └────────────┘    └──────────────┘
```

### Principes architecturaux

1. **Microservice indépendant** : Le module IA est totalement découplé du backend principal. Communication exclusivement via API REST.
2. **Mode Mock global** : Variable `MOCK_MODE=true` dans `.env` pour bypasser toutes les API externes. Permet la démo autonome sans quota.
3. **Dégradation gracieuse** : Si Gemini est indisponible (quota 429), les services basculent automatiquement sur des réponses mock intelligentes.
4. **Retry avec backoff exponentiel** : 3 tentatives avec délais 2s → 4s → 8s avant abandon.
5. **Rate limiting** : Bottleneck limite à 15 req/min avec 1 requête concurrente maximum.

---

## 4. Structure du Projet

```
ai/
├── .env                              # Variables d'environnement
├── API_CONTRACT.md                   # Contrat API gelé (Sprint 0)
├── AI_DOCUMENTATION.md               # Ce fichier
├── package.json                      # Dépendances et scripts
├── tsconfig.json                     # Configuration TypeScript
└── src/
    ├── server.ts                     # Point d'entrée Express
    ├── config/
    │   └── index.ts                  # Configuration centralisée
    ├── prompts/
    │   ├── moderation.prompt.ts      # Prompt de modération V1
    │   ├── summary.prompt.ts         # Prompt de résumé
    │   ├── chat.prompt.ts            # Prompt du chatbot PDF
    │   ├── classify-matiere.prompt.ts# Prompt de classification matière
    │   └── plagiarism.prompt.ts      # Prompt de détection plagiat
    ├── routes/
    │   ├── moderate.ts               # POST /ai/moderate
    │   ├── summarize.ts              # POST /ai/summarize
    │   ├── plagiarism.ts             # POST /ai/plagiarism-check
    │   ├── recommend.ts              # POST /ai/recommend
    │   ├── chat.ts                   # POST /ai/chat (JSON + SSE)
    │   ├── questions.ts              # GET/POST /ai/suggest-questions
    │   ├── tts.ts                    # POST /ai/tts
    │   ├── suspicious.ts            # POST /ai/activity/detect|report
    │   └── insights.ts              # POST /ai/insights/tags|monthly
    ├── services/
    │   ├── gemini.service.ts         # Wrapper Gemini robuste
    │   ├── embeddings.service.ts     # Génération d'embeddings
    │   ├── supabase.service.ts       # Accès Supabase (pgvector)
    │   ├── classification.service.ts # Classification matière auto
    │   ├── moderation.service.ts     # Service de modération
    │   ├── recommendation.service.ts # Moteur de recommandations
    │   └── tts.service.ts           # Synthèse vocale
    ├── utils/
    │   ├── offline-ai-helper.ts     # Helper IA Offline (Gemini Nano + TF.js)
    │   ├── pdf-extractor.ts         # Extraction texte PDF
    │   ├── rate-limiter.ts          # Rate limiting Gemini
    │   └── retry.ts                 # Retry avec backoff exponentiel
    └── validators/                   # Schemas Zod (réutilisables)
```

---

## 5. Endpoints API — Référence Complète

### 5.1 `GET /health` — Santé du service

```json
// Réponse
{
  "status": "ok",
  "service": "libraflow-ai-service",
  "mock_mode": true
}
```

---

### 5.2 `POST /ai/moderate` — Modération IA de document

Analyse un PDF uploadé et décide si la publication est validée ou signalée.

```json
// Body
{
  "publicationId": "pub-001",
  "titre": "Cours d'algèbre linéaire",
  "matiere": "Mathématiques",
  "niveau": "L1",
  "type_doc": "cours",
  "pdf_url": "https://storage.supabase.co/.../doc.pdf"
}

// Réponse
{
  "status": "validee",             // ou "signalee"
  "score_fiabilite": 85,           // 0-100
  "resume": "Document de cours...",
  "mots_cles": ["algèbre", "matrices", "vecteurs"],
  "raisons": {
    "pertinence":         { "score": 90, "detail": "..." },
    "coherence_matiere":  { "score": 85, "detail": "..." },
    "adaptation_niveau":  { "score": 80, "detail": "..." },
    "contenu_inapproprie":{ "detected": false, "detail": "..." }
  },
  "classification": {
    "matiere_detectee": "mathematiques",
    "confiance": 95,
    "coherence_matiere": { "coherent": true, "detail": "..." }
  },
  "embedding": [0.12, -0.34, ...],  // vecteur 3072 dimensions
  "duree_analyse_ms": 4200
}
```

**Pipeline de traitement** :
1. Téléchargement du PDF via URL
2. Extraction du texte (pdf-parse, max 30 000 caractères)
3. Appel Gemini avec prompt de modération
4. Validation Zod de la réponse IA
5. Classification matière automatique
6. Génération et sauvegarde de l'embedding pgvector

---

### 5.3 `POST /ai/summarize` — Résumé automatique

```json
// Body
{ "texte": "string (min 100 car.)", "max_lines": 4 }

// Réponse
{ "resume": "Résumé en 4 lignes...", "mots_cles": ["mot1", "mot2", "mot3"] }
```

---

### 5.4 `POST /ai/plagiarism-check` — Détection de plagiat

Utilise la similarité cosinus sur les embeddings pgvector.

```json
// Body
{
  "embedding": [0.1, 0.2, ...],      // vecteur 3072 dim
  "publication_id": "pub-001",
  "universite_id": "univ-ouaga"       // optionnel
}

// Réponse
{
  "similaires": [
    { "publication_id": "pub-042", "score": 0.97 }
  ],
  "verdict": "copie_quasi_exacte"  // ou "potentiel_plagiat" ou "original"
}
```

**Seuils de décision** :
- `score > 0.98` → copie quasi-exacte
- `score > 0.92` → potentiel plagiat
- `score > 0.85` → similaire (affiché)
- `score ≤ 0.85` → original

---

### 5.5 `POST /ai/recommend` — Recommandations personnalisées

Moteur hybride : embeddings pondérés + filtrage par préférences.

```json
// Body
{
  "etudiantId": "etud-007",
  "historique": [
    { "publication_id": "pub-101", "type": "like" },
    { "publication_id": "pub-202", "type": "download" }
  ],
  "preferences": {
    "matieres": ["mathématiques", "informatique"],
    "niveau": "L2",
    "universite_id": "univ-ouaga"
  },
  "limit": 10
}

// Réponse
{
  "recommandations": [
    { "publication_id": "pub-301", "score": 0.95, "raison": "Recommandé car..." }
  ]
}
```

**Algorithme** :
1. Récupérer les embeddings des publications dans l'historique
2. Calculer un profil utilisateur pondéré (like=1, download=2, listen=3)
3. Recherche des k plus proches voisins via pgvector (excluant l'historique)
4. Fallback sur les préférences de matière si pas d'historique

---

### 5.6 `POST /ai/chat` — Chatbot PDF

Supporte deux modes : **JSON** (réponse complète) et **Streaming SSE** (temps réel).

```json
// Body
{
  "publicationId": "pub-101",
  "question": "Qu'est-ce que le déterminant ?",
  "contexte_pdf": "Extrait du PDF...",
  "niveau": "L1",
  "historique_session": [],           // optionnel
  "stream": true                      // false pour JSON
}

// Réponse JSON (stream=false)
{ "reponse": "D'après le document...", "sources_pages": [1, 2] }

// Réponse SSE (stream=true)
data: {"text": "D'après "}
data: {"text": "le document "}
data: {"text": "fourni, "}
...
data: [DONE]
```

**Le streaming SSE** permet au frontend d'afficher la réponse mot par mot, créant une expérience de conversation en temps réel similaire à ChatGPT.

---

### 5.7 `GET /ai/suggest-questions/:publicationId` — Suggestions de questions

```json
// Réponse
{
  "questions": [
    "Quelle est la définition d'une matrice carrée ?",
    "Comment calcule-t-on le déterminant d'une matrice 3x3 ?",
    "Donner un exemple d'application linéaire."
  ]
}
```

Les questions sont mises en **cache en mémoire** pour éviter les appels LLM répétitifs.

---

### 5.8 `POST /ai/suggest-questions/register` — Pré-calcul des questions

Appelé lors de la modération pour pré-calculer et cacher les questions.

```json
// Body
{ "publicationId": "pub-001", "texte": "Contenu du cours..." }

// Réponse
{ "message": "Questions pré-calculées enregistrées", "questions": [...] }
```

---

### 5.9 `POST /ai/tts` — Text-to-Speech

```json
// Body
{
  "texte": "Texte à convertir en audio",
  "voix": "fr-FR-Wavenet-C",        // optionnel
  "vitesse": 1.0                      // 0.5 à 2.0, optionnel
}

// Réponse
{
  "audio_url": "https://supabase.../audio.mp3",
  "duree_seconds": 45
}
```

**Pipeline TTS** :
1. Découpage en phrases si > 4500 caractères (limite API Google TTS)
2. Appels parallèles à Google Cloud TTS (voix Wavenet)
3. Concaténation des buffers MP3
4. Upload vers Supabase Storage
5. Retour de l'URL publique

---

### 5.10 `POST /ai/activity/detect` — Détection d'activité suspecte

```json
// Body
{
  "etudiantId": "etud-666",
  "actions": [
    { "type": "download", "timestamp": "2026-05-23T10:00:00Z", "details": "Doc 1" },
    { "type": "download", "timestamp": "2026-05-23T10:00:05Z", "details": "Doc 2" }
  ]
}

// Réponse
{
  "suspicious": true,
  "raisons": ["Téléchargement anormal de 7 documents en très peu de temps."],
  "severite": "medium"                // "low" | "medium" | "high"
}
```

**Règles en mode mock** :
- Plus de 5 téléchargements → suspect (medium)
- Plus de 3 commentaires volumineux → suspect (high)

---

### 5.11 `POST /ai/activity/report` — Analyse de signalement

```json
// Body
{
  "publicationId": "pub-999",
  "motif": "plagiat",
  "detail": "Ce document est une copie du cours du Pr. Diallo."
}

// Réponse
{
  "fonde": true,
  "priorite": "high",
  "explication": "Le signalement pour motif 'plagiat' semble fondé..."
}
```

---

### 5.12 `POST /ai/insights/tags` — Génération automatique de tags

```json
// Body
{ "titre": "Cours d'algèbre L1", "texte": "Contenu du cours..." }

// Réponse
{ "tags": ["académique", "mathématiques", "algèbre-linéaire", "matrices", "cours"] }
```

---

### 5.13 `POST /ai/insights/monthly` — Rapport mensuel Ministère

```json
// Body
{
  "stats": {
    "total_publications": 247,
    "total_downloads": 8920,
    "total_etudiants_actifs": 1340,
    "top_matiere": "Mathématiques",
    "top_universite": "Université Joseph Ki-Zerbo"
  }
}

// Réponse
{
  "insights": "Rapport Analytique LibraFlow — Mai 2026. Ce mois-ci...",
  "suggestions": [
    "Augmenter l'offre de cours en sciences de l'ingénieur.",
    "Mettre en place un programme d'incitation pour les enseignants."
  ]
}
```

---

## 6. Système de Prompts

Chaque prompt est isolé dans un fichier dédié sous `src/prompts/` pour faciliter l'itération et le fine-tuning.

| Prompt | Fichier | Rôle |
|---|---|---|
| Modération | `moderation.prompt.ts` | Évaluer pertinence, cohérence matière, adaptation niveau, contenu inapproprié |
| Résumé | `summary.prompt.ts` | Synthèse en N lignes + mots-clés |
| Chat PDF | `chat.prompt.ts` | Tuteur pédagogique bienveillant pour les étudiants burkinabè |
| Classification | `classify-matiere.prompt.ts` | Détecter la matière parmi 16 disciplines |
| Plagiat | `plagiarism.prompt.ts` | Comparer deux textes pour plagiat potentiel |

### Principes de conception des prompts

1. **Contexte africain** : Tous les prompts mentionnent explicitement le contexte universitaire burkinabè
2. **Sortie JSON forcée** : `responseMimeType: 'application/json'` + instructions JSON dans le prompt
3. **Validation double** : Le JSON retourné par Gemini est toujours validé par Zod avant envoi au client
4. **Limites de texte** : Les textes sont tronqués (30 000 car. pour modération, 5 000 pour classification)

---

## 7. Mode Mock & Robustesse

### Mode Mock Global

Le mode mock est activé via `MOCK_MODE=true` dans `.env`. Il **intercepte** tous les appels aux services externes :

```typescript
// Dans gemini.service.ts
if (process.env.MOCK_MODE === 'true') {
  // Analyse le prompt pour retourner une réponse mock contextuelle
  if (promptLower.includes('moderate')) return JSON.stringify({ status: 'validee', ... })
  if (promptLower.includes('chat'))     return JSON.stringify({ reponse: '...', ... })
  // ...
}
```

### Avantages du mode mock

- ✅ **Démo autonome** : Aucune dépendance réseau ou quota API
- ✅ **Tests rapides** : Exécution < 100ms par endpoint
- ✅ **Développement parallèle** : Le frontend et le backend peuvent développer sans attendre le module IA
- ✅ **Présentation jury** : Démonstration fluide et prévisible

### Dégradation gracieuse

Même en mode réel, le service ne crash jamais :
- **Quota Gemini (429)** → Retry automatique (3 tentatives, backoff 2s→4s→8s)
- **Google Cloud TTS absent** → Mode dégradé avec URL simulée
- **Supabase timeout** → Recommandations fallback sur les préférences
- **Embeddings introuvables** → Vecteur mock déterministe de 3072 dimensions

---

## 8. Couche IA Offline (WOW Factor)

### Gemini Nano (Chrome 127+)

Le fichier `src/utils/offline-ai-helper.ts` fournit un module réutilisable pour le frontend :

```typescript
// Vérifier si Gemini Nano est disponible
if (estGeminiNanoDisponible()) {
  const resume = await resumerTexteLocal(texte, 4)
  // → Résumé généré 100% en local, sans réseau !
}
```

### TensorFlow.js Fallback

Si Gemini Nano n'est pas disponible (navigateur trop ancien), le module propose un fallback via **Universal Sentence Encoder** :

```typescript
const score = calculerSimilariteLocale(texteA, texteB)
// → Score de similarité calculé localement via Jaccard enrichi
```

### Intégration Frontend

```typescript
// Hook React (exemple pour Marc/Balkissa)
function useOfflineAI() {
  const isNanoAvailable = estGeminiNanoDisponible()
  
  const summarize = async (text: string) => {
    if (isNanoAvailable) return await resumerTexteLocal(text)
    // Fallback vers l'API en ligne
    return await fetch('/ai/summarize', { ... })
  }
  
  return { isNanoAvailable, summarize }
}
```

---

## 9. Sécurité & Rate Limiting

| Mesure | Implémentation |
|---|---|
| Rate Limiting | Bottleneck : 15 req/min, 1 concurrent |
| Validation entrée | Zod v4 sur tous les payloads |
| Validation sortie | Zod v4 sur toutes les réponses IA |
| Taille texte limitée | 30 000 car. (modération), 8 000 car. (embeddings) |
| Retry | 3 tentatives, backoff exponentiel |
| Logs structurés | JSON logs pour monitoring (service, durée, succès) |
| Variables sensibles | `.env` avec `.gitignore` |

---

## 10. Déploiement & Production

### Variables d'environnement requises

```env
# Obligatoires
GEMINI_API_KEY=AIzaSy...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=sb_secret_...
PORT=5000
NODE_ENV=production

# Optionnels
MOCK_MODE=false                          # true pour démo
GOOGLE_APPLICATION_CREDENTIALS=./gcp.json # pour TTS réel
```

### Commandes

```bash
# Développement
npm run dev          # nodemon + ts-node (hot reload)

# Production
npm run build        # Compilation TypeScript → dist/
npm run start        # Node.js dist/server.js

# Tests
npm test             # Validation complète (12 endpoints)
npm run test:sprint1 # Tests Sprint 1 uniquement
npm run test:sprint2 # Tests Sprint 2 uniquement
```

### Déploiement recommandé

1. **Conteneurisation** : Dockerfile multi-stage (build → production)
2. **Hébergement** : Google Cloud Run ou Railway
3. **Base de données** : Supabase Cloud (pgvector activé)
4. **Monitoring** : Logs JSON structurés + Supabase Dashboard

### Estimation des coûts IA

| Service | Quota gratuit | Coût estimé (100 étudiants/jour) |
|---|---|---|
| Gemini 2.0 Flash | 15 req/min | **Gratuit** (quota suffisant) |
| Supabase (pgvector) | 500 Mo | **Gratuit** (tier gratuit) |
| Google Cloud TTS | 4M car./mois | **Gratuit** (tier gratuit suffisant) |
| Supabase Storage | 1 Go | **Gratuit** |

---

## 11. Scénarios de Démo pour le Jury

### Script de validation : `npx ts-node src/test-production.ts`

Ce script exécute **14 tests** couvrant tous les scénarios de production :

| # | Test | Ce qui impressionne |
|---|---|---|
| 1 | Health Check | Service opérationnel |
| 2 | Modération IA | Score de fiabilité + détail des critères |
| 3 | Résumé automatique | Synthèse intelligente + mots-clés |
| 4 | Recommandations | Personnalisation basée sur le profil |
| 5 | Chatbot JSON | Réponse structurée avec sources pages |
| 6 | Chatbot SSE | **Streaming temps réel mot par mot** ⭐ |
| 7 | Suggestions de questions | Questions de révision auto-générées |
| 8 | Cache intelligent | Réponse instantanée depuis le cache |
| 9 | Text-to-Speech | URL audio fonctionnelle |
| 10 | Activité normale | Validation comportement normal |
| 11 | Activité suspecte | **Détection de masse downloads** ⭐ |
| 12 | Signalement fondé | Priorisation automatique du plagiat |
| 13 | Signalement non fondé | Rejet intelligent du signalement abusif |
| 14 | Tags + Rapport Ministère | **Rapport éditorial complet** ⭐ |

### Points WOW pour le jury

1. **Streaming SSE** : Le chatbot affiche les mots un par un, comme ChatGPT
2. **IA Offline avec Gemini Nano** : Résumé local sans aucune connexion internet
3. **Rapport Ministère** : Synthèse analytique complète générée automatiquement
4. **Détection d'anomalies** : L'IA repère les comportements abusifs en temps réel
5. **Mode Mock** : Démo parfaite en 100% offline, aucun risque de plantage

---

## 12. Points de Synchronisation avec l'Équipe

### Avec le Backend (Moussa, Abdoul)

| Sprint | Point de synchro |
|---|---|
| Fin S0 | Contrat API IA gelé, mock en place |
| S1 | Intégration modération réelle via BullMQ |
| S2 | Intégration TTS + chat |
| S4 | Intégration détection signalements |
| S5 | Pré-génération recommandations en batch |

### Avec le Frontend (Marc, Balkissa)

| Sprint | Point de synchro |
|---|---|
| Fin S1 | Exemple de réponse `/moderate` pour design écran d'analyse |
| S2 | Documentation streaming SSE pour Marc (chat) |
| S3 | Module `useOfflineAI()` pour Marc |
| S4 | Composant exemple d'intégration tags suggérés |
| S5 | Tests communs des scénarios de démo |

---

## 13. Plan de Coupe si Retard

### Sacrifiables (dans l'ordre)

1. ~~OCR Tesseract~~ → On accepte que les PDFs scannés soient mal analysés
2. ~~TTS multilingue (mooré, dioula)~~ → Français uniquement
3. ~~Insights mensuels par IA~~ → Texte générique
4. ~~Suggestions de questions auto~~ → L'étudiant tape ses questions
5. ~~TensorFlow.js fallback offline~~ → Chrome récent uniquement
6. ~~Recommandations sophistiquées~~ → Simple "tendances" (most liked du mois)

### Jamais sacrifiés ❌

- ✅ **Modération IA des publications** (LE pilier)
- ✅ Score de fiabilité visible
- ✅ Résumé automatique
- ✅ Détection plagiat basique
- ✅ TTS au moins en français
- ✅ Chatbot par document (au moins en version online)
- ✅ **Démo Gemini Nano offline** (LE WOW factor)

---

> 📝 Document généré par l'équipe IA LibraFlow — Mai 2026
> Pour toute question technique, contacter Sarifatou (IA Lead)
