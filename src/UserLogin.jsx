import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from './AuthContext';

export default function UserLogin({ onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
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
    if (!username.trim()) { setError('Please enter your username or email.'); shake(); return; }
    if (!password.trim()) { setError('Please enter your password.'); shake(); return; }
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (!result.success) { setError(result.message || 'Sign in failed. Please check your details.'); shake(); }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-slate-600 font-mono"
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: "'DM Mono', monospace" };
  const inputFocus = { boxShadow: '0 0 0 2px rgba(124,58,237,0.35)', borderColor: 'rgba(167,139,250,0.5)' };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080c14' }}>
      <div ref={cardRef} className="w-full max-w-md">

        {/* Back */}
        <button onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mb-8 transition-colors group"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span className="group-hover:-translate-x-1 transition-transform inline-block text-base">←</span>
          Back
        </button>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="w-10 h-10 rounded-xl mb-5 flex items-center justify-center"
              style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.2)' }}>
              <span style={{ color: '#a78bfa' }}>✦</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Sign in to your Notes account
            </p>
          </div>

          {/* Form */}
          <form ref={bodyRef} onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-rose-300" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', fontFamily: "'DM Sans', sans-serif" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Username or Email</label>
              <input type="text" placeholder="Enter username or email" value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                disabled={loading}
                className={inputCls} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocus)}
                onBlur={e => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Password</label>
              <input type="password" placeholder="Enter your password" value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                disabled={loading}
                className={inputCls} style={inputStyle}
                onFocus={e => Object.assign(e.target.style, inputFocus)}
                onBlur={e => Object.assign(e.target.style, inputStyle)}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-slate-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Don't have an account?{' '}
              <span className="text-violet-400 cursor-pointer hover:text-violet-300 transition-colors"
                onClick={onBack}>Create one</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
