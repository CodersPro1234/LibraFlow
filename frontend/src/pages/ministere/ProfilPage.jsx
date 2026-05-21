import { useState } from 'react'

const ProfilPage = () => {
  const [editMode, setEditMode] = useState(false)
  const [pwMode, setPwMode] = useState(false)
  const [agentModal, setAgentModal] = useState(false)
  const [form, setForm] = useState({
    nom: 'Ministère de l\'Éducation Nationale',
    sigle: 'MENAPLN',
    adresse: 'Avenue de l\'Éducation, Ouagadougou, Burkina Faso',
    email: 'contact@menapln.gov.bf',
    telephone: '+226 25 33 71 00',
    directeur: 'Dr. Arouna Tou',
    site: 'www.menapln.gov.bf',
  })
  const [pw, setPw] = useState({ actuel: '', nouveau: '', confirm: '' })
  const [toast, setToast] = useState(null)
  const [agents, setAgents] = useState([
    { id: 1, nom: 'Kaboré Ibrahim', email: 'i.kabore@menapln.gov.bf', role: 'Superviseur national', actif: true },
    { id: 2, nom: 'Sawadogo Mariam', email: 'm.sawadogo@menapln.gov.bf', role: 'Analyste qualité', actif: true },
    { id: 3, nom: 'Ouédraogo Seydou', email: 's.ouedraogo@menapln.gov.bf', role: 'Chargé de validation', actif: false },
  ])
  const [newAgent, setNewAgent] = useState({ nom: '', email: '', role: '' })

  const showToast = (msg, color = 'var(--color-success)') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2500)
  }

  const handleSave = () => {
    setEditMode(false)
    showToast('Informations institutionnelles mises à jour.')
  }

  const handleSavePw = () => {
    if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return
    setPwMode(false)
    setPw({ actuel: '', nouveau: '', confirm: '' })
    showToast('Mot de passe modifié.')
  }

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, actif: !a.actif } : a))
    showToast('Statut agent mis à jour.')
  }

  const handleAddAgent = () => {
    if (!newAgent.nom || !newAgent.email) return
    setAgents(prev => [...prev, { ...newAgent, id: Date.now(), actif: true }])
    setNewAgent({ nom: '', email: '', role: '' })
    setAgentModal(false)
    showToast('Agent autorisé ajouté.')
  }

  const stats = [
    { label: 'Universités actives', value: '12', color: 'var(--color-primary)' },
    { label: 'Universités en attente', value: '3', color: 'var(--color-gold)' },
    { label: 'Étudiants nationaux', value: '47 289', color: 'var(--color-success)' },
    { label: 'Documents publiés', value: '5 120', color: 'var(--color-danger)' },
  ]

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: toast.color }}>
          {toast.msg}
        </div>
      )}

      {/* Carte identité */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}>
            MEN
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>{form.nom}</div>
            <div className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>
              Sigle : <span className="font-mono font-semibold">{form.sigle}</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                ✅ Autorité nationale
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                Burkina Faso
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-2.5 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations officielles */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Informations officielles
          </div>
          {!editMode ? (
            <button onClick={() => setEditMode(true)}
              className="text-xs px-3 py-1.5 rounded-lg border font-medium"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
              ✏️ Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave}
                className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                style={{ background: 'var(--color-success)' }}>
                Enregistrer
              </button>
              <button onClick={() => setEditMode(false)}
                className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                Annuler
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Nom officiel', key: 'nom' },
            { label: 'Adresse', key: 'adresse' },
            { label: 'Email officiel', key: 'email' },
            { label: 'Téléphone', key: 'telephone' },
            { label: 'Site web', key: 'site' },
            { label: 'Directeur / Responsable', key: 'directeur' },
          ].map(f => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{f.label}</label>
              {editMode ? (
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }} />
              ) : (
                <div className="text-sm" style={{ color: 'var(--color-text)' }}>{form[f.key]}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agents autorisés */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Agents autorisés
          </div>
          <button onClick={() => setAgentModal(true)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
            style={{ background: 'var(--color-primary)' }}>
            + Ajouter
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {agents.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: 'var(--color-bg)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                style={{ background: a.actif ? 'var(--color-primary)' : 'var(--color-border)' }}>
                {a.nom.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{a.nom}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{a.role} · {a.email}</div>
              </div>
              <button onClick={() => toggleAgent(a.id)}
                className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                style={{
                  background: a.actif ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                  color: a.actif ? 'var(--color-success)' : 'var(--color-danger)',
                }}>
                {a.actif ? '✓ Actif' : '✗ Suspendu'}
              </button>
            </div>
          ))}
        </div>

        {agentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="bg-white rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-xl">
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Nouvel agent autorisé
              </div>
              {[
                { key: 'nom', label: 'Nom complet', placeholder: 'Ex: Kaboré Ibrahim' },
                { key: 'email', label: 'Email institutionnel', placeholder: 'ex@menapln.gov.bf' },
                { key: 'role', label: 'Rôle', placeholder: 'Ex: Superviseur national' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{f.label}</label>
                  <input value={newAgent[f.key]}
                    onChange={e => setNewAgent(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
                </div>
              ))}
              <div className="flex gap-2 justify-end">
                <button onClick={() => setAgentModal(false)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                  Annuler
                </button>
                <button onClick={handleAddAgent}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                  style={{ background: 'var(--color-primary)' }}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mot de passe */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Mot de passe</div>
          <button onClick={() => setPwMode(m => !m)}
            className="text-xs px-3 py-1.5 rounded-lg border font-medium"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
            {pwMode ? 'Annuler' : '🔒 Modifier'}
          </button>
        </div>
        {pwMode && (
          <div className="flex flex-col gap-3 mt-4">
            {[
              { key: 'actuel', label: 'Mot de passe actuel' },
              { key: 'nouveau', label: 'Nouveau mot de passe' },
              { key: 'confirm', label: 'Confirmer' },
            ].map(f => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{f.label}</label>
                <input type="password" value={pw[f.key]}
                  onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{
                    borderColor: f.key === 'confirm' && pw.confirm && pw.nouveau !== pw.confirm
                      ? 'var(--color-danger)' : 'var(--color-border)',
                    color: 'var(--color-text)',
                  }} />
              </div>
            ))}
            {pw.confirm && pw.nouveau !== pw.confirm && (
              <p className="text-xs" style={{ color: 'var(--color-danger)' }}>Les mots de passe ne correspondent pas.</p>
            )}
            <button onClick={handleSavePw}
              disabled={!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm}
              className="text-xs px-4 py-2 rounded-lg font-medium text-white self-end"
              style={{
                background: pw.actuel && pw.nouveau && pw.nouveau === pw.confirm
                  ? 'var(--color-primary)' : 'var(--color-border)',
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
