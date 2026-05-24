const abonnes = [
  { initials: 'AK', nom: 'Abdoul Koné',        universite: 'UJK-Zerbo',    color: 'var(--color-primary)' },
  { initials: 'MO', nom: 'Marie Ouédraogo',    universite: 'USTA Bobo',    color: 'var(--color-gold)' },
  { initials: 'FT', nom: 'Fatou Traoré',       universite: 'ISGE-BF',      color: 'var(--color-success)' },
  { initials: 'BS', nom: 'Boureima Sawadogo',  universite: 'UJK-Zerbo',    color: 'var(--color-danger)' },
  { initials: 'IZ', nom: 'Issa Zongo',         universite: 'BIT Burkina',  color: 'var(--color-primary)' },
]

const commentaires = [
  { initials: 'AK', nom: 'Abdoul Koné',       texte: 'Merci Professeur, très clair !',                    doc: 'Droit Constitutionnel Ch.4', temps: 'il y a 1h',  color: 'var(--color-primary)' },
  { initials: 'MO', nom: 'Marie Ouédraogo',   texte: 'Le Chapitre 5 arrive bientôt ?',                    doc: 'Droit Civil',                temps: 'il y a 3h',  color: 'var(--color-gold)' },
  { initials: 'FT', nom: 'Fatou Traoré',      texte: 'Très bonne explication des annales !',              doc: 'Annales Droit 2023',         temps: 'il y a 5h',  color: 'var(--color-success)' },
  { initials: 'BS', nom: 'Boureima Sawadogo', texte: 'Est-ce que vous avez des TD sur ce chapitre ?',     doc: 'Droit Constitutionnel Ch.4', temps: 'hier',       color: 'var(--color-danger)' },
]

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }

const CommunautePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
        {[
          { label: 'Abonnés',             value: '87',                    color: 'var(--color-primary)', bg: 'var(--color-primary-light)', icon: '👥' },
          { label: 'Commentaires reçus',  value: commentaires.length,     color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '💬' },
        ].map((s, i) => (
          <div key={i} style={{ ...card }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Abonnés récents */}
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Abonnés récents</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {abonnes.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', background: '#F9FAFB' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0, background: a.color }}>
                {a.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{a.nom}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '1px' }}>{a.universite}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                Abonné
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Commentaires récents */}
      <div style={card}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Commentaires récents</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {commentaires.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px 0', borderBottom: i < commentaires.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {c.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{c.nom}</span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.temps}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', lineHeight: 1.4 }}>{c.texte}</div>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  {c.doc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default CommunautePage
