import { useState } from 'react'

const initialDocs = [
  { id: 1, titre: 'Droit Constitutionnel — Chapitre 4', prof: 'Ouédraogo Mamadou', matiere: 'Droit',        type: 'Cours',   vues: 412, score: 94, date: '18 Mai 2026' },
  { id: 2, titre: 'Annales Maths 2024',                  prof: 'Fatima Yameogo',    matiere: 'Maths',        type: 'Annales', vues: 389, score: 88, date: '15 Mai 2026' },
  { id: 3, titre: "Introduction à l'Économie",           prof: 'Amadou Kaboré',     matiere: 'Économie',     type: 'Cours',   vues: 298, score: 76, date: '10 Mai 2026' },
  { id: 4, titre: 'TD Algorithmique — Série 3',          prof: 'Boubacar Sawadogo', matiere: 'Informatique', type: 'TD',      vues: 187, score: 91, date: '08 Mai 2026' },
  { id: 5, titre: 'Biologie Cellulaire — L1',            prof: 'Rose Compaoré',     matiere: 'Biologie',     type: 'Cours',   vues: 143, score: 65, date: '03 Mai 2026' },
  { id: 6, titre: 'Droit Civil — Introduction',          prof: 'Ouédraogo Mamadou', matiere: 'Droit',        type: 'Cours',   vues: 289, score: 87, date: '01 Mai 2026' },
]

const MATIERES = ['Toutes', 'Droit', 'Maths', 'Économie', 'Informatique', 'Biologie']
const TYPES    = ['Tous', 'Cours', 'TD', 'Annales']

const scoreStyle = (s) => s >= 80
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : s >= 65
  ? { bg: 'var(--color-gold-light)', color: 'var(--color-gold)' }
  : { bg: '#FEE2E2', color: 'var(--color-danger)' }

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }

const PublicationsPage = () => {
  const [docs, setDocs] = useState(initialDocs)
  const [confirm, setConfirm] = useState(null)
  const [filterMatiere, setFilterMatiere] = useState('Toutes')
  const [filterType, setFilterType]       = useState('Tous')

  const supprimer = (id) => { setDocs(prev => prev.filter(d => d.id !== id)); setConfirm(null) }

  const filtered = docs.filter(d => {
    return (filterMatiere === 'Toutes' || d.matiere === filterMatiere) &&
           (filterType === 'Tous'    || d.type === filterType)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Documents publiés', value: docs.length,                                                                           color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '📄' },
          { label: 'Score IA moyen',    value: Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length) + '/100',             color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '🤖' },
          { label: 'Vues totales',      value: docs.reduce((s, d) => s + d.vues, 0).toLocaleString(),                                color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '👁' },
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

      {/* Filtres */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '16px 20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Matière</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {MATIERES.map(m => (
              <button key={m} onClick={() => setFilterMatiere(m)}
                style={{ fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: filterMatiere === m ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  color: filterMatiere === m ? '#fff' : 'var(--color-primary)',
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                style={{ fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
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
      <div style={{ ...card, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #F3F4F6', display: 'grid', gridTemplateColumns: '5fr 2fr 1fr 1fr 1fr 2fr', gap: '12px', background: '#F9FAFB' }}>
          {['Titre', 'Professeur', 'Vues', 'Score IA', 'Type', ''].map((h, i) => (
            <div key={i} style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: i >= 2 && i <= 4 ? 'center' : i === 5 ? 'right' : 'left' }}>
              {h}
            </div>
          ))}
        </div>

        <div>
          {filtered.map((doc, idx) => {
            const sc = scoreStyle(doc.score)
            return (
              <div key={doc.id} style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '5fr 2fr 1fr 1fr 1fr 2fr', gap: '12px', alignItems: 'center', borderBottom: idx < filtered.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                {/* Titre */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.titre}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{doc.date}</div>
                </div>

                {/* Prof */}
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{doc.prof.split(' ')[0]}</div>

                {/* Vues */}
                <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)' }}>{doc.vues}</div>

                {/* Score */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '100px', background: sc.bg, color: sc.color }}>{doc.score}</span>
                </div>

                {/* Type */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{doc.type}</span>
                </div>

                {/* Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {confirm === doc.id ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => supprimer(doc.id)}
                        style={{ padding: '6px 12px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                        Confirmer
                      </button>
                      <button onClick={() => setConfirm(null)}
                        style={{ padding: '6px 10px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                        Non
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirm(doc.id)}
                      style={{ padding: '7px 12px', borderRadius: '9px', border: '1.5px solid var(--color-danger)', background: '#fff', color: 'var(--color-danger)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>📄</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Aucun document pour ces filtres</div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default PublicationsPage
