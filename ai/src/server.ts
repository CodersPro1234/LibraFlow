import express from 'express'
import dotenv from 'dotenv'
import moderateRouter from './routes/moderate'
import plagiarismRouter from './routes/plagiarism'
import summarizeRouter from './routes/summarize'
import recommendRouter from './routes/recommend'
import chatRouter from './routes/chat'
import questionsRouter from './routes/questions'
import ttsRouter from './routes/tts'
import suspiciousRouter from './routes/suspicious'
import insightsRouter from './routes/insights'

// ...


dotenv.config()

const app = express()
app.use(express.json())
app.use('/ai/summarize', summarizeRouter)

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'libraflow-ai-service',
    mock_mode: process.env.MOCK_MODE === 'true'
  })
})

app.use('/ai/moderate', moderateRouter)
app.use('/ai/plagiarism-check', plagiarismRouter)
app.use('/ai/recommend', recommendRouter)
app.use('/ai/chat', chatRouter)
app.use('/ai/suggest-questions', questionsRouter)
app.use('/ai/tts', ttsRouter)
app.use('/ai/activity', suspiciousRouter)
app.use('/ai/insights', insightsRouter)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`🚀 AI Service running on port ${PORT}`)
  console.log(`🎭 Mock mode : ${process.env.MOCK_MODE === 'true' ? 'ACTIVÉ' : 'désactivé'}`)
})

process.on('SIGINT', () => {
  console.log('🛑 Arrêt du serveur...')
  server.close()
  process.exit(0)
})