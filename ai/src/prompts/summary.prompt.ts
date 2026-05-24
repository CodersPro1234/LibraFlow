export function getSummaryPrompt(texte: string, maxLines: number = 4): string {
  return `Tu es un assistant académique spécialisé dans la synthèse de documents universitaires africains.

Analyse ce document et produis un résumé clair et concis.

INSTRUCTIONS :
- Résumé en exactement ${maxLines} lignes maximum
- 5 à 10 mots-clés représentatifs
- Langue : français académique
- Adapté aux étudiants universitaires

TEXTE DU DOCUMENT :
${texte.slice(0, 20000)}

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "resume": "Résumé du document en ${maxLines} lignes maximum.",
  "mots_cles": ["mot1", "mot2", "mot3", "mot4", "mot5"]
}`
}