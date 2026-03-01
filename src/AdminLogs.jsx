import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { logger } from './logger';

const ACTION_STYLE = {
  CREATE: { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
  UPDATE: { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
  DELETE: { color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)' },
  LOGIN:  { color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',  border: 'rgba(56,189,248,0.2)' },
  LOGOUT: { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.15)' },
  READ:   { color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  SIGNUP: { color: '#fb923c', bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.2)' },
};

const ACTIONS = ['CREATE','UPDATE','DELETE','LOGIN','LOGOUT','READ','SIGNUP'];

export default function AdminLogs() {
  const [filterAction, setFilter] = useState('');
  const [search, setSearch]       = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(wrapRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  }, []);

  const allLogs  = logger.getLogs();
  const stats    = logger.getActionStats();
  const filtered = allLogs.filter(log =>
    (!filterAction || log.action === filterAction) &&
    (!search || log.message?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExport = () => {
    const blob = new Blob([logger.exportLogs()], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `audit-${Date.now()}.json` });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const handleClear = () => { if (window.confirm('Clear all audit logs?')) logger.clearLogs(); };

  return (
    <div ref={wrapRef}>
      {/* Stat tiles */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
        {ACTIONS.map(a => {
          const s = ACTION_STYLE[a] || {};
          return (
            <div key={a} className="rounded-xl px-3 py-3 text-center cursor-pointer transition-all hover:scale-[1.03]"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
              onClick={() => setFilter(f => f === a ? '' : a)}>
              <div className="text-xl font-bold" style={{ color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {stats[a] || 0}
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: s.color, opacity: 0.7, fontFamily: "'DM Mono', monospace" }}>{a}</div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setFilter('')}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: !filterAction ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: !filterAction ? '#e2e8f0' : '#64748b',
                border: `1px solid ${!filterAction ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                fontFamily: "'DM Sans', sans-serif"
              }}>All</button>
            {ACTIONS.map(a => {
              const s = ACTION_STYLE[a] || {};
              const active = filterAction === a;
              return (
                <button key={a} onClick={() => setFilter(f => f === a ? '' : a)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: active ? s.bg : 'transparent',
                    color: active ? s.color : '#64748b',
                    border: `1px solid ${active ? s.border : 'rgba(255,255,255,0.06)'}`,
                    fontFamily: "'DM Sans', sans-serif"
                  }}>{a}</button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport}
              className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.07)', fontFamily: "'DM Sans', sans-serif" }}>
              Export
            </button>
            <button onClick={handleClear}
              className="text-xs px-3 py-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.07)', fontFamily: "'DM Sans', sans-serif" }}>
              Clear
            </button>
          </div>
        </div>
        <input type="text" placeholder="Search log entries…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-white text-xs outline-none placeholder-slate-600 transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: "'DM Mono', monospace" }}
        />
      </div>

      {/* Log list */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {filtered.length === 0 ? (
          <div className="p-14 text-center">
            <div className="text-2xl mb-3 opacity-20" style={{ color: '#38bdf8' }}>◉</div>
            <p className="text-slate-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>No log entries.</p>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.015)' }}>
            {[...filtered].reverse().map((log, i) => {
              const s = ACTION_STYLE[log.action] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.05)', border: 'rgba(148,163,184,0.1)' };
              return (
                <div key={i} className="flex items-start gap-4 px-5 py-3 transition-colors hover:bg-white/[0.015]"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span className="flex-shrink-0 mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontFamily: "'DM Mono', monospace" }}>
                    {log.action}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {log.message}
                    </p>
                    <p className="text-xs text-slate-700 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {log.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-center text-slate-700 text-xs mt-3" style={{ fontFamily: "'DM Mono', monospace" }}>
        {filtered.length} entr{filtered.length !== 1 ? 'ies' : 'y'} · stored locally
      </p>
    </div>
  );
}
