import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const publications = [
  { id: 1, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', temps: 'il y a 2h', titre: 'Droit Constitutionnel — Cours magistral Chapitre 4', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours', score: 94, likes: 24, commentaires: 8 },
  { id: 2, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', temps: 'il y a 5h', titre: 'Annales Mathématiques — Session 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, likes: 41, commentaires: 12 },
  { id: 3, univLogo: 'ISGE', univColor: '#f59e0b', universite: 'ISGE-BF Ouagadougou', auteur: 'Prof. Zongo Issa', temps: 'hier', titre: "TD Finance d'entreprise — Exercices corrigés S2", matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, likes: 19, commentaires: 5 },
]

const scoreStyle = (s) => s >= 75
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : { bg: 'var(--color-gold-light)', color: 'var(--color-gold)' }

const TAG_STYLES = {
  matiere: { background: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  niveau:  { background: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  type:    { background: 'var(--color-success-light)', color: 'var(--color-success)' },
}

const FeedPage = () => {
  const navigate = useNavigate()
  const [likes, setLikes]   = useState({})
  const [shared, setShared] = useState({})

  const toggleLike  = (id) => setLikes(p  => ({ ...p,  [id]: !p[id] }))
  const handleShare = (id) => {
    setShared(p => ({ ...p, [id]: true }))
    setTimeout(() => setShared(p => ({ ...p, [id]: false })), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Bannière IA */}
      <div style={{ borderRadius: '14px', padding: '14px 16px', background: 'var(--color-primary-light)', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '22px', flexShrink: 0 }}>🤖</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '2px' }}>Recommandé pour toi</div>
          <div style={{ fontSize: '13px', color: 'var(--color-primary-dark)', lineHeight: 1.5 }}>3 nouveaux cours en Droit Constitutionnel correspondent à ton niveau Licence 2.</div>
        </div>
      </div>

      {/* Publications */}
      {publications.map(pub => {
        const sc = scoreStyle(pub.score)
        const liked = !!likes[pub.id]
        return (
          <div key={pub.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

            {/* Bande couleur université */}
            <div style={{ height: '4px', background: pub.univColor }} />

            <div style={{ padding: '18px 20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: pub.univColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {pub.univLogo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pub.universite}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{pub.auteur} · {pub.temps}</div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', background: sc.bg, color: sc.color, flexShrink: 0 }}>
                  IA {pub.score}
                </span>
              </div>

              {/* Titre */}
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827', lineHeight: 1.35, marginBottom: '12px', letterSpacing: '-0.2px' }}>
                {pub.titre}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[['matiere', pub.matiere], ['niveau', pub.niveau], ['type', pub.type]].map(([k, v]) => (
                  <span key={k} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px', ...TAG_STYLES[k] }}>
                    {v}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Primaires */}
                <button onClick={() => navigate(`/etudiant/lecture/${pub.id}`)}
                  style={{ padding: '9px 18px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📖 Lire
                </button>
                <button style={{ padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⬇ Télécharger
                </button>

                <div style={{ flex: 1 }} />

                {/* Secondaires compacts */}
                <button onClick={() => toggleLike(pub.id)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${liked ? 'var(--color-danger)' : '#E5E7EB'}`, background: liked ? 'var(--color-danger-light)' : '#fff', color: liked ? 'var(--color-danger)' : '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {liked ? '♥' : '♡'} {liked ? pub.likes + 1 : pub.likes}
                </button>
                <button style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  💬 {pub.commentaires}
                </button>
                <button onClick={() => handleShare(pub.id)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${shared[pub.id] ? 'var(--color-success)' : '#E5E7EB'}`, background: '#fff', color: shared[pub.id] ? 'var(--color-success)' : '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  {shared[pub.id] ? '✓' : '🔗'}
                </button>
                <button onClick={() => navigate(`/etudiant/lecture/${pub.id}`)}
                  style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  🔊
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FeedPage
