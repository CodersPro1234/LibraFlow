import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// ── Static data ───────────────────────────────────────────────────────────────
const documents = {
  1: {
    id: 1,
    univLogo: 'UJK', univColor: 'var(--color-primary)',
    universite: 'Université Joseph Ki-Zerbo',
    auteur: 'Prof. Ouédraogo Mamadou', auteurId: 1,
    date: '18 Mai 2026',
    titre: 'Droit Constitutionnel — Cours magistral Chapitre 4',
    matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours',
    score: 94, likes: 24, vues: 412,
    scoreDetails: [
      { label: 'Pertinence', val: 96, inverse: false },
      { label: 'Plagiat',    val: 0,  inverse: true  },
      { label: 'Clarté',    val: 88, inverse: false },
    ],
    contenu: `Le droit constitutionnel est la branche du droit public qui étudie l'organisation et le fonctionnement du pouvoir politique au sein de l'État.

I. LA NOTION DE CONSTITUTION

La Constitution peut être définie comme l'ensemble des règles juridiques fondamentales qui déterminent l'organisation de l'État, les relations entre les différents organes du pouvoir et les droits fondamentaux des citoyens.

On distingue traditionnellement deux sens du mot constitution :

— Au sens matériel : la constitution désigne l'ensemble des règles relatives à l'organisation et au fonctionnement de l'État, quelle que soit leur forme (loi ordinaire, coutume, etc.).

— Au sens formel : la constitution désigne le document écrit, élaboré selon une procédure spéciale et solennelle, qui se distingue des lois ordinaires par sa valeur juridique supérieure.

II. LA SUPRÉMATIE DE LA CONSTITUTION

La constitution occupe le sommet de la hiérarchie des normes. Toutes les lois et règlements doivent être conformes à ses dispositions. Cette suprématie est garantie par un contrôle de constitutionnalité exercé, au Burkina Faso, par le Conseil Constitutionnel.

III. LA RÉVISION CONSTITUTIONNELLE

La révision de la Constitution obéit à des règles particulières, plus contraignantes que celles applicables aux lois ordinaires. Cette rigidité constitutionnelle a pour but de protéger les dispositions fondamentales contre des modifications trop fréquentes ou abusives.

Au Burkina Faso, la révision constitutionnelle nécessite une majorité qualifiée du Parlement ou peut être soumise à référendum selon la nature des modifications envisagées.

IV. CONCLUSION

La constitution est donc le texte fondateur de tout État de droit. Sa connaissance et son respect sont indispensables à tout juriste en formation.`,
  },
  2: {
    id: 2,
    univLogo: 'USTA', univColor: '#378ADD',
    universite: 'USTA Bobo-Dioulasso',
    auteur: 'Prof. Traoré Fatoumata', auteurId: 2,
    date: '15 Mai 2026',
    titre: 'Annales Mathématiques — Session 2024/2025',
    matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales',
    score: 88, likes: 41, vues: 389,
    scoreDetails: [
      { label: 'Pertinence', val: 90, inverse: false },
      { label: 'Plagiat',    val: 0,  inverse: true  },
      { label: 'Clarté',    val: 85, inverse: false },
    ],
    contenu: `UNIVERSITÉ DE USTA BOBO-DIOULASSO
Faculté des Sciences et Techniques
Annales de Mathématiques — Licence 3
Session 2024/2025

EXERCICE 1 — Algèbre linéaire (6 points)

Soit E un espace vectoriel de dimension finie n sur ℝ et f un endomorphisme de E.

1. Rappeler la définition de la diagonalisabilité d'un endomorphisme.
2. Montrer que si f est diagonalisable, alors f² l'est aussi.
3. La réciproque est-elle vraie ? Justifier.

EXERCICE 2 — Analyse (7 points)

Soit la suite (uₙ) définie par u₀ = 1 et uₙ₊₁ = (uₙ + 2/uₙ) / 2.

1. Montrer que la suite est bien définie pour tout n ≥ 0.
2. Étudier la monotonie de la suite à partir du rang 1.
3. Montrer que la suite converge et déterminer sa limite.

EXERCICE 3 — Probabilités (7 points)

Une urne contient 4 boules blanches et 6 boules noires. On tire successivement et sans remise 3 boules.

1. Calculer la probabilité d'obtenir exactement 2 boules blanches.
2. Sachant qu'au moins une boule blanche a été tirée, quelle est la probabilité d'en avoir exactement 2 ?

BARÈME : /20 points | Durée : 3h | Documents autorisés : aucun`,
  },
  3: {
    id: 3,
    univLogo: 'ISGE', univColor: 'var(--color-gold)',
    universite: 'ISGE-BF Ouagadougou',
    auteur: 'Prof. Zongo Issa', auteurId: 3,
    date: '10 Mai 2026',
    titre: "TD Finance d'entreprise — Exercices corrigés S2",
    matiere: 'Finance', niveau: 'Master 1', type: 'TD',
    score: 71, likes: 19, vues: 187,
    scoreDetails: [
      { label: 'Pertinence', val: 75, inverse: false },
      { label: 'Plagiat',    val: 5,  inverse: true  },
      { label: 'Clarté',    val: 72, inverse: false },
    ],
    contenu: `TD N°3 — Finance d'entreprise
Master 1 Finance — Semestre 2

THÈME : L'ANALYSE DE LA RENTABILITÉ

Exercice 1 : Calcul du seuil de rentabilité

Une entreprise produit et vend un seul produit au prix de vente de 5 000 FCFA l'unité.
Les charges fixes annuelles s'élèvent à 12 000 000 FCFA.
Les charges variables unitaires sont de 3 000 FCFA.

Travail à faire :
1. Calculer la marge sur coût variable unitaire.
2. Calculer le taux de marge sur coût variable.
3. Déterminer le seuil de rentabilité en valeur et en quantité.
4. Déterminer la date d'atteinte du seuil si le CA est régulièrement réparti.

CORRIGÉ :

1. MSCV unitaire = PV – CV unitaires = 5 000 – 3 000 = 2 000 FCFA

2. Taux de MSCV = MSCV / PV = 2 000 / 5 000 = 40%

3. Seuil de rentabilité :
   — En valeur : SR = CF / Taux MSCV = 12 000 000 / 0,40 = 30 000 000 FCFA
   — En quantité : SR = CF / MSCV unitaire = 12 000 000 / 2 000 = 6 000 unités

4. Date d'atteinte : (30 000 000 / CA annuel) × 12 mois`,
  },
}

const initialCommentaires = [
  { id: 1, auteur: 'Aminata D.', initiales: 'AD', temps: 'il y a 2h', texte: 'Excellent cours, très bien structuré ! Les explications sur la suprématie constitutionnelle sont très claires.' },
  { id: 2, auteur: 'Ibrahim T.',  initiales: 'IT', temps: 'hier',       texte: "Merci professeur. Est-ce qu'il y a un corrigé des exercices pratiques du chapitre 3 ?" },
  { id: 3, auteur: 'Mariam O.',  initiales: 'MO', temps: 'il y a 3 jours', texte: 'Je vais utiliser ce cours pour préparer mon examen de la semaine prochaine. Très utile !' },
]

// ── Renders document text with styled sections ────────────────────────────────
const DocContent = ({ text }) => {
  const lines = text.split('\n')
  const isSection = (l) => /^(I{1,3}V?|VI{0,3}|IV|V|[IVX]+)\.\s+[A-ZÀÂÉÈÊ]/.test(l.trim()) || /^[A-ZÀÂÉÈÊËÙÛÜ\s]{10,}$/.test(l.trim())

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', lineHeight: 1.85, color: '#1a1a2e' }}>
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} style={{ height: '12px' }} />
        if (isSection(trimmed)) {
          return (
            <div key={i} style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', fontFamily: "'Inter',sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px', marginBottom: '10px', paddingBottom: '6px', borderBottom: '2px solid var(--color-primary-light)' }}>
              {trimmed}
            </div>
          )
        }
        if (trimmed.startsWith('—') || trimmed.startsWith('-')) {
          return (
            <div key={i} style={{ paddingLeft: '20px', borderLeft: '3px solid var(--color-primary-light)', marginBottom: '8px', color: '#374151', fontSize: '14px', lineHeight: 1.75 }}>
              {trimmed}
            </div>
          )
        }
        if (/^\d+\./.test(trimmed)) {
          return (
            <div key={i} style={{ paddingLeft: '16px', marginBottom: '6px', fontSize: '14px', color: '#374151', lineHeight: 1.7, display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0, fontFamily: "'Inter',sans-serif", fontSize: '13px' }}>
                {trimmed.match(/^\d+\./)[0]}
              </span>
              <span>{trimmed.replace(/^\d+\.\s*/, '')}</span>
            </div>
          )
        }
        return (
          <p key={i} style={{ marginBottom: '10px', color: '#374151', fontSize: '14.5px', lineHeight: 1.85 }}>
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }

const LecturePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const doc = documents[id] || documents[1]

  const [liked,       setLiked]       = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [commentaires, setCommentaires] = useState(initialCommentaires)
  const [newComment,  setNewComment]  = useState('')
  const [ttsState,    setTtsState]    = useState('idle')
  const [downloaded,  setDownloaded]  = useState(false)
  const [shared,      setShared]      = useState(false)
  const [commentLikes, setCommentLikes] = useState({})
  const utteranceRef = useRef(null)

  useEffect(() => { return () => window.speechSynthesis?.cancel() }, [])

  const handleTTS = () => {
    if (!window.speechSynthesis) return
    if (ttsState === 'playing') { window.speechSynthesis.pause(); setTtsState('paused'); return }
    if (ttsState === 'paused')  { window.speechSynthesis.resume(); setTtsState('playing'); return }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(doc.titre + '. ' + doc.contenu)
    utter.lang = 'fr-FR'; utter.rate = 0.92
    utter.onend = () => setTtsState('idle')
    utter.onerror = () => setTtsState('idle')
    utteranceRef.current = utter
    window.speechSynthesis.speak(utter)
    setTtsState('playing')
  }
  const stopTTS = () => { window.speechSynthesis?.cancel(); setTtsState('idle') }

  const handleDownload = () => { setDownloaded(true); setTimeout(() => setDownloaded(false), 2500) }
  const handleShare    = () => { navigator.clipboard?.writeText(window.location.href).catch(() => {}); setShared(true); setTimeout(() => setShared(false), 2000) }

  const envoyerCommentaire = () => {
    if (!newComment.trim()) return
    setCommentaires(prev => [{ id: Date.now(), auteur: 'Salif Kaboré', initiales: 'SK', temps: "à l'instant", texte: newComment.trim() }, ...prev])
    setNewComment('')
  }

  const toggleCommentLike = (cid) => setCommentLikes(prev => ({ ...prev, [cid]: !prev[cid] }))

  const scoreConfig = doc.score >= 80
    ? { color: 'var(--color-success)', bg: 'var(--color-success-light)', label: 'Excellent' }
    : doc.score >= 65
    ? { color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    label: 'Correct' }
    : { color: 'var(--color-danger)',  bg: '#FEE2E2',                    label: 'Faible' }

  const pills = [
    { val: doc.matiere, bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
    { val: doc.niveau,  bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
    { val: doc.type,    bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => navigate(-1)}
          style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Retour
        </button>
        <span style={{ fontSize: '13px', color: '#9CA3AF' }}>Fil d'actualité</span>
        <span style={{ fontSize: '13px', color: '#D1D5DB' }}>›</span>
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>Lecture</span>
      </div>

      {/* ── Header document ── */}
      <div style={{ ...card, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          {/* Logo université */}
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: doc.univColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0, letterSpacing: '-0.5px' }}>
            {doc.univLogo}
          </div>

          {/* Meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '5px' }}>
              {doc.universite} · {doc.date}
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#111827', marginBottom: '10px', lineHeight: 1.35 }}>
              {doc.titre}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <button onClick={() => navigate(`/etudiant/professeur/${doc.auteurId}`)}
                style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {doc.auteur}
              </button>
              <span style={{ color: '#D1D5DB' }}>·</span>
              {pills.map((p, i) => (
                <span key={i} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: p.bg, color: p.color }}>
                  {p.val}
                </span>
              ))}
            </div>
            {/* Stats row */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { icon: '👁', val: `${doc.vues} vues` },
                { icon: '♥', val: `${liked ? doc.likes + 1 : doc.likes} likes` },
                { icon: '💬', val: `${commentaires.length} commentaires` },
              ].map((s, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{s.icon}</span>
                  <span>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score IA — coin haut droit */}
          <div style={{ flexShrink: 0, textAlign: 'center', padding: '14px 18px', borderRadius: '14px', background: scoreConfig.bg }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: scoreConfig.color, lineHeight: 1 }}>{doc.score}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: scoreConfig.color, marginTop: '3px' }}>Score IA</div>
            <div style={{ fontSize: '11px', color: scoreConfig.color, opacity: 0.8, marginTop: '2px' }}>{scoreConfig.label}</div>
          </div>
        </div>
      </div>

      {/* ── Main layout: viewer | sidebar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '18px', alignItems: 'start' }}>

        {/* ── Left: viewer + comments ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Document viewer */}
          <div style={{ ...card, overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #F3F4F6', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>📄 Visionneuse intégrée</span>
                {ttsState !== 'idle' && (
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '100px', fontWeight: 600, color: '#fff', background: 'var(--color-primary)', animation: 'pulse 1.5s infinite' }}>
                    🔊 Lecture en cours
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-danger)' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-gold)' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-success)' }} />
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '28px 36px', overflowY: 'auto', maxHeight: '480px' }}>
              <DocContent text={doc.contenu} />
            </div>
          </div>

          {/* Comments section */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '18px' }}>
              💬 Commentaires ({commentaires.length})
            </div>

            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                SK
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Laisser un commentaire…"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && envoyerCommentaire()}
                  style={{ width: '100%', padding: '10px 60px 10px 16px', borderRadius: '100px', border: '1.5px solid #E5E7EB', fontSize: '13px', color: '#111827', outline: 'none', boxSizing: 'border-box', background: '#F9FAFB' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                {newComment.trim() && (
                  <button onClick={envoyerCommentaire}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', padding: '5px 12px', borderRadius: '100px', background: 'var(--color-primary)', color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Publier
                  </button>
                )}
              </div>
            </div>

            {/* Sort label */}
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Les plus pertinents <span style={{ fontSize: '10px' }}>▾</span>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {commentaires.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: '10px', padding: '10px 0' }}>
                  {/* Avatar */}
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>
                    {c.initiales}
                  </div>
                  <div style={{ flex: 1 }}>
                    {/* Bubble */}
                    <div style={{ background: '#F9FAFB', borderRadius: '0 12px 12px 12px', padding: '10px 14px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{c.auteur}</span>
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.temps}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.65, margin: 0 }}>{c.texte}</p>
                    </div>
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '16px', paddingLeft: '4px' }}>
                      <button onClick={() => toggleCommentLike(c.id)}
                        style={{ fontSize: '12px', fontWeight: 600, color: commentLikes[c.id] ? 'var(--color-primary)' : '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        👍 {commentLikes[c.id] ? 'Aimé' : 'J\'aime'}
                      </button>
                      <button style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Répondre
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Score de fiabilité */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
              🤖 Score de fiabilité
            </div>
            {/* Big score */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '10px' }}>
              <span style={{ fontSize: '38px', fontWeight: 900, color: scoreConfig.color, lineHeight: 1 }}>{doc.score}</span>
              <span style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>/100</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: '6px', borderRadius: '100px', background: '#F3F4F6', marginBottom: '14px', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '100px', background: scoreConfig.color, width: `${doc.score}%`, transition: 'width 0.8s ease' }} />
            </div>
            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {doc.scoreDetails.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: item.inverse ? (item.val === 0 ? 'var(--color-success)' : 'var(--color-danger)') : '#111827' }}>
                    {item.inverse ? (item.val === 0 ? 'Aucun' : `${item.val}%`) : `${item.val}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* IA Text-to-Speech */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              🔊 IA Text-to-Speech
            </div>
            <button onClick={handleTTS}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px', transition: 'opacity 0.2s',
                background: ttsState === 'playing' ? 'var(--color-gold)' : 'var(--color-primary)',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              {ttsState === 'idle' && '▶  Écouter'}
              {ttsState === 'playing' && '⏸  Pause'}
              {ttsState === 'paused' && '▶  Reprendre'}
            </button>
            {ttsState !== 'idle' && (
              <button onClick={stopTTS}
                style={{ width: '100%', padding: '9px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', fontSize: '12px', fontWeight: 600, color: '#6B7280', cursor: 'pointer', marginBottom: '8px' }}>
                ⏹  Arrêter
              </button>
            )}
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0, lineHeight: 1.5 }}>
              L'IA lit le document à voix haute en français.
            </p>
          </div>

          {/* Actions */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
              Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Liker */}
              <button onClick={() => setLiked(l => !l)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  border: liked ? '1.5px solid var(--color-danger)' : '1.5px solid #E5E7EB',
                  background: liked ? '#FEE2E2' : '#fff',
                  color: liked ? 'var(--color-danger)' : '#6B7280',
                }}>
                {liked ? '♥  Aimé' : '♡  Liker'}
              </button>

              {/* Enregistrer */}
              <button onClick={() => setSaved(s => !s)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  border: saved ? '1.5px solid var(--color-primary)' : '1.5px solid #E5E7EB',
                  background: saved ? 'var(--color-primary-light)' : '#fff',
                  color: saved ? 'var(--color-primary)' : '#6B7280',
                }}>
                {saved ? '🔖  Enregistré' : '🔖  Enregistrer'}
              </button>

              {/* Télécharger */}
              <button onClick={handleDownload}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.15s', color: '#fff',
                  background: downloaded ? 'var(--color-success)' : 'var(--color-primary)',
                }}>
                {downloaded ? '✓  Téléchargé' : '⬇  Télécharger'}
              </button>

              {/* Partager */}
              <button onClick={handleShare}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  border: '1.5px solid #E5E7EB', background: '#fff',
                  color: shared ? 'var(--color-success)' : '#6B7280',
                }}>
                {shared ? '✓  Lien copié' : '🔗  Partager'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LecturePage
