import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

// ── Menus par rôle ────────────────────────────────────────────────────────────
const menus = {
  etudiant: [
    { label: "Accueil",       path: '/etudiant/feed',        icon: '🏠' },
    { label: 'Recherche',     path: '/etudiant/search',       icon: '🔍' },
    { label: 'Bibliothèque',  path: '/etudiant/bibliotheque', icon: '🔖' },
    { label: 'Universités',   path: '/etudiant/universites',  icon: '🏛' },
    { label: 'Mon profil',    path: '/etudiant/profil',       icon: '👤' },
  ],
  professeur: [
    { label: 'Accueil',        path: '/professeur/feed',        icon: '🏠' },
    { label: 'Publier',        path: '/professeur/publier',      icon: '➕' },
    { label: 'Mes docs',       path: '/professeur/publications', icon: '📄' },
    { label: 'Communauté',     path: '/professeur/communaute',   icon: '👥' },
    { label: 'Mon profil',     path: '/professeur/profil',       icon: '👤' },
  ],
  universite: [
    { label: 'Dashboard',    path: '/universite/dashboard',    icon: '📊' },
    { label: 'Professeurs',  path: '/universite/professeurs',  icon: '👨‍🏫' },
    { label: 'Étudiants',    path: '/universite/etudiants',    icon: '🎓' },
    { label: 'Publications', path: '/universite/publications', icon: '📄' },
    { label: 'Mon profil',   path: '/universite/profil',       icon: '👤' },
  ],
  ministere: [
    { label: 'National',     path: '/ministere/dashboard',    icon: '📊' },
    { label: 'Carte',        path: '/ministere/carte',        icon: '🗺' },
    { label: 'Universités',  path: '/ministere/universites',  icon: '🏛' },
    { label: 'Validations',  path: '/ministere/validations',  icon: '✅' },
    { label: 'Signalements', path: '/ministere/signales',     icon: '⚠️' },
    { label: 'Statistiques', path: '/ministere/statistiques', icon: '📈' },
    { label: 'Mon profil',   path: '/ministere/profil',       icon: '👤' },
  ],
}

// ── Couleurs par rôle ─────────────────────────────────────────────────────────
const roleColor = {
  etudiant:   { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  professeur: { bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  universite: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  ministere:  { bg: '#ede9fe',                    color: '#6d28d9' },
}
const roleLabel = { etudiant: 'Étudiant', professeur: 'Professeur', universite: 'Université', ministere: 'Ministère' }

// ── Notifications ─────────────────────────────────────────────────────────────
const typeConfig = {
  nouveau_doc:          { icon: '📄', bg: '#EEF4FF' },
  reponse_commentaire:  { icon: '💬', bg: 'var(--color-success-light)' },
  nouveau_contenu_prof: { icon: '👨‍🏫', bg: 'var(--color-gold-light)' },
  systeme:              { icon: '⚙️', bg: '#F3F4F6' },
}

const initialNotifs = [
  { id: 1, type: 'nouveau_doc',          lien: '/etudiant/lecture/1',     titre: 'Nouveau cours disponible',    message: 'Prof. Ouédraogo Mamadou a publié "Droit Constitutionnel — Chapitre 5".', temps: 'Il y a 10 min',  lu: false },
  { id: 2, type: 'reponse_commentaire',  lien: '/etudiant/feed',          titre: 'Réponse à votre commentaire', message: 'Prof. Traoré Fatoumata a répondu : "Bonne remarque, le corrigé sera mis en ligne demain."', temps: 'Il y a 1h', lu: false },
  { id: 3, type: 'nouveau_contenu_prof', lien: '/etudiant/professeur/3',  titre: 'Prof. Zongo Issa a publié',   message: '"TD Finance — Série 3" est maintenant disponible en téléchargement.', temps: 'Il y a 3h', lu: false },
  { id: 4, type: 'nouveau_doc',          lien: '/etudiant/search',        titre: 'Recommandé pour toi',         message: "L'IA a identifié 2 nouveaux documents correspondant à ton niveau Licence 2.", temps: 'Hier, 09h22', lu: true },
  { id: 5, type: 'reponse_commentaire',  lien: '/etudiant/feed',          titre: 'Like sur ton commentaire',    message: '3 personnes ont aimé ton commentaire sur "Annales Mathématiques 2024/2025".', temps: 'Hier, 08h15', lu: true },
  { id: 6, type: 'nouveau_contenu_prof', lien: '/etudiant/professeur/10', titre: 'Prof. Kaboré Adama a publié', message: 'Un nouveau résumé "Algorithmes de tri — L1" vient d\'être validé.', temps: 'Il y a 2 jours', lu: true },
  { id: 7, type: 'systeme',             lien: '/etudiant/bibliotheque',   titre: 'Connexion offline détectée',  message: 'LibraFlow fonctionne en mode hors ligne. Tes téléchargements restent accessibles.', temps: 'Il y a 3 jours', lu: true },
]

// ── Composant notification item ───────────────────────────────────────────────
const NotifItem = ({ notif, onClick }) => {
  const tc = typeConfig[notif.type] || typeConfig.systeme
  return (
    <div onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.15s', background: notif.lu ? 'transparent' : '#EEF4FF' }}
      onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
      onMouseLeave={e => e.currentTarget.style.background = notif.lu ? 'transparent' : '#EEF4FF'}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
          {tc.icon}
        </div>
        {!notif.lu && <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-primary)', border: '2px solid #fff' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', color: '#111827', lineHeight: 1.4, marginBottom: '2px' }}>
          <span style={{ fontWeight: 700 }}>{notif.titre}</span>
          <span style={{ color: '#4B5563' }}> — {notif.message.length > 52 ? notif.message.slice(0, 52) + '…' : notif.message}</span>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: notif.lu ? '#9CA3AF' : 'var(--color-primary)' }}>{notif.temps}</div>
      </div>
      {!notif.lu && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />}
    </div>
  )
}

// ── Topbar principal ──────────────────────────────────────────────────────────
const Topbar = () => {
  const { user, role, logout } = useAuthStore()
  const navigate = useNavigate()

  const [showNotifs,  setShowNotifs]  = useState(false)
  const [showUser,    setShowUser]    = useState(false)
  const [notifTab,    setNotifTab]    = useState('Tout')
  const [notifs,      setNotifs]      = useState(initialNotifs)

  const bellRef   = useRef(null)
  const notifPanel = useRef(null)
  const userRef   = useRef(null)
  const userPanel = useRef(null)

  const rc       = roleColor[role] || roleColor.etudiant
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'
  const nonLues  = notifs.filter(n => !n.lu).length

  const marquerLu    = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, lu: true } : n))
  const marquerToutLu = ()  => setNotifs(p => p.map(n => ({ ...n, lu: true })))

  const handleNotifClick = (notif) => {
    marquerLu(notif.id)
    setShowNotifs(false)
    if (notif.lien) navigate(notif.lien)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const displayed   = notifTab === 'Non lu' ? notifs.filter(n => !n.lu) : notifs
  const nouvelles   = displayed.filter(n => !n.lu)
  const precedentes = displayed.filter(n => n.lu)

  // Fermer dropdowns au clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (notifPanel.current && !notifPanel.current.contains(e.target) && bellRef.current && !bellRef.current.contains(e.target))
        setShowNotifs(false)
      if (userPanel.current && !userPanel.current.contains(e.target) && userRef.current && !userRef.current.contains(e.target))
        setShowUser(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navItems = menus[role] || []

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 200, background: '#fff', borderBottom: '1px solid #E5E7EB', height: '60px', display: 'flex', alignItems: 'stretch' }}>

      {/* ── Gauche : Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px', flexShrink: 0, borderRight: '1px solid #F3F4F6', minWidth: '200px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📖</div>
        <div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>LibraFlow</div>
          <div style={{ marginTop: '2px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '100px', background: rc.bg, color: rc.color }}>
              {roleLabel[role] || 'Utilisateur'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Centre : Navigation ── */}
      <nav style={{ flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: '2px', padding: '0 8px' }}>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '0 16px', textDecoration: 'none', gap: '2px', borderRadius: '0',
              borderBottom: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
              color: isActive ? 'var(--color-primary)' : '#6B7280',
              minWidth: '72px', transition: 'all 0.15s', position: 'relative',
            })}
            onMouseEnter={e => { if (!e.currentTarget.style.borderBottomColor.includes('primary')) e.currentTarget.style.background = '#F9FAFB' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
            {({ isActive }) => (
              <>
                <span style={{ fontSize: '20px', lineHeight: 1, filter: isActive ? 'none' : 'grayscale(30%)' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Droite : Actions ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', flexShrink: 0, borderLeft: '1px solid #F3F4F6' }}>

        {/* Online */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)' }} />
          En ligne
        </div>

        {/* Cloche */}
        <button ref={bellRef} onClick={() => { setShowNotifs(s => !s); setShowUser(false) }}
          style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: showNotifs ? '#E7F0FF' : '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#E7F0FF'}
          onMouseLeave={e => e.currentTarget.style.background = showNotifs ? '#E7F0FF' : '#F3F4F6'}>
          🔔
          {nonLues > 0 && (
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', minWidth: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-danger)', color: '#fff', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', padding: '0 2px' }}>
              {nonLues}
            </span>
          )}
        </button>

        {/* Avatar utilisateur */}
        <button ref={userRef} onClick={() => { setShowUser(s => !s); setShowNotifs(false) }}
          style={{ width: '38px', height: '38px', borderRadius: '50%', background: rc.bg, color: rc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, border: showUser ? `2px solid ${rc.color}` : '2px solid transparent', cursor: 'pointer', transition: 'border 0.15s', flexShrink: 0 }}>
          {initials}
        </button>
      </div>

      {/* ── Dropdown notifications ── */}
      {showNotifs && (
        <div ref={notifPanel}
          style={{ position: 'absolute', top: '68px', right: '60px', width: '390px', maxHeight: '560px', background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', zIndex: 300, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          <div style={{ padding: '18px 18px 10px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>Notifications</span>
              {nonLues > 0 && (
                <button onClick={marquerToutLu}
                  style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  Tout marquer comme lu
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Tout', 'Non lu'].map(t => (
                <button key={t} onClick={() => setNotifTab(t)}
                  style={{ padding: '6px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                    background: notifTab === t ? 'var(--color-primary-light)' : '#F3F4F6',
                    color:      notifTab === t ? 'var(--color-primary)'       : '#6B7280',
                  }}>
                  {t}{t === 'Non lu' && nonLues > 0 && <span style={{ marginLeft: '6px', fontSize: '11px', fontWeight: 800, background: 'var(--color-danger)', color: '#fff', borderRadius: '100px', padding: '1px 6px' }}>{nonLues}</span>}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '0 8px 12px' }}>
            {nouvelles.length > 0 && <>
              <div style={{ padding: '8px 10px 4px', fontSize: '13px', fontWeight: 700, color: '#111827' }}>Nouveau</div>
              {nouvelles.map(n => <NotifItem key={n.id} notif={n} onClick={() => handleNotifClick(n)} />)}
            </>}
            {precedentes.length > 0 && <>
              <div style={{ padding: '12px 10px 4px', fontSize: '13px', fontWeight: 700, color: '#111827' }}>Précédentes</div>
              {precedentes.map(n => <NotifItem key={n.id} notif={n} onClick={() => handleNotifClick(n)} />)}
            </>}
            {displayed.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔔</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Tout est lu !</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Dropdown utilisateur ── */}
      {showUser && (
        <div ref={userPanel}
          style={{ position: 'absolute', top: '68px', right: '16px', width: '260px', background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', zIndex: 300, overflow: 'hidden' }}>

          {/* Profil */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: rc.bg, color: rc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{user?.name || 'Utilisateur'}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{user?.universite || roleLabel[role]}</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '8px' }}>
            <button
              onClick={() => { setShowUser(false); navigate(menus[role]?.find(m => m.label === 'Mon profil')?.path || '/') }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'transparent', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              👤 Voir mon profil
            </button>
            <button
              onClick={handleLogout}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'transparent', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Topbar
