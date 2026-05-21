import { useState } from 'react'

const universites = [
  {
    id: 1,
    logo: 'UJK',
    color: 'var(--color-primary)',
    nom: 'Université Joseph Ki-Zerbo',
    ville: 'Ouagadougou',
    region: 'Centre',
    etudiants: 4218,
    docs: 840,
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
  {
    id: 2,
    logo: 'USTA',
    color: '#378ADD',
    nom: 'USTA Bobo-Dioulasso',
    ville: 'Bobo-Dioulasso',
    region: 'Hauts-Bassins',
    etudiants: 3120,
    docs: 512,
    profs: [
      { initials: 'TF', name: 'Prof. Traoré Fatoumata', matiere: 'Mathématiques', docs: 18 },
      { initials: 'BS', name: 'Prof. Barro Seydou', matiere: 'Physique', docs: 9 },
    ],
    documents: [
      { id: 1, titre: 'Annales Mathématiques 2024/2025', type: 'Annales', score: 88, vues: 389 },
      { id: 2, titre: 'Mécanique Quantique — L3', type: 'Cours', score: 82, vues: 201 },
    ],
  },
  {
    id: 3,
    logo: 'ISGE',
    color: 'var(--color-gold)',
    nom: 'ISGE-BF Ouagadougou',
    ville: 'Ouagadougou',
    region: 'Centre',
    etudiants: 980,
    docs: 298,
    profs: [
      { initials: 'ZI', name: 'Prof. Zongo Issa', matiere: 'Finance', docs: 11 },
      { initials: 'AK', name: 'Prof. Amadou Kaboré', matiere: 'Économie', docs: 8 },
    ],
    documents: [
      { id: 1, titre: 'TD Finance d\'entreprise S2', type: 'TD', score: 71, vues: 187 },
      { id: 2, titre: 'Introduction à l\'Économie', type: 'Cours', score: 76, vues: 298 },
    ],
  },
  {
    id: 4,
    logo: 'UNZ',
    color: 'var(--color-success)',
    nom: 'Université Norbert Zongo',
    ville: 'Koudougou',
    region: 'Centre-Ouest',
    etudiants: 2140,
    docs: 387,
    profs: [
      { initials: 'SA', name: 'Prof. Sawadogo Amidou', matiere: 'Droit International', docs: 7 },
      { initials: 'DN', name: 'Prof. Diabré Nadège', matiere: 'Sociologie', docs: 5 },
    ],
    documents: [
      { id: 1, titre: 'Droit International Public — L3', type: 'Cours', score: 79, vues: 143 },
      { id: 2, titre: 'Introduction à la Sociologie', type: 'Cours', score: 85, vues: 211 },
    ],
  },
  {
    id: 5,
    logo: 'BIT',
    color: '#555',
    nom: 'BIT Burkina',
    ville: 'Ouagadougou',
    region: 'Centre',
    etudiants: 1450,
    docs: 221,
    profs: [
      { initials: 'KA', name: 'Prof. Kaboré Adama', matiere: 'Informatique', docs: 14 },
      { initials: 'OT', name: 'Prof. Ouédraogo Théophile', matiere: 'Réseaux', docs: 6 },
    ],
    documents: [
      { id: 1, titre: 'Introduction à l\'Informatique', type: 'Cours', score: 91, vues: 564 },
      { id: 2, titre: 'Algorithmes de tri — Série 2', type: 'TD', score: 88, vues: 312 },
    ],
  },
  {
    id: 6,
    logo: 'UPZ',
    color: '#6366f1',
    nom: 'Université de Ouahigouya',
    ville: 'Ouahigouya',
    region: 'Nord',
    etudiants: 1200,
    docs: 181,
    profs: [
      { initials: 'KM', name: 'Prof. Konaté Moussa', matiere: 'Histoire-Géo', docs: 9 },
    ],
    documents: [
      { id: 1, titre: 'Histoire du Burkina Faso — L1', type: 'Cours', score: 83, vues: 178 },
    ],
  },
]

const UniversitesPage = () => {
  const [suivis, setSuivis] = useState({ 1: true })
  const [selected, setSelected] = useState(null)

  const toggleSuivi = (id, e) => {
    e.stopPropagation()
    setSuivis(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const univ = universites.find(u => u.id === selected)

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Universités disponibles', value: universites.length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🏛' },
          { label: 'Suivies', value: Object.values(suivis).filter(Boolean).length, color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✅' },
          { label: 'Documents accessibles', value: universites.reduce((s, u) => s + u.docs, 0).toLocaleString(), color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '📄' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3"
              style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Détail université sélectionnée */}
      {univ && (
        <div className="bg-white rounded-xl border" style={{ borderColor: 'var(--color-primary)' }}>
          {/* Header détail */}
          <div className="p-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: univ.color }}>
              {univ.logo}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{univ.nom}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{univ.ville} · {univ.region}</div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-sm"
              style={{ background: 'var(--color-bg)', color: 'var(--color-muted)' }}>
              ×
            </button>
          </div>

          <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--color-border)' }}>
            {/* Profs */}
            <div className="p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--color-muted)' }}>
                PROFESSEURS ({univ.profs.length})
              </div>
              <div className="flex flex-col gap-2.5">
                {univ.profs.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>{p.name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{p.matiere} · {p.docs} docs</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="p-4">
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--color-muted)' }}>
                DOCUMENTS RÉCENTS
              </div>
              <div className="flex flex-col gap-2.5">
                {univ.documents.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0 font-medium"
                      style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      {d.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium leading-tight truncate"
                        style={{ color: 'var(--color-text)' }}>{d.titre}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {d.vues} vues · score {d.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grille universités */}
      <div className="grid grid-cols-2 gap-4">
        {universites.map((u) => {
          const isSuivi = !!suivis[u.id]
          const isSelected = selected === u.id
          return (
            <div
              key={u.id}
              onClick={() => setSelected(isSelected ? null : u.id)}
              className="bg-white rounded-xl border p-4 cursor-pointer transition-all"
              style={{
                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                boxShadow: isSelected ? '0 0 0 2px var(--color-primary-light)' : 'none',
              }}>

              {/* Logo + Nom */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: u.color }}>
                  {u.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>
                    {u.nom}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    {u.ville} · {u.region}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1 text-center p-2 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {u.etudiants.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Étudiants</div>
                </div>
                <div className="flex-1 text-center p-2 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {u.docs}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Documents</div>
                </div>
              </div>

              {/* Bouton Suivre */}
              <button
                onClick={(e) => toggleSuivi(u.id, e)}
                className="w-full text-xs py-1.5 rounded-lg font-medium transition-all"
                style={{
                  background: isSuivi ? 'var(--color-success-light)' : 'var(--color-primary)',
                  color: isSuivi ? 'var(--color-success)' : '#fff',
                  border: isSuivi ? '1px solid var(--color-success)' : 'none',
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
