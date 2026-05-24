import { classifierMatiere } from './services/classification.service'
import { genererEmbedding } from './services/embeddings.service'
import { sauvegarderEmbedding, chercherSimilaires } from './services/supabase.service'

async function testSprint1() {
  console.log('🧪 Tests Sprint 1 complets\n')

  // Test 1 — Classification matière
  console.log('📚 Test 1 — Classification matière...')
  const texteChimie = "La liaison covalente est une liaison chimique dans laquelle deux atomes partagent deux électrons. Les molécules organiques contiennent des atomes de carbone liés par des liaisons covalentes."
  const classif = await classifierMatiere(texteChimie)
  console.log(`Matière détectée : ${classif.matiere_detectee} (confiance : ${classif.confiance}%)`)
  if (classif.matiere_detectee === 'chimie' || classif.matiere_detectee === 'biologie') {
    console.log('✅ Classification correcte !\n')
  } else {
    console.log(`⚠️ Matière inattendue : ${classif.matiere_detectee}\n`)
  }

  // Test 2 — Détection incohérence matière
  console.log('🔍 Test 2 — Détection incohérence matière...')
  const texteMaths = "Les matrices carrées admettent un déterminant. Le rang d'une matrice est le nombre de lignes non nulles après réduction de Gauss."
  const classif2 = await classifierMatiere(texteMaths)
  console.log(`PDF de maths déclaré comme "informatique" → détecté : ${classif2.matiere_detectee}`)
  if (classif2.matiere_detectee !== 'informatique') {
    console.log('✅ Incohérence détectée correctement !\n')
  } else {
    console.log('❌ Incohérence non détectée\n')
  }

  // Test 3 — Plagiat
  console.log('📋 Test 3 — Détection plagiat...')
  const texte1 = "Les intégrales définies permettent de calculer l'aire sous une courbe entre deux bornes a et b."
  const texte2 = "Une intégrale définie calcule l'aire comprise sous une courbe entre les bornes a et b."
  const texte3 = "La photosynthèse est le processus par lequel les plantes produisent leur nourriture grâce à la lumière."

  const emb1 = await genererEmbedding(texte1)
  const emb2 = await genererEmbedding(texte2)
  const emb3 = await genererEmbedding(texte3)

  await sauvegarderEmbedding('plagiat-test-001', emb1)
  await sauvegarderEmbedding('plagiat-test-002', emb2)
  await sauvegarderEmbedding('plagiat-test-003', emb3)

  const similaires = await chercherSimilaires(emb1, 'plagiat-test-001')
  console.log('Similaires trouvés :', similaires.map(s => `${s.publication_id} (${(s.score * 100).toFixed(1)}%)`))

  const plagiat = similaires.find(s => s.score > 0.85)
  if (plagiat) {
    console.log('✅ Plagiat potentiel détecté !\n')
  } else {
    console.log('❌ Plagiat non détecté\n')
  }

  console.log('🏁 Tests Sprint 1 terminés !')
}

testSprint1()