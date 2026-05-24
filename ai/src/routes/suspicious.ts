import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { geminiGenerate } from '../services/gemini.service'

const router = Router()

const SuspiciousBodySchema = z.object({
  etudiantId: z.string(),
  actions: z.array(z.object({
    type: z.string(),
    timestamp: z.string(),
    details: z.string().optional()
  })).min(1)
})

const ReportBodySchema = z.object({
  publicationId: z.string(),
  motif: z.string(),
  detail: z.string().min(5)
})

// Endpoint : Détection d'activités suspectes
router.post('/detect', async (req: Request, res: Response) => {
  const result = SuspiciousBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { etudiantId, actions } = result.data

  if (process.env.MOCK_MODE === 'true') {
    console.log(`🎭 [MOCK] Détection d'activité suspecte pour l'étudiant: ${etudiantId}`)
    
    // Règle déterministe simple pour le mode mock
    const telechargements = actions.filter(a => a.type === 'download' || a.type === 'telechargement').length
    const spam = actions.filter(a => a.type === 'comment' && a.details && a.details.length > 100).length
    
    const isSuspicious = telechargements > 5 || spam > 3
    const raisons: string[] = []
    let severite: 'low' | 'medium' | 'high' = 'low'

    if (telechargements > 5) {
      raisons.push(`Téléchargement anormal de ${telechargements} documents en très peu de temps.`)
      severite = 'medium'
    }
    if (spam > 3) {
      raisons.push("Multiples commentaires volumineux ressemblant à du spam.")
      severite = 'high'
    }

    if (!isSuspicious) {
      return res.json({
        suspicious: false,
        raisons: ["Activité utilisateur normale."],
        severite: 'low'
      })
    }

    return res.json({
      suspicious: true,
      raisons,
      severite
    })
  }

  try {
    const prompt = `Analyse l'historique d'activités de l'étudiant suivant pour détecter tout comportement suspect (ex: téléchargement de masse, spam, abus).
Historique :
${JSON.stringify(actions, null, 2)}

Réponds uniquement au format JSON :
{
  "suspicious": true | false,
  "raisons": ["raison 1", "raison 2", ...],
  "severite": "low" | "medium" | "high"
}`

    const reponse = await geminiGenerate({ prompt, jsonMode: true })
    const parsed = JSON.parse(reponse)
    return res.json(parsed)

  } catch (error: any) {
    console.error("❌ Erreur détection activité suspecte:", error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

// Endpoint : Analyse automatique des signalements
router.post('/report', async (req: Request, res: Response) => {
  const result = ReportBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { publicationId, motif, detail } = result.data

  if (process.env.MOCK_MODE === 'true') {
    console.log(`🎭 [MOCK] Analyse du signalement pour le document: ${publicationId}`)
    const isFonde = motif.toLowerCase().includes('plagiat') || motif.toLowerCase().includes('inapproprie') || detail.toLowerCase().includes('vole')
    
    return res.json({
      fonde: isFonde,
      priorite: isFonde ? 'high' : 'low',
      explication: isFonde 
        ? `Le signalement pour motif "${motif}" semble fondé d'après les détails fournis. Une inspection humaine immédiate est recommandée.`
        : "Le signalement semble manquer d'éléments tangibles ou s'apparente à un signalement abusif."
    })
  }

  try {
    const prompt = `Évalue la véracité et la priorité du signalement d'un document académique.
Motif déclaré : ${motif}
Détail du signalement : ${detail}

Réponds uniquement au format JSON :
{
  "fonde": true | false,
  "priorite": "low" | "medium" | "high",
  "explication": "Brève explication analytique."
}`

    const reponse = await geminiGenerate({ prompt, jsonMode: true })
    const parsed = JSON.parse(reponse)
    return res.json(parsed)

  } catch (error: any) {
    console.error("❌ Erreur analyse signalement:", error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

export default router
