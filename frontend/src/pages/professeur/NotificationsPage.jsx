import { useState } from 'react'

const typeConfig = {
  nouvel_abonne:       { icon: '👤', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Nouvel abonné' },
  nouveau_commentaire: { icon: '💬', bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Commentaire' },
  nouveau_like:        { icon: '♥',  bg: '#FEE2E2',                    color: 'var(--color-danger)',  label: 'Like' },
  ia_valide:           { icon: '🤖', bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'IA — Validé' },
  ia_signale:          { icon: '🤖', bg: 'var(--color-gold-light)',    color: 'var(--color-gold)',    label: 'IA — Signalé' },
  message_universite:  { icon: '🏛',  bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Université' },
}

const FILTERS = ['Toutes', 'Abonnés', 'Commentaires', 'Documents', 'Université']
const typeToFilter = {
  nouvel_abonne:       'Abonnés',
  nouveau_commentaire: 'Commentaires',
  nouveau_like:        'Commentaires',
  ia_valide:           'Documents',
  ia_signale:          'Documents',
  message_universite:  'Université',
}

const initialNotifs = [
  { id: 1, type: 'ia_valide',           titre: "Document validé par l'IA",          message: '"Droit Constitutionnel — Chapitre 5" a été analysé et validé. Score de fiabilité : 91/100. Publication en ligne.', temps: 'Il y a 30 min', lu: false },
  { id: 2, type: 'nouvel_abonne',       titre: 'Nouvel abonné',                      message: 'Salif Kaboré (UJK-Zerbo, Licence 2) a commencé à vous suivre.', temps: 'Il y a 1h', lu: false },
  { id: 3, type: 'nouveau_commentaire', titre: 'Nouveau commentaire',                message: 'Aminata D. a commenté "Droit Constitutionnel Ch.4" : "Excellent cours, très bien structuré !"', temps: 'Il y a 2h', lu: false },
  { id: 4, type: 'nouveau_like',        titre: '3 nouveaux likes',                   message: 'Ibrahim T., Mariam O. et 1 autre personne ont aimé votre document "Annales Droit 2023".', temps: 'Il y a 4h', lu: true },
  { id: 5, type: 'ia_signale',          titre: "Document signalé par l'IA",          message: '"TD Droit International S2" a été signalé pour incohérence de matière. Vous pouvez corriger et republier.', temps: 'Hier, 14h22', lu: true },
  { id: 6, type: 'message_universite',  titre: "Message de l'université",            message: "L'Université Joseph Ki-Zerbo vous rappelle la date limite de publication des annales 2026 : 30 Mai 2026.", temps: 'Hier, 09h00', lu: true },
  { id: 7, type: 'nouvel_abonne',       titre: '5 nouveaux abonnés cette semaine',   message: 'Votre communauté grandit ! Vous avez désormais 87 abonnés sur la plateforme.', temps: 'Il y a 3 jours', lu: true },
]

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState(initialNotifs)
  const [filter, setFilter]  = useState('Toutes')

  const nonLues   = notifs.filter(n => !n.lu).length
  const signales  = notifs.filter(n => n.type === 'ia_signale').length
  const aTraiter  = signales + notifs.filter(n => n.type === 'ia_signale' && !n.lu).length

  const marquerLu     = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
  const marquerToutLu = () => setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  const supprimer     = (id) => setNotifs(prev => prev.filter(n => n.id !== id))

  const filtered = notifs.filter(n => filter === 'Toutes' || typeToFilter[n.type] === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Total',      value: notifs.length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🔔' },
          { label: 'Non lues',   value: nonLues,       color: 'var(--color-danger)',  bg: '#FEE2E2',                    icon: '📩' },
          { label: 'Documents',  value: signales,      color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '🤖' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
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
                background: '#fff', borderRadius: '16px', cursor: 'pointer', padding: '16px 18px',
                border: notif.lu ? '1px solid #E5E7EB' : '1.5px solid var(--color-primary)',
                borderLeft: notif.lu ? '1px solid #E5E7EB' : '4px solid var(--color-primary)',
                boxShadow: notif.lu ? '0 1px 4px rgba(0,0,0,0.04)' : '0 2px 12px rgba(59,127,225,0.10)',
                transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {tc.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{notif.titre}</span>
                    {!notif.lu && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0, display: 'inline-block' }} />}
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.5, margin: 0, marginBottom: '10px' }}>{notif.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: tc.bg, color: tc.color }}>{tc.label}</span>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{notif.temps}</span>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); supprimer(notif.id) }}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
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
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Vous êtes à jour !</div>
          </div>
        )}
      </div>

    </div>
  )
}

export default NotificationsPage
