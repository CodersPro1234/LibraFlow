import { useState } from 'react'

const stats = [
  { label: 'Étudiants inscrits', value: '4 218', delta: '+142 ce mois', color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🎓' },
  { label: 'Professeurs actifs', value: '38', delta: null, color: 'var(--color-gold)', bg: 'var(--color-gold-light)', icon: '👨‍🏫' },
  { label: 'Documents publiés', value: '840', delta: '+23 ce mois', color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '📄' },
  { label: 'Vues totales', value: '98k', delta: null, color: 'var(--color-danger)', bg: 'var(--color-danger-light)', icon: '👁' },
]

const topProfs = [
  { rank: 1, initials: 'OM', name: 'Ouédraogo Mamadou', sub: 'Droit · 87 abonnés', stat: '412 vues' },
  { rank: 2, initials: 'AK', name: 'Amadou Kaboré', sub: 'Économie · 54 abonnés', stat: '287 vues' },
  { rank: 3, initials: 'FY', name: 'Fatima Yameogo', sub: 'Maths · 41 abonnés', stat: '198 vues' },
]

const topDocs = [
  { rank: 1, title: 'Droit Constitutionnel Ch.4', sub: 'Ouédraogo M. · Cours', stat: '412 vues' },
  { rank: 2, title: 'Annales Maths 2024', sub: 'Yameogo F. · Annales', stat: '389 vues' },
  { rank: 3, title: 'Introduction Économie', sub: 'Kaboré A. · Cours', stat: '298 vues' },
]

const barData = [
  { month: 'Déc', height: 45 },
  { month: 'Jan', height: 60 },
  { month: 'Fév', height: 50 },
  { month: 'Mar', height: 80 },
  { month: 'Avr', height: 72 },
  { month: 'Mai', height: 100 },
]

const DashboardPage = () => {
  const [activeBar, setActiveBar] = useState(5)

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
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

      {/* Graphique + Top profs */}
      <div className="grid grid-cols-2 gap-4">

        {/* Graphique */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Publications — 6 derniers mois
          </div>
          <div className="flex items-end gap-2" style={{ height: '80px' }}>
  {barData.map((b, i) => (
    <div key={i} className="flex-1 flex flex-col items-center gap-1" style={{ height: '100%' }}>
      <div
        className="w-full rounded-t cursor-pointer transition-all"
        onClick={() => setActiveBar(i)}
        style={{
          height: `${b.height}%`,
          background: activeBar === i ? 'var(--color-primary)' : 'var(--color-primary-light)',
          marginTop: 'auto',
        }}
      />
      <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{b.month}</span>
    </div>
  ))}
</div>
        </div>

        {/* Top profs */}
        <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Top 3 professeurs
          </div>
          <div className="flex flex-col gap-3">
            {topProfs.map((p) => (
              <div key={p.rank} className="flex items-center gap-3">
                <span className="text-sm font-bold w-4" style={{ color: 'var(--color-primary)' }}>{p.rank}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  {p.initials}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{p.name}</div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{p.sub}</div>
                </div>
                <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{p.stat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top documents */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Top 3 documents
        </div>
        <div className="flex flex-col gap-3">
          {topDocs.map((d) => (
            <div key={d.rank} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0"
              style={{ borderColor: 'var(--color-border)' }}>
              <span className="text-sm font-bold w-4" style={{ color: 'var(--color-primary)' }}>{d.rank}</span>
              <div className="flex-1">
                <div className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{d.title}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{d.sub}</div>
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>{d.stat}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DashboardPage