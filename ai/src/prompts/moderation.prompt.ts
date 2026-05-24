export function getModerationPrompt({
  titre,
  matiere,
  niveau,
  type_doc,
  texte
}: {
  titre: string
  matiere: string
  niveau: string
  type_doc: string
  texte: string
}): string {
  return `
Tu es un expert en évaluation de documents académiques africains.
Analyse ce document et retourne UNIQUEMENT un JSON valide, sans texte avant ou après.

DOCUMENT À ANALYSER :
- Titre : ${titre}
- Matière déclarée : ${matiere}
- Niveau déclaré : ${niveau}
- Type : ${type_doc}
- Contenu (extrait) : ${texte.slice(0, 30000)}

CRITÈRES D'ÉVALUATION :

1. PERTINENCE ÉDUCATIVE (0-100)
   - Est-ce un vrai contenu académique ?
   - Y a-t-il des définitions, exercices, explications ?
   - La langue est-elle adaptée à un contexte éducatif ?

2. COHÉRENCE MATIÈRE (0-100)
   - Le vocabulaire correspond-il à la matière déclarée ?
   - Le contenu correspond-il réellement à "${matiere}" ?

3. ADAPTATION AU NIVEAU (0-100)
   - Le contenu est-il adapté au niveau "${niveau}" ?

4. CONTENU INAPPROPRIÉ
   - Propagande politique ou religieuse ?
   - Publicité commerciale ?
   - Contenu haineux ou offensant ?
   - Copie de manuel sans attribution ?

RÈGLE DE DÉCISION :
- "validee" si pertinence > 60 ET cohérence > 60 ET pas de contenu inapproprié
- "signalee" dans tous les autres cas

RETOURNE EXACTEMENT CE JSON :
{
  "status": "validee" | "signalee",
  "score_fiabilite": number (0-100, moyenne pondérée des scores),
  "resume": "string (3-4 lignes résumant le document)",
  "mots_cles": ["mot1", "mot2", "mot3", "mot4", "mot5"],
  "raisons": {
    "pertinence": {
      "score": number,
      "detail": "string (explication courte)"
    },
    "coherence_matiere": {
      "score": number,
      "detail": "string"
    },
    "adaptation_niveau": {
      "score": number,
      "detail": "string"
    },
    "contenu_inapproprie": {
      "detected": boolean,
      "detail": "string"
    }
  }
}
`
}