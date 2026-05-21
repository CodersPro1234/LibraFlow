import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const documents = {
  1: {
    id: 1,
    univLogo: 'UJK', univColor: 'var(--color-primary)',
    universite: 'Université Joseph Ki-Zerbo',
    auteur: 'Prof. Ouédraogo Mamadou',
    auteurId: 1,
    date: '18 Mai 2026',
    titre: 'Droit Constitutionnel — Cours magistral Chapitre 4',
    matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours',
    score: 94, likes: 24, vues: 412,
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
    auteur: 'Prof. Traoré Fatoumata',
    auteurId: 2,
    date: '15 Mai 2026',
    titre: 'Annales Mathématiques — Session 2024/2025',
    matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales',
    score: 88, likes: 41, vues: 389,
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
    auteur: 'Prof. Zongo Issa',
    auteurId: 3,
    date: '10 Mai 2026',
    titre: 'TD Finance d\'entreprise — Exercices corrigés S2',
    matiere: 'Finance', niveau: 'Master 1', type: 'TD',
    score: 71, likes: 19, vues: 187,
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
  { id: 2, auteur: 'Ibrahim T.', initiales: 'IT', temps: 'hier', texte: 'Merci professeur. Est-ce qu\'il y a un corrigé des exercices pratiques du chapitre 3 ?' },
  { id: 3, auteur: 'Mariam O.', initiales: 'MO', temps: 'il y a 3 jours', texte: 'Je vais utiliser ce cours pour préparer mon examen de la semaine prochaine. Très utile !' },
]

const LecturePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const doc = documents[id] || documents[1]

  const [liked, setLiked] = useState(false)
  const [commentaires, setCommentaires] = useState(initialCommentaires)
  const [newComment, setNewComment] = useState('')
  const [ttsState, setTtsState] = useState('idle') // idle | playing | paused
  const [downloaded, setDownloaded] = useState(false)
  const [shared, setShared] = useState(false)
  const utteranceRef = useRef(null)

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel() }
  }, [])

  const handleTTS = () => {
    if (!window.speechSynthesis) return

    if (ttsState === 'playing') {
      window.speechSynthesis.pause()
      setTtsState('paused')
      return
    }
    if (ttsState === 'paused') {
      window.speechSynthesis.resume()
      setTtsState('playing')
      return
    }

    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(doc.titre + '. ' + doc.contenu)
    utter.lang = 'fr-FR'
    utter.rate = 0.9
    utter.onend = () => setTtsState('idle')
    utter.onerror = () => setTtsState('idle')
    utteranceRef.current = utter
    window.speechSynthesis.speak(utter)
    setTtsState('playing')
  }

  const stopTTS = () => {
    window.speechSynthesis?.cancel()
    setTtsState('idle')
  }

  const handleDownload = () => {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2500)
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {})
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const envoyerCommentaire = () => {
    if (!newComment.trim()) return
    setCommentaires(prev => [{
      id: Date.now(),
      auteur: 'Salif Kaboré',
      initiales: 'SK',
      temps: 'à l\'instant',
      texte: newComment.trim(),
    }, ...prev])
    setNewComment('')
  }

  const scoreConfig = doc.score >= 80
    ? { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Excellent' }
    : doc.score >= 65
    ? { bg: 'var(--color-gold-light)', color: 'var(--color-gold)', label: 'Correct' }
    : { bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'Faible' }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">

      {/* Breadcrumb + Back */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
          ← Retour
        </button>
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
          Fil d'actualité › Lecture
        </span>
      </div>

      {/* Header document */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: doc.univColor }}>
            {doc.univLogo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>
              {doc.universite} · {doc.date}
            </div>
            <div className="text-base font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              {doc.titre}
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <button
                onClick={() => navigate(`/etudiant/professeur/${doc.auteurId}`)}
                className="text-xs font-medium hover:underline"
                style={{ color: 'var(--color-primary)' }}>
                {doc.auteur}
              </button>
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>·</span>
              {[
                { val: doc.matiere, bg: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' },
                { val: doc.niveau, bg: 'var(--color-gold-light)', color: 'var(--color-gold)' },
                { val: doc.type, bg: 'var(--color-success-light)', color: 'var(--color-success)' },
              ].map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: t.bg, color: t.color }}>{t.val}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-muted)' }}>
              <span>👁 {doc.vues} vues</span>
              <span>♥ {liked ? doc.likes + 1 : doc.likes} likes</span>
              <span>💬 {commentaires.length} commentaires</span>
            </div>
          </div>

          {/* Score IA */}
          <div className="flex-shrink-0 text-center p-3 rounded-xl"
            style={{ background: scoreConfig.bg }}>
            <div className="text-lg font-bold" style={{ color: scoreConfig.color }}>{doc.score}</div>
            <div className="text-xs font-medium" style={{ color: scoreConfig.color }}>Score IA</div>
            <div className="text-xs mt-0.5" style={{ color: scoreConfig.color }}>{scoreConfig.label}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Viewer */}
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            {/* Barre viewer */}
            <div className="px-4 py-2.5 border-b flex items-center justify-between"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>📄 Visionneuse intégrée</span>
                {ttsState !== 'idle' && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white animate-pulse"
                    style={{ background: 'var(--color-primary)' }}>
                    🔊 Lecture en cours
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-danger)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-gold)' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-success)' }} />
              </div>
            </div>
            {/* Contenu texte */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: '420px' }}>
              <pre className="text-sm leading-7 font-sans whitespace-pre-wrap"
                style={{ color: 'var(--color-text)' }}>
                {doc.contenu}
              </pre>
            </div>
          </div>

          {/* Section commentaires */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
              💬 Commentaires ({commentaires.length})
            </div>

            {/* Ajouter un commentaire */}
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                SK
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Laisser un commentaire…"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && envoyerCommentaire()}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
                <button
                  onClick={envoyerCommentaire}
                  disabled={!newComment.trim()}
                  className="text-xs px-3 py-2 rounded-lg font-medium text-white"
                  style={{
                    background: newComment.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                    cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                  }}>
                  Envoyer
                </button>
              </div>
            </div>

            {/* Liste commentaires */}
            <div className="flex flex-col gap-3">
              {commentaires.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                    {c.initiales}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{c.auteur}</span>
                      <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{c.temps}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>{c.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar actions */}
        <div className="w-44 flex flex-col gap-3 flex-shrink-0">

          {/* Text-to-Speech */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              🤖 IA Text-to-Speech
            </div>
            <button
              onClick={handleTTS}
              className="w-full text-xs py-2 rounded-lg font-medium text-white mb-1.5"
              style={{
                background: ttsState === 'playing' ? 'var(--color-gold)' : 'var(--color-primary)',
              }}>
              {ttsState === 'idle' && '▶ Écouter'}
              {ttsState === 'playing' && '⏸ Pause'}
              {ttsState === 'paused' && '▶ Reprendre'}
            </button>
            {ttsState !== 'idle' && (
              <button
                onClick={stopTTS}
                className="w-full text-xs py-1.5 rounded-lg border font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                ⏹ Arrêter
              </button>
            )}
            <p className="text-xs mt-1.5" style={{ color: 'var(--color-muted)' }}>
              L'IA lit le document à voix haute
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border p-3 flex flex-col gap-2"
            style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setLiked(l => !l)}
              className="w-full text-xs py-2 rounded-lg border font-medium transition-all"
              style={{
                borderColor: liked ? 'var(--color-danger)' : 'var(--color-border)',
                background: liked ? 'var(--color-danger-light)' : 'transparent',
                color: liked ? 'var(--color-danger)' : 'var(--color-muted)',
              }}>
              {liked ? '♥ Aimé' : '♡ Liker'}
            </button>

            <button
              onClick={handleDownload}
              className="w-full text-xs py-2 rounded-lg font-medium text-white"
              style={{ background: downloaded ? 'var(--color-success)' : 'var(--color-primary)' }}>
              {downloaded ? '✓ Téléchargé' : '⬇ Télécharger'}
            </button>

            <button
              onClick={handleShare}
              className="w-full text-xs py-2 rounded-lg border font-medium"
              style={{ borderColor: 'var(--color-border)', color: shared ? 'var(--color-success)' : 'var(--color-muted)' }}>
              {shared ? '✓ Lien copié' : '🔗 Partager'}
            </button>
          </div>

          {/* Info score */}
          <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              Score de fiabilité
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: scoreConfig.color }}>
              {doc.score}<span className="text-sm font-normal">/100</span>
            </div>
            <div className="h-1.5 rounded-full mb-2" style={{ background: 'var(--color-border)' }}>
              <div className="h-full rounded-full" style={{ width: `${doc.score}%`, background: scoreConfig.color }} />
            </div>
            <div className="flex flex-col gap-1">
              {[
                { label: 'Pertinence', val: 96 },
                { label: 'Plagiat', val: 0, inverse: true },
                { label: 'Clarté', val: 88 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--color-muted)' }}>{item.label}</span>
                  <span className="font-medium" style={{
                    color: item.inverse
                      ? (item.val === 0 ? 'var(--color-success)' : 'var(--color-danger)')
                      : 'var(--color-text)',
                  }}>
                    {item.inverse ? (item.val === 0 ? 'Aucun' : `${item.val}%`) : `${item.val}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LecturePage
