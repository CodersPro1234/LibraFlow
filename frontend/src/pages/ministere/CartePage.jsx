import { useState } from 'react'

const universites = [
  { id: 1, nom: 'Univ. Joseph Ki-Zerbo',   ville: 'Ouagadougou',  region: 'Centre',       etudiants: 4218, docs: 840, status: 'approuvee', x: 52, y: 48 },
  { id: 2, nom: 'ISGE-BF',                 ville: 'Ouagadougou',  region: 'Centre',       etudiants: 980,  docs: 298, status: 'approuvee', x: 54, y: 50 },
  { id: 3, nom: 'USTA Bobo-Dioulasso',     ville: 'Bobo-Dioulasso', region: 'Hauts-Bassins', etudiants: 3120, docs: 512, status: 'approuvee', x: 24, y: 66 },
  { id: 4, nom: 'Univ. Norbert Zongo',     ville: 'Koudougou',    region: 'Centre-Ouest', etudiants: 2140, docs: 387, status: 'attente',   x: 40, y: 52 },
  { id: 5, nom: 'Univ. de Ouahigouya',     ville: 'Ouahigouya',   region: 'Nord',         etudiants: 1200, docs: 181, status: 'approuvee', x: 46, y: 28 },
  { id: 6, nom: "Univ. de Fada N'Gourma",  ville: "Fada N'Gourma", region: 'Est',          etudiants: 820,  docs: 124, status: 'approuvee', x: 77, y: 50 },
]

const BURKINA_PATH = `
  M 18 22 L 22 16 L 28 14 L 36 12 L 44 10 L 52 11 L 58 10 L 64 12 L 70 14 L 76 18
  L 82 22 L 88 26 L 90 32 L 88 38 L 86 44 L 88 50 L 86 56 L 82 62 L 78 68 L 74 72
  L 70 76 L 64 80 L 58 82 L 52 84 L 46 82 L 40 80 L 34 76 L 28 72 L 24 68 L 20 62
  L 16 56 L 14 50 L 14 44 L 16 38 L 16 32 L 18 26 Z
`

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const CartePage = () => {
  const [popup, setPopup] = useState(null)

  const handleMarker = (univ) => setPopup(prev => prev?.id === univ.id ? null : univ)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: '12 régions couvertes',         value: '12', icon: '🗺', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          { label: 'Universités actives',           value: '47', icon: '🏛', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
          { label: "En attente d'approbation",      value: '3',  icon: '⏳', color: 'var(--color-gold)',    bg: 'var(--color-gold-light)' },
        ].map((s, i) => (
          <div key={i} style={card}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Carte */}
      <div style={{ ...card, position: 'relative' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
          Carte du Burkina Faso — Universités actives
        </div>

        <div style={{ position: 'relative', paddingBottom: '70%' }}>
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <path d={BURKINA_PATH} fill="var(--color-primary-light)" stroke="var(--color-primary)" strokeWidth="0.8" />
            {[20, 40, 60, 80].map(v => (
              <g key={v}>
                <line x1={v} y1="10" x2={v} y2="90" stroke="#E5E7EB" strokeWidth="0.3" strokeDasharray="1 2" />
                <line x1="10" y1={v} x2="90" y2={v} stroke="#E5E7EB" strokeWidth="0.3" strokeDasharray="1 2" />
              </g>
            ))}
            {universites.map((univ) => {
              const isSelected = popup?.id === univ.id
              const color = univ.status === 'attente' ? 'var(--color-gold)' : 'var(--color-primary)'
              return (
                <g key={univ.id} style={{ cursor: 'pointer' }} onClick={() => handleMarker(univ)}>
                  {isSelected && <circle cx={univ.x} cy={univ.y} r={4} fill={color} fillOpacity={0.2} />}
                  <circle cx={univ.x} cy={univ.y} r={isSelected ? 2.5 : 2} fill={color} stroke="white" strokeWidth="0.6" />
                  <text x={univ.x + 3} y={univ.y - 2} fontSize="2.8" fill="var(--color-primary-dark)" fontWeight={isSelected ? '700' : '500'}>
                    {univ.ville}
                  </text>
                </g>
              )
            })}
          </svg>

          {popup && (
            <div style={{
              position: 'absolute', zIndex: 10, background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '14px', width: '210px',
              left: `${Math.min(popup.x + 2, 55)}%`, top: `${Math.max(popup.y - 20, 5)}%`, transform: 'translateX(-10%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{popup.nom}</span>
                <button onClick={() => setPopup(null)}
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#F3F4F6', color: '#9CA3AF', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ×
                </button>
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '10px' }}>{popup.ville} · {popup.region}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ textAlign: 'center', padding: '10px 8px', borderRadius: '10px', background: 'var(--color-primary-light)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>{popup.etudiants.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Étudiants</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 8px', borderRadius: '10px', background: 'var(--color-success-light)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-success)' }}>{popup.docs}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>Documents</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '100px',
                  background: popup.status === 'attente' ? 'var(--color-gold-light)' : 'var(--color-success-light)',
                  color: popup.status === 'attente' ? 'var(--color-gold)' : 'var(--color-success)',
                }}>
                  {popup.status === 'attente' ? '⏳ En attente' : '✅ Approuvée'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Légende */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          {[
            { color: 'var(--color-primary)', label: 'Université approuvée' },
            { color: 'var(--color-gold)',    label: "En attente d'approbation" },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color }} />
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Liste universités */}
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>
          Universités sur la carte
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {universites.map((univ) => (
            <div key={univ.id} onClick={() => handleMarker(univ)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.15s',
                background: popup?.id === univ.id ? 'var(--color-primary-light)' : '#F9FAFB',
              }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: univ.status === 'attente' ? 'var(--color-gold)' : 'var(--color-primary)',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{univ.nom}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>{univ.ville}</div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0 }}>
                {univ.etudiants.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default CartePage
