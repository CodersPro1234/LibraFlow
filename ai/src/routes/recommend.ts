import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { obtenirRecommandations } from '../services/recommendation.service'

const router = Router()

const InteractionSchema = z.object({
  publication_id: z.string(),
  type: z.enum(['like', 'download', 'listen']),
  duree_seconds: z.number().optional()
})

const RecommendBodySchema = z.object({
  etudiantId: z.string(),
  historique: z.array(InteractionSchema).optional().default([]),
  preferences: z.object({
    matieres: z.array(z.string()).optional().default([]),
    niveau: z.string(),
    universite_id: z.string().optional()
  }),
  limit: z.number().optional().default(10)
})

router.post('/', async (req: Request, res: Response) => {
  const result = RecommendBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { etudiantId, historique, preferences, limit } = result.data

  try {
    const recommandations = await obtenirRecommandations({
      etudiantId,
      historique,
      preferences,
      limit
    })
    return res.json({ recommandations })
  } catch (error: any) {
    console.error('❌ Erreur recommandation route:', error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

export default router
