import { useState } from 'react'

const universites = [
  { id: 1, logo: 'UJK', color: '#3B7FE1', nom: 'Université Joseph Ki-Zerbo', ville: 'Ouagadougou', region: 'Centre', etudiants: 4218, docs: 840,
    profs: [
      { initials: 'OM', name: 'Prof. Ouédraogo Mamadou', matiere: 'Droit Constitutionnel', docs: 12 },
      { initials: 'FY', name: 'Prof. Fatima Yameogo', matiere: 'Mathématiques', docs: 15 },
      { initials: 'RC', name: 'Prof. Rose Compaoré', matiere: 'Biologie', docs: 6 },
    ],
    documents: [
      { id: 1, titre: 'Droit Constitutionnel — Chapitre 4', type: 'Cours', score: 94, vues: 412 },
      { id: 2, titre: 'Droit Civil — Introduction générale', type: 'Cours', score: 87, vues: 289 },
      { id: 3, titre: 'Annales Droit 2023', type: 'Annales', score: 71, vues: 546 },
    ],
  },
  { id: 2, logo: 'USTA', color: '#378ADD', nom: 'USTA Bobo-Dioulasso', ville: 'Bobo-Dioulasso', region: 'Hauts-Bassins', etudiants: 3120, docs: 512,
    profs: [
      { initials: 'TF', name: 'Prof. Traoré Fatoumata', matiere: 'Mathématiques', docs: 18 },
      { initials: 'BS', name: 'Prof. Barro Seydou', matiere: 'Physique', docs: 9 },
    ],
    documents: [
      { id: 1, titre: 'Annales Mathématiques 2024/2025', type: 'Annales', score: 88, vues: 389 },
      { id: 2, titre: 'Mécanique Quantique — L3', type: 'Cours', score: 82, vues: 201 },
    ],
  },
  { id: 3, logo: 'ISGE', color: '#f59e0b', nom: 'ISGE-BF Ouagadougou', ville: 'Ouagadougou', region: 'Centre', etudiants: 980, docs: 298,
    profs: [
      { initials: 'ZI', name: 'Prof. Zongo Issa', matiere: 'Finance', docs: 11 },
      { initials: 'AK', name: 'Prof. Amadou Kaboré', matiere: 'Économie', docs: 8 },
    ],
    documents: [
      { id: 1, titre: "TD Finance d'entreprise S2", type: 'TD', score: 71, vues: 187 },
      { id: 2, titre: "Introduction à l'Économie", type: 'Cours', score: 76, vues: 298 },
    ],
  },
  { id: 4, logo: 'UNZ', color: '#10b981', nom: 'Université Norbert Zongo', ville: 'Koudougou', region: 'Centre-Ouest', etudiants: 2140, docs: 387,
    profs: [
      { initials: 'SA', name: 'Prof. Sawadogo Amidou', matiere: 'Droit International', docs: 7 },
      { initials: 'DN', name: 'Prof. Diabré Nadège', matiere: 'Sociologie', docs: 5 },
    ],
    documents: [
      { id: 1, titre: 'Droit International Public — L3', type: 'Cours', score: 79, vues: 143 },
      { id: 2, titre: 'Introduction à la Sociologie', type: 'Cours', score: 85, vues: 211 },
    ],
  },
  { id: 5, logo: 'BIT', color: '#555', nom: 'BIT Burkina', ville: 'Ouagadougou', region: 'Centre', etudiants: 1450, docs: 221,
    profs: [
      { initials: 'KA', name: 'Prof. Kaboré Adama', matiere: 'Informatique', docs: 14 },
      { initials: 'OT', name: 'Prof. Ouédraogo Théophile', matiere: 'Réseaux', docs: 6 },
    ],
    documents: [
      { id: 1, titre: "Introduction à l'Informatique", type: 'Cours', score: 91, vues: 564 },
      { id: 2, titre: 'Algorithmes de tri — Série 2', type: 'TD', score: 88, vues: 312 },
    ],
  },
  { id: 6, logo: 'UOH', color: '#6366f1', nom: 'Université de Ouahigouya', ville: 'Ouahigouya', region: 'Nord', etudiants: 1200, docs: 181,
    profs: [
      { initials: 'KM', name: 'Prof. Konaté Moussa', matiere: 'Histoire-Géo', docs: 9 },
    ],
    documents: [
      { id: 1, titre: 'Histoire du Burkina Faso — L1', type: 'Cours', score: 83, vues: 178 },
    ],
  },
]

const scoreStyle = (s) => s >= 75
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : { bg: 'var(--color-gold-light)', color: 'var(--color-gold)' }

const UniversitesPage = () => {
  const [suivis, setSuivis] = useState({ 1: true })
  const [selected, setSelected] = useState(null)

  const toggleSuivi = (id, e) => { e.stopPropagation(); setSuivis(p => ({ ...p, [id]: !p[id] })) }
  const univ = universites.find(u => u.id === selected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Universités', value: universites.length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🏛' },
          { label: 'Suivies', value: Object.values(suivis).filter(Boolean).length, color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✅' },
          { label: 'Documents', value: universites.reduce((s, u) => s + u.docs, 0).toLocaleString(), color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '📄' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Détail université sélectionnée */}
      {univ && (
        <div style={{ background: '#fff', borderRadius: '16px', border: `2px solid ${univ.color}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '4px', background: univ.color }} />
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: univ.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{univ.logo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827' }}>{univ.nom}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{univ.ville} · {univ.region}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
            <div style={{ padding: '18px 20px', borderRight: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Professeurs ({univ.profs.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {univ.profs.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>{p.initials}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{p.matiere} · {p.docs} docs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Documents récents</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {univ.documents.map((d, i) => {
                  const sc = scoreStyle(d.score)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', flexShrink: 0 }}>{d.type}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{d.titre}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{d.vues} vues · <span style={{ color: sc.color, fontWeight: 600 }}>IA {d.score}</span></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grille universités */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
        {universites.map(u => {
          const isSuivi = !!suivis[u.id]
          const isSelected = selected === u.id
          return (
            <div key={u.id} onClick={() => setSelected(isSelected ? null : u.id)}
              style={{ background: '#fff', borderRadius: '16px', border: `1.5px solid ${isSelected ? u.color : '#E5E7EB'}`, boxShadow: isSelected ? `0 0 0 3px ${u.color}22` : '0 1px 4px rgba(0,0,0,0.05)', padding: '18px', cursor: 'pointer', transition: 'all 0.2s', overflow: 'hidden', position: 'relative' }}>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{u.logo}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827', lineHeight: 1.25 }}>{u.nom}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px' }}>{u.ville} · {u.region}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                {[['👥', u.etudiants.toLocaleString(), 'Étudiants'], ['📄', u.docs, 'Documents']].map(([icon, val, lbl], i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '10px 8px', borderRadius: '10px', background: '#F9FAFB' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>{val}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{lbl}</div>
                  </div>
                ))}
              </div>

              <button onClick={e => toggleSuivi(u.id, e)}
                style={{ width: '100%', padding: '9px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: isSuivi ? '1.5px solid var(--color-success)' : 'none',
                  background: isSuivi ? 'var(--color-success-light)' : 'var(--color-primary)',
                  color: isSuivi ? 'var(--color-success)' : '#fff',
                }}>
                {isSuivi ? '✓ Suivi' : '+ Suivre'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UniversitesPage
