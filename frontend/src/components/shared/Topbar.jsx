import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const notifRoutes = {
  etudiant:   '/etudiant/notifications',
  professeur: '/professeur/feed',
  universite: '/universite/dashboard',
  ministere:  '/ministere/dashboard',
}

const Topbar = ({ title }) => {
  const { role } = useAuthStore()
  const navigate = useNavigate()

  const handleCloche = () => {
    const route = notifRoutes[role]
    if (route) navigate(route)
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b shrink-0"
      style={{ borderColor: 'var(--color-border)' }}>

      {/* Titre de la page */}
      <h1 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
        {title}
      </h1>

      {/* Droite */}
      <div className="flex items-center gap-3">

        {/* Indicateur online */}
        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
          style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-success)' }}></div>
          En ligne
        </div>

        {/* Notifications */}
        <button
          onClick={handleCloche}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all hover:opacity-80"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
          🔔
          {role === 'etudiant' && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ background: 'var(--color-danger)', fontSize: '10px' }}>
              3
            </span>
          )}
        </button>

      </div>
    </div>
  )
}

export default Topbar