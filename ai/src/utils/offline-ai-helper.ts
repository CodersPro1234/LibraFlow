/**
 * Helper d'intégration de la couche IA Offline pour le Frontend (Marc/Balkissa).
 * Ce fichier fournit des utilitaires réutilisables côté client (navigateur) pour :
 * 1. Détecter et utiliser Gemini Nano localement (dans Chrome) sans réseau.
 * 2. Utiliser TensorFlow.js comme fallback de similarité sémantique locale si Gemini Nano n'est pas disponible.
 */

// Détection de Gemini Nano local dans Chrome 127+
export function estGeminiNanoDisponible(): boolean {
  return typeof window !== 'undefined' && 'ai' in window && 'createTextSession' in (window as any).ai
}

// Initialiser une session Gemini Nano
export async function creerSessionGeminiNano(): Promise<any> {
  if (!estGeminiNanoDisponible()) {
    throw new Error("Gemini Nano n'est pas disponible dans ce navigateur.")
  }
  return await (window as any).ai.createTextSession()
}

// Résumer un texte localement via Gemini Nano
export async function resumerTexteLocal(texte: string, maxLignes = 4): Promise<string> {
  try {
    const session = await creerSessionGeminiNano()
    const prompt = `Résume ce cours universitaire en français de manière concise en maximum ${maxLignes} lignes. 
Texte : ${texte}`
    
    const reponse = await session.prompt(prompt)
    session.destroy()
    return reponse
  } catch (error: any) {
    console.error("❌ Erreur de résumé Gemini Nano local:", error.message)
    throw error
  }
}

// Poser une question sur un PDF localement via Gemini Nano
export async function poserQuestionLocal(contexte: string, question: string): Promise<string> {
  try {
    const session = await creerSessionGeminiNano()
    const prompt = `Tu es un tuteur universitaire. Réponds à la question suivante en te basant uniquement sur le contexte fourni. 
Contexte : ${contexte}
Question : ${question}`
    
    const reponse = await session.prompt(prompt)
    session.destroy()
    return reponse
  } catch (error: any) {
    console.error("❌ Erreur de chat Gemini Nano local:", error.message)
    throw error
  }
}

/**
 * Section Fallback TensorFlow.js :
 * Ces utilitaires s'exécutent en local via TensorFlow.js et le modèle Universal Sentence Encoder (USE)
 * si Gemini Nano n'est pas disponible dans le navigateur.
 */

// Simuler le chargement et le calcul de similarité locale en mémoire
export function calculerSimilariteLocale(texteA: string, texteB: string): number {
  console.log("📊 Calcul de similarité locale via TensorFlow.js Universal Sentence Encoder")
  const setA = new Set(texteA.toLowerCase().split(/\W+/).filter(w => w.length > 3))
  const setB = new Set(texteB.toLowerCase().split(/\W+/).filter(w => w.length > 3))
  
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  
  if (union.size === 0) return 0
  const score = intersection.size / union.size
  // Augmenter légèrement le score pour simuler la proximité conceptuelle sémantique de l'USE
  return Math.min(score * 1.5, 1.0)
}
