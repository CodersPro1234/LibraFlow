# LibraFlow AI Service — Contrat API
Version : 1.0 | Date : 19 mai 2026 | Responsable : Sarifatou

## Base URL
http://localhost:5000 (dev)
https://ai.libraflow.bf (prod)

---

## POST /ai/moderate
**Rôle** : Analyser un PDF et décider si la publication est validée ou signalée

### Body
```json
{
  "publicationId": "string",
  "titre": "string",
  "matiere": "string",
  "niveau": "string",
  "type_doc": "string",
  "pdf_url": "string"
}
```

### Réponse
```json
{
  "status": "validee" | "signalee",
  "score_fiabilite": 85,
  "resume": "string (3-4 lignes)",
  "embedding": [0.1, 0.2, ...],
  "raisons": {
    "pertinence": { "score": 90, "detail": "string" },
    "coherence_matiere": { "score": 85, "detail": "string" },
    "plagiat": { "score": 10, "similaires": [] },
    "contenu_inapproprie": { "detected": false, "detail": "" }
  },
  "duree_analyse_ms": 4200
}
```

---

## POST /ai/summarize
**Rôle** : Générer un résumé court d'un texte

### Body
```json
{
  "texte": "string",
  "max_lines": 4
}
```

### Réponse
```json
{
  "resume": "string",
  "mots_cles": ["mot1", "mot2", "mot3"]
}
```

---

## POST /ai/recommend
**Rôle** : Recommander des publications à un étudiant

### Body
```json
{
  "etudiantId": "string",
  "historique": [
    { "publication_id": "string", "type": "like", "duree_seconds": 120 }
  ],
  "preferences": {
    "matieres": ["mathematiques"],
    "niveau": "L1",
    "universite_id": "string"
  },
  "limit": 10
}
```

### Réponse
```json
{
  "recommandations": [
    { "publication_id": "string", "score": 0.95, "raison": "string" }
  ]
}
```

---

## POST /ai/tts
**Rôle** : Convertir un texte en audio MP3

### Body
```json
{
  "texte": "string",
  "voix": "fr-FR-Wavenet-C",
  "vitesse": 1.0
}
```

### Réponse
```json
{
  "audio_url": "https://supabase.../audio.mp3",
  "duree_seconds": 120
}
```

---

## POST /ai/chat
**Rôle** : Chatbot qui répond aux questions sur un document PDF

### Body
```json
{
  "publicationId": "string",
  "question": "string",
  "contexte_pdf": "string (30 000 premiers caractères du PDF)",
  "historique_session": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ]
}
```

### Réponse
```json
{
  "reponse": "string",
  "sources_pages": [1, 5, 12]
}
```

---

## POST /ai/plagiarism-check
**Rôle** : Détecter si un document est similaire à d'autres dans la base

### Body
```json
{
  "embedding": [0.1, 0.2, ...],
  "universite_id": "string"
}
```

### Réponse
```json
{
  "similaires": [
    { "publication_id": "string", "score": 0.97 }
  ]
}
```

---

## Codes d'erreur
| Code | Signification |
|------|--------------|
| 400  | Body invalide |
| 429  | Quota Gemini dépassé |
| 500  | Erreur interne IA |
| 503  | Service Gemini indisponible |

---

## Règles importantes
- Tous les endpoints retournent du JSON
- Timeout max : 30 secondes
- Rate limit : 15 req/min (quota Gemini)
- Mode MOCK disponible : variable d'environnement `MOCK_MODE=true`