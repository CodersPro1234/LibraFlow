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
    slides: [
      { label: 'Mathématiques · L3',  title: 'Annales — Session 2024/2025',                                                  sub: 'Prof. Traoré Fatoumata · USTA Bobo' },
      { label: 'Exercice 1',           title: 'Soit f(x) = x³ - 3x² + 2. Étudiez les variations de f et tracez sa courbe.', sub: 'Analyse — 5 points' },
      { label: 'Exercice 2',           title: "Calculez l'intégrale ∫₀¹ (x² + 2x - 1) dx en justifiant chaque étape.",      sub: 'Intégration — 4 points' },
      { label: 'Exercice 3',           title: 'Démontrez que la suite (uₙ) définie par uₙ₊₁ = ½(uₙ + 3) converge.',         sub: 'Suites — 6 points' },
    ],
    comments: [
      { id: 1, initials: 'MB', color: '#8b5cf6', nom: 'Millogo Blandine', role: 'Étudiante · Maths L3 · USTA Bobo',       temps: '5h', texte: "Enfin les annales 2025 ! L'exercice 3 sur les suites est vraiment bien posé." },
      { id: 2, initials: 'OK', color: '#ef4444', nom: 'Ouédraogo Kisito', role: 'Étudiant · Informatique L2 · UJK-Zerbo', temps: '8h', texte: "Est-ce qu'il y a un corrigé type disponible pour l'exercice 2 ?" },
    ],
  },
  {
    id: 2,
    univLogo: 'UJK', univColor: 'var(--color-primary)',
    universite: 'Université Joseph Ki-Zerbo',
    auteur: 'Prof. Ouédraogo Mamadou', temps: 'hier',
    titre: 'Droit Civil — Introduction générale',
    matiere: 'Droit Civil', niveau: 'Licence 1', type: 'Cours',
    score: 91, likes: 33, commentaires: 7,
    slides: [
      { label: 'Droit Civil · L1',        title: 'Introduction générale au Droit Civil',                                                                          sub: 'Prof. Ouédraogo Mamadou · UJK-Zerbo' },
      { label: 'Définition',               title: 'Le droit civil est l\'ensemble des règles qui régissent les relations entre personnes privées dans leur vie.',   sub: 'Page 2 · Concepts fondamentaux' },
      { label: 'Sources du droit civil',   title: 'I. La loi et les textes réglementaires\nII. La jurisprudence\nIII. La doctrine',                               sub: 'Page 3 · Sources' },
      { label: 'Les personnes juridiques', title: 'Les personnes physiques et morales sont les deux catégories de sujets de droit reconnus par le système.',       sub: 'Page 4 · Sujets de droit' },
    ],
    comments: [
      { id: 1, initials: 'DK', color: '#3B7FE1', nom: 'Diallo Karim',     role: 'Étudiant · Droit L1 · UJK-Zerbo',    temps: '1j',  texte: 'Très bon cours professeur ! Très accessible pour les débutants en droit.' },
      { id: 2, initials: 'ST', color: '#f59e0b', nom: 'Sawadogo Tiguida', role: 'Étudiante · Droit L1 · UJK-Zerbo',   temps: '1j',  texte: 'La partie sur les sources du droit civil est particulièrement bien expliquée.' },
      { id: 3, initials: 'AP', color: '#10b981', nom: 'Alidou Pousga',    role: 'Étudiant · Droit L1 · UJK-Zerbo',   temps: '2j',  texte: 'Est-ce que le cours sur les contrats arrive bientôt ?' },
    ],
  },
]

const FeedPage = () => {
  const [likes, setLikes]               = useState({})
  const [slideIdx, setSlideIdx]         = useState({})
  const [openComments, setOpenComments] = useState({})
  const [newComment, setNewComment]     = useState({})
  const [commentLikes, setCommentLikes] = useState({})

  const toggleLike        = (id)  => setLikes(p => ({ ...p, [id]: !p[id] }))
  const getSlide          = (id)        => slideIdx[id] || 0
  const goNext            = (id, total) => setSlideIdx(p => ({ ...p, [id]: Math.min((p[id] || 0) + 1, total - 1) }))
  const goPrev            = (id)        => setSlideIdx(p => ({ ...p, [id]: Math.max((p[id] || 0) - 1, 0) }))
  const toggleComments    = (id)  => setOpenComments(p => ({ ...p, [id]: !p[id] }))
  const toggleCommentLike = (key) => setCommentLikes(p => ({ ...p, [key]: !p[key] }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {statsData.map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fil publications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {publications.map((pub) => {
          const liked   = !!likes[pub.id]
          const idx     = getSlide(pub.id)
          const slide   = pub.slides[idx]
          const total   = pub.slides.length
          const showCom = !!openComments[pub.id]

          return (
            <div key={pub.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

              <div style={{ padding: '20px 20px 0' }}>
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
                  }}>IA {pub.score}</span>
                </div>

                {/* Titre + Tags */}
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>{pub.titre}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{pub.matiere}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>{pub.niveau}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>{pub.type}</span>
                </div>
              </div>

              {/* Carousel */}
              <div style={{ position: 'relative', margin: '0 20px 16px', borderRadius: '14px', background: '#0d1f3c', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '12px', right: '14px', zIndex: 2, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{total} pages</div>
                <div style={{ padding: '28px 56px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>{slide.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.55, marginBottom: '14px', whiteSpace: 'pre-line' }}>{slide.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{slide.sub}</div>
                </div>
                {idx > 0 && (
                  <button onClick={() => goPrev(pub.id)} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>‹</button>
                )}
                {idx < total - 1 && (
                  <button onClick={() => goNext(pub.id, total)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>›</button>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px 14px', background: 'rgba(0,0,0,0.25)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', minWidth: '36px' }}>{idx + 1}/{total}</span>
                  <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
                    {pub.slides.map((_, i) => (
                      <button key={i} onClick={() => setSlideIdx(p => ({ ...p, [pub.id]: i }))}
                        style={{ flex: 1, height: '3px', borderRadius: '100px', border: 'none', cursor: 'pointer', padding: 0, background: i === idx ? '#fff' : 'rgba(255,255,255,0.25)' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: '0 20px 14px', display: 'flex', gap: '8px' }}>
                <button onClick={() => toggleLike(pub.id)}
                  style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    border: `1.5px solid ${liked ? 'var(--color-danger)' : '#E5E7EB'}`,
                    background: liked ? '#FEE2E2' : '#fff',
                    color: liked ? 'var(--color-danger)' : '#6B7280',
                  }}>
                  {liked ? '♥' : '♡'} {liked ? pub.likes + 1 : pub.likes}
                </button>
                <button onClick={() => toggleComments(pub.id)}
                  style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    border: `1.5px solid ${showCom ? 'var(--color-primary)' : '#E5E7EB'}`,
                    background: showCom ? 'var(--color-primary-light)' : '#fff',
                    color: showCom ? 'var(--color-primary)' : '#6B7280',
                  }}>
                  💬 {pub.commentaires}
                </button>
              </div>

              {/* ── Section commentaires ── */}
              {showCom && (
                <div style={{ borderTop: '1px solid #F3F4F6' }}>

                  {/* Input */}
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #F9FAFB' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-gold-light)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
                      OM
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: '#F9FAFB', borderRadius: '100px', padding: '8px 14px', border: '1px solid #E5E7EB' }}>
                      <input
                        type="text"
                        placeholder="Ajouter un commentaire…"
                        value={newComment[pub.id] || ''}
                        onChange={e => setNewComment(p => ({ ...p, [pub.id]: e.target.value }))}
                        style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#111827' }}
                      />
                      <button style={{ fontSize: '16px', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>😊</button>
                      {newComment[pub.id] && (
                        <button onClick={() => setNewComment(p => ({ ...p, [pub.id]: '' }))}
                          style={{ fontSize: '13px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                          Publier
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tri */}
                  <div style={{ padding: '10px 20px 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280' }}>Les plus pertinents</span>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>▾</span>
                  </div>

                  {/* Liste */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {pub.comments.map((c, ci) => {
                      const cKey   = `${pub.id}-${c.id}`
                      const cLiked = !!commentLikes[cKey]
                      return (
                        <div key={c.id} style={{ padding: '12px 20px', display: 'flex', gap: '10px', borderBottom: ci < pub.comments.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                            {c.initials}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ background: '#F9FAFB', borderRadius: '0 12px 12px 12px', padding: '10px 14px', marginBottom: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{c.nom}</span>
                                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.temps}</span>
                              </div>
                              <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>{c.role}</div>
                              <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{c.texte}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '4px' }}>
                              <button onClick={() => toggleCommentLike(cKey)}
                                style={{ fontSize: '12px', fontWeight: 600, color: cLiked ? 'var(--color-danger)' : '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                                {cLiked ? '♥' : '👍'} {cLiked ? 2 : 1}
                              </button>
                              <button style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                Répondre
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {pub.comments.length > 0 && (
                    <div style={{ padding: '12px 20px 16px', textAlign: 'center' }}>
                      <button style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Voir tous les commentaires ({pub.commentaires})
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          )
        })}
      </div>

    </div>
  )
}

export default FeedPage
