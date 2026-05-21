import { useState } from 'react'

const initialDossiers = [
  {
    id: 1,
    nom: 'Université Privée de Bobo-Dioulasso',
    sigle: 'UPBD',
    adresse: 'Bobo-Dioulasso, Houet, Burkina Faso',
    email: 'admin@upbd.edu.bf',
    telephone: '+226 20 97 14 52',
    agrement: 'MIN-EDU-REQ-2026-007',
    admin: 'Dr. Lassina Coulibaly',
    dateSubmit: '2026-05-18',
    docs: ['Statuts officiels', 'Liste des fondateurs', 'Plan pédagogique', 'Rapport financier'],
    statut: 'en_attente',
  },
  {
    id: 2,
    nom: 'Institut Supérieur de Génie Civil',
    sigle: 'ISGC',
    adresse: 'Ouagadougou, Kadiogo, Burkina Faso',
    email: 'direction@isgc.edu.bf',
    telephone: '+226 25 41 09 33',
    agrement: 'MIN-EDU-REQ-2026-005',
    admin: 'Ing. Moussa Traoré',
    dateSubmit: '2026-05-16',
    docs: ['Statuts officiels', 'Accréditation internationale', 'Plan pédagogique'],
    statut: 'en_attente',
  },
  {
    id: 3,
    nom: 'École Supérieure de Commerce de Koudougou',
    sigle: 'ESC-K',
    adresse: 'Koudougou, Boulkiemdé, Burkina Faso',
    email: 'info@esck.edu.bf',
    telephone: '+226 25 44 12 78',
    agrement: 'MIN-EDU-REQ-2026-003',
    admin: 'M. Abdoulaye Nikiema',
    dateSubmit: '2026-05-12',
    docs: ['Statuts officiels', 'Plan pédagogique', 'Rapport financier'],
    statut: 'en_attente',
  },
]

const historique = [
  { id: 101, nom: 'Institut Supérieur Polytechnique de Ouaga', sigle: 'ISPO', date: '2026-04-30', decision: 'approuve', agent: 'Kaboré Ibrahim', message: 'Dossier complet. Infrastructure validée sur site.' },
  { id: 102, nom: 'École de Formation en Santé du Faso', sigle: 'EFSF', date: '2026-04-22', decision: 'rejete', agent: 'Sawadogo Mariam', message: 'Dossier incomplet : absence de rapport financier et plan pédagogique insuffisant.' },
  { id: 103, nom: 'Université Numérique du Sahel', sigle: 'UNS', date: '2026-03-15', decision: 'approuve', agent: 'Kaboré Ibrahim', message: 'Tous les documents conformes. Agrément accordé.' },
]

const StatusBadge = ({ statut }) => {
  const cfg = {
    en_attente: { label: 'En attente', bg: 'var(--color-gold-light)', color: 'var(--color-gold)' },
    approuve: { label: 'Approuvée', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
    rejete: { label: 'Rejetée', bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  }[statut]
  return (
    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

const ValidationPage = () => {
  const [dossiers, setDossiers] = useState(initialDossiers)
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null) // { id, action: 'approuve'|'rejete' }
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [tab, setTab] = useState('attente')
  const [hist, setHist] = useState(historique)

  const showToast = (msg, color = 'var(--color-success)') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2500)
  }

  const openModal = (id, action) => {
    setModal({ id, action })
    setMessage('')
  }

  const confirmer = () => {
    if (!message.trim()) return
    const dossier = dossiers.find(d => d.id === modal.id)
    setHist(prev => [{
      id: Date.now(),
      nom: dossier.nom,
      sigle: dossier.sigle,
      date: new Date().toISOString().split('T')[0],
      decision: modal.action,
      agent: 'Dr. Arouna Tou',
      message,
    }, ...prev])
    setDossiers(prev => prev.filter(d => d.id !== modal.id))
    if (selected?.id === modal.id) setSelected(null)
    showToast(
      modal.action === 'approuve' ? 'Université approuvée avec succès.' : 'Dossier rejeté.',
      modal.action === 'approuve' ? 'var(--color-success)' : 'var(--color-danger)'
    )
    setModal(null)
  }

  const enAttente = dossiers.filter(d => d.statut === 'en_attente')

  return (
    <div className="flex flex-col gap-5 max-w-3xl">

      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: toast.color }}>
          {toast.msg}
        </div>
      )}

      {/* Modal décision */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl p-6 w-96 flex flex-col gap-4 shadow-xl">
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {modal.action === 'approuve' ? '✅ Approuver l\'université' : '❌ Rejeter le dossier'}
            </div>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Un message officiel sera envoyé à l\'université. Ce message est <strong>obligatoire</strong>.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                Message officiel {modal.action === 'rejete' ? '(motifs de rejet)' : '(remarques)'}
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder={modal.action === 'approuve'
                  ? 'Ex: Dossier complet. Infrastructure validée. Agrément accordé pour la période 2026–2031.'
                  : 'Ex: Dossier incomplet — absence de rapport financier. Resoumettre avec pièces manquantes.'}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            {!message.trim() && (
              <p className="text-xs" style={{ color: 'var(--color-danger)' }}>Le message est obligatoire.</p>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setModal(null)}
                className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                Annuler
              </button>
              <button onClick={confirmer} disabled={!message.trim()}
                className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                style={{
                  background: !message.trim() ? 'var(--color-border)'
                    : modal.action === 'approuve' ? 'var(--color-success)' : 'var(--color-danger)',
                }}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border p-1 flex gap-1" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { key: 'attente', label: `En attente (${enAttente.length})` },
          { key: 'historique', label: `Historique (${hist.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSelected(null) }}
            className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
            style={{
              background: tab === t.key ? 'var(--color-primary)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--color-muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab En attente */}
      {tab === 'attente' && (
        <div className="flex gap-4">
          {/* Liste */}
          <div className="flex flex-col gap-2 flex-1">
            {enAttente.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--color-muted)' }}>
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm font-medium">Aucun dossier en attente</div>
              </div>
            )}
            {enAttente.map(d => (
              <div key={d.id}
                onClick={() => setSelected(d)}
                className="bg-white rounded-xl border p-4 cursor-pointer transition-all"
                style={{
                  borderColor: selected?.id === d.id ? 'var(--color-primary)' : 'var(--color-border)',
                  borderLeftWidth: selected?.id === d.id ? '3px' : '1px',
                }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>{d.nom}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{d.sigle} · {d.adresse.split(',')[0]}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Soumis le {d.dateSubmit}</div>
                  </div>
                  <StatusBadge statut={d.statut} />
                </div>
                <div className="flex gap-1.5 mt-3">
                  <button onClick={e => { e.stopPropagation(); openModal(d.id, 'approuve') }}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: 'var(--color-success)' }}>
                    ✓ Approuver
                  </button>
                  <button onClick={e => { e.stopPropagation(); openModal(d.id, 'rejete') }}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: 'var(--color-danger)' }}>
                    ✗ Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Détail dossier */}
          {selected && (
            <div className="w-72 flex-shrink-0 flex flex-col gap-3">
              <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
                <div className="text-xs font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
                  Dossier complet
                </div>
                {[
                  { label: 'Nom officiel', value: selected.nom },
                  { label: 'Sigle', value: selected.sigle },
                  { label: 'Adresse', value: selected.adresse },
                  { label: 'Email', value: selected.email },
                  { label: 'Téléphone', value: selected.telephone },
                  { label: 'Administrateur', value: selected.admin },
                  { label: 'N° Réf. demande', value: selected.agrement },
                ].map(f => (
                  <div key={f.label} className="mb-2">
                    <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-muted)' }}>{f.label}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text)' }}>{f.value}</div>
                  </div>
                ))}
                <div className="mt-3">
                  <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Documents joints</div>
                  <div className="flex flex-col gap-1">
                    {selected.docs.map(doc => (
                      <div key={doc} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg"
                        style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                        <span>📎</span> {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Historique */}
      {tab === 'historique' && (
        <div className="flex flex-col gap-2">
          {hist.map(h => (
            <div key={h.id} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{h.nom}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{h.sigle} · Décision le {h.date}</div>
                </div>
                <StatusBadge statut={h.decision} />
              </div>
              <div className="text-xs p-2.5 rounded-lg" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                "{h.message}"
              </div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--color-muted)' }}>
                Par {h.agent}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ValidationPage
