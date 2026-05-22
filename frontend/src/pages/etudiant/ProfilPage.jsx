import { useState } from 'react'
import useAuthStore from '../../stores/authStore'

const activiteLikes = [
  { id: 1, titre: 'Droit Constitutionnel — Chapitre 4', auteur: 'Prof. Ouédraogo Mamadou', date: '20 Mai 2026' },
  { id: 2, titre: 'Annales Mathématiques 2024/2025', auteur: 'Prof. Traoré Fatoumata', date: '18 Mai 2026' },
  { id: 3, titre: "Introduction à l'Informatique", auteur: 'Prof. Kaboré Adama', date: '15 Mai 2026' },
]

const activiteCommentaires = [
  { id: 1, titre: "TD Finance d'entreprise S2", auteur: 'Prof. Zongo Issa', commentaire: 'Merci pour ce TD très bien structuré !', date: '19 Mai 2026' },
  { id: 2, titre: 'Droit Civil — Introduction', auteur: 'Prof. Ouédraogo Mamadou', commentaire: "Est-ce qu'il y a un corrigé disponible ?", date: '16 Mai 2026' },
]

const TABS = [
  { key: 'infos', label: 'Mon profil' },
  { key: 'likes', label: 'Mes likes' },
  { key: 'commentaires', label: 'Mes commentaires' },
]

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const ProfilPage = () => {
  const { user } = useAuthStore()
  const nom = user?.name || 'Salif Kaboré'
  const initiales = nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [activeTab, setActiveTab] = useState('infos')
  const [editMode, setEditMode]   = useState(false)
  const [pwMode, setPwMode]       = useState(false)
  const [pw, setPw]               = useState({ actuel: '', nouveau: '', confirm: '' })
  const [toast, setToast]         = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }
  const handleSavePw = () => {
    if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return
    setPwMode(false); setPw({ actuel: '', nouveau: '', confirm: '' }); showToast('Mot de passe modifié.')
  }

  const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#111827', border: '1.5px solid var(--color-primary)', outline: 'none', boxSizing: 'border-box', background: '#fff' }
  const inpErr = (err) => ({ ...inp, borderColor: err ? 'var(--color-danger)' : '#D1D5DB' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50, padding: '12px 20px', borderRadius: '12px', background: 'var(--color-success)', color: '#fff', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          {toast}
        </div>
      )}

      {/* Carte profil */}
      <div style={{ ...card, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}>
            {initiales}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{nom}</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>{user?.universite || 'Université Joseph Ki-Zerbo'}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace', marginTop: '2px' }}>INE-2024-00142</div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>Étudiant</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {[
            { label: 'Favoris', value: 3, icon: '♥', color: 'var(--color-danger)' },
            { label: 'Téléchargés', value: 3, icon: '⬇', color: 'var(--color-primary)' },
            { label: 'Likes', value: activiteLikes.length, icon: '👍', color: 'var(--color-gold)' },
            { label: 'Commentaires', value: activiteCommentaires.length, icon: '💬', color: 'var(--color-success)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: '12px', background: '#F9FAFB' }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '5px', display: 'flex', gap: '4px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ flex: 1, padding: '9px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === t.key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === t.key ? '#fff' : '#6B7280',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Infos */}
      {activeTab === 'infos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  <button onClick={() => { setEditMode(false); showToast('Profil mis à jour.') }}
                    style={{ padding: '7px 14px', borderRadius: '9px', background: 'var(--color-success)', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
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
                { label: 'Nom complet', val: nom, editable: true },
                { label: 'Numéro INE', val: 'INE-2024-00142', editable: false },
                { label: 'Université', val: user?.universite || 'Université Joseph Ki-Zerbo', editable: false },
                { label: 'Email', val: 'salif.kabore@ujk.edu.bf', editable: true },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{f.label}</label>
                  {editMode && f.editable ? (
                    <input defaultValue={f.val} style={inp} />
                  ) : (
                    <div style={{ fontSize: '14px', color: f.editable ? '#111827' : '#9CA3AF' }}>
                      {f.val}{!f.editable && <span style={{ fontSize: '11px', marginLeft: '8px' }}>(non modifiable)</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: pwMode ? '18px' : '0' }}>
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
                      style={inpErr(f.key === 'confirm' && pw.confirm && pw.nouveau !== pw.confirm)} />
                  </div>
                ))}
                {pw.confirm && pw.nouveau !== pw.confirm && (
                  <p style={{ fontSize: '12px', color: 'var(--color-danger)' }}>Les mots de passe ne correspondent pas.</p>
                )}
                <button onClick={handleSavePw} disabled={!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm}
                  style={{ alignSelf: 'flex-end', padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#fff',
                    background: pw.actuel && pw.nouveau && pw.nouveau === pw.confirm ? 'var(--color-primary)' : '#D1D5DB' }}>
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Likes */}
      {activeTab === 'likes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activiteLikes.map(item => (
            <div key={item.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '20px', color: 'var(--color-danger)', flexShrink: 0 }}>♥</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.titre}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{item.auteur} · {item.date}</div>
              </div>
              <button style={{ padding: '7px 14px', borderRadius: '9px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                Lire
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Commentaires */}
      {activeTab === 'commentaires' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activiteCommentaires.map(item => (
            <div key={item.id} style={card}>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>{item.auteur} · {item.date}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>{item.titre}</div>
              <div style={{ fontSize: '13px', padding: '10px 14px', borderRadius: '10px', background: '#F9FAFB', color: '#374151', lineHeight: 1.5 }}>
                💬 « {item.commentaire} »
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default ProfilPage
