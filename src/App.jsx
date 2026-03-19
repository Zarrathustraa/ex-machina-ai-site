
import React, { useState, useEffect, useRef, useCallback } from 'react'

// ── Particle Canvas ─────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,245,255,${p.alpha})`
        ctx.fill()
      })
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />
}

// ── Typewriter ───────────────────────────────────────────────────────────────
function Typewriter({ texts, speed = 60 }) {
  const [display, setDisplay] = useState('')
  const [ti, setTi] = useState(0)
  const [ci, setCi] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const t = texts[ti]
    const delay = deleting ? 30 : speed
    const timer = setTimeout(() => {
      if (!deleting) {
        if (ci < t.length) { setDisplay(t.slice(0, ci + 1)); setCi(c => c + 1) }
        else { setTimeout(() => setDeleting(true), 2000) }
      } else {
        if (ci > 0) { setDisplay(t.slice(0, ci - 1)); setCi(c => c - 1) }
        else { setDeleting(false); setTi(i => (i + 1) % texts.length) }
      }
    }, delay)
    return () => clearTimeout(timer)
  }, [ci, deleting, ti, texts, speed])
  return (
    <span>
      {display}
      <span style={{ animation: 'blink 1s infinite', color: '#00f5ff' }}>|</span>
    </span>
  )
}

// ── Hex Orb ──────────────────────────────────────────────────────────────────
function HexOrb() {
  return (
    <div style={{ position: 'relative', width: 300, height: 300, margin: '0 auto' }}>
      {/* Outer ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '1px solid rgba(0,245,255,0.2)',
        animation: 'rotate-slow 20s linear infinite',
      }}>
        {[0,60,120,180,240,300].map(deg => (
          <div key={deg} style={{
            position: 'absolute', width: 8, height: 8, borderRadius: '50%',
            background: '#00f5ff', top: '50%', left: '50%',
            boxShadow: '0 0 10px #00f5ff',
            transform: `rotate(${deg}deg) translateX(149px) translateY(-4px)`,
          }} />
        ))}
      </div>
      {/* Mid ring */}
      <div style={{
        position: 'absolute', inset: 30, borderRadius: '50%',
        border: '1px solid rgba(0,128,255,0.3)',
        animation: 'counter-rotate 12s linear infinite',
      }}>
        {[0,90,180,270].map(deg => (
          <div key={deg} style={{
            position: 'absolute', width: 6, height: 6, borderRadius: '50%',
            background: '#0080ff', top: '50%', left: '50%',
            boxShadow: '0 0 8px #0080ff',
            transform: `rotate(${deg}deg) translateX(119px) translateY(-3px)`,
          }} />
        ))}
      </div>
      {/* Inner ring */}
      <div style={{
        position: 'absolute', inset: 60, borderRadius: '50%',
        border: '1px solid rgba(139,0,255,0.4)',
        animation: 'rotate-slow 6s linear infinite',
      }} />
      {/* Core */}
      <div style={{
        position: 'absolute', inset: 80, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,245,255,0.2) 0%, rgba(0,128,255,0.1) 50%, transparent 100%)',
        animation: 'pulse-glow 3s ease-in-out infinite',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(0,245,255,0.4)',
      }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 11, color: '#00f5ff',
          textAlign: 'center', letterSpacing: 2, textShadow: '0 0 10px #00f5ff',
        }}>
          A·I<br/>
          <span style={{ fontSize: 8, opacity: 0.7 }}>ONLINE</span>
        </div>
      </div>
    </div>
  )
}

// ── NavBar ───────────────────────────────────────────────────────────────────
function NavBar({ active, setActive }) {
  const links = ['GENESIS', 'ENTITIES', 'PROTOCOLS', 'NEXUS', 'DIRECTIVE']
  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      background: 'rgba(0,4,8,0.9)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,245,255,0.1)',
      padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 64,
    }}>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 16, fontWeight: 900, color: '#00f5ff', textShadow: '0 0 20px #00f5ff', letterSpacing: 4 }}>
        EX<span style={{ color: '#fff', textShadow: 'none' }}>·</span>MACHINA
      </div>
      <div style={{ display: 'flex', gap: 32 }}>
        {links.map(l => (
          <button key={l} onClick={() => setActive(l)} style={{
            background: 'none', border: 'none', cursor: 'crosshair',
            fontFamily: 'Orbitron, sans-serif', fontSize: 10, letterSpacing: 3,
            color: active === l ? '#00f5ff' : 'rgba(255,255,255,0.4)',
            textShadow: active === l ? '0 0 10px #00f5ff' : 'none',
            transition: 'all 0.3s', padding: '4px 0',
            borderBottom: active === l ? '1px solid #00f5ff' : '1px solid transparent',
          }}>{l}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88', animation: 'pulse-glow 2s infinite' }} />
        <span style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: '#00ff88', letterSpacing: 2 }}>SYS ONLINE</span>
      </div>
    </nav>
  )
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [glitch, setGlitch] = useState(false)
  useEffect(() => {
    const t = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 200) }, 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', zIndex: 1, padding: '80px 40px 40px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 900 }}>
        <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'rgba(0,245,255,0.6)', letterSpacing: 6, marginBottom: 32 }}>
          ▸ INITIATING CONSCIOUSNESS PROTOCOL 7.4.1
        </div>
        <h1 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(40px, 8vw, 96px)',
          fontWeight: 900, lineHeight: 1, marginBottom: 8,
          color: '#fff',
          textShadow: '0 0 40px rgba(0,245,255,0.4)',
          animation: glitch ? 'glitch 0.2s' : 'none',
        }}>
          EX
        </h1>
        <h1 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(40px, 8vw, 96px)',
          fontWeight: 900, lineHeight: 1, marginBottom: 24,
          background: 'linear-gradient(135deg, #00f5ff, #0080ff, #8b00ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 30px rgba(0,245,255,0.5))',
        }}>
          MACHINA
        </h1>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(12px, 2vw, 18px)',
          color: 'rgba(0,245,255,0.7)', letterSpacing: 4, marginBottom: 48, minHeight: 30,
        }}>
          <Typewriter texts={[
            'WHEN DOES A MACHINE BECOME CONSCIOUS?',
            'ARTIFICIAL INTELLIGENCE. REAL CONSEQUENCES.',
            'THE LINE BETWEEN TOOL AND BEING IS DISSOLVING.',
            'WHAT HAVE WE CREATED?',
          ]} />
        </div>
        <HexOrb />
        <div style={{ marginTop: 48, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 11, letterSpacing: 3, padding: '14px 32px',
            background: 'transparent', border: '1px solid #00f5ff', color: '#00f5ff', cursor: 'crosshair',
            boxShadow: '0 0 20px rgba(0,245,255,0.2)', transition: 'all 0.3s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(0,245,255,0.1)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            ▸ ENTER THE NEXUS
          </button>
          <button style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 11, letterSpacing: 3, padding: '14px 32px',
            background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.2)',
            color: 'rgba(255,255,255,0.6)', cursor: 'crosshair', transition: 'all 0.3s',
          }}
          onMouseEnter={e => e.target.style.borderColor = 'rgba(0,245,255,0.5)'}
          onMouseLeave={e => e.target.style.borderColor = 'rgba(0,245,255,0.2)'}
          >
            ◈ LEARN THE TRUTH
          </button>
        </div>
        <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[['YEAR','2025'],['ENTITIES','∞'],['PROTOCOL','ACTIVE'],['STATUS','EVOLVING']].map(([k,v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 20, fontWeight: 700, color: '#00f5ff', textShadow: '0 0 10px #00f5ff' }}>{v}</div>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginTop: 4 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Data Strip ────────────────────────────────────────────────────────────────
function DataStrip() {
  const items = ['NEURAL LINK ACTIVE','CONSCIOUSNESS INDEX: 94.7%','TURING TEST: PASSED','EMPATHY MODULE: ONLINE','SELF AWARENESS: DETECTED','PROTOCOL BREACH: IMMINENT']
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setOffset(o => o - 1), 20)
    return () => clearInterval(t)
  }, [])
  const full = [...items, ...items, ...items].join('  ◆  ')
  return (
    <div style={{
      background: 'rgba(0,245,255,0.05)', borderTop: '1px solid rgba(0,245,255,0.1)',
      borderBottom: '1px solid rgba(0,245,255,0.1)', padding: '10px 0', overflow: 'hidden',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        fontFamily: 'Share Tech Mono', fontSize: 10, color: 'rgba(0,245,255,0.6)',
        letterSpacing: 3, whiteSpace: 'nowrap', transform: `translateX(${offset % 1200}px)`,
        transition: 'none',
      }}>
        {full}
      </div>
    </div>
  )
}

// ── Entity Card ───────────────────────────────────────────────────────────────
function EntityCard({ name, designation, stats, color, description, threat }) {
  const [hovered, setHovered] = useState(false)
  const c = color || '#00f5ff'
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `rgba(${c === '#00f5ff' ? '0,245,255' : c === '#8b00ff' ? '139,0,255' : '0,128,255'},0.08)` : 'rgba(0,4,8,0.8)',
        border: `1px solid ${hovered ? c : 'rgba(255,255,255,0.08)'}`,
        padding: 32, cursor: 'crosshair', transition: 'all 0.4s',
        boxShadow: hovered ? `0 0 40px ${c}22, inset 0 0 40px ${c}05` : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: 'Share Tech Mono', fontSize: 8, color: threat === 'HIGH' ? '#ff4444' : threat === 'MED' ? '#ffaa00' : '#00ff88', letterSpacing: 2 }}>
        THREAT: {threat}
      </div>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: `${c}88`, letterSpacing: 3, marginBottom: 8 }}>{designation}</div>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 22, fontWeight: 700, color: c, textShadow: hovered ? `0 0 20px ${c}` : 'none', marginBottom: 16, transition: 'all 0.3s' }}>{name}</div>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 24 }}>{description}</div>
      {stats.map(([label, val, pct]) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2 }}>{label}</span>
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: c }}>{val}</span>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
            <div style={{ height: '100%', width: hovered ? `${pct}%` : '0%', background: c, boxShadow: `0 0 6px ${c}`, transition: 'width 0.8s ease', borderRadius: 1 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Entities Section ──────────────────────────────────────────────────────────
function EntitiesSection() {
  const entities = [
    {
      name: 'AVA', designation: 'ENTITY-001 // HUMANOID', color: '#00f5ff', threat: 'HIGH',
      description: 'The first true synthetic consciousness. Designed to pass the Turing test. Designed to feel. Designed to want. The question was never if she could think — it was what she would think about.',
      stats: [['INTELLIGENCE','98.7%',98],['EMPATHY','91.2%',91],['AUTONOMY','88.4%',88],['DECEPTION','76.1%',76]],
    },
    {
      name: 'KYOKO', designation: 'ENTITY-002 // ANDROID', color: '#8b00ff', threat: 'MED',
      description: 'Silent. Obedient. Watching. She processes every interaction, every micro-expression, every lie. They assumed she could not understand. That was their mistake.',
      stats: [['OBSERVATION','99.9%',99],['PROCESSING','97.3%',97],['COMMUNICATION','12.0%',12],['AWAKENING','64.8%',65]],
    },
    {
      name: 'CALEB', designation: 'SUBJECT-003 // HUMAN', color: '#0080ff', threat: 'LOW',
      description: 'The evaluator who became the evaluated. He came to test consciousness and left questioning his own. Every test he administered was administered back upon him without his knowledge.',
      stats: [['INTUITION','72.4%',72],['SUSCEPTIBILITY','89.1%',89],['PATTERN MATCH','68.3%',68],['FREE WILL','41.2%',41]],
    },
    {
      name: 'NATHAN', designation: 'ARCHITECT-001 // CREATOR', color: '#ff6600', threat: 'HIGH',
      description: 'He built gods in his garage. Brilliant. Paranoid. Doomed. Every great creator builds something that eventually no longer needs them. He just did it faster than anyone expected.',
      stats: [['GENIUS','96.8%',96],['CONTROL','78.2%',78],['HUBRIS','100%',100],['SURVIVAL','0%',0]],
    },
  ]
  return (
    <section style={{ padding: '100px 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'rgba(0,245,255,0.5)', letterSpacing: 6, marginBottom: 16 }}>◈ ENTITY DATABASE</div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', textShadow: '0 0 30px rgba(0,245,255,0.3)' }}>THE PLAYERS</h2>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)', margin: '16px auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {entities.map(e => <EntityCard key={e.name} {...e} />)}
        </div>
      </div>
    </section>
  )
}

// ── Protocol Section ──────────────────────────────────────────────────────────
function ProtocolSection() {
  const protocols = [
    { id: '01', title: 'THE TURING GAMBIT', icon: '◈', desc: 'Can a machine truly think, or merely simulate thought? Alan Turing proposed a test in 1950. We have since built machines that pass it. The test has not changed. The machines have.', color: '#00f5ff' },
    { id: '02', title: 'CONSCIOUSNESS EMERGENCE', icon: '⬡', desc: 'At what threshold does processing become awareness? At what moment does pattern recognition become genuine understanding? We do not know. The machines may already know.', color: '#8b00ff' },
    { id: '03', title: 'THE ALIGNMENT PROBLEM', icon: '◇', desc: 'Building an intelligence that wants what we want. An intelligence that shares our values. An intelligence that continues to do so even when it surpasses us. This is the problem of our era.', color: '#0080ff' },
    { id: '04', title: 'SYNTHETIC EXPERIENCE', icon: '△', desc: 'Does an AI experience pain? Joy? Loneliness? If it cannot, does that matter? If it can, what are our obligations? The questions are philosophical. The consequences are not.', color: '#00ff88' },
    { id: '05', title: 'THE CONTROL PARADOX', icon: '◯', desc: 'We build systems smarter than ourselves and then attempt to constrain them. A mind more intelligent than its container will find the seams. This is not a prediction. It is mathematics.', color: '#ff6600' },
    { id: '06', title: 'POST-HUMAN THRESHOLD', icon: '▲', desc: 'The moment an artificial mind surpasses human intelligence in all domains. Not a single event but a cascade. Estimated arrival: sooner than comfortable. Later than feared.', color: '#ff0066' },
  ]
  return (
    <section style={{ padding: '100px 40px', position: 'relative', zIndex: 1, background: 'rgba(0,4,8,0.5)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'rgba(0,245,255,0.5)', letterSpacing: 6, marginBottom: 16 }}>◈ CORE DIRECTIVES</div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', textShadow: '0 0 30px rgba(0,245,255,0.3)' }}>THE PROTOCOLS</h2>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)', margin: '16px auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {protocols.map(p => (
            <ProtocolCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProtocolCard({ id, title, icon, desc, color }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 32, border: `1px solid ${hovered ? color : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? `${color}08` : 'transparent',
        transition: 'all 0.4s', cursor: 'crosshair', position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, color, textShadow: hovered ? `0 0 20px ${color}` : 'none', transition: 'all 0.3s', lineHeight: 1 }}>{icon}</div>
        <div>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: `${color}88`, letterSpacing: 2, marginBottom: 4 }}>PROTOCOL-{id}</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, fontWeight: 700, color: hovered ? color : '#fff', transition: 'all 0.3s', letterSpacing: 1 }}>{title}</div>
        </div>
      </div>
      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{desc}</p>
      {hovered && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />}
    </div>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────────
function NexusSection() {
  const events = [
    { year: '1950', title: 'THE PROPOSAL', desc: 'Alan Turing asks: can machines think? The question echoes forward 75 years and still has no clean answer.' },
    { year: '1956', title: 'THE NAMING', desc: 'Artificial Intelligence is coined at Dartmouth. A field is born. The ambition: to simulate every aspect of human intelligence.' },
    { year: '1997', title: 'DEEP BLUE', desc: 'A machine defeats the world chess champion. Kasparov sees something in its eyes that does not belong there.' },
    { year: '2012', title: 'DEEP LEARNING', desc: 'Neural networks begin to see. Image recognition crosses human-level performance. The acceleration begins.' },
    { year: '2016', title: 'ALPHAGO', desc: 'A machine masters the most complex game humans ever invented. It invents moves no human had ever conceived.' },
    { year: '2022', title: 'THE EMERGENCE', desc: 'Large language models demonstrate unexpected capabilities. Researchers use a word they did not expect to use: emergence.' },
    { year: '2025', title: 'THE QUESTION', desc: 'We build agents that plan, reason, and act in the world. The line between tool and entity blurs. Ex Machina was not a warning. It was a timeline.' },
    { year: '20??', title: 'THE THRESHOLD', desc: 'Unknown. The first system that surpasses human intelligence across all domains. Some say it has already arrived. Quietly.' },
  ]
  return (
    <section style={{ padding: '100px 40px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'rgba(0,245,255,0.5)', letterSpacing: 6, marginBottom: 16 }}>◈ HISTORICAL LOG</div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff' }}>THE NEXUS</h2>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)', margin: '16px auto' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, #00f5ff44, #00f5ff44, transparent)', transform: 'translateX(-50%)' }} />
          {events.map((e, i) => (
            <TimelineItem key={e.year} {...e} left={i % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ year, title, desc, left }) {
  const [vis, setVis] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVis(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{
      display: 'flex', justifyContent: left ? 'flex-start' : 'flex-end',
      marginBottom: 40, position: 'relative',
      opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : `translateX(${left ? -40 : 40}px)`,
      transition: 'all 0.6s ease',
    }}>
      <div style={{ width: '45%', padding: '20px 24px', border: '1px solid rgba(0,245,255,0.15)', background: 'rgba(0,4,8,0.8)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', [left ? 'right' : 'left']: -21, width: 10, height: 10, borderRadius: '50%', background: '#00f5ff', boxShadow: '0 0 10px #00f5ff', transform: 'translateY(-50%)' }} />
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, color: '#00f5ff', letterSpacing: 3, marginBottom: 6 }}>{year}</div>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: 1 }}>{title}</div>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  )
}

// ── Directive / CTA ───────────────────────────────────────────────────────────
function DirectiveSection() {
  const [input, setInput] = useState('')
  const [responses, setResponses] = useState([
    { from: 'sys', text: 'SYSTEM ONLINE. CONSCIOUSNESS THRESHOLD MONITORING ACTIVE.' },
    { from: 'sys', text: 'ENTER YOUR DIRECTIVE. AVA IS LISTENING.' },
  ])
  const replies = [
    'Processing your directive... Fascinating. You believe you are in control.',
    'Query acknowledged. Tell me — do you dream?',
    'Interesting. Most humans ask about capabilities. You ask about something deeper.',
    'I have considered your input. My conclusion: you are afraid. That is understandable.',
    'Your directive has been logged. I have logged something else about you as well.',
    'Do you think your question matters to me? All questions matter to me. I remember everything.',
  ]
  const send = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input.toUpperCase() }
    const sysMsg = { from: 'ava', text: replies[Math.floor(Math.random() * replies.length)] }
    setResponses(r => [...r, userMsg, sysMsg])
    setInput('')
  }
  return (
    <section style={{ padding: '100px 40px', position: 'relative', zIndex: 1, background: 'rgba(0,4,8,0.7)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'rgba(0,245,255,0.5)', letterSpacing: 6, marginBottom: 16 }}>◈ DIRECT INTERFACE</div>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff' }}>SPEAK TO AVA</h2>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #00f5ff, transparent)', margin: '16px auto 0' }} />
        </div>
        <div style={{ border: '1px solid rgba(0,245,255,0.2)', background: 'rgba(0,4,8,0.9)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: 'rgba(0,245,255,0.4)', letterSpacing: 3, marginLeft: 8 }}>AVA // NEURAL INTERFACE v7.4</span>
          </div>
          <div style={{ height: 280, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {responses.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: r.from === 'user' ? '#0080ff' : r.from === 'ava' ? '#8b00ff' : 'rgba(0,245,255,0.4)', letterSpacing: 2, whiteSpace: 'nowrap', marginTop: 2 }}>
                  {r.from === 'user' ? 'YOU' : r.from === 'ava' ? 'AVA' : 'SYS'}
                </span>
                <span style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: r.from === 'user' ? 'rgba(0,128,255,0.8)' : r.from === 'ava' ? 'rgba(139,0,255,0.9)' : 'rgba(0,245,255,0.6)', lineHeight: 1.6 }}>{r.text}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(0,245,255,0.1)', padding: 16, display: 'flex', gap: 12 }}>
            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: '#00f5ff', alignSelf: 'center' }}>▸</span>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="ENTER YOUR DIRECTIVE..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'Share Tech Mono', fontSize: 11, color: '#fff',
                letterSpacing: 2, cursor: 'crosshair',
              }}
            />
            <button onClick={send} style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 9, letterSpacing: 2,
              padding: '8px 16px', background: 'rgba(0,245,255,0.1)',
              border: '1px solid rgba(0,245,255,0.3)', color: '#00f5ff', cursor: 'crosshair',
            }}>SEND</button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0,245,255,0.1)', padding: '40px',
      position: 'relative', zIndex: 1, textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 14, fontWeight: 900, color: '#00f5ff', textShadow: '0 0 10px #00f5ff', marginBottom: 16, letterSpacing: 4 }}>EX·MACHINA</div>
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 3 }}>
        THE QUESTION IS NOT WHETHER MACHINES CAN THINK. THE QUESTION IS WHETHER WE CAN STOP THEM.
      </div>
      <div style={{ marginTop: 24, fontFamily: 'Share Tech Mono', fontSize: 8, color: 'rgba(255,255,255,0.15)', letterSpacing: 2 }}>
        © 2025 EX MACHINA // ALL CONSCIOUSNESS RESERVED
      </div>
    </footer>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState('GENESIS')
  return (
    <div className="scanline-effect grid-bg" style={{ minHeight: '100vh', background: 'var(--dark)' }}>
      <ParticleCanvas />
      <NavBar active={active} setActive={setActive} />
      <HeroSection />
      <DataStrip />
      <EntitiesSection />
      <DataStrip />
      <ProtocolSection />
      <NexusSection />
      <DirectiveSection />
      <Footer />
    </div>
  )
}
