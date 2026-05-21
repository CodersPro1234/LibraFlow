import { useState } from 'react'
import useAuthStore from '../../stores/authStore'

const activiteLikes = [
  { id: 1, titre: 'Droit Constitutionnel — Chapitre 4', auteur: 'Prof. Ouédraogo Mamadou', date: '20 Mai 2026' },
  { id: 2, titre: 'Annales Mathématiques 2024/2025', auteur: 'Prof. Traoré Fatoumata', date: '18 Mai 2026' },
  { id: 3, titre: 'Introduction à l\'Informatique', auteur: 'Prof. Kaboré Adama', date: '15 Mai 2026' },
]

const activiteCommentaires = [
  { id: 1, titre: 'TD Finance d\'entreprise S2', auteur: 'Prof. Zongo Issa', commentaire: 'Merci pour ce TD très bien structuré !', date: '19 Mai 2026' },
  { id: 2, titre: 'Droit Civil — Introduction', auteur: 'Prof. Ouédraogo Mamadou', commentaire: 'Est-ce qu\'il y a un corrigé disponible ?', date: '16 Mai 2026' },
]

const ProfilPage = () => {
  const { user } = useAuthStore()
  const nom = user?.name || 'Salif Kaboré'
  const initiales = nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [activeTab, setActiveTab] = useState('infos')
  const [editMode, setEditMode] = useState(false)
  const [nomEdit, setNomEdit] = useState(nom)
  const [pwMode, setPwMode] = useState(false)
  const [pw, setPw] = useState({ actuel: '', nouveau: '', confirm: '' })
  const [pwSuccess, setPwSuccess] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveProfil = () => {
    setEditMode(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleSavePw = () => {
    if (!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm) return
    setPwMode(false)
    setPw({ actuel: '', nouveau: '', confirm: '' })
    setPwSuccess(true)
    setTimeout(() => setPwSuccess(false), 2500)
  }

  const tabs = [
    { key: 'infos', label: 'Mon profil' },
    { key: 'likes', label: 'Mes likes' },
    { key: 'commentaires', label: 'Mes commentaires' },
  ]

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {/* Toast */}
      {(saveSuccess || pwSuccess) && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: 'var(--color-success)' }}>
          {saveSuccess ? 'Profil mis à jour avec succès.' : 'Mot de passe modifié avec succès.'}
        </div>
      )}

      {/* Carte profil */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
            {initiales}
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{nom}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {user?.universite || 'Université Joseph Ki-Zerbo'}
            </div>
            <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--color-muted)' }}>
              INE-2024-00142
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            Étudiant
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Favoris', value: 3, icon: '♥', color: 'var(--color-danger)' },
            { label: 'Téléchargés', value: 3, icon: '⬇', color: 'var(--color-primary)' },
            { label: 'Likes donnés', value: activiteLikes.length, icon: '👍', color: 'var(--color-gold)' },
            { label: 'Commentaires', value: activiteCommentaires.length, icon: '💬', color: 'var(--color-success)' },
          ].map((s, i) => (
            <div key={i} className="text-center p-2.5 rounded-lg" style={{ background: 'var(--color-bg)' }}>
              <div className="text-sm mb-0.5">{s.icon}</div>
              <div className="text-sm font-semibold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-xl border p-1 flex gap-1" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
            style={{
              background: activeTab === t.key ? 'var(--color-primary)' : 'transparent',
              color: activeTab === t.key ? '#fff' : 'var(--color-muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Onglet Mon profil */}
      {activeTab === 'infos' && (
        <div className="flex flex-col gap-4">

          {/* Modifier les infos */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Informations personnelles
              </div>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                  ✏️ Modifier
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfil}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: 'var(--color-success)' }}>
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Nom complet</label>
                {editMode ? (
                  <input
                    type="text"
                    value={nomEdit}
                    onChange={e => setNomEdit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                    style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}
                  />
                ) : (
                  <div className="text-sm" style={{ color: 'var(--color-text)' }}>{nom}</div>
                )}
              </div>

              {[
                { label: 'Numéro INE', val: 'INE-2024-00142', editable: false },
                { label: 'Université', val: user?.universite || 'Université Joseph Ki-Zerbo', editable: false },
                { label: 'Email', val: 'salif.kabore@ujk.edu.bf', editable: editMode },
              ].map((f, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{f.label}</label>
                  {f.editable ? (
                    <input
                      type="text"
                      defaultValue={f.val}
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                      style={{ borderColor: 'var(--color-primary)', color: 'var(--color-text)' }}
                    />
                  ) : (
                    <div className="text-sm" style={{ color: 'var(--color-text)' }}>{f.val}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Changer le mot de passe */}
          <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Mot de passe
              </div>
              <button
                onClick={() => setPwMode(m => !m)}
                className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                {pwMode ? 'Annuler' : '🔒 Modifier'}
              </button>
            </div>

            {pwMode && (
              <div className="flex flex-col gap-3 mt-4">
                {[
                  { key: 'actuel', label: 'Mot de passe actuel', placeholder: '••••••' },
                  { key: 'nouveau', label: 'Nouveau mot de passe', placeholder: 'Minimum 6 caractères' },
                  { key: 'confirm', label: 'Confirmer le nouveau', placeholder: '••••••' },
                ].map(f => (
                  <div key={f.key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>{f.label}</label>
                    <input
                      type="password"
                      placeholder={f.placeholder}
                      value={pw[f.key]}
                      onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                      style={{
                        borderColor: f.key === 'confirm' && pw.confirm && pw.nouveau !== pw.confirm
                          ? 'var(--color-danger)' : 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                ))}
                {pw.confirm && pw.nouveau !== pw.confirm && (
                  <p className="text-xs" style={{ color: 'var(--color-danger)' }}>Les mots de passe ne correspondent pas.</p>
                )}
                <button
                  onClick={handleSavePw}
                  disabled={!pw.actuel || !pw.nouveau || pw.nouveau !== pw.confirm}
                  className="text-xs px-4 py-2 rounded-lg font-medium text-white self-end"
                  style={{
                    background: pw.actuel && pw.nouveau && pw.nouveau === pw.confirm
                      ? 'var(--color-primary)' : 'var(--color-border)',
                    cursor: pw.actuel && pw.nouveau && pw.nouveau === pw.confirm ? 'pointer' : 'not-allowed',
                  }}>
                  Enregistrer le mot de passe
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Onglet Likes */}
      {activeTab === 'likes' && (
        <div className="flex flex-col gap-3">
          {activiteLikes.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-4 flex items-center gap-3"
              style={{ borderColor: 'var(--color-border)' }}>
              <div className="text-lg">♥</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{item.titre}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{item.auteur} · {item.date}</div>
              </div>
              <button className="text-xs px-2 py-1 rounded-lg text-white font-medium flex-shrink-0"
                style={{ background: 'var(--color-primary)' }}>
                Lire
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Onglet Commentaires */}
      {activeTab === 'commentaires' && (
        <div className="flex flex-col gap-3">
          {activiteCommentaires.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-4"
              style={{ borderColor: 'var(--color-border)' }}>
              <div className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
                {item.auteur} · {item.date}
              </div>
              <div className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>{item.titre}</div>
              <div className="text-xs p-2.5 rounded-lg" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
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
