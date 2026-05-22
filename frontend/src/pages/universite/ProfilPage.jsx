import { useState } from 'react'

const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#111827', border: '1.5px solid var(--color-primary)', outline: 'none', boxSizing: 'border-box', background: '#fff' }
const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const ProfilPage = () => {
  const [editMode, setEditMode] = useState(false)
  const [pwMode, setPwMode]     = useState(false)
  const [apercu, setApercu]     = useState(false)
  const [form, setForm] = useState({
    nom:       'Université Joseph Ki-Zerbo',
    adresse:   '03 BP 7021, Ouagadougou 03, Burkina Faso',
    email:     'contact@ujk.edu.bf',
    telephone: '+226 25 30 70 64',
    agrement:  'MIN-EDU-2018-0042',
    admin:     'Admin UJK-Zerbo',
    site:      'www.ujk.edu.bf',
  })
  const [pw, setPw] = useState({ actuel: '', nouveau: '', confirm: '' })
  const [toast, setToast] = useState(null)

  const showToast = (msg, color = 'var(--color-success)') => { setToast({ msg, color }); setTimeout(() => setToast(null), 2500) }
  const handleSave   = () => { setEditMode(false); showToast('Profil institutionnel mis à jour.') }
  const handleSavePw = () => {
    if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return
    setPwMode(false); setPw({ actuel: '', nouveau: '', confirm: '' }); showToast('Mot de passe administrateur modifié.')
  }

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
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            UJK
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#111827', marginBottom: '3px' }}>{form.nom}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '3px' }}>Centre · Ouagadougou · Burkina Faso</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>
              N° agrément : <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#374151' }}>{form.agrement}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                ✅ Approuvée par le Ministère
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                Depuis Jan 2020
              </span>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {[
            { label: 'Étudiants',   value: '4 218', color: 'var(--color-primary)' },
            { label: 'Professeurs', value: '38',    color: 'var(--color-gold)' },
            { label: 'Documents',   value: '840',   color: 'var(--color-success)' },
            { label: 'Vues totales', value: '98k',  color: 'var(--color-danger)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '12px', background: '#F9FAFB' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Informations institutionnelles */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Informations institutionnelles</div>
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
            { label: 'Nom officiel', key: 'nom' }, { label: 'Adresse physique', key: 'adresse' },
            { label: 'Email officiel', key: 'email' }, { label: 'Téléphone', key: 'telephone' },
            { label: 'Site web', key: 'site' }, { label: "Nom de l'administrateur", key: 'admin' },
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

      {/* Aperçu page publique */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <button onClick={() => setApercu(a => !a)}
          style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>🌐 Aperçu — page publique étudiants</span>
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{apercu ? '▲' : '▼'}</span>
        </button>
        {apercu && (
          <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px 20px', background: '#F9FAFB' }}>
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff' }}>UJK</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{form.nom}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>Ouagadougou · Centre</div>
                </div>
                <button style={{ padding: '7px 14px', borderRadius: '9px', background: 'var(--color-success)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>✓ Suivie</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                {[['4 218', 'Étudiants'], ['38', 'Professeurs'], ['840', 'Documents']].map(([v, l], i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', background: '#F9FAFB' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>{v}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center', marginTop: '10px', margin: '10px 0 0' }}>
              Aperçu tel que les étudiants voient la page de votre université
            </p>
          </div>
        )}
      </div>

      {/* Mot de passe */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: pwMode ? '18px' : 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Mot de passe administrateur</div>
          <button onClick={() => setPwMode(m => !m)}
            style={{ padding: '7px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            {pwMode ? 'Annuler' : '🔒 Modifier'}
          </button>
        </div>
        {pwMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[{ key: 'actuel', label: 'Mot de passe actuel' }, { key: 'nouveau', label: 'Nouveau mot de passe' }, { key: 'confirm', label: 'Confirmer' }].map(f => (
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
