import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useAuth } from './AuthContext';

export default function UserSignup({ onBack }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const cardRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 48, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power3.out' }
    );
    gsap.fromTo(bodyRef.current.children,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  const shake = () =>
    gsap.fromTo(cardRef.current, { x: -7 }, { x: 0, duration: 0.45, ease: 'elastic.out(1, 0.35)', clearProps: 'x' });

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim())         { setError('Please choose a username.'); shake(); return; }
    if (!form.email.includes('@'))     { setError('Please enter a valid email address.'); shake(); return; }
    if (form.password.length < 6)      { setError('Password must be at least 6 characters.'); shake(); return; }
    if (form.password !== form.confirm){ setError('Passwords do not match.'); shake(); return; }
    setLoading(true);
    const result = await signup(form.username, form.email, form.password, 'user');
    setLoading(false);
    if (result.success) {
      setSuccess('Account created. Welcome to Notes!');
      setForm({ username: '', email: '', password: '', confirm: '' });
    } else {
      setError(result.message || 'Registration failed. Please try again.');
      shake();
    }
  };

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: "'DM Mono', monospace" };
  const inputFocus = { boxShadow: '0 0 0 2px rgba(124,58,237,0.35)', borderColor: 'rgba(167,139,250,0.5)' };
  const inputCls   = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all duration-200 placeholder-slate-600";

  const fields = [
    { key: 'username', label: 'Username', type: 'text',     ph: 'Choose a username' },
    { key: 'email',    label: 'Email Address', type: 'email', ph: 'your@email.com' },
    { key: 'password', label: 'Password',  type: 'password', ph: 'At least 6 characters' },
    { key: 'confirm',  label: 'Confirm Password', type: 'password', ph: 'Repeat your password' },
  ];

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
              style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.2)' }}>
              <span style={{ color: '#a78bfa' }}>✦</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Create your account
            </h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Join Notes and start capturing your ideas.
            </p>
          </div>

          <form ref={bodyRef} onSubmit={handleSignup} className="space-y-4">
            {error   && <div className="px-4 py-3 rounded-xl text-sm text-rose-300" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}
            {success && <div className="px-4 py-3 rounded-xl text-sm text-emerald-300" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', fontFamily: "'DM Sans', sans-serif" }}>{success}</div>}

            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.key]}
                  onChange={set(f.key)} disabled={loading}
                  className={inputCls} style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, inputFocus)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)}
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', fontFamily: "'DM Sans', sans-serif" }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-slate-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Already have an account?{' '}
              <span className="text-violet-400 cursor-pointer hover:text-violet-300 transition-colors" onClick={onBack}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
