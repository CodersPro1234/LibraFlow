import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { geminiGenerate } from '../services/gemini.service'
import { getSummaryPrompt } from '../prompts/summary.prompt'
import { getCache, setCache, cacheKey, CACHE_TTL } from '../utils/cache'
import crypto from 'crypto'

const router = Router()

const SummarizeBodySchema = z.object({
  texte: z.string().min(100),
  max_lines: z.number().optional().default(4)
})

const SummarizeResponseSchema = z.object({
  resume: z.string(),
  mots_cles: z.array(z.string())
})

router.post('/', async (req: Request, res: Response) => {
  const result = SummarizeBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { texte, max_lines } = result.data
  
  // Générer une clé de cache basée sur le hash du texte
  const textHash = crypto.createHash('md5').update(texte.slice(0, 5000)).digest('hex')
  const summaryCacheKey = cacheKey('summary', `${textHash}-${max_lines}`)

  try {
    // Vérifier le cache Redis
    const cached = await getCache<{ resume: string; mots_cles: string[] }>(summaryCacheKey)
    if (cached) {
      console.log(`📦 Résumé récupéré depuis le cache`)
      return res.json(cached)
    }
    
    const prompt = getSummaryPrompt(texte, max_lines)
    const reponseIA = await geminiGenerate({ prompt, jsonMode: true })

    const json = JSON.parse(reponseIA)
    const validation = SummarizeResponseSchema.safeParse(json)

    if (!validation.success) {
      return res.status(500).json({ erreur: 'Réponse IA invalide' })
    }
    
    // Mettre en cache pour 30 jours
    await setCache(summaryCacheKey, validation.data, CACHE_TTL.VERY_LONG)

    return res.json(validation.data)

  } catch (error: any) {
    return res.status(500).json({ erreur: error.message })
  }
})

export default router