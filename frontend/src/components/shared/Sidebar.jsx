import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const menus = {
  etudiant: [
    { label: "Fil d'actualité", path: '/etudiant/feed',         icon: '📋' },
    { label: 'Recherche',       path: '/etudiant/search',        icon: '🔍' },
    { label: 'Ma bibliothèque', path: '/etudiant/bibliotheque',  icon: '🔖' },
    { label: 'Notifications',   path: '/etudiant/notifications', icon: '🔔' },
    { label: 'Universités',     path: '/etudiant/universites',   icon: '🏛' },
    { label: 'Mon profil',      path: '/etudiant/profil',        icon: '👤' },
  ],
  professeur: [
    { label: "Fil d'actualité",  path: '/professeur/feed',         icon: '📋' },
    { label: 'Publier',          path: '/professeur/publier',       icon: '➕' },
    { label: 'Mes publications', path: '/professeur/publications',  icon: '📄' },
    { label: 'Ma communauté',    path: '/professeur/communaute',    icon: '👥' },
    { label: 'Notifications',    path: '/professeur/notifications', icon: '🔔' },
    { label: 'Mon profil',       path: '/professeur/profil',        icon: '👤' },
  ],
  universite: [
    { label: 'Dashboard',     path: '/universite/dashboard',    icon: '📊' },
    { label: 'Professeurs',   path: '/universite/professeurs',  icon: '👨‍🏫' },
    { label: 'Étudiants',     path: '/universite/etudiants',    icon: '🎓' },
    { label: 'Publications',  path: '/universite/publications', icon: '📄' },
    { label: 'Notifications', path: '/universite/notifications',icon: '🔔' },
    { label: 'Mon profil',    path: '/universite/profil',       icon: '👤' },
  ],
  ministere: [
    { label: 'Dashboard national', path: '/ministere/dashboard',    icon: '📊' },
    { label: 'Carte interactive',  path: '/ministere/carte',        icon: '🗺' },
    { label: 'Universités',        path: '/ministere/universites',  icon: '🏛' },
    { label: 'Validations',        path: '/ministere/validations',  icon: '✅' },
    { label: 'Contenus signalés',  path: '/ministere/signales',     icon: '⚠️' },
    { label: 'Statistiques',       path: '/ministere/statistiques', icon: '📈' },
    { label: 'Notifications',      path: '/ministere/notifications',icon: '🔔' },
    { label: 'Mon profil',         path: '/ministere/profil',       icon: '👤' },
  ],
}

const roleLabel = { etudiant: 'Étudiant', professeur: 'Professeur', universite: 'Université', ministere: 'Ministère' }
const roleColor = {
  etudiant:   { bg: 'var(--color-primary-light)',  color: 'var(--color-primary)' },
  professeur: { bg: 'var(--color-gold-light)',     color: 'var(--color-gold)' },
  universite: { bg: 'var(--color-success-light)',  color: 'var(--color-success)' },
  ministere:  { bg: '#ede9fe',                     color: '#6d28d9' },
}

const Sidebar = () => {
  const { user, role, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const rc = roleColor[role] || roleColor.etudiant

  return (
    <div style={{ width: '230px', flexShrink: 0, height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #E5E7EB' }}>

      {/* Brand */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📖</div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>LibraFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '100px', background: rc.bg, color: rc.color }}>
            {roleLabel[role] || 'Utilisateur'}
          </span>
          <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Burkina Faso</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#C4C4C4', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '6px 8px 4px' }}>
          Navigation
        </div>
        {menus[role]?.map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: '10px',
              textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? 'var(--color-primary-light)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : '#6B7280',
              fontWeight: isActive ? 700 : 500,
              fontSize: '13.5px',
            })}>
            {({ isActive }) => (
              <>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, background: isActive ? 'var(--color-primary)' : '#F3F4F6' }}>
                  <span style={{ filter: isActive ? 'brightness(10)' : 'none' }}>{item.icon}</span>
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer utilisateur */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0, background: rc.bg, color: rc.color }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Utilisateur'}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>
              {user?.universite ? user.universite.split(' ')[0] : roleLabel[role]}
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          style={{ width: '100%', padding: '8px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: '#FEF2F2', color: '#E24B4A', transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Se déconnecter
        </button>
      </div>

    </div>
  )
}

export default Sidebar
