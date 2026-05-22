import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DocCard from '../../components/shared/DocCard'

// ── Data ──────────────────────────────────────────────────────────────────────
const universites = {
  1: {
    id: 1, logo: 'UJK', color: '#3B7FE1',
    nom: 'Université Joseph Ki-Zerbo',
    ville: 'Ouagadougou', region: 'Centre',
    etudiants: 4218, totalDocs: 840,
    description: "Fondée en 1974, l'Université Joseph Ki-Zerbo est la plus grande université du Burkina Faso. Elle forme des étudiants dans les domaines du droit, des lettres, des sciences humaines, des sciences exactes et de la santé. Sa bibliothèque numérique sur LibraFlow regroupe plus de 840 ressources validées par intelligence artificielle.",
    profs: [
      { id: 1, initials: 'OM', color: '#3B7FE1', nom: 'Prof. Ouédraogo Mamadou',  grade: 'Maître de conférences', matiere: 'Droit Constitutionnel', docs: 12 },
      { id: 4, initials: 'FY', color: '#8b5cf6', nom: 'Prof. Fatima Yameogo',      grade: 'Professeur titulaire',  matiere: 'Mathématiques',         docs: 15 },
      { id: 5, initials: 'RC', color: '#10b981', nom: 'Prof. Rose Compaoré',       grade: 'Maître-assistant',      matiere: 'Biologie',              docs: 6  },
    ],
    publications: [
      { id: 1, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Constitutionnel — Cours magistral Chapitre 4', matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Cours',   score: 94, likes: 24, vues: 412, date: '18 Mai 2026' },
      { id: 2, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Droit Civil — Introduction générale',                 matiere: 'Droit Civil',           niveau: 'Licence 1', type: 'Cours',   score: 87, likes: 18, vues: 289, date: '12 Mai 2026' },
      { id: 3, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Ouédraogo Mamadou', titre: 'Annales Droit Constitutionnel 2023',                    matiere: 'Droit Constitutionnel', niveau: 'Licence 2', type: 'Annales', score: 71, likes: 41, vues: 546, date: '05 Mai 2026' },
      { id: 4, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Fatima Yameogo',     titre: 'Algèbre Linéaire — Introduction aux espaces vectoriels', matiere: 'Mathématiques',         niveau: 'Licence 1', type: 'Cours',   score: 92, likes: 28, vues: 301, date: '08 Mai 2026' },
      { id: 5, univLogo: 'UJK', univColor: '#3B7FE1', universite: 'Université Joseph Ki-Zerbo', auteur: 'Prof. Rose Compaoré',      titre: 'Biologie Cellulaire — Chapitre 2',                       matiere: 'Biologie',              niveau: 'Licence 1', type: 'Cours',   score: 89, likes: 22, vues: 198, date: '02 Mai 2026' },
    ],
  },
  2: {
    id: 2, logo: 'USTA', color: '#378ADD',
    nom: 'USTA Bobo-Dioulasso',
    ville: 'Bobo-Dioulasso', region: 'Hauts-Bassins',
    etudiants: 3120, totalDocs: 512,
    description: "L'Université des Sciences et Techniques de Bobo-Dioulasso est spécialisée dans les sciences exactes et appliquées. Reconnue pour l'excellence de ses formations en mathématiques, physique et ingénierie, elle met à disposition de ses étudiants un catalogue complet de ressources pédagogiques numérisées.",
    profs: [
      { id: 2, initials: 'TF', color: '#378ADD', nom: 'Prof. Traoré Fatoumata', grade: 'Professeur titulaire', matiere: 'Mathématiques', docs: 18 },
      { id: 6, initials: 'BS', color: '#ef4444', nom: 'Prof. Barro Seydou',     grade: 'Maître de conférences', matiere: 'Physique',       docs: 9  },
    ],
    publications: [
      { id: 2, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Annales Mathématiques — Session 2024/2025', matiere: 'Mathématiques', niveau: 'Licence 3', type: 'Annales', score: 88, likes: 41, vues: 389, date: '15 Mai 2026' },
      { id: 6, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Traoré Fatoumata', titre: 'Analyse Réelle — Suites et Séries',          matiere: 'Mathématiques', niveau: 'Licence 2', type: 'Cours',   score: 91, likes: 33, vues: 247, date: '10 Mai 2026' },
      { id: 7, univLogo: 'USTA', univColor: '#378ADD', universite: 'USTA Bobo-Dioulasso', auteur: 'Prof. Barro Seydou',     titre: 'Mécanique Quantique — Introduction',          matiere: 'Physique',      niveau: 'Licence 3', type: 'Cours',   score: 82, likes: 15, vues: 201, date: '07 Mai 2026' },
    ],
  },
  3: {
    id: 3, logo: 'ISGE', color: '#f59e0b',
    nom: 'ISGE-BF Ouagadougou',
    ville: 'Ouagadougou', region: 'Centre',
    etudiants: 980, totalDocs: 298,
    description: "L'Institut Supérieur de Gestion des Entreprises du Burkina Faso forme des cadres spécialisés en finance, comptabilité et management. Ses enseignants-chercheurs publient régulièrement des travaux dirigés et cours magistraux accessibles à tous les étudiants inscrits.",
    profs: [
      { id: 3, initials: 'ZI', color: '#f59e0b', nom: 'Prof. Zongo Issa',     grade: 'Maître-assistant',      matiere: 'Finance',       docs: 11 },
      { id: 7, initials: 'AK', color: '#10b981', nom: 'Prof. Amadou Kaboré', grade: 'Maître de conférences', matiere: 'Économie',      docs: 8  },
    ],
    publications: [
      { id: 3, univLogo: 'ISGE', univColor: '#f59e0b', universite: 'ISGE-BF Ouagadougou', auteur: 'Prof. Zongo Issa',     titre: "TD Finance d'entreprise — Exercices corrigés S2",   matiere: 'Finance',   niveau: 'Master 1',  type: 'TD',     score: 71, likes: 19, vues: 187, date: '10 Mai 2026' },
      { id: 8, univLogo: 'ISGE', univColor: '#f59e0b', universite: 'ISGE-BF Ouagadougou', auteur: 'Prof. Zongo Issa',     titre: 'Gestion Financière — Analyse de la rentabilité',     matiere: 'Finance',   niveau: 'Licence 3', type: 'Cours',  score: 83, likes: 22, vues: 245, date: '03 Mai 2026' },
      { id: 9, univLogo: 'ISGE', univColor: '#f59e0b', universite: 'ISGE-BF Ouagadougou', auteur: "Prof. Amadou Kaboré", titre: "Introduction à l'Économie Générale",                  matiere: 'Économie',  niveau: 'Licence 1', type: 'Cours',  score: 76, likes: 17, vues: 298, date: '28 Avr 2026' },
    ],
  },
  4: {
    id: 4, logo: 'UNZ', color: '#10b981',
    nom: 'Université Norbert Zongo',
    ville: 'Koudougou', region: 'Centre-Ouest',
    etudiants: 2140, totalDocs: 387,
    description: "L'Université Norbert Zongo à Koudougou se distingue par ses formations en droit international, sciences sociales et lettres. Son engagement pour l'accessibilité numérique en fait un acteur clé du réseau LibraFlow dans la région Centre-Ouest.",
    profs: [
      { id: 8, initials: 'SA', color: '#10b981', nom: 'Prof. Sawadogo Amidou', grade: 'Maître de conférences', matiere: 'Droit International', docs: 7 },
      { id: 9, initials: 'DN', color: '#8b5cf6', nom: 'Prof. Diabré Nadège',   grade: 'Maître-assistant',      matiere: 'Sociologie',           docs: 5 },
    ],
    publications: [
      { id: 10, univLogo: 'UNZ', univColor: '#10b981', universite: 'Université Norbert Zongo', auteur: 'Prof. Sawadogo Amidou', titre: 'Droit International Public — Principes fondamentaux', matiere: 'Droit',      niveau: 'Licence 3', type: 'Cours', score: 79, likes: 12, vues: 143, date: '14 Mai 2026' },
      { id: 11, univLogo: 'UNZ', univColor: '#10b981', universite: 'Université Norbert Zongo', auteur: 'Prof. Diabré Nadège',   titre: 'Introduction à la Sociologie africaine',            matiere: 'Sociologie', niveau: 'Licence 1', type: 'Cours', score: 85, likes: 16, vues: 211, date: '09 Mai 2026' },
    ],
  },
  5: {
    id: 5, logo: 'BIT', color: '#374151',
    nom: 'BIT Burkina',
    ville: 'Ouagadougou', region: 'Centre',
    etudiants: 1450, totalDocs: 221,
    description: "Le Burkina Institute of Technology est spécialisé dans l'enseignement des sciences informatiques et technologies numériques. Premier établissement burkinabè à avoir intégré la plateforme LibraFlow, le BIT met à disposition une bibliothèque riche de cours, TDs et projets guidés.",
    profs: [
      { id: 10, initials: 'KA', color: '#374151', nom: 'Prof. Kaboré Adama',          grade: 'Professeur titulaire',  matiere: 'Informatique', docs: 14 },
      { id: 11, initials: 'OT', color: '#3B7FE1', nom: 'Prof. Ouédraogo Théophile', grade: 'Maître de conférences', matiere: 'Réseaux',      docs: 6  },
    ],
    publications: [
      { id: 12, univLogo: 'BIT', univColor: '#374151', universite: 'BIT Burkina', auteur: 'Prof. Kaboré Adama',          titre: "Introduction à l'Informatique — Cours complet L1",   matiere: 'Informatique', niveau: 'Licence 1', type: 'Cours', score: 91, likes: 56, vues: 564, date: '16 Mai 2026' },
      { id: 13, univLogo: 'BIT', univColor: '#374151', universite: 'BIT Burkina', auteur: 'Prof. Kaboré Adama',          titre: 'Algorithmes de tri — TD série 2 avec corrections',    matiere: 'Informatique', niveau: 'Licence 2', type: 'TD',    score: 88, likes: 38, vues: 312, date: '11 Mai 2026' },
      { id: 14, univLogo: 'BIT', univColor: '#374151', universite: 'BIT Burkina', auteur: 'Prof. Ouédraogo Théophile', titre: 'Réseaux Informatiques — Protocoles TCP/IP',            matiere: 'Réseaux',      niveau: 'Licence 3', type: 'Cours', score: 84, likes: 21, vues: 189, date: '06 Mai 2026' },
    ],
  },
  6: {
    id: 6, logo: 'UOH', color: '#6366f1',
    nom: 'Université de Ouahigouya',
    ville: 'Ouahigouya', region: 'Nord',
    etudiants: 1200, totalDocs: 181,
    description: "L'Université de Ouahigouya développe ses formations autour des sciences humaines, de l'histoire et de la géographie du Sahel. Elle contribue au développement culturel et académique de la région Nord du Burkina Faso.",
    profs: [
      { id: 12, initials: 'KM', color: '#6366f1', nom: 'Prof. Konaté Moussa', grade: 'Maître de conférences', matiere: 'Histoire-Géo', docs: 9 },
    ],
    publications: [
      { id: 15, univLogo: 'UOH', univColor: '#6366f1', universite: 'Université de Ouahigouya', auteur: 'Prof. Konaté Moussa', titre: 'Histoire du Burkina Faso — Cours L1',       matiere: 'Histoire',    niveau: 'Licence 1', type: 'Cours',   score: 83, likes: 14, vues: 178, date: '13 Mai 2026' },
      { id: 16, univLogo: 'UOH', univColor: '#6366f1', universite: 'Université de Ouahigouya', auteur: 'Prof. Konaté Moussa', titre: 'Géographie du Sahel — Enjeux contemporains', matiere: 'Géographie',  niveau: 'Licence 2', type: 'Cours',   score: 77, likes: 9,  vues: 132, date: '04 Mai 2026' },
    ],
  },
}

const card = { background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }

const UniversiteProfilPage = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const univ     = universites[id] || universites[1]

  const [suivi,      setSuivi]      = useState(false)
  const [tab,        setTab]        = useState('publications')
  const [filterProf, setFilterProf] = useState('Tous')

  const profNames = ['Tous', ...univ.profs.map(p => p.nom)]
  const filtered  = filterProf === 'Tous'
    ? univ.publications
    : univ.publications.filter(pub => pub.auteur === filterProf)

  const bannerGradient = `linear-gradient(135deg, ${univ.color}ee 0%, ${univ.color}88 100%)`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* ── Retour ── */}
      <button onClick={() => navigate('/etudiant/universites')}
        style={{ alignSelf: 'flex-start', fontSize: '13px', padding: '6px 14px', borderRadius: '9px', border: '1.5px solid #E5E7EB', background: '#fff', color: '#6B7280', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ← Retour aux universités
      </button>

      {/* ── Carte identité ── */}
      <div style={{ ...card, overflow: 'hidden' }}>

        {/* Banner */}
        <div style={{ height: '120px', background: bannerGradient, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div style={{ position: 'absolute', top: '16px', right: '20px' }}>
            <button onClick={() => setSuivi(s => !s)}
              style={{ padding: '8px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                background: '#fff', color: suivi ? 'var(--color-success)' : univ.color,
                border: suivi ? '1.5px solid var(--color-success)' : 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>
              {suivi ? '✓ Suivi' : '+ Suivre'}
            </button>
          </div>
        </div>

        {/* Corps */}
        <div style={{ padding: '0 24px 24px' }}>
          {/* Logo chevauchant le banner */}
          <div style={{ marginTop: '-40px', marginBottom: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: univ.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#fff', border: '4px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', letterSpacing: '-0.5px' }}>
              {univ.logo}
            </div>
          </div>

          {/* Nom + localisation */}
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '5px' }}>{univ.nom}</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📍</span>
            <span>{univ.ville} · {univ.region}</span>
          </div>

          {/* Bio */}
          <p style={{ fontSize: '13.5px', lineHeight: 1.75, color: '#374151', padding: '14px 18px', borderRadius: '12px', background: '#F9FAFB', margin: '0 0 18px', border: '1px solid #F3F4F6' }}>
            {univ.description}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
            {[
              { icon: '🎓', val: univ.etudiants.toLocaleString('fr-FR'), label: 'Étudiants',    color: univ.color,              bg: `${univ.color}18` },
              { icon: '📄', val: univ.totalDocs,                         label: 'Documents',    color: 'var(--color-gold)',    bg: 'var(--color-gold-light)' },
              { icon: '👨‍🏫', val: univ.profs.length,                      label: 'Enseignants', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: '12px', background: s.bg }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>{s.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: s.color, opacity: 0.8, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #E5E7EB', padding: '5px', display: 'flex', gap: '4px' }}>
        {[
          { key: 'publications', label: `📄 Publications (${univ.publications.length})` },
          { key: 'enseignants',  label: `👨‍🏫 Enseignants (${univ.profs.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '9px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: tab === t.key ? univ.color : 'transparent',
              color: tab === t.key ? '#fff' : '#6B7280',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Onglet Publications ── */}
      {tab === 'publications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Filtre par professeur */}
          {univ.profs.length > 1 && (
            <div style={{ ...card, padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                Filtrer par enseignant
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {profNames.map(name => (
                  <button key={name} onClick={() => setFilterProf(name)}
                    style={{ fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', transition: 'all 0.15s',
                      background: filterProf === name ? univ.color : '#F9FAFB',
                      color: filterProf === name ? '#fff' : '#6B7280',
                      border: filterProf === name ? 'none' : '1px solid #E5E7EB',
                    }}>
                    {name === 'Tous' ? `Tous (${univ.publications.length})` : name.replace('Prof. ', '')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cards documents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(pub => {
              const prof = univ.profs.find(p => p.nom === pub.auteur)
              return (
                <DocCard key={pub.id} doc={{ ...pub, profInitials: prof?.initials, profColor: prof?.color }} meta={pub.date} />
              )
            })}
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#374151' }}>Aucune publication</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Onglet Enseignants ── */}
      {tab === 'enseignants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {univ.profs.map(prof => {
            const profPubs = univ.publications.filter(p => p.auteur === prof.nom)
            return (
              <div key={prof.id} style={{ ...card, padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Avatar */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: prof.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {prof.initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '3px' }}>{prof.nom}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>{prof.grade}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                        {prof.matiere}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#F3F4F6', color: '#6B7280' }}>
                        {prof.docs} documents
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                        {profPubs.length} publiés ici
                      </span>
                    </div>
                  </div>

                  {/* Bouton voir profil */}
                  <button onClick={() => navigate(`/etudiant/professeur/${prof.id}`)}
                    style={{ padding: '8px 16px', borderRadius: '10px', background: univ.color, color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    Voir le profil
                  </button>
                </div>

                {/* Miniature de ses publications */}
                {profPubs.length > 0 && (
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #F3F4F6' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                      Publications dans cette université
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {profPubs.map(pub => {
                        const sc = pub.score >= 80
                          ? { color: 'var(--color-success)', bg: 'var(--color-success-light)' }
                          : pub.score >= 65
                          ? { color: 'var(--color-gold)',    bg: 'var(--color-gold-light)' }
                          : { color: 'var(--color-danger)',  bg: '#FEE2E2' }
                        return (
                          <div key={pub.id}
                            onClick={() => navigate(`/etudiant/lecture/${pub.id}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: '#F9FAFB', cursor: 'pointer', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
                            onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>📄</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {pub.titre}
                              </div>
                              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                                {pub.type} · {pub.niveau} · {pub.vues} vues
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '100px', background: sc.bg, flexShrink: 0 }}>
                              <span style={{ fontSize: '10px', color: sc.color }}>✓</span>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: sc.color }}>{pub.score}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default UniversiteProfilPage
