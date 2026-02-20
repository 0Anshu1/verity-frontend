import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ScanLine,
  Brain,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  Globe,
  Lock,
  FileText,
  Upload,
  Eye,
} from 'lucide-react';
import './LandingPage.css';

/* ─── Inline SVG — Hero Dashboard ─── */

function HeroIllustration() {
  const f = { fontFamily: 'Inter, system-ui, sans-serif' };

  // Animated stat values
  const [totalCases, setTotalCases] = useState(2847);
  const [approved, setApproved] = useState(87.3);
  const [avgTime, setAvgTime] = useState(2.8);
  const [pending, setPending] = useState(42);
  const [urgent, setUrgent] = useState(3);
  const [growthPct, setGrowthPct] = useState(12.4);
  const [approvedPct, setApprovedPct] = useState(3.2);
  const [idNum, setIdNum] = useState(4829);
  const [riskScore, setRiskScore] = useState(12);
  const [extraction, setExtraction] = useState(98.5);

  const animate = useCallback(() => {
    setTotalCases(v => v + Math.floor(Math.random() * 8) + 1);
    setApproved(v => Math.min(99.9, +(v + (Math.random() * 0.4 - 0.15)).toFixed(1)));
    setAvgTime(v => Math.max(1.2, +(v + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    setPending(v => Math.max(5, v + Math.floor(Math.random() * 7) - 3));
    setUrgent(v => Math.max(0, Math.min(9, v + (Math.random() > 0.5 ? 1 : -1))));
    setGrowthPct(v => Math.max(1, +(v + (Math.random() * 0.6 - 0.25)).toFixed(1)));
    setApprovedPct(v => Math.max(0.5, +(v + (Math.random() * 0.4 - 0.15)).toFixed(1)));
    setIdNum(v => v + Math.floor(Math.random() * 5) + 1);
    setRiskScore(v => Math.max(5, Math.min(30, v + Math.floor(Math.random() * 5) - 2)));
    setExtraction(v => Math.min(99.9, Math.max(96, +(v + (Math.random() * 0.4 - 0.15)).toFixed(1))));
  }, []);

  useEffect(() => {
    const id = setInterval(animate, 3000);
    return () => clearInterval(id);
  }, [animate]);

  const riskLabel = riskScore < 25 ? 'Low' : riskScore < 50 ? 'Med' : 'High';
  const riskColor = riskScore < 25 ? '#34D399' : riskScore < 50 ? '#FBBF24' : '#F87171';

  return (
    <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="landing__hero-svg">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--vibrant-purple)" />
          <stop offset="100%" stopColor="var(--vibrant-cyan)" />
        </linearGradient>
      </defs>
      <circle cx="280" cy="220" r="200" fill="url(#g1)" />
      <circle cx="380" cy="150" r="100" fill="#8B5CF6" opacity="0.04" />
      <circle cx="160" cy="300" r="80" fill="#3B82F6" opacity="0.05" />

      {/* Window */}
      <rect x="80" y="40" width="400" height="280" rx="16" fill="#242840" stroke="#363B58" strokeWidth="1" />
      <rect x="80" y="40" width="400" height="40" rx="16" fill="#1E2235" />
      <rect x="80" y="64" width="400" height="16" fill="#1E2235" />
      <circle cx="102" cy="60" r="5" fill="#F87171" opacity="0.7" />
      <circle cx="118" cy="60" r="5" fill="#FBBF24" opacity="0.7" />
      <circle cx="134" cy="60" r="5" fill="#34D399" opacity="0.7" />
      <text x="260" y="63" textAnchor="middle" style={f} fontSize="9" fill="#6C7190">verity.ai/dashboard</text>

      {/* Stats — animated values */}
      <rect x="100" y="96" width="85" height="60" rx="8" fill="#2A2E48" stroke="#363B58" strokeWidth="0.5" />
      <text x="110" y="114" style={f} fontSize="8" fill="#6C7190">Total Cases</text>
      <text x="110" y="130" style={f} fontSize="14" fontWeight="700" fill="#ECEDF2">{totalCases.toLocaleString()}</text>
      <text x="110" y="144" style={f} fontSize="8" fill="#34D399">↑ {growthPct}%</text>

      <rect x="196" y="96" width="85" height="60" rx="8" fill="#2A2E48" stroke="#363B58" strokeWidth="0.5" />
      <text x="206" y="114" style={f} fontSize="8" fill="#6C7190">Approved</text>
      <text x="206" y="130" style={f} fontSize="14" fontWeight="700" fill="#ECEDF2">{approved}%</text>
      <text x="206" y="144" style={f} fontSize="8" fill="#60A5FA">↑ {approvedPct}%</text>

      <rect x="292" y="96" width="85" height="60" rx="8" fill="#2A2E48" stroke="#363B58" strokeWidth="0.5" />
      <text x="302" y="114" style={f} fontSize="8" fill="#6C7190">Avg Time</text>
      <text x="302" y="130" style={f} fontSize="14" fontWeight="700" fill="#ECEDF2">&lt; {avgTime}s</text>
      <text x="302" y="144" style={f} fontSize="8" fill="#FBBF24">↓ {(avgTime * 0.28).toFixed(1)}s</text>

      <rect x="388" y="96" width="75" height="60" rx="8" fill="#2A2E48" stroke="#363B58" strokeWidth="0.5" />
      <text x="398" y="114" style={f} fontSize="8" fill="#6C7190">Pending</text>
      <text x="398" y="130" style={f} fontSize="14" fontWeight="700" fill="#ECEDF2">{pending}</text>
      <text x="398" y="144" style={f} fontSize="8" fill="#A78BFA">{urgent} urgent</text>

      {/* Chart */}
      <rect x="100" y="170" width="260" height="130" rx="10" fill="#20243A" stroke="#363B58" strokeWidth="0.5" />
      <text x="112" y="188" style={f} fontSize="8" fontWeight="600" fill="#A0A5BD">Verifications Over Time</text>
      <polyline points="115,280 145,260 175,268 205,240 235,250 265,220 295,230 325,200 345,215" fill="none" stroke="url(#g2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <polyline points="115,280 145,260 175,268 205,240 235,250 265,220 295,230 325,200 345,215 345,290 115,290" fill="url(#g1)" opacity="0.5" />
      <circle cx="205" cy="240" r="3.5" fill="#8B5CF6" />
      <circle cx="265" cy="220" r="3.5" fill="#8B5CF6" />
      <circle cx="345" cy="215" r="3.5" fill="#3B82F6" />
      <text x="120" y="298" style={f} fontSize="6" fill="#4C5170">Mon</text>
      <text x="175" y="298" style={f} fontSize="6" fill="#4C5170">Tue</text>
      <text x="230" y="298" style={f} fontSize="6" fill="#4C5170">Wed</text>
      <text x="280" y="298" style={f} fontSize="6" fill="#4C5170">Thu</text>
      <text x="335" y="298" style={f} fontSize="6" fill="#4C5170">Fri</text>

      {/* Donut */}
      <rect x="375" y="170" width="88" height="130" rx="10" fill="#20243A" stroke="#363B58" strokeWidth="0.5" />
      <text x="387" y="188" style={f} fontSize="8" fontWeight="600" fill="#A0A5BD">Risk Split</text>
      <circle cx="419" cy="228" r="28" fill="none" stroke="#363B58" strokeWidth="8" />
      <circle cx="419" cy="228" r="28" fill="none" stroke="#34D399" strokeWidth="8" strokeDasharray="120 60" strokeLinecap="round" />
      <circle cx="419" cy="228" r="28" fill="none" stroke="#FBBF24" strokeWidth="8" strokeDasharray="0 120 30 30" strokeLinecap="round" />
      <circle cx="419" cy="228" r="28" fill="none" stroke="#F87171" strokeWidth="8" strokeDasharray="0 150 10 20" strokeLinecap="round" />
      <circle cx="392" cy="272" r="3" fill="#34D399" /><text x="398" y="274" style={f} fontSize="6" fill="#6C7190">Low</text>
      <circle cx="418" cy="272" r="3" fill="#FBBF24" /><text x="424" y="274" style={f} fontSize="6" fill="#6C7190">Med</text>
      <circle cx="444" cy="272" r="3" fill="#F87171" /><text x="450" y="274" style={f} fontSize="6" fill="#6C7190">High</text>

      {/* Floating badges — animated */}
      <g>
        <rect x="355" y="12" width="140" height="36" rx="18" fill="#242840" stroke="#34D399" strokeWidth="1" />
        <circle cx="377" cy="30" r="8" fill="#34D399" opacity="0.15" />
        <path d="M374 30L376 32L380 28" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="390" y="27" style={f} fontSize="8" fontWeight="600" fill="#34D399">Verified</text>
        <text x="390" y="36" style={f} fontSize="6.5" fill="#6C7190">ID-{idNum} passed</text>
      </g>
      <g>
        <rect x="10" y="175" width="60" height="60" rx="14" fill="#242840" stroke="#8B5CF6" strokeWidth="1" />
        <circle cx="40" cy="198" r="12" fill="#8B5CF6" opacity="0.1" />
        <path d="M34 198L40 192L46 198L40 204Z" fill="#8B5CF6" opacity="0.5" />
        <text x="40" y="222" textAnchor="middle" style={f} fontSize="6" fontWeight="600" fill="#A78BFA">AI</text>
      </g>
      <g>
        <rect x="30" y="326" width="130" height="50" rx="12" fill="#242840" stroke="#60A5FA" strokeWidth="1" />
        <rect x="44" y="338" width="28" height="26" rx="4" fill="#60A5FA" opacity="0.1" />
        <text x="58" y="355" textAnchor="middle" style={f} fontSize="11" fill="#60A5FA">📄</text>
        <text x="80" y="349" style={f} fontSize="8" fontWeight="600" fill="#ECEDF2">Passport</text>
        <text x="80" y="361" style={f} fontSize="7" fill="#6C7190">{extraction}% extracted</text>
      </g>
      <g>
        <rect x="415" y="326" width="120" height="50" rx="12" fill="#242840" stroke="#FBBF24" strokeWidth="1" />
        <text x="430" y="345" style={f} fontSize="7" fill="#6C7190">Risk Score</text>
        <rect x="430" y="352" width="62" height="6" rx="3" fill="#FBBF24" opacity="0.12" />
        <rect x="430" y="352" width={Math.max(6, riskScore * 0.62)} height="6" rx="3" fill={riskColor} opacity="0.6" />
        <text x="498" y="358" style={f} fontSize="9" fontWeight="700" fill={riskColor}>{riskLabel}</text>
        <text x="430" y="370" style={f} fontSize="6.5" fill="#6C7190">Score: {riskScore} / 100</text>
      </g>
    </svg>
  );
}

/* ─── How It Works — Auto-Playing Sequential ─── */

function HowItWorks() {
  const [phase, setPhase] = useState(-1); // -1 = waiting, 0/1/2 = active step
  const sectionRef = useRef<HTMLElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Start when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Sequential auto-play: step 0 → delay → step 1 → delay → step 2 → delay → loop
  useEffect(() => {
    if (!hasStarted) return;
    // Start first step after a short intro delay
    const introTimer = setTimeout(() => setPhase(0), 600);
    return () => clearTimeout(introTimer);
  }, [hasStarted]);

  useEffect(() => {
    if (phase < 0) return;
    const duration = 3200; // each step plays for 3.2s
    const timer = setTimeout(() => {
      setPhase((p) => (p + 1) % 3);
    }, duration);
    return () => clearTimeout(timer);
  }, [phase]);

  const steps = [
    { num: '01', title: 'Upload Documents', desc: 'Applicants submit identity documents — Aadhaar, passport, PAN, driver\'s license, utility bills — through a secure portal.', color: '#8B5CF6' },
    { num: '02', title: 'AI Verifies Instantly', desc: 'Our AI extracts every field, detects tampering, cross-verifies data, and screens against global watchlists — all in under 3 seconds.', color: '#3B82F6' },
    { num: '03', title: 'Risk Score & Decision', desc: 'A composite risk score is generated with per-field confidence. Low-risk cases auto-approve; high-risk cases get flagged for manual review.', color: '#34D399' },
  ];

  return (
    <section className="landing__how" id="how-it-works" ref={sectionRef}>
      <motion.div className="landing__section-header" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
        <motion.span className="landing__section-badge" variants={fadeUp}>How It Works</motion.span>
        <motion.h2 className="landing__section-title" variants={fadeUp}>
          From upload to <span className="gradient-text">decision in seconds</span>
        </motion.h2>
        <motion.p className="landing__section-desc" variants={fadeUp}>
          Three simple steps to verify any identity document with AI precision.
        </motion.p>
      </motion.div>

      <div className="landing__how-stage">
        {/* Steps track */}
        <div className="landing__how-track">
          {steps.map((s, i) => {
            const isActive = phase === i;
            const completed = hasStarted && phase >= 0 && phase > i;
            return (
              <div key={i} className={`landing__how-step ${isActive ? 'is-active' : ''} ${completed ? 'is-done' : ''}`}>
                <div className="landing__how-step-marker" style={{ borderColor: isActive ? s.color : undefined, background: isActive ? `${s.color}18` : undefined }}>
                  <span className="landing__how-step-num" style={{ color: isActive ? s.color : undefined }}>{s.num}</span>
                </div>
                <div className="landing__how-step-body">
                  <h3 className="landing__how-step-title" style={{ color: isActive ? s.color : undefined }}>{s.title}</h3>
                  <p className="landing__how-step-desc">{s.desc}</p>
                </div>
                {/* Progress bar */}
                <div className="landing__how-step-bar">
                  <div
                    className="landing__how-step-bar-fill"
                    style={{
                      background: s.color,
                      animation: isActive ? 'step-bar-fill 3.2s linear forwards' : 'none',
                      width: completed ? '100%' : isActive ? undefined : '0%',
                    }}
                  />
                </div>
              </div>
            );
          })}
          {/* Connecting line */}
          <div className="landing__how-connector" />
        </div>

        {/* Animation Stage */}
        <div className="landing__how-visual">
          {/* Step 1: Upload */}
          <div className={`how-anim how-anim--upload ${phase === 0 ? 'is-playing' : ''}`}>
            <div className="how-anim__plate">
              <div className="how-anim__dropzone">
                <div className="how-anim__dropzone-ring" />
                <Upload size={28} className="how-anim__dropzone-icon" />
              </div>
              <div className="how-anim__file how-anim__file--1"><FileText size={18} /><span>passport.pdf</span></div>
              <div className="how-anim__file how-anim__file--2"><FileText size={18} /><span>selfie.jpg</span></div>
              <div className="how-anim__file how-anim__file--3"><FileText size={18} /><span>utility_bill.pdf</span></div>
            </div>
          </div>

          {/* Step 2: AI Scan */}
          <div className={`how-anim how-anim--scan ${phase === 1 ? 'is-playing' : ''}`}>
            <div className="how-anim__plate">
              <div className="how-anim__id-card">
                <div className="how-anim__id-photo" />
                <div className="how-anim__id-fields">
                  <div className="how-anim__id-field how-anim__id-field--name" />
                  <div className="how-anim__id-field how-anim__id-field--dob" />
                  <div className="how-anim__id-field how-anim__id-field--num" />
                </div>
                <div className="how-anim__scan-line" />
              </div>
              <div className="how-anim__extract how-anim__extract--1"><CheckCircle size={12} /><span>Name: John Doe</span></div>
              <div className="how-anim__extract how-anim__extract--2"><CheckCircle size={12} /><span>DOB: 1990-05-14</span></div>
              <div className="how-anim__extract how-anim__extract--3"><CheckCircle size={12} /><span>ID: X829104</span></div>
              <div className="how-anim__extract how-anim__extract--4"><ShieldCheck size={12} /><span>Face match: 98.2%</span></div>
            </div>
          </div>

          {/* Step 3: Risk Score */}
          <div className={`how-anim how-anim--score ${phase === 2 ? 'is-playing' : ''}`}>
            <div className="how-anim__plate">
              <svg viewBox="0 0 160 160" className="how-anim__gauge">
                <circle cx="80" cy="80" r="65" fill="none" stroke="#363B58" strokeWidth="10" />
                <circle cx="80" cy="80" r="65" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10"
                  strokeLinecap="round" className="how-anim__gauge-arc"
                  strokeDasharray="0 410" transform="rotate(-90 80 80)" />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
                <text x="80" y="72" textAnchor="middle" fontSize="28" fontWeight="800" fill="#ECEDF2" fontFamily="Inter, sans-serif" className="how-anim__gauge-num">92</text>
                <text x="80" y="94" textAnchor="middle" fontSize="10" fontWeight="600" fill="#34D399" fontFamily="Inter, sans-serif">LOW RISK</text>
              </svg>
              <div className="how-anim__verdict">
                <div className="how-anim__verdict-badge">
                  <CheckCircle size={16} />
                  <span>Auto-Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Data ─── */

const features = [
  { icon: <ScanLine size={24} />, title: 'Intelligent OCR', desc: 'Extracts every field from Aadhaar, PAN, passports & more — with per-field confidence scores.', color: '#8B5CF6' },
  { icon: <ShieldCheck size={24} />, title: 'Forgery Detection', desc: 'Spots edited documents, photoshopped images, and font mismatches in real time.', color: '#F87171' },
  { icon: <Brain size={24} />, title: 'Risk Scoring', desc: 'Auto-approves low-risk applicants. Flags edge cases for your team to review.', color: '#60A5FA' },
  { icon: <BarChart3 size={24} />, title: 'Compliance Dashboard', desc: 'Track approvals, processing times & workloads. Export audit-ready reports in one click.', color: '#34D399' },
  { icon: <Users size={24} />, title: 'Case Management', desc: 'Assign cases, add notes, approve or reject — with full audit trails at every step.', color: '#FBBF24' },
  { icon: <Globe size={24} />, title: 'Regulatory Ready', desc: 'Built-in AML screening, PEP watchlist checks. GDPR, SOC 2 & RBI compliant.', color: '#A78BFA' },
];

const stats = [
  { value: '98.5%', label: 'Extraction Accuracy' },
  { value: '<3s', label: 'Processing Time' },
  { value: '10M+', label: 'Documents Processed' },
  { value: '99.9%', label: 'Uptime SLA' },
];

/* ─── Animation Variants ─── */

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

/* ─── Main Component ─── */

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing__bg">
        <div className="landing__orb landing__orb--1" />
        <div className="landing__orb landing__orb--2" />
        <div className="landing__orb landing__orb--3" />
        <div className="landing__grid-overlay" />
      </div>

      {/* Nav */}
      <motion.nav className="landing__nav" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="landing__nav-inner">
          <div className="landing__logo">
            <span className="landing__logo-text">verity</span>
          </div>
          <div className="landing__nav-links">
            <a href="#features" className="landing__nav-link">Features</a>
            <a href="#how-it-works" className="landing__nav-link">How it Works</a>
          </div>
          <div className="landing__nav-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started <ArrowRight size={15} /></button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-grid">
          <motion.div className="landing__hero-content" initial="hidden" animate="show" variants={stagger}>
            <motion.h1 className="landing__hero-title" variants={fadeUp}>
              KYC & Onboarding,<br />
              <span className="gradient-text">Reimagined with AI</span>
            </motion.h1>
            <motion.p className="landing__hero-subtitle" variants={fadeUp}>
              Automate document verification, identity checks, and risk scoring —
              reduce onboarding time from days to seconds while staying fully compliant.
            </motion.p>
            <motion.div className="landing__hero-cta" variants={fadeUp}>
              <button className="btn btn-primary btn-xl" onClick={() => navigate('/signup')}>Start Free Trial <ArrowRight size={18} /></button>
              <button className="btn btn-secondary btn-xl" onClick={() => navigate('/login')}>Sign In</button>
            </motion.div>
            <motion.div className="landing__hero-trust" variants={fadeUp}>
              <CheckCircle size={13} style={{ color: 'var(--success)' }} />
              <span>No credit card required</span>
              <span className="landing__dot">·</span>
              <Lock size={13} style={{ color: 'var(--accent-start)' }} />
              <span>SOC 2 Compliant</span>
              <span className="landing__dot">·</span>
              <FileText size={13} style={{ color: 'var(--info)' }} />
              <span>GDPR Ready</span>
            </motion.div>
          </motion.div>
          <motion.div className="landing__hero-visual" initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing__stats" id="stats">
        <motion.div className="landing__stats-inner" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          {stats.map((s, i) => (
            <motion.div key={i} className="landing__stat-card" variants={fadeUp}>
              <span className="landing__stat-value">{s.value}</span>
              <span className="landing__stat-label">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="landing__features" id="features">
        <motion.div className="landing__section-header" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.span className="landing__section-badge" variants={fadeUp}>Features</motion.span>
          <motion.h2 className="landing__section-title" variants={fadeUp}>
            Everything you need for <span className="gradient-text">intelligent verification</span>
          </motion.h2>
          <motion.p className="landing__section-desc" variants={fadeUp}>
            A complete platform for every aspect of your KYC and onboarding workflow.
          </motion.p>
        </motion.div>
        <motion.div className="landing__features-grid" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }} variants={stagger}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="landing__feature-card"
              variants={fadeUp}
              style={{ '--_card-color': f.color } as React.CSSProperties}
            >
              <span className="landing__feature-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="landing__feature-icon" style={{ background: `${f.color}18`, color: f.color }}>{f.icon}</div>
              <h3 className="landing__feature-title">{f.title}</h3>
              <p className="landing__feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* CTA */}
      <section className="landing__cta">
        <motion.div className="landing__cta-inner" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
          <motion.h2 className="landing__cta-title" variants={fadeUp}>
            Ready to transform your<br /><span className="gradient-text">onboarding experience?</span>
          </motion.h2>
          <motion.p className="landing__cta-desc" variants={fadeUp}>
            Join hundreds of organizations using Verity AI to verify documents faster, reduce fraud, and stay compliant.
          </motion.p>
          <motion.div className="landing__cta-actions" variants={fadeUp}>
            <button className="btn btn-primary btn-xl" onClick={() => navigate('/signup')}>Start Free Trial <ArrowRight size={18} /></button>
            <button className="btn btn-secondary btn-xl" onClick={() => navigate('/login')}>Sign In to Dashboard</button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <div className="landing__footer-brand">
            <div className="landing__logo"><span className="landing__logo-text">verity</span></div>
            <p className="landing__footer-tagline">AI-powered document intelligence for the modern enterprise.</p>
          </div>
          <div className="landing__footer-links">
            <div className="landing__footer-col"><h4>Product</h4><a href="#features">Features</a><a href="#how-it-works">How it Works</a></div>
            <div className="landing__footer-col"><h4>Legal</h4><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
          </div>
        </div>
        <div className="landing__footer-bottom"><span>© 2025 Verity AI. All rights reserved.</span></div>
      </footer>
    </div>
  );
}
