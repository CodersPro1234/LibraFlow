import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// ── Animation variants ────────────────────────────────────────────────────────
const fromTop    = { hidden: { opacity: 0, y: -30 },       visible: { opacity: 1, y: 0 } }
const fromLeft   = { hidden: { opacity: 0, x: -60 },       visible: { opacity: 1, x: 0 } }
const fromRight  = { hidden: { opacity: 0, x:  60 },       visible: { opacity: 1, x: 0 } }
const fromBottom = { hidden: { opacity: 0, y:  30 },       visible: { opacity: 1, y: 0 } }
const zoomIn     = { hidden: { opacity: 0, scale: 0.93 },  visible: { opacity: 1, scale: 1 } }

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const staggerItem = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// Directional slide transition
const heroSlideVariants = {
  enter:  (d) => ({ opacity: 0, x: d > 0 ?  80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 :  60 }),
}

// ── CountUp (triggered when stats bar enters view) ────────────────────────────
const CountUp = ({ raw, suffix }) => {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const steps    = 60
    const duration = 1400
    const inc      = raw / steps
    let cur        = 0
    const timer = setInterval(() => {
      cur += inc
      if (cur >= raw) { setCount(raw); clearInterval(timer) }
      else setCount(Math.floor(cur))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, raw])

  return <span ref={ref}>{count.toLocaleString('fr-FR')}{suffix}</span>
}

// ── Data ──────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Accueil',        href: '#accueil' },
  { label: 'À propos',       href: '#apropos' },
  { label: 'Fonctionnalités',href: '#fonctionnalites' },
  { label: 'Contact',        href: '#contact' },
]

const stats = [
  { raw: 47289, suffix: '',  label: 'Étudiants actifs' },
  { raw: 5120,  suffix: '',  label: 'Documents publiés' },
  { raw: 12,    suffix: '',  label: 'Universités connectées' },
  { raw: 94,    suffix: '%', label: 'Score IA moyen' },
]

const SLIDES = [
  {
    badge:    '🇧🇫  Plateforme nationale académique — Burkina Faso',
    title:    { line1: 'Bienvenue sur', line2: 'LibraFlow' },
    accent:   '#7dd3fc',
    subtitle: 'Le réseau académique national connectant étudiants, professeurs et universités du Burkina Faso pour partager et accéder à des ressources pédagogiques validées.',
    cta1:     { label: 'Commencer gratuitement →', to: '/inscription' },
    cta2:     { label: 'Découvrir les fonctionnalités', href: '#fonctionnalites' },
    img:      'https://picsum.photos/seed/lf1/680/460',
  },
  {
    badge:    '🤖  Validation par Intelligence Artificielle',
    title:    { line1: 'Vos cours validés', line2: "par l'IA" },
    accent:   '#a7f3d0',
    subtitle: "Chaque document est analysé automatiquement. Score de fiabilité, détection de plagiat et cohérence pédagogique garantis avant toute publication.",
    cta1:     { label: 'Publier un document →', to: '/inscription/professeur' },
    cta2:     { label: 'En savoir plus', href: '#fonctionnalites' },
    img:      'https://picsum.photos/seed/lf2/680/460',
  },
  {
    badge:    '🏛  12 universités connectées au réseau national',
    title:    { line1: 'Le réseau', line2: 'inter-universitaire' },
    accent:   '#fde68a',
    subtitle: 'Accédez aux ressources de toutes les institutions nationales du Burkina Faso — cours magistraux, TD, annales et mémoires réunis en un seul endroit.',
    cta1:     { label: 'Rejoindre le réseau →', to: '/inscription' },
    cta2:     { label: 'Voir les universités', href: '#apropos' },
    img:      'https://picsum.photos/seed/lf3/680/460',
  },
]

const features = [
  { gradient: 'linear-gradient(135deg,#3B7FE1 0%,#1d4ed8 100%)', icon: '🤖', title: 'Validation par IA',             desc: 'Chaque document publié est analysé automatiquement. Score de fiabilité, détection de plagiat et cohérence pédagogique garantis.' },
  { gradient: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)', icon: '📚', title: 'Bibliothèque nationale',        desc: 'Cours magistraux, TD, annales et mémoires de toutes les filières du Burkina Faso réunis en un seul endroit.' },
  { gradient: 'linear-gradient(135deg,#10b981 0%,#059669 100%)', icon: '🏛',  title: 'Réseau inter-universitaire',   desc: '12 universités et grandes écoles connectées. Accédez aux ressources de toutes les institutions nationales.' },
  { gradient: 'linear-gradient(135deg,#8b5cf6 0%,#6d28d9 100%)', icon: '👨‍🏫', title: 'Professeurs certifiés',        desc: 'Seuls les enseignants validés par leurs universités publient. Une garantie de qualité académique à chaque publication.' },
  { gradient: 'linear-gradient(135deg,#ef4444 0%,#dc2626 100%)', icon: '🔔', title: "Fil d'actualité personnalisé", desc: 'Suivez vos professeurs et universités préférés. Recevez une alerte à chaque nouvelle publication.' },
  { gradient: 'linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)', icon: '🔊', title: 'Lecture audio intégrée',       desc: 'Écoutez vos cours à voix haute grâce à la synthèse vocale. Idéal pour réviser en déplacement.' },
]

const actors = [
  {
    role: 'Étudiant',   emoji: '🎓',
    gradient: 'linear-gradient(135deg,#3B7FE1 0%,#1e40af 100%)',
    points: ["Accès à des milliers de ressources validées", "Bibliothèque personnelle avec favoris", "Fil d'actualité par université et prof", 'Lecture en ligne et hors connexion'],
    link: '/inscription', cta: "S'inscrire gratuitement",
  },
  {
    role: 'Professeur', emoji: '📝',
    gradient: 'linear-gradient(135deg,#f59e0b 0%,#b45309 100%)',
    points: ['Publication de cours, TD et annales', 'Validation IA automatique', 'Tableau de bord de vos statistiques', 'Réseau de collègues nationaux'],
    link: '/inscription/professeur', cta: 'Rejoindre la plateforme',
  },
  {
    role: 'Université', emoji: '🏛',
    gradient: 'linear-gradient(135deg,#10b981 0%,#065f46 100%)',
    points: ['Gestion des professeurs et publications', 'Validations et modération du contenu', "Visibilité nationale de l'institution", 'Rapports et statistiques détaillés'],
    link: '/inscription/universite', cta: "Enregistrer l'établissement",
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)

  // Hero slider
  const [slide, setSlide]     = useState(0)
  const [dir, setDir]         = useState(1)
  const [progKey, setProgKey] = useState(0)
  const slideRef = useRef(0)
  const timerRef = useRef(null)

  // Responsive split layout
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 900)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const advanceTo = useCallback((idx, d) => {
    slideRef.current = idx
    setDir(d)
    setSlide(idx)
    setProgKey(k => k + 1)
  }, [])

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const next = (slideRef.current + 1) % SLIDES.length
      advanceTo(next, 1)
    }, 5000)
  }, [advanceTo])

  const goNext = useCallback(() => {
    advanceTo((slideRef.current + 1) % SLIDES.length, 1)
    startTimer()
  }, [advanceTo, startTimer])

  const goPrev = useCallback(() => {
    advanceTo((slideRef.current - 1 + SLIDES.length) % SLIDES.length, -1)
    startTimer()
  }, [advanceTo, startTimer])

  const goTo = useCallback((idx) => {
    if (idx === slideRef.current) return
    advanceTo(idx, idx > slideRef.current ? 1 : -1)
    startTimer()
  }, [advanceTo, startTimer])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const t = (delay = 0, duration = 0.65) => ({ duration, ease: 'easeOut', delay })

  const curr = SLIDES[slide]

  const arrowStyle = {
    width: '44px', height: '44px', borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(8px)',
    color: '#fff', fontSize: '18px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
    transition: 'all 0.2s',
    lineHeight: 1,
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", background: '#fff' }}>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📖</div>
          <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', color: scrolled ? 'var(--color-primary)' : '#fff' }}>LibraFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: '14px', fontWeight: 500, color: scrolled ? 'var(--color-text)' : 'rgba(255,255,255,0.88)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = scrolled ? 'var(--color-primary)' : '#fff'}
              onMouseLeave={e => e.target.style.color = scrolled ? 'var(--color-text)' : 'rgba(255,255,255,0.88)'}
            >{l.label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/login" style={{ fontSize: '14px', fontWeight: 600, padding: '8px 20px', borderRadius: '10px', border: `1.5px solid ${scrolled ? 'var(--color-border)' : 'rgba(255,255,255,0.5)'}`, color: scrolled ? 'var(--color-text)' : '#fff', textDecoration: 'none', transition: 'all 0.2s', background: 'transparent' }}>Connexion</Link>
          <Link to="/inscription" style={{ fontSize: '14px', fontWeight: 600, padding: '8px 20px', borderRadius: '10px', background: scrolled ? 'var(--color-primary)' : '#fff', color: scrolled ? '#fff' : 'var(--color-primary)', textDecoration: 'none', transition: 'all 0.2s' }}>Commencer</Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          ── Hero Slider ──
      ══════════════════════════════════════════════════════ */}
      <section id="accueil" style={{
        minHeight: '100vh', position: 'relative',
        display: 'flex', flexDirection: 'column',
        padding: '90px 5% 0',
        background: 'linear-gradient(160deg,#0f172a 0%,#1e3a6e 40%,#1A56DB 80%,#3B7FE1 100%)',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-100px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,127,225,0.35) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        {/* Slider area */}
        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '1240px', margin: '0 auto', width: '100%', paddingBottom: '80px' }}>

          {/* Left arrow */}
          {!isMobile && (
            <button onClick={goPrev} style={arrowStyle}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}>
              ‹
            </button>
          )}

          {/* Slides container */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={slide}
                custom={dir}
                variants={heroSlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.52, ease: 'easeOut' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '28px' : '64px',
                  alignItems: 'center',
                }}
              >
                {/* Text content */}
                <div>
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px', borderRadius: '100px', marginBottom: '26px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
                    {curr.badge}
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.62, delay: 0.25, ease: 'easeOut' }}
                    style={{ fontSize: 'clamp(2.1rem,4.5vw,3.5rem)', fontWeight: 800, lineHeight: 1.12, color: '#fff', marginBottom: '20px', letterSpacing: '-1px' }}>
                    {curr.title.line1}<br />
                    <span style={{ color: curr.accent }}>{curr.title.line2}</span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.62, delay: 0.4, ease: 'easeOut' }}
                    style={{ fontSize: '16px', lineHeight: 1.75, color: 'rgba(255,255,255,0.74)', marginBottom: '36px', maxWidth: '480px' }}>
                    {curr.subtitle}
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.52, delay: 0.55, ease: 'easeOut' }}
                    style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link to={curr.cta1.to}
                      style={{ padding: '13px 28px', borderRadius: '12px', background: 'linear-gradient(135deg,#fff 0%,#e0f2fe 100%)', color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', transition: 'transform 0.2s,box-shadow 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)' }}>
                      {curr.cta1.label}
                    </Link>
                    <a href={curr.cta2.href}
                      style={{ padding: '13px 28px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: '15px', fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                      {curr.cta2.label}
                    </a>
                  </motion.div>
                </div>

                {/* Image */}
                {!isMobile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, x: 40 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.18, ease: 'easeOut' }}>
                    <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)', aspectRatio: '4/3', background: '#1e3a6e' }}>
                      <img src={curr.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="eager" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          {!isMobile && (
            <button onClick={goNext} style={arrowStyle}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}>
              ›
            </button>
          )}
        </div>

        {/* Navigation: progress bar + dots */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', paddingBottom: '92px' }}>
          {/* Animated progress bar */}
          <div style={{ width: '160px', height: '3px', background: 'rgba(255,255,255,0.18)', borderRadius: '100px', overflow: 'hidden' }}>
            <motion.div
              key={`prog-${progKey}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{ transformOrigin: 'left', height: '100%', background: curr.accent, borderRadius: '100px' }}
            />
          </div>

          {/* Dots + mobile arrows */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isMobile && (
              <button onClick={goPrev} style={{ ...arrowStyle, width: '36px', height: '36px', fontSize: '16px' }}>‹</button>
            )}
            <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
              {SLIDES.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  style={{
                    height: '8px',
                    width: slide === i ? '28px' : '8px',
                    borderRadius: '100px',
                    background: slide === i ? '#fff' : 'rgba(255,255,255,0.32)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
            {isMobile && (
              <button onClick={goNext} style={{ ...arrowStyle, width: '36px', height: '36px', fontSize: '16px' }}>›</button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          variants={fromBottom} initial="hidden" animate="visible"
          transition={t(0.60, 0.7)}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', padding: '20px 5%', gap: '16px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                <CountUp raw={s.raw} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ── À propos ──
      ══════════════════════════════════════════════════════ */}
      <section id="apropos" style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

          <motion.div
            variants={zoomIn} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            transition={t(0, 0.7)}
            style={{ position: 'relative' }}>
            <div style={{ borderRadius: '24px', overflow: 'hidden', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a6e 50%,#3B7FE1 100%)', aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', boxShadow: '0 24px 64px rgba(59,127,225,0.25)' }}>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Publications récentes</div>
                {["Droit Constitutionnel — L2", "Annales Mathématiques 2025", "Introduction à l'Informatique"].map((title, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', marginBottom: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: ['#3B7FE1','#f59e0b','#10b981'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📄</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>IA {[94,88,91][i]} · validé</div>
                    </div>
                    <div style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(16,185,129,0.2)', color: '#34d399', fontWeight: 600 }}>✓</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '12px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '24px' }}>
                {[['📄','5 120','Docs'],['🎓','47K+','Étudiants'],['🤖','94%','Score IA']].map(([icon,v,l],i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px' }}>{icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{v}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', top: '-18px', right: '-18px', background: '#fff', borderRadius: '16px', padding: '12px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid rgba(59,127,225,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🇧🇫</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text)' }}>Ministère MENAPLN</div>
                <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>Certifié & supervisé</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fromRight} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            transition={t(0.2, 0.7)}>
            <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', marginBottom: '20px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>À propos</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--color-text)', marginBottom: '20px', letterSpacing: '-0.5px' }}>
              Conçu pour l'environnement<br />académique burkinabè
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '24px' }}>
              LibraFlow est la première plateforme nationale de partage de ressources pédagogiques au Burkina Faso. Chaque document est soumis à une analyse automatique par intelligence artificielle avant publication, garantissant qualité et fiabilité.
            </p>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '32px' }}>
              Sous la supervision du Ministère de l'Éducation Nationale (MENAPLN), le réseau connecte toutes les universités nationales en un écosystème cohérent et sécurisé.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Accès gratuit pour tous les étudiants burkinabè','Contenu validé par IA et supervisé par les universités','12 établissements connectés au réseau national'].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>✓</div>
                  <span style={{ fontSize: '14px', color: 'var(--color-text)', fontWeight: 500 }}>{p}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ── Fonctionnalités ──
      ══════════════════════════════════════════════════════ */}
      <section id="fonctionnalites" style={{ padding: '100px 5%', background: 'linear-gradient(180deg,#f8faff 0%,#fff 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <motion.div
            variants={fromBottom} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            transition={t(0, 0.6)}
            style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', marginBottom: '16px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fonctionnalités</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Une plateforme complète pensée pour l'écosystème académique national.
            </p>
          </motion.div>

          <motion.div
            variants={staggerGrid} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <motion.div key={i} variants={staggerItem}
                style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--color-border)', background: '#fff', transition: 'transform 0.2s,box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(59,127,225,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ height: '120px', background: f.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ position: 'absolute', bottom: '-30px', left: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>{f.icon}</span>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>{f.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ── Pour chaque acteur ──
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <motion.div
            variants={fromBottom} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            transition={t(0, 0.6)}
            style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, padding: '5px 14px', borderRadius: '100px', marginBottom: '16px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Pour chaque acteur</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '14px', letterSpacing: '-0.5px' }}>
              Une plateforme adaptée à votre rôle
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Étudiant, professeur ou institution — LibraFlow s'adapte à vos besoins.
            </p>
          </motion.div>

          <motion.div
            variants={staggerGrid} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '28px' }}>
            {actors.map((a, i) => (
              <motion.div key={i} variants={staggerItem}
                style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: a.gradient, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', backdropFilter: 'blur(8px)' }}>{a.emoji}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{a.role}</div>
                </div>
                <div style={{ padding: '24px 28px', flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {a.points.map((p, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700 }}>✓</div>
                        <span style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={a.link} style={{ display: 'block', textAlign: 'center', marginTop: 'auto', padding: '12px 20px', borderRadius: '12px', background: 'var(--color-primary)', color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >{a.cta} →</Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ── CTA final ──
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '100px 5%', background: 'linear-gradient(135deg,#0f172a 0%,#1e3a6e 50%,#1A56DB 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,127,225,0.4) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <motion.div
            variants={fromBottom} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            transition={t(0, 0.6)}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🚀</div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '18px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              Prêt à rejoindre le réseau<br />académique national ?
            </h2>
          </motion.div>

          <motion.p
            variants={fromBottom} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            transition={t(0.15, 0.6)}
            style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', lineHeight: 1.7 }}>
            Plus de 47 000 étudiants font déjà confiance à LibraFlow.<br />
            Rejoignez la communauté académique burkinabè.
          </motion.p>

          <motion.div
            variants={fromBottom} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-60px' }}
            transition={t(0.30, 0.6)}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/inscription" style={{ padding: '16px 40px', borderRadius: '12px', background: '#fff', color: 'var(--color-primary)', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              Créer mon compte gratuitement
            </Link>
            <Link to="/login" style={{ padding: '16px 36px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: '15px', fontWeight: 600, textDecoration: 'none', background: 'rgba(255,255,255,0.08)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
              Se connecter
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" style={{ background: '#0f172a', padding: '60px 5% 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📖</div>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>LibraFlow</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '20px' }}>
                Plateforme nationale de partage de ressources pédagogiques, sous la supervision du Ministère de l'Éducation Nationale du Burkina Faso.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '8px' }}><span>📧</span> contact@libraflow.bf</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '8px' }}><span>📍</span> Ouagadougou, Burkina Faso</div>
              </div>
            </div>
            {[
              { title: 'Plateforme', links: ['Accueil','À propos','Fonctionnalités','Contact'] },
              { title: 'Compte',    links: ['Connexion','Inscription Étudiant','Inscription Professeur','Inscription Université'] },
              { title: 'Légal',     links: ["Conditions d'utilisation",'Politique de confidentialité','Mentions légales'] },
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
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 LibraFlow · Ministère de l'Éducation Nationale du Burkina Faso</div>
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
