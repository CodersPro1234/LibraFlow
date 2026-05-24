import { useState } from 'react'

const matieres = [
  { nom: 'Droit',          docs: 412, vues: 38200, couleur: 'var(--color-primary)' },
  { nom: 'Mathématiques',  docs: 387, vues: 34900, couleur: '#378ADD' },
  { nom: 'Informatique',   docs: 301, vues: 28400, couleur: 'var(--color-success)' },
  { nom: 'Économie',       docs: 278, vues: 24700, couleur: 'var(--color-gold)' },
  { nom: 'Biologie',       docs: 189, vues: 17300, couleur: '#6366f1' },
  { nom: 'Physique',       docs: 143, vues: 12800, couleur: '#ec4899' },
]

const regions = [
  { nom: 'Centre (Ouagadougou)', univs: 18, etudiants: 7840, pct: 57, couleur: 'var(--color-primary)' },
  { nom: 'Hauts-Bassins',        univs: 9,  etudiants: 3120, pct: 22, couleur: '#378ADD' },
  { nom: 'Centre-Ouest',         univs: 6,  etudiants: 2140, pct: 14, couleur: 'var(--color-gold)' },
  { nom: 'Nord',                 univs: 4,  etudiants: 1200, pct: 9,  couleur: 'var(--color-success)' },
  { nom: 'Est',                  univs: 3,  etudiants: 820,  pct: 6,  couleur: '#6366f1' },
  { nom: 'Autres régions',       univs: 7,  etudiants: 1360, pct: 8,  couleur: '#9CA3AF' },
]

const evolution = [
  { mois: 'Nov', docs: 180, etudiants: 10200 },
  { mois: 'Déc', docs: 220, etudiants: 10580 },
  { mois: 'Jan', docs: 275, etudiants: 11040 },
  { mois: 'Fév', docs: 312, etudiants: 11490 },
  { mois: 'Mar', docs: 358, etudiants: 11980 },
  { mois: 'Avr', docs: 410, etudiants: 12480 },
]

const typeDocs = [
  { type: 'Cours',   nb: 892, pct: 42 },
  { type: 'Annales', nb: 634, pct: 30 },
  { type: 'TD',      nb: 423, pct: 20 },
  { type: 'Résumés', nb: 169, pct: 8 },
]

const typeColors = ['var(--color-primary)', '#378ADD', 'var(--color-gold)', 'var(--color-success)']
const maxDocs = Math.max(...evolution.map(e => e.docs))
const maxEtud = Math.max(...evolution.map(e => e.etudiants))

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const StatistiquesPage = () => {
  const [activeBar, setActiveBar] = useState(5)
  const [metrique, setMetrique] = useState('docs')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Documents publiés', value: '3 218', delta: '+87 ce mois', color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '📄' },
          { label: 'Étudiants actifs',  value: '12 480', delta: '+320 ce mois', color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '🎓' },
          { label: 'Vues totales',      value: '156k',   delta: null, color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '👁' },
          { label: 'Score IA moyen',    value: '84/100', delta: null, color: 'var(--color-danger)',  bg: '#FEE2E2',                    icon: '🤖' },
        ].map((s, i) => (
          <div key={i} style={card}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
            {s.delta && <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '4px', fontWeight: 600 }}>{s.delta}</div>}
          </div>
        ))}
      </div>

      {/* Graphique évolution */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Évolution nationale — 6 derniers mois</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[{ key: 'docs', label: 'Documents' }, { key: 'etudiants', label: 'Étudiants' }].map(m => (
              <button key={m.key} onClick={() => setMetrique(m.key)}
                style={{ fontSize: '12px', fontWeight: 600, padding: '5px 14px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: metrique === m.key ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  color: metrique === m.key ? '#fff' : 'var(--color-primary)',
                }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
          {evolution.map((e, i) => {
            const val = metrique === 'docs' ? e.docs : e.etudiants
            const max = metrique === 'docs' ? maxDocs : maxEtud
            const h = Math.round((val / max) * 100)
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: activeBar === i ? 'var(--color-primary)' : 'transparent', fontWeight: 600 }}>
                  {metrique === 'docs' ? val : (val / 1000).toFixed(1) + 'k'}
                </div>
                <div onClick={() => setActiveBar(i)}
                  style={{ width: '100%', borderRadius: '5px 5px 0 0', cursor: 'pointer', transition: 'all 0.15s',
                    height: `${h}%`, background: activeBar === i ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  }} />
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{e.mois}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Top matières */}
        <div style={card}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Top matières</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {matieres.map((m, i) => {
              const pct = Math.round((m.docs / matieres[0].docs) * 100)
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.couleur }} />
                      <span style={{ color: '#374151', fontWeight: 500 }}>{m.nom}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', color: '#9CA3AF' }}>
                      <span style={{ fontWeight: 700, color: m.couleur }}>{m.docs} docs</span>
                      <span>{(m.vues / 1000).toFixed(0)}k vues</span>
                    </div>
                  </div>
                  <div style={{ height: '6px', borderRadius: '100px', background: '#F3F4F6' }}>
                    <div style={{ height: '100%', borderRadius: '100px', width: `${pct}%`, background: m.couleur, transition: 'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Répartition par type */}
        <div style={card}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Répartition par type de document</div>
          <div style={{ display: 'flex', height: '24px', borderRadius: '100px', overflow: 'hidden', marginBottom: '16px', gap: '2px' }}>
            {typeDocs.map((t, i) => (
              <div key={i} style={{ width: `${t.pct}%`, background: typeColors[i] }} title={`${t.type} : ${t.pct}%`} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {typeDocs.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: typeColors[i] }} />
                  <span style={{ fontSize: '13px', color: '#374151' }}>{t.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: typeColors[i] }}>{t.pct}%</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{t.nb} docs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Répartition régionale */}
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Répartition régionale</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
          {regions.map((r, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.couleur }} />
                  <span style={{ color: '#374151' }}>{r.nom}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', color: '#9CA3AF' }}>
                  <span>{r.univs} univs</span>
                  <span style={{ fontWeight: 700, color: r.couleur }}>{r.pct}%</span>
                </div>
              </div>
              <div style={{ height: '6px', borderRadius: '100px', background: '#F3F4F6' }}>
                <div style={{ height: '100%', borderRadius: '100px', width: `${r.pct}%`, background: r.couleur }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default StatistiquesPage
