import { useState } from 'react'

const typeConfig = {
  universite_attente: { icon: '⏳', bg: 'var(--color-gold-light)', color: 'var(--color-gold)', label: 'Université en attente' },
  contenu_signale: { icon: '⚠️', bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'Contenu signalé' },
  rapport_mensuel: { icon: '📊', bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Rapport mensuel' },
  alerte_suspecte: { icon: '🚨', bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'Alerte critique' },
}

const initialNotifs = [
  { id: 1, type: 'universite_attente', titre: 'Nouvelle demande d\'agrément', message: 'L\'Université Privée de Bobo-Dioulasso (UPBD) a soumis un dossier d\'agrément complet. 3 documents joints. En attente de validation MENAPLN.', temps: 'Il y a 45 min', lu: false },
  { id: 2, type: 'alerte_suspecte', titre: 'Alerte : activité anormale détectée', message: 'L\'Université Saint-Thomas d\'Aquin a enregistré 847 téléchargements en 2h (pic inhabituel). Vérification recommandée.', temps: 'Il y a 1h30', lu: false },
  { id: 3, type: 'contenu_signale', titre: '3 documents signalés cette semaine', message: 'Semaine du 12 Mai : 3 documents ont été signalés pour plagiat ou incohérence de matière. 1 à l\'UJK-Zerbo, 2 à l\'UPB.', temps: 'Il y a 3h', lu: false },
  { id: 4, type: 'universite_attente', titre: 'Dossier en attente depuis 5 jours', message: 'Le dossier de l\'Institut Supérieur de Génie Civil (ISGC) est en attente depuis le 16 Mai. Une décision doit être prise avant expiration.', temps: 'Hier, 08h00', lu: true },
  { id: 5, type: 'rapport_mensuel', titre: 'Rapport national — Avril 2026', message: 'Synthèse nationale disponible : 12 universités actives, 47 289 étudiants, 5 120 documents publiés. Taux de validation IA : 94%. Rapport complet dans Statistiques.', temps: 'Il y a 3 jours', lu: true },
  { id: 6, type: 'contenu_signale', titre: 'Signalement résolu', message: 'Le document "Cours de Physique Quantique" signalé le 10 Mai a été retiré par l\'auteur suite à la mise en demeure automatique.', temps: 'Il y a 5 jours', lu: true },
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
