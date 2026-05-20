import { useState } from 'react'

const stats = [
  { label: 'Vues totales', value: '1 247', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
  { label: 'Likes reçus', value: '348', color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
  { label: 'Téléchargements', value: '219', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  { label: 'Abonnés', value: '87', color: 'var(--color-gold)', bg: 'var(--color-gold-light)' },
]

const publications = [
  {
    id: 1,
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
    id: 2,
    univLogo: 'UJK',
    univColor: 'var(--color-primary)',
    universite: 'Université Joseph Ki-Zerbo',
    auteur: 'Prof. Ouédraogo Mamadou',
    temps: 'hier',
    titre: 'Droit Civil — Introduction générale',
    matiere: 'Droit Civil',
    niveau: 'Licence 1',
    type: 'Cours',
    score: 91,
    likes: 33,
    commentaires: 7,
  },
]

const FeedPage = () => {
  const [likes, setLikes] = useState({})

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4"
            style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fil */}
      <div className="flex flex-col gap-4 max-w-2xl">
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
              <span className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{
                  background: pub.score >= 75 ? 'var(--color-success-light)' : 'var(--color-gold-light)',
                  color: pub.score >= 75 ? 'var(--color-success)' : 'var(--color-gold)',
                }}>
                ✓ {pub.score}
              </span>
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
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default FeedPage