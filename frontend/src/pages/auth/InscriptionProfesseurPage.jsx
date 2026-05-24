import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const universites = [
  'Université Joseph Ki-Zerbo (UJK)', 'Université Nazi Boni (UNB)',
  'Université Thomas Sankara (UTS)', 'Université Ouaga II',
  "Institut Supérieur Polytechnique de Ouaga (ISPO)", "Université Saint-Thomas d'Aquin (USTA)",
]
const matieresDispo = [
  'Droit Constitutionnel', 'Droit Civil', 'Droit Public', 'Droit Pénal',
  'Mathématiques', 'Statistiques', 'Finance', 'Économie',
  'Informatique', 'Réseaux', 'Biologie', 'Chimie', 'Physique',
  'Histoire-Géo', 'Philosophie', 'Littérature',
]
const grades = ['Assistant', 'Maître-assistant', 'Maître de conférences', 'Professeur titulaire']

const ACCENT = '#f59e0b'
const ACCENT_LIGHT = '#FEF3C7'
const ACCENT_DARK = '#b45309'

const inp = (err) => ({
  width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
  color: '#111827', background: '#fff', outline: 'none', boxSizing: 'border-box',
  border: `1.5px solid ${err ? '#E24B4A' : '#D1D5DB'}`,
})

const Field = ({ label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{label}</label>
    {children}
    {error && <span style={{ fontSize: '11px', color: '#E24B4A' }}>{error}</span>}
  </div>
)

const InscriptionProfesseurPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ nom: '', email: '', universite: '', grade: '', matieres: [], motdepasse: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleMatiere = (m) => set('matieres', form.matieres.includes(m) ? form.matieres.filter(x => x !== m) : [...form.matieres, m])

  const validate1 = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Requis'
    if (!form.email.includes('@')) e.email = 'Email invalide'
    if (!form.universite) e.universite = 'Requis'
    if (!form.grade) e.grade = 'Requis'
    setErrors(e); return Object.keys(e).length === 0
  }
  const validate2 = () => {
    const e = {}
    if (!form.matieres.length) e.matieres = 'Sélectionnez au moins une matière'
    if (form.motdepasse.length < 8) e.motdepasse = 'Min. 8 caractères'
    if (form.motdepasse !== form.confirm) e.confirm = 'Ne correspond pas'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = () => { if (validate2()) { setSuccess(true); setTimeout(() => navigate('/login'), 4000) } }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 40px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '380px', width: '100%' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>Demande envoyée</div>
        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, marginBottom: '14px' }}>
          En attente de validation par <strong>{form.universite}</strong>.
        </p>
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: ACCENT_LIGHT, fontSize: '13px', color: ACCENT_DARK }}>
          📧 Email de confirmation → <strong>{form.email}</strong>
        </div>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '14px' }}>Redirection…</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#3B7FE1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📖</div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#3B7FE1' }}>LibraFlow</span>
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: '18px', padding: '28px 28px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>👨‍🏫</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Inscription professeur</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Rejoignez le réseau des enseignants</div>
            </div>
            {/* Stepper compact */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1, 2].map(s => (
                <div key={s} style={{ width: '28px', height: '6px', borderRadius: '3px', background: step >= s ? ACCENT : '#E5E7EB', transition: 'background 0.2s' }} />
              ))}
              <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '6px' }}>{step}/2</span>
            </div>
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Field label="Nom complet *" error={errors.nom}>
                <input value={form.nom} onChange={e => set('nom', e.target.value)}
                  placeholder="Ouédraogo Mamadou" style={inp(errors.nom)} />
              </Field>

              <Field label="Email professionnel *" error={errors.email}>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="o.mamadou@ujk.edu.bf" style={inp(errors.email)} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Université *" error={errors.universite}>
                  <select value={form.universite} onChange={e => set('universite', e.target.value)}
                    style={{ ...inp(errors.universite), color: form.universite ? '#111827' : '#9CA3AF' }}>
                    <option value="">Choisir…</option>
                    {universites.map(u => <option key={u}>{u}</option>)}
                  </select>
                </Field>
                <Field label="Grade *" error={errors.grade}>
                  <select value={form.grade} onChange={e => set('grade', e.target.value)}
                    style={{ ...inp(errors.grade), color: form.grade ? '#111827' : '#9CA3AF' }}>
                    <option value="">Choisir…</option>
                    {grades.map(g => <option key={g}>{g}</option>)}
                  </select>
                </Field>
              </div>

              <button onClick={() => { if (validate1()) setStep(2) }}
                style={{ width: '100%', padding: '13px', borderRadius: '11px', background: ACCENT, color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                Continuer →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                  Matières enseignées * <span style={{ fontWeight: 400, color: '#9CA3AF' }}>({form.matieres.length} choisie{form.matieres.length > 1 ? 's' : ''})</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {matieresDispo.map(m => (
                    <button key={m} type="button" onClick={() => toggleMatiere(m)}
                      style={{
                        fontSize: '12px', padding: '5px 12px', borderRadius: '100px', border: '1.5px solid',
                        cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s',
                        background: form.matieres.includes(m) ? ACCENT : 'transparent',
                        color: form.matieres.includes(m) ? '#fff' : '#6B7280',
                        borderColor: form.matieres.includes(m) ? ACCENT : '#D1D5DB',
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
                {errors.matieres && <span style={{ fontSize: '11px', color: '#E24B4A' }}>{errors.matieres}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Mot de passe *" error={errors.motdepasse}>
                  <input type="password" value={form.motdepasse} onChange={e => set('motdepasse', e.target.value)}
                    placeholder="Min. 8 caractères" style={inp(errors.motdepasse)} />
                </Field>
                <Field label="Confirmer *" error={errors.confirm}>
                  <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                    placeholder="Répéter" style={inp(errors.confirm)} />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '13px', borderRadius: '11px', background: 'transparent', border: '1.5px solid #D1D5DB', color: '#6B7280', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  ← Retour
                </button>
                <button onClick={handleSubmit}
                  style={{ flex: 2, padding: '13px', borderRadius: '11px', background: ACCENT, color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Soumettre
                </button>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: '#6B7280' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#3B7FE1', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '8px' }}>
            <Link to="/inscription" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '9px', background: '#EEF4FF', color: '#3B7FE1', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              🎓 Étudiant
            </Link>
            <Link to="/inscription/universite" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '9px', background: '#DCFCE7', color: '#1D9E75', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              🏛 Université
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default InscriptionProfesseurPage
