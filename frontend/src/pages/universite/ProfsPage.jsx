import { useState } from 'react'

const initialProfs = [
  { id: 1, initials: 'OM', name: 'Ouédraogo Mamadou', matiere: 'Droit Constitutionnel', docs: 12, grade: 'Maître de conférences', status: 'actif',    since: '14 Jan 2025' },
  { id: 2, initials: 'AK', name: 'Amadou Kaboré',     matiere: 'Économie',               docs: 8,  grade: 'Assistant',           status: 'attente',  since: '09 Mai 2026' },
  { id: 3, initials: 'FY', name: 'Fatima Yameogo',    matiere: 'Mathématiques',           docs: 15, grade: 'Professeur titulaire', status: 'actif',    since: '03 Mar 2024' },
  { id: 4, initials: 'BS', name: 'Boubacar Sawadogo', matiere: 'Informatique',            docs: 0,  grade: 'Assistant',           status: 'attente',  since: '15 Mai 2026' },
  { id: 5, initials: 'RC', name: 'Rose Compaoré',     matiere: 'Biologie',               docs: 6,  grade: 'Maître-assistant',     status: 'suspendu', since: '22 Fév 2024' },
]

const statusConfig = {
  actif:    { label: 'Actif',      bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  attente:  { label: 'En attente', bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  suspendu: { label: 'Suspendu',   bg: '#FEE2E2',                    color: 'var(--color-danger)' },
}

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }

const ProfsPage = () => {
  const [profs, setProfs] = useState(initialProfs)
  const [confirm, setConfirm] = useState(null)

  const updateStatus = (id, newStatus) => {
    setProfs(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    setConfirm(null)
  }

  const counts = {
    total:    profs.length,
    actif:    profs.filter(p => p.status === 'actif').length,
    attente:  profs.filter(p => p.status === 'attente').length,
    suspendu: profs.filter(p => p.status === 'suspendu').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Total',      value: counts.total,    color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '👨‍🏫' },
          { label: 'Actifs',     value: counts.actif,    color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✅' },
          { label: 'En attente', value: counts.attente,  color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '⏳' },
          { label: 'Suspendus',  value: counts.suspendu, color: 'var(--color-danger)',  bg: '#FEE2E2',                   icon: '⛔' },
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

      {/* Liste */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Professeurs de l'université</div>
        </div>

        <div>
          {profs.map((prof, idx) => {
            const sc = statusConfig[prof.status]
            const isConfirming = confirm?.id === prof.id
            return (
              <div key={prof.id} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: idx < profs.length - 1 ? '1px solid #F9FAFB' : 'none' }}>

                {/* Avatar */}
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                  {prof.initials}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{prof.name}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>{prof.matiere} · {prof.grade}</div>
                </div>

                {/* Docs */}
                <div style={{ textAlign: 'center', width: '60px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>{prof.docs}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>docs</div>
                </div>

                {/* Date */}
                <div style={{ fontSize: '12px', color: '#9CA3AF', width: '100px' }}>
                  Depuis le<br />{prof.since}
                </div>

                {/* Status */}
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: sc.bg, color: sc.color, flexShrink: 0 }}>
                  {sc.label}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {isConfirming ? (
                    <>
                      <button onClick={() => updateStatus(prof.id, confirm.action)}
                        style={{ padding: '7px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#fff',
                          background: confirm.action === 'actif' ? 'var(--color-success)' : 'var(--color-danger)',
                        }}>Confirmer</button>
                      <button onClick={() => setConfirm(null)}
                        style={{ padding: '7px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      {prof.status === 'attente' && (
                        <>
                          <button onClick={() => setConfirm({ id: prof.id, action: 'actif' })}
                            style={{ padding: '7px 14px', borderRadius: '9px', background: 'var(--color-success)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                            Valider
                          </button>
                          <button onClick={() => setConfirm({ id: prof.id, action: 'suspendu' })}
                            style={{ padding: '7px 12px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                            Rejeter
                          </button>
                        </>
                      )}
                      {prof.status === 'actif' && (
                        <button onClick={() => setConfirm({ id: prof.id, action: 'suspendu' })}
                          style={{ padding: '7px 12px', borderRadius: '9px', border: '1.5px solid var(--color-danger)', background: '#fff', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                          Suspendre
                        </button>
                      )}
                      {prof.status === 'suspendu' && (
                        <button onClick={() => setConfirm({ id: prof.id, action: 'actif' })}
                          style={{ padding: '7px 12px', borderRadius: '9px', border: '1.5px solid var(--color-success)', background: '#fff', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                          Réactiver
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default ProfsPage
