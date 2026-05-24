import { chercherSimilaires, obtenirEmbedding } from './supabase.service'
import dotenv from 'dotenv'

dotenv.config()

export interface Interaction {
  publication_id: string
  type: 'like' | 'download' | 'listen'
  duree_seconds?: number
}

export interface Preferences {
  matieres: string[]
  niveau: string
  universite_id?: string
}

export interface Recommandation {
  publication_id: string
  score: number
  raison: string
}

export async function obtenirRecommandations({
  etudiantId,
  historique,
  preferences,
  limit = 10
}: {
  etudiantId: string
  historique: Interaction[]
  preferences: Preferences
  limit?: number
}): Promise<Recommandation[]> {
  console.log(`📡 [recommendation.service] Calcul des recommandations pour l'étudiant: ${etudiantId}`)

  if (process.env.MOCK_MODE === 'true') {
    console.log(`🎭 [MOCK] Génération de recommandations simulées pour l'étudiant: ${etudiantId}`)
    return genererRecommandationsMockees(preferences, limit)
  }

  try {
    // 1. Filtrage par contenu via embeddings de l'historique
    if (historique && historique.length > 0) {
      const embeddingsPonderes: number[][] = []
      const poidsTotaux: number[] = []

      for (const interaction of historique) {
        let poids = 1
        if (interaction.type === 'like') poids = 1
        else if (interaction.type === 'download') poids = 2
        else if (interaction.type === 'listen') poids = 3

        const embedding = await obtenirEmbedding(interaction.publication_id)
        if (embedding && embedding.length > 0) {
          embeddingsPonderes.push(embedding.map(v => v * poids))
          poidsTotaux.push(poids)
        }
      }

      if (embeddingsPonderes.length > 0) {
        // Calculer l'embedding moyen pondéré de l'étudiant (profil utilisateur)
        const dimensions = embeddingsPonderes[0].length
        const totalPoids = poidsTotaux.reduce((sum, p) => sum + p, 0)
        const profilEmbedding: number[] = new Array(dimensions).fill(0)

        for (let i = 0; i < dimensions; i++) {
          let sum = 0
          for (let j = 0; j < embeddingsPonderes.length; j++) {
            sum += embeddingsPonderes[j][i]
          }
          profilEmbedding[i] = sum / totalPoids
        }

        // Recherche des documents similaires via Supabase/pgvector
        // Exclure les publications déjà dans l'historique pour ne pas recommander ce qu'il a déjà vu
        const idsAExclure = historique.map(h => h.publication_id)
        
        // Chercher une limite plus large pour filtrer ensuite
        const publicationsProches = await chercherSimilaires(profilEmbedding, idsAExclure[0] || '', preferences.universite_id, limit * 2)

        const recommandations: Recommandation[] = []
        for (const pub of publicationsProches) {
          if (idsAExclure.includes(pub.publication_id)) continue

          let scoreFinal = pub.score
          let raison = "Recommandé selon vos lectures passées."

          recommandations.push({
            publication_id: pub.publication_id,
            score: parseFloat(scoreFinal.toFixed(3)),
            raison
          })
        }

        // Trier par score et limiter
        recommandations.sort((a, b) => b.score - a.score)
        const res = recommandations.slice(0, limit)

        if (res.length > 0) return res
      }
    }

    // 2. Fallback si l'historique est vide ou si aucun embedding n'est trouvé
    console.log(`⚠️ Aucun historique ou embedding trouvé pour ${etudiantId}, utilisation du fallback préférences.`)
    return genererRecommandationsMockees(preferences, limit)

  } catch (error: any) {
    console.error("❌ Erreur dans obtenirRecommandations, basculement en mode dégradé:", error.message)
    return genererRecommandationsMockees(preferences, limit)
  }
}

function genererRecommandationsMockees(preferences: Preferences, limit: number): Recommandation[] {
  const matieres = preferences.matieres && preferences.matieres.length > 0
    ? preferences.matieres
    : ['Informatique', 'Mathématiques', 'Physique']

  const niveau = preferences.niveau || 'L1'
  const recommendations: Recommandation[] = []

  // Liste de publications simulées
  const docsSimules = [
    { id: 'pub-math-201', matiere: 'mathématiques', titre: 'Cours d\'Algèbre Linéaire Avancé' },
    { id: 'pub-math-202', matiere: 'mathématiques', titre: 'Exercices Corrigés d\'Analyse Réelle' },
    { id: 'pub-info-301', matiere: 'informatique', titre: 'Introduction aux Algorithmes de Tri et Graphes' },
    { id: 'pub-info-302', matiere: 'informatique', titre: 'Programmation Orientée Objet en TypeScript' },
    { id: 'pub-phys-101', matiere: 'physique', titre: 'Mécanique du Point Matériel' },
    { id: 'pub-phys-102', matiere: 'physique', titre: 'Électrostatique et Magnétostatique' },
    { id: 'pub-bio-401', matiere: 'biologie', titre: 'Génétique et Biologie Moléculaire' },
    { id: 'pub-chim-501', matiere: 'chimie', titre: 'Thermodynamique Chimique et Équilibres' }
  ]

  // Filtrer ou ordonner selon les préférences de matières
  const docsFiltres = docsSimules.filter(doc => 
    matieres.some(m => doc.matiere.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(doc.matiere.toLowerCase()))
  )

  const finalDocs = docsFiltres.length > 0 ? docsFiltres : docsSimules

  for (let i = 0; i < Math.min(finalDocs.length, limit); i++) {
    const doc = finalDocs[i]
    const score = 0.98 - i * 0.04 - Math.random() * 0.02
    
    let raison = `Ce document de ${doc.matiere} correspond parfaitement à votre profil.`
    if (matieres.some(m => doc.matiere.toLowerCase().includes(m.toLowerCase()))) {
      raison = `Recommandé car vous étudiez la matière ${doc.matiere} en niveau ${niveau}.`
    }

    recommendations.push({
      publication_id: doc.id,
      score: parseFloat(score.toFixed(3)),
      raison
    })
  }

  return recommendations
}
