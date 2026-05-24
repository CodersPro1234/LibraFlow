# LibraFlow AI Service - Guide de Déploiement

Ce guide explique comment déployer le microservice IA en production sur Railway ou Render.

## Prérequis

- Compte Railway (https://railway.app) OU compte Render (https://render.com)
- Compte Google AI Studio avec clé API Gemini
- Compte Supabase avec projet configuré
- (Optionnel) Compte Redis (Upstash ou Redis Cloud)
- (Optionnel) Compte Google Cloud pour TTS

## Variables d'Environnement

Copiez le fichier `.env.example` en `.env` et configurez les variables suivantes :

```bash
# Serveur
PORT=5000
NODE_ENV=production
MOCK_MODE=false  # Mettre à 'true' pour les tests sans appels IA réels

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Redis (optionnel mais recommandé pour le cache)
REDIS_URL=redis://your-redis-url

# Google Cloud TTS (optionnel)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Monitoring (optionnel)
SENTRY_DSN=your_sentry_dsn
```

## Déploiement sur Railway

### Méthode 1: Via GitHub (Recommandé)

1. **Pusher le code sur GitHub**
   ```bash
   git add .
   git commit -m "Add AI service deployment config"
   git push origin main
   ```

2. **Créer un nouveau projet sur Railway**
   - Allez sur https://railway.app
   - Cliquez sur "New Project" → "Deploy from GitHub repo"
   - Sélectionnez le repository `LibraFlow/ai`

3. **Configurer les variables d'environnement**
   - Dans le projet Railway, allez dans "Variables"
   - Ajoutez toutes les variables du fichier `.env.example`

4. **Configurer le domaine**
   - Allez dans "Settings" → "Domains"
   - Ajoutez `ai.libraflow.bf` (ou votre domaine personnalisé)

5. **Déployer**
   - Railway déploiera automatiquement à chaque push sur GitHub
   - Surveillez les logs dans l'onglet "Deployments"

### Méthode 2: Via CLI Railway

1. **Installer Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialiser le projet**
   ```bash
   cd ai
   railway init
   railway up
   ```

3. **Configurer les variables**
   ```bash
   railway variables set PORT=5000
   railway variables set NODE_ENV=production
   railway variables set GEMINI_API_KEY=your_key
   # ... ajoutez toutes les autres variables
   ```

4. **Déployer**
   ```bash
   railway deploy
   ```

## Déploiement sur Render

### Méthode 1: Via GitHub (Recommandé)

1. **Pusher le code sur GitHub**
   ```bash
   git add .
   git commit -m "Add AI service deployment config"
   git push origin main
   ```

2. **Créer un nouveau service Web sur Render**
   - Allez sur https://dashboard.render.com
   - Cliquez "New" → "Web Service"
   - Connectez votre repository GitHub
   - Sélectionnez le dossier `ai`
   - Configurez :
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node 20

3. **Configurer les variables d'environnement**
   - Dans la section "Environment", ajoutez toutes les variables du `.env.example`

4. **Configurer le domaine**
   - Dans "Settings" → "Custom Domains"
   - Ajoutez `ai.libraflow.bf`

5. **Déployer**
   - Render déploiera automatiquement à chaque push sur GitHub

## Vérification Post-Déploiement

Une fois déployé, vérifiez que le service fonctionne :

```bash
# Health check
curl https://ai.libraflow.bf/health

# Doit retourner :
# {
#   "status": "ok",
#   "service": "libraflow-ai-service",
#   "mock_mode": false
# }
```

## Tests de Smoke

```bash
# Test de modération
curl -X POST https://ai.libraflow.bf/ai/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "publicationId": "test-001",
    "titre": "Cours de mathématiques",
    "matiere": "Mathématiques",
    "niveau": "L1",
    "type_doc": "cours",
    "pdf_url": "https://example.com/test.pdf"
  }'

# Test de résumé
curl -X POST https://ai.libraflow.bf/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "texte": "L'algèbre linéaire est une branche des mathématiques...",
    "max_lines": 4
  }'
```

## Monitoring

### Logs Railway
- Allez dans l'onglet "Deployments" → Cliquez sur le déploiement actif → "Logs"

### Logs Render
- Allez dans "Logs" de votre service

### Sentry (Optionnel)
Si vous avez configuré `SENTRY_DSN`, les erreurs seront automatiquement envoyées à Sentry pour un monitoring avancé.

## Dépannage

### Le service ne démarre pas
- Vérifiez les logs dans Railway/Render
- Assurez-vous que toutes les variables d'environnement sont configurées
- Vérifiez que le build TypeScript réussit (`npm run build`)

### Erreur de connexion à Supabase
- Vérifiez que `SUPABASE_URL` et `SUPABASE_SERVICE_KEY` sont corrects
- Assurez-vous que le bucket 'audios' existe dans Supabase Storage

### Erreur Gemini API
- Vérifiez que `GEMINI_API_KEY` est valide
- Vérifiez que vous n'avez pas dépassé les quotas (1500 req/jour en free tier)

### Erreur Redis
- Si Redis n'est pas configuré, le service fonctionnera mais sans cache
- Pour désactiver Redis, ne définissez pas `REDIS_URL`

## Coûts Estimés

### Railway
- **Free tier**: $5/mois (500 heures)
- **Pro**: $20/mois (illimité)

### Render
- **Free tier**: Gratuit (avec spin-up après inactivité)
- **Starter**: $7/mois (toujours actif)

### Services externes
- **Gemini 2.0 Flash**: Gratuit jusqu'à 1500 req/jour
- **Supabase**: Free tier généreux
- **Redis (Upstash)**: Free tier 10K commandes/jour
- **Google Cloud TTS**: $4/1M caractères WaveNet

**Total estimé pour la demo**: 100% gratuit avec les free tiers
**Total estimé en production à 1000 publications/mois**: ~$10-30/mois

## Sécurité

- Ne jamais commit le fichier `.env` dans Git
- Utilisez toujours des clés de service (service role keys) pour Supabase
- Configurez HTTPS (automatique sur Railway/Render)
- Limitez l'accès par IP si possible
- Utilisez des secrets manager pour les clés en production

## Support

Pour toute question sur le déploiement, contactez l'équipe IA (Sarifatou).
