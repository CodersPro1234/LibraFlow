import { useState } from 'react'

const initialProfs = [
  { id: 1, initials: 'OM', name: 'Ouédraogo Mamadou', matiere: 'Droit Constitutionnel', docs: 12, grade: 'Maître de conférences', status: 'actif', since: '14 Jan 2025' },
  { id: 2, initials: 'AK', name: 'Amadou Kaboré', matiere: 'Économie', docs: 8, grade: 'Assistant', status: 'attente', since: '09 Mai 2026' },
  { id: 3, initials: 'FY', name: 'Fatima Yameogo', matiere: 'Mathématiques', docs: 15, grade: 'Professeur titulaire', status: 'actif', since: '03 Mar 2024' },
  { id: 4, initials: 'BS', name: 'Boubacar Sawadogo', matiere: 'Informatique', docs: 0, grade: 'Assistant', status: 'attente', since: '15 Mai 2026' },
  { id: 5, initials: 'RC', name: 'Rose Compaoré', matiere: 'Biologie', docs: 6, grade: 'Maître-assistant', status: 'suspendu', since: '22 Fév 2024' },
]

const statusConfig = {
  actif: { label: 'Actif', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  attente: { label: 'En attente', bg: 'var(--color-gold-light)', color: 'var(--color-gold)' },
  suspendu: { label: 'Suspendu', bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
}

const ProfsPage = () => {
  const [profs, setProfs] = useState(initialProfs)
  const [confirm, setConfirm] = useState(null)

  const updateStatus = (id, newStatus) => {
    setProfs(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    setConfirm(null)
  }

  const counts = {
    total: profs.length,
    actif: profs.filter(p => p.status === 'actif').length,
    attente: profs.filter(p => p.status === 'attente').length,
    suspendu: profs.filter(p => p.status === 'suspendu').length,
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          { label: 'Actifs', value: counts.actif, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
          { label: 'En attente', value: counts.attente, color: 'var(--color-gold)', bg: 'var(--color-gold-light)' },
          { label: 'Suspendus', value: counts.suspendu, color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Professeurs de l'université
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {profs.map((prof) => {
            const sc = statusConfig[prof.status]
            const isConfirming = confirm?.id === prof.id
            return (
              <div key={prof.id} className="px-4 py-3 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  {prof.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{prof.name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{prof.matiere} · {prof.grade}</div>
                </div>

                {/* Docs */}
                <div className="text-center w-16 hidden sm:block">
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{prof.docs}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>docs</div>
                </div>

                {/* Date */}
                <div className="text-xs w-24 hidden md:block" style={{ color: 'var(--color-muted)' }}>
                  Depuis le<br />{prof.since}
                </div>

                {/* Status badge */}
                <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={{ background: sc.bg, color: sc.color }}>
                  {sc.label}
                </span>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {isConfirming ? (
                    <>
                      <button
                        onClick={() => updateStatus(prof.id, confirm.action)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                        style={{ background: confirm.action === 'actif' ? 'var(--color-success)' : 'var(--color-danger)' }}>
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
                      {prof.status === 'attente' && (
                        <>
                          <button
                            onClick={() => setConfirm({ id: prof.id, action: 'actif' })}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: 'var(--color-success)' }}>
                            Valider
                          </button>
                          <button
                            onClick={() => setConfirm({ id: prof.id, action: 'suspendu' })}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: 'var(--color-danger)' }}>
                            Rejeter
                          </button>
                        </>
                      )}
                      {prof.status === 'actif' && (
                        <button
                          onClick={() => setConfirm({ id: prof.id, action: 'suspendu' })}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                          Suspendre
                        </button>
                      )}
                      {prof.status === 'suspendu' && (
                        <button
                          onClick={() => setConfirm({ id: prof.id, action: 'actif' })}
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                          style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
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
