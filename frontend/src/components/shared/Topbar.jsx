import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const notifRoutes = {
  etudiant:   '/etudiant/notifications',
  professeur: '/professeur/notifications',
  universite: '/universite/notifications',
  ministere:  '/ministere/notifications',
}

const roleLabel = { etudiant: 'Étudiant', professeur: 'Professeur', universite: 'Université', ministere: 'Ministère' }
const roleColor = {
  etudiant:   { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  professeur: { bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  universite: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  ministere:  { bg: '#ede9fe',                    color: '#6d28d9' },
}

const Topbar = ({ title }) => {
  const { user, role } = useAuthStore()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const rc = roleColor[role] || roleColor.etudiant

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: '62px', background: '#fff', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}>

      {/* Titre */}
      <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px', margin: 0 }}>
        {title}
      </h1>

      {/* Droite */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Indicateur online */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-success)' }} />
          En ligne
        </div>

        {/* Séparateur */}
        <div style={{ width: '1px', height: '24px', background: '#E5E7EB' }} />

        {/* Cloche notifications */}
        <button onClick={() => navigate(notifRoutes[role] || '/')}
          style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          🔔
          <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-danger)', color: '#fff', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
            3
          </span>
        </button>

        {/* Séparateur */}
        <div style={{ width: '1px', height: '24px', background: '#E5E7EB' }} />

        {/* Avatar + infos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: rc.bg, color: rc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
              {user?.name || 'Utilisateur'}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>
              {roleLabel[role] || 'Utilisateur'}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Topbar
