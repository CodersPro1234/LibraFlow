import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const personas = {
    etudiant:   { name: 'Salif Kaboré',        universite: 'UJK-Zerbo' },
    professeur: { name: 'Ouédraogo Mamadou',   universite: 'UJK-Zerbo' },
    universite: { name: 'Admin UJK-Zerbo',     universite: 'UJK-Zerbo' },
    ministere:  { name: 'MENAPLN',             universite: '' },
  }

  const handleLogin = (role) => {
    login(personas[role], 'fake-token', role)
    const routes = {
      etudiant:   '/etudiant/feed',
      professeur: '/professeur/feed',
      universite: '/universite/dashboard',
      ministere:  '/ministere/dashboard',
    }
    navigate(routes[role])
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <div className="bg-white rounded-xl border p-8 w-full max-w-sm" style={{ borderColor: 'var(--color-border)' }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>LibraFlow</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>Réseau académique national — BF</p>
        <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>CONNEXION RAPIDE (démo)</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => handleLogin('etudiant')} className="w-full py-2 rounded-lg text-white text-sm font-medium" style={{ background: 'var(--color-primary)' }}>
            Étudiant
          </button>
          <button onClick={() => handleLogin('professeur')} className="w-full py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
            Professeur
          </button>
          <button onClick={() => handleLogin('universite')} className="w-full py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            Université
          </button>
          <button onClick={() => handleLogin('ministere')} className="w-full py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            Ministère
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage