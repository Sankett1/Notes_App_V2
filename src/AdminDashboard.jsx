import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { api } from './api';
import { logger } from './logger';
import AdminLogs from './AdminLogs';
import { useAuth } from './AuthContext';

export default function AdminDashboard() {
  const [tab, setTab]             = useState('notes');
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  const [notes, setNotes]         = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearch]   = useState('');
  const [toast, setToast]         = useState({ msg: '', type: 'ok' });
  const { user } = useAuth();
  const wrapRef  = useRef(null);

  const notify = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'ok' }), 3200);
  };

  const loadNotes = async () => {
    try {
      const res = await api.get('/notes');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setNotes(data);
    } catch { setNotes([]); }
  };

  useEffect(() => {
    gsap.fromTo(wrapRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    loadNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      gsap.fromTo('.admin-card', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' });
    }
  }, [notes.length]);

  const createNote = async () => {
    if (!title.trim() || !content.trim()) { notify('Title and content are required.', 'err'); return; }
    try { await api.post('/notes', { title, content }); }
    catch { setNotes(n => [...n, { _id: Date.now().toString(), title, content, createdAt: new Date().toISOString() }]); }
    setTitle(''); setContent('');
    await loadNotes();
    notify('Note saved.');
  };

  const updateNote = async (id) => {
    if (!title.trim() || !content.trim()) { notify('Title and content are required.', 'err'); return; }
    try { await api.put(`/notes/${id}`, { title, content }); }
    catch { setNotes(n => n.map(note => note._id === id ? { ...note, title, content } : note)); }
    setTitle(''); setContent(''); setEditingId(null);
    await loadNotes();
    notify('Note updated.');
  };

  const deleteNote = async (id) => {
    const el = document.querySelector(`[data-aid="${id}"]`);
    if (el) await gsap.to(el, { opacity: 0, y: -8, scale: 0.96, duration: 0.25, ease: 'power2.in' });
    try { await api.delete(`/notes/${id}`); }
    catch { setNotes(n => n.filter(note => note._id !== id)); }
    await loadNotes();
    notify('Note deleted.');
  };

  const startEdit = (note) => { setEditingId(note._id); setTitle(note.title); setContent(note.content); };
  const cancelEdit = () => { setEditingId(null); setTitle(''); setContent(''); };

  const filtered = notes.filter(n => !searchTerm ||
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const inputFocusStyle = { boxShadow: '0 0 0 2px rgba(14,165,233,0.3)', borderColor: 'rgba(56,189,248,0.4)' };

  return (
    <div ref={wrapRef} className="min-h-screen p-5 sm:p-8" style={{ background: '#080c14' }}>
      {toast.msg && (
        <div className="fixed top-20 right-5 z-50 px-5 py-3 rounded-xl text-sm border"
          style={{
            background: toast.type === 'err' ? 'rgba(244,63,94,0.08)' : 'rgba(52,211,153,0.08)',
            borderColor: toast.type === 'err' ? 'rgba(244,63,94,0.2)' : 'rgba(52,211,153,0.2)',
            color: toast.type === 'err' ? '#fda4af' : '#6ee7b7',
            fontFamily: "'DM Sans', sans-serif"
          }}>{toast.msg}</div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Admin Panel
            </h1>
            <p className="text-slate-600 text-sm mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
              {user?.username}{user?.department ? ` · ${user.department}` : ''} · {notes.length} note{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider"
              style={{ fontFamily: "'DM Mono', monospace" }}>Administrator</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl p-1 w-fit mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[['notes','Notes'],['logs','Audit Logs']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: tab === id ? 'rgba(14,165,233,0.12)' : 'transparent',
                color: tab === id ? '#38bdf8' : '#64748b',
                border: tab === id ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
              }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'logs' ? <AdminLogs /> : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Form */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl p-6 sticky top-20"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="font-semibold text-sm uppercase tracking-widest mb-5"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: editingId ? '#38bdf8' : '#e2e8f0' }}>
                  {editingId ? '— Editing' : '— New Note'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>Title</label>
                    <input type="text" placeholder="Note title…" value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder-slate-700"
                      style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>Content</label>
                    <textarea rows={6} placeholder="Note content…" value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all resize-none placeholder-slate-700"
                      style={inputStyle}
                      onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={editingId ? () => updateNote(editingId) : createNote}
                      className="flex-1 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', fontFamily: "'DM Sans', sans-serif" }}>
                      {editingId ? 'Update' : 'Save Note'}
                    </button>
                    {editingId && (
                      <button onClick={cancelEdit}
                        className="px-4 py-3 rounded-xl text-slate-400 hover:text-white text-sm transition-all"
                        style={{ border: '1px solid rgba(255,255,255,0.08)', fontFamily: "'DM Sans', sans-serif" }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes grid */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <input type="text" placeholder="Search notes…" value={searchTerm}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all placeholder-slate-600"
                  style={{ ...inputStyle, fontFamily: "'DM Sans', sans-serif" }}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputStyle)}
                />
              </div>
              {filtered.length === 0 ? (
                <div className="rounded-2xl p-16 text-center"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-3xl mb-4 opacity-30" style={{ color: '#38bdf8' }}>◉</div>
                  <p className="text-slate-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {searchTerm ? 'No notes match your search.' : 'No notes yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.map(note => (
                    <div key={note._id} data-aid={note._id}
                      className={`admin-card rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-0.5 cursor-default ${editingId === note._id ? 'ring-1 ring-cyan-500/40' : ''}`}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <h3 className="font-semibold text-white mb-2 line-clamp-1 text-sm"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{note.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>{note.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>
                          {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—'}
                        </span>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(note)}
                            className="text-xs px-3 py-1 rounded-lg"
                            style={{ background: 'rgba(56,189,248,0.08)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.18)', fontFamily: "'DM Sans', sans-serif" }}>
                            Edit
                          </button>
                          <button onClick={() => deleteNote(note._id)}
                            className="text-xs px-3 py-1 rounded-lg"
                            style={{ background: 'rgba(244,63,94,0.08)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.18)', fontFamily: "'DM Sans', sans-serif" }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
