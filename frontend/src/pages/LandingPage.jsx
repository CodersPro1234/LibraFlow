import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '#apropos' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Contact', href: '#contact' },
]

const stats = [
  { value: '47 289', label: 'Étudiants actifs' },
  { value: '5 120', label: 'Documents publiés' },
  { value: '12', label: 'Universités connectées' },
  { value: '94%', label: 'Score IA moyen' },
]

const features = [
  {
    gradient: 'linear-gradient(135deg, #3B7FE1 0%, #1d4ed8 100%)',
    icon: '🤖',
    title: 'Validation par IA',
    desc: 'Chaque document publié est analysé automatiquement. Score de fiabilité, détection de plagiat et cohérence pédagogique garantis.',
  },
  {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    icon: '📚',
    title: 'Bibliothèque nationale',
    desc: 'Cours magistraux, TD, annales et mémoires de toutes les filières du Burkina Faso réunis en un seul endroit.',
  },
  {
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    icon: '🏛',
    title: 'Réseau inter-universitaire',
    desc: '12 universités et grandes écoles connectées. Accédez aux ressources de toutes les institutions nationales.',
  },
  {
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    icon: '👨‍🏫',
    title: 'Professeurs certifiés',
    desc: 'Seuls les enseignants validés par leurs universités publient. Une garantie de qualité académique à chaque publication.',
  },
  {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    icon: '🔔',
    title: 'Fil d\'actualité personnalisé',
    desc: 'Suivez vos professeurs et universités préférés. Recevez une alerte à chaque nouvelle publication.',
  },
  {
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    icon: '🔊',
    title: 'Lecture audio intégrée',
    desc: 'Écoutez vos cours à voix haute grâce à la synthèse vocale. Idéal pour réviser en déplacement.',
  },
]

const actors = [
  {
    role: 'Étudiant',
    emoji: '🎓',
    gradient: 'linear-gradient(135deg, #3B7FE1 0%, #1e40af 100%)',
    points: ['Accès à des milliers de ressources validées', 'Bibliothèque personnelle avec favoris', 'Fil d\'actualité par université et prof', 'Lecture en ligne et hors connexion'],
    link: '/inscription',
    cta: 'S\'inscrire gratuitement',
  },
  {
    role: 'Professeur',
    emoji: '📝',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    points: ['Publication de cours, TD et annales', 'Validation IA automatique', 'Tableau de bord de vos statistiques', 'Réseau de collègues nationaux'],
    link: '/inscription/professeur',
    cta: 'Rejoindre la plateforme',
  },
  {
    role: 'Université',
    emoji: '🏛',
    gradient: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
    points: ['Gestion des professeurs et publications', 'Validations et modération du contenu', 'Visibilité nationale de l\'institution', 'Rapports et statistiques détaillés'],
    link: '/inscription/universite',
    cta: 'Enregistrer l\'établissement',
  },
]

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", background: '#fff' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
        transition: 'all 0.25s ease',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>📖</div>
          <span style={{
            fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px',
            color: scrolled ? 'var(--color-primary)' : '#fff',
          }}>LibraFlow</span>
        </div>

        {/* Nav Links (desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: '14px', fontWeight: 500,
              color: scrolled ? 'var(--color-text)' : 'rgba(255,255,255,0.88)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = scrolled ? 'var(--color-primary)' : '#fff'}
              onMouseLeave={e => e.target.style.color = scrolled ? 'var(--color-text)' : 'rgba(255,255,255,0.88)'}
            >{l.label}</a>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/login" style={{
            fontSize: '14px', fontWeight: 600,
            padding: '8px 20px', borderRadius: '10px',
            border: `1.5px solid ${scrolled ? 'var(--color-border)' : 'rgba(255,255,255,0.5)'}`,
            color: scrolled ? 'var(--color-text)' : '#fff',
            textDecoration: 'none',
            transition: 'all 0.2s',
            background: 'transparent',
          }}>Connexion</Link>
          <Link to="/inscription" style={{
            fontSize: '14px', fontWeight: 600,
            padding: '8px 20px', borderRadius: '10px',
            background: scrolled ? 'var(--color-primary)' : '#fff',
            color: scrolled ? '#fff' : 'var(--color-primary)',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}>Commencer</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="accueil" style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: '120px 5% 80px',
        background: 'linear-gradient(160deg, #0f172a 0%, #1e3a6e 40%, #1A56DB 80%, #3B7FE1 100%)',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-100px', left: '-150px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,127,225,0.35) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '7px 18px', borderRadius: '100px', marginBottom: '28px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
          }}>
            <span>🇧🇫</span>
            <span>Plateforme nationale académique — Burkina Faso</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 800, lineHeight: 1.12,
            color: '#fff', marginBottom: '24px',
            letterSpacing: '-1px',
          }}>
            Bienvenue sur<br />
            <span style={{ color: '#7dd3fc' }}>LibraFlow</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '17px', lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '40px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto',
          }}>
            Le réseau académique national connectant étudiants, professeurs et universités
            du Burkina Faso pour partager et accéder à des ressources pédagogiques validées.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/inscription" style={{
              padding: '14px 32px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #fff 0%, #e0f2fe 100%)',
              color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)' }}
            >
              Commencer gratuitement →
            </Link>
            <a href="#fonctionnalites" style={{
              padding: '14px 32px', borderRadius: '12px',
              border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#fff', fontSize: '15px', fontWeight: 600,
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              Découvrir les fonctionnalités
            </a>
          </div>
        </div>

        {/* Stats bar at bottom of hero */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '20px 5%', gap: '16px',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── À propos ── */}
      <section id="apropos" style={{
        padding: '100px 5%', background: '#fff',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          {/* Visual */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '24px', overflow: 'hidden',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a6e 50%, #3B7FE1 100%)',
              aspectRatio: '4/3',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '40px',
              boxShadow: '0 24px 64px rgba(59,127,225,0.25)',
            }}>
              {/* Mini dashboard mockup */}
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Publications récentes</div>
                {['Droit Constitutionnel — L2', 'Annales Mathématiques 2025', 'Introduction à l\'Informatique'].map((t, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', marginBottom: '8px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)',
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      background: ['#3B7FE1', '#f59e0b', '#10b981'][i],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px',
                    }}>📄</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>IA {[94, 88, 91][i]} · validé</div>
                    </div>
                    <div style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(16,185,129,0.2)', color: '#34d399', fontWeight: 600 }}>✓</div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: '16px', padding: '12px 20px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', gap: '24px',
              }}>
                {[['📄', '5 120', 'Docs'], ['🎓', '47K+', 'Étudiants'], ['🤖', '94%', 'Score IA']].map(([icon, v, l], i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px' }}>{icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{v}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div style={{
              position: 'absolute', top: '-18px', right: '-18px',
              background: '#fff', borderRadius: '16px',
              padding: '12px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid rgba(59,127,225,0.1)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '20px' }}>🇧🇫</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text)' }}>Ministère MENAPLN</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>Certifié & supervisé</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 700,
              padding: '5px 14px', borderRadius: '100px', marginBottom: '20px',
              background: 'var(--color-primary-light)', color: 'var(--color-primary)',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>À propos</div>
            <h2 style={{
              fontSize: '2rem', fontWeight: 800, lineHeight: 1.25,
              color: 'var(--color-text)', marginBottom: '20px', letterSpacing: '-0.5px',
            }}>
              Conçu pour l'environnement<br />académique burkinabè
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '24px' }}>
              LibraFlow est la première plateforme nationale de partage de ressources pédagogiques
              au Burkina Faso. Chaque document est soumis à une analyse automatique par intelligence
              artificielle avant publication, garantissant qualité et fiabilité.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '32px' }}>
              Sous la supervision du Ministère de l'Éducation Nationale (MENAPLN), le réseau
              connecte toutes les universités nationales en un écosystème cohérent et sécurisé.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Accès gratuit pour tous les étudiants burkinabè', 'Contenu validé par IA et supervisé par les universités', '12 établissements connectés au réseau national'].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                    background: 'var(--color-primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700,
                  }}>✓</div>
                  <span style={{ fontSize: '14px', color: 'var(--color-text)', fontWeight: 500 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="fonctionnalites" style={{
        padding: '100px 5%',
        background: 'linear-gradient(180deg, #f8faff 0%, #fff 100%)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 700,
              padding: '5px 14px', borderRadius: '100px', marginBottom: '16px',
              background: 'var(--color-primary-light)', color: 'var(--color-primary)',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>Fonctionnalités</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Une plateforme complète pensée pour l'écosystème académique national.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                borderRadius: '20px', overflow: 'hidden',
                border: '1px solid var(--color-border)',
                background: '#fff',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(59,127,225,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                {/* Card header with gradient */}
                <div style={{
                  height: '120px', background: f.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '40px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: '-20px', right: '-20px',
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '-30px', left: '-10px',
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                  }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>{f.icon}</span>
                </div>
                {/* Card body */}
                <div style={{ padding: '20px 22px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Actors ── */}
      <section style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-block', fontSize: '12px', fontWeight: 700,
              padding: '5px 14px', borderRadius: '100px', marginBottom: '16px',
              background: 'var(--color-primary-light)', color: 'var(--color-primary)',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>Pour chaque acteur</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              Une plateforme adaptée à votre rôle
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Étudiant, professeur ou institution — LibraFlow s'adapte à vos besoins.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {actors.map((a, i) => (
              <div key={i} style={{
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                border: '1px solid var(--color-border)',
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Header */}
                <div style={{
                  background: a.gradient, padding: '32px 28px 28px',
                  display: 'flex', flexDirection: 'column', gap: '12px',
                }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', backdropFilter: 'blur(8px)',
                  }}>{a.emoji}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{a.role}</div>
                </div>
                {/* Body */}
                <div style={{ padding: '24px 28px', flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {a.points.map((p, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                          background: 'var(--color-primary-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700,
                        }}>✓</div>
                        <span style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={a.link} style={{
                    display: 'block', textAlign: 'center',
                    marginTop: 'auto', padding: '12px 20px', borderRadius: '12px',
                    background: 'var(--color-primary)', color: '#fff',
                    fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >{a.cta} →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{
        padding: '100px 5%',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a6e 50%, #1A56DB 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,127,225,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '40px', marginBottom: '20px' }}>🚀</div>
          <h2 style={{
            fontSize: '2.25rem', fontWeight: 800, color: '#fff',
            marginBottom: '18px', lineHeight: 1.2, letterSpacing: '-0.5px',
          }}>
            Prêt à rejoindre le réseau<br />académique national ?
          </h2>
          <p style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.7)',
            marginBottom: '40px', lineHeight: 1.7,
          }}>
            Plus de 47 000 étudiants font déjà confiance à LibraFlow.<br />
            Rejoignez la communauté académique burkinabè.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/inscription" style={{
              padding: '16px 40px', borderRadius: '12px',
              background: '#fff', color: 'var(--color-primary)',
              fontSize: '15px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              Créer mon compte gratuitement
            </Link>
            <Link to="/login" style={{
              padding: '16px 36px', borderRadius: '12px',
              border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#fff', fontSize: '15px', fontWeight: 600,
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.08)',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" style={{
        background: '#0f172a', padding: '60px 5% 32px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                }}>📖</div>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>LibraFlow</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '20px' }}>
                Plateforme nationale de partage de ressources pédagogiques, sous la supervision
                du Ministère de l'Éducation Nationale du Burkina Faso.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📧</span> contact@libraflow.bf
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📍</span> Ouagadougou, Burkina Faso
                </div>
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Plateforme', links: ['Accueil', 'À propos', 'Fonctionnalités', 'Contact'] },
              { title: 'Compte', links: ['Connexion', 'Inscription Étudiant', 'Inscription Professeur', 'Inscription Université'] },
              { title: 'Légal', links: ['Conditions d\'utilisation', 'Politique de confidentialité', 'Mentions légales'] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.links.map((l, j) => (
                    <a key={j} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              © 2026 LibraFlow · Ministère de l'Éducation Nationale du Burkina Faso
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Fait avec</span>
              <span style={{ fontSize: '12px' }}>🇧🇫</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>au Burkina Faso</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage
