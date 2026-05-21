import { useState } from 'react'

const universites = [
  {
    id: 1,
    nom: 'Univ. Joseph Ki-Zerbo',
    ville: 'Ouagadougou',
    region: 'Centre',
    etudiants: 4218,
    docs: 840,
    status: 'approuvee',
    x: 52,
    y: 48,
  },
  {
    id: 2,
    nom: 'ISGE-BF',
    ville: 'Ouagadougou',
    region: 'Centre',
    etudiants: 980,
    docs: 298,
    status: 'approuvee',
    x: 54,
    y: 50,
  },
  {
    id: 3,
    nom: 'USTA Bobo-Dioulasso',
    ville: 'Bobo-Dioulasso',
    region: 'Hauts-Bassins',
    etudiants: 3120,
    docs: 512,
    status: 'approuvee',
    x: 24,
    y: 66,
  },
  {
    id: 4,
    nom: 'Univ. Norbert Zongo',
    ville: 'Koudougou',
    region: 'Centre-Ouest',
    etudiants: 2140,
    docs: 387,
    status: 'attente',
    x: 40,
    y: 52,
  },
  {
    id: 5,
    nom: 'Univ. de Ouahigouya',
    ville: 'Ouahigouya',
    region: 'Nord',
    etudiants: 1200,
    docs: 181,
    status: 'approuvee',
    x: 46,
    y: 28,
  },
  {
    id: 6,
    nom: 'Univ. de Fada N\'Gourma',
    ville: 'Fada N\'Gourma',
    region: 'Est',
    etudiants: 820,
    docs: 124,
    status: 'approuvee',
    x: 77,
    y: 50,
  },
]

// Simplified outline of Burkina Faso as SVG path (normalized 0-100 viewBox)
const BURKINA_PATH = `
  M 18 22 L 22 16 L 28 14 L 36 12 L 44 10 L 52 11 L 58 10 L 64 12 L 70 14 L 76 18
  L 82 22 L 88 26 L 90 32 L 88 38 L 86 44 L 88 50 L 86 56 L 82 62 L 78 68 L 74 72
  L 70 76 L 64 80 L 58 82 L 52 84 L 46 82 L 40 80 L 34 76 L 28 72 L 24 68 L 20 62
  L 16 56 L 14 50 L 14 44 L 16 38 L 16 32 L 18 26 Z
`

const CartePage = () => {
  const [popup, setPopup] = useState(null)

  const handleMarker = (univ) => {
    setPopup(prev => prev?.id === univ.id ? null : univ)
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Stats nationales */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '12 régions couvertes', value: '12', icon: '🗺', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
          { label: 'Universités actives', value: '47', icon: '🏛', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
          { label: 'En attente d\'approbation', value: '3', icon: '⏳', color: 'var(--color-gold)', bg: 'var(--color-gold-light)' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Carte */}
      <div className="bg-white rounded-xl border p-4 relative" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
          Carte du Burkina Faso — Universités actives
        </div>

        <div className="relative" style={{ paddingBottom: '70%' }}>
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'visible' }}
          >
            {/* Fond pays */}
            <path
              d={BURKINA_PATH}
              fill="var(--color-primary-light)"
              stroke="var(--color-primary)"
              strokeWidth="0.8"
            />

            {/* Grille légère */}
            {[20, 40, 60, 80].map(v => (
              <g key={v}>
                <line x1={v} y1="10" x2={v} y2="90" stroke="var(--color-border)" strokeWidth="0.3" strokeDasharray="1 2" />
                <line x1="10" y1={v} x2="90" y2={v} stroke="var(--color-border)" strokeWidth="0.3" strokeDasharray="1 2" />
              </g>
            ))}

            {/* Marqueurs universités */}
            {universites.map((univ) => {
              const isSelected = popup?.id === univ.id
              const color = univ.status === 'attente' ? 'var(--color-gold)' : 'var(--color-primary)'
              return (
                <g key={univ.id} style={{ cursor: 'pointer' }} onClick={() => handleMarker(univ)}>
                  {/* Halo */}
                  {isSelected && (
                    <circle cx={univ.x} cy={univ.y} r={4} fill={color} fillOpacity={0.2} />
                  )}
                  {/* Point */}
                  <circle
                    cx={univ.x}
                    cy={univ.y}
                    r={isSelected ? 2.5 : 2}
                    fill={color}
                    stroke="white"
                    strokeWidth="0.6"
                  />
                  {/* Label ville */}
                  <text
                    x={univ.x + 3}
                    y={univ.y - 2}
                    fontSize="2.8"
                    fill="var(--color-primary-dark)"
                    fontWeight={isSelected ? '700' : '500'}
                  >
                    {univ.ville}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Popup */}
          {popup && (
            <div
              className="absolute z-10 bg-white rounded-xl border shadow-lg p-3 w-52"
              style={{
                borderColor: 'var(--color-border)',
                left: `${Math.min(popup.x + 2, 55)}%`,
                top: `${Math.max(popup.y - 20, 5)}%`,
                transform: 'translateX(-10%)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{popup.nom}</span>
                <button
                  onClick={() => setPopup(null)}
                  className="text-xs w-5 h-5 flex items-center justify-center rounded-full"
                  style={{ color: 'var(--color-muted)', background: 'var(--color-bg)' }}>
                  ×
                </button>
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--color-muted)' }}>
                {popup.ville} · {popup.region}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg" style={{ background: 'var(--color-primary-light)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {popup.etudiants.toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Étudiants</div>
                </div>
                <div className="text-center p-2 rounded-lg" style={{ background: 'var(--color-success-light)' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                    {popup.docs}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Documents</div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
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
        <div className="flex gap-4 mt-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>Université approuvée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-gold)' }} />
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>En attente d'approbation</span>
          </div>
        </div>
      </div>

      {/* Liste régions */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
          Universités sur la carte
        </div>
        <div className="grid grid-cols-2 gap-3">
          {universites.map((univ) => (
            <div
              key={univ.id}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
              style={{
                background: popup?.id === univ.id ? 'var(--color-primary-light)' : 'var(--color-bg)',
              }}
              onClick={() => handleMarker(univ)}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: univ.status === 'attente' ? 'var(--color-gold)' : 'var(--color-primary)' }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>{univ.nom}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted)' }}>{univ.ville}</div>
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
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
