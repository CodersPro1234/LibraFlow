import { useState } from 'react'

const stats = [
  { label: 'Étudiants inscrits', value: '4 218', delta: '+142 ce mois', color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '🎓' },
  { label: 'Professeurs actifs', value: '38',    delta: null,           color: 'var(--color-gold)',    bg: 'var(--color-gold-light)',    icon: '👨‍🏫' },
  { label: 'Documents publiés',  value: '840',   delta: '+23 ce mois',  color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '📄' },
  { label: 'Vues totales',       value: '98k',   delta: null,           color: 'var(--color-danger)',  bg: '#FEE2E2',                   icon: '👁' },
]

const topProfs = [
  { rank: 1, initials: 'OM', name: 'Ouédraogo Mamadou', sub: 'Droit · 87 abonnés',    stat: '412 vues' },
  { rank: 2, initials: 'AK', name: 'Amadou Kaboré',     sub: 'Économie · 54 abonnés', stat: '287 vues' },
  { rank: 3, initials: 'FY', name: 'Fatima Yameogo',    sub: 'Maths · 41 abonnés',    stat: '198 vues' },
]

const topDocs = [
  { rank: 1, title: 'Droit Constitutionnel Ch.4',  sub: 'Ouédraogo M. · Cours',   stat: '412 vues' },
  { rank: 2, title: 'Annales Maths 2024',           sub: 'Yameogo F. · Annales',   stat: '389 vues' },
  { rank: 3, title: 'Introduction Économie',        sub: 'Kaboré A. · Cours',      stat: '298 vues' },
]

const barData = [
  { month: 'Déc', height: 45 },
  { month: 'Jan', height: 60 },
  { month: 'Fév', height: 50 },
  { month: 'Mar', height: 80 },
  { month: 'Avr', height: 72 },
  { month: 'Mai', height: 100 },
]

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const DashboardPage = () => {
  const [activeBar, setActiveBar] = useState(5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
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

      {/* Graphique + Top profs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Graphique */}
        <div style={card}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            Publications — 6 derniers mois
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px' }}>
            {barData.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div onClick={() => setActiveBar(i)}
                  style={{ width: '100%', borderRadius: '5px 5px 0 0', cursor: 'pointer', transition: 'all 0.15s',
                    height: `${b.height}%`, background: activeBar === i ? 'var(--color-primary)' : 'var(--color-primary-light)',
                  }} />
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top profs */}
        <div style={card}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
            Top 3 professeurs
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topProfs.map((p) => (
              <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, width: '18px', flexShrink: 0, color: 'var(--color-primary)' }}>{p.rank}</span>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                  {p.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{p.sub}</div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>{p.stat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top documents */}
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
          Top 3 documents
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {topDocs.map((d, i) => (
            <div key={d.rank} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: i < topDocs.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, width: '18px', flexShrink: 0, color: 'var(--color-primary)' }}>{d.rank}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{d.title}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{d.sub}</div>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>{d.stat}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default DashboardPage
