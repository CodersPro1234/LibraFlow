import { useState } from 'react'

const favoris = [
  { id: 1, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Constitutionnel — Chapitre 4', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours', score: 94, date: '18 Mai 2026' },
  { id: 2, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, date: '15 Mai 2026' },
  { id: 3, univLogo: 'BIT', univColor: '#555', universite: 'BIT Burkina', auteur: "Prof. Kaboré Adama", titre: "Introduction à l'Informatique", matiere: 'Informatique', niveau: 'Licence 1', type: 'Cours', score: 91, date: '10 Mai 2026' },
]

const initialDownloads = [
  { id: 1, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Civil — Introduction générale', matiere: 'Droit', niveau: 'Licence 1', type: 'Cours', score: 87, taille: '2.4 Mo', date: '19 Mai 2026' },
  { id: 2, univLogo: 'ISGE', univColor: '#f59e0b', universite: 'ISGE-BF', auteur: 'Prof. Zongo Issa', titre: 'TD Finance d\'entreprise — Exercices S2', matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, taille: '1.1 Mo', date: '16 Mai 2026' },
  { id: 3, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2023', matiere: 'Mathématiques', niveau: 'Licence 2', type: 'Annales', score: 85, taille: '3.8 Mo', date: '12 Mai 2026' },
]

const historique = [
  { id: 1, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Constitutionnel — Chapitre 4', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours', score: 94, temps: "Aujourd'hui, 09h14" },
  { id: 2, univLogo: 'BIT', univColor: '#555', universite: 'BIT Burkina', auteur: 'Prof. Kaboré Adama', titre: "Introduction à l'Informatique", matiere: 'Informatique', niveau: 'Licence 1', type: 'Cours', score: 91, temps: 'Hier, 14h32' },
  { id: 3, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, temps: 'Hier, 11h05' },
  { id: 4, univLogo: 'ISGE', univColor: '#f59e0b', universite: 'ISGE-BF', auteur: 'Prof. Zongo Issa', titre: 'TD Finance d\'entreprise — S2', matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, temps: 'Il y a 3 jours' },
]

const TABS = [
  { key: 'Favoris', icon: '♥', color: 'var(--color-danger)' },
  { key: 'Téléchargés', icon: '⬇', color: 'var(--color-primary)' },
  { key: 'Historique', icon: '🕓', color: 'var(--color-muted)' },
]

const scoreStyle = (s) => s >= 75
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : { bg: 'var(--color-gold-light)', color: 'var(--color-gold)' }

const DocCard = ({ doc, onSupprimer, showOffline, showTemps }) => {
  const sc = scoreStyle(doc.score)
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <div style={{ height: '3px', background: doc.univColor }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: doc.univColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {doc.univLogo}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.universite}</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{doc.auteur} · {showTemps ? doc.temps : doc.date}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {showOffline && <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>Offline</span>}
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '100px', background: sc.bg, color: sc.color }}>IA {doc.score}</span>
          </div>
        </div>

        <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', lineHeight: 1.3, marginBottom: '10px' }}>{doc.titre}</div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{doc.matiere}</span>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>{doc.niveau}</span>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>{doc.type}</span>
          {showOffline && doc.taille && <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: '#F3F4F6', color: '#6B7280' }}>{doc.taille}</span>}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '8px 16px', borderRadius: '9px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            📖 Lire
          </button>
          {onSupprimer && (
            <button onClick={() => onSupprimer(doc.id)}
              style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid var(--color-danger)', background: '#fff', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              🗑 Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const Empty = ({ icon, text, sub }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-muted)' }}>
    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
    <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>{text}</div>
    {sub && <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>{sub}</div>}
  </div>
)

const BiblioPage = () => {
  const [tab, setTab] = useState('Favoris')
  const [downloads, setDownloads] = useState(initialDownloads)
  const [confirmLiberer, setConfirmLiberer] = useState(false)

  const supprimerDownload = (id) => setDownloads(prev => prev.filter(d => d.id !== id))
  const libererEspace = () => { setDownloads([]); setConfirmLiberer(false) }
  const totalTaille = downloads.reduce((a, d) => a + parseFloat(d.taille), 0).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Tabs */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '5px', display: 'flex', gap: '4px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '9px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === t.key ? 'var(--color-primary)' : 'transparent',
              color: tab === t.key ? '#fff' : '#6B7280',
            }}>
            {t.icon} {t.key}
            {t.key === 'Favoris' && <span style={{ marginLeft: '4px', opacity: 0.75 }}>({favoris.length})</span>}
            {t.key === 'Téléchargés' && <span style={{ marginLeft: '4px', opacity: 0.75 }}>({downloads.length})</span>}
          </button>
        ))}
      </div>

      {/* Favoris */}
      {tab === 'Favoris' && (
        favoris.length === 0
          ? <Empty icon="♥" text="Aucun favori" />
          : favoris.map(doc => <DocCard key={doc.id} doc={doc} />)
      )}

      {/* Téléchargés */}
      {tab === 'Téléchargés' && (
        <>
          {downloads.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{downloads.length} fichier{downloads.length > 1 ? 's' : ''} · {totalTaille} Mo</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Disponibles sans connexion</div>
              </div>
              {confirmLiberer ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={libererEspace} style={{ padding: '8px 14px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Confirmer</button>
                  <button onClick={() => setConfirmLiberer(false)} style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                </div>
              ) : (
                <button onClick={() => setConfirmLiberer(true)} style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid var(--color-danger)', background: '#fff', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  Libérer l'espace
                </button>
              )}
            </div>
          )}
          {downloads.length === 0
            ? <Empty icon="⬇" text="Aucun fichier téléchargé" sub="Télécharge des docs pour les lire hors connexion" />
            : downloads.map(doc => <DocCard key={doc.id} doc={doc} showOffline onSupprimer={supprimerDownload} />)
          }
        </>
      )}

      {/* Historique */}
      {tab === 'Historique' && (
        historique.length === 0
          ? <Empty icon="🕓" text="Aucun historique" />
          : historique.map(doc => <DocCard key={doc.id} doc={doc} showTemps />)
      )}
    </div>
  )
}

export default BiblioPage
