import { useState } from 'react'

const ProfilPage = () => {
  const [editMode, setEditMode] = useState(false)
  const [pwMode, setPwMode] = useState(false)
  const [apercu, setApercu] = useState(false)
  const [form, setForm] = useState({
    nom: 'Université Joseph Ki-Zerbo',
    adresse: '03 BP 7021, Ouagadougou 03, Burkina Faso',
    email: 'contact@ujk.edu.bf',
    telephone: '+226 25 30 70 64',
    agrement: 'MIN-EDU-2018-0042',
    admin: 'Admin UJK-Zerbo',
    site: 'www.ujk.edu.bf',
  })
  const [pw, setPw] = useState({ actuel: '', nouveau: '', confirm: '' })
  const [toast, setToast] = useState(null)

  const showToast = (msg, color = 'var(--color-success)') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2500)
  }

  const handleSave = () => {
    setEditMode(false)
    showToast('Profil institutionnel mis à jour.')
  }

  const handleSavePw = () => {
    if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return
    setPwMode(false)
    setPw({ actuel: '', nouveau: '', confirm: '' })
    showToast('Mot de passe administrateur modifié.')
  }

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
            UJK
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>{form.nom}</div>
            <div className="text-xs mb-1" style={{ color: 'var(--color-muted)' }}>Centre · Ouagadougou · Burkina Faso</div>
            <div className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
              N° agrément : <span className="font-mono">{form.agrement}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                ✅ Approuvée par le Ministère
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                Depuis Jan 2020
              </span>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Étudiants', value: '4 218', color: 'var(--color-primary)' },
            { label: 'Professeurs', value: '38', color: 'var(--color-gold)' },
            { label: 'Documents', value: '840', color: 'var(--color-success)' },
            { label: 'Vues totales', value: '98k', color: 'var(--color-danger)' },
          ].map((s, i) => (
            <div key={i} className="text-center p-2.5 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations institutionnelles */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Informations institutionnelles
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
            { label: 'Adresse physique', key: 'adresse' },
            { label: 'Email officiel', key: 'email' },
            { label: 'Téléphone', key: 'telephone' },
            { label: 'Site web', key: 'site' },
            { label: 'Nom de l\'administrateur', key: 'admin' },
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

      {/* Aperçu page publique */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setApercu(a => !a)}
          className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold"
          style={{ color: 'var(--color-text)' }}>
          <span>🌐 Aperçu — page publique étudiants</span>
          <span style={{ color: 'var(--color-muted)' }}>{apercu ? '▲' : '▼'}</span>
        </button>
        {apercu && (
          <div className="border-t p-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}>
            <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'var(--color-primary)' }}>UJK</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{form.nom}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Ouagadougou · Centre</div>
                </div>
                <button className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                  style={{ background: 'var(--color-success)' }}>
                  ✓ Suivie
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Étudiants', value: '4 218' },
                  { label: 'Professeurs', value: '38' },
                  { label: 'Documents', value: '840' },
                ].map((s, i) => (
                  <div key={i} className="p-2 rounded-lg" style={{ background: 'var(--color-bg)' }}>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{s.value}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-muted)' }}>
              Aperçu tel que les étudiants voient la page de votre université
            </p>
          </div>
        )}
      </div>

      {/* Modifier mot de passe */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Mot de passe administrateur</div>
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
                <input type="password" value={pw[f.key]} onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
              </div>
            ))}
            <button onClick={handleSavePw}
              className="text-xs px-4 py-2 rounded-lg font-medium text-white self-end"
              style={{ background: 'var(--color-primary)' }}>
              Enregistrer
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default ProfilPage
