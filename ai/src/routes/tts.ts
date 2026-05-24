import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { synthetiserTexte } from '../services/tts.service'

const router = Router()

const TTSBodySchema = z.object({
  texte: z.string().min(5),
  voix: z.enum(['fr-FR-Standard-A', 'fr-FR-Wavenet-C']).optional().default('fr-FR-Wavenet-C'),
  vitesse: z.number().min(0.5).max(2.0).optional().default(1.0)
})

router.post('/', async (req: Request, res: Response) => {
  const result = TTSBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { texte, voix, vitesse } = result.data

  try {
    const data = await synthetiserTexte({ texte, voix, vitesse })
    return res.json(data)
  } catch (error: any) {
    console.error('❌ Erreur route TTS:', error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

export default router
