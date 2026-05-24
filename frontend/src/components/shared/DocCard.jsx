import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Auto-generates 3 slides from basic doc info when no slides array is provided
const makeSlides = (doc) => [
  {
    label: `${doc.matiere} · ${doc.niveau}`,
    title: doc.titre,
    sub: `${doc.auteur || 'Auteur'}  ·  ${doc.universite || ''}`,
  },
  {
    label: 'Détails du document',
    title: `Type : ${doc.type}\nNiveau : ${doc.niveau}\nMatière : ${doc.matiere}`,
    sub: doc.universite || '',
  },
  {
    label: 'Score de fiabilité IA',
    title: `${doc.score}/100 — Contenu validé automatiquement\nPertinence · Originalité · Clarté pédagogique`,
    sub: '✓ Document certifié LibraFlow',
  },
]

const scoreStyle = (s) => s >= 80
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : s >= 65
  ? { bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' }
  : { bg: '#FEE2E2',                    color: 'var(--color-danger)' }

const TAG = {
  matiere: { background: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  niveau:  { background: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  type:    { background: 'var(--color-success-light)', color: 'var(--color-success)' },
}

/**
 * DocCard — feed-style document card with carousel
 *
 * Props:
 *   doc          {object}  document data (required)
 *   meta         {string}  text displayed after auteur (date, temps, taille…)
 *   showOffline  {bool}    show "Offline" badge
 *   actions      {JSX}     replaces default action bar; if null → default (Lire + ⬇ + ♡)
 *   extraContent {JSX}     inserted between carousel and action bar (e.g. stats grid)
 *   hideHeader   {bool}    hide the university / auteur header row
 */
const DocCard = ({ doc, meta, showOffline, actions, extraContent, hideHeader }) => {
  const navigate   = useNavigate()
  const [liked,    setLiked]    = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)
  const [shared,   setShared]   = useState(false)

  const slides = doc.slides || makeSlides(doc)
  const total  = slides.length
  const slide  = slides[slideIdx]
  const sc     = scoreStyle(doc.score)

  const goNext = () => setSlideIdx(i => Math.min(i + 1, total - 1))
  const goPrev = () => setSlideIdx(i => Math.max(i - 1, 0))

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {})
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const defaultActions = (
    <>
      <button onClick={() => navigate(`/etudiant/lecture/${doc.id}`)}
        style={{ padding: '9px 18px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        📖 Lire
      </button>
      <button style={{ padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
        ⬇ Télécharger
      </button>
      <div style={{ flex: 1 }} />
      <button onClick={() => setLiked(l => !l)}
        style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
          border: liked ? '1.5px solid var(--color-danger)' : '1.5px solid #E5E7EB',
          background: liked ? '#FEE2E2' : '#fff',
          color: liked ? 'var(--color-danger)' : '#9CA3AF',
        }}>
        {liked ? '♥' : '♡'} {liked ? (doc.likes || 0) + 1 : (doc.likes || 0)}
      </button>
      <button onClick={handleShare}
        style={{ padding: '8px 12px', borderRadius: '10px', border: `1.5px solid ${shared ? 'var(--color-success)' : '#E5E7EB'}`, background: '#fff', color: shared ? 'var(--color-success)' : '#9CA3AF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
        {shared ? '✓' : '🔗'}
      </button>
    </>
  )

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Bande couleur université */}
      <div style={{ height: '4px', background: doc.univColor || 'var(--color-primary)' }} />

      <div style={{ padding: '16px 20px 0' }}>

        {/* Header : mode prof (avatar initiales) ou mode université (logo carré) */}
        {!hideHeader && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>

            {doc.profInitials ? (
              /* Avatar enseignant — cercle coloré avec initiales */
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: doc.profColor || 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: `0 2px 8px ${doc.profColor || 'var(--color-primary)'}44` }}>
                {doc.profInitials}
              </div>
            ) : (
              /* Logo université — carré arrondi */
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: doc.univColor || 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {doc.univLogo || '📄'}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.profInitials ? (doc.auteur || 'Professeur') : (doc.universite || 'Université')}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {doc.profInitials ? (
                  /* Secondaire en mode prof : université · date */
                  <>
                    {doc.universite && <span>{doc.universite}</span>}
                    {doc.universite && meta && <span>·</span>}
                    {meta && <span>{meta}</span>}
                  </>
                ) : (
                  /* Secondaire en mode université : auteur · date */
                  <>
                    {doc.auteur && <span>{doc.auteur}</span>}
                    {doc.auteur && meta && <span>·</span>}
                    {meta && <span>{meta}</span>}
                  </>
                )}
                {showOffline && (
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '1px 8px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                    Offline
                  </span>
                )}
              </div>
            </div>

            <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', background: sc.bg, color: sc.color, flexShrink: 0 }}>
              IA {doc.score}
            </span>
          </div>
        )}

        {/* Titre */}
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', lineHeight: 1.35, marginBottom: '10px', letterSpacing: '-0.2px' }}>
          {doc.titre}
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {[['matiere', doc.matiere], ['niveau', doc.niveau], ['type', doc.type]].map(([k, v]) => (
            <span key={k} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', ...TAG[k] }}>
              {v}
            </span>
          ))}
          {doc.taille && (
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#F3F4F6', color: '#6B7280' }}>
              {doc.taille}
            </span>
          )}
        </div>
      </div>

      {/* ── Carousel document ── */}
      <div style={{ position: 'relative', margin: '0 20px 16px', borderRadius: '14px', background: '#0d1f3c', overflow: 'hidden' }}>
        {/* Badge total pages */}
        <div style={{ position: 'absolute', top: '12px', right: '14px', zIndex: 2, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
          {total} pages
        </div>

        {/* Contenu slide */}
        <div style={{ padding: '28px 56px', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
            {slide.label}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.55, marginBottom: '14px', whiteSpace: 'pre-line' }}>
            {slide.title}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
            {slide.sub}
          </div>
        </div>

        {/* Flèche gauche */}
        {slideIdx > 0 && (
          <button onClick={goPrev}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            ‹
          </button>
        )}
        {/* Flèche droite */}
        {slideIdx < total - 1 && (
          <button onClick={goNext}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            ›
          </button>
        )}

        {/* Barre de progression */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px 14px', background: 'rgba(0,0,0,0.25)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', minWidth: '36px' }}>
            {slideIdx + 1}/{total}
          </span>
          <div style={{ flex: 1, display: 'flex', gap: '3px' }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)}
                style={{ flex: 1, height: '3px', borderRadius: '100px', border: 'none', cursor: 'pointer', padding: 0,
                  background: i === slideIdx ? '#fff' : 'rgba(255,255,255,0.25)',
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* Contenu extra (stats grid, etc.) */}
      {extraContent && (
        <div style={{ padding: '0 20px 14px' }}>
          {extraContent}
        </div>
      )}

      {/* Barre d'actions */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {actions !== undefined ? actions : defaultActions}
      </div>

    </div>
  )
}

export default DocCard
