import { useState } from 'react'

const favoris = [
  { id: 1, univLogo: 'UJK', univColor: 'var(--color-primary)', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Constitutionnel — Chapitre 4', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours', score: 94, date: '18 Mai 2026' },
  { id: 2, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, date: '15 Mai 2026' },
  { id: 3, univLogo: 'BIT', univColor: '#555', universite: 'BIT Burkina', auteur: 'Prof. Kaboré Adama', titre: 'Introduction à l\'Informatique', matiere: 'Informatique', niveau: 'Licence 1', type: 'Cours', score: 91, date: '10 Mai 2026' },
]

const initialTelechargements = [
  { id: 1, univLogo: 'UJK', univColor: 'var(--color-primary)', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Civil — Introduction générale', matiere: 'Droit', niveau: 'Licence 1', type: 'Cours', score: 87, taille: '2.4 Mo', date: '19 Mai 2026' },
  { id: 2, univLogo: 'ISGE', univColor: 'var(--color-gold)', universite: 'ISGE-BF', auteur: 'Prof. Zongo Issa', titre: 'TD Finance d\'entreprise — Exercices S2', matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, taille: '1.1 Mo', date: '16 Mai 2026' },
  { id: 3, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2023', matiere: 'Mathématiques', niveau: 'Licence 2', type: 'Annales', score: 85, taille: '3.8 Mo', date: '12 Mai 2026' },
]

const historique = [
  { id: 1, univLogo: 'UJK', univColor: 'var(--color-primary)', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Constitutionnel — Chapitre 4', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours', score: 94, temps: 'Aujourd\'hui, 09h14' },
  { id: 2, univLogo: 'BIT', univColor: '#555', universite: 'BIT Burkina', auteur: 'Prof. Kaboré Adama', titre: 'Introduction à l\'Informatique', matiere: 'Informatique', niveau: 'Licence 1', type: 'Cours', score: 91, temps: 'Hier, 14h32' },
  { id: 3, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, temps: 'Hier, 11h05' },
  { id: 4, univLogo: 'ISGE', univColor: 'var(--color-gold)', universite: 'ISGE-BF', auteur: 'Prof. Zongo Issa', titre: 'TD Finance d\'entreprise — Exercices S2', matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, temps: 'Il y a 3 jours' },
]

const TABS = ['Favoris', 'Téléchargés', 'Historique']

const ScoreBadge = ({ score }) => {
  const config =
    score >= 75
      ? { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: '✓' }
      : score >= 50
      ? { bg: 'var(--color-gold-light)', color: 'var(--color-gold)', label: '~' }
      : { bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: '!' }
  return (
    <span className="text-xs font-semibold px-2 py-1 rounded-full"
      style={{ background: config.bg, color: config.color }}>
      {config.label} {score}
    </span>
  )
}

const DocCard = ({ doc, onSupprimer, showOffline, showTemps }) => (
  <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
    <div className="flex items-start gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
        style={{ background: doc.univColor }}>
        {doc.univLogo}
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{doc.universite}</div>
        <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
          {doc.auteur} · {showTemps ? doc.temps : doc.date}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showOffline && (
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            Offline
          </span>
        )}
        <ScoreBadge score={doc.score} />
      </div>
    </div>

    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
      {doc.titre}
    </div>

    <div className="flex gap-2 flex-wrap mb-3">
      <span className="text-xs px-2 py-0.5 rounded-full"
        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
        {doc.matiere}
      </span>
      <span className="text-xs px-2 py-0.5 rounded-full"
        style={{ background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>
        {doc.niveau}
      </span>
      <span className="text-xs px-2 py-0.5 rounded-full"
        style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
        {doc.type}
      </span>
      {showOffline && doc.taille && (
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'var(--color-bg)', color: 'var(--color-muted)' }}>
          {doc.taille}
        </span>
      )}
    </div>

    <div className="flex gap-2 flex-wrap">
      <button className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
        style={{ background: 'var(--color-primary)' }}>
        📖 Lire
      </button>
      {onSupprimer && (
        <button
          onClick={() => onSupprimer(doc.id)}
          className="text-xs px-3 py-1.5 rounded-lg border font-medium"
          style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
          🗑 Supprimer
        </button>
      )}
    </div>
  </div>
)

const BiblioPage = () => {
  const [tab, setTab] = useState('Favoris')
  const [downloads, setDownloads] = useState(initialTelechargements)
  const [confirmLiberer, setConfirmLiberer] = useState(false)

  const supprimerDownload = (id) => {
    setDownloads(prev => prev.filter(d => d.id !== id))
  }

  const libererEspace = () => {
    setDownloads([])
    setConfirmLiberer(false)
  }

  const totalTaille = downloads.reduce((acc, d) => {
    const val = parseFloat(d.taille)
    return acc + val
  }, 0).toFixed(1)

  return (
    <div className="flex flex-col gap-4 max-w-2xl">

      {/* Onglets */}
      <div className="bg-white rounded-xl border p-1 flex gap-1" style={{ borderColor: 'var(--color-border)' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
            style={{
              background: tab === t ? 'var(--color-primary)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--color-muted)',
            }}>
            {t === 'Favoris' && '♥ '}
            {t === 'Téléchargés' && '⬇ '}
            {t === 'Historique' && '🕓 '}
            {t}
            {t === 'Favoris' && <span className="ml-1 text-xs opacity-70">({favoris.length})</span>}
            {t === 'Téléchargés' && <span className="ml-1 text-xs opacity-70">({downloads.length})</span>}
          </button>
        ))}
      </div>

      {/* Onglet Favoris */}
      {tab === 'Favoris' && (
        <>
          {favoris.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
              <div className="text-4xl mb-3">♥</div>
              <div className="text-sm">Aucun favori pour le moment</div>
            </div>
          ) : (
            favoris.map(doc => <DocCard key={doc.id} doc={doc} />)
          )}
        </>
      )}

      {/* Onglet Téléchargés */}
      {tab === 'Téléchargés' && (
        <>
          {downloads.length > 0 && (
            <div className="bg-white rounded-xl border p-3 flex items-center justify-between"
              style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                  {downloads.length} fichier{downloads.length > 1 ? 's' : ''} · {totalTaille} Mo utilisés
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  Disponibles sans connexion
                </div>
              </div>
              {confirmLiberer ? (
                <div className="flex gap-2">
                  <button
                    onClick={libererEspace}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: 'var(--color-danger)' }}>
                    Confirmer
                  </button>
                  <button
                    onClick={() => setConfirmLiberer(false)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmLiberer(true)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                  style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                  Libérer l'espace
                </button>
              )}
            </div>
          )}

          {downloads.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
              <div className="text-4xl mb-3">⬇</div>
              <div className="text-sm">Aucun fichier téléchargé</div>
              <div className="text-xs mt-1">Télécharge des docs pour les lire hors connexion</div>
            </div>
          ) : (
            downloads.map(doc => (
              <DocCard
                key={doc.id}
                doc={doc}
                showOffline
                onSupprimer={supprimerDownload}
              />
            ))
          )}
        </>
      )}

      {/* Onglet Historique */}
      {tab === 'Historique' && (
        <>
          {historique.length === 0 ? (
            <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
              <div className="text-4xl mb-3">🕓</div>
              <div className="text-sm">Aucun historique de lecture</div>
            </div>
          ) : (
            historique.map(doc => <DocCard key={doc.id} doc={doc} showTemps />)
          )}
        </>
      )}

    </div>
  )
}

export default BiblioPage
