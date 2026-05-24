import { useState } from 'react'

const typeConfig = {
  nouveau_prof:       { icon: '⏳', bg: 'var(--color-gold-light)',    color: 'var(--color-gold)',    label: 'Nouveau professeur' },
  nouveau_doc:        { icon: '📄', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Nouveau document' },
  doc_signale:        { icon: '⚠️', bg: '#FEE2E2',                    color: 'var(--color-danger)',  label: 'Document signalé' },
  message_ministere:  { icon: '🏛', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Ministère' },
  rapport_mensuel:    { icon: '📊', bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Rapport mensuel' },
}

const FILTERS = ['Toutes', 'Professeurs', 'Documents', 'Signalements', 'Rapports']
const typeToFilter = {
  nouveau_prof:      'Professeurs',
  nouveau_doc:       'Documents',
  doc_signale:       'Signalements',
  message_ministere: 'Documents',
  rapport_mensuel:   'Rapports',
}

const initialNotifs = [
  { id: 1, type: 'nouveau_prof',      titre: "Nouvelle demande d'adhésion",    message: "Dr. Issouf Compaoré (Droit Public, Maître de conférences) a soumis une demande pour rejoindre votre université. Vérifiez son dossier.", temps: 'Il y a 20 min', lu: false },
  { id: 2, type: 'doc_signale',       titre: "Document signalé par l'IA",      message: '"Annales Droit Administratif S1" (Prof. Sawadogo K.) a été signalé pour incohérence de niveau. Une révision est recommandée.', temps: 'Il y a 1h', lu: false },
  { id: 3, type: 'nouveau_doc',       titre: 'Nouveau document publié',         message: 'Prof. Ouédraogo Mamadou a publié "Droit Constitutionnel — Chapitre 6". Score IA : 94/100. Disponible pour les étudiants.', temps: 'Il y a 2h', lu: false },
  { id: 4, type: 'message_ministere', titre: 'Message officiel du Ministère',   message: "MENAPLN : Rappel — Soumettez le rapport annuel de vos professeurs avant le 31 Mai 2026. Formulaire disponible sur le portail ministériel.", temps: 'Il y a 5h', lu: true },
  { id: 5, type: 'nouveau_prof',      titre: '2 demandes en attente',           message: 'Vous avez 2 demandes de professeurs en attente de validation depuis plus de 48h. Traitez-les pour ne pas bloquer leurs accès.', temps: 'Hier, 11h30', lu: true },
  { id: 6, type: 'nouveau_doc',       titre: '8 documents publiés cette semaine', message: "Vos professeurs ont été très actifs. 8 nouveaux documents ont été publiés et validés par l'IA cette semaine.", temps: 'Hier, 09h00', lu: true },
  { id: 7, type: 'rapport_mensuel',   titre: 'Rapport mensuel — Avril 2026',    message: "Votre rapport mensuel est disponible : 4 218 étudiants actifs, 38 professeurs, 840 documents publiés. Score de qualité moyen : 88/100.", temps: 'Il y a 3 jours', lu: true },
]

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState(initialNotifs)
  const [filter, setFilter]  = useState('Toutes')

  const nonLues   = notifs.filter(n => !n.lu).length
  const signales  = notifs.filter(n => n.type === 'doc_signale').length
  const enAttente = notifs.filter(n => n.type === 'nouveau_prof' && !n.lu).length

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
          { label: 'À traiter',  value: enAttente + signales, color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '⚡' },
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
