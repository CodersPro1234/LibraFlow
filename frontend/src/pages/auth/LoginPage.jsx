import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const roleConfig = {
  etudiant:   { label: 'Étudiant',   icon: '🎓', name: 'Salif Kaboré',      universite: 'UJK-Zerbo', route: '/etudiant/feed' },
  professeur: { label: 'Professeur', icon: '👨‍🏫', name: 'Ouédraogo Mamadou', universite: 'UJK-Zerbo', route: '/professeur/feed' },
  universite: { label: 'Université', icon: '🏛',  name: 'Admin UJK-Zerbo',   universite: 'UJK-Zerbo', route: '/universite/dashboard' },
  ministere:  { label: 'Ministère',  icon: '🏢',  name: 'MENAPLN',           universite: '',           route: '/ministere/dashboard' },
}

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  const handleLogin = (role) => {
    const cfg = roleConfig[role]
    login({ name: cfg.name, universite: cfg.universite }, 'token-' + role, role)
    navigate(cfg.route)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setError('Identifiants incorrects. Utilisez la connexion rapide.') }, 900)
  }

  const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#111827', background: '#fff', outline: 'none', boxSizing: 'border-box', border: `1.5px solid ${error ? '#E24B4A' : '#D1D5DB'}` }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FF', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#3B7FE1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📖</div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#3B7FE1' }}>LibraFlow</span>
          </Link>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Réseau académique national — Burkina Faso</div>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '18px', padding: '28px 28px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB' }}>

          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>Bon retour 👋</h1>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Connectez-vous à votre espace LibraFlow.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Adresse email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.bf" style={inp} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Mot de passe</label>
                <button type="button" style={{ fontSize: '11px', color: '#3B7FE1', background: 'none', border: 'none', cursor: 'pointer' }}>Oublié ?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inp, paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#9CA3AF' }}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 12px', borderRadius: '9px', background: '#FEE2E2', color: '#E24B4A', fontSize: '12px' }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: loading ? '#9CA3AF' : '#3B7FE1', color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          </div>

          {/* Connexion rapide */}
          <button onClick={() => setShowDemo(v => !v)}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px dashed #D1D5DB', background: 'transparent', color: '#6B7280', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            {showDemo ? '▲ Masquer' : '⚡ Connexion rapide (démo)'}
          </button>

          {showDemo && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
              {Object.entries(roleConfig).map(([role, cfg]) => (
                <button key={role} onClick={() => handleLogin(role)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer' }}>
                  <span style={{ fontSize: '18px' }}>{cfg.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{cfg.label}</div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>{cfg.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Inscription */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px', textAlign: 'center' }}>Pas encore de compte ?</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Link to="/inscription" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '9px 6px', borderRadius: '9px', background: '#EEF4FF', color: '#3B7FE1', fontSize: '11px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                <span>🎓</span> Étudiant
              </Link>
              <Link to="/inscription/professeur" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '9px 6px', borderRadius: '9px', background: '#FEF3C7', color: '#B45309', fontSize: '11px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                <span>👨‍🏫</span> Professeur
              </Link>
              <Link to="/inscription/universite" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '9px 6px', borderRadius: '9px', background: '#DCFCE7', color: '#1D9E75', fontSize: '11px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                <span>🏛</span> Université
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
