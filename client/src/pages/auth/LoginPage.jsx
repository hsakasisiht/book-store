import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="container" style={{ maxWidth: '480px', padding: 'var(--space-16) var(--space-4)' }}>
      <div className="card-plate" style={{ padding: 'var(--space-10)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div className="brivon-mark" aria-hidden="true" style={{ margin: '0 auto var(--space-4)' }}>
            <span className="aperture-core"></span>
          </div>
          <span className="eyebrow-tag" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-dot"></span>
            STUDIO ARCHIVE GATE
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-heading)', letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
            BRIVON ACCESS
          </h2>
          <p style={{ color: 'var(--brivon-text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
            Sign in to access your collector acquisitions and dispatch manifests.
          </p>
        </div>

        {error && (
          <div className="alert-feedback alert-error">
            {error}
          </div>
        )}

        {/* Demo Fast-Fill Box */}
        <div style={{ backgroundColor: 'var(--brivon-surface-subdued)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brivon-lime)', marginBottom: '8px' }}>
            FAST DEMO CREDENTIALS:
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}
              onClick={() => handleDemoFill('admin@brivon.com', 'Admin@123')}
            >
              ADMIN DESK
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}
              onClick={() => handleDemoFill('collector@brivon.com', 'Reader@123')}
            >
              COLLECTOR
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">COLLECTOR EMAIL</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. collector@brivon.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">CONFIDENTIAL KEY</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your confidential password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '0.95rem', marginTop: 'var(--space-2)' }}
            disabled={loading}
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER ARCHIVE \u2192'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--brivon-text-muted)' }}>
          NEW COLLECTOR?{' '}
          <Link to="/register" style={{ color: 'var(--brivon-lime)', fontWeight: 700, textDecoration: 'underline' }}>
            REGISTER HERE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
