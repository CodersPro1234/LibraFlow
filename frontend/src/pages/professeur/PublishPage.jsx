import { useState } from 'react'

const inp = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', color: '#111827', border: '1.5px solid #E5E7EB', outline: 'none', boxSizing: 'border-box', background: '#fff' }

const PublishPage = () => {
  const [step, setStep] = useState('form') // form | uploading | analyzing | result
  const [progress, setProgress]   = useState(0)
  const [iaProgress, setIaProgress] = useState(0)
  const [type, setType]     = useState('Cours')
  const [titre, setTitre]   = useState('')
  const [matiere, setMatiere] = useState('Droit Constitutionnel')
  const [niveau, setNiveau]   = useState('Licence 1')

  const types = ['Cours', 'TD', 'Annales', 'Résumé']

  const simulatePublish = () => {
    setStep('uploading'); setProgress(0)
    let p = 0
    const t1 = setInterval(() => {
      p += 10; setProgress(p)
      if (p >= 100) {
        clearInterval(t1); setStep('analyzing')
        let ip = 0
        const t2 = setInterval(() => {
          ip += 8; setIaProgress(ip)
          if (ip >= 100) { clearInterval(t2); setStep('result') }
        }, 80)
      }
    }, 100)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Formulaire */}
      {step === 'form' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>Publier un document</div>

          {/* Titre */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Titre du document *</label>
            <input type="text" placeholder="Ex: Droit Constitutionnel — Chapitre 5" value={titre}
              onChange={e => setTitre(e.target.value)} style={inp} />
          </div>

          {/* Matière + Niveau */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Matière *</label>
              <select value={matiere} onChange={e => setMatiere(e.target.value)} style={inp}>
                {['Droit Constitutionnel', 'Mathématiques', 'Finance', 'Économie', 'Informatique'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Niveau *</label>
              <select value={niveau} onChange={e => setNiveau(e.target.value)} style={inp}>
                {['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'].map(n => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Type */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Type de document *</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {types.map(t => (
                <button key={t} onClick={() => setType(t)}
                  style={{ fontSize: '12px', fontWeight: 600, padding: '6px 16px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.15s',
                    background: type === t ? 'var(--color-primary)' : '#fff',
                    color: type === t ? '#fff' : '#6B7280',
                    border: type === t ? '1.5px solid var(--color-primary)' : '1.5px solid #E5E7EB',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Upload zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Fichier PDF ou Word *</label>
            <div onClick={simulatePublish}
              style={{ border: '2px dashed var(--color-primary)', borderRadius: '14px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--color-primary-light)' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>☁️</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '4px' }}>
                Glisser-déposer ou cliquer pour choisir
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>PDF ou Word · Max 50 Mo</div>
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Description courte (optionnel)</label>
            <textarea rows={3} placeholder="Résumé en quelques lignes..."
              style={{ ...inp, resize: 'none', lineHeight: 1.5 }} />
          </div>

          <button onClick={simulatePublish}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            📤 Publier au nom de l'université
          </button>
        </div>
      )}

      {/* Upload en cours */}
      {step === 'uploading' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '24px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Envoi du fichier...</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF', marginBottom: '6px' }}>
            <span>cours_droit_ch5.pdf</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '100px', background: '#F3F4F6' }}>
            <div style={{ height: '100%', borderRadius: '100px', background: 'var(--color-primary)', width: `${progress}%`, transition: 'width 0.1s' }} />
          </div>
        </div>
      )}

      {/* Analyse IA */}
      {step === 'analyzing' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Analyse IA en cours...</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Pertinence · Plagiat · Score de fiabilité</div>
            </div>
          </div>
          <div style={{ height: '6px', borderRadius: '100px', background: '#F3F4F6' }}>
            <div style={{ height: '100%', borderRadius: '100px', background: 'var(--color-gold)', width: `${iaProgress}%`, transition: 'width 0.08s' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'right', marginTop: '6px' }}>{iaProgress}%</div>
        </div>
      )}

      {/* Résultat IA */}
      {step === 'result' && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '12px', background: 'var(--color-success-light)' }}>
            <div style={{ fontSize: '28px' }}>✅</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-success)' }}>Document validé par l'IA</div>
              <div style={{ fontSize: '13px', color: 'var(--color-success)', marginTop: '3px' }}>Score fiabilité : 91/100 · Aucun plagiat · Pertinence : Excellent</div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--color-primary-light)', fontSize: '13px', color: 'var(--color-primary)' }}>
            Votre document est maintenant publié au nom de <strong>Université Joseph Ki-Zerbo</strong>. Votre nom apparaît comme auteur.
          </div>
          <button onClick={() => setStep('form')}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            Publier un autre document
          </button>
        </div>
      )}

    </div>
  )
}

export default PublishPage
