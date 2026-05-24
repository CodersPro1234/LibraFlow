import { genererEmbedding, similariteCosinus } from './services/embeddings.service'

async function test() {
  console.log('🧪 Test des embeddings...')

  const texte1 = "Les matrices sont des tableaux de nombres utilisés en algèbre linéaire"
  const texte2 = "En mathématiques, une matrice est un tableau rectangulaire de nombres"
  const texte3 = "La cuisine africaine est riche en épices et saveurs"

  console.log('📊 Génération des embeddings...')
  const emb1 = await genererEmbedding(texte1)
  const emb2 = await genererEmbedding(texte2)
  const emb3 = await genererEmbedding(texte3)

  console.log(`✅ Dimensions embedding : ${emb1.length}`)

  const sim12 = similariteCosinus(emb1, emb2)
  const sim13 = similariteCosinus(emb1, emb3)

  console.log(`\n📈 Résultats :`)
  console.log(`Similarité texte1 vs texte2 (similaires) : ${(sim12 * 100).toFixed(1)}%`)
  console.log(`Similarité texte1 vs texte3 (différents) : ${(sim13 * 100).toFixed(1)}%`)

  if (sim12 > sim13) {
    console.log('✅ Test réussi : les textes similaires ont une similarité plus haute !')
  } else {
    console.log('❌ Test échoué')
  }
}

test()