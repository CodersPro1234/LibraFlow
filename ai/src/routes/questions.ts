import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { geminiGenerate } from '../services/gemini.service'
import { getCache, setCache, cacheKey, CACHE_TTL } from '../utils/cache'

const router = Router()

router.get('/:publicationId', async (req: Request, res: Response) => {
  const publicationId = req.params.publicationId as string

  if (!publicationId) {
    return res.status(400).json({ erreur: 'publicationId requis' })
  }

  const questionsCacheKey = cacheKey('questions', publicationId)

  // 1. Vérifier si le cache Redis contient déjà les questions
  const cached = await getCache<string[]>(questionsCacheKey)
  if (cached) {
    console.log(`💾 [cache] Suggestions de questions récupérées depuis le cache pour: ${publicationId}`)
    return res.json({ questions: cached })
  }

  // 2. Si MOCK_MODE=true ou si cache-miss
  if (process.env.MOCK_MODE === 'true') {
    console.log(`🎭 [MOCK] Génération de questions suggérées pour ${publicationId}`)
    const mockQuestions = [
      "Quelle est la définition d'une matrice carrée d'après le cours ?",
      "Comment calcule-t-on le déterminant d'une matrice 3x3 ?",
      "Donner un exemple concret d'application linéaire abordé dans le document.",
      "Quelle est la différence fondamentale entre une matrice inversible et non inversible ?"
    ]
    await setCache(questionsCacheKey, mockQuestions, CACHE_TTL.LONG)
    return res.json({ questions: mockQuestions })
  }

  try {
    // Si on est en mode réel et cache-miss, générer des questions de réflexion académique de base
    const defaultQuestions = [
      "Quels sont les concepts clés introduits dans ce document ?",
      "Comment appliquer les théorèmes ou formules présentés dans un exercice pratique ?",
      "Quelles sont les limites ou cas particuliers des méthodes décrites ?",
      "Résumer l'idée principale du document en vos propres termes."
    ]

    const prompt = `Génère 4 questions pédagogiques stimulantes de réflexion pour aider un étudiant à approfondir sa compréhension d'un cours universitaire (ID: ${publicationId}). Réponds uniquement sous forme de tableau JSON de chaînes de caractères.
Exemple de format :
{
  "questions": ["Question 1", "Question 2", "Question 3", "Question 4"]
}`

    const reponse = await geminiGenerate({ prompt, jsonMode: true })
    const parsed = JSON.parse(reponse)
    const questions = parsed.questions || defaultQuestions

    await setCache(questionsCacheKey, questions, CACHE_TTL.LONG)
    return res.json({ questions })

  } catch (error: any) {
    console.error('❌ Erreur de génération des suggestions de questions, basculement sur le fallback :', error.message)
    const fallbackQuestions = [
      "Quels sont les concepts clés introduits dans ce cours ?",
      "Comment appliquer les théories présentées dans un exercice pratique ?",
      "Quelles sont les limites ou cas particuliers abordés dans le document ?"
    ]
    return res.json({ questions: fallbackQuestions })
  }
})

// Route d'enregistrement (souvent appelée lors de la modération pour pré-calculer et cacher les questions)
router.post('/register', async (req: Request, res: Response) => {
  const schema = z.object({
    publicationId: z.string(),
    texte: z.string().min(50)
  })

  const validation = schema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: validation.error.issues })
  }

  const { publicationId, texte } = validation.data
  const questionsCacheKey = cacheKey('questions', publicationId)

  try {
    let questions: string[] = []
    
    if (process.env.MOCK_MODE === 'true') {
      questions = [
        "Quelle est l'idée principale de ce texte ?",
        "Quels sont les termes techniques les plus importants décrits ?",
        "Expliquer le lien entre les différents concepts présentés."
      ]
    } else {
      const prompt = `Analyse le cours suivant et génère 3 à 5 questions de révision très pertinentes et stimulantes pour un étudiant.
Texte : ${texte.slice(0, 5000)}

Réponds uniquement au format JSON :
{
  "questions": ["Question 1", "Question 2", ...]
}`
      const reponse = await geminiGenerate({ prompt, jsonMode: true })
      const parsed = JSON.parse(reponse)
      questions = parsed.questions || []
    }

    await setCache(questionsCacheKey, questions, CACHE_TTL.LONG)
    return res.json({ message: 'Questions pré-calculées enregistrées avec succès', questions })
  } catch (error: any) {
    return res.status(500).json({ erreur: error.message })
  }
})

export default router
