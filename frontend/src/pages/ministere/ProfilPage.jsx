import { useState } from 'react'

const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#111827', border: '1.5px solid var(--color-primary)', outline: 'none', boxSizing: 'border-box', background: '#fff' }
const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const ProfilPage = () => {
  const [editMode, setEditMode]   = useState(false)
  const [pwMode, setPwMode]       = useState(false)
  const [agentModal, setAgentModal] = useState(false)
  const [form, setForm] = useState({
    nom:       "Ministère de l'Éducation Nationale",
    sigle:     'MENAPLN',
    adresse:   'Avenue de l\'Éducation, Ouagadougou, Burkina Faso',
    email:     'contact@menapln.gov.bf',
    telephone: '+226 25 33 71 00',
    directeur: 'Dr. Arouna Tou',
    site:      'www.menapln.gov.bf',
  })
  const [pw, setPw] = useState({ actuel: '', nouveau: '', confirm: '' })
  const [toast, setToast] = useState(null)
  const [agents, setAgents] = useState([
    { id: 1, nom: 'Kaboré Ibrahim',    email: 'i.kabore@menapln.gov.bf',    role: 'Superviseur national',  actif: true },
    { id: 2, nom: 'Sawadogo Mariam',   email: 'm.sawadogo@menapln.gov.bf',  role: 'Analyste qualité',      actif: true },
    { id: 3, nom: 'Ouédraogo Seydou',  email: 's.ouedraogo@menapln.gov.bf', role: 'Chargé de validation',  actif: false },
  ])
  const [newAgent, setNewAgent] = useState({ nom: '', email: '', role: '' })

  const showToast = (msg, color = 'var(--color-success)') => { setToast({ msg, color }); setTimeout(() => setToast(null), 2500) }
  const handleSave    = () => { setEditMode(false); showToast('Informations institutionnelles mises à jour.') }
  const handleSavePw  = () => { if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return; setPwMode(false); setPw({ actuel: '', nouveau: '', confirm: '' }); showToast('Mot de passe modifié.') }
  const toggleAgent   = (id) => { setAgents(prev => prev.map(a => a.id === id ? { ...a, actif: !a.actif } : a)); showToast('Statut agent mis à jour.') }
  const handleAddAgent = () => { if (!newAgent.nom || !newAgent.email) return; setAgents(prev => [...prev, { ...newAgent, id: Date.now(), actif: true }]); setNewAgent({ nom: '', email: '', role: '' }); setAgentModal(false); showToast('Agent autorisé ajouté.') }

  const stats = [
    { label: 'Universités actives',    value: '12',    color: 'var(--color-primary)' },
    { label: 'En attente',             value: '3',     color: 'var(--color-gold)' },
    { label: 'Étudiants nationaux',    value: '47 289', color: 'var(--color-success)' },
    { label: 'Documents publiés',      value: '5 120', color: 'var(--color-danger)' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50, padding: '12px 20px', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: toast.color }}>
          {toast.msg}
        </div>
      )}

      {/* Carte identité */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            MEN
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#111827', marginBottom: '3px' }}>{form.nom}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>
              Sigle : <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#374151' }}>{form.sigle}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>✅ Autorité nationale</span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: '#ede9fe', color: '#6d28d9' }}>Burkina Faso</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '12px', background: '#F9FAFB' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations officielles */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Informations officielles</div>
          {!editMode ? (
            <button onClick={() => setEditMode(true)}
              style={{ padding: '7px 14px', borderRadius: '9px', border: '1.5px solid var(--color-primary)', background: '#fff', color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              ✏️ Modifier
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSave}
                style={{ padding: '7px 14px', borderRadius: '9px', background: 'var(--color-success)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Enregistrer
              </button>
              <button onClick={() => setEditMode(false)}
                style={{ padding: '7px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Annuler
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Nom officiel', key: 'nom' }, { label: 'Adresse', key: 'adresse' },
            { label: 'Email officiel', key: 'email' }, { label: 'Téléphone', key: 'telephone' },
            { label: 'Site web', key: 'site' }, { label: 'Directeur / Responsable', key: 'directeur' },
          ].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
              {editMode ? (
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inp} />
              ) : (
                <div style={{ fontSize: '14px', color: '#111827' }}>{form[f.key]}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agents autorisés */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Agents autorisés</div>
          <button onClick={() => setAgentModal(true)}
            style={{ padding: '7px 14px', borderRadius: '9px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            + Ajouter
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {agents.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', background: '#F9FAFB' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0,
                background: a.actif ? 'var(--color-primary)' : '#9CA3AF',
              }}>
                {a.nom.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{a.nom}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>{a.role} · {a.email}</div>
              </div>
              <button onClick={() => toggleAgent(a.id)}
                style={{ fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '100px', border: 'none', cursor: 'pointer', flexShrink: 0,
                  background: a.actif ? 'var(--color-success-light)' : '#FEE2E2',
                  color: a.actif ? 'var(--color-success)' : 'var(--color-danger)',
                }}>
                {a.actif ? '✓ Actif' : '✗ Suspendu'}
              </button>
            </div>
          ))}
        </div>

        {/* Modal ajout agent */}
        {agentModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '380px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>Nouvel agent autorisé</div>
              {[
                { key: 'nom', label: 'Nom complet', placeholder: 'Ex: Kaboré Ibrahim' },
                { key: 'email', label: 'Email institutionnel', placeholder: 'ex@menapln.gov.bf' },
                { key: 'role', label: 'Rôle', placeholder: 'Ex: Superviseur national' },
              ].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
                  <input value={newAgent[f.key]} onChange={e => setNewAgent(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ ...inp, border: '1.5px solid #E5E7EB' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setAgentModal(false)}
                  style={{ padding: '9px 18px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleAddAgent}
                  style={{ padding: '9px 18px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mot de passe */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: pwMode ? '18px' : 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Mot de passe</div>
          <button onClick={() => setPwMode(m => !m)}
            style={{ padding: '7px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {pwMode ? 'Annuler' : '🔒 Modifier'}
          </button>
        </div>
        {pwMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[{ key: 'actuel', label: 'Mot de passe actuel' }, { key: 'nouveau', label: 'Nouveau mot de passe' }, { key: 'confirm', label: 'Confirmer le nouveau' }].map(f => (
              <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
                <input type="password" value={pw[f.key]} onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ ...inp, borderColor: f.key === 'confirm' && pw.confirm && pw.nouveau !== pw.confirm ? 'var(--color-danger)' : 'var(--color-primary)' }} />
              </div>
            ))}
            {pw.confirm && pw.nouveau !== pw.confirm && (
              <p style={{ fontSize: '12px', color: 'var(--color-danger)', margin: 0 }}>Les mots de passe ne correspondent pas.</p>
            )}
            <button onClick={handleSavePw} disabled={!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm}
              style={{ alignSelf: 'flex-end', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#fff',
                background: pw.actuel && pw.nouveau && pw.nouveau === pw.confirm ? 'var(--color-primary)' : '#D1D5DB',
              }}>
              Enregistrer
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default ProfilPage
