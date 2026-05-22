import { useState } from 'react'

const statsData = [
  { label: 'Vues totales',    value: '1 247', color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '👁' },
  { label: 'Likes reçus',     value: '348',   color: 'var(--color-danger)',  bg: '#FEE2E2',                    icon: '♥' },
  { label: 'Téléchargements', value: '219',   color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '⬇' },
  { label: 'Abonnés',         value: '87',    color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '👥' },
]

const publications = [
  {
    id: 1,
    univLogo: 'USTA', univColor: '#378ADD',
    universite: 'USTA Bobo-Dioulasso',
    auteur: 'Prof. Traoré Fatoumata', temps: 'il y a 5h',
    titre: 'Annales Mathématiques — Session 2024/2025',
    matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales',
    score: 88, likes: 41, commentaires: 12,
  },
  {
    id: 2,
    univLogo: 'UJK', univColor: 'var(--color-primary)',
    universite: 'Université Joseph Ki-Zerbo',
    auteur: 'Prof. Ouédraogo Mamadou', temps: 'hier',
    titre: 'Droit Civil — Introduction générale',
    matiere: 'Droit Civil', niveau: 'Licence 1', type: 'Cours',
    score: 91, likes: 33, commentaires: 7,
  },
]

const FeedPage = () => {
  const [likes, setLikes] = useState({})
  const toggleLike = (id) => setLikes(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {statsData.map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fil publications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {publications.map((pub) => (
          <div key={pub.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: pub.univColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {pub.univLogo}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{pub.universite}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{pub.auteur} · {pub.temps}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', flexShrink: 0,
                background: pub.score >= 75 ? 'var(--color-success-light)' : 'var(--color-gold-light)',
                color: pub.score >= 75 ? 'var(--color-success)' : 'var(--color-gold)',
              }}>
                IA {pub.score}
              </span>
            </div>

            {/* Titre */}
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
              {pub.titre}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{pub.matiere}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>{pub.niveau}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>{pub.type}</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => toggleLike(pub.id)}
                style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  border: `1.5px solid ${likes[pub.id] ? 'var(--color-danger)' : '#E5E7EB'}`,
                  background: likes[pub.id] ? '#FEE2E2' : '#fff',
                  color: likes[pub.id] ? 'var(--color-danger)' : '#6B7280',
                }}>
                {likes[pub.id] ? '♥' : '♡'} {likes[pub.id] ? pub.likes + 1 : pub.likes}
              </button>
              <button style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280' }}>
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
