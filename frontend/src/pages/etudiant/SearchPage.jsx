import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const tousDocuments = [
  { id: 1, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Constitutionnel — Chapitre 4', matiere: 'Droit', niveau: 'Licence 2', type: 'Cours', score: 94, likes: 24 },
  { id: 2, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, likes: 41 },
  { id: 3, univLogo: 'ISGE', univColor: '#f59e0b', universite: 'ISGE-BF', auteur: 'Prof. Zongo Issa', titre: "TD Finance d'entreprise S2", matiere: 'Finance', niveau: 'Master 1', type: 'TD', score: 71, likes: 19 },
  { id: 4, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Civil — Introduction générale', matiere: 'Droit', niveau: 'Licence 1', type: 'Cours', score: 87, likes: 33 },
  { id: 5, univLogo: 'BIT', univColor: '#555', universite: 'BIT Burkina', auteur: 'Prof. Kaboré Adama', titre: "Introduction à l'Informatique", matiere: 'Informatique', niveau: 'Licence 1', type: 'Cours', score: 91, likes: 56 },
]

const NIVEAUX = ['Tous', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2']
const TYPES   = ['Tous', 'Cours', 'TD', 'Annales', 'Résumé']
const UNIVS   = ['Toutes', 'UJK-Zerbo', 'USTA', 'ISGE-BF', 'BIT']

const scoreStyle = (s) => s >= 75
  ? { bg: 'var(--color-success-light)', color: 'var(--color-success)' }
  : { bg: 'var(--color-gold-light)', color: 'var(--color-gold)' }

const FilterPills = ({ label, options, active, setActive, activeColor = 'var(--color-primary)' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {options.map(o => (
        <button key={o} onClick={() => setActive(o)}
          style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '100px', border: '1.5px solid', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s',
            background: active === o ? activeColor : 'transparent',
            color: active === o ? '#fff' : '#6B7280',
            borderColor: active === o ? activeColor : '#E5E7EB',
          }}>
          {o}
        </button>
      ))}
    </div>
  </div>
)

const SearchPage = () => {
  const navigate = useNavigate()
  const [query, setQuery]   = useState('')
  const [niveau, setNiveau] = useState('Tous')
  const [type, setType]     = useState('Tous')
  const [univ, setUniv]     = useState('Toutes')

  const resultats = tousDocuments.filter(d => {
    const q = query.toLowerCase()
    return (
      (q === '' || d.titre.toLowerCase().includes(q) || d.matiere.toLowerCase().includes(q)) &&
      (niveau === 'Tous'    || d.niveau === niveau) &&
      (type   === 'Tous'    || d.type === type) &&
      (univ   === 'Toutes'  || d.universite.includes(univ))
    )
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Barre de recherche */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '12px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '18px', color: '#9CA3AF' }}>🔍</span>
        <input type="text" placeholder="Rechercher un document, une matière…" value={query} onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, fontSize: '14px', border: 'none', outline: 'none', background: 'transparent', color: '#111827' }} />
        {query && (
          <button onClick={() => setQuery('')}
            style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#F3F4F6', color: '#9CA3AF', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        )}
      </div>

      {/* Filtres */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <FilterPills label="Niveau" options={NIVEAUX} active={niveau} setActive={setNiveau} />
        <FilterPills label="Type" options={TYPES} active={type} setActive={setType} activeColor="var(--color-gold)" />
        <FilterPills label="Université" options={UNIVS} active={univ} setActive={setUniv} activeColor="#374151" />
      </div>

      {/* Compteur */}
      <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: 500 }}>
        <span style={{ fontWeight: 700, color: '#111827' }}>{resultats.length}</span> résultat{resultats.length > 1 ? 's' : ''}
        {query && <span> pour <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>« {query} »</span></span>}
      </div>

      {/* Résultats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {resultats.map(doc => {
          const sc = scoreStyle(doc.score)
          return (
            <div key={doc.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ height: '3px', background: doc.univColor }} />
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: doc.univColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {doc.univLogo}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{doc.universite}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{doc.auteur}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '100px', background: sc.bg, color: sc.color, flexShrink: 0 }}>IA {doc.score}</span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', lineHeight: 1.3, marginBottom: '10px' }}>{doc.titre}</div>

                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{doc.matiere}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--color-gold-light)', color: 'var(--color-gold)' }}>{doc.niveau}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>{doc.type}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => navigate(`/etudiant/lecture/${doc.id}`)}
                    style={{ padding: '8px 16px', borderRadius: '9px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    📖 Lire
                  </button>
                  <button style={{ padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ⬇ Télécharger
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {resultats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>Aucun résultat trouvé</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Essaie avec d'autres mots clés ou filtres</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
