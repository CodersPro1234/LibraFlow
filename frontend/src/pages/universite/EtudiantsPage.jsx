import { useState } from 'react'

const initialEtudiants = [
  { id: 1, initials: 'DK', name: 'Diallo Karim',      ine: 'INE-2024-00142', filiere: 'Droit · L2',         date: '15 Sep 2024', status: 'actif' },
  { id: 2, initials: 'ST', name: 'Sawadogo Tiguida',  ine: 'INE-2025-00387', filiere: 'Économie · L1',      date: '12 Oct 2025', status: 'actif' },
  { id: 3, initials: 'MB', name: 'Millogo Blandine',  ine: 'INE-2024-00291', filiere: 'Maths · L3',         date: '02 Sep 2024', status: 'actif' },
  { id: 4, initials: 'OK', name: 'Ouédraogo Kisito',  ine: 'INE-2023-00078', filiere: 'Informatique · L2',  date: '20 Sep 2023', status: 'suspendu' },
  { id: 5, initials: 'AP', name: 'Alidou Pousga',     ine: 'INE-2025-00412', filiere: 'Biologie · L1',      date: '05 Nov 2025', status: 'actif' },
]

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }

const EtudiantsPage = () => {
  const [etudiants, setEtudiants] = useState(initialEtudiants)
  const [confirm, setConfirm] = useState(null)
  const [search, setSearch] = useState('')

  const toggleSuspend = (id, current) => {
    const next = current === 'actif' ? 'suspendu' : 'actif'
    setEtudiants(prev => prev.map(e => e.id === id ? { ...e, status: next } : e))
    setConfirm(null)
  }

  const filtered = etudiants.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.ine.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Étudiants inscrits', value: etudiants.length,                                 color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🎓' },
          { label: 'Actifs',             value: etudiants.filter(e => e.status === 'actif').length,    color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✅' },
          { label: 'Suspendus',          value: etudiants.filter(e => e.status === 'suspendu').length, color: 'var(--color-danger)',  bg: '#FEE2E2',                   icon: '⛔' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recherche */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <span style={{ fontSize: '16px', color: '#9CA3AF' }}>🔍</span>
        <input type="text" placeholder="Rechercher par nom ou INE…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, fontSize: '14px', border: 'none', outline: 'none', background: 'transparent', color: '#111827' }} />
        {search && (
          <button onClick={() => setSearch('')}
            style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#F3F4F6', color: '#9CA3AF', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        )}
      </div>

      {/* Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
            {filtered.length} étudiant{filtered.length > 1 ? 's' : ''}
          </div>
        </div>

        <div>
          {filtered.map((etudiant, idx) => {
            const isConfirming = confirm === etudiant.id
            const isSuspendu = etudiant.status === 'suspendu'
            return (
              <div key={etudiant.id} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < filtered.length - 1 ? '1px solid #F9FAFB' : 'none' }}>

                {/* Avatar */}
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0,
                  background: isSuspendu ? '#FEE2E2' : 'var(--color-primary-light)',
                  color: isSuspendu ? 'var(--color-danger)' : 'var(--color-primary)',
                }}>
                  {etudiant.initials}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{etudiant.name}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>{etudiant.filiere}</div>
                </div>

                {/* INE */}
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#9CA3AF' }}>{etudiant.ine}</div>

                {/* Date */}
                <div style={{ fontSize: '12px', color: '#9CA3AF', width: '100px', textAlign: 'right' }}>
                  Inscrit le<br />{etudiant.date}
                </div>

                {/* Status */}
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', flexShrink: 0,
                  background: isSuspendu ? '#FEE2E2' : 'var(--color-success-light)',
                  color: isSuspendu ? 'var(--color-danger)' : 'var(--color-success)',
                }}>
                  {isSuspendu ? 'Suspendu' : 'Actif'}
                </span>

                {/* Action */}
                <div style={{ flexShrink: 0 }}>
                  {isConfirming ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => toggleSuspend(etudiant.id, etudiant.status)}
                        style={{ padding: '7px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#fff',
                          background: isSuspendu ? 'var(--color-success)' : 'var(--color-danger)',
                        }}>Confirmer</button>
                      <button onClick={() => setConfirm(null)}
                        style={{ padding: '7px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirm(etudiant.id)}
                      style={{ padding: '7px 12px', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: '#fff',
                        border: `1.5px solid ${isSuspendu ? 'var(--color-success)' : 'var(--color-danger)'}`,
                        color: isSuspendu ? 'var(--color-success)' : 'var(--color-danger)',
                      }}>
                      {isSuspendu ? 'Réactiver' : 'Suspendre'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎓</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Aucun résultat pour cette recherche</div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default EtudiantsPage
