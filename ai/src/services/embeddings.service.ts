import { GoogleGenerativeAI } from '@google/generative-ai'
import crypto from 'crypto'
import dotenv from 'dotenv'
import { getCache, setCache, cacheKey, CACHE_TTL } from '../utils/cache'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Générer un hash du texte pour le cache
function hashTexte(texte: string): string {
  return crypto.createHash('md5').update(texte).digest('hex')
}

// Générer l'embedding d'un texte
export async function genererEmbedding(texte: string): Promise<number[]> {
  const embeddingCacheKey = cacheKey('embedding', hashTexte(texte))
  
  // Vérifier le cache Redis
  const cached = await getCache<number[]>(embeddingCacheKey)
  if (cached) {
    console.log(`📦 Embedding récupéré depuis le cache (hash: ${hashTexte(texte).slice(0, 8)}...)`)
    return cached
  }
  
  if (process.env.MOCK_MODE === 'true') {
    console.log(`🎭 [MOCK] genererEmbedding appelé pour du texte de longueur ${texte.length}`)
    // Générer un vecteur déterministe de 3072 dimensions basé sur le contenu du texte
    const hash = crypto.createHash('md5').update(texte).digest('hex')
    const seed = parseInt(hash.slice(0, 8), 16)
    const mockVector: number[] = []
    for (let i = 0; i < 3072; i++) {
      // Générer des valeurs pseudo-aléatoires déterministes entre -1 et 1
      const val = Math.sin(seed + i)
      mockVector.push(val)
    }
    // Mettre en cache
    await setCache(embeddingCacheKey, mockVector, CACHE_TTL.LONG)
    return mockVector
  }
  
  // Limiter le texte à 8000 caractères
  const texteCoupe = texte.slice(0, 8000)

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-embedding-001'
    })

    const result = await model.embedContent(texteCoupe)
    const embedding = result.embedding.values

    console.log(JSON.stringify({
      service: 'embeddings',
      taille_texte: texteCoupe.length,
      dimensions: embedding.length,
      succes: true
    }))
    
    // Mettre en cache pour 7 jours
    await setCache(embeddingCacheKey, embedding, CACHE_TTL.LONG)

    return embedding

  } catch (error: any) {
    console.error(JSON.stringify({
      service: 'embeddings',
      succes: false,
      erreur: error.message
    }))
    throw new Error(`Erreur embedding : ${error.message}`)
  }
}

// Calculer la similarité cosinus entre deux embeddings
export function similariteCosinus(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}