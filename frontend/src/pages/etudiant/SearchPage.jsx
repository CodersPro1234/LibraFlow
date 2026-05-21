import { useState } from 'react'

const tousDocuments = [
  { id: 1, univLogo: 'UJK', univColor: 'var(--color-primary)', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Constitutionnel — Chapitre 4', matiere: 'Droit', niveau: 'Licence 2', type: 'Cours', score: 94, likes: 24 },
  { id: 2, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, likes: 41 },
  { id: 3, univLogo: 'ISGE', univColor: 'var(--color-gold)', universite: 'ISGE-BF', auteur: 'Prof. Zongo Issa', titre: 'TD Finance d\'entreprise S2', matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, likes: 19 },
  { id: 4, univLogo: 'UJK', univColor: 'var(--color-primary)', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Civil — Introduction générale', matiere: 'Droit', niveau: 'Licence 1', type: 'Cours', score: 87, likes: 33 },
  { id: 5, univLogo: 'BIT', univColor: '#555', universite: 'BIT Burkina', auteur: 'Prof. Kaboré Adama', titre: 'Introduction à l\'Informatique', matiere: 'Informatique', niveau: 'Licence 1', type: 'Cours', score: 91, likes: 56 },
]

const niveaux = ['Tous', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2']
const types = ['Tous', 'Cours', 'TD', 'Annales', 'Résumé']
const univs = ['Toutes', 'UJK-Zerbo', 'USTA', 'ISGE-BF', 'BIT']

const SearchPage = () => {
  const [query, setQuery] = useState('')
  const [niveau, setNiveau] = useState('Tous')
  const [type, setType] = useState('Tous')
  const [univ, setUniv] = useState('Toutes')

  const resultats = tousDocuments.filter((d) => {
    const matchQuery = query === '' || d.titre.toLowerCase().includes(query.toLowerCase()) || d.matiere.toLowerCase().includes(query.toLowerCase())
    const matchNiveau = niveau === 'Tous' || d.niveau === niveau
    const matchType = type === 'Tous' || d.type === type
    const matchUniv = univ === 'Toutes' || d.universite.includes(univ)
    return matchQuery && matchNiveau && matchType && matchUniv
  })

  return (
    <div className="flex flex-col gap-4 max-w-2xl">

      {/* Barre de recherche */}
      <div className="flex items-center gap-3 bg-white rounded-xl border px-4 py-3"
        style={{ borderColor: 'var(--color-border)' }}>
        <span style={{ color: 'var(--color-muted)' }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher un document, une matière..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent"
          style={{ color: 'var(--color-text)' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ color: 'var(--color-muted)' }}>✕</button>
        )}
      </div>

      {/* Filtres niveau */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Niveau</div>
        <div className="flex gap-2 flex-wrap">
          {niveaux.map((n) => (
            <button key={n} onClick={() => setNiveau(n)}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
              style={{
                background: niveau === n ? 'var(--color-primary)' : 'transparent',
                color: niveau === n ? 'white' : 'var(--color-muted)',
                borderColor: niveau === n ? 'var(--color-primary)' : 'var(--color-border)',
              }}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres type */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Type</div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
              style={{
                background: type === t ? 'var(--color-gold)' : 'transparent',
                color: type === t ? 'white' : 'var(--color-muted)',
                borderColor: type === t ? 'var(--color-gold)' : 'var(--color-border)',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres université */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Université</div>
        <div className="flex gap-2 flex-wrap">
          {univs.map((u) => (
            <button key={u} onClick={() => setUniv(u)}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
              style={{
                background: univ === u ? 'var(--color-primary-dark)' : 'transparent',
                color: univ === u ? 'white' : 'var(--color-muted)',
                borderColor: univ === u ? 'var(--color-primary-dark)' : 'var(--color-border)',
              }}>
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Résultats */}
      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {resultats.length} résultat{resultats.length > 1 ? 's' : ''}
        {query && ` pour "${query}"`}
      </div>

      {resultats.map((doc) => (
        <div key={doc.id} className="bg-white rounded-xl border p-4"
          style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: doc.univColor }}>
              {doc.univLogo}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{doc.universite}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{doc.auteur}</div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                background: doc.score >= 75 ? 'var(--color-success-light)' : 'var(--color-gold-light)',
                color: doc.score >= 75 ? 'var(--color-success)' : 'var(--color-gold)',
              }}>
              ✓ {doc.score}
            </span>
          </div>
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            {doc.titre}
          </div>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
              {doc.matiere}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
              {doc.niveau}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              {doc.type}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
              style={{ background: 'var(--color-primary)' }}>
              📖 Lire
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border font-medium"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
              ⬇ Télécharger
            </button>
          </div>
        </div>
      ))}

      {resultats.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-sm">Aucun résultat trouvé</div>
          <div className="text-xs mt-1">Essaie avec d'autres mots clés ou filtres</div>
        </div>
      )}

    </div>
  )
}

export default SearchPage