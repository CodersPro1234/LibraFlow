import { geminiGenerate } from './services/gemini.service'

async function test() {
  console.log('🧪 Test du wrapper Gemini...')
  
  const reponse = await geminiGenerate({
    prompt: 'Dis bonjour en français en une phrase.',
    temperature: 0.3
  })

  console.log('✅ Réponse Gemini :', reponse)
}

test()