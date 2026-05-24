export function getClassifyMatierePrompt(texte: string): string {
  return `Tu es un expert en classification de documents académiques africains.

Analyse ce document et détermine sa matière principale.

LISTE DES MATIÈRES AUTORISÉES (choisis UNIQUEMENT parmi cette liste) :
- mathematiques
- physique
- chimie
- biologie
- informatique
- economie
- droit
- histoire
- geographie
- philosophie
- litterature
- anglais
- français
- medicine
- pharmacie
- autre

TEXTE DU DOCUMENT (premiers 5000 caractères) :
${texte.slice(0, 5000)}

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "matiere_detectee": "nom_de_la_matiere",
  "confiance": 85,
  "mots_cles_detectes": ["mot1", "mot2", "mot3"],
  "explication": "Courte explication de pourquoi cette matière"
}`
}