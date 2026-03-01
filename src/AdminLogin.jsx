import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from './AuthContext';

export default function AdminLogin({ onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login, logout } = useAuth();
  const cardRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 48, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' }
    );
    gsap.fromTo(bodyRef.current.children,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  const shake = () =>
    gsap.fromTo(cardRef.current, { x: -7 }, { x: 0, duration: 0.45, ease: 'elastic.out(1, 0.35)', clearProps: 'x' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) { setError('Please fill in all fields.'); shake(); return; }
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) { setError(result.message || 'Sign in failed.'); shake(); return; }
    if (result.user?.role !== 'admin') {
      await logout();
      setError('This account does not have administrator privileges.');
      shake();
    }
  };

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: "'DM Mono', monospace" };
  const inputFocusStyle = { boxShadow: '0 0 0 2px rgba(14,165,233,0.3)', borderColor: 'rgba(56,189,248,0.5)' };
  const inputCls = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-slate-600";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080c14' }}>
      <div ref={cardRef} className="w-full max-w-md">
        <button onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors group"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span className="group-hover:-translate-x-1 transition-transform inline-block text-base">←</span>
          Back
        </button>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="mb-8">
            <div className="w-10 h-10 rounded-xl mb-5 flex items-center justify-center"
              style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.2)' }}>
              <span style={{ color: '#38bdf8' }}>◉</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Administration
            </h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Sign in to access the admin panel.
            </p>
          </div>

          <form ref={bodyRef} onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-rose-300" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', fontFamily: "'DM Sans', sans-serif" }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Username or Email</label>
              <input type="text" placeholder="Admin username or email" value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                disabled={loading} className={inputCls} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Password</label>
              <input type="password" placeholder="Admin password" value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                disabled={loading} className={inputCls} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? 'Verifying…' : 'Admin Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-center text-slate-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Restricted to authorised administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
