import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', maxWidth: '640px' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <span className="eyebrow-tag">
          <span className="eyebrow-dot"></span>
          03 // COLLECTOR IDENTITY
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-text-heading)', textTransform: 'uppercase' }}>
          COLLECTOR PROFILE
        </h1>
        <p style={{ color: 'var(--brivon-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
          Manage your credentials, dispatch coordinates, and acquisition preferences.
        </p>
      </div>

      <div className="card-plate" style={{ padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--brivon-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0B0E', fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-display)', boxShadow: '0 0 25px rgba(204, 255, 0, 0.35)' }}>
            {(user?.name || 'C').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-heading)', margin: 0, textTransform: 'uppercase' }}>
              {user?.name || 'Collector'}
            </h2>
            <span style={{ display: 'inline-block', marginTop: '4px', background: 'var(--brivon-lime-subtle)', color: 'var(--brivon-lime)', padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', border: '1px solid var(--brivon-lime-border)', fontFamily: 'var(--font-mono)' }}>
              {user?.role === 'admin' ? 'STUDIO DESK OPERATOR' : 'VERIFIED ARCHIVE COLLECTOR'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: '0.92rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
            <span style={{ color: 'var(--brivon-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>EMAIL COORDINATE:</span>
            <strong style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{user?.email || 'collector@brivon.com'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
            <span style={{ color: 'var(--brivon-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>STATUS:</span>
            <span style={{ color: 'var(--brivon-lime)', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>ACTIVE &bull; VERIFIED COLLECTOR</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--brivon-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>AUTHENTICATION LEVEL:</span>
            <strong style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>PASSWORD ENCRYPTED (BCRYPT)</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-8)', flexWrap: 'wrap' }}>
          <Link to="/orders" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
            VIEW DISPATCH HISTORY &rarr;
          </Link>
          <Link to="/books" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
            BROWSE VOLUMES
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
