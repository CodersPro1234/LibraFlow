import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { geminiGenerate } from '../services/gemini.service'
import { getModerationPrompt } from '../prompts/moderation.prompt'
import { genererEmbedding } from '../services/embeddings.service'
import { sauvegarderEmbedding } from '../services/supabase.service'
import { classifierMatiere, verifierCoherenceMatiere } from '../services/classification.service'
import axios from 'axios'
const pdfParseModule = require('pdf-parse')
const pdfParse = pdfParseModule.default || pdfParseModule

const router = Router()

const ModerationBodySchema = z.object({
  publicationId: z.string(),
  titre: z.string(),
  matiere: z.string(),
  niveau: z.string(),
  type_doc: z.string(),
  pdf_url: z.string().url()
})

const ModerationResponseSchema = z.object({
  status: z.enum(['validee', 'signalee']),
  score_fiabilite: z.number().min(0).max(100),
  resume: z.string(),
  mots_cles: z.array(z.string()),
  raisons: z.object({
    pertinence: z.object({ score: z.number(), detail: z.string() }),
    coherence_matiere: z.object({ score: z.number(), detail: z.string() }),
    adaptation_niveau: z.object({ score: z.number(), detail: z.string() }),
    contenu_inapproprie: z.object({ detected: z.boolean(), detail: z.string() })
  })
})

router.post('/', async (req: Request, res: Response) => {
  const debut = Date.now()

  if (process.env.MOCK_MODE === 'true') {
    return res.json({
      status: 'validee',
      score_fiabilite: 85,
      resume: 'Document de cours sur les mathématiques niveau L1.',
      mots_cles: ['algèbre', 'matrices', 'vecteurs', 'espaces', 'applications'],
      raisons: {
        pertinence: { score: 90, detail: 'Contenu académique de qualité' },
        coherence_matiere: { score: 85, detail: 'Vocabulaire mathématique approprié' },
        adaptation_niveau: { score: 80, detail: 'Adapté au niveau L1' },
        contenu_inapproprie: { detected: false, detail: 'Aucun contenu inapproprié' }
      },
      duree_analyse_ms: 0
    })
  }

  const bodyResult = ModerationBodySchema.safeParse(req.body)
  if (!bodyResult.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: bodyResult.error.issues })
  }

  const { publicationId, titre, matiere, niveau, type_doc, pdf_url } = bodyResult.data

  try {
    // 1. Télécharger le PDF
    console.log(`📥 Téléchargement PDF : ${pdf_url}`)
    const pdfResponse = await axios.get(pdf_url, { responseType: 'arraybuffer' })
    const pdfBuffer = Buffer.from(pdfResponse.data)

    // 2. Extraire le texte
    const pdfData = await pdfParse(pdfBuffer)
    const texte = pdfData.text.slice(0, 30000)
    console.log(`📄 Texte extrait : ${texte.length} caractères`)

    // 3. Générer le prompt de modération
    const prompt = getModerationPrompt({ titre, matiere, niveau, type_doc, texte })

    // 4. Appel Gemini modération
    const reponseIA = await geminiGenerate({ prompt, jsonMode: true })

    // 5. Parser et valider le JSON
    const jsonBrut = JSON.parse(reponseIA)
    const validation = ModerationResponseSchema.safeParse(jsonBrut)

    if (!validation.success) {
      console.error('❌ JSON IA invalide :', validation.error.issues)
      return res.status(500).json({ erreur: 'Réponse IA invalide' })
    }

    // 6. Classification matière automatique
    const classification = await classifierMatiere(texte)
    const coherence = verifierCoherenceMatiere(matiere, classification.matiere_detectee, classification.confiance)

    if (!coherence.coherent) {
      console.warn(`⚠️ Incohérence matière : ${coherence.detail}`)
    }

    // 7. Générer et sauvegarder l'embedding
    const embedding = await genererEmbedding(texte)
    await sauvegarderEmbedding(publicationId, embedding)

    const duree_analyse_ms = Date.now() - debut

    return res.json({
      ...validation.data,
      embedding,
      classification: {
        matiere_detectee: classification.matiere_detectee,
        confiance: classification.confiance,
        coherence_matiere: coherence
      },
      duree_analyse_ms
    })

  } catch (error: any) {
    console.error('❌ Erreur modération :', error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

export default router