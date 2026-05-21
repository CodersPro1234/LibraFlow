import { useState } from 'react'

const typeConfig = {
  nouveau_doc: {
    icon: '📄',
    bg: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
    label: 'Nouveau document',
  },
  reponse_commentaire: {
    icon: '💬',
    bg: 'var(--color-success-light)',
    color: 'var(--color-success)',
    label: 'Réponse commentaire',
  },
  nouveau_contenu_prof: {
    icon: '👨‍🏫',
    bg: 'var(--color-gold-light)',
    color: 'var(--color-gold)',
    label: 'Prof suivi',
  },
  systeme: {
    icon: '🔔',
    bg: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
    label: 'Système',
  },
}

const initialNotifs = [
  {
    id: 1,
    type: 'nouveau_doc',
    titre: 'Nouveau cours disponible',
    message: 'Prof. Ouédraogo Mamadou a publié "Droit Constitutionnel — Chapitre 5".',
    temps: 'Il y a 10 min',
    lu: false,
  },
  {
    id: 2,
    type: 'reponse_commentaire',
    titre: 'Réponse à votre commentaire',
    message: 'Prof. Traoré Fatoumata a répondu : "Bonne remarque, le corrigé sera mis en ligne demain."',
    temps: 'Il y a 1h',
    lu: false,
  },
  {
    id: 3,
    type: 'nouveau_contenu_prof',
    titre: 'Prof. Zongo Issa a publié',
    message: '"TD Finance d\'entreprise — Série 3" est maintenant disponible en téléchargement.',
    temps: 'Il y a 3h',
    lu: false,
  },
  {
    id: 4,
    type: 'nouveau_doc',
    titre: 'Recommandé pour toi',
    message: 'L\'IA a identifié 2 nouveaux documents correspondant à ton niveau Licence 2 en Droit.',
    temps: 'Hier, 09h22',
    lu: true,
  },
  {
    id: 5,
    type: 'reponse_commentaire',
    titre: 'Nouveau like sur ton commentaire',
    message: '3 personnes ont aimé ton commentaire sur "Annales Mathématiques 2024/2025".',
    temps: 'Hier, 08h15',
    lu: true,
  },
  {
    id: 6,
    type: 'nouveau_contenu_prof',
    titre: 'Prof. Kaboré Adama a publié',
    message: 'Un nouveau résumé "Algorithmes de tri — L1" vient d\'être validé par l\'université.',
    temps: 'Il y a 2 jours',
    lu: true,
  },
  {
    id: 7,
    type: 'systeme',
    titre: 'Connexion offline détectée',
    message: 'LibraFlow fonctionne en mode hors ligne. Tes téléchargements restent accessibles.',
    temps: 'Il y a 3 jours',
    lu: true,
  },
]

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState(initialNotifs)

  const nonLues = notifs.filter(n => !n.lu).length

  const marquerToutLu = () => {
    setNotifs(prev => prev.map(n => ({ ...n, lu: true })))
  }

  const marquerLu = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lu: true } : n))
  }

  const supprimer = (id) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

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
          <button
            onClick={marquerToutLu}
            className="text-xs px-3 py-1.5 rounded-lg border font-medium"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-2">
        {notifs.map((notif) => {
          const tc = typeConfig[notif.type]
          return (
            <div
              key={notif.id}
              onClick={() => marquerLu(notif.id)}
              className="bg-white rounded-xl border p-4 cursor-pointer transition-all"
              style={{
                borderColor: notif.lu ? 'var(--color-border)' : 'var(--color-primary)',
                borderLeftWidth: notif.lu ? '1px' : '3px',
              }}>
              <div className="flex items-start gap-3">
                {/* Icône type */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: tc.bg }}>
                  {tc.icon}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                      {notif.titre}
                    </span>
                    {!notif.lu && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: 'var(--color-success)' }} />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: tc.bg, color: tc.color }}>
                      {tc.label}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      {notif.temps}
                    </span>
                  </div>
                </div>

                {/* Supprimer */}
                <button
                  onClick={(e) => { e.stopPropagation(); supprimer(notif.id) }}
                  className="text-xs w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity"
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
          <div className="text-xs mt-1">Tu es à jour !</div>
        </div>
      )}

    </div>
  )
}

export default NotificationsPage
