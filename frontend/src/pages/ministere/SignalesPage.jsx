import { useState } from 'react'

const initialSignalements = [
  {
    id: 1,
    titre: 'TD Économie — Série 2 (copie partielle)',
    auteur: 'Kaboré Idrissa',
    universite: 'USTA Bobo-Dioulasso',
    source: 'IA',
    motif: 'Plagiat détecté — 78 % de similarité avec un document existant',
    date: '20 Mai 2026',
    gravite: 'haute',
  },
  {
    id: 2,
    titre: 'Cours de Biologie — Introduction',
    auteur: 'Compaoré Jean',
    universite: 'Univ. Joseph Ki-Zerbo',
    source: 'Utilisateur',
    motif: 'Contenu hors programme — section politique non académique',
    date: '19 Mai 2026',
    gravite: 'moyenne',
  },
  {
    id: 3,
    titre: 'Annales Mathématiques 2022',
    auteur: 'Traoré Noufou',
    universite: 'ISGE-BF Ouagadougou',
    source: 'IA',
    motif: 'Fichier corrompu — le PDF ne peut être lu correctement',
    date: '17 Mai 2026',
    gravite: 'basse',
  },
  {
    id: 4,
    titre: 'Droit International Public — L3',
    auteur: 'Sawadogo Amidou',
    universite: 'Univ. Norbert Zongo',
    source: 'Utilisateur',
    motif: 'Informations inexactes — dates et données juridiques erronées',
    date: '15 Mai 2026',
    gravite: 'moyenne',
  },
]

const graviteConfig = {
  haute: { label: 'Haute', bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  moyenne: { label: 'Moyenne', bg: 'var(--color-gold-light)', color: 'var(--color-gold)' },
  basse: { label: 'Basse', bg: 'var(--color-success-light)', color: 'var(--color-success)' },
}

const SignalesPage = () => {
  const [signalements, setSignalements] = useState(initialSignalements)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, color) => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2500)
  }

  const handleAction = (id, action) => {
    if (action === 'supprimer' || action === 'innocenter') {
      setSignalements(prev => prev.filter(s => s.id !== id))
      showToast(
        action === 'supprimer' ? 'Document supprimé définitivement.' : 'Contenu innocenté et réactivé.',
        action === 'supprimer' ? 'var(--color-danger)' : 'var(--color-success)'
      )
    } else if (action === 'avertir') {
      showToast('Avertissement envoyé à l\'université.', 'var(--color-gold)')
    }
    setConfirm(null)
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: toast.color }}>
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Signalements actifs', value: signalements.length, color: 'var(--color-danger)', bg: 'var(--color-danger-light)', icon: '🚨' },
          { label: 'Signalés par l\'IA', value: signalements.filter(s => s.source === 'IA').length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🤖' },
          { label: 'Signalés par usagers', value: signalements.filter(s => s.source === 'Utilisateur').length, color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '👥' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="flex flex-col gap-3">
        {signalements.map((sig) => {
          const gc = graviteConfig[sig.gravite]
          const isConfirming = confirm?.id === sig.id
          return (
            <div key={sig.id} className="bg-white rounded-xl border p-4"
              style={{ borderColor: sig.gravite === 'haute' ? 'var(--color-danger)' : 'var(--color-border)' }}>

              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                      {sig.titre}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ background: gc.bg, color: gc.color }}>
                      Gravité {gc.label}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {sig.auteur} · {sig.universite}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: sig.source === 'IA' ? 'var(--color-primary-light)' : 'var(--color-gold-light)',
                      color: sig.source === 'IA' ? 'var(--color-primary)' : 'var(--color-gold)',
                    }}>
                    {sig.source === 'IA' ? '🤖 IA' : '👥 Utilisateur'}
                  </span>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{sig.date}</div>
                </div>
              </div>

              {/* Motif */}
              <div className="p-3 rounded-lg mb-3" style={{ background: 'var(--color-bg)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Motif : </span>
                <span className="text-xs" style={{ color: 'var(--color-text)' }}>{sig.motif}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {isConfirming ? (
                  <>
                    <button
                      onClick={() => handleAction(sig.id, confirm.action)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                      style={{
                        background: confirm.action === 'supprimer' ? 'var(--color-danger)'
                          : confirm.action === 'avertir' ? 'var(--color-gold)'
                          : 'var(--color-success)',
                      }}>
                      Confirmer
                    </button>
                    <button
                      onClick={() => setConfirm(null)}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirm({ id: sig.id, action: 'supprimer' })}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                      style={{ background: 'var(--color-danger)' }}>
                      Supprimer définitivement
                    </button>
                    <button
                      onClick={() => setConfirm({ id: sig.id, action: 'avertir' })}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                      style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)' }}>
                      Avertir l'université
                    </button>
                    <button
                      onClick={() => setConfirm({ id: sig.id, action: 'innocenter' })}
                      className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                      style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                      Innocenter
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {signalements.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
          <div className="text-4xl mb-3">✅</div>
          <div className="text-sm font-medium">Aucun signalement en attente</div>
          <div className="text-xs mt-1">La plateforme est propre.</div>
        </div>
      )}

    </div>
  )
}

export default SignalesPage
