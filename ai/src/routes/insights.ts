import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { geminiGenerate } from '../services/gemini.service'

const router = Router()

const TagsBodySchema = z.object({
  titre: z.string().min(3),
  texte: z.string().min(20)
})

const MonthlyInsightsBodySchema = z.object({
  stats: z.record(z.string(), z.any())
})

// Endpoint : Génération automatique de tags
router.post('/tags', async (req: Request, res: Response) => {
  const result = TagsBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { titre, texte } = result.data

  if (process.env.MOCK_MODE === 'true') {
    console.log(`🎭 [MOCK] Génération automatique de tags pour le document: ${titre}`)
    const titleLower = titre.toLowerCase()
    
    let tags = ['académique', 'cours', 'burkina-faso']
    if (titleLower.includes('math') || titleLower.includes('algèbre') || titleLower.includes('analyse')) {
      tags.push('mathématiques', 'algèbre-linéaire', 'matrices', 'exercices')
    } else if (titleLower.includes('chimie') || titleLower.includes('atome') || titleLower.includes('liaison')) {
      tags.push('chimie', 'chimie-organique', 'atomes', 'liaisons-covalentes')
    } else if (titleLower.includes('informatique') || titleLower.includes('code') || titleLower.includes('programmation')) {
      tags.push('informatique', 'programmation', 'typescript', 'algorithmes')
    } else {
      tags.push('sciences', 'cours-général')
    }

    return res.json({ tags })
  }

  try {
    const prompt = `Génère entre 5 et 8 tags ou mots-clés normalisés pour un cours universitaire en français à partir de son titre et d'un extrait de son texte.
Titre : ${titre}
Texte : ${texte.slice(0, 3000)}

Réponds uniquement au format JSON :
{
  "tags": ["tag1", "tag2", "tag3", ...]
}`

    const reponse = await geminiGenerate({ prompt, jsonMode: true })
    const parsed = JSON.parse(reponse)
    return res.json(parsed)

  } catch (error: any) {
    console.error("❌ Erreur génération tags:", error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

// Endpoint : Génération du rapport analytique mensuel du Ministère
router.post('/monthly', async (req: Request, res: Response) => {
  const result = MonthlyInsightsBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { stats } = result.data

  if (process.env.MOCK_MODE === 'true') {
    console.log("🎭 [MOCK] Génération du rapport mensuel IA pour le Ministère")
    const publications = stats.total_publications || 120
    const telechargements = stats.total_downloads || 4500
    
    return res.json({
      insights: `Rapport Analytique LibraFlow — Mai 2026.
Ce mois-ci, la plateforme universitaire a enregistré un dynamisme exceptionnel avec ${publications} nouvelles publications académiques certifiées. Le volume de téléchargements a atteint ${telechargements}, soit une croissance robuste témoignant de l'adoption croissante de la plateforme par les étudiants burkinabè. Les cours de mathématiques et d'informatique restent largement en tête des consultations. L'Université de Ouagadougou se distingue comme le premier contributeur national.`,
      suggestions: [
        "Augmenter l'offre de cours en sciences de l'ingénieur qui sont fortement recherchés.",
        "Mettre en place un programme d'incitation pour les enseignants-chercheurs de province.",
        "Renforcer les serveurs d'hébergement durant la période de révision précédant les examens de juin."
      ]
    })
  }

  try {
    const prompt = `Rédige un rapport analytique synthétique et constructif en français pour le Ministère de l'Enseignement Supérieur du Burkina Faso à partir des statistiques d'utilisation mensuelles de la plateforme LibraFlow suivantes.
Statistiques :
${JSON.stringify(stats, null, 2)}

Réponds uniquement au format JSON :
{
  "insights": "Rapport analytique complet rédigé sous forme éditoriale.",
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}`

    const reponse = await geminiGenerate({ prompt, jsonMode: true })
    const parsed = JSON.parse(reponse)
    return res.json(parsed)

  } catch (error: any) {
    console.error("❌ Erreur génération rapport mensuel:", error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

export default router
