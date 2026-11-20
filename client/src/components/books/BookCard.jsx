import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './BookCard.css';

export const BookCard = ({ book, index }) => {
  const { addToCart } = useCart();
  const isOutOfStock = (book.stock ?? 0) <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isOutOfStock) {
      addToCart(book, 1);
    }
  };

  const defaultCover = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <article className="brivon-book-card card-plate">
      {/* Top Header Row with Index Code and Category Tag */}
      <div className="card-top-meta">
        <span className="card-vol-tag">
          {index ? `VOL. 0${index}` : 'ARCHIVE'}
        </span>
        {book.categoryId?.name && (
          <span className="card-genre-pill">{book.categoryId.name}</span>
        )}
      </div>

      {/* Book Image Frame */}
      <Link to={`/books/${book._id}`} className="card-media-anchor">
        <div className="card-media-frame">
          <img
            src={book.coverImage || defaultCover}
            alt={book.title}
            className="card-cover-photo"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = defaultCover;
            }}
          />
          {book.featured && (
            <span className="card-badge-featured">FEATURED</span>
          )}
          {isOutOfStock && (
            <span className="card-badge-out">ARCHIVED</span>
          )}
        </div>
      </Link>

      {/* Book Meta Details */}
      <div className="card-details-block">
        <h3 className="card-book-title">
          <Link to={`/books/${book._id}`}>
            {book.title}
          </Link>
        </h3>

        <div className="card-book-author">
          BY {book.author.toUpperCase()}
        </div>

        <div className="card-footer-flex">
          <div className="card-price-stack">
            <span className="card-price-val">₹{book.price}</span>
            <span className={`card-stock-dot ${isOutOfStock ? 'stock-depleted' : 'stock-available'}`}>
              <span className="mini-dot"></span>
              {isOutOfStock ? 'OUT OF PRINT' : (book.stock <= 3 ? `ONLY ${book.stock} LEFT` : 'IN ARCHIVE')}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-acquire"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            aria-label={`Acquire ${book.title}`}
          >
            {isOutOfStock ? 'SOLDOUT' : 'ACQUIRE +'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
