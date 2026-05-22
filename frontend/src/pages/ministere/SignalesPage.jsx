import { useState } from 'react'

const initialSignalements = [
  { id: 1, titre: 'TD Économie — Série 2 (copie partielle)', auteur: 'Kaboré Idrissa', universite: 'USTA Bobo-Dioulasso', source: 'IA', motif: 'Plagiat détecté — 78 % de similarité avec un document existant', date: '20 Mai 2026', gravite: 'haute' },
  { id: 2, titre: 'Cours de Biologie — Introduction', auteur: 'Compaoré Jean', universite: 'Univ. Joseph Ki-Zerbo', source: 'Utilisateur', motif: 'Contenu hors programme — section politique non académique', date: '19 Mai 2026', gravite: 'moyenne' },
  { id: 3, titre: 'Annales Mathématiques 2022', auteur: 'Traoré Noufou', universite: 'ISGE-BF Ouagadougou', source: 'IA', motif: 'Fichier corrompu — le PDF ne peut être lu correctement', date: '17 Mai 2026', gravite: 'basse' },
  { id: 4, titre: 'Droit International Public — L3', auteur: 'Sawadogo Amidou', universite: 'Univ. Norbert Zongo', source: 'Utilisateur', motif: 'Informations inexactes — dates et données juridiques erronées', date: '15 Mai 2026', gravite: 'moyenne' },
]

const graviteConfig = {
  haute:   { label: 'Haute',   bg: '#FEE2E2',                    color: 'var(--color-danger)' },
  moyenne: { label: 'Moyenne', bg: 'var(--color-gold-light)',    color: 'var(--color-gold)' },
  basse:   { label: 'Basse',   bg: 'var(--color-success-light)', color: 'var(--color-success)' },
}

const card = { background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '18px 20px' }

const SignalesPage = () => {
  const [signalements, setSignalements] = useState(initialSignalements)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, color) => { setToast({ msg, color }); setTimeout(() => setToast(null), 2500) }

  const handleAction = (id, action) => {
    if (action === 'supprimer' || action === 'innocenter') {
      setSignalements(prev => prev.filter(s => s.id !== id))
      showToast(action === 'supprimer' ? 'Document supprimé définitivement.' : 'Contenu innocenté et réactivé.',
        action === 'supprimer' ? 'var(--color-danger)' : 'var(--color-success)')
    } else if (action === 'avertir') {
      showToast("Avertissement envoyé à l'université.", 'var(--color-gold)')
    }
    setConfirm(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 50, padding: '12px 20px', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', background: toast.color }}>
          {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Signalements actifs',  value: signalements.length,                                  color: 'var(--color-danger)',  bg: '#FEE2E2',                    icon: '🚨' },
          { label: "Signalés par l'IA",    value: signalements.filter(s => s.source === 'IA').length,   color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🤖' },
          { label: 'Signalés par usagers', value: signalements.filter(s => s.source !== 'IA').length,   color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '👥' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {signalements.map((sig) => {
          const gc = graviteConfig[sig.gravite]
          const isConfirming = confirm?.id === sig.id
          return (
            <div key={sig.id} style={{ ...card, border: `1px solid ${sig.gravite === 'haute' ? 'var(--color-danger)' : '#E5E7EB'}` }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{sig.titre}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: gc.bg, color: gc.color, flexShrink: 0 }}>
                      Gravité {gc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{sig.auteur} · {sig.universite}</div>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px',
                    background: sig.source === 'IA' ? 'var(--color-primary-light)' : 'var(--color-gold-light)',
                    color: sig.source === 'IA' ? 'var(--color-primary)' : 'var(--color-gold)',
                  }}>
                    {sig.source === 'IA' ? '🤖 IA' : '👥 Utilisateur'}
                  </span>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{sig.date}</div>
                </div>
              </div>

              {/* Motif */}
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#F9FAFB', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF' }}>Motif : </span>
                <span style={{ fontSize: '13px', color: '#374151' }}>{sig.motif}</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {isConfirming ? (
                  <>
                    <button onClick={() => handleAction(sig.id, confirm.action)}
                      style={{ padding: '8px 16px', borderRadius: '9px', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#fff',
                        background: confirm.action === 'supprimer' ? 'var(--color-danger)' : confirm.action === 'avertir' ? 'var(--color-gold)' : 'var(--color-success)',
                      }}>Confirmer</button>
                    <button onClick={() => setConfirm(null)}
                      style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setConfirm({ id: sig.id, action: 'supprimer' })}
                      style={{ padding: '8px 14px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      Supprimer définitivement
                    </button>
                    <button onClick={() => setConfirm({ id: sig.id, action: 'avertir' })}
                      style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid var(--color-gold)', background: '#fff', color: 'var(--color-gold)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      Avertir l'université
                    </button>
                    <button onClick={() => setConfirm({ id: sig.id, action: 'innocenter' })}
                      style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid var(--color-success)', background: '#fff', color: 'var(--color-success)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                      Innocenter
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}

        {signalements.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>Aucun signalement en attente</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>La plateforme est propre.</div>
          </div>
        )}
      </div>

    </div>
  )
}

export default SignalesPage
