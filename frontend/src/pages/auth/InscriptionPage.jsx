import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const universites = [
  'Université Joseph Ki-Zerbo', 'USTA Bobo-Dioulasso', 'ISGE-BF Ouagadougou',
  'Université Norbert Zongo', 'BIT Burkina', 'Université de Ouahigouya',
  "Université de Fada N'Gourma",
]
const INE_VALIDES = ['INE-2024-00142', 'INE-2025-00387', 'INE-2024-00291', 'INE-2026-00001']
const PRIMARY = '#3B7FE1'

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

const InscriptionPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', ine: '', universite: '', password: '' })
  const [ineStatus, setIneStatus] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const verifierINE = (val) => {
    set('ine', val); setIneStatus(null)
    if (val.length < 8) return
    setIneStatus('checking')
    setTimeout(() => setIneStatus(
      INE_VALIDES.includes(val) || /^INE-\d{4}-\d{5}$/.test(val) ? 'valid' : 'invalid'
    ), 700)
  }

  const validate = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Requis'
    if (!form.ine.trim() || ineStatus === 'invalid') e.ine = ineStatus === 'invalid' ? 'INE non reconnu' : 'Requis'
    if (!form.universite) e.universite = 'Requis'
    if (form.password.length < 6) e.password = 'Min. 6 caractères'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
    setTimeout(() => navigate('/login'), 2500)
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 40px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '340px', width: '100%' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Compte créé !</div>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Bienvenue, <strong>{form.nom}</strong>. Redirection…</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📖</div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: PRIMARY }}>LibraFlow</span>
          </Link>
        </div>

        <div style={{ background: '#fff', borderRadius: '18px', padding: '28px 28px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px', paddingBottom: '18px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🎓</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>Inscription étudiant</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>Accédez à la bibliothèque nationale</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <Field label="Nom complet *" error={errors.nom}>
              <input type="text" placeholder="Salif Kaboré" value={form.nom}
                onChange={e => set('nom', e.target.value)} style={inp(errors.nom)} />
            </Field>

            <Field label="Numéro INE *" error={errors.ine}>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="INE-2024-00142" value={form.ine}
                  onChange={e => verifierINE(e.target.value)}
                  style={{ ...inp(errors.ine || ineStatus === 'invalid'), paddingRight: '90px' }} />
                {ineStatus && (
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontWeight: 600,
                    color: ineStatus === 'checking' ? '#9CA3AF' : ineStatus === 'valid' ? '#10b981' : '#E24B4A' }}>
                    {ineStatus === 'checking' ? '…' : ineStatus === 'valid' ? '✓ Vérifié' : '✗ Invalide'}
                  </span>
                )}
              </div>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Université *" error={errors.universite}>
                <select value={form.universite} onChange={e => set('universite', e.target.value)}
                  style={{ ...inp(errors.universite), color: form.universite ? '#111827' : '#9CA3AF' }}>
                  <option value="">Choisir…</option>
                  {universites.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Mot de passe *" error={errors.password}>
                <input type="password" placeholder="Min. 6 caractères" value={form.password}
                  onChange={e => set('password', e.target.value)} style={inp(errors.password)} />
              </Field>
            </div>

            <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: '11px', background: PRIMARY, color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '4px' }}>
              Créer mon compte →
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6B7280' }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color: PRIMARY, fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '8px' }}>
            <Link to="/inscription/professeur" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px', borderRadius: '9px', background: '#FEF3C7', color: '#B45309', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
              👨‍🏫 Professeur
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

export default InscriptionPage
