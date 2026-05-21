import { useState } from 'react'

const typeConfig = {
  nouveau_prof: { icon: '⏳', bg: 'var(--color-gold-light)', color: 'var(--color-gold)', label: 'Nouveau professeur' },
  nouveau_doc: { icon: '📄', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Nouveau document' },
  doc_signale: { icon: '⚠️', bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'Document signalé' },
  message_ministere: { icon: '🏛', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Ministère' },
  rapport_mensuel: { icon: '📊', bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Rapport mensuel' },
}

const initialNotifs = [
  { id: 1, type: 'nouveau_prof', titre: 'Nouvelle demande d\'adhésion', message: 'Dr. Issouf Compaoré (Droit Public, Maître de conférences) a soumis une demande pour rejoindre votre université. Vérifiez son dossier.', temps: 'Il y a 20 min', lu: false },
  { id: 2, type: 'doc_signale', titre: 'Document signalé par l\'IA', message: '"Annales Droit Administratif S1" (Prof. Sawadogo K.) a été signalé pour incohérence de niveau. Une révision est recommandée.', temps: 'Il y a 1h', lu: false },
  { id: 3, type: 'nouveau_doc', titre: 'Nouveau document publié', message: 'Prof. Ouédraogo Mamadou a publié "Droit Constitutionnel — Chapitre 6". Score IA : 94/100. Disponible pour les étudiants.', temps: 'Il y a 2h', lu: false },
  { id: 4, type: 'message_ministere', titre: 'Message officiel du Ministère', message: 'MENAPLN : Rappel — Soumettez le rapport annuel de vos professeurs avant le 31 Mai 2026. Formulaire disponible sur le portail ministériel.', temps: 'Il y a 5h', lu: true },
  { id: 5, type: 'nouveau_prof', titre: '2 demandes en attente', message: 'Vous avez 2 demandes de professeurs en attente de validation depuis plus de 48h. Traitez-les pour ne pas bloquer leurs accès.', temps: 'Hier, 11h30', lu: true },
  { id: 6, type: 'nouveau_doc', titre: '8 documents publiés cette semaine', message: 'Vos professeurs ont été très actifs. 8 nouveaux documents ont été publiés et validés par l\'IA cette semaine.', temps: 'Hier, 09h00', lu: true },
  { id: 7, type: 'rapport_mensuel', titre: 'Rapport mensuel — Avril 2026', message: 'Votre rapport mensuel est disponible : 4 218 étudiants actifs, 38 professeurs, 840 documents publiés. Score de qualité moyen : 88/100.', temps: 'Il y a 3 jours', lu: true },
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
