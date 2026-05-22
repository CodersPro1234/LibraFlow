import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DocCard from '../../components/shared/DocCard'

// ── Static data ───────────────────────────────────────────────────────────────
const professeurs = {
  1: {
    id: 1,
    initiales: 'OM', color: '#3B7FE1',
    nom: 'Ouédraogo Mamadou',
    universite: 'Université Joseph Ki-Zerbo',
    univLogo: 'UJK', univColor: '#3B7FE1',
    grade: 'Maître de conférences',
    matieres: ['Droit Constitutionnel', 'Droit Civil', 'Droit Public'],
    abonnes: 87, vues: 1247, docs: 12,
    bio: "Maître de conférences en Droit public à l'Université Joseph Ki-Zerbo depuis 2018. Spécialisé en droit constitutionnel comparé et en droits fondamentaux. Auteur de plusieurs publications académiques sur la gouvernance constitutionnelle au Burkina Faso.",
    publications: [
      { id: 1, titre: 'Droit Constitutionnel — Cours magistral Chapitre 4', type: 'Cours',    matiere: 'Droit Constitutionnel', niveau: 'Licence 2', score: 94, vues: 412, likes: 24, date: '18 Mai 2026' },
      { id: 2, titre: 'Droit Civil — Introduction générale',                 type: 'Cours',    matiere: 'Droit Civil',           niveau: 'Licence 1', score: 87, vues: 289, likes: 18, date: '12 Mai 2026' },
      { id: 3, titre: 'Annales Droit Constitutionnel 2023',                  type: 'Annales',  matiere: 'Droit Constitutionnel', niveau: 'Licence 2', score: 71, vues: 546, likes: 41, date: '05 Mai 2026' },
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
    bio: "Professeur titulaire en Mathématiques à l'USTA de Bobo-Dioulasso. Docteure en mathématiques pures de l'Université de Ouagadougou. Ses cours d'algèbre et d'analyse sont parmi les plus consultés de la plateforme.",
    publications: [
      { id: 2, titre: 'Annales Mathématiques — Session 2024/2025', type: 'Annales', matiere: 'Mathématiques', niveau: 'Licence 3', score: 88, vues: 389, likes: 41, date: '15 Mai 2026' },
      { id: 4, titre: 'Algèbre Linéaire — Introduction',           type: 'Cours',   matiere: 'Algèbre',       niveau: 'Licence 1', score: 92, vues: 301, likes: 28, date: '08 Mai 2026' },
    ],
  },
  3: {
    id: 3,
    initiales: 'ZI', color: '#f59e0b',
    nom: 'Zongo Issa',
    universite: 'ISGE-BF Ouagadougou',
    univLogo: 'ISGE', univColor: '#f59e0b',
    grade: 'Maître-assistant',
    matieres: ['Finance', 'Comptabilité', 'Gestion'],
    abonnes: 41, vues: 612, docs: 11,
    bio: "Maître-assistant en Finance à l'ISGE-BF. Spécialiste en finance d'entreprise et gestion des risques. Avant de rejoindre l'enseignement supérieur, a exercé pendant 5 ans comme auditeur financier dans des entreprises du secteur privé burkinabè.",
    publications: [
      { id: 3, titre: "TD Finance d'entreprise — Exercices corrigés S2", type: 'TD',    matiere: 'Finance',       niveau: 'Master 1',  score: 71, vues: 187, likes: 19, date: '10 Mai 2026' },
      { id: 5, titre: 'Introduction à la Comptabilité Générale',          type: 'Cours', matiere: 'Comptabilité',  niveau: 'Licence 1', score: 83, vues: 245, likes: 22, date: '03 Mai 2026' },
    ],
  },
}

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }

const ProfesseurProfilPage = () => {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const prof       = professeurs[id] || professeurs[1]

  const [suivi, setSuivi]   = useState(false)
  const [likes, setLikes]   = useState({})

  const toggleLike = (docId) => setLikes(prev => ({ ...prev, [docId]: !prev[docId] }))

  // Hex → rgba helper for banner gradient
  const bannerGradient = `linear-gradient(135deg, ${prof.color}dd 0%, ${prof.color}88 100%)`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* ── Retour ── */}
      <button onClick={() => navigate(-1)}
        style={{ alignSelf: 'flex-start', fontSize: '13px', padding: '6px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ← Retour
      </button>

      {/* ── Carte profil ── */}
      <div style={{ ...card, overflow: 'hidden' }}>

        {/* Banner */}
        <div style={{ height: '110px', background: bannerGradient, position: 'relative' }}>
          {/* Dot pattern overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          {/* Bouton Suivre */}
          <div style={{ position: 'absolute', top: '16px', right: '20px' }}>
            <button onClick={() => setSuivi(s => !s)}
              style={{ padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                background: suivi ? '#fff' : '#fff',
                color: suivi ? 'var(--color-success)' : prof.color,
                border: suivi ? '1.5px solid var(--color-success)' : 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>
              {suivi ? '✓ Suivi' : '+ Suivre'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 24px 24px' }}>
          {/* Avatar — chevauchement banner */}
          <div style={{ marginTop: '-36px', marginBottom: '14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: prof.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: '#fff', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', flexShrink: 0 }}>
              {prof.initiales}
            </div>
          </div>

          {/* Nom + grade */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '4px' }}>{prof.nom}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>{prof.grade}</div>
            {/* Université */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: prof.univColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {prof.univLogo}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: prof.univColor }}>{prof.universite}</span>
            </div>
            {/* Matières */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {prof.matieres.map(m => (
                <span key={m} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          <p style={{ fontSize: '13.5px', lineHeight: 1.75, color: '#374151', padding: '14px 18px', borderRadius: '12px', background: '#F9FAFB', margin: '0 0 18px', border: '1px solid #F3F4F6' }}>
            {prof.bio}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { icon: '👥', val: suivi ? prof.abonnes + 1 : prof.abonnes, label: 'Abonnés',      color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
              { icon: '📄', val: prof.docs,                                label: 'Documents',    color: 'var(--color-gold)',    bg: 'var(--color-gold-light)' },
              { icon: '👁', val: prof.vues.toLocaleString('fr-FR'),        label: 'Vues totales', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '12px', background: s.bg }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>{s.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: s.color, opacity: 0.8, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Publications ── */}
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
          Documents publiés ({prof.publications.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {prof.publications.map(pub => {
            const enriched = {
              ...pub,
              univLogo:   prof.univLogo,
              univColor:  prof.univColor,
              universite: prof.universite,
              auteur:     prof.nom,
            }
            return (
              <DocCard key={pub.id} doc={enriched} meta={pub.date} />
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default ProfesseurProfilPage
