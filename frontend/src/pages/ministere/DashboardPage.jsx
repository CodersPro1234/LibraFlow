import { useState } from 'react'

const stats = [
  { label: 'Universités actives', value: '47', delta: null, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🏛' },
  { label: 'En attente', value: '3', delta: null, color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '⏳' },
  { label: 'Étudiants total', value: '12 480', delta: '+320 ce mois', color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '🎓' },
  { label: 'Documents publiés', value: '3 218', delta: '+87 ce mois', color: 'var(--color-danger)', bg: 'var(--color-danger-light)', icon: '📄' },
]

const topUnivs = [
  { rank: 1, logo: 'UJK', color: 'var(--color-primary)', name: 'Univ. Joseph Ki-Zerbo', sub: 'Centre · Ouagadougou', stat: '840 docs' },
  { rank: 2, logo: 'USTA', color: '#378ADD', name: 'USTA Bobo-Dioulasso', sub: 'Hauts-Bassins', stat: '512 docs' },
  { rank: 3, logo: 'ISGE', color: 'var(--color-gold)', name: 'ISGE-BF', sub: 'Centre · Ouagadougou', stat: '298 docs' },
]

const barData = [
  { month: 'Nov', height: 38 },
  { month: 'Déc', height: 52 },
  { month: 'Jan', height: 44 },
  { month: 'Fév', height: 68 },
  { month: 'Mar', height: 82 },
  { month: 'Avr', height: 100 },
]

const regions = [
  { name: 'Centre (Ouagadougou)', pct: 58, color: 'var(--color-primary)' },
  { name: 'Hauts-Bassins', pct: 22, color: '#378ADD' },
  { name: 'Centre-Ouest', pct: 12, color: 'var(--color-gold)' },
  { name: 'Autres régions', pct: 8, color: 'var(--color-muted)' },
]

const DashboardPage = () => {
  const [activeBar, setActiveBar] = useState(5)

  return (
    <div className="flex flex-col gap-5">

      {/* Stats nationales */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4"
            style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3"
              style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
            {s.delta && <div className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>{s.delta}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Graphique évolution */}
<div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
  <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
    Évolution nationale — 6 mois
  </div>
  <div className="flex items-end gap-2" style={{ height: '80px' }}>
    {barData.map((b, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-1">
        <div
          className="w-full rounded-t cursor-pointer transition-all"
          style={{
            height: `${b.height * 0.6}px`,
            background: activeBar === i ? 'var(--color-primary)' : 'var(--color-primary-light)',
          }}
          onClick={() => setActiveBar(i)}
        />
        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{b.month}</span>
      </div>
    ))}
  </div>
</div>

        {/* Top universités */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Top universités
          </div>
          <div className="flex flex-col gap-3">
            {topUnivs.map((u) => (
              <div key={u.rank} className="flex items-center gap-3">
                <span className="text-sm font-bold w-4" style={{ color: 'var(--color-primary)' }}>{u.rank}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: u.color }}>
                  {u.logo}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{u.name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{u.sub}</div>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{u.stat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Répartition par région */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Répartition par région
        </div>
        <div className="flex flex-col gap-3">
          {regions.map((r, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--color-text)' }}>{r.name}</span>
                <span className="font-medium" style={{ color: 'var(--color-text)' }}>{r.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${r.pct}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
          Alertes récentes
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 p-3 rounded-lg"
            style={{ background: 'var(--color-gold-light)' }}>
            <span>⏳</span>
            <div className="flex-1 text-xs" style={{ color: 'var(--color-gold)' }}>
              <span className="font-medium">Univ. Norbert Zongo</span> — en attente d'approbation
            </div>
            <button className="text-xs px-3 py-1 rounded-lg font-medium text-white"
              style={{ background: 'var(--color-primary)' }}>
              Examiner
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg"
            style={{ background: 'var(--color-danger-light)' }}>
            <span>⚠️</span>
            <div className="flex-1 text-xs" style={{ color: 'var(--color-danger)' }}>
              <span className="font-medium">2 contenus signalés</span> — nécessitent une décision
            </div>
            <button className="text-xs px-3 py-1 rounded-lg font-medium text-white"
              style={{ background: 'var(--color-danger)' }}>
              Voir
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DashboardPage