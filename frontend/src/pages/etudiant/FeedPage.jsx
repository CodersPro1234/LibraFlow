import { useState } from 'react'

const publications = [
  {
    id: 1,
    univLogo: 'UJK',
    univColor: 'var(--color-primary)',
    universite: 'Université Joseph Ki-Zerbo',
    auteur: 'Prof. Ouédraogo Mamadou',
    temps: 'il y a 2h',
    titre: 'Droit Constitutionnel — Cours magistral Chapitre 4',
    matiere: 'Droit Constitutionnel',
    niveau: 'Licence 2',
    type: 'Cours',
    score: 94,
    likes: 24,
    commentaires: 8,
  },
  {
    id: 2,
    univLogo: 'USTA',
    univColor: '#378ADD',
    universite: 'USTA Bobo-Dioulasso',
    auteur: 'Prof. Traoré Fatoumata',
    temps: 'il y a 5h',
    titre: 'Annales Mathématiques — Session 2024/2025',
    matiere: 'Mathématiques',
    niveau: 'Licence 3',
    type: 'Annales',
    score: 88,
    likes: 41,
    commentaires: 12,
  },
  {
    id: 3,
    univLogo: 'ISGE',
    univColor: 'var(--color-gold)',
    universite: 'ISGE-BF Ouagadougou',
    auteur: 'Prof. Zongo Issa',
    temps: 'hier',
    titre: 'TD Finance d\'entreprise — Exercices corrigés S2',
    matiere: 'Finance',
    niveau: 'Master 1',
    type: 'TD',
    score: 71,
    likes: 19,
    commentaires: 5,
  },
]

const ScoreBadge = ({ score }) => {
  const config =
    score >= 75
      ? { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: '✓' }
      : score >= 50
      ? { bg: 'var(--color-gold-light)', color: 'var(--color-gold)', label: '~' }
      : { bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: '!' }

  return (
    <span className="text-xs font-semibold px-2 py-1 rounded-full"
      style={{ background: config.bg, color: config.color }}>
      {config.label} {score}
    </span>
  )
}

const FeedPage = () => {
  const [likes, setLikes] = useState({})

  const toggleLike = (id, base) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">

      {/* Bloc IA */}
      <div className="rounded-xl p-3 border"
        style={{ background: 'var(--color-primary-light)', borderColor: '#BFDBFE' }}>
        <span className="text-xs font-semibold px-2 py-1 rounded-full text-white inline-block mb-2"
          style={{ background: 'var(--color-primary)' }}>
          IA recommande
        </span>
        <p className="text-xs" style={{ color: 'var(--color-primary-dark)' }}>
          3 nouveaux cours en Droit Constitutionnel correspondent à ton niveau Licence 2.
        </p>
      </div>

      {/* Publications */}
      {publications.map((pub) => (
        <div key={pub.id} className="bg-white rounded-xl border p-4"
          style={{ borderColor: 'var(--color-border)' }}>

          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: pub.univColor }}>
              {pub.univLogo}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{pub.universite}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{pub.auteur} · {pub.temps}</div>
            </div>
            <ScoreBadge score={pub.score} />
          </div>

          {/* Titre */}
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            {pub.titre}
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
              {pub.matiere}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
              {pub.niveau}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              {pub.type}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
              style={{ background: 'var(--color-primary)' }}>
              📖 Lire
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border font-medium"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
              ⬇ Télécharger
            </button>
            <button
              onClick={() => toggleLike(pub.id)}
              className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
              style={{
                borderColor: likes[pub.id] ? 'var(--color-danger)' : 'var(--color-border)',
                background: likes[pub.id] ? 'var(--color-danger-light)' : 'transparent',
                color: likes[pub.id] ? 'var(--color-danger)' : 'var(--color-muted)',
              }}>
              {likes[pub.id] ? '♥' : '♡'} {likes[pub.id] ? pub.likes + 1 : pub.likes}
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border font-medium"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
              💬 {pub.commentaires}
            </button>
            <button className="text-xs px-3 py-1.5 rounded-lg border font-medium"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
              🔊 Écouter
            </button>
          </div>

        </div>
      ))}

    </div>
  )
}

export default FeedPage