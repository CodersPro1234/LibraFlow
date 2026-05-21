import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const universites = [
  'Université Joseph Ki-Zerbo',
  'USTA Bobo-Dioulasso',
  'ISGE-BF Ouagadougou',
  'Université Norbert Zongo',
  'BIT Burkina',
  'Université de Ouahigouya',
  'Université de Fada N\'Gourma',
]

const INE_VALIDES = ['INE-2024-00142', 'INE-2025-00387', 'INE-2024-00291', 'INE-2026-00001']

const InscriptionPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', ine: '', universite: '', password: '', photo: null })
  const [ineStatus, setIneStatus] = useState(null) // null | 'checking' | 'valid' | 'invalid'
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const verifierINE = (val) => {
    set('ine', val)
    setIneStatus(null)
    if (val.length < 8) return
    setIneStatus('checking')
    setTimeout(() => {
      const valid = INE_VALIDES.includes(val) || /^INE-\d{4}-\d{5}$/.test(val)
      setIneStatus(valid ? 'valid' : 'invalid')
    }, 700)
  }

  const validate = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Nom requis'
    if (!form.ine.trim()) e.ine = 'Numéro INE requis'
    if (ineStatus === 'invalid') e.ine = 'INE non reconnu par Campus Faso'
    if (!form.universite) e.universite = 'Université requise'
    if (form.password.length < 6) e.password = 'Minimum 6 caractères'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="bg-white rounded-xl border p-8 w-full max-w-sm text-center"
          style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-4xl mb-3">✅</div>
          <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-success)' }}>
            Inscription réussie !
          </div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Redirection vers la connexion…
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ background: 'var(--color-bg)' }}>
      <div className="bg-white rounded-xl border p-8 w-full max-w-sm" style={{ borderColor: 'var(--color-border)' }}>

        {/* Brand */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>LibraFlow</h1>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Créer un compte étudiant</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Nom complet */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Nom complet *
            </label>
            <input
              type="text"
              placeholder="Ex : Salif Kaboré"
              value={form.nom}
              onChange={e => set('nom', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                borderColor: errors.nom ? 'var(--color-danger)' : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.nom && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.nom}</span>}
          </div>

          {/* Numéro INE */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Numéro INE *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="INE-2024-00142"
                value={form.ine}
                onChange={e => verifierINE(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none pr-24"
                style={{
                  borderColor: ineStatus === 'invalid' ? 'var(--color-danger)'
                    : ineStatus === 'valid' ? 'var(--color-success)'
                    : errors.ine ? 'var(--color-danger)' : 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              {ineStatus && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                  style={{
                    color: ineStatus === 'checking' ? 'var(--color-muted)'
                      : ineStatus === 'valid' ? 'var(--color-success)'
                      : 'var(--color-danger)',
                  }}>
                  {ineStatus === 'checking' && '...'}
                  {ineStatus === 'valid' && '✓ Vérifié'}
                  {ineStatus === 'invalid' && '✗ Invalide'}
                </span>
              )}
            </div>
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Vérifié en temps réel via API Campus Faso
            </span>
            {errors.ine && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.ine}</span>}
          </div>

          {/* Université */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Université d'appartenance *
            </label>
            <select
              value={form.universite}
              onChange={e => set('universite', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                borderColor: errors.universite ? 'var(--color-danger)' : 'var(--color-border)',
                color: form.universite ? 'var(--color-text)' : 'var(--color-muted)',
              }}>
              <option value="">Sélectionner une université</option>
              {universites.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            {errors.universite && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.universite}</span>}
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Mot de passe *
            </label>
            <input
              type="password"
              placeholder="Minimum 6 caractères"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{
                borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            {errors.password && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.password}</span>}
          </div>

          {/* Photo de profil */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Photo de profil <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(optionnel)</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                {form.nom ? form.nom.charAt(0).toUpperCase() : '?'}
              </div>
              <label className="text-xs px-3 py-1.5 rounded-lg border cursor-pointer font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                Choisir une photo
                <input type="file" accept="image/*" className="hidden" onChange={e => set('photo', e.target.files[0])} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium mt-1"
            style={{ background: 'var(--color-primary)' }}>
            Créer mon compte
          </button>

        </form>

        <div className="text-center mt-4">
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>Déjà inscrit ? </span>
          <Link to="/login" className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  )
}

export default InscriptionPage
