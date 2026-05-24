import { GoogleGenerativeAI } from '@google/generative-ai'
import Bottleneck from 'bottleneck'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Rate limiter : max 15 requêtes par minute (quota Gemini free tier)
const limiter = new Bottleneck({
  minTime: 4000,
  maxConcurrent: 1
})

// Fonction principale
export async function geminiGenerate({
  prompt,
  temperature = 0.3,
  jsonMode = false
}: {
  prompt: string
  temperature?: number
  jsonMode?: boolean
}): Promise<string> {
  if (process.env.MOCK_MODE === 'true') {
    console.log(`🎭 [MOCK] geminiGenerate appelé (jsonMode: ${jsonMode})`)
    
    if (jsonMode) {
      const promptLower = prompt.toLowerCase()
      if (promptLower.includes('classif') || promptLower.includes('matiere')) {
        const hasChemistry = promptLower.includes('liaison') || promptLower.includes('chimie') || promptLower.includes('atome') || promptLower.includes('carbone') || promptLower.includes('covalente')
        return JSON.stringify({
          matiere_detectee: hasChemistry ? 'chimie' : 'mathematiques',
          confiance: 95,
          mots_cles_detectes: hasChemistry ? ['atomes', 'liaisons', 'chimie'] : ['matrices', 'algèbre', 'vecteurs'],
          explication: hasChemistry 
            ? 'Le document contient des notions claires de chimie organique.' 
            : 'Le document contient des notions claires sur les espaces vectoriels.'
        })
      }
      if (promptLower.includes('moderate') || promptLower.includes('pertinence')) {
        return JSON.stringify({
          status: 'validee',
          score_fiabilite: 85,
          resume: 'Document de cours sur les mathématiques niveau L1.',
          mots_cles: ['algèbre', 'matrices', 'vecteurs', 'espaces', 'applications'],
          raisons: {
            pertinence: { score: 90, detail: 'Contenu académique de qualité' },
            coherence_matiere: { score: 85, detail: 'Vocabulaire mathématique approprié' },
            adaptation_niveau: { score: 80, detail: 'Adapté au niveau L1' },
            contenu_inapproprie: { detected: false, detail: 'Aucun contenu inapproprié' }
          }
        })
      }
      if (promptLower.includes('summary') || promptLower.includes('resume')) {
        return JSON.stringify({
          resume: 'Ceci est un résumé mocké très structuré et pertinent représentant le contenu du document.',
          mots_cles: ['cours', 'apprentissage', 'exercice']
        })
      }
      if (promptLower.includes('chat') || promptLower.includes('question')) {
        return JSON.stringify({
          reponse: "D'après le document fourni, les concepts d'algèbre linéaire se focalisent sur la manipulation de matrices et la résolution de systèmes d'équations.",
          sources_pages: [1, 2]
        })
      }
      if (promptLower.includes('suggest-questions') || promptLower.includes('questions')) {
        return JSON.stringify({
          questions: [
            "Quelle est la définition d'une matrice carrée d'après le cours ?",
            "Comment calcule-t-on le déterminant d'une matrice 3x3 ?",
            "Donner un exemple concret d'application linéaire abordé dans le document."
          ]
        })
      }
      return JSON.stringify({ reponse: "Réponse générée en mode mock.", sources_pages: [1] })
    }
    return "Ceci est une réponse fictive générée par le service Gemini en mode Mock."
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature,
      ...(jsonMode && { responseMimeType: 'application/json' })
    }
  })

  // Retry 3 fois avec backoff exponentiel
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const debut = Date.now()

      const result = await limiter.schedule(() =>
        model.generateContent(prompt)
      )

      const response = result.response
      const text = response.text()
      const duree = Date.now() - debut

      // Log structuré
      console.log(JSON.stringify({
        service: 'gemini',
        attempt,
        duree_ms: duree,
        succes: true,
        taille_prompt: prompt.length
      }))

      return text

    } catch (error: any) {
      console.log(JSON.stringify({
        service: 'gemini',
        attempt,
        succes: false,
        erreur: error.message
      }))

      if (attempt === 3) {
        throw new Error(`Gemini indisponible après 3 tentatives : ${error.message}`)
      }

      // Attente avant retry : 2s, 4s, 8s
      const attente = Math.pow(2, attempt) * 1000
      console.log(`⏳ Retry dans ${attente / 1000}s...`)
      await new Promise(resolve => setTimeout(resolve, attente))
    }
  }

  throw new Error('Erreur inattendue dans geminiGenerate')
}