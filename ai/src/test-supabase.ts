import { genererEmbedding } from './services/embeddings.service'
import { sauvegarderEmbedding, chercherSimilaires } from './services/supabase.service'

async function test() {
  console.log('🧪 Test Supabase pgvector...')

  const texte1 = "Les matrices sont des tableaux de nombres utilisés en algèbre linéaire"
  const texte2 = "En mathématiques, une matrice est un tableau rectangulaire de nombres"

  console.log('📊 Génération des embeddings...')
  const emb1 = await genererEmbedding(texte1)
  const emb2 = await genererEmbedding(texte2)

  console.log('💾 Sauvegarde dans pgvector...')
  await sauvegarderEmbedding('pub-test-001', emb1)
  await sauvegarderEmbedding('pub-test-002', emb2)
  console.log('✅ Embeddings sauvegardés !')

  console.log('🔍 Recherche de similarité...')
  const similaires = await chercherSimilaires(emb1, 'pub-test-001')
  console.log('Résultats :', similaires)

  if (similaires.length > 0 && similaires[0].score > 0.8) {
    console.log('✅ Test réussi : similarité détectée dans pgvector !')
  } else {
    console.log('❌ Test échoué')
  }
}

test()