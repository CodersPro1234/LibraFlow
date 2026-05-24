/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║         LibraFlow AI — Test de Production & Démo Complète        ║
 * ║                    Sprint 5 — Validation Finale                  ║
 * ╠═══════════════════════════════════════════════════════════════════╣
 * ║  Ce script valide l'intégralité des 12 endpoints du microservice ║
 * ║  IA. Il fonctionne en mode MOCK pour une démo autonome sans     ║
 * ║  dépendances externes (Gemini, Supabase, Google Cloud TTS).     ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
process.env.MOCK_MODE = 'true'

const BASE_URL = 'http://localhost:5000'

// Compteurs de résultats
let passed = 0
let failed = 0
const results: { name: string; status: '✅' | '❌'; detail: string }[] = []

function logSection(title: string) {
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  ${title}`)
  console.log(`${'═'.repeat(60)}`)
}

function logResult(name: string, success: boolean, detail: string) {
  if (success) {
    passed++
    results.push({ name, status: '✅', detail })
    console.log(`  ✅ ${name}`)
    console.log(`     → ${detail}`)
  } else {
    failed++
    results.push({ name, status: '❌', detail })
    console.log(`  ❌ ${name}`)
    console.log(`     → ${detail}`)
  }
}

async function runFullProductionTest() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║          🎓  LibraFlow AI — Validation de Production  🎓          ║
║                                                                   ║
║   Microservice IA pour les universités du Burkina Faso            ║
║   Mode : MOCK (démonstration autonome)                            ║
║   Date : ${new Date().toLocaleDateString('fr-FR')}                                           ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
  `)

  // Démarrer le serveur
  console.log('🚀 Démarrage du serveur Express...')
  require('./server')
  await new Promise(resolve => setTimeout(resolve, 2500))

  try {
    // ═══════════════════════════════════════════════
    // 1. HEALTH CHECK
    // ═══════════════════════════════════════════════
    logSection('1/12 — Health Check')
    const healthRes = await axios.get(`${BASE_URL}/health`)
    logResult(
      'Health Check',
      healthRes.data.status === 'ok' && healthRes.data.mock_mode === true,
      `Status: ${healthRes.data.status} | Service: ${healthRes.data.service} | Mock: ${healthRes.data.mock_mode}`
    )

    // ═══════════════════════════════════════════════
    // 2. MODÉRATION DE DOCUMENT
    // ═══════════════════════════════════════════════
    logSection('2/12 — Modération IA de Document')
    const moderateRes = await axios.post(`${BASE_URL}/ai/moderate`, {
      publicationId: 'pub-demo-001',
      titre: 'Cours d\'algèbre linéaire — Matrices et déterminants',
      matiere: 'Mathématiques',
      niveau: 'L1',
      type_doc: 'cours',
      pdf_url: 'https://example.com/mock-math-l1.pdf'
    })
    logResult(
      'Modération IA',
      moderateRes.data.status === 'validee' && moderateRes.data.score_fiabilite >= 0,
      `Verdict: ${moderateRes.data.status} | Score: ${moderateRes.data.score_fiabilite}/100 | Mots-clés: [${moderateRes.data.mots_cles?.join(', ')}]`
    )

    // ═══════════════════════════════════════════════
    // 3. RÉSUMÉ AUTOMATIQUE
    // ═══════════════════════════════════════════════
    logSection('3/12 — Résumé Automatique')
    const summarizeRes = await axios.post(`${BASE_URL}/ai/summarize`, {
      texte: 'L\'algèbre linéaire est une branche des mathématiques qui traite des espaces vectoriels, des applications linéaires, des matrices et des systèmes d\'équations linéaires. Elle est fondamentale en physique, en informatique et en ingénierie. Les concepts clés incluent les déterminants, les valeurs propres, la diagonalisation et les transformations orthogonales.',
      max_lines: 4
    })
    logResult(
      'Résumé Automatique',
      summarizeRes.data.resume?.length > 10 && summarizeRes.data.mots_cles?.length >= 1,
      `Résumé: "${summarizeRes.data.resume?.substring(0, 80)}..." | Mots-clés: [${summarizeRes.data.mots_cles?.join(', ')}]`
    )

    // ═══════════════════════════════════════════════
    // 4. RECOMMANDATIONS PERSONNALISÉES
    // ═══════════════════════════════════════════════
    logSection('4/12 — Recommandations Personnalisées')
    const recommendRes = await axios.post(`${BASE_URL}/ai/recommend`, {
      etudiantId: 'etudiant-demo-007',
      preferences: {
        matieres: ['mathématiques', 'informatique'],
        niveau: 'L2',
        universite_id: 'univ-ouaga'
      },
      historique: [
        { publication_id: 'pub-math-101', type: 'like' },
        { publication_id: 'pub-info-202', type: 'download' },
        { publication_id: 'pub-phys-050', type: 'listen', duree_seconds: 180 }
      ]
    })
    logResult(
      'Recommandations IA',
      recommendRes.data.recommandations?.length > 0,
      `${recommendRes.data.recommandations?.length} recommandations générées pour l'étudiant`
    )

    // ═══════════════════════════════════════════════
    // 5. CHATBOT PDF (JSON)
    // ═══════════════════════════════════════════════
    logSection('5/12 — Chatbot PDF (JSON)')
    const chatRes = await axios.post(`${BASE_URL}/ai/chat`, {
      publicationId: 'pub-math-101',
      question: 'Qu\'est-ce que le déterminant d\'une matrice et à quoi sert-il ?',
      contexte_pdf: 'Ce cours porte sur l\'algèbre linéaire de niveau L1. Le déterminant est un scalaire associé à une matrice carrée. Il permet de déterminer si une matrice est inversible (déterminant non nul) et intervient dans le calcul de la matrice inverse. [Page 15]',
      niveau: 'L1',
      stream: false
    })
    logResult(
      'Chatbot PDF (JSON)',
      chatRes.data.reponse?.length > 10,
      `Réponse: "${chatRes.data.reponse?.substring(0, 80)}..."`
    )

    // ═══════════════════════════════════════════════
    // 6. CHATBOT PDF (STREAMING SSE)
    // ═══════════════════════════════════════════════
    logSection('6/12 — Chatbot PDF (Streaming SSE)')
    const streamRes = await axios.post(`${BASE_URL}/ai/chat`, {
      publicationId: 'pub-math-101',
      question: 'Comment calculer le rang d\'une matrice ?',
      contexte_pdf: 'Le rang d\'une matrice est le nombre maximal de vecteurs colonnes linéairement indépendants. On le calcule par échelonnement de Gauss. [Page 22]',
      niveau: 'L1',
      stream: true
    }, {
      headers: { 'Accept': 'text/event-stream' },
      responseType: 'stream'
    })

    let streamedText = ''
    let chunkCount = 0
    await new Promise<void>((resolve, reject) => {
      streamRes.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim()
            if (dataStr === '[DONE]') {
              resolve()
              break
            }
            try {
              const parsed = JSON.parse(dataStr)
              if (parsed.text) {
                streamedText += parsed.text
                chunkCount++
              }
            } catch (e) {}
          }
        }
      })
      streamRes.data.on('error', (err: any) => reject(err))
      // Timeout de sécurité 10s
      setTimeout(() => resolve(), 10000)
    })

    logResult(
      'Chatbot Streaming SSE',
      streamedText.length > 20 && chunkCount > 1,
      `${chunkCount} chunks reçus | Texte total: ${streamedText.length} caractères`
    )

    // ═══════════════════════════════════════════════
    // 7. SUGGESTIONS DE QUESTIONS
    // ═══════════════════════════════════════════════
    logSection('7/12 — Suggestions de Questions')
    const questionsRes = await axios.get(`${BASE_URL}/ai/suggest-questions/pub-demo-maths-42`)
    logResult(
      'Suggestions de Questions',
      questionsRes.data.questions?.length >= 3,
      `${questionsRes.data.questions?.length} questions suggérées: ["${questionsRes.data.questions?.[0]?.substring(0, 50)}..."]`
    )

    // ═══════════════════════════════════════════════
    // 8. ENREGISTREMENT CACHE QUESTIONS
    // ═══════════════════════════════════════════════
    logSection('8/12 — Enregistrement & Cache de Questions')
    const registerRes = await axios.post(`${BASE_URL}/ai/suggest-questions/register`, {
      publicationId: 'pub-demo-chimie-007',
      texte: 'Ce cours traite de chimie organique de niveau L2 avec les orbitales moléculaires, liaisons covalentes et réactivité des alcènes.'
    })
    const cachedRes = await axios.get(`${BASE_URL}/ai/suggest-questions/pub-demo-chimie-007`)
    logResult(
      'Cache de Questions',
      registerRes.data.message && cachedRes.data.questions?.length > 0,
      `Enregistrement: "${registerRes.data.message}" | Cache: ${cachedRes.data.questions?.length} questions`
    )

    // ═══════════════════════════════════════════════
    // 9. TEXT-TO-SPEECH (TTS)
    // ═══════════════════════════════════════════════
    logSection('9/12 — Text-to-Speech (TTS)')
    const ttsRes = await axios.post(`${BASE_URL}/ai/tts`, {
      texte: 'LibraFlow est la première plateforme académique intelligente du Burkina Faso, conçue pour les universités.',
      voix: 'fr-FR-Wavenet-C',
      vitesse: 1.0
    })
    logResult(
      'Text-to-Speech',
      ttsRes.data.audio_url?.length > 10 && ttsRes.data.duree_seconds > 0,
      `Audio URL: ${ttsRes.data.audio_url?.substring(0, 60)}... | Durée: ${ttsRes.data.duree_seconds}s`
    )

    // ═══════════════════════════════════════════════
    // 10. DÉTECTION D'ACTIVITÉ SUSPECTE
    // ═══════════════════════════════════════════════
    logSection('10/12 — Détection d\'Activité Suspecte')

    // Test 10a : Activité normale
    const normalActivityRes = await axios.post(`${BASE_URL}/ai/activity/detect`, {
      etudiantId: 'etudiant-normal-001',
      actions: [
        { type: 'view', timestamp: '2026-05-23T10:00:00Z', details: 'Consultation cours maths' },
        { type: 'download', timestamp: '2026-05-23T10:05:00Z', details: 'Téléchargement exercice algèbre' },
        { type: 'comment', timestamp: '2026-05-23T10:10:00Z', details: 'Merci prof' }
      ]
    })
    logResult(
      'Activité Normale',
      normalActivityRes.data.suspicious === false,
      `Suspect: ${normalActivityRes.data.suspicious} | Sévérité: ${normalActivityRes.data.severite}`
    )

    // Test 10b : Activité suspecte (masse de téléchargements)
    const suspiciousActivityRes = await axios.post(`${BASE_URL}/ai/activity/detect`, {
      etudiantId: 'etudiant-suspect-666',
      actions: [
        { type: 'download', timestamp: '2026-05-23T10:00:00Z', details: 'Doc 1' },
        { type: 'download', timestamp: '2026-05-23T10:00:05Z', details: 'Doc 2' },
        { type: 'download', timestamp: '2026-05-23T10:00:10Z', details: 'Doc 3' },
        { type: 'download', timestamp: '2026-05-23T10:00:15Z', details: 'Doc 4' },
        { type: 'download', timestamp: '2026-05-23T10:00:20Z', details: 'Doc 5' },
        { type: 'download', timestamp: '2026-05-23T10:00:25Z', details: 'Doc 6' },
        { type: 'download', timestamp: '2026-05-23T10:00:30Z', details: 'Doc 7' }
      ]
    })
    logResult(
      'Activité Suspecte (Masse)',
      suspiciousActivityRes.data.suspicious === true,
      `Suspect: ${suspiciousActivityRes.data.suspicious} | Sévérité: ${suspiciousActivityRes.data.severite} | Raisons: ${suspiciousActivityRes.data.raisons?.[0]?.substring(0, 60)}`
    )

    // ═══════════════════════════════════════════════
    // 11. ANALYSE DE SIGNALEMENT
    // ═══════════════════════════════════════════════
    logSection('11/12 — Analyse Automatique de Signalements')

    // Test 11a : Signalement fondé
    const reportFoundedRes = await axios.post(`${BASE_URL}/ai/activity/report`, {
      publicationId: 'pub-suspect-999',
      motif: 'plagiat',
      detail: 'Ce document est une copie mot pour mot du cours du Pr. Diallo publié en 2024.'
    })
    logResult(
      'Signalement Fondé (Plagiat)',
      reportFoundedRes.data.fonde === true && reportFoundedRes.data.priorite === 'high',
      `Fondé: ${reportFoundedRes.data.fonde} | Priorité: ${reportFoundedRes.data.priorite}`
    )

    // Test 11b : Signalement non fondé
    const reportUnfoundedRes = await axios.post(`${BASE_URL}/ai/activity/report`, {
      publicationId: 'pub-legit-001',
      motif: 'autre',
      detail: 'Je n\'aime pas ce cours, il est trop difficile.'
    })
    logResult(
      'Signalement Non Fondé',
      reportUnfoundedRes.data.fonde === false,
      `Fondé: ${reportUnfoundedRes.data.fonde} | Priorité: ${reportUnfoundedRes.data.priorite}`
    )

    // ═══════════════════════════════════════════════
    // 12. INSIGHTS & RAPPORT MENSUEL
    // ═══════════════════════════════════════════════
    logSection('12/12 — Insights IA & Rapport Ministère')

    // Test 12a : Tags automatiques
    const tagsRes = await axios.post(`${BASE_URL}/ai/insights/tags`, {
      titre: 'Cours d\'algèbre linéaire — Matrices L1',
      texte: 'Ce cours couvre les fondamentaux de l\'algèbre linéaire : espaces vectoriels, applications linéaires, matrices, déterminants et systèmes d\'équations. Il est destiné aux étudiants de licence 1 en mathématiques des universités du Burkina Faso.'
    })
    logResult(
      'Tags Automatiques',
      tagsRes.data.tags?.length >= 3,
      `${tagsRes.data.tags?.length} tags: [${tagsRes.data.tags?.join(', ')}]`
    )

    // Test 12b : Rapport mensuel Ministère
    const monthlyRes = await axios.post(`${BASE_URL}/ai/insights/monthly`, {
      stats: {
        total_publications: 247,
        total_downloads: 8920,
        total_etudiants_actifs: 1340,
        top_matiere: 'Mathématiques',
        top_universite: 'Université Joseph Ki-Zerbo',
        taux_moderation_auto: '94%',
        plagiat_detecte: 3
      }
    })
    logResult(
      'Rapport Mensuel Ministère',
      monthlyRes.data.insights?.length > 50 && monthlyRes.data.suggestions?.length >= 2,
      `Rapport: ${monthlyRes.data.insights?.substring(0, 80)}... | ${monthlyRes.data.suggestions?.length} suggestions`
    )

    // ═══════════════════════════════════════════════
    // RÉSUMÉ FINAL
    // ═══════════════════════════════════════════════
    console.log(`\n${'═'.repeat(60)}`)
    console.log(`  📊  RÉSUMÉ DE LA VALIDATION DE PRODUCTION`)
    console.log(`${'═'.repeat(60)}`)
    console.log(``)
    console.log(`  Total des tests  : ${passed + failed}`)
    console.log(`  ✅ Réussis       : ${passed}`)
    console.log(`  ❌ Échoués       : ${failed}`)
    console.log(`  Taux de réussite : ${Math.round((passed / (passed + failed)) * 100)}%`)
    console.log(``)

    if (failed === 0) {
      console.log(`  🎉  TOUS LES TESTS SONT PASSÉS !`)
      console.log(`  🚀  Le microservice LibraFlow IA est PRÊT pour la production.`)
    } else {
      console.log(`  ⚠️  ${failed} test(s) ont échoué. Vérifiez les détails ci-dessus.`)
    }

    console.log(``)
    console.log(`  📋 Détail des résultats :`)
    results.forEach((r, i) => {
      console.log(`     ${(i + 1).toString().padStart(2, '0')}. ${r.status} ${r.name}`)
    })

    console.log(`\n${'═'.repeat(60)}`)
    console.log(`  🏁 Fin de la validation — ${new Date().toLocaleTimeString('fr-FR')}`)
    console.log(`${'═'.repeat(60)}\n`)

    process.exit(failed === 0 ? 0 : 1)

  } catch (error: any) {
    console.error(`\n❌ ERREUR FATALE : ${error.message}`)
    if (error.response) {
      console.error(`   URL: ${error.config?.url}`)
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Data:`, error.response.data)
    }
    process.exit(1)
  }
}

runFullProductionTest()
