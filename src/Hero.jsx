import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UserLogin from './UserLogin';
import AdminLogin from './AdminLogin';
import UserSignup from './UserSignup';
import AdminSignup from './AdminSignup';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: '✦',
    title: 'Capture Instantly',
    desc: 'Get your thoughts down the moment they arrive. No friction, no delay — just clarity on demand.',
    color: '#a78bfa',
  },
  {
    icon: '◈',
    title: 'Find Anything',
    desc: 'Search across every note in real time. Whatever you wrote, whenever you wrote it — retrieve it in seconds.',
    color: '#38bdf8',
  },
  {
    icon: '⬡',
    title: 'Stay Organised',
    desc: 'Your workspace, structured the way your mind works. Notes that are easy to review, edit and refine.',
    color: '#34d399',
  },
  {
    icon: '◉',
    title: 'Secure by Default',
    desc: "Every note is tied to your account. Private access controls keep your data yours and no one else's.",
    color: '#fb923c',
  },
  {
    icon: '⟁',
    title: 'Team Oversight',
    desc: 'Administrators get a dedicated view to manage accounts, review activity and keep the workspace healthy.',
    color: '#f472b6',
  },
  {
    icon: '⬢',
    title: 'Export Anytime',
    desc: 'Take your notes with you. Export your entire library at any time in a clean, portable format.',
    color: '#818cf8',
  },
];

const TABLE_ROWS = [
  ['Create & edit notes', true, true],
  ['Real-time search', true, true],
  ['Export library', true, true],
  ['Personal dashboard', true, true],
  ['Audit log access', false, true],
  ['User management', false, true],
  ['Account moderation', false, true],
  ['System-wide overview', false, true],
];

const STATS = [
  { value: '∞', label: 'Notes you can create' },
  { value: '< 1s', label: 'Search response time' },
  { value: '24 / 7', label: 'Access, anywhere' },
  { value: '100%', label: 'Private to you' },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState(null);
  const heroRef = useRef(null);
  const orb1 = useRef(null);
  const orb2 = useRef(null);
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subRef = useRef(null);
  const featRef = useRef(null);

  useEffect(() => {
    if (activeTab) return;
    const ctx = gsap.context(() => {
      // Ambient orbs
      gsap.to(orb1.current, { y: -40, x: 20, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(orb2.current, { y: 30, x: -25, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });

      // Hero entrance — staggered, editorial feel
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo(eyebrowRef.current,
        { opacity: 0, y: 12, letterSpacing: '0.3em' },
        { opacity: 1, y: 0, letterSpacing: '0.15em', duration: 1 })
        .fromTo(titleRef.current.querySelectorAll('.word'),
          { opacity: 0, y: 60, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 1.1, stagger: 0.12 }, '-=0.5')
        .fromTo(subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
        .fromTo('.hero-cta',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.5')
        .fromTo('.stat-item',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, '-=0.3');

      // Scroll: features
      gsap.fromTo('.feat-card',
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: featRef.current, start: 'top 78%' }
        }
      );

      // Scroll: comparison rows
      gsap.fromTo('.tbl-row',
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: '.cmp-table', start: 'top 82%' }
        }
      );

      // Scroll: stats
      gsap.fromTo('.stat-block',
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1, duration: 0.6, stagger: 0.1,
          scrollTrigger: { trigger: '.stats-section', start: 'top 80%' }
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [activeTab]);

  if (activeTab === 'user-login') return <UserLogin onBack={() => setActiveTab(null)} />;
  if (activeTab === 'admin-login') return <AdminLogin onBack={() => setActiveTab(null)} />;
  if (activeTab === 'user-signup') return <UserSignup onBack={() => setActiveTab(null)} />;
  if (activeTab === 'admin-signup') return <AdminSignup onBack={() => setActiveTab(null)} />;

  return (
    <div ref={heroRef} className="relative bg-[#080c14] min-h-screen overflow-x-hidden text-white">

      {/* ── Ambient Light ─────────────────────────────────────── */}
      <div ref={orb1} className="pointer-events-none fixed rounded-full"
        style={{
          width: 'min(700px, 90vw)', height: 'min(700px, 90vw)', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          top: -200, left: 'max(-180px, -15vw)', filter: 'blur(40px)'
        }} />
      <div ref={orb2} className="pointer-events-none fixed rounded-full"
        style={{
          width: 'min(560px, 80vw)', height: 'min(560px, 80vw)', background: 'radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 70%)',
          bottom: '5%', right: 'max(-140px, -10vw)', filter: 'blur(40px)'
        }} />

      {/* ── Subtle Grid Overlay ───────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px'
        }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* ══════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="pt-32 pb-28 text-center">

          {/* Eyebrow */}
          <p ref={eyebrowRef}
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your personal notes workspace
          </p>

          {/* Title */}
          <h1 ref={titleRef}
            className="font-bold leading-[1.03] mb-8 overflow-hidden"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(48px, 9vw, 104px)' }}>
            <span className="word inline-block">Think</span>{' '}
            <span className="word inline-block" style={{ color: '#a78bfa' }}>clearly.</span>
            <br />
            <span className="word inline-block">Write</span>{' '}
            <span className="word inline-block" style={{ color: '#38bdf8' }}>freely.</span>
          </h1>

          {/* Subtitle */}
          <p ref={subRef}
            className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-14"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            A focused workspace for capturing, organising and retrieving your most important ideas —
            whenever you need them.
          </p>

          {/* CTA cards */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            {/* Personal account */}
            <div className="hero-cta w-full sm:w-auto">
              <div className="border border-white/10 rounded-2xl p-6 text-left w-full sm:w-72 hover:border-violet-500/40 transition-colors duration-300 group"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)' }}>
                    <span style={{ color: '#a78bfa' }}>✦</span>
                  </div>
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Personal Account
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Your private notes workspace. Create, search and manage your ideas.
                </p>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('user-login')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', fontFamily: "'DM Sans', sans-serif" }}>
                    Sign In
                  </button>
                  <button onClick={() => setActiveTab('user-signup')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-300 transition-all duration-200 hover:text-white hover:bg-white/5"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'DM Sans', sans-serif" }}>
                    Create Account
                  </button>
                </div>
              </div>
            </div>

            <div className="text-slate-700 text-xs hidden sm:block" style={{ fontFamily: "'DM Sans', sans-serif" }}>or</div>

            {/* Admin account */}
            <div className="hero-cta w-full sm:w-auto">
              <div className="border border-white/10 rounded-2xl p-6 text-left w-full sm:w-72 hover:border-cyan-500/40 transition-colors duration-300 group"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                    style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.22)' }}>
                    <span style={{ color: '#38bdf8' }}>◉</span>
                  </div>
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Administrator
                  </span>
                </div>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Full system access. Manage users, review activity logs and maintain the workspace.
                </p>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('admin-login')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', fontFamily: "'DM Sans', sans-serif" }}>
                    Admin Sign In
                  </button>
                  <button onClick={() => setActiveTab('admin-signup')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-300 transition-all duration-200 hover:text-white hover:bg-white/5"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'DM Sans', sans-serif" }}>
                    Register Admin
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-white/5 rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            {STATS.map((s, i) => (
              <div key={i} className="stat-item px-6 py-5 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.value}</div>
                <div className="text-[11px] text-slate-500 leading-snug"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FEATURES
        ══════════════════════════════════════════════════════ */}
        <section ref={featRef} className="pb-28">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600 mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              What you get
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Built around how you think
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="feat-card rounded-2xl p-7 group hover:-translate-y-0.5 transition-transform duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-xl mb-5 transition-transform duration-300 group-hover:scale-110 inline-block"
                  style={{ color: f.color }}>{f.icon}</div>
                <h3 className="font-semibold text-white mb-2 text-base"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            COMPARISON TABLE
        ══════════════════════════════════════════════════════ */}
        <section className="pb-28">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-600 mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Access levels
            </p>
            <h2 className="text-4xl font-bold text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Right permissions, right people
            </h2>
          </div>

          <div className="cmp-table rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <th className="text-left py-5 px-7 text-slate-500 text-xs font-semibold uppercase tracking-widest w-1/2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Capability</th>
                  <th className="py-5 px-6 text-center text-xs font-semibold uppercase tracking-widest"
                    style={{ color: '#a78bfa', fontFamily: "'DM Sans', sans-serif" }}>Personal</th>
                  <th className="py-5 px-6 text-center text-xs font-semibold uppercase tracking-widest"
                    style={{ color: '#38bdf8', fontFamily: "'DM Sans', sans-serif" }}>Admin</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row, i) => (
                  <tr key={i} className="tbl-row transition-colors hover:bg-white/[0.015]"
                    style={{ borderBottom: i < TABLE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <td className="py-4 px-7 text-slate-300 text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>{row[0]}</td>
                    <td className="py-4 px-6 text-center">
                      {row[1]
                        ? <span className="text-lg" style={{ color: '#34d399' }}>✓</span>
                        : <span className="text-slate-700 text-sm">—</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row[2]
                        ? <span className="text-lg" style={{ color: '#34d399' }}>✓</span>
                        : <span className="text-slate-700 text-sm">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            STATS (scroll-triggered)
        ══════════════════════════════════════════════════════ */}
        <section className="stats-section pb-28">
          <div className="rounded-2xl p-10 md:p-14 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(14,165,233,0.08) 100%)',
              border: '1px solid rgba(167,139,250,0.15)'
            }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Designed for focus
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 max-w-2xl mx-auto"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.15 }}>
              Stop losing ideas. Start building on them.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto mb-10"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Great ideas don't wait. With a workspace that gets out of your way, you can focus on
              the thinking — and let your notes do the remembering.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setActiveTab('user-signup')}
                className="stat-block px-8 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', fontFamily: "'DM Sans', sans-serif" }}>
                Get started — it's free
              </button>
              <button onClick={() => setActiveTab('user-login')}
                className="stat-block px-8 py-3.5 rounded-xl font-semibold text-slate-300 text-sm hover:text-white transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'DM Sans', sans-serif" }}>
                Sign in
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════════════ */}
        <footer className="pb-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '3rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>✦</div>
                <span className="font-bold text-white text-base"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Notes</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                A focused workspace for your most important thinking.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Product</h4>
              <ul className="space-y-2.5">
                {['Notes Dashboard', 'Search & Filter', 'Export', 'Admin Panel'].map(l => (
                  <li key={l}>
                    <span className="text-slate-500 text-sm hover:text-slate-300 transition-colors cursor-pointer"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Company</h4>
              <ul className="space-y-2.5">
                {['About', 'Privacy Policy', 'Terms of Service', 'Security'].map(l => (
                  <li key={l}>
                    <span className="text-slate-500 text-sm hover:text-slate-300 transition-colors cursor-pointer"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional Summary */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Our Commitment</h4>
              <p className="text-slate-500 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                We believe great work starts with clear thinking. Notes is built for individuals and
                teams who value focus, privacy, and reliability above all else. Your notes are
                encrypted, always accessible and never shared.
              </p>
            </div>
          </div>

          {/* Professional summary bar */}
          <div className="rounded-xl px-7 py-5 mb-8"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-slate-400 text-sm leading-relaxed text-center max-w-3xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Notes is a professional note-taking platform designed to help individuals and organisations
              capture ideas, manage knowledge, and maintain clear records — with confidence that their
              information is private, organised and always within reach.
            </p>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              © {new Date().getFullYear()} Notes. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <span key={l} className="text-slate-600 text-xs hover:text-slate-400 transition-colors cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
