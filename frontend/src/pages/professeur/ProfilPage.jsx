import { useState } from 'react'
import useAuthStore from '../../stores/authStore'

const matieresDispo = ['Droit Constitutionnel', 'Droit Civil', 'Droit Public', 'Mathématiques', 'Finance', 'Économie', 'Informatique', 'Biologie', 'Physique', 'Histoire-Géo']

const ProfilPage = () => {
  const { user } = useAuthStore()
  const nom = user?.name || 'Ouédraogo Mamadou'
  const initiales = nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [tab, setTab] = useState('infos')
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    nom,
    email: 'o.mamadou@ujk.edu.bf',
    grade: 'Maître de conférences',
    matieres: ['Droit Constitutionnel', 'Droit Civil'],
  })
  const [pwMode, setPwMode] = useState(false)
  const [pw, setPw] = useState({ actuel: '', nouveau: '', confirm: '' })
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSave = () => {
    setEditMode(false)
    showToast('Profil mis à jour avec succès.')
  }

  const handleSavePw = () => {
    if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return
    setPwMode(false)
    setPw({ actuel: '', nouveau: '', confirm: '' })
    showToast('Mot de passe modifié avec succès.')
  }

  const toggleMatiere = (m) => {
    setForm(prev => ({
      ...prev,
      matieres: prev.matieres.includes(m)
        ? prev.matieres.filter(x => x !== m)
        : [...prev.matieres, m],
    }))
  }

  const stats = [
    { label: 'Vues totales', value: '1 247', icon: '👁', color: 'var(--color-primary)' },
    { label: 'Likes reçus', value: '348', icon: '♥', color: 'var(--color-danger)' },
    { label: 'Téléchargements', value: '219', icon: '⬇', color: 'var(--color-success)' },
    { label: 'Abonnés', value: '87', icon: '👥', color: 'var(--color-gold)' },
    { label: 'Documents publiés', value: '12', icon: '📄', color: 'var(--color-primary)' },
    { label: 'Score IA moyen', value: '87/100', icon: '🤖', color: 'var(--color-success)' },
  ]

  const tabs = [
    { key: 'infos', label: 'Mon profil' },
    { key: 'stats', label: 'Statistiques' },
    { key: 'securite', label: 'Sécurité' },
  ]

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: 'var(--color-success)' }}>
          {toast}
        </div>
      )}

      {/* Carte identité */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}>
            {initiales}
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{form.nom}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{form.grade}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {user?.universite || 'Université Joseph Ki-Zerbo'}
            </div>
            <div className="flex gap-1.5 flex-wrap mt-2">
              {form.matieres.map(m => (
                <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
            style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            ✓ Compte validé
          </span>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl border p-1 flex gap-1" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
            style={{
              background: tab === t.key ? 'var(--color-primary)' : 'transparent',
              color: tab === t.key ? '#fff' : 'var(--color-muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Onglet Mon profil */}
      {tab === 'infos' && (
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              Informations personnelles
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
            {/* Nom */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Nom complet</label>
              {editMode ? (
                <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }} />
              ) : (
                <div className="text-sm" style={{ color: 'var(--color-text)' }}>{form.nom}</div>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Email professionnel</label>
              {editMode ? (
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }} />
              ) : (
                <div className="text-sm" style={{ color: 'var(--color-text)' }}>{form.email}</div>
              )}
            </div>

            {/* Grade */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Grade académique</label>
              {editMode ? (
                <select value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}>
                  {['Assistant', 'Maître-assistant', 'Maître de conférences', 'Professeur titulaire'].map(g => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <div className="text-sm" style={{ color: 'var(--color-text)' }}>{form.grade}</div>
              )}
            </div>

            {/* Université */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Université</label>
              <div className="text-sm" style={{ color: 'var(--color-text)' }}>
                {user?.universite || 'Université Joseph Ki-Zerbo'}
                <span className="text-xs ml-2" style={{ color: 'var(--color-muted)' }}>(non modifiable)</span>
              </div>
            </div>

            {/* Matières */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Matières enseignées</label>
              {editMode ? (
                <div className="flex flex-wrap gap-2">
                  {matieresDispo.map(m => (
                    <button key={m} onClick={() => toggleMatiere(m)}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                      style={{
                        background: form.matieres.includes(m) ? 'var(--color-primary)' : 'transparent',
                        color: form.matieres.includes(m) ? '#fff' : 'var(--color-muted)',
                        borderColor: form.matieres.includes(m) ? 'var(--color-primary)' : 'var(--color-border)',
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.matieres.map(m => (
                    <span key={m} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onglet Stats */}
      {tab === 'stats' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border p-4 text-center"
                style={{ borderColor: 'var(--color-border)' }}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-lg font-semibold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Évolution mensuelle — Vues
            </div>
            <div className="flex items-end gap-2" style={{ height: '80px' }}>
              {[38, 52, 61, 74, 88, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t" style={{ height: `${h * 0.7}px`, background: i === 5 ? 'var(--color-primary)' : 'var(--color-primary-light)' }} />
                  <span className="text-xs" style={{ color: 'var(--color-muted)', fontSize: '9px' }}>
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
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Mot de passe</div>
            <button onClick={() => setPwMode(m => !m)}
              className="text-xs px-3 py-1.5 rounded-lg border font-medium"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
              {pwMode ? 'Annuler' : '🔒 Modifier'}
            </button>
          </div>
          {pwMode && (
            <div className="flex flex-col gap-3">
              {[
                { key: 'actuel', label: 'Mot de passe actuel' },
                { key: 'nouveau', label: 'Nouveau mot de passe' },
                { key: 'confirm', label: 'Confirmer le nouveau' },
              ].map(f => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{f.label}</label>
                  <input type="password" placeholder="••••••" value={pw[f.key]}
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
      )}

    </div>
  )
}

export default ProfilPage
