import React, { useState, useRef, useLayoutEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import DataFreshness from './DataFreshness';
import { ROUTES } from '../routes';

// Navbar layouts from roomiest to most compact. The navbar picks the first one whose
// content actually fits, so no screen-width breakpoint is hardcoded anywhere.
const NAV_MODES = ['wide', 'links', 'menu', 'tight'];
const MENU_MODES = new Set(['menu', 'tight']);

// Measures the in-flow navbar blocks; steps down a mode when they overflow, and back up
// when a roomier mode's last measured width fits again.
function useFitMode(containerRef) {
  const [mode, setMode] = useState(NAV_MODES[0]);
  const needed = useRef({});

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;

    const check = () => {
      const cs = getComputedStyle(el);
      const available = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const blocks = [...el.children].filter((c) => {
        const ccs = getComputedStyle(c);
        return ccs.display !== 'none' && ccs.position !== 'absolute';
      });
      const gap = parseFloat(cs.columnGap) || 0;
      const width = blocks.reduce((sum, c) => sum + c.getBoundingClientRect().width, 0)
        + gap * Math.max(blocks.length - 1, 0);
      needed.current[mode] = width;

      const i = NAV_MODES.indexOf(mode);
      if (width > available && i < NAV_MODES.length - 1) {
        setMode(NAV_MODES[i + 1]);
      } else if (i > 0 && needed.current[NAV_MODES[i - 1]] <= available) {
        setMode(NAV_MODES[i - 1]);
      }
    };

    const observer = new ResizeObserver(check);
    observer.observe(el);
    [...el.children].forEach((c) => observer.observe(c));
    check();
    return () => observer.disconnect();
  }, [containerRef, mode]);

  return mode;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const containerRef = useRef(null);
  const mode = useFitMode(containerRef);
  // One StatusBadge only (it polls /health): in the header, or inside the menu when collapsed
  const isMenuMode = MENU_MODES.has(mode);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header-nav">
      <div ref={containerRef} className={`container nav-container nav-mode-${mode}${isMenuMode ? ' nav-collapsed' : ''}`}>
        <NavLink to="/" className="logo" style={{ cursor: 'pointer' }}>
          <div className="logo-icon" style={{ overflow: 'hidden', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(216, 155, 60, 0.15)', border: '1px solid rgba(216, 155, 60, 0.3)' }}>
            <img
              src="/logo.png"
              alt="Mandi API Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <span>Mandi<span style={{ color: 'var(--accent-gold)' }}>API</span></span>
            <span className="logo-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1 }}>
              v1 / Open Ag-Data
            </span>
          </div>
        </NavLink>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {ROUTES.map(({ path, navLabel, navEnd }) => (
            <NavLink
              key={path}
              to={path}
              end={navEnd}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {navLabel}
            </NavLink>
          ))}
          <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Blog
          </NavLink>
          {isMenuMode && (
            <div className="nav-menu-status">
              <StatusBadge />
            </div>
          )}
        </nav>

        <div className="nav-right-cluster">
          <DataFreshness />
          {!isMenuMode && <StatusBadge />}

          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
