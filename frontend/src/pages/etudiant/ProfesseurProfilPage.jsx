import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const professeurs = {
  1: {
    id: 1,
    initiales: 'OM', color: 'var(--color-primary)',
    nom: 'Ouédraogo Mamadou',
    universite: 'Université Joseph Ki-Zerbo',
    univLogo: 'UJK', univColor: 'var(--color-primary)',
    grade: 'Maître de conférences',
    matieres: ['Droit Constitutionnel', 'Droit Civil', 'Droit Public'],
    abonnes: 87, vues: 1247, docs: 12,
    bio: 'Maître de conférences en Droit public à l\'Université Joseph Ki-Zerbo depuis 2018. Spécialisé en droit constitutionnel comparé et en droits fondamentaux. Auteur de plusieurs publications académiques sur la gouvernance constitutionnelle au Burkina Faso.',
    publications: [
      { id: 1, titre: 'Droit Constitutionnel — Cours magistral Chapitre 4', type: 'Cours', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', score: 94, vues: 412, likes: 24, date: '18 Mai 2026' },
      { id: 2, titre: 'Droit Civil — Introduction générale', type: 'Cours', matiere: 'Droit Civil', niveau: 'Licence 1', score: 87, vues: 289, likes: 18, date: '12 Mai 2026' },
      { id: 3, titre: 'Annales Droit Constitutionnel 2023', type: 'Annales', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', score: 71, vues: 546, likes: 41, date: '05 Mai 2026' },
    ],
  },
  2: {
    id: 2,
    initiales: 'TF', color: '#378ADD',
    nom: 'Traoré Fatoumata',
    universite: 'USTA Bobo-Dioulasso',
    univLogo: 'USTA', univColor: '#378ADD',
    grade: 'Professeur titulaire',
    matieres: ['Mathématiques', 'Algèbre', 'Analyse'],
    abonnes: 54, vues: 890, docs: 18,
    bio: 'Professeur titulaire en Mathématiques à l\'USTA de Bobo-Dioulasso. Docteure en mathématiques pures de l\'Université de Ouagadougou. Ses cours d\'algèbre et d\'analyse sont parmi les plus consultés de la plateforme.',
    publications: [
      { id: 2, titre: 'Annales Mathématiques — Session 2024/2025', type: 'Annales', matiere: 'Mathématiques', niveau: 'Licence 3', score: 88, vues: 389, likes: 41, date: '15 Mai 2026' },
      { id: 4, titre: 'Algèbre Linéaire — Introduction', type: 'Cours', matiere: 'Algèbre', niveau: 'Licence 1', score: 92, vues: 301, likes: 28, date: '08 Mai 2026' },
    ],
  },
  3: {
    id: 3,
    initiales: 'ZI', color: 'var(--color-gold)',
    nom: 'Zongo Issa',
    universite: 'ISGE-BF Ouagadougou',
    univLogo: 'ISGE', univColor: 'var(--color-gold)',
    grade: 'Maître-assistant',
    matieres: ['Finance', 'Comptabilité', 'Gestion'],
    abonnes: 41, vues: 612, docs: 11,
    bio: 'Maître-assistant en Finance à l\'ISGE-BF. Spécialiste en finance d\'entreprise et gestion des risques. Avant de rejoindre l\'enseignement supérieur, a exercé pendant 5 ans comme auditeur financier dans des entreprises du secteur privé burkinabè.',
    publications: [
      { id: 3, titre: 'TD Finance d\'entreprise — Exercices corrigés S2', type: 'TD', matiere: 'Finance', niveau: 'Master 1', score: 71, vues: 187, likes: 19, date: '10 Mai 2026' },
      { id: 5, titre: 'Introduction à la Comptabilité Générale', type: 'Cours', matiere: 'Comptabilité', niveau: 'Licence 1', score: 83, vues: 245, likes: 22, date: '03 Mai 2026' },
    ],
  },
}

const ProfesseurProfilPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const prof = professeurs[id] || professeurs[1]

  const [suivi, setSuivi] = useState(false)
  const [likes, setLikes] = useState({})

  const toggleLike = (docId) => setLikes(prev => ({ ...prev, [docId]: !prev[docId] }))

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="self-start text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
        ← Retour
      </button>

      {/* Carte profil professeur */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: prof.color }}>
            {prof.initiales}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="text-base font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>{prof.nom}</div>
            <div className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>{prof.grade}</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: prof.univColor }}>
                {prof.univLogo}
              </div>
              <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{prof.universite}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {prof.matieres.map(m => (
                <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Bouton Suivre */}
          <button
            onClick={() => setSuivi(s => !s)}
            className="flex-shrink-0 text-xs px-4 py-2 rounded-lg font-semibold transition-all"
            style={{
              background: suivi ? 'var(--color-success-light)' : 'var(--color-primary)',
              color: suivi ? 'var(--color-success)' : '#fff',
              border: suivi ? '1px solid var(--color-success)' : 'none',
            }}>
            {suivi ? '✓ Suivi' : '+ Suivre'}
          </button>
        </div>

        {/* Bio */}
        <p className="text-xs leading-relaxed p-3 rounded-lg"
          style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
          {prof.bio}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Abonnés', value: suivi ? prof.abonnes + 1 : prof.abonnes, icon: '👥', color: 'var(--color-primary)' },
            { label: 'Documents', value: prof.docs, icon: '📄', color: 'var(--color-gold)' },
            { label: 'Vues totales', value: prof.vues.toLocaleString(), icon: '👁', color: 'var(--color-success)' },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'var(--color-bg)' }}>
              <div className="text-base mb-0.5">{s.icon}</div>
              <div className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Publications */}
      <div>
        <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
          Documents publiés ({prof.publications.length})
        </div>
        <div className="flex flex-col gap-3">
          {prof.publications.map(pub => {
            const scoreBg = pub.score >= 75 ? 'var(--color-success-light)' : 'var(--color-gold-light)'
            const scoreColor = pub.score >= 75 ? 'var(--color-success)' : 'var(--color-gold)'
            return (
              <div key={pub.id} className="bg-white rounded-xl border p-4"
                style={{ borderColor: 'var(--color-border)' }}>

                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate mb-1" style={{ color: 'var(--color-text)' }}>
                      {pub.titre}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { val: pub.matiere, bg: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' },
                        { val: pub.niveau, bg: 'var(--color-gold-light)', color: 'var(--color-gold)' },
                        { val: pub.type, bg: 'var(--color-success-light)', color: 'var(--color-success)' },
                      ].map((t, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: t.bg, color: t.color }}>{t.val}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                    style={{ background: scoreBg, color: scoreColor }}>
                    ✓ {pub.score}
                  </span>
                </div>

                {/* Stats + Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                    <span>👁 {pub.vues}</span>
                    <span>♥ {likes[pub.id] ? pub.likes + 1 : pub.likes}</span>
                    <span>{pub.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/etudiant/lecture/${pub.id}`)}
                      className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                      style={{ background: 'var(--color-primary)' }}>
                      📖 Lire
                    </button>
                    <button
                      onClick={() => toggleLike(pub.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
                      style={{
                        borderColor: likes[pub.id] ? 'var(--color-danger)' : 'var(--color-border)',
                        background: likes[pub.id] ? 'var(--color-danger-light)' : 'transparent',
                        color: likes[pub.id] ? 'var(--color-danger)' : 'var(--color-muted)',
                      }}>
                      {likes[pub.id] ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default ProfesseurProfilPage
