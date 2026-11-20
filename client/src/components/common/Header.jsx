import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

export const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="brivon-header">
      <div className="container header-flex">
        {/* Brand Aperture Mark + Typographic Logo */}
        <Link to="/" className="brand-lockup" onClick={closeMenu}>
          <div className="brivon-mark" aria-hidden="true">
            <span className="aperture-core"></span>
          </div>
          <div className="brand-text-stack">
            <span className="brand-name">BRIVON</span>
            <span className="brand-tagline">ARCHIVES</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className={`main-nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            onClick={closeMenu}
          >
            INDEX
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            onClick={closeMenu}
          >
            VOLUMES
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
            onClick={closeMenu}
          >
            BAG <span className="nav-counter">[{totalItems}]</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
                  onClick={closeMenu}
                >
                  DESK
                </NavLink>
              ) : (
                <NavLink
                  to="/orders"
                  className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
                  onClick={closeMenu}
                >
                  MY ORDERS
                </NavLink>
              )}
              <button
                type="button"
                className="nav-logout-btn"
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}
              onClick={closeMenu}
            >
              ACCESS
            </NavLink>
          )}

          {/* Mobile direct CTA */}
          <div className="mobile-only-action">
            <Link to="/books" className="btn btn-primary" onClick={closeMenu}>
              COLLECT BOOKS &rarr;
            </Link>
          </div>
        </nav>

        {/* Right Action Bar */}
        <div className="header-right-actions">
          <ThemeToggle />
          <Link to="/books" className="btn btn-primary btn-header-cta">
            EXPLORE STORE &rarr;
          </Link>
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
            aria-expanded={mobileMenuOpen}
          >
            <span className="burger-bar"></span>
            <span className="burger-bar"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
