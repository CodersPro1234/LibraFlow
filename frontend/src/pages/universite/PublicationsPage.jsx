import { useState } from 'react'

const initialDocs = [
  { id: 1, titre: 'Droit Constitutionnel — Chapitre 4', prof: 'Ouédraogo Mamadou', matiere: 'Droit', type: 'Cours', vues: 412, score: 94, date: '18 Mai 2026' },
  { id: 2, titre: 'Annales Maths 2024', prof: 'Fatima Yameogo', matiere: 'Maths', type: 'Annales', vues: 389, score: 88, date: '15 Mai 2026' },
  { id: 3, titre: 'Introduction à l\'Économie', prof: 'Amadou Kaboré', matiere: 'Économie', type: 'Cours', vues: 298, score: 76, date: '10 Mai 2026' },
  { id: 4, titre: 'TD Algorithmique — Série 3', prof: 'Boubacar Sawadogo', matiere: 'Informatique', type: 'TD', vues: 187, score: 91, date: '08 Mai 2026' },
  { id: 5, titre: 'Biologie Cellulaire — L1', prof: 'Rose Compaoré', matiere: 'Biologie', type: 'Cours', vues: 143, score: 65, date: '03 Mai 2026' },
  { id: 6, titre: 'Droit Civil — Introduction', prof: 'Ouédraogo Mamadou', matiere: 'Droit', type: 'Cours', vues: 289, score: 87, date: '01 Mai 2026' },
]

const MATIERES = ['Toutes', 'Droit', 'Maths', 'Économie', 'Informatique', 'Biologie']
const TYPES = ['Tous', 'Cours', 'TD', 'Annales']

const PublicationsPage = () => {
  const [docs, setDocs] = useState(initialDocs)
  const [confirm, setConfirm] = useState(null)
  const [filterMatiere, setFilterMatiere] = useState('Toutes')
  const [filterType, setFilterType] = useState('Tous')

  const supprimer = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id))
    setConfirm(null)
  }

  const filtered = docs.filter(d => {
    const mOk = filterMatiere === 'Toutes' || d.matiere === filterMatiere
    const tOk = filterType === 'Tous' || d.type === filterType
    return mOk && tOk
  })

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Documents publiés', value: docs.length, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          { label: 'Score IA moyen', value: Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length) + ' / 100', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
          { label: 'Vues totales', value: docs.reduce((s, d) => s + d.vues, 0).toLocaleString(), color: 'var(--color-gold)', bg: 'var(--color-gold-light)' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border p-4 flex gap-6 flex-wrap" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Matière</span>
          <div className="flex gap-2 flex-wrap">
            {MATIERES.map(m => (
              <button
                key={m}
                onClick={() => setFilterMatiere(m)}
                className="text-xs px-3 py-1 rounded-full font-medium transition-all"
                style={{
                  background: filterMatiere === m ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  color: filterMatiere === m ? '#fff' : 'var(--color-primary)',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Type</span>
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className="text-xs px-3 py-1 rounded-full font-medium transition-all"
                style={{
                  background: filterType === t ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  color: filterType === t ? '#fff' : 'var(--color-primary)',
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        {/* Header */}
        <div className="px-4 py-3 border-b grid grid-cols-12 gap-3 text-xs font-medium"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)', background: 'var(--color-bg)' }}>
          <div className="col-span-5">Titre</div>
          <div className="col-span-2">Professeur</div>
          <div className="col-span-1 text-center">Vues</div>
          <div className="col-span-1 text-center">Score IA</div>
          <div className="col-span-1 text-center">Type</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {filtered.map((doc) => (
            <div key={doc.id} className="px-4 py-3 grid grid-cols-12 gap-3 items-center">
              {/* Titre */}
              <div className="col-span-5">
                <div className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{doc.titre}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{doc.date}</div>
              </div>

              {/* Prof */}
              <div className="col-span-2 text-xs" style={{ color: 'var(--color-muted)' }}>
                {doc.prof.split(' ')[0]}
              </div>

              {/* Vues */}
              <div className="col-span-1 text-center text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                {doc.vues}
              </div>

              {/* Score */}
              <div className="col-span-1 text-center">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: doc.score >= 80 ? 'var(--color-success-light)' : doc.score >= 65 ? 'var(--color-gold-light)' : 'var(--color-danger-light)',
                    color: doc.score >= 80 ? 'var(--color-success)' : doc.score >= 65 ? 'var(--color-gold)' : 'var(--color-danger)',
                  }}>
                  {doc.score}
                </span>
              </div>

              {/* Type */}
              <div className="col-span-1 text-center">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  {doc.type}
                </span>
              </div>

              {/* Action */}
              <div className="col-span-2 flex justify-end">
                {confirm === doc.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => supprimer(doc.id)}
                      className="text-xs px-2 py-1 rounded-lg font-medium text-white"
                      style={{ background: 'var(--color-danger)' }}>
                      Confirmer
                    </button>
                    <button
                      onClick={() => setConfirm(null)}
                      className="text-xs px-2 py-1 rounded-lg border font-medium"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}>
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirm(doc.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                    style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--color-muted)' }}>
            <div className="text-3xl mb-2">📄</div>
            <div className="text-sm">Aucun document pour ces filtres</div>
          </div>
        )}
      </div>

    </div>
  )
}

export default PublicationsPage
