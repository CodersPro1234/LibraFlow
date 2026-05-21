const abonnes = [
  { initials: 'AK', nom: 'Abdoul Koné', universite: 'UJK-Zerbo', color: 'var(--color-primary)' },
  { initials: 'MO', nom: 'Marie Ouédraogo', universite: 'USTA Bobo', color: 'var(--color-gold)' },
  { initials: 'FT', nom: 'Fatou Traoré', universite: 'ISGE-BF', color: 'var(--color-success)' },
  { initials: 'BS', nom: 'Boureima Sawadogo', universite: 'UJK-Zerbo', color: 'var(--color-danger)' },
  { initials: 'IZ', nom: 'Issa Zongo', universite: 'BIT Burkina', color: 'var(--color-primary)' },
]

const commentaires = [
  { initials: 'AK', nom: 'Abdoul Koné', texte: 'Merci Professeur, très clair !', doc: 'Droit Constitutionnel Ch.4', temps: 'il y a 1h', color: 'var(--color-primary)' },
  { initials: 'MO', nom: 'Marie Ouédraogo', texte: 'Le Chapitre 5 arrive bientôt ?', doc: 'Droit Civil', temps: 'il y a 3h', color: 'var(--color-gold)' },
  { initials: 'FT', nom: 'Fatou Traoré', texte: 'Très bonne explication des annales !', doc: 'Annales Droit 2023', temps: 'il y a 5h', color: 'var(--color-success)' },
  { initials: 'BS', nom: 'Boureima Sawadogo', texte: 'Est-ce que vous avez des TD sur ce chapitre ?', doc: 'Droit Constitutionnel Ch.4', temps: 'hier', color: 'var(--color-danger)' },
]

const CommunautePage = () => {
  return (
    <div className="flex flex-col gap-4">

      {/* Stats abonnés */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>87</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>Abonnés</div>
          </div>
          <div className="flex-1 border-l pl-6" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xs font-medium mb-3" style={{ color: 'var(--color-muted)' }}>
              Abonnés récents
            </div>
            <div className="flex gap-2 flex-wrap">
              {abonnes.map((a, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs"
                  style={{ borderColor: 'var(--color-border)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                    style={{ background: a.color, fontSize: '9px' }}>
                    {a.initials}
                  </div>
                  <span style={{ color: 'var(--color-text)' }}>{a.nom}</span>
                  <span style={{ color: 'var(--color-muted)' }}>· {a.universite}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Commentaires récents */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Commentaires récents
        </div>
        <div className="flex flex-col gap-3">
          {commentaires.map((c, i) => (
            <div key={i} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0"
              style={{ borderColor: 'var(--color-border)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                style={{ background: c.color }}>
                {c.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{c.nom}</span>
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{c.temps}</span>
                </div>
                <div className="text-xs mb-1" style={{ color: 'var(--color-text)' }}>{c.texte}</div>
                <div className="text-xs px-2 py-0.5 rounded-full inline-block"
                  style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                  {c.doc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default CommunautePage