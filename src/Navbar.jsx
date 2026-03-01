import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navRef = useRef(null);
  const mobileRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
    );
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    if (!mobileRef.current) return;
    if (open) {
      gsap.fromTo(mobileRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.28, ease: 'power2.out' }
      );
    } else {
      gsap.to(mobileRef.current,
        { height: 0, opacity: 0, duration: 0.22, ease: 'power2.in' }
      );
    }
  }, [open]);

  const handleLogout = async () => {
    gsap.to(navRef.current, { opacity: 0.5, duration: 0.15 });
    setOpen(false);
    await logout();
    gsap.to(navRef.current, { opacity: 1, duration: 0.3 });
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass-dark">
      {/* ── Main bar ──────────────────────────────────────────── */}
      <div className="max-w-8xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>✦</div>
          <span className="font-bold text-white text-base"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Notes</span>
        </div>

        {/* Desktop right — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-4">
          {isLoggedIn() ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user?.role === 'admin' ? 'bg-cyan-400' : 'bg-violet-400'}`} />
                <span className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {user?.username}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${user?.role === 'admin'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                  }`} style={{ fontFamily: "'DM Mono', monospace" }}>
                  {user?.role}
                </span>
              </div>
              <button onClick={handleLogout}
                className="text-sm text-slate-500 hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-500/8 border border-transparent hover:border-rose-500/15"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Sign out
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-700 font-mono">not signed in</span>
          )}
        </div>

        {/* Hamburger — visible only on mobile */}
        <button
          onClick={() => setOpen(o => !o)}
          className="sm:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg transition-colors hover:bg-white/5"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-slate-400 transition-all duration-200 ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`block w-5 h-px bg-slate-400 mt-1.5 transition-all duration-200 ${open ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </div>

      {/* ── Mobile drop-down ──────────────────────────────────── */}
      <div ref={mobileRef} className="sm:hidden overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="px-5 pb-4 pt-1 border-t border-white/5">
          {isLoggedIn() ? (
            <div className="flex flex-col gap-3">
              {/* User info row */}
              <div className="flex items-center gap-2.5 py-2">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user?.role === 'admin' ? 'bg-cyan-400' : 'bg-violet-400'}`} />
                <span className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {user?.username}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${user?.role === 'admin'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                  }`} style={{ fontFamily: "'DM Mono', monospace" }}>
                  {user?.role}
                </span>
              </div>
              <button onClick={handleLogout}
                className="w-full text-sm text-rose-400 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Sign out
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-700 font-mono block py-2">not signed in</span>
          )}
        </div>
      </div>
    </nav>
  );
}
