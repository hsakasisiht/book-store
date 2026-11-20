import React, { useState, useEffect } from 'react';
import { getAdminBooks, createBook, updateBook, deleteBook } from '../../services/adminService';
import { getCategories } from '../../services/bookService';
import './BooksPage.css';

export const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    coverImage: '',
    featured: false,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookRes, catList] = await Promise.all([
        getAdminBooks({ limit: 50 }),
        getCategories(),
      ]);
      setBooks(bookRes.books || []);
      setCategories(catList || []);
      if (catList.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catList[0]._id }));
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Error loading inventory data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      categoryId: categories[0]?._id || '',
      price: '',
      stock: '',
      description: '',
      coverImage: '',
      featured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      categoryId: book.categoryId?._id || book.categoryId || categories[0]?._id || '',
      price: book.price || '',
      stock: book.stock || 0,
      description: book.description || '',
      coverImage: book.coverImage || '',
      featured: !!book.featured,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBook(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook._id, formData);
        setFeedback({ type: 'success', text: `"${formData.title}" updated in archive.` });
      } else {
        await createBook(formData);
        setFeedback({ type: 'success', text: `"${formData.title}" catalogued into archive.` });
      }
      closeModal();
      loadData();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Action failed.' });
    }
  };

  const handleDelete = async (book) => {
    if (window.confirm(`Are you sure you want to remove "${book.title}" from the active archive?`)) {
      try {
        await deleteBook(book._id);
        setFeedback({ type: 'success', text: `"${book.title}" deaccessioned from records.` });
        loadData();
        setTimeout(() => setFeedback(null), 4000);
      } catch (err) {
        setFeedback({ type: 'error', text: err.message || 'Delete failed.' });
      }
    }
  };

  return (
    <div className="admin-books-page">
      <div className="admin-books-header">
        <div>
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            02 // MONOGRAPH INVENTORY RECORD
          </span>
          <h1 className="admin-page-title">MANAGE ARCHIVE VOLUMES</h1>
          <p className="subtitle">Catalogue new releases, edit pricing, and update stock counts.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          + CATALOGUE NEW VOLUME
        </button>
      </div>

      {feedback && (
        <div className={`alert-feedback alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div className="card-plate admin-loading-card">
          <p className="loading-mono-text">RETRIEVING INVENTORY RECORDS...</p>
        </div>
      ) : (
        <div className="card-plate table-responsive" style={{ padding: 0 }}>
          <table className="editorial-table">
            <thead>
              <tr>
                <th>COVER</th>
                <th>VOLUME &amp; AUTHOR</th>
                <th>DISCIPLINE</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>CURATOR PICK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img
                      src={b.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt=""
                      className="table-thumb"
                    />
                  </td>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-heading)' }}>
                      {b.title}
                    </strong>
                    <div className="table-subtext-mono">BY {b.author?.toUpperCase()}</div>
                  </td>
                  <td>
                    <span className="badge-pill badge-dark">
                      {b.categoryId?.name?.toUpperCase() || 'UNASSIGNED'}
                    </span>
                  </td>
                  <td><strong style={{ fontFamily: 'var(--font-mono)' }}>₹{b.price}</strong></td>
                  <td>
                    <span className={`badge-pill ${(b.stock ?? 0) <= 0 ? '' : 'badge-lime'}`} style={(b.stock ?? 0) <= 0 ? { color: 'var(--brivon-rose)', border: '1px solid var(--brivon-rose)' } : {}}>
                      {b.stock} COPIES
                    </span>
                  </td>
                  <td>
                    {b.featured ? (
                      <span className="badge-pill badge-confirmed">YES</span>
                    ) : (
                      <span style={{ color: 'var(--brivon-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>NO</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => openEditModal(b)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Book"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        className="btn btn-sm btn-delete"
                        title="Delete Book"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content card-plate" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBook ? 'EDIT VOLUME RECORD' : 'CATALOGUE NEW VOLUME'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label" htmlFor="b-title">VOLUME TITLE *</label>
                <input
                  id="b-title"
                  type="text"
                  className="form-control"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Grid Systems in Graphic Design"
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="b-author">AUTHOR / DESIGNER *</label>
                  <input
                    id="b-author"
                    type="text"
                    className="form-control"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Josef Müller-Brockmann"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="b-category">DISCIPLINE TAXONOMY *</label>
                  <select
                    id="b-category"
                    className="form-control"
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="b-price">PRICE (₹ INR) *</label>
                  <input
                    id="b-price"
                    type="number"
                    min="0"
                    step="1"
                    className="form-control"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 649"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="b-stock">AVAILABLE STOCK *</label>
                  <input
                    id="b-stock"
                    type="number"
                    min="0"
                    step="1"
                    className="form-control"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 15"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="b-cover">COVER IMAGE URL</label>
                <input
                  id="b-cover"
                  type="url"
                  className="form-control"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="b-desc">CURATORIAL REVIEW / SYNOPSIS *</label>
                <textarea
                  id="b-desc"
                  rows="4"
                  className="form-control"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Exacting curatorial notes on typography, paper stock, and content..."
                />
              </div>

              <div className="form-group checkbox-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ accentColor: 'var(--brivon-lime)' }}
                  />
                  MARK AS FEATURED EDITION (FEATURED ON HOME ARCHIVE)
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  CANCEL
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'UPDATE ARCHIVE' : 'CATALOGUE VOLUME'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
