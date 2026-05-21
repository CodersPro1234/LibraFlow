import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const universites = [
  'Université Joseph Ki-Zerbo (UJK)',
  'Université Nazi Boni (UNB)',
  'Université Thomas Sankara (UTS)',
  'Université Ouaga II',
  'Institut Supérieur Polytechnique de Ouaga (ISPO)',
  'Université Saint-Thomas d\'Aquin (USTA)',
]

const matieresDispo = [
  'Droit Constitutionnel', 'Droit Civil', 'Droit Public', 'Droit Pénal',
  'Mathématiques', 'Statistiques', 'Finance', 'Économie',
  'Informatique', 'Réseaux', 'Biologie', 'Chimie', 'Physique',
  'Histoire-Géo', 'Philosophie', 'Littérature',
]

const grades = ['Assistant', 'Maître-assistant', 'Maître de conférences', 'Professeur titulaire']

const InscriptionProfesseurPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nom: '',
    email: '',
    universite: '',
    grade: '',
    matieres: [],
    motdepasse: '',
    confirm: '',
    photo: null,
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleMatiere = (m) => {
    set('matieres', form.matieres.includes(m)
      ? form.matieres.filter(x => x !== m)
      : [...form.matieres, m])
  }

  const validate1 = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Nom requis'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email valide requis'
    if (!form.universite) e.universite = 'Sélectionnez une université'
    if (!form.grade) e.grade = 'Sélectionnez un grade'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validate2 = () => {
    const e = {}
    if (form.matieres.length === 0) e.matieres = 'Sélectionnez au moins une matière'
    if (!form.motdepasse || form.motdepasse.length < 8) e.motdepasse = 'Minimum 8 caractères'
    if (form.motdepasse !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validate1()) setStep(2)
  }

  const handleSubmit = () => {
    if (!validate2()) return
    setSuccess(true)
    setTimeout(() => navigate('/login'), 4000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="bg-white rounded-2xl border p-8 max-w-sm w-full text-center flex flex-col gap-4"
          style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-4xl">⏳</div>
          <div className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            Demande envoyée
          </div>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Votre compte est en attente de validation par votre université
            (<strong>{form.universite}</strong>).
          </p>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Vous recevrez un email à <strong>{form.email}</strong> dès que votre compte sera activé.
          </p>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Redirection vers la connexion…
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-bg)' }}>
      <div className="bg-white rounded-2xl border w-full max-w-md flex flex-col gap-0 overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-lg font-bold mb-0.5" style={{ color: 'var(--color-primary)' }}>LibraFlow</div>
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Inscription — Professeur
          </div>
          <div className="flex gap-1 mt-3">
            {[1, 2].map(s => (
              <div key={s} className="h-1 flex-1 rounded-full transition-all"
                style={{ background: s <= step ? 'var(--color-primary)' : 'var(--color-border)' }} />
            ))}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
            Étape {step} sur 2 — {step === 1 ? 'Informations personnelles' : 'Matières et sécurité'}
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">

          {step === 1 && (
            <>
              {/* Nom */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Nom complet *</label>
                <input value={form.nom} onChange={e => set('nom', e.target.value)}
                  placeholder="Ex: Ouédraogo Mamadou"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: errors.nom ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text)' }} />
                {errors.nom && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.nom}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Email professionnel *</label>
                <input value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="ex: o.mamadou@ujk.edu.bf"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text)' }} />
                {errors.email && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.email}</p>}
              </div>

              {/* Université */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Université de rattachement *</label>
                <select value={form.universite} onChange={e => set('universite', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: errors.universite ? 'var(--color-danger)' : 'var(--color-border)', color: form.universite ? 'var(--color-text)' : 'var(--color-muted)' }}>
                  <option value="">-- Sélectionner --</option>
                  {universites.map(u => <option key={u}>{u}</option>)}
                </select>
                {errors.universite && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.universite}</p>}
              </div>

              {/* Grade */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Grade académique *</label>
                <select value={form.grade} onChange={e => set('grade', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: errors.grade ? 'var(--color-danger)' : 'var(--color-border)', color: form.grade ? 'var(--color-text)' : 'var(--color-muted)' }}>
                  <option value="">-- Sélectionner --</option>
                  {grades.map(g => <option key={g}>{g}</option>)}
                </select>
                {errors.grade && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.grade}</p>}
              </div>

              {/* Photo */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Photo de profil (optionnel)</label>
                <input type="file" accept="image/*" onChange={e => set('photo', e.target.files[0])}
                  className="w-full text-xs" style={{ color: 'var(--color-muted)' }} />
              </div>

              <button onClick={handleNext}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-white mt-1"
                style={{ background: 'var(--color-primary)' }}>
                Continuer →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Matières */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                  Matières enseignées * ({form.matieres.length} sélectionnée{form.matieres.length > 1 ? 's' : ''})
                </label>
                <div className="flex flex-wrap gap-2">
                  {matieresDispo.map(m => (
                    <button key={m} type="button" onClick={() => toggleMatiere(m)}
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
                {errors.matieres && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.matieres}</p>}
              </div>

              {/* Mot de passe */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Mot de passe *</label>
                <input type="password" value={form.motdepasse} onChange={e => set('motdepasse', e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: errors.motdepasse ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text)' }} />
                {errors.motdepasse && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.motdepasse}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Confirmer le mot de passe *</label>
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: errors.confirm ? 'var(--color-danger)' : 'var(--color-border)', color: 'var(--color-text)' }} />
                {errors.confirm && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{errors.confirm}</p>}
              </div>

              <div className="flex gap-2 mt-1">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                  ← Retour
                </button>
                <button onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-lg font-semibold text-sm text-white"
                  style={{ background: 'var(--color-primary)' }}>
                  Soumettre
                </button>
              </div>
            </>
          )}

          <div className="text-center text-xs" style={{ color: 'var(--color-muted)' }}>
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--color-primary)' }}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InscriptionProfesseurPage
