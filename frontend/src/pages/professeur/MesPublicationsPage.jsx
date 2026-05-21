import { useState } from 'react'

const publications = [
  {
    id: 1,
    titre: 'Droit Constitutionnel — Chapitre 4',
    matiere: 'Droit Constitutionnel',
    niveau: 'Licence 2',
    type: 'Cours',
    vues: 412,
    likes: 24,
    telechargements: 98,
    commentaires: 8,
    score: 94,
    date: '18 Mai 2026',
  },
  {
    id: 2,
    titre: 'Droit Civil — Introduction générale',
    matiere: 'Droit Civil',
    niveau: 'Licence 1',
    type: 'Cours',
    vues: 289,
    likes: 18,
    telechargements: 67,
    commentaires: 5,
    score: 87,
    date: '12 Mai 2026',
  },
  {
    id: 3,
    titre: 'Annales Droit 2023',
    matiere: 'Droit Constitutionnel',
    niveau: 'Licence 2',
    type: 'Annales',
    vues: 546,
    likes: 41,
    telechargements: 134,
    commentaires: 12,
    score: 71,
    date: '05 Mai 2026',
  },
]

const MesPublicationsPage = () => {
  const [docs, setDocs] = useState(publications)
  const [confirm, setConfirm] = useState(null)

  const supprimer = (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
    setConfirm(null)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
          {docs.length} document{docs.length > 1 ? 's' : ''} publié{docs.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Liste */}
      {docs.map((doc) => (
        <div key={doc.id} className="bg-white rounded-xl border p-4"
          style={{ borderColor: 'var(--color-border)' }}>

          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                {doc.titre}
              </div>
              <div className="flex gap-2 flex-wrap">
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
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
              style={{
                background: doc.score >= 75 ? 'var(--color-success-light)' : 'var(--color-gold-light)',
                color: doc.score >= 75 ? 'var(--color-success)' : 'var(--color-gold)',
              }}>
              ✓ {doc.score}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Vues', value: doc.vues, icon: '👁' },
              { label: 'Likes', value: doc.likes, icon: '♥' },
              { label: 'Téléch.', value: doc.telechargements, icon: '⬇' },
              { label: 'Comm.', value: doc.commentaires, icon: '💬' },
            ].map((s, i) => (
              <div key={i} className="text-center p-2 rounded-lg"
                style={{ background: 'var(--color-bg)' }}>
                <div className="text-xs mb-0.5">{s.icon}</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{s.value}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Publié le {doc.date}
            </span>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                ✏️ Éditer
              </button>
              {confirm === doc.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => supprimer(doc.id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: 'var(--color-danger)' }}>
                    Confirmer
                  </button>
                  <button
                    onClick={() => setConfirm(null)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirm(doc.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                  style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                  🗑 Supprimer
                </button>
              )}
            </div>
          </div>

        </div>
      ))}

      {docs.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--color-muted)' }}>
          <div className="text-4xl mb-3">📄</div>
          <div className="text-sm">Aucune publication pour le moment</div>
        </div>
      )}

    </div>
  )
}

export default MesPublicationsPage