import { useState } from 'react'

const stats = [
  { label: 'Universités actives', value: '12', delta: null,           color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🏛' },
  { label: 'En attente',          value: '3',  delta: null,           color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '⏳' },
  { label: 'Étudiants national',  value: '47 289', delta: '+320 ce mois', color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '🎓' },
  { label: 'Documents publiés',   value: '5 120',  delta: '+87 ce mois',  color: 'var(--color-danger)',  bg: '#FEE2E2',                   icon: '📄' },
]

const topUnivs = [
  { rank: 1, logo: 'UJK',  color: 'var(--color-primary)', name: 'Univ. Joseph Ki-Zerbo',  sub: 'Centre · Ouagadougou', stat: '840 docs' },
  { rank: 2, logo: 'USTA', color: '#378ADD',              name: 'USTA Bobo-Dioulasso',    sub: 'Hauts-Bassins',         stat: '512 docs' },
  { rank: 3, logo: 'ISGE', color: 'var(--color-gold)',    name: 'ISGE-BF',                sub: 'Centre · Ouagadougou', stat: '298 docs' },
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
  { name: 'Hauts-Bassins',        pct: 22, color: '#378ADD' },
  { name: 'Centre-Ouest',         pct: 12, color: 'var(--color-gold)' },
  { name: 'Autres régions',       pct: 8,  color: 'var(--color-muted)' },
]

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const DashboardPage = () => {
  const [activeBar, setActiveBar] = useState(5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats nationales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {stats.map((s, i) => (
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Graphique */}
        <div style={card}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            Évolution nationale — 6 mois
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px' }}>
            {barData.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div onClick={() => setActiveBar(i)}
                  style={{ width: '100%', borderRadius: '5px 5px 0 0', cursor: 'pointer', transition: 'all 0.15s',
                    height: `${b.height * 0.82}px`,
                    background: activeBar === i ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  }} />
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top universités */}
        <div style={card}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            Top universités
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topUnivs.map((u) => (
              <div key={u.rank} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, width: '18px', flexShrink: 0, color: 'var(--color-primary)' }}>{u.rank}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {u.logo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{u.sub}</div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>{u.stat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Répartition régionale */}
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
          Répartition par région
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {regions.map((r, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: '#374151' }}>{r.name}</span>
                <span style={{ fontWeight: 700, color: '#111827' }}>{r.pct}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '100px', background: '#F3F4F6' }}>
                <div style={{ height: '100%', borderRadius: '100px', transition: 'width 0.3s', width: `${r.pct}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes */}
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
          Alertes récentes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', background: 'var(--color-gold-light)' }}>
            <span style={{ fontSize: '18px' }}>⏳</span>
            <div style={{ flex: 1, fontSize: '13px', color: 'var(--color-gold)', fontWeight: 500 }}>
              <span style={{ fontWeight: 700 }}>Univ. Norbert Zongo</span> — en attente d'approbation
            </div>
            <button style={{ padding: '8px 16px', borderRadius: '9px', background: 'var(--color-primary)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              Examiner
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', background: '#FEE2E2' }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <div style={{ flex: 1, fontSize: '13px', color: 'var(--color-danger)', fontWeight: 500 }}>
              <span style={{ fontWeight: 700 }}>2 contenus signalés</span> — nécessitent une décision
            </div>
            <button style={{ padding: '8px 16px', borderRadius: '9px', background: 'var(--color-danger)', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              Voir
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DashboardPage
