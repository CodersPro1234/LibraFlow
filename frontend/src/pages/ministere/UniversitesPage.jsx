import { useState } from 'react'

const initialUnivs = [
  { id: 1, initials: 'UJK',  color: 'var(--color-primary)', name: 'Université Joseph Ki-Zerbo',  region: 'Centre · Ouagadougou',       etudiants: 4218, docs: 840, status: 'approuvee', since: '12 Jan 2020' },
  { id: 2, initials: 'UNZ',  color: '#378ADD',              name: 'Université Norbert Zongo',     region: 'Centre-Ouest · Koudougou',   etudiants: 2140, docs: 387, status: 'attente',   since: '08 Mai 2026' },
  { id: 3, initials: 'USTA', color: 'var(--color-success)', name: 'USTA Bobo-Dioulasso',          region: 'Hauts-Bassins · Bobo',       etudiants: 3120, docs: 512, status: 'approuvee', since: '03 Mar 2021' },
  { id: 4, initials: 'ISGE', color: 'var(--color-gold)',    name: 'ISGE-BF Ouagadougou',          region: 'Centre · Ouagadougou',       etudiants: 980,  docs: 298, status: 'attente',   since: '14 Mai 2026' },
  { id: 5, initials: 'UPZ',  color: '#6366f1',              name: 'Université de Ouahigouya',     region: 'Nord · Ouahigouya',          etudiants: 1200, docs: 181, status: 'suspendue', since: '15 Fév 2022' },
]

const statusConfig = {
  approuvee: { label: 'Approuvée',  bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  attente:   { label: 'En attente', bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  suspendue: { label: 'Suspendue',  bg: '#FEE2E2',                    color: 'var(--color-danger)' },
}

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const UniversitesPage = () => {
  const [univs, setUnivs] = useState(initialUnivs)
  const [confirm, setConfirm] = useState(null)

  const updateStatus = (id, newStatus) => {
    setUnivs(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))
    setConfirm(null)
  }

  const counts = {
    total:     univs.length,
    approuvee: univs.filter(u => u.status === 'approuvee').length,
    attente:   univs.filter(u => u.status === 'attente').length,
    suspendue: univs.filter(u => u.status === 'suspendue').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Total',      value: counts.total,     color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🏛' },
          { label: 'Approuvées', value: counts.approuvee, color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✅' },
          { label: 'En attente', value: counts.attente,   color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '⏳' },
          { label: 'Suspendues', value: counts.suspendue, color: 'var(--color-danger)',  bg: '#FEE2E2',                   icon: '⛔' },
        ].map((s, i) => (
          <div key={i} style={card}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {univs.map((univ) => {
          const sc = statusConfig[univ.status]
          const isConfirming = confirm?.id === univ.id
          return (
            <div key={univ.id} style={{ ...card, padding: '18px 20px', borderColor: univ.status === 'attente' ? 'var(--color-gold)' : '#E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                {/* Logo */}
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: univ.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {univ.initials}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{univ.name}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '6px' }}>{univ.region}</div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{univ.etudiants.toLocaleString()}</span> étudiants
                    </span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{univ.docs}</span> documents
                    </span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Enregistrée le {univ.since}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {isConfirming ? (
                    <>
                      <button onClick={() => updateStatus(univ.id, confirm.action)}
                        style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#fff',
                          background: confirm.action === 'approuvee' ? 'var(--color-success)' : confirm.action === 'suspendue' ? 'var(--color-danger)' : 'var(--color-gold)',
                        }}>Confirmer</button>
                      <button onClick={() => setConfirm(null)}
                        style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      {univ.status === 'attente' && (
                        <>
                          <button onClick={() => setConfirm({ id: univ.id, action: 'approuvee' })}
                            style={{ padding: '8px 16px', borderRadius: '9px', background: 'var(--color-success)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                            Approuver
                          </button>
                          <button onClick={() => setConfirm({ id: univ.id, action: 'suspendue' })}
                            style={{ padding: '8px 14px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                            Rejeter
                          </button>
                        </>
                      )}
                      {univ.status === 'approuvee' && (
                        <button onClick={() => setConfirm({ id: univ.id, action: 'suspendue' })}
                          style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid var(--color-danger)', background: '#fff', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                          Suspendre
                        </button>
                      )}
                      {univ.status === 'suspendue' && (
                        <button onClick={() => setConfirm({ id: univ.id, action: 'approuvee' })}
                          style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid var(--color-success)', background: '#fff', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                          Réactiver
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default UniversitesPage
