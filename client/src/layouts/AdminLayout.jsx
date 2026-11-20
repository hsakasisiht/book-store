import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import StoreLayout from './StoreLayout';
import NotFoundPage from '../pages/public/NotFoundPage';
import './AdminLayout.css';

export const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  // While auth session is being verified
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
        <p style={{ color: 'var(--brivon-lime)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', letterSpacing: '0.12em' }}>
          INITIALIZING BRIVON OPERATIONS DESK...
        </p>
      </div>
    );
  }

  // Security Guard: Mask admin panel for non-admins with 404
  if (!isAdmin) {
    return (
      <StoreLayout>
        <NotFoundPage />
      </StoreLayout>
    );
  }

  return (
    <div className="brivon-admin-wrapper">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <Link to="/" className="admin-brand-link" onClick={closeMobileNav}>
          <div className="brivon-mark" style={{ width: '26px', height: '26px' }}>
            <span className="aperture-core" style={{ width: '10px', height: '10px' }}></span>
          </div>
          <span className="admin-brand-name">BRIVON</span>
          <span className="admin-pill-tag">DESK</span>
        </Link>
        <div className="admin-mobile-actions">
          <ThemeToggle compact />
          <button
            className="admin-menu-toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle admin navigation"
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Desk Sidebar */}
      <aside className={`brivon-admin-sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand-block desktop-only">
          <Link to="/" className="admin-brand-link">
            <div className="brivon-mark">
              <span className="aperture-core"></span>
            </div>
            <div className="brand-text-stack">
              <span className="brand-name">BRIVON</span>
              <span className="brand-tagline">OPERATIONS DESK</span>
            </div>
          </Link>
        </div>

        <nav className="brivon-admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'nav-active' : ''}`} onClick={closeMobileNav}>
            <span className="nav-mono-index">01</span>
            <span>OVERVIEW</span>
          </NavLink>
          <NavLink to="/admin/books" className={({ isActive }) => `admin-nav-item ${isActive ? 'nav-active' : ''}`} onClick={closeMobileNav}>
            <span className="nav-mono-index">02</span>
            <span>VOLUMES</span>
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `admin-nav-item ${isActive ? 'nav-active' : ''}`} onClick={closeMobileNav}>
            <span className="nav-mono-index">03</span>
            <span>DISCIPLINES</span>
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'nav-active' : ''}`} onClick={closeMobileNav}>
            <span className="nav-mono-index">04</span>
            <span>DISPATCHES</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom-actions">
          <Link to="/" className="btn btn-secondary btn-sm" style={{ width: '100%', marginBottom: '8px' }}>
            &larr; STOREFRONT
          </Link>
          <button onClick={handleLogout} className="btn-sidebar-logout">
            LOGOUT DESK
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="brivon-admin-main">
        <header className="brivon-admin-topbar">
          <div className="topbar-desk-label">
            <span className="eyebrow-dot"></span>
            CENTRAL ARCHIVES DESK // BERLIN &bull; NEW YORK
          </div>
          <div className="topbar-user-cluster">
            <span className="operator-name">OPERATOR: <strong>{user?.name?.toUpperCase()}</strong></span>
            <ThemeToggle compact />
          </div>
        </header>

        <main className="brivon-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
