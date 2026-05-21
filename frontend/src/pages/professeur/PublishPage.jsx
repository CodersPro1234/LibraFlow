import { useState } from 'react'

const PublishPage = () => {
  const [step, setStep] = useState('form') // form | uploading | analyzing | result
  const [progress, setProgress] = useState(0)
  const [iaProgress, setIaProgress] = useState(0)
  const [type, setType] = useState('Cours')
  const [titre, setTitre] = useState('')
  const [matiere, setMatiere] = useState('Droit Constitutionnel')
  const [niveau, setNiveau] = useState('Licence 1')

  const types = ['Cours', 'TD', 'Annales', 'Résumé']

  const simulatePublish = () => {
    setStep('uploading')
    setProgress(0)
    let p = 0
    const t1 = setInterval(() => {
      p += 10
      setProgress(p)
      if (p >= 100) {
        clearInterval(t1)
        setStep('analyzing')
        let ip = 0
        const t2 = setInterval(() => {
          ip += 8
          setIaProgress(ip)
          if (ip >= 100) {
            clearInterval(t2)
            setStep('result')
          }
        }, 80)
      }
    }, 100)
  }

  return (
    <div className="max-w-xl flex flex-col gap-4">

      {/* Formulaire */}
      {step === 'form' && (
        <div className="bg-white rounded-xl border p-5 flex flex-col gap-4"
          style={{ borderColor: 'var(--color-border)' }}>

          {/* Titre */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Titre du document *
            </label>
            <input
              type="text"
              placeholder="Ex: Droit Constitutionnel — Chapitre 5"
              value={titre}
              onChange={e => setTitre(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>

          {/* Matière + Niveau */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Matière *</label>
              <select
                value={matiere}
                onChange={e => setMatiere(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                <option>Droit Constitutionnel</option>
                <option>Mathématiques</option>
                <option>Finance</option>
                <option>Économie</option>
                <option>Informatique</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Niveau *</label>
              <select
                value={niveau}
                onChange={e => setNiveau(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                <option>Licence 1</option>
                <option>Licence 2</option>
                <option>Licence 3</option>
                <option>Master 1</option>
                <option>Master 2</option>
              </select>
            </div>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Type de document *
            </label>
            <div className="flex gap-2 flex-wrap">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
                  style={{
                    background: type === t ? 'var(--color-primary)' : 'transparent',
                    color: type === t ? 'white' : 'var(--color-muted)',
                    borderColor: type === t ? 'var(--color-primary)' : 'var(--color-border)',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Fichier PDF ou Word *
            </label>
            <div
              onClick={simulatePublish}
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
              style={{ borderColor: 'var(--color-primary)', background: 'var(--color-primary-light)' }}>
              <div className="text-2xl mb-2">☁️</div>
              <div className="text-xs font-medium" style={{ color: 'var(--color-primary-dark)' }}>
                Glisser-déposer ou cliquer pour choisir
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                PDF ou Word · Max 50 Mo
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
              Description courte (optionnel)
            </label>
            <textarea
              rows={3}
              placeholder="Résumé en quelques lignes..."
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>

          <button
            onClick={simulatePublish}
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: 'var(--color-primary)' }}>
            📤 Publier au nom de l'université
          </button>

        </div>
      )}

      {/* Upload en cours */}
      {step === 'uploading' && (
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Envoi du fichier...
          </div>
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-muted)' }}>
            <span>cours_droit_ch5.pdf</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: 'var(--color-primary)' }} />
          </div>
        </div>
      )}

      {/* Analyse IA */}
      {step === 'analyzing' && (
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-xl">🤖</div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                Analyse IA en cours...
              </div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                Pertinence · Plagiat · Score de fiabilité
              </div>
            </div>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--color-border)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${iaProgress}%`, background: 'var(--color-gold)' }} />
          </div>
          <div className="text-xs mt-2 text-right" style={{ color: 'var(--color-muted)' }}>
            {iaProgress}%
          </div>
        </div>
      )}

      {/* Résultat IA */}
      {step === 'result' && (
        <div className="bg-white rounded-xl border p-5 flex flex-col gap-4"
          style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: 'var(--color-success-light)' }}>
            <div className="text-2xl">✅</div>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                Document validé par l'IA
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-success)' }}>
                Score fiabilité : 91/100 · Aucun plagiat · Pertinence : Excellent
              </div>
            </div>
          </div>
          <div className="text-xs p-3 rounded-lg" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
            Votre document est maintenant publié au nom de <strong>Université Joseph Ki-Zerbo</strong>. Votre nom apparaît comme auteur.
          </div>
          <button
            onClick={() => setStep('form')}
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: 'var(--color-primary)' }}>
            Publier un autre document
          </button>
        </div>
      )}

    </div>
  )
}

export default PublishPage