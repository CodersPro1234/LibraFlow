import { useState } from 'react'
import DocCard from '../../components/shared/DocCard'

const initialDocs = [
  { id: 1, titre: 'Droit Constitutionnel — Chapitre 4', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours',   vues: 412, likes: 24, telechargements: 98,  commentaires: 8,  score: 94, date: '18 Mai 2026' },
  { id: 2, titre: 'Droit Civil — Introduction générale',  matiere: 'Droit Civil',           niveau: 'Licence 1', type: 'Cours',   vues: 289, likes: 18, telechargements: 67,  commentaires: 5,  score: 87, date: '12 Mai 2026' },
  { id: 3, titre: 'Annales Droit 2023',                   matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Annales', vues: 546, likes: 41, telechargements: 134, commentaires: 12, score: 71, date: '05 Mai 2026' },
]

const scoreColor = (s) => s >= 80
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : s >= 65
  ? { bg: 'var(--color-gold-light)', color: 'var(--color-gold)' }
  : { bg: '#FEE2E2', color: 'var(--color-danger)' }

const MesPublicationsPage = () => {
  const [docs, setDocs] = useState(initialDocs)
  const [confirm, setConfirm] = useState(null)

  const supprimer = (id) => { setDocs(prev => prev.filter(d => d.id !== id)); setConfirm(null) }

  const totalVues = docs.reduce((s, d) => s + d.vues, 0)
  const avgScore  = docs.length ? Math.round(docs.reduce((s, d) => s + d.score, 0) / docs.length) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Documents publiés', value: docs.length,                color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '📄' },
          { label: 'Vues totales',      value: totalVues.toLocaleString(), color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '👁' },
          { label: 'Score IA moyen',    value: avgScore + '/100',          color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '🤖' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {docs.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            meta={`Publié le ${doc.date}`}
            hideHeader
            extraContent={
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {[
                  { label: 'Vues',    value: doc.vues,            icon: '👁' },
                  { label: 'Likes',   value: doc.likes,           icon: '♥' },
                  { label: 'Téléch.', value: doc.telechargements, icon: '⬇' },
                  { label: 'Comm.',   value: doc.commentaires,    icon: '💬' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '10px 8px', borderRadius: '10px', background: '#F9FAFB' }}>
                    <div style={{ fontSize: '14px', marginBottom: '2px' }}>{s.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            }
            actions={
              <>
                <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Publié le {doc.date}</span>
                <div style={{ flex: 1 }} />
                <button style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  ✏️ Éditer
                </button>
                {confirm === doc.id ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => supprimer(doc.id)} style={{ padding: '8px 14px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Confirmer</button>
                    <button onClick={() => setConfirm(null)} style={{ padding: '8px 12px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Non</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirm(doc.id)} style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid var(--color-danger)', background: '#fff', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    Supprimer
                  </button>
                )}
              </>
            }
          />
        ))}

        {docs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>Aucune publication pour le moment</div>
          </div>
        )}
      </div>

    </div>
  )
}

export default MesPublicationsPage
