import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const publications = [
  {
    id: 1, univLogo: 'UJK', univColor: '#3B7FE1',
    universite: 'Université Joseph Ki-Zerbo',
    auteur: 'Prof. Ouédraogo Mamadou', temps: 'il y a 2h',
    titre: 'Droit Constitutionnel — Cours magistral Chapitre 4',
    matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours', score: 94, likes: 24, commentaires: 8,
    slides: [
      { label: 'Droit Constitutionnel · L2',      title: 'Chapitre 4 — Les libertés fondamentales',            sub: 'Prof. Ouédraogo Mamadou · UJK-Zerbo' },
      { label: 'Plan du chapitre',                 title: 'I. Définition des libertés\nII. La protection constitutionnelle\nIII. Les limites admises', sub: 'Partie théorique' },
      { label: 'I. Définition',                    title: 'Les libertés fondamentales désignent les droits inaliénables garantis à chaque citoyen par la Constitution.', sub: 'Page 3 · Définitions clés' },
      { label: 'II. Protection constitutionnelle', title: 'Le Conseil Constitutionnel veille au respect de ces droits. Toute loi contraire est déclarée inconstitutionnelle.', sub: 'Page 4 · Jurisprudence' },
      { label: 'Conclusion',                       title: "Les libertés fondamentales forment le socle de l'État de droit démocratique en Afrique contemporaine.", sub: 'Page 5 · Synthèse' },
    ],
    comments: [
      { id: 1, initials: 'DK', color: '#3B7FE1', nom: 'Diallo Karim',     role: 'Étudiant · Droit L2 · UJK-Zerbo',       temps: '1j', texte: 'Merci professeur, ce chapitre était très attendu ! La section sur les limites admises est particulièrement claire.' },
      { id: 2, initials: 'ST', color: '#f59e0b', nom: 'Sawadogo Tiguida', role: 'Étudiante · Économie L1 · UJK-Zerbo',    temps: '2j', texte: 'Excellent cours, très bien structuré. Est-ce que le chapitre 5 arrive bientôt ?' },
      { id: 3, initials: 'AP', color: '#10b981', nom: 'Alidou Pousga',    role: 'Étudiant · Biologie L1 · UJK-Zerbo',    temps: '3j', texte: 'Je prépare mon examen avec ce cours, très utile !' },
    ],
  },
  {
    id: 2, univLogo: 'USTA', univColor: '#378ADD',
    universite: 'USTA Bobo-Dioulasso',
    auteur: 'Prof. Traoré Fatoumata', temps: 'il y a 5h',
    titre: 'Annales Mathématiques — Session 2024/2025',
    matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, likes: 41, commentaires: 12,
    slides: [
      { label: 'Mathématiques · L3',  title: 'Annales — Session 2024/2025',                                                 sub: 'Prof. Traoré Fatoumata · USTA Bobo' },
      { label: 'Exercice 1',          title: 'Soit f(x) = x³ - 3x² + 2. Étudiez les variations de f et tracez sa courbe.', sub: 'Analyse — 5 points' },
      { label: 'Exercice 2',          title: "Calculez l'intégrale ∫₀¹ (x² + 2x - 1) dx en justifiant chaque étape.",      sub: 'Intégration — 4 points' },
      { label: 'Exercice 3',          title: 'Démontrez que la suite (uₙ) définie par uₙ₊₁ = ½(uₙ + 3) converge.',         sub: 'Suites — 6 points' },
    ],
    comments: [
      { id: 1, initials: 'MB', color: '#8b5cf6', nom: 'Millogo Blandine', role: 'Étudiante · Maths L3 · USTA Bobo',       temps: '5h', texte: "Enfin les annales 2025 ! L'exercice 3 sur les suites est vraiment bien posé." },
      { id: 2, initials: 'OK', color: '#ef4444', nom: 'Ouédraogo Kisito', role: 'Étudiant · Informatique L2 · UJK-Zerbo', temps: '8h', texte: "Est-ce qu'il y a un corrigé type disponible pour l'exercice 2 ?" },
    ],
  },
  {
    id: 3, univLogo: 'ISGE', univColor: '#f59e0b',
    universite: 'ISGE-BF Ouagadougou',
    auteur: 'Prof. Zongo Issa', temps: 'hier',
    titre: "TD Finance d'entreprise — Exercices corrigés S2",
    matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, likes: 19, commentaires: 5,
    slides: [
      { label: "Finance d'entreprise · M1", title: 'TD Corrigé — Séance 2',                                                                                           sub: 'Prof. Zongo Issa · ISGE-BF' },
      { label: 'Exercice 1 — Énoncé',       title: "Une entreprise emprunte 5 000 000 FCFA à 8% sur 5 ans. Calculez l'annuité constante de remboursement.",            sub: 'Mathématiques financières' },
      { label: 'Exercice 1 — Correction',   title: 'Annuité = K × i / (1 - (1+i)⁻ⁿ)\n= 5 000 000 × 0,08 / (1 - 1,08⁻⁵)\n≈ 1 252 282 FCFA',                         sub: 'Solution détaillée' },
      { label: 'Exercice 2',                title: "Calculez la VAN d'un projet nécessitant 2 M FCFA pour des flux annuels de 600 000 FCFA sur 5 ans à 10%.",          sub: 'VAN et TRI' },
    ],
    comments: [
      { id: 1, initials: 'FY', color: '#3B7FE1', nom: 'Fatima Yameogo',   role: 'Étudiante · Finance M1 · ISGE-BF',       temps: '1j', texte: 'Le corrigé de l\'exercice 1 est super clair. Merci Prof Zongo !' },
      { id: 2, initials: 'AK', color: '#10b981', nom: 'Amadou Kaboré',    role: 'Étudiant · Finance M1 · ISGE-BF',        temps: '1j', texte: 'Pour l\'exercice 2, j\'obtiens une VAN de 274 472 FCFA. Est-ce correct ?' },
      { id: 3, initials: 'RC', color: '#f59e0b', nom: 'Rose Compaoré',    role: 'Étudiante · Gestion M2 · ISGE-BF',       temps: '2j', texte: 'Ces TDs sont essentiels pour préparer la session. Très bien construit.' },
    ],
  },
]

const scoreStyle = (s) => s >= 75
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : { bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' }

const TAG_STYLES = {
  matiere: { background: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  niveau:  { background: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  type:    { background: 'var(--color-success-light)', color: 'var(--color-success)' },
}

const FeedPage = () => {
  const navigate = useNavigate()
  const [likes, setLikes]           = useState({})
  const [shared, setShared]         = useState({})
  const [slideIdx, setSlideIdx]     = useState({})
  const [openComments, setOpenComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [commentLikes, setCommentLikes] = useState({})

  const toggleLike  = (id) => setLikes(p => ({ ...p, [id]: !p[id] }))
  const handleShare = (id) => {
    setShared(p => ({ ...p, [id]: true }))
    setTimeout(() => setShared(p => ({ ...p, [id]: false })), 2000)
  }
  const getSlide    = (id)        => slideIdx[id] || 0
  const goNext      = (id, total) => setSlideIdx(p => ({ ...p, [id]: Math.min((p[id] || 0) + 1, total - 1) }))
  const goPrev      = (id)        => setSlideIdx(p => ({ ...p, [id]: Math.max((p[id] || 0) - 1, 0) }))
  const toggleComments = (id)     => setOpenComments(p => ({ ...p, [id]: !p[id] }))
  const toggleCommentLike = (key) => setCommentLikes(p => ({ ...p, [key]: !p[key] }))

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
        const sc      = scoreStyle(pub.score)
        const liked   = !!likes[pub.id]
        const idx     = getSlide(pub.id)
        const slide   = pub.slides[idx]
        const total   = pub.slides.length
        const showCom = !!openComments[pub.id]

        return (
          <div key={pub.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

            {/* Bande couleur université */}
            <div style={{ height: '4px', background: pub.univColor }} />

            <div style={{ padding: '18px 20px 0' }}>
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
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', lineHeight: 1.35, marginBottom: '10px', letterSpacing: '-0.2px' }}>
                {pub.titre}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {[['matiere', pub.matiere], ['niveau', pub.niveau], ['type', pub.type]].map(([k, v]) => (
                  <span key={k} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px', ...TAG_STYLES[k] }}>
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Carousel document */}
            <div style={{ position: 'relative', margin: '0 20px 16px', borderRadius: '14px', background: '#0d1f3c', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '12px', right: '14px', zIndex: 2, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                {total} pages
              </div>
              <div style={{ padding: '28px 56px', minHeight: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>{slide.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.55, marginBottom: '14px', whiteSpace: 'pre-line' }}>{slide.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{slide.sub}</div>
              </div>
              {idx > 0 && (
                <button onClick={() => goPrev(pub.id)}
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>‹</button>
              )}
              {idx < total - 1 && (
                <button onClick={() => goNext(pub.id, total)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>›</button>
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
            <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate(`/etudiant/lecture/${pub.id}`)}
                style={{ padding: '9px 18px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                📖 Lire
              </button>
              <button style={{ padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                ⬇ Télécharger
              </button>
              <div style={{ flex: 1 }} />
              <button onClick={() => toggleLike(pub.id)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${liked ? 'var(--color-danger)' : '#E5E7EB'}`, background: liked ? '#FEE2E2' : '#fff', color: liked ? 'var(--color-danger)' : '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                {liked ? '♥' : '♡'} {liked ? pub.likes + 1 : pub.likes}
              </button>
              <button onClick={() => toggleComments(pub.id)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${showCom ? 'var(--color-primary)' : '#E5E7EB'}`, background: showCom ? 'var(--color-primary-light)' : '#fff', color: showCom ? 'var(--color-primary)' : '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                💬 {pub.commentaires}
              </button>
              <button onClick={() => handleShare(pub.id)}
                style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${shared[pub.id] ? 'var(--color-success)' : '#E5E7EB'}`, background: '#fff', color: shared[pub.id] ? 'var(--color-success)' : '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                {shared[pub.id] ? '✓' : '🔗'}
              </button>
            </div>

            {/* ── Section commentaires ── */}
            {showCom && (
              <div style={{ borderTop: '1px solid #F3F4F6' }}>

                {/* Input nouveau commentaire */}
                <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #F9FAFB' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                    Moi
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
                      <button
                        onClick={() => setNewComment(p => ({ ...p, [pub.id]: '' }))}
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

                {/* Liste commentaires */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {pub.comments.map((c, ci) => {
                    const cKey  = `${pub.id}-${c.id}`
                    const cLiked = !!commentLikes[cKey]
                    return (
                      <div key={c.id} style={{ padding: '12px 20px', display: 'flex', gap: '10px', borderBottom: ci < pub.comments.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                        {/* Avatar */}
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                          {c.initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Bulle commentaire */}
                          <div style={{ background: '#F9FAFB', borderRadius: '0 12px 12px 12px', padding: '10px 14px', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{c.nom}</span>
                              <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.temps}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '6px' }}>{c.role}</div>
                            <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{c.texte}</div>
                          </div>
                          {/* Actions commentaire */}
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

                {/* Voir plus */}
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
  )
}

export default FeedPage
