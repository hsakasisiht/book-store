import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import './OrderHistoryPage.css';

export const OrderHistoryPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        setError(err.message || 'Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="badge-pill badge-confirmed">CONFIRMED</span>;
      case 'Shipped':
        return <span className="badge-pill badge-shipped">DISPATCHED</span>;
      case 'Delivered':
        return <span className="badge-pill badge-confirmed">DELIVERED</span>;
      case 'Cancelled':
        return <span className="badge-pill" style={{ color: 'var(--brivon-rose)', border: '1px solid var(--brivon-rose)' }}>CANCELLED</span>;
      default:
        return <span className="badge-pill badge-dark">IN PREPARATION</span>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) var(--space-4)', textAlign: 'center' }}>
        <div className="card-plate" style={{ padding: 'var(--space-10)', maxWidth: '520px', margin: '0 auto' }}>
          <span className="empty-mono-tag">AUTHENTICATION REQUIRED</span>
          <h2 style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>COLLECTOR ACCESS ONLY</h2>
          <p style={{ margin: '0 0 var(--space-6)', color: 'var(--brivon-text-secondary)' }}>
            Please sign in to view your archival orders and dispatch tracking logs.
          </p>
          <Link to="/login" className="btn btn-primary">SIGN IN &rarr;</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container orders-page">
      <header className="orders-header">
        <div>
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            03 // COLLECTOR RECORD
          </span>
          <h1 className="orders-title">DISPATCH ARCHIVE</h1>
          <p className="orders-subtitle">
            Track courier packaging, dispatch manifests, and historical acquisitions.
          </p>
        </div>
        <div className="orders-user-badge">
          <span className="user-dot"></span>
          <span>COLLECTOR : <strong>{user?.name?.toUpperCase()}</strong></span>
        </div>
      </header>

      {error && (
        <div className="alert-feedback alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card-plate orders-loading-box">
          <p className="loading-mono-text">RETRIEVING DISPATCH RECORDS...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card-plate orders-empty-card">
          <div className="empty-mono-tag">MANIFEST: NO ORDERS RECORDED</div>
          <h2>NO PREVIOUS ORDERS</h2>
          <p>You have not placed any monograph orders from the Brivon archives yet.</p>
          <Link to="/books" className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
            EXPLORE ARCHIVE &rarr;
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).toUpperCase();

            return (
              <article key={order._id} className="card-plate order-card">
                <div className="order-card-header">
                  <div className="order-main-meta">
                    <span className="order-number-lime">{order.orderNumber}</span>
                    <span className="order-date-mono">MANIFEST DATE : {dateStr}</span>
                  </div>

                  <div className="order-status-block">
                    {getStatusBadge(order.status)}
                    <span className="order-total-pill">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-snapshots">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-snapshot-row">
                        <img
                          src={item.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                          alt=""
                          className="snapshot-thumb"
                        />
                        <div className="snapshot-details">
                          <strong className="snapshot-title">{item.titleSnapshot}</strong>
                          <span className="snapshot-author">BY {item.authorSnapshot?.toUpperCase()}</span>
                          <span className="snapshot-meta">
                            {item.quantity} {item.quantity === 1 ? 'COPY' : 'COPIES'} &bull; ₹{item.unitPrice} EACH
                          </span>
                        </div>
                        <div className="snapshot-linetotal">
                          ₹{(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-shipping-summary">
                    <div className="shipping-box">
                      <span className="summary-section-label">DISPATCH RECIPIENT &amp; ADDRESS</span>
                      <p className="shipping-text">
                        <strong>{order.shippingAddress?.fullName}</strong> &bull; {order.shippingAddress?.phone}
                      </p>
                      <p className="shipping-text-secondary">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city}{' '}
                        {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                      </p>
                    </div>

                    <div className="payment-box">
                      <span className="summary-section-label">PAYMENT SETTLEMENT</span>
                      <p className="payment-mode">
                        DOORSTEP (CASH / UPI) &bull; <strong style={{ color: 'var(--brivon-lime)' }}>{order.paymentStatus?.toUpperCase()}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
