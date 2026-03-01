import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }
    );
  }, []);

  const handleLogout = async () => {
    gsap.to(navRef.current, { opacity: 0.5, duration: 0.15 });
    await logout();
    gsap.to(navRef.current, { opacity: 1, duration: 0.3 });
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>✦</div>
          <span className="font-bold text-white text-base"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Notes</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {isLoggedIn() ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user?.role === 'admin' ? 'bg-cyan-400' : 'bg-violet-400'}`} />
                <span className="text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {user?.username}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  user?.role === 'admin'
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
      </div>
    </nav>
  );
}
