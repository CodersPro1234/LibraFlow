import { useState } from 'react'
import useAuthStore from '../../stores/authStore'

const matieresDispo = ['Droit Constitutionnel', 'Droit Civil', 'Droit Public', 'Mathématiques', 'Finance', 'Économie', 'Informatique', 'Biologie', 'Physique', 'Histoire-Géo']

const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#111827', border: '1.5px solid var(--color-primary)', outline: 'none', boxSizing: 'border-box', background: '#fff' }
const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const statsData = [
  { label: 'Vues totales',      value: '1 247', icon: '👁',  color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
  { label: 'Likes reçus',       value: '348',   icon: '♥',   color: 'var(--color-danger)',  bg: '#FEE2E2' },
  { label: 'Téléchargements',   value: '219',   icon: '⬇',   color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  { label: 'Abonnés',           value: '87',    icon: '👥',  color: 'var(--color-gold)',    bg: 'var(--color-gold-light)' },
  { label: 'Documents publiés', value: '12',    icon: '📄',  color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
  { label: 'Score IA moyen',    value: '87/100',icon: '🤖',  color: 'var(--color-success)', bg: 'var(--color-success-light)' },
]

const ProfilPage = () => {
  const { user } = useAuthStore()
  const nom = user?.name || 'Ouédraogo Mamadou'
  const initiales = nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [tab, setTab]           = useState('infos')
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    nom,
    email:    'o.mamadou@ujk.edu.bf',
    grade:    'Maître de conférences',
    matieres: ['Droit Constitutionnel', 'Droit Civil'],
  })
  const [pwMode, setPwMode] = useState(false)
  const [pw, setPw]         = useState({ actuel: '', nouveau: '', confirm: '' })
  const [toast, setToast]   = useState(null)

  const showToast = (msg, color = 'var(--color-success)') => { setToast({ msg, color }); setTimeout(() => setToast(null), 2500) }
  const handleSave   = () => { setEditMode(false); showToast('Profil mis à jour avec succès.') }
  const handleSavePw = () => {
    if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return
    setPwMode(false); setPw({ actuel: '', nouveau: '', confirm: '' }); showToast('Mot de passe modifié avec succès.')
  }
  const toggleMatiere = (m) => setForm(prev => ({
    ...prev,
    matieres: prev.matieres.includes(m) ? prev.matieres.filter(x => x !== m) : [...prev.matieres, m],
  }))

  const tabs = [
    { key: 'infos',    label: 'Mon profil' },
    { key: 'stats',    label: 'Statistiques' },
    { key: 'securite', label: 'Sécurité' },
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
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {initiales}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#111827', marginBottom: '3px' }}>{form.nom}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '3px' }}>{form.grade}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>
              {user?.universite || 'Université Joseph Ki-Zerbo'}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {form.matieres.map(m => (
                <span key={m} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
                  {m}
                </span>
              ))}
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                ✓ Compte validé
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '5px', display: 'flex', gap: '4px' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '9px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === t.key ? 'var(--color-primary)' : 'transparent',
              color: tab === t.key ? '#fff' : '#6B7280',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Onglet Mon profil */}
      {tab === 'infos' && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Informations personnelles</div>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Nom */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Nom complet</label>
              {editMode
                ? <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} style={inp} />
                : <div style={{ fontSize: '14px', color: '#111827' }}>{form.nom}</div>
              }
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Email professionnel</label>
              {editMode
                ? <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp} />
                : <div style={{ fontSize: '14px', color: '#111827' }}>{form.email}</div>
              }
            </div>

            {/* Grade */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Grade académique</label>
              {editMode ? (
                <select value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} style={inp}>
                  {['Assistant', 'Maître-assistant', 'Maître de conférences', 'Professeur titulaire'].map(g => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: '14px', color: '#111827' }}>{form.grade}</div>
              )}
            </div>

            {/* Université (lecture seule) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Université</label>
              <div style={{ fontSize: '14px', color: '#111827' }}>
                {user?.universite || 'Université Joseph Ki-Zerbo'}
                <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}>(non modifiable)</span>
              </div>
            </div>

            {/* Matières */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Matières enseignées</label>
              {editMode ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {matieresDispo.map(m => (
                    <button key={m} onClick={() => toggleMatiere(m)}
                      style={{ fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.15s',
                        background: form.matieres.includes(m) ? 'var(--color-primary)' : '#fff',
                        color: form.matieres.includes(m) ? '#fff' : '#6B7280',
                        border: form.matieres.includes(m) ? '1.5px solid var(--color-primary)' : '1.5px solid #E5E7EB',
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {form.matieres.map(m => (
                    <span key={m} style={{ fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onglet Statistiques */}
      {tab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
            {statsData.map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Évolution mensuelle — Vues</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
              {[38, 52, 61, 74, 88, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: i === 5 ? 'var(--color-primary)' : 'var(--color-primary-light)', height: `${h * 0.75}px` }} />
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                    {['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Onglet Sécurité */}
      {tab === 'securite' && (
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
              {[
                { key: 'actuel',  label: 'Mot de passe actuel' },
                { key: 'nouveau', label: 'Nouveau mot de passe' },
                { key: 'confirm', label: 'Confirmer le nouveau' },
              ].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
                  <input type="password" placeholder="••••••" value={pw[f.key]}
                    onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
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
      )}

    </div>
  )
}

export default ProfilPage
