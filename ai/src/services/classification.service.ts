import { geminiGenerate } from './gemini.service'
import { getClassifyMatierePrompt } from '../prompts/classify-matiere.prompt'
import { z } from 'zod'

const ClassificationSchema = z.object({
  matiere_detectee: z.string(),
  confiance: z.number().min(0).max(100),
  mots_cles_detectes: z.array(z.string()),
  explication: z.string()
})

export async function classifierMatiere(texte: string): Promise<{
  matiere_detectee: string
  confiance: number
  mots_cles_detectes: string[]
  explication: string
}> {
  const prompt = getClassifyMatierePrompt(texte)
  const reponse = await geminiGenerate({ prompt, jsonMode: true })

  const json = JSON.parse(reponse)
  const validation = ClassificationSchema.safeParse(json)

  if (!validation.success) {
    throw new Error('Classification invalide : ' + JSON.stringify(validation.error.issues))
  }

  return validation.data
}

export function verifierCoherenceMatiere(
  matiereDeclaree: string,
  matiereDetectee: string,
  confiance: number
): { coherent: boolean; detail: string } {
  const declared = matiereDeclaree.toLowerCase().trim()
  const detected = matiereDetectee.toLowerCase().trim()

  if (confiance < 60) {
    return { coherent: true, detail: 'Confiance trop faible pour conclure' }
  }

  if (declared === detected || detected.includes(declared) || declared.includes(detected)) {
    return { coherent: true, detail: `Matière confirmée : ${matiereDetectee}` }
  }

  return {
    coherent: false,
    detail: `Matière déclarée "${matiereDeclaree}" mais contenu détecté comme "${matiereDetectee}" (confiance ${confiance}%)`
  }
}