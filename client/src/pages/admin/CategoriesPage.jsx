import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/bookService';
import { createCategory } from '../../services/adminService';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState(null);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createCategory({ name, slug, description });
      setFeedback({ type: 'success', text: `Discipline "${name}" established successfully.` });
      setName('');
      setSlug('');
      setDescription('');
      fetchCats();
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to create category' });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
        <span className="eyebrow-tag">
          <span className="eyebrow-dot"></span>
          03 // ARCHIVE DISCIPLINES &amp; TAXONOMY
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-text-heading)', letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
          DISCIPLINE MANAGER
        </h1>
        <p style={{ color: 'var(--brivon-text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
          Organize monograph volumes into intuitive intellectual disciplines for seamless exploration.
        </p>
      </div>

      {feedback && (
        <div className={`alert-feedback alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-8)', alignItems: 'start' }}>
        <div className="card-plate table-responsive" style={{ padding: 0 }}>
          <table className="editorial-table">
            <thead>
              <tr>
                <th>DISCIPLINE NAME</th>
                <th>URL SLUG</th>
                <th>TAXONOMY SCOPE</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id || c.slug}>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--color-text-heading)' }}>
                      {c.name}
                    </strong>
                  </td>
                  <td>
                    <code style={{ background: 'var(--brivon-surface-subdued)', padding: '3px 8px', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--brivon-lime)', border: '1px solid var(--brivon-lime-border)' }}>
                      {c.slug}
                    </code>
                  </td>
                  <td style={{ color: 'var(--brivon-text-secondary)', fontSize: '0.9rem' }}>
                    {c.description || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-plate" style={{ padding: 'var(--space-8)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'var(--color-text-heading)', textTransform: 'uppercase' }}>
            ADD DISCIPLINE
          </h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label" htmlFor="cat-name">DISCIPLINE TITLE *</label>
              <input
                id="cat-name"
                type="text"
                className="form-control"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                placeholder="e.g. Critical Spatial Theory"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cat-slug">URL SLUG</label>
              <input
                id="cat-slug"
                type="text"
                className="form-control"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. spatial-theory"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cat-desc">EDITORIAL DEFINITION</label>
              <textarea
                id="cat-desc"
                rows="3"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief curatorial scope of this discipline..."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '0.88rem' }}>
              ESTABLISH DISCIPLINE &rarr;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
