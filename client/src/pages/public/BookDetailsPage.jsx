import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../../services/bookService';
import { useCart } from '../../context/CartContext';
import './BookDetailsPage.css';

export const BookDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookById(id);
        if (isMounted) {
          setBook(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Volume details could not be retrieved.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAdd = () => {
    if (book && (book.stock ?? 0) > 0) {
      addToCart(book, quantity);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3500);
    }
  };

  if (loading) {
    return (
      <div className="container details-loading-frame">
        <div className="skeleton-line" style={{ width: '200px', height: '24px', margin: '0 auto var(--space-4)' }}></div>
        <p className="loading-mono-text">RETRIEVING ARCHIVAL SPECIFICATIONS...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container details-error-frame">
        <div className="card-plate details-not-found-card">
          <span className="empty-mono-tag">ARCHIVE REFERENCE ERROR</span>
          <h2>VOLUME NOT FOUND</h2>
          <p>
            {error || 'This monograph is not currently available in the Brivon active archives. It may have been deaccessioned or moved.'}
          </p>
          <Link to="/books" className="btn btn-primary">
            &larr; RETURN TO CATALOGUE
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = (book.stock ?? 0) <= 0;
  const maxAllowedQty = Math.max(1, Math.min(book.stock || 1, 10));

  return (
    <div className="container book-details-page">
      {/* Editorial Breadcrumbs */}
      <nav className="brivon-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">INDEX</Link>
        <span className="sep">/</span>
        <Link to="/books">VOLUMES</Link>
        <span className="sep">/</span>
        <span className="active-leaf">{book.title.toUpperCase()}</span>
      </nav>

      <div className="detail-split-layout card-plate">
        {/* Left Column: Massive Editorial Cover Presentation */}
        <div className="detail-media-column">
          <div className="detail-image-plate">
            <img
              src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85'}
              alt={book.title}
              className="detail-main-img"
            />
            {book.featured && (
              <span className="detail-tag-featured">CURATOR'S EDITION</span>
            )}
            <div className="detail-watermark-tag">
              35MM &bull; 300GSM MUNKEN &bull; SWISS BINDING
            </div>
          </div>

          {/* Archival Specifications Grid */}
          <div className="archival-specs-sheet">
            <div className="spec-row">
              <span className="spec-label">DISCIPLINE</span>
              <strong className="spec-val">{book.categoryId?.name?.toUpperCase() || 'DESIGN MONOGRAPH'}</strong>
            </div>
            <div className="spec-row">
              <span className="spec-label">BINDING</span>
              <strong className="spec-val">SMYTH-SEWN HARDCOVER</strong>
            </div>
            <div className="spec-row">
              <span className="spec-label">ORIGIN</span>
              <strong className="spec-val">CENTRAL ARCHIVE (NEW YORK / BERLIN)</strong>
            </div>
            <div className="spec-row">
              <span className="spec-label">PROVENANCE</span>
              <strong className="spec-val">AUTHENTIC FIRST PRINTING</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Synopsis, Inventory & Cart Actions */}
        <div className="detail-info-column">
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            ARCHIVE VOLUME SPECIFICATION
          </span>

          <h1 className="detail-volume-title">{book.title}</h1>
          <p className="detail-volume-author">
            AUTHOR &bull; <strong>{book.author.toUpperCase()}</strong>
          </p>

          <div className="detail-pricing-bar">
            <span className="detail-price-text">₹{book.price}</span>
            <div className={`detail-inventory-badge ${isOutOfStock ? 'depleted' : 'in-stock'}`}>
              <span className="inventory-dot"></span>
              {isOutOfStock ? 'ARCHIVED / OUT OF PRINT' : `AVAILABLE (${book.stock} COPIES IN ARCHIVE)`}
            </div>
          </div>

          <div className="detail-synopsis-box">
            <h3 className="synopsis-heading">CURATORIAL SYNOPSIS</h3>
            <p className="synopsis-prose">{book.description}</p>
          </div>

          {/* Action Box */}
          {!isOutOfStock ? (
            <div className="detail-action-cluster">
              <div className="quantity-selector-box">
                <label className="qty-label-mono" htmlFor="qty-select">QUANTITY :</label>
                <select
                  id="qty-select"
                  className="brivon-qty-dropdown"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[...Array(maxAllowedQty)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      0{i + 1} {i + 1 === 1 ? 'COPY' : 'COPIES'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-add-bag-full"
                onClick={handleAdd}
              >
                <span>ADD TO BAG</span>
                <span className="btn-price-addon">&bull; ₹{(book.price * quantity).toFixed(2)}</span>
              </button>

              {addedMessage && (
                <div className="bag-feedback-pill">
                  <span className="feedback-check">&bull;</span>
                  VOLUME ADDED TO BAG &mdash; <Link to="/cart" className="bag-link-underline">VIEW BAG &rarr;</Link>
                </div>
              )}
            </div>
          ) : (
            <div className="detail-out-of-stock-box">
              <p>This edition has been fully acquired. Please consult our catalog for alternative prints and monograph volumes.</p>
              <Link to="/books" className="btn btn-secondary">
                BROWSE COMPLETE ARCHIVE &rarr;
              </Link>
            </div>
          )}

          {/* Fulfillment Guarantee Notes */}
          <div className="fulfillment-guarantee-list">
            <div className="guarantee-item">
              <span className="g-bullet">&bull;</span>
              <span>Express tracked courier dispatch within 24 hours</span>
            </div>
            <div className="guarantee-item">
              <span className="g-bullet">&bull;</span>
              <span>Protected in acid-free tissue &amp; reinforced corner shielding</span>
            </div>
            <div className="guarantee-item">
              <span className="g-bullet">&bull;</span>
              <span>Cash &amp; UPI on Delivery available at final checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
