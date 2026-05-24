import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ACCENT = '#10b981'
const ACCENT_LIGHT = '#DCFCE7'

const inp = (err) => ({
  width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px',
  color: '#111827', background: '#fff', outline: 'none', boxSizing: 'border-box',
  border: `1.5px solid ${err ? '#E24B4A' : '#D1D5DB'}`,
})

const Field = ({ label, hint, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
    <label style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>
      {label}{hint && <span style={{ fontWeight: 400, color: '#9CA3AF', marginLeft: '5px' }}>{hint}</span>}
    </label>
    {children}
    {error && <span style={{ fontSize: '10px', color: '#E24B4A' }}>{error}</span>}
  </div>
)

const InscriptionUniversitePage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ nom: '', adresse: '', email: '', telephone: '', admin: '', motdepasse: '', confirm: '', agrement: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate1 = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Requis'
    if (!form.adresse.trim()) e.adresse = 'Requis'
    if (!form.email.includes('@')) e.email = 'Email invalide'
    if (!form.admin.trim()) e.admin = 'Requis'
    setErrors(e); return Object.keys(e).length === 0
  }

  const validate2 = () => {
    const e = {}
    if (form.motdepasse.length < 8) e.motdepasse = 'Min. 8 caractères'
    if (form.motdepasse !== form.confirm) e.confirm = 'Ne correspond pas'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate2()) { setSuccess(true); setTimeout(() => navigate('/login'), 4500) }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 40px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '380px', width: '100%' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏛</div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>Dossier transmis</div>
        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, marginBottom: '14px' }}>
          Votre demande a été envoyée au <strong>MENAPLN</strong>.
        </p>
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: '#FEF3C7', fontSize: '13px', color: '#b45309', marginBottom: '14px' }}>
          ⏳ Délai : <strong>5 à 10 jours</strong> · Email → <strong>{form.email}</strong>
        </div>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Redirection…</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#3B7FE1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📖</div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#3B7FE1' }}>LibraFlow</span>
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px 22px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🏛</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Inscription université</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Dossier d'accréditation au MENAPLN</div>
            </div>
            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1, 2].map(s => (
                <div key={s} style={{ width: '24px', height: '5px', borderRadius: '3px', background: step >= s ? ACCENT : '#E5E7EB', transition: 'background 0.2s' }} />
              ))}
              <span style={{ fontSize: '10px', color: '#9CA3AF', marginLeft: '4px' }}>{step}/2</span>
            </div>
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <Field label="Nom officiel de l'établissement *" error={errors.nom}>
                <input value={form.nom} onChange={e => set('nom', e.target.value)}
                  placeholder="Ex: Université Privée de Bobo-Dioulasso" style={inp(errors.nom)} />
              </Field>

              <Field label="Adresse physique *" error={errors.adresse}>
                <input value={form.adresse} onChange={e => set('adresse', e.target.value)}
                  placeholder="Av. de l'Indépendance, Bobo-Dioulasso" style={inp(errors.adresse)} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Email institutionnel *" error={errors.email}>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="admin@univ.edu.bf" style={inp(errors.email)} />
                </Field>
                <Field label="Téléphone">
                  <input value={form.telephone} onChange={e => set('telephone', e.target.value)}
                    placeholder="+226 XX XX XX XX" style={inp(false)} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Administrateur principal *" error={errors.admin}>
                  <input value={form.admin} onChange={e => set('admin', e.target.value)}
                    placeholder="Dr. Lassina Coulibaly" style={inp(errors.admin)} />
                </Field>
                <Field label="N° d'agrément" hint="(optionnel)">
                  <input value={form.agrement} onChange={e => set('agrement', e.target.value)}
                    placeholder="MIN-EDU-2018-0042" style={{ ...inp(false), fontFamily: 'monospace' }} />
                </Field>
              </div>

              <button onClick={() => { if (validate1()) setStep(2) }}
                style={{ width: '100%', padding: '11px', borderRadius: '10px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '2px' }}>
                Continuer →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

              <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#F0F9FF', border: '1px solid #BAE6FD', fontSize: '11px', color: '#0369a1' }}>
                📋 Établissement : <strong>{form.nom}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Mot de passe admin *" error={errors.motdepasse}>
                  <input type="password" value={form.motdepasse} onChange={e => set('motdepasse', e.target.value)}
                    placeholder="Min. 8 caractères" style={inp(errors.motdepasse)} />
                </Field>
                <Field label="Confirmer *" error={errors.confirm}>
                  <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                    placeholder="Répéter" style={inp(errors.confirm)} />
                </Field>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#F0F4FF', border: '1px solid #BFDBFE', fontSize: '11px', color: '#1e40af', lineHeight: 1.5 }}>
                🏛 Dossier examiné par le <strong>MENAPLN</strong> sous 5 à 10 jours ouvrables.
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'transparent', border: '1.5px solid #D1D5DB', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  ← Retour
                </button>
                <button onClick={handleSubmit}
                  style={{ flex: 2, padding: '11px', borderRadius: '10px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Soumettre au MENAPLN
                </button>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#3B7FE1', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </div>

          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '8px' }}>
            <Link to="/inscription" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '9px', background: '#EEF4FF', color: '#3B7FE1', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              🎓 Étudiant
            </Link>
            <Link to="/inscription/professeur" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '9px', background: '#FEF3C7', color: '#B45309', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              👨‍🏫 Professeur
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

export default InscriptionUniversitePage
