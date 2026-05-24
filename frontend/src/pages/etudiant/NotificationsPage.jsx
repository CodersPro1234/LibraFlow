import { useState } from 'react'

const typeConfig = {
  nouveau_doc:          { icon: '📄', bg: 'var(--color-primary-light)', color: 'var(--color-primary)',  label: 'Nouveau document' },
  reponse_commentaire:  { icon: '💬', bg: 'var(--color-success-light)', color: 'var(--color-success)',  label: 'Réponse commentaire' },
  nouveau_contenu_prof: { icon: '👨‍🏫', bg: 'var(--color-gold-light)',   color: 'var(--color-gold)',     label: 'Prof suivi' },
  systeme:              { icon: '⚠️', bg: '#FEF3C7',                    color: '#D97706',               label: 'Système' },
}

const FILTERS = ['Toutes', 'Documents', 'Commentaires', 'Professeurs', 'Système']

const typeToFilter = {
  nouveau_doc:          'Documents',
  reponse_commentaire:  'Commentaires',
  nouveau_contenu_prof: 'Professeurs',
  systeme:              'Système',
}

const initialNotifs = [
  { id: 1, type: 'nouveau_doc',          titre: 'Nouveau cours disponible',         message: 'Prof. Ouédraogo Mamadou a publié "Droit Constitutionnel — Chapitre 5".', temps: 'Il y a 10 min',  lu: false },
  { id: 2, type: 'reponse_commentaire',  titre: 'Réponse à votre commentaire',      message: 'Prof. Traoré Fatoumata a répondu : "Bonne remarque, le corrigé sera mis en ligne demain."', temps: 'Il y a 1h',     lu: false },
  { id: 3, type: 'nouveau_contenu_prof', titre: 'Prof. Zongo Issa a publié',         message: '"TD Finance d\'entreprise — Série 3" est maintenant disponible en téléchargement.', temps: 'Il y a 3h',     lu: false },
  { id: 4, type: 'nouveau_doc',          titre: 'Recommandé pour toi',              message: 'L\'IA a identifié 2 nouveaux documents correspondant à ton niveau Licence 2 en Droit.', temps: 'Hier, 09h22', lu: true },
  { id: 5, type: 'reponse_commentaire',  titre: 'Nouveau like sur ton commentaire', message: '3 personnes ont aimé ton commentaire sur "Annales Mathématiques 2024/2025".', temps: 'Hier, 08h15', lu: true },
  { id: 6, type: 'nouveau_contenu_prof', titre: 'Prof. Kaboré Adama a publié',      message: 'Un nouveau résumé "Algorithmes de tri — L1" vient d\'être validé par l\'université.', temps: 'Il y a 2 jours', lu: true },
  { id: 7, type: 'systeme',             titre: 'Connexion offline détectée',        message: 'LibraFlow fonctionne en mode hors ligne. Tes téléchargements restent accessibles.', temps: 'Il y a 3 jours', lu: true },
]

const NotificationsPage = () => {
  const [notifs, setNotifs]   = useState(initialNotifs)
  const [filter, setFilter]   = useState('Toutes')

  const nonLues = notifs.filter(n => !n.lu).length
  const aujourdhui = notifs.filter(n => n.temps.includes('min') || n.temps.includes('h') && !n.temps.includes('jours')).length

  const marquerToutLu = () => setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  const marquerLu     = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
  const supprimer     = (id) => setNotifs(prev => prev.filter(n => n.id !== id))

  const filtered = notifs.filter(n => filter === 'Toutes' || typeToFilter[n.type] === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Total',      value: notifs.length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🔔' },
          { label: 'Non lues',   value: nonLues,       color: 'var(--color-danger)',  bg: '#FEE2E2',                    icon: '📩' },
          { label: "Aujourd'hui", value: aujourdhui,   color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '⚡' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
            {filtered.length} notification{filtered.length > 1 ? 's' : ''}
          </span>
          {nonLues > 0 && (
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: 'var(--color-danger)', color: '#fff' }}>
              {nonLues} non lue{nonLues > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {nonLues > 0 && (
          <button onClick={marquerToutLu}
            style={{ fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '9px', border: '1.5px solid var(--color-primary)', background: '#fff', color: 'var(--color-primary)', cursor: 'pointer' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filtres */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '5px', display: 'flex', gap: '4px' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ flex: 1, padding: '8px 6px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: filter === f ? 'var(--color-primary)' : 'transparent',
              color: filter === f ? '#fff' : '#6B7280',
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(notif => {
          const tc = typeConfig[notif.type]
          return (
            <div key={notif.id} onClick={() => marquerLu(notif.id)}
              style={{
                background: '#fff', borderRadius: '16px', cursor: 'pointer',
                border: notif.lu ? '1px solid #E5E7EB' : '1.5px solid var(--color-primary)',
                borderLeft: notif.lu ? '1px solid #E5E7EB' : '4px solid var(--color-primary)',
                boxShadow: notif.lu ? '0 1px 4px rgba(0,0,0,0.04)' : '0 2px 12px rgba(59,127,225,0.10)',
                padding: '16px 18px',
                transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>

                {/* Icône */}
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {tc.icon}
                </div>

                {/* Contenu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{notif.titre}</span>
                    {!notif.lu && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0, display: 'inline-block' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, margin: 0, marginBottom: '10px' }}>
                    {notif.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: tc.bg, color: tc.color }}>
                      {tc.label}
                    </span>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{notif.temps}</span>
                  </div>
                </div>

                {/* Supprimer */}
                <button onClick={e => { e.stopPropagation(); supprimer(notif.id) }}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: 1 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = 'var(--color-danger)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#9CA3AF' }}>
                  ×
                </button>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>Aucune notification</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Tu es à jour !</div>
          </div>
        )}
      </div>

    </div>
  )
}

export default NotificationsPage
