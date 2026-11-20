import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
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
            NEW COLLECTOR ENROLLMENT
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-heading)', letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
            JOIN BRIVON
          </h2>
          <p style={{ color: 'var(--brivon-text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
            Establish a collector record to acquire limited monographs and track dispatches.
          </p>
        </div>

        {error && (
          <div className="alert-feedback alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">FULL NAME *</label>
            <input
              id="reg-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Julian Carax"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">EMAIL ADDRESS *</label>
            <input
              id="reg-email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. julian@brivon.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">CONFIDENTIAL KEY (MIN 6 CHARACTERS) *</label>
            <input
              id="reg-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">CONFIRM KEY *</label>
            <input
              id="reg-confirm"
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '0.95rem', marginTop: 'var(--space-2)' }}
            disabled={loading}
          >
            {loading ? 'ESTABLISHING RECORD...' : 'CREATE COLLECTOR ACCOUNT \u2192'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-6)', textAlign: 'center', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--brivon-text-muted)' }}>
          EXISTING COLLECTOR?{' '}
          <Link to="/login" style={{ color: 'var(--brivon-lime)', fontWeight: 700, textDecoration: 'underline' }}>
            SIGN IN HERE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
