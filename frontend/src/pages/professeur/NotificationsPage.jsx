import { useState } from 'react'

const typeConfig = {
  nouvel_abonne: { icon: '👤', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Nouvel abonné' },
  nouveau_commentaire: { icon: '💬', bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Commentaire' },
  nouveau_like: { icon: '♥', bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'Like' },
  ia_valide: { icon: '🤖', bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'IA — Validé' },
  ia_signale: { icon: '🤖', bg: 'var(--color-gold-light)', color: 'var(--color-gold)', label: 'IA — Signalé' },
  message_universite: { icon: '🏛', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Université' },
}

const initialNotifs = [
  { id: 1, type: 'ia_valide', titre: 'Document validé par l\'IA', message: '"Droit Constitutionnel — Chapitre 5" a été analysé et validé. Score de fiabilité : 91/100. Publication en ligne.', temps: 'Il y a 30 min', lu: false },
  { id: 2, type: 'nouvel_abonne', titre: 'Nouvel abonné', message: 'Salif Kaboré (UJK-Zerbo, Licence 2) a commencé à vous suivre.', temps: 'Il y a 1h', lu: false },
  { id: 3, type: 'nouveau_commentaire', titre: 'Nouveau commentaire', message: 'Aminata D. a commenté "Droit Constitutionnel Ch.4" : "Excellent cours, très bien structuré !"', temps: 'Il y a 2h', lu: false },
  { id: 4, type: 'nouveau_like', titre: '3 nouveaux likes', message: 'Ibrahim T., Mariam O. et 1 autre personne ont aimé votre document "Annales Droit 2023".', temps: 'Il y a 4h', lu: true },
  { id: 5, type: 'ia_signale', titre: 'Document signalé par l\'IA', message: '"TD Droit International S2" a été signalé pour incohérence de matière. Vous pouvez corriger et republier.', temps: 'Hier, 14h22', lu: true },
  { id: 6, type: 'message_universite', titre: 'Message de l\'université', message: 'L\'Université Joseph Ki-Zerbo vous rappelle la date limite de publication des annales 2026 : 30 Mai 2026.', temps: 'Hier, 09h00', lu: true },
  { id: 7, type: 'nouvel_abonne', titre: '5 nouveaux abonnés cette semaine', message: 'Votre communauté grandit ! Vous avez désormais 87 abonnés sur la plateforme.', temps: 'Il y a 3 jours', lu: true },
]

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState(initialNotifs)

  const nonLues = notifs.filter(n => !n.lu).length

  const marquerLu = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
  const marquerToutLu = () => setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  const supprimer = (id) => setNotifs(prev => prev.filter(n => n.id !== id))

  return (
    <div className="flex flex-col gap-4 max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {notifs.length} notification{notifs.length > 1 ? 's' : ''}
          </span>
          {nonLues > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
              style={{ background: 'var(--color-danger)' }}>
              {nonLues} non lu{nonLues > 1 ? 'es' : 'e'}
            </span>
          )}
        </div>
        {nonLues > 0 && (
          <button onClick={marquerToutLu}
            className="text-xs px-3 py-1.5 rounded-lg border font-medium"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-2">
        {notifs.map(notif => {
          const tc = typeConfig[notif.type]
          return (
            <div key={notif.id} onClick={() => marquerLu(notif.id)}
              className="bg-white rounded-xl border p-4 cursor-pointer transition-all"
              style={{
                borderColor: notif.lu ? 'var(--color-border)' : 'var(--color-primary)',
                borderLeftWidth: notif.lu ? '1px' : '3px',
              }}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: tc.bg }}>
                  {tc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{notif.titre}</span>
                    {!notif.lu && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--color-success)' }} />}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>{notif.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.color }}>{tc.label}</span>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{notif.temps}</span>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); supprimer(notif.id) }}
                  className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 opacity-40 hover:opacity-100"
                  style={{ background: 'var(--color-bg)', color: 'var(--color-muted)' }}>
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {notifs.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
          <div className="text-4xl mb-3">🔔</div>
          <div className="text-sm font-medium">Aucune notification</div>
          <div className="text-xs mt-1">Vous êtes à jour !</div>
        </div>
      )}
    </div>
  )
}

export default NotificationsPage
