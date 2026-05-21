import { useState } from 'react'

const initialEtudiants = [
  { id: 1, initials: 'DK', name: 'Diallo Karim', ine: 'INE-2024-00142', filiere: 'Droit · L2', date: '15 Sep 2024', status: 'actif' },
  { id: 2, initials: 'ST', name: 'Sawadogo Tiguida', ine: 'INE-2025-00387', filiere: 'Économie · L1', date: '12 Oct 2025', status: 'actif' },
  { id: 3, initials: 'MB', name: 'Millogo Blandine', ine: 'INE-2024-00291', filiere: 'Maths · L3', date: '02 Sep 2024', status: 'actif' },
  { id: 4, initials: 'OK', name: 'Ouédraogo Kisito', ine: 'INE-2023-00078', filiere: 'Informatique · L2', date: '20 Sep 2023', status: 'suspendu' },
  { id: 5, initials: 'AP', name: 'Alidou Pousga', ine: 'INE-2025-00412', filiere: 'Biologie · L1', date: '05 Nov 2025', status: 'actif' },
]

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
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Étudiants inscrits', value: etudiants.length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          { label: 'Actifs', value: etudiants.filter(e => e.status === 'actif').length, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
          { label: 'Suspendus', value: etudiants.filter(e => e.status === 'suspendu').length, color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-3" style={{ borderColor: 'var(--color-border)' }}>
        <input
          type="text"
          placeholder="Rechercher par nom ou INE…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm outline-none"
          style={{ color: 'var(--color-text)' }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {filtered.length} étudiant{filtered.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {filtered.map((etudiant) => {
            const isConfirming = confirm === etudiant.id
            const isSuspendu = etudiant.status === 'suspendu'
            return (
              <div key={etudiant.id} className="px-4 py-3 flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: isSuspendu ? 'var(--color-danger-light)' : 'var(--color-primary-light)',
                    color: isSuspendu ? 'var(--color-danger)' : 'var(--color-primary-dark)',
                  }}>
                  {etudiant.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{etudiant.name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{etudiant.filiere}</div>
                </div>

                {/* INE */}
                <div className="text-xs font-mono hidden md:block" style={{ color: 'var(--color-muted)' }}>
                  {etudiant.ine}
                </div>

                {/* Date */}
                <div className="text-xs w-28 hidden lg:block text-right" style={{ color: 'var(--color-muted)' }}>
                  Inscrit le<br />{etudiant.date}
                </div>

                {/* Status */}
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                  style={{
                    background: isSuspendu ? 'var(--color-danger-light)' : 'var(--color-success-light)',
                    color: isSuspendu ? 'var(--color-danger)' : 'var(--color-success)',
                  }}>
                  {isSuspendu ? 'Suspendu' : 'Actif'}
                </span>

                {/* Action */}
                <div className="flex-shrink-0">
                  {isConfirming ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleSuspend(etudiant.id, etudiant.status)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                        style={{ background: isSuspendu ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        Confirmer
                      </button>
                      <button
                        onClick={() => setConfirm(null)}
                        className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirm(etudiant.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                      style={{
                        borderColor: isSuspendu ? 'var(--color-success)' : 'var(--color-danger)',
                        color: isSuspendu ? 'var(--color-success)' : 'var(--color-danger)',
                      }}>
                      {isSuspendu ? 'Réactiver' : 'Suspendre'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--color-muted)' }}>
            <div className="text-3xl mb-2">🎓</div>
            <div className="text-sm">Aucun résultat pour cette recherche</div>
          </div>
        )}
      </div>

    </div>
  )
}

export default EtudiantsPage
