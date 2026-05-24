import { useState } from 'react'

const initialDossiers = [
  { id: 1, nom: 'Université Privée de Bobo-Dioulasso', sigle: 'UPBD', adresse: 'Bobo-Dioulasso, Houet, Burkina Faso', email: 'admin@upbd.edu.bf', telephone: '+226 20 97 14 52', agrement: 'MIN-EDU-REQ-2026-007', admin: 'Dr. Lassina Coulibaly', dateSubmit: '2026-05-18', docs: ['Statuts officiels', 'Liste des fondateurs', 'Plan pédagogique', 'Rapport financier'], statut: 'en_attente' },
  { id: 2, nom: 'Institut Supérieur de Génie Civil', sigle: 'ISGC', adresse: 'Ouagadougou, Kadiogo, Burkina Faso', email: 'direction@isgc.edu.bf', telephone: '+226 25 41 09 33', agrement: 'MIN-EDU-REQ-2026-005', admin: 'Ing. Moussa Traoré', dateSubmit: '2026-05-16', docs: ['Statuts officiels', 'Accréditation internationale', 'Plan pédagogique'], statut: 'en_attente' },
  { id: 3, nom: 'École Supérieure de Commerce de Koudougou', sigle: 'ESC-K', adresse: 'Koudougou, Boulkiemdé, Burkina Faso', email: 'info@esck.edu.bf', telephone: '+226 25 44 12 78', agrement: 'MIN-EDU-REQ-2026-003', admin: 'M. Abdoulaye Nikiema', dateSubmit: '2026-05-12', docs: ['Statuts officiels', 'Plan pédagogique', 'Rapport financier'], statut: 'en_attente' },
]

const historique = [
  { id: 101, nom: 'Institut Supérieur Polytechnique de Ouaga', sigle: 'ISPO', date: '2026-04-30', decision: 'approuve', agent: 'Kaboré Ibrahim', message: 'Dossier complet. Infrastructure validée sur site.' },
  { id: 102, nom: 'École de Formation en Santé du Faso', sigle: 'EFSF', date: '2026-04-22', decision: 'rejete', agent: 'Sawadogo Mariam', message: 'Dossier incomplet : absence de rapport financier et plan pédagogique insuffisant.' },
  { id: 103, nom: 'Université Numérique du Sahel', sigle: 'UNS', date: '2026-03-15', decision: 'approuve', agent: 'Kaboré Ibrahim', message: 'Tous les documents conformes. Agrément accordé.' },
]

const badgeCfg = {
  en_attente: { label: 'En attente', bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  approuve:   { label: 'Approuvée',  bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  rejete:     { label: 'Rejetée',    bg: '#FEE2E2',                    color: 'var(--color-danger)' },
}

const Badge = ({ statut }) => {
  const c = badgeCfg[statut]
  return <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: c.bg, color: c.color }}>{c.label}</span>
}

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '18px 20px' }

const ValidationPage = () => {
  const [dossiers, setDossiers] = useState(initialDossiers)
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState(null)
  const [tab, setTab] = useState('attente')
  const [hist, setHist] = useState(historique)

  const showToast = (msg, color = 'var(--color-success)') => {
    setToast({ msg, color }); setTimeout(() => setToast(null), 2500)
  }

  const openModal = (id, action) => { setModal({ id, action }); setMessage('') }

  const confirmer = () => {
    if (!message.trim()) return
    const dossier = dossiers.find(d => d.id === modal.id)
    setHist(prev => [{ id: Date.now(), nom: dossier.nom, sigle: dossier.sigle, date: new Date().toISOString().split('T')[0], decision: modal.action, agent: 'Dr. Arouna Tou', message }, ...prev])
    setDossiers(prev => prev.filter(d => d.id !== modal.id))
    if (selected?.id === modal.id) setSelected(null)
    showToast(modal.action === 'approuve' ? 'Université approuvée avec succès.' : 'Dossier rejeté.',
      modal.action === 'approuve' ? 'var(--color-success)' : 'var(--color-danger)')
    setModal(null)
  }

  const enAttente = dossiers.filter(d => d.statut === 'en_attente')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50, padding: '12px 20px', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: toast.color }}>
          {toast.msg}
        </div>
      )}

      {/* Modal décision */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '420px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
              {modal.action === 'approuve' ? '✅ Approuver l\'université' : '❌ Rejeter le dossier'}
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Un message officiel sera envoyé à l'université. Ce message est <strong>obligatoire</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                Message officiel {modal.action === 'rejete' ? '(motifs de rejet)' : '(remarques)'}
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
                placeholder={modal.action === 'approuve' ? 'Ex: Dossier complet. Infrastructure validée. Agrément accordé pour 2026–2031.' : 'Ex: Dossier incomplet — absence de rapport financier.'}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '13px', color: '#111827', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>
            {!message.trim() && <p style={{ fontSize: '12px', color: 'var(--color-danger)', margin: 0 }}>Le message est obligatoire.</p>}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)}
                style={{ padding: '9px 18px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Annuler
              </button>
              <button onClick={confirmer} disabled={!message.trim()}
                style={{ padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#fff',
                  background: !message.trim() ? '#D1D5DB' : modal.action === 'approuve' ? 'var(--color-success)' : 'var(--color-danger)',
                }}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '5px', display: 'flex', gap: '4px' }}>
        {[
          { key: 'attente', label: `En attente (${enAttente.length})` },
          { key: 'historique', label: `Historique (${hist.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setSelected(null) }}
            style={{ flex: 1, padding: '9px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === t.key ? 'var(--color-primary)' : 'transparent',
              color: tab === t.key ? '#fff' : '#6B7280',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab En attente */}
      {tab === 'attente' && (
        <div style={{ display: 'flex', gap: '14px' }}>
          {/* Liste */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {enAttente.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>✅</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>Aucun dossier en attente</div>
              </div>
            )}
            {enAttente.map(d => (
              <div key={d.id} onClick={() => setSelected(d)}
                style={{ ...card, cursor: 'pointer',
                  borderColor: selected?.id === d.id ? 'var(--color-primary)' : '#E5E7EB',
                  borderLeftWidth: selected?.id === d.id ? '4px' : '1px',
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '3px' }}>{d.nom}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{d.sigle} · {d.adresse.split(',')[0]}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Soumis le {d.dateSubmit}</div>
                  </div>
                  <Badge statut={d.statut} />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={e => { e.stopPropagation(); openModal(d.id, 'approuve') }}
                    style={{ padding: '8px 16px', borderRadius: '9px', background: 'var(--color-success)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    ✓ Approuver
                  </button>
                  <button onClick={e => { e.stopPropagation(); openModal(d.id, 'rejete') }}
                    style={{ padding: '8px 14px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    ✗ Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Détail dossier */}
          {selected && (
            <div style={{ width: '280px', flexShrink: 0 }}>
              <div style={card}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>Dossier complet</div>
                {[
                  { label: 'Nom officiel', value: selected.nom },
                  { label: 'Sigle', value: selected.sigle },
                  { label: 'Adresse', value: selected.adresse },
                  { label: 'Email', value: selected.email },
                  { label: 'Téléphone', value: selected.telephone },
                  { label: 'Administrateur', value: selected.admin },
                  { label: 'N° Réf. demande', value: selected.agrement },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', marginBottom: '2px' }}>{f.label}</div>
                    <div style={{ fontSize: '13px', color: '#111827' }}>{f.value}</div>
                  </div>
                ))}
                <div style={{ marginTop: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', marginBottom: '8px' }}>Documents joints</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selected.docs.map(doc => (
                      <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '8px 12px', borderRadius: '9px', background: 'var(--color-success-light)', color: 'var(--color-success)', fontWeight: 600 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {hist.map(h => (
            <div key={h.id} style={card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>{h.nom}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{h.sigle} · Décision le {h.date}</div>
                </div>
                <Badge statut={h.decision} />
              </div>
              <div style={{ fontSize: '13px', padding: '10px 14px', borderRadius: '10px', background: '#F9FAFB', color: '#374151', lineHeight: 1.5 }}>
                « {h.message} »
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>Par {h.agent}</div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ValidationPage
