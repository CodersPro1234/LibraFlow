import { useState } from 'react'

const matieres = [
  { nom: 'Droit', docs: 412, vues: 38200, couleur: 'var(--color-primary)' },
  { nom: 'Mathématiques', docs: 387, vues: 34900, couleur: '#378ADD' },
  { nom: 'Informatique', docs: 301, vues: 28400, couleur: 'var(--color-success)' },
  { nom: 'Économie', docs: 278, vues: 24700, couleur: 'var(--color-gold)' },
  { nom: 'Biologie', docs: 189, vues: 17300, couleur: '#6366f1' },
  { nom: 'Physique', docs: 143, vues: 12800, couleur: '#ec4899' },
]

const regions = [
  { nom: 'Centre (Ouagadougou)', univs: 18, etudiants: 7840, pct: 57, couleur: 'var(--color-primary)' },
  { nom: 'Hauts-Bassins', univs: 9, etudiants: 3120, pct: 22, couleur: '#378ADD' },
  { nom: 'Centre-Ouest', univs: 6, etudiants: 2140, pct: 14, couleur: 'var(--color-gold)' },
  { nom: 'Nord', univs: 4, etudiants: 1200, pct: 9, couleur: 'var(--color-success)' },
  { nom: 'Est', univs: 3, etudiants: 820, pct: 6, couleur: '#6366f1' },
  { nom: 'Autres régions', univs: 7, etudiants: 1360, pct: 8, couleur: 'var(--color-muted)' },
]

const evolution = [
  { mois: 'Nov', docs: 180, etudiants: 10200 },
  { mois: 'Déc', etudiants: 10580, docs: 220 },
  { mois: 'Jan', etudiants: 11040, docs: 275 },
  { mois: 'Fév', etudiants: 11490, docs: 312 },
  { mois: 'Mar', etudiants: 11980, docs: 358 },
  { mois: 'Avr', etudiants: 12480, docs: 410 },
]

const typeDocs = [
  { type: 'Cours', nb: 892, pct: 42 },
  { type: 'Annales', nb: 634, pct: 30 },
  { type: 'TD', nb: 423, pct: 20 },
  { type: 'Résumés', nb: 169, pct: 8 },
]

const maxDocs = Math.max(...evolution.map(e => e.docs))
const maxEtud = Math.max(...evolution.map(e => e.etudiants))

const StatistiquesPage = () => {
  const [activeBar, setActiveBar] = useState(5)
  const [metrique, setMetrique] = useState('docs')

  return (
    <div className="flex flex-col gap-5">

      {/* KPIs globaux */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Documents publiés', value: '3 218', delta: '+87 ce mois', color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '📄' },
          { label: 'Étudiants actifs', value: '12 480', delta: '+320 ce mois', color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '🎓' },
          { label: 'Vues totales', value: '156k', delta: null, color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '👁' },
          { label: 'Score IA moyen', value: '84 / 100', delta: null, color: 'var(--color-danger)', bg: 'var(--color-danger-light)', icon: '🤖' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
            {s.delta && <div className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>{s.delta}</div>}
          </div>
        ))}
      </div>

      {/* Graphique évolution */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Évolution nationale — 6 derniers mois
          </div>
          <div className="flex gap-1">
            {[
              { key: 'docs', label: 'Documents' },
              { key: 'etudiants', label: 'Étudiants' },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setMetrique(m.key)}
                className="text-xs px-3 py-1 rounded-full font-medium transition-all"
                style={{
                  background: metrique === m.key ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  color: metrique === m.key ? '#fff' : 'var(--color-primary)',
                }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-3" style={{ height: '120px' }}>
          {evolution.map((e, i) => {
            const val = metrique === 'docs' ? e.docs : e.etudiants
            const max = metrique === 'docs' ? maxDocs : maxEtud
            const h = Math.round((val / max) * 100)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1" style={{ height: '100%' }}>
                <div className="text-xs font-medium" style={{ color: activeBar === i ? 'var(--color-primary)' : 'transparent', fontSize: '9px' }}>
                  {metrique === 'docs' ? val : (val / 1000).toFixed(1) + 'k'}
                </div>
                <div
                  className="w-full rounded-t cursor-pointer transition-all"
                  onClick={() => setActiveBar(i)}
                  style={{
                    height: `${h}%`,
                    background: activeBar === i ? 'var(--color-primary)' : 'var(--color-primary-light)',
                    marginTop: 'auto',
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{e.mois}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Top matières */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Top matières
          </div>
          <div className="flex flex-col gap-3">
            {matieres.map((m, i) => {
              const maxD = matieres[0].docs
              const pct = Math.round((m.docs / maxD) * 100)
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: m.couleur }} />
                      <span style={{ color: 'var(--color-text)' }}>{m.nom}</span>
                    </div>
                    <div className="flex gap-3" style={{ color: 'var(--color-muted)' }}>
                      <span className="font-medium" style={{ color: m.couleur }}>{m.docs} docs</span>
                      <span>{(m.vues / 1000).toFixed(0)}k vues</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: m.couleur }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Répartition par type de document */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Répartition par type de document
          </div>

          {/* Donut simplifié en barres empilées */}
          <div className="flex h-6 rounded-full overflow-hidden mb-4 gap-0.5">
            {typeDocs.map((t, i) => {
              const colors = ['var(--color-primary)', '#378ADD', 'var(--color-gold)', 'var(--color-success)']
              return (
                <div key={i} style={{ width: `${t.pct}%`, background: colors[i] }} title={`${t.type} : ${t.pct}%`} />
              )
            })}
          </div>

          <div className="flex flex-col gap-2.5">
            {typeDocs.map((t, i) => {
              const colors = ['var(--color-primary)', '#378ADD', 'var(--color-gold)', 'var(--color-success)']
              return (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[i] }} />
                    <span className="text-xs" style={{ color: 'var(--color-text)' }}>{t.type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold" style={{ color: colors[i] }}>{t.pct}%</span>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{t.nb} docs</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Répartition régionale */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Répartition régionale
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {regions.map((r, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: r.couleur }} />
                  <span style={{ color: 'var(--color-text)' }}>{r.nom}</span>
                </div>
                <div className="flex gap-3" style={{ color: 'var(--color-muted)' }}>
                  <span>{r.univs} univs</span>
                  <span className="font-medium" style={{ color: r.couleur }}>{r.pct}%</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${r.pct}%`, background: r.couleur }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default StatistiquesPage
