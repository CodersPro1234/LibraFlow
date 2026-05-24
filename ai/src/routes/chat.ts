import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { geminiGenerate } from '../services/gemini.service'
import { getChatPrompt } from '../prompts/chat.prompt'

const router = Router()

const ChatBodySchema = z.object({
  publicationId: z.string(),
  question: z.string().min(2),
  contexte_pdf: z.string().min(50),
  niveau: z.string().optional().default('L1'),
  historique_session: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().default([]),
  stream: z.boolean().optional().default(false)
})

const ChatResponseSchema = z.object({
  reponse: z.string(),
  sources_pages: z.array(z.number()).optional().default([])
})

router.post('/', async (req: Request, res: Response) => {
  const result = ChatBodySchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ erreur: 'Body invalide', details: result.error.issues })
  }

  const { question, contexte_pdf, niveau, stream } = result.data

  const useStreaming = stream || req.headers.accept === 'text/event-stream'

  if (useStreaming) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    if (process.env.MOCK_MODE === 'true') {
      console.log(`🎭 [MOCK STREAM] Démarrage du flux de chat SSE`)
      const responseText = "D'après le document d'algèbre linéaire fourni, le rang d'une matrice correspond au nombre maximal de lignes (ou de colonnes) linéairement indépendantes. Ce concept est fondamental pour résoudre des systèmes d'équations linéaires [Page 3]."
      
      const words = responseText.split(' ')
      for (const word of words) {
        if (res.writableEnded) break
        res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`)
        await new Promise(resolve => setTimeout(resolve, 80))
      }
      res.write('data: [DONE]\n\n')
      return res.end()
    }

    try {
      const prompt = getChatPrompt({ question, contexte_pdf, niveau, jsonMode: false })
      const fullResponse = await geminiGenerate({ prompt, jsonMode: false })
      
      const words = fullResponse.split(' ')
      for (const word of words) {
        if (res.writableEnded) break
        res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`)
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      res.write('data: [DONE]\n\n')
      return res.end()

    } catch (error: any) {
      console.error('❌ Erreur streaming chat:', error.message)
      res.write(`data: ${JSON.stringify({ erreur: error.message })}\n\n`)
      return res.end()
    }
  }

  try {
    const prompt = getChatPrompt({ question, contexte_pdf, niveau, jsonMode: true })
    const reponseIA = await geminiGenerate({ prompt, jsonMode: true })

    const json = JSON.parse(reponseIA)
    const validation = ChatResponseSchema.safeParse(json)

    if (!validation.success) {
      return res.status(500).json({ erreur: 'Réponse IA invalide' })
    }

    return res.json(validation.data)

  } catch (error: any) {
    console.error('❌ Erreur chat route:', error.message)
    return res.status(500).json({ erreur: error.message })
  }
})

export default router
