import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const universites = [
  {
    id: 1, logo: 'UJK', color: '#3B7FE1', nom: 'Université Joseph Ki-Zerbo',
    ville: 'Ouagadougou', region: 'Centre', fondee: 1974,
    etudiants: 4218, docs: 840, scoreIA: 88,
    description: "La plus grande université du Burkina Faso, formant des étudiants en droit, lettres, sciences humaines et exactes depuis 1974.",
    domaines: ['Droit', 'Lettres', 'Sciences', 'Médecine', 'Histoire'],
    profs: [
      { initials: 'OM', color: '#3B7FE1', name: 'Ouédraogo M.', matiere: 'Droit' },
      { initials: 'FY', color: '#8b5cf6', name: 'Fatima Y.',    matiere: 'Maths' },
      { initials: 'RC', color: '#10b981', name: 'Rose C.',      matiere: 'Biologie' },
    ],
    topDoc: { titre: 'Droit Constitutionnel — Chapitre 4', type: 'Cours', score: 94, vues: 412 },
  },
  {
    id: 2, logo: 'USTA', color: '#378ADD', nom: 'USTA Bobo-Dioulasso',
    ville: 'Bobo-Dioulasso', region: 'Hauts-Bassins', fondee: 1997,
    etudiants: 3120, docs: 512, scoreIA: 86,
    description: "Spécialisée en sciences exactes et appliquées, reconnue pour l'excellence de ses formations en mathématiques, physique et ingénierie.",
    domaines: ['Mathématiques', 'Physique', 'Chimie', 'Ingénierie'],
    profs: [
      { initials: 'TF', color: '#378ADD', name: 'Traoré F.',  matiere: 'Maths' },
      { initials: 'BS', color: '#ef4444', name: 'Barro S.',   matiere: 'Physique' },
    ],
    topDoc: { titre: 'Annales Mathématiques — Session 2024/2025', type: 'Annales', score: 88, vues: 389 },
  },
  {
    id: 3, logo: 'ISGE', color: '#f59e0b', nom: 'ISGE-BF Ouagadougou',
    ville: 'Ouagadougou', region: 'Centre', fondee: 2005,
    etudiants: 980, docs: 298, scoreIA: 79,
    description: "Institut supérieur formant des cadres en finance, comptabilité et management. Proche du monde de l'entreprise burkinabè.",
    domaines: ['Finance', 'Comptabilité', 'Gestion', 'Économie'],
    profs: [
      { initials: 'ZI', color: '#f59e0b', name: 'Zongo I.',   matiere: 'Finance' },
      { initials: 'AK', color: '#10b981', name: 'Amadou K.',  matiere: 'Économie' },
    ],
    topDoc: { titre: "TD Finance d'entreprise — Exercices S2", type: 'TD', score: 83, vues: 245 },
  },
  {
    id: 4, logo: 'UNZ', color: '#10b981', nom: 'Université Norbert Zongo',
    ville: 'Koudougou', region: 'Centre-Ouest', fondee: 2005,
    etudiants: 2140, docs: 387, scoreIA: 82,
    description: "Université dédiée aux sciences sociales, droit international et lettres. Acteur clé du développement académique en région Centre-Ouest.",
    domaines: ['Droit International', 'Sociologie', 'Lettres', 'Sciences Humaines'],
    profs: [
      { initials: 'SA', color: '#10b981', name: 'Sawadogo A.', matiere: 'Droit' },
      { initials: 'DN', color: '#8b5cf6', name: 'Diabré N.',   matiere: 'Socio.' },
    ],
    topDoc: { titre: 'Introduction à la Sociologie africaine', type: 'Cours', score: 85, vues: 211 },
  },
  {
    id: 5, logo: 'BIT', color: '#374151', nom: 'BIT Burkina',
    ville: 'Ouagadougou', region: 'Centre', fondee: 2010,
    etudiants: 1450, docs: 221, scoreIA: 90,
    description: "Premier établissement burkinabè spécialisé en informatique et technologies numériques. Pionnier de l'intégration de LibraFlow.",
    domaines: ['Informatique', 'Réseaux', 'Cybersécurité', 'IA'],
    profs: [
      { initials: 'KA', color: '#374151', name: 'Kaboré A.',       matiere: 'Info.' },
      { initials: 'OT', color: '#3B7FE1', name: 'Ouédraogo T.',    matiere: 'Réseaux' },
    ],
    topDoc: { titre: "Introduction à l'Informatique — Cours L1", type: 'Cours', score: 91, vues: 564 },
  },
  {
    id: 6, logo: 'UOH', color: '#6366f1', nom: 'Université de Ouahigouya',
    ville: 'Ouahigouya', region: 'Nord', fondee: 2016,
    etudiants: 1200, docs: 181, scoreIA: 80,
    description: "Université développant les formations en sciences humaines, histoire et géographie du Sahel. Engagée pour le rayonnement culturel du Nord.",
    domaines: ['Histoire', 'Géographie', 'Sciences Humaines', 'Sahel'],
    profs: [
      { initials: 'KM', color: '#6366f1', name: 'Konaté M.', matiere: 'Histoire' },
    ],
    topDoc: { titre: 'Histoire du Burkina Faso — Cours L1', type: 'Cours', score: 83, vues: 178 },
  },
]

const scoreColor = (s) => s >= 85
  ? { color: 'var(--color-success)', bg: 'var(--color-success-light)' }
  : s >= 75
  ? { color: 'var(--color-gold)',    bg: 'var(--color-gold-light)' }
  : { color: 'var(--color-danger)',  bg: '#FEE2E2' }

const UniversitesPage = () => {
  const navigate  = useNavigate()
  const [suivis, setSuivis] = useState({ 1: true })

  const toggleSuivi = (id, e) => { e.stopPropagation(); setSuivis(p => ({ ...p, [id]: !p[id] })) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats globales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Universités',  value: universites.length,                                        color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🏛' },
          { label: 'Suivies',      value: Object.values(suivis).filter(Boolean).length,              color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✅' },
          { label: 'Documents',    value: universites.reduce((s,u) => s+u.docs, 0).toLocaleString(), color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '📄' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste universités — colonne unique */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {universites.map(u => {
          const isSuivi = !!suivis[u.id]
          const sc = scoreColor(u.scoreIA)

          return (
            <div key={u.id}
              onClick={() => navigate(`/etudiant/universites/${u.id}`)}
              style={{ background: '#fff', borderRadius: '18px', border: '1px solid #E5E7EB', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.11)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'}>

              {/* Bande couleur + header */}
              <div style={{ height: '6px', background: u.color }} />

              <div style={{ padding: '20px 22px 0' }}>

                {/* Ligne 1 : logo + nom + localisation + année + score IA */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
                  <div style={{ width: '58px', height: '58px', borderRadius: '14px', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#fff', flexShrink: 0, letterSpacing: '-0.5px', boxShadow: `0 4px 14px ${u.color}55` }}>
                    {u.logo}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '4px' }}>{u.nom}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>📍 {u.ville} · {u.region}</span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>·</span>
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Fondée en {u.fondee}</span>
                    </div>
                  </div>
                  {/* Score IA */}
                  <div style={{ textAlign: 'center', padding: '8px 14px', borderRadius: '12px', background: sc.bg, flexShrink: 0 }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: sc.color, lineHeight: 1 }}>{u.scoreIA}</div>
                    <div style={{ fontSize: '10px', color: sc.color, marginTop: '2px', fontWeight: 600 }}>Score IA</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.65, margin: '0 0 14px', padding: '12px 14px', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #F3F4F6' }}>
                  {u.description}
                </p>

                {/* Domaines */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {u.domaines.map(d => (
                    <span key={d} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: `${u.color}18`, color: u.color, border: `1px solid ${u.color}30` }}>
                      {d}
                    </span>
                  ))}
                </div>

                {/* Stats — 4 colonnes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { icon: '🎓', val: u.etudiants.toLocaleString('fr-FR'), label: 'Étudiants',    color: u.color,              bg: `${u.color}14` },
                    { icon: '📄', val: u.docs,                               label: 'Documents',    color: 'var(--color-gold)',   bg: 'var(--color-gold-light)' },
                    { icon: '👨‍🏫', val: u.profs.length,                       label: 'Enseignants', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
                    { icon: '🤖', val: u.scoreIA + '/100',                   label: 'Moy. IA',     color: sc.color,             bg: sc.bg },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: '10px', background: s.bg }}>
                      <div style={{ fontSize: '16px', marginBottom: '4px' }}>{s.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: '10px', color: s.color, opacity: 0.8, marginTop: '3px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Enseignants */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {u.profs.map((p, i) => (
                      <div key={i}
                        title={`${p.name} — ${p.matiere}`}
                        style={{ width: '34px', height: '34px', borderRadius: '50%', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', border: '2px solid #fff', marginLeft: i === 0 ? 0 : '-8px', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>
                        {p.initials}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{u.profs.map(p => p.name).join(', ')}</span>
                  </div>
                </div>

                {/* Doc phare */}
                <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '12px', background: '#0d1f3c', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>⭐</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '3px' }}>Document phare</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.topDoc.titre}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{u.topDoc.type} · {u.topDoc.vues} vues</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', padding: '4px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>
                    IA {u.topDoc.score}
                  </div>
                </div>

              </div>

              {/* Footer : bouton Suivre + Voir profil */}
              <div style={{ padding: '14px 22px 18px', display: 'flex', gap: '10px', borderTop: '1px solid #F3F4F6' }}>
                <button
                  onClick={e => toggleSuivi(u.id, e)}
                  style={{ flex: 1, padding: '10px', borderRadius: '11px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    border: isSuivi ? '1.5px solid var(--color-success)' : '1.5px solid #E5E7EB',
                    background: isSuivi ? 'var(--color-success-light)' : '#F9FAFB',
                    color: isSuivi ? 'var(--color-success)' : '#6B7280',
                  }}>
                  {isSuivi ? '✓ Suivi' : '+ Suivre'}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/etudiant/universites/${u.id}`) }}
                  style={{ flex: 2, padding: '10px', borderRadius: '11px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none', background: u.color, color: '#fff', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Voir le profil complet →
                </button>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UniversitesPage
