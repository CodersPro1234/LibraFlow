import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { sauvegarderEmbedding, chercherSimilaires } from '../services/supabase.service'

const router = Router()

const PlagiarismBodySchema = z.object({
  embedding: z.array(z.number()),
  publication_id: z.string(),
  universite_id: z.string().optional()
})

// Enregistrer un embedding dans pgvector
router.post('/register', async (req: Request, res: Response) => {
  const result = PlagiarismBodySchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ erreur: 'Body invalide' })

  const { publication_id, embedding, universite_id } = result.data

  try {
    await sauvegarderEmbedding(publication_id, embedding, universite_id)
    return res.json({ message: 'Embedding enregistré dans pgvector' })
  } catch (error: any) {
    return res.status(500).json({ erreur: error.message })
  }
})

// Vérifier le plagiat via pgvector
router.post('/', async (req: Request, res: Response) => {
  const result = PlagiarismBodySchema.safeParse(req.body)
  if (!result.success) return res.status(400).json({ erreur: 'Body invalide' })

  const { embedding, publication_id, universite_id } = result.data

  try {
    const similaires = await chercherSimilaires(
      embedding, publication_id, universite_id
    )

    const filtrés = similaires.filter(d => d.score > 0.85)
    const plagiat = filtrés.find(d => d.score > 0.98)
    const potentiel = filtrés.find(d => d.score > 0.92)

    return res.json({
      similaires: filtrés,
      verdict: plagiat
        ? 'copie_quasi_exacte'
        : potentiel
        ? 'potentiel_plagiat'
        : 'original'
    })
  } catch (error: any) {
    return res.status(500).json({ erreur: error.message })
  }
})

export default router