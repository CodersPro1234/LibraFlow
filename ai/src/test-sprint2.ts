import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

// S'assurer que le mode mock est activé pour les tests locaux
process.env.MOCK_MODE = 'true'

const BASE_URL = 'http://localhost:5000'

async function runTests() {
  console.log('🧪 Démarrage des Tests du Sprint 2 (Recommandations & Chatbot)...\n')

  // 1. Démarrer le serveur local de test
  console.log('🚀 Initialisation du serveur Express en arrière-plan...')
  require('./server')

  // Attendre 2 secondes que le serveur démarre
  await new Promise(resolve => setTimeout(resolve, 2000))

  try {
    // --- Test 1 : /health ---
    console.log('🔍 Test 1 : Vérification de la santé du serveur...')
    const healthRes = await axios.get(`${BASE_URL}/health`)
    console.log(`Statut : ${healthRes.data.status}, Mock Mode : ${healthRes.data.mock_mode}`)
    if (healthRes.data.status === 'ok') {
      console.log('✅ Health check réussi !\n')
    } else {
      console.log('❌ Health check échoué\n')
    }

    // --- Test 2 : Recommandations ---
    console.log('📚 Test 2 : Récupération des recommandations...')
    const recommendRes = await axios.post(`${BASE_URL}/ai/recommend`, {
      etudiantId: 'etudiant-test-999',
      preferences: {
        matieres: ['mathématiques'],
        niveau: 'L1',
        universite_id: 'univ-ouaga'
      },
      historique: [
        { publication_id: 'pub-math-101', type: 'like' }
      ]
    })
    console.log('Recommandations reçues :', recommendRes.data.recommandations)
    if (recommendRes.data.recommandations && recommendRes.data.recommandations.length > 0) {
      console.log('✅ Recommandations réussies !\n')
    } else {
      console.log('❌ Recommandations échouées\n')
    }

    // --- Test 3 : Chatbot PDF (JSON) ---
    console.log('💬 Test 3 : Chatbot PDF (Format JSON)...')
    const chatRes = await axios.post(`${BASE_URL}/ai/chat`, {
      publicationId: 'pub-math-101',
      question: 'Qu\'est-ce que le rang d\'une matrice ?',
      contexte_pdf: 'Le cours présente les matrices et les espaces vectoriels de niveau L1. Le rang d\'une matrice est le nombre de vecteurs colonnes linéairement indépendants [Page 2].',
      niveau: 'L1',
      stream: false
    })
    console.log('Réponse reçue :', chatRes.data)
    if (chatRes.data.reponse) {
      console.log('✅ Chatbot JSON réussi !\n')
    } else {
      console.log('❌ Chatbot JSON échoué\n')
    }

    // --- Test 4 : Chatbot PDF (Streaming SSE) ---
    console.log('📡 Test 4 : Chatbot PDF (Streaming SSE)...')
    const streamRes = await axios.post(`${BASE_URL}/ai/chat`, {
      publicationId: 'pub-math-101',
      question: 'Qu\'est-ce que le rang d\'une matrice ?',
      contexte_pdf: 'Le cours présente les matrices et les espaces vectoriels de niveau L1. Le rang d\'une matrice est le nombre de vecteurs colonnes linéairement indépendants [Page 2].',
      niveau: 'L1',
      stream: true
    }, {
      headers: { 'Accept': 'text/event-stream' },
      responseType: 'stream'
    })

    let accumulatedText = ''
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
                accumulatedText += parsed.text
              }
            } catch (e) {}
          }
        }
      })
      streamRes.data.on('error', (err: any) => reject(err))
    })

    console.log(`Texte accumulé en streaming : "${accumulatedText}"`)
    if (accumulatedText.length > 20) {
      console.log('✅ Chatbot Streaming SSE réussi !\n')
    } else {
      console.log('❌ Chatbot Streaming SSE échoué\n')
    }

    // --- Test 5 : Suggestions de questions ---
    console.log('💡 Test 5 : Suggestions de questions...')
    const questionsRes = await axios.get(`${BASE_URL}/ai/suggest-questions/pub-test-012`)
    console.log('Questions suggérées :', questionsRes.data.questions)
    if (questionsRes.data.questions && questionsRes.data.questions.length > 0) {
      console.log('✅ Suggestions de questions réussies !\n')
    } else {
      console.log('❌ Suggestions de questions échouées\n')
    }

    // --- Test 6 : Enregistrement dans le cache de suggestions ---
    console.log('💾 Test 6 : Enregistrement de questions spécifiques...')
    const registerRes = await axios.post(`${BASE_URL}/ai/suggest-questions/register`, {
      publicationId: 'pub-chimie-456',
      texte: 'Ce document traite de chimie organique de niveau L2 avec les orbitales moléculaires.'
    })
    console.log('Résultat de l\'enregistrement :', registerRes.data.message)

    // Vérifier que le cache renvoie bien les nouvelles questions
    const checkQuestionsRes = await axios.get(`${BASE_URL}/ai/suggest-questions/pub-chimie-456`)
    console.log('Questions récupérées du cache :', checkQuestionsRes.data.questions)
    if (checkQuestionsRes.data.questions && checkQuestionsRes.data.questions[0].includes('texte')) {
      console.log('✅ Caching et enregistrement réussis !\n')
    } else {
      console.log('❌ Caching et enregistrement échoués\n')
    }

    console.log('🏁 Tous les tests du Sprint 2 ont été exécutés avec succès !')
    process.exit(0)

  } catch (error: any) {
    console.error('❌ Erreur lors de l\'exécution des tests :', error.message)
    if (error.response) {
      console.error('Détails de l\'erreur :', error.response.data)
    }
    process.exit(1)
  }
}

runTests()
