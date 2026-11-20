import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CartPage.css';

export const CartPage = () => {
  const { items, totalItems, subtotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const estimatedTotal = subtotal + shippingFee;

  const handleProceedCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="container cart-page">
      <header className="cart-header">
        <div>
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            01 // ARCHIVE DISPATCH BAG
          </span>
          <h1 className="cart-title">YOUR SELECTED VOLUMES</h1>
          <p className="cart-subtitle">Review your curated order before dispatch and courier packing.</p>
        </div>
        <div className="cart-count-pill">
          {totalItems} {totalItems === 1 ? 'VOLUME' : 'VOLUMES'} IN BAG
        </div>
      </header>

      {items.length === 0 ? (
        <div className="card-plate cart-empty-card">
          <div className="empty-mono-tag">BAG STATUS: EMPTY</div>
          <h2>NO VOLUMES IN BAG</h2>
          <p>Your archival bag is currently empty. Explore our catalog of design, architecture, and photography monographs.</p>
          <Link to="/books" className="btn btn-primary cart-explore-btn">
            EXPLORE ARCHIVE VOLUMES &rarr;
          </Link>
        </div>
      ) : (
        <div className="cart-grid-layout">
          {/* Items List */}
          <div className="card-plate cart-items-card">
            <div className="cart-items-header">
              <span className="items-header-mono">LINE ITEMS ({totalItems})</span>
              <button onClick={clearCart} className="btn-clear-cart">
                CLEAR BAG &times;
              </button>
            </div>

            <div className="cart-items-list">
              {items.map((item) => {
                const book = item.book || {};
                const bookId = item.bookId || book._id;
                const price = book.price || 0;
                const lineTotal = price * (item.quantity || 1);

                return (
                  <div key={bookId} className="cart-item-row">
                    <img
                      src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt=""
                      className="cart-item-thumb"
                    />

                    <div className="cart-item-details">
                      <h4 className="cart-item-title">
                        <Link to={`/books/${bookId}`}>{book.title || 'Volume'}</Link>
                      </h4>
                      <div className="cart-item-author">BY {book.author ? book.author.toUpperCase() : 'UNKNOWN'}</div>
                      <div className="cart-item-price-unit">₹{price} / copy</div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="brivon-stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => updateQuantity(bookId, (item.quantity || 1) - 1)}
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className="stepper-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => updateQuantity(bookId, (item.quantity || 1) + 1)}
                          aria-label="Increase quantity"
                        >
                          &#43;
                        </button>
                      </div>

                      <div className="cart-item-linetotal">
                        ₹{lineTotal.toFixed(2)}
                      </div>

                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeFromCart(bookId)}
                        title="Remove title from cart"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-continue-bar">
              <Link to="/books" className="continue-link">
                &larr; CONTINUE EXPLORING ARCHIVES
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="card-plate cart-summary-card">
            <h3 className="summary-title-mono">DISPATCH SUMMARY</h3>

            <div className="summary-row">
              <span className="summary-label">SUBTOTAL ({totalItems} VOLUMES):</span>
              <strong className="summary-val">₹{subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span className="summary-label">ARCHIVAL COURIER:</span>
              <span className={`summary-val ${shippingFee === 0 ? 'shipping-free' : ''}`}>
                {shippingFee === 0 ? 'FREE DISPATCH' : `₹${shippingFee.toFixed(2)}`}
              </span>
            </div>

            {shippingFee > 0 && (
              <div className="free-shipping-hint">
                Add <strong>₹{(1000 - subtotal).toFixed(2)}</strong> more for <strong>FREE</strong> delivery!
              </div>
            )}

            <div className="summary-divider" />

            <div className="summary-row summary-total-row">
              <span className="total-label">TOTAL ESTIMATED:</span>
              <span className="total-amount-lime">₹{estimatedTotal.toFixed(2)}</span>
            </div>

            <p className="summary-tax-note">All taxes included. Smyth-sewn archival packaging standard with every order.</p>

            <button
              type="button"
              className="btn btn-primary btn-checkout-large"
              onClick={handleProceedCheckout}
            >
              <span>PROCEED TO CHECKOUT</span>
              <span className="btn-arrow">&rarr;</span>
            </button>

            {!isAuthenticated && (
              <p className="auth-checkout-hint">
                * Collector login required at checkout.
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
