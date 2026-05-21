import { useState } from 'react'

const initialUnivs = [
  { id: 1, initials: 'UJK', color: 'var(--color-primary)', name: 'Université Joseph Ki-Zerbo', region: 'Centre · Ouagadougou', etudiants: 4218, docs: 840, status: 'approuvee', since: '12 Jan 2020' },
  { id: 2, initials: 'UNZ', color: '#378ADD', name: 'Université Norbert Zongo', region: 'Centre-Ouest · Koudougou', etudiants: 2140, docs: 387, status: 'attente', since: '08 Mai 2026' },
  { id: 3, initials: 'USTA', color: 'var(--color-success)', name: 'USTA Bobo-Dioulasso', region: 'Hauts-Bassins · Bobo', etudiants: 3120, docs: 512, status: 'approuvee', since: '03 Mar 2021' },
  { id: 4, initials: 'ISGE', color: 'var(--color-gold)', name: 'ISGE-BF Ouagadougou', region: 'Centre · Ouagadougou', etudiants: 980, docs: 298, status: 'attente', since: '14 Mai 2026' },
  { id: 5, initials: 'UPZ', color: '#6366f1', name: 'Université de Ouahigouya', region: 'Nord · Ouahigouya', etudiants: 1200, docs: 181, status: 'suspendue', since: '15 Fév 2022' },
]

const statusConfig = {
  approuvee: { label: 'Approuvée', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  attente: { label: 'En attente', bg: 'var(--color-gold-light)', color: 'var(--color-gold)' },
  suspendue: { label: 'Suspendue', bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
}

const UniversitesPage = () => {
  const [univs, setUnivs] = useState(initialUnivs)
  const [confirm, setConfirm] = useState(null)

  const updateStatus = (id, newStatus) => {
    setUnivs(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u))
    setConfirm(null)
  }

  const counts = {
    total: univs.length,
    approuvee: univs.filter(u => u.status === 'approuvee').length,
    attente: univs.filter(u => u.status === 'attente').length,
    suspendue: univs.filter(u => u.status === 'suspendue').length,
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🏛' },
          { label: 'Approuvées', value: counts.approuvee, color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '✅' },
          { label: 'En attente', value: counts.attente, color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '⏳' },
          { label: 'Suspendues', value: counts.suspendue, color: 'var(--color-danger)', bg: 'var(--color-danger-light)', icon: '⛔' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-3">
        {univs.map((univ) => {
          const sc = statusConfig[univ.status]
          const isConfirming = confirm?.id === univ.id
          return (
            <div key={univ.id} className="bg-white rounded-xl border p-4"
              style={{ borderColor: univ.status === 'attente' ? 'var(--color-gold)' : 'var(--color-border)' }}>
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: univ.color }}>
                  {univ.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{univ.name}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>{univ.region}</div>
                  <div className="flex gap-4 flex-wrap">
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{univ.etudiants.toLocaleString()}</span> étudiants
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{univ.docs}</span> documents
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      Enregistrée le {univ.since}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  {isConfirming ? (
                    <>
                      <button
                        onClick={() => updateStatus(univ.id, confirm.action)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                        style={{
                          background: confirm.action === 'approuvee' ? 'var(--color-success)'
                            : confirm.action === 'suspendue' ? 'var(--color-danger)'
                            : 'var(--color-gold)',
                        }}>
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirm(null)}
                        className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      {univ.status === 'attente' && (
                        <>
                          <button
                            onClick={() => setConfirm({ id: univ.id, action: 'approuvee' })}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: 'var(--color-success)' }}>
                            Approuver
                          </button>
                          <button
                            onClick={() => setConfirm({ id: univ.id, action: 'suspendue' })}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: 'var(--color-danger)' }}>
                            Rejeter
                          </button>
                        </>
                      )}
                      {univ.status === 'approuvee' && (
                        <button
                          onClick={() => setConfirm({ id: univ.id, action: 'suspendue' })}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                          Suspendre
                        </button>
                      )}
                      {univ.status === 'suspendue' && (
                        <button
                          onClick={() => setConfirm({ id: univ.id, action: 'approuvee' })}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                          style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
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
