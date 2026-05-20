import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const menus = {
  etudiant: [
    { label: "Fil d'actualité", path: '/etudiant/feed', icon: '📋' },
    { label: 'Recherche', path: '/etudiant/search', icon: '🔍' },
    { label: 'Ma bibliothèque', path: '/etudiant/bibliotheque', icon: '🔖' },
    { label: 'Notifications', path: '/etudiant/notifications', icon: '🔔' },
    { label: 'Universités', path: '/etudiant/universites', icon: '🏛' },
  ],
  professeur: [
    { label: "Fil d'actualité", path: '/professeur/feed', icon: '📋' },
    { label: 'Publier', path: '/professeur/publier', icon: '➕' },
    { label: 'Mes publications', path: '/professeur/publications', icon: '📄' },
    { label: 'Ma communauté', path: '/professeur/communaute', icon: '👥' },
  ],
  universite: [
    { label: 'Dashboard', path: '/universite/dashboard', icon: '📊' },
    { label: 'Professeurs', path: '/universite/professeurs', icon: '👨‍🏫' },
    { label: 'Étudiants', path: '/universite/etudiants', icon: '🎓' },
    { label: 'Publications', path: '/universite/publications', icon: '📄' },
  ],
  ministere: [
    { label: 'Dashboard national', path: '/ministere/dashboard', icon: '📊' },
    { label: 'Carte interactive', path: '/ministere/carte', icon: '🗺' },
    { label: 'Universités', path: '/ministere/universites', icon: '🏛' },
    { label: 'Contenus signalés', path: '/ministere/signales', icon: '⚠️' },
    { label: 'Statistiques', path: '/ministere/statistiques', icon: '📈' },
  ],
}

const Sidebar = () => {
  const { user, role, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-screen w-52 bg-white border-r shrink-0"
      style={{ borderColor: 'var(--color-border)' }}>

      {/* Brand */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
          LibraFlow
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
          Réseau académique BF
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {menus[role]?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 text-sm transition-all ${
                isActive
                  ? 'font-medium border-r-2'
                  : 'hover:bg-blue-50'
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary-dark)' : 'var(--color-muted)',
              background: isActive ? 'var(--color-primary-light)' : '',
              borderColor: isActive ? 'var(--color-primary)' : '',
            })}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
              {user?.name || 'Utilisateur'}
            </div>
            <div className="text-xs capitalize" style={{ color: 'var(--color-muted)' }}>
              {role}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-xs py-1 rounded text-left px-2"
          style={{ color: 'var(--color-muted)' }}
        >
          Se déconnecter
        </button>
      </div>

    </div>
  )
}

export default Sidebar