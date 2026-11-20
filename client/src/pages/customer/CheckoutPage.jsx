import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import './CheckoutPage.css';

export const CheckoutPage = () => {
  const { items, totalItems, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Redirect if not signed in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isAuthenticated, navigate]);

  // Prefill address if customer already has saved details
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.[0] || {};
      setAddress({
        fullName: defaultAddr.fullName || user.name || '',
        phone: defaultAddr.phone || user.phone || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        postalCode: defaultAddr.postalCode || '',
      });
    }
  }, [user]);

  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const grandTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Cannot authorize checkout with an empty archival bag.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        shippingAddress: address,
        paymentMethod: 'COD',
        items: items.map((i) => ({
          bookId: i.bookId || i.book?._id,
          title: i.book?.title,
          quantity: i.quantity,
        })),
      };

      const res = await createOrder(orderPayload);
      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        clearCart();
      } else {
        throw new Error(res.message || 'Order manifest could not be confirmed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please review archive stock or address fields.');
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully placed, render Order Confirmation View
  if (confirmedOrder) {
    return (
      <div className="container checkout-confirmed-page">
        <div className="card-plate confirmation-card">
          <div className="brivon-mark" aria-hidden="true" style={{ margin: '0 auto var(--space-4)' }}>
            <span className="aperture-core"></span>
          </div>
          <span className="confirmation-badge-lime">DISPATCH MANIFEST CONFIRMED</span>
          <h1 className="confirmation-title">ORDER AUTHORIZED</h1>
          <p className="confirmation-lead">
            Your Brivon archival order has been entered into the central dispatch queue. Hand-packed packaging and tracking will commence shortly.
          </p>

          <div className="confirmed-details-box">
            <div className="detail-item">
              <span className="detail-label">ORDER IDENTIFIER</span>
              <strong className="order-num-text">{confirmedOrder.orderNumber}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">PAYMENT SETTLEMENT</span>
              <strong>DOORSTEP CASH / UPI SETTLEMENT</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">DESTINATION ADDRESS</span>
              <span>
                {confirmedOrder.shippingAddress?.fullName}, {confirmedOrder.shippingAddress?.street},{' '}
                {confirmedOrder.shippingAddress?.city} ({confirmedOrder.shippingAddress?.postalCode})
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">PAYABLE AT DELIVERY</span>
              <strong className="confirmed-price">₹{confirmedOrder.total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="btn btn-primary">
              VIEW DISPATCH STATUS &rarr;
            </Link>
            <Link to="/books" className="btn btn-secondary">
              BROWSE MORE VOLUMES
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container checkout-page">
      <header className="checkout-header">
        <div>
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            02 // FINAL DISPATCH AUTHORIZATION
          </span>
          <h1 className="checkout-title">AUTHORIZE DISPATCH</h1>
          <p className="checkout-subtitle">Verify recipient delivery coordinates and authorize your courier package.</p>
        </div>
      </header>

      {error && (
        <div className="alert-feedback alert-error">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="card-plate" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
          <h3>ARCHIVE BAG IS EMPTY</h3>
          <p style={{ margin: 'var(--space-2) 0 var(--space-6)', color: 'var(--brivon-text-secondary)' }}>
            Please select at least one monograph volume to proceed with checkout.
          </p>
          <Link to="/books" className="btn btn-primary">EXPLORE ARCHIVE &rarr;</Link>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Left Form: Delivery Address */}
          <div className="card-plate checkout-form-card">
            <div className="step-title-wrap">
              <span className="step-number-mono">01</span>
              <h3 className="section-title-sm">DESTINATION COORDINATES</h3>
            </div>

            <form id="checkout-form" onSubmit={handleSubmitOrder}>
              <div className="form-row-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="addr-name">RECIPIENT FULL NAME *</label>
                  <input
                    id="addr-name"
                    type="text"
                    className="form-control"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="e.g. Julian Carax"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="addr-phone">CONTACT PHONE *</label>
                  <input
                    id="addr-phone"
                    type="tel"
                    className="form-control"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="addr-street">STREET &amp; BUILDING ADDRESS *</label>
                <input
                  id="addr-street"
                  type="text"
                  className="form-control"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Studio No., Building, Street Name"
                />
              </div>

              <div className="form-row-grid form-row-three">
                <div className="form-group">
                  <label className="form-label" htmlFor="addr-city">CITY *</label>
                  <input
                    id="addr-city"
                    type="text"
                    className="form-control"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City / District"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="addr-state">STATE / PROVINCE</label>
                  <input
                    id="addr-state"
                    type="text"
                    className="form-control"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="addr-pin">POSTAL PIN *</label>
                  <input
                    id="addr-pin"
                    type="text"
                    className="form-control"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              <div className="step-title-wrap" style={{ marginTop: 'var(--space-8)' }}>
                <span className="step-number-mono">02</span>
                <h3 className="section-title-sm">PAYMENT SETTLEMENT</h3>
              </div>

              <div className="payment-option-card">
                <label className="payment-label">
                  <input type="radio" name="payment" defaultChecked readOnly className="brivon-radio" />
                  <div>
                    <strong className="payment-heading">DOORSTEP SETTLEMENT (CASH OR UPI)</strong>
                    <p className="payment-subtext">
                      Pay easily via Cash or any UPI App (GPay, PhonePe, Paytm, BHIM) upon delivery by your courier executive.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-confirm-order"
                disabled={loading}
              >
                {loading ? 'CONFIRMING ORDER...' : `AUTHORIZE ORDER &bull; ₹${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Right Sidebar: Items Review */}
          <aside className="card-plate checkout-summary-card">
            <h3 className="summary-title-mono">MANIFEST REVIEW ({totalItems} VOLUMES)</h3>

            <div className="review-items-list">
              {items.map((item) => {
                const book = item.book || {};
                const price = book.price || 0;
                return (
                  <div key={item.bookId || book._id} className="review-item">
                    <img
                      src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt=""
                      className="review-thumb"
                    />
                    <div className="review-item-info">
                      <span className="review-title">{book.title || 'Volume'}</span>
                      <span className="review-meta">QTY: {item.quantity} &bull; ₹{price}</span>
                    </div>
                    <span className="review-linetotal">
                      ₹{(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span className="summary-label">SUBTOTAL:</span>
              <strong className="summary-val">₹{subtotal.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span className="summary-label">DISPATCH COURIER:</span>
              <span style={{ color: shippingFee === 0 ? 'var(--brivon-lime)' : 'inherit', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                {shippingFee === 0 ? 'FREE DISPATCH' : `₹${shippingFee.toFixed(2)}`}
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total-row">
              <span className="total-label">TOTAL PAYABLE:</span>
              <span className="total-amount-lime">₹{grandTotal.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
