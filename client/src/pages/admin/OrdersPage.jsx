import React, { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../services/orderService';
import './OrdersPage.css';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders({ status: statusFilter });
      setOrders(res.orders || []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load dispatch manifests.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setFeedback({ type: 'success', text: `Order manifest updated to "${newStatus.toUpperCase()}".` });
        loadOrders();
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Status update failed.' });
    }
  };

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
        return <span className="badge-pill badge-dark">PREPARING</span>;
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="admin-orders-header">
        <div>
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            04 // DISPATCH LOG &amp; FULFILLMENT PIPELINE
          </span>
          <h1 className="admin-page-title">DISPATCH LOGS</h1>
          <p className="subtitle">
            Inspect courier packages, update transit status, and audit receipts.
          </p>
        </div>

        <div className="orders-filter-control">
          <label htmlFor="filter-status" className="select-label-mono">STATUS FILTER:</label>
          <select
            id="filter-status"
            className="brivon-select-pill"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">ALL MANIFESTS</option>
            <option value="Pending">PENDING</option>
            <option value="Confirmed">CONFIRMED</option>
            <option value="Shipped">DISPATCHED</option>
            <option value="Delivered">DELIVERED</option>
            <option value="Cancelled">CANCELLED</option>
          </select>
        </div>
      </div>

      {feedback && (
        <div className={`alert-feedback alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {loading ? (
        <div className="card-plate" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
          <p className="loading-mono-text">RETRIEVING DISPATCH LOGS...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card-plate" style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
          <div className="empty-mono-tag">MANIFEST: 0 DISPATCHES</div>
          <h3 style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>NO ORDERS MATCH THIS STATUS</h3>
          <p style={{ color: 'var(--brivon-text-secondary)' }}>
            Collector orders placed on the storefront will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="card-plate table-responsive" style={{ padding: 0 }}>
          <table className="editorial-table">
            <thead>
              <tr>
                <th>ORDER IDENTIFIER</th>
                <th>COLLECTOR</th>
                <th>VOLUMES</th>
                <th>SETTLEMENT</th>
                <th>STATUS</th>
                <th>UPDATE PIPELINE</th>
                <th>INSPECT</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalItemQty = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                return (
                  <tr key={order._id}>
                    <td>
                      <strong className="order-code-lime">{order.orderNumber}</strong>
                      <div className="table-subtext-mono">
                        {new Date(order.createdAt).toLocaleDateString('en-GB').toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <strong>{order.userId?.name || order.shippingAddress?.fullName || 'Collector'}</strong>
                      <div className="table-subtext-mono">{order.userId?.email || 'Direct Checkout'}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                        {totalItemQty} {totalItemQty === 1 ? 'VOLUME' : 'VOLUMES'}
                      </span>
                      <div className="table-subtext-mono">
                        {order.items?.map((i) => i.titleSnapshot).slice(0, 2).join(', ')}
                        {order.items?.length > 2 && ` +${order.items.length - 2} MORE`}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1.05rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                        ₹{order.total?.toFixed(2)}
                      </strong>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <select
                        className="brivon-select-pill status-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">PENDING</option>
                        <option value="Confirmed">CONFIRMED</option>
                        <option value="Shipped">DISPATCHED</option>
                        <option value="Delivered">DELIVERED</option>
                        <option value="Cancelled">CANCELLED</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="btn btn-secondary btn-sm"
                      >
                        INSPECT
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content card-plate" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>MANIFEST #{selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                &times;
              </button>
            </div>

            <div className="modal-body-order">
              <div className="order-meta-grid">
                <div>
                  <span className="meta-label">COLLECTOR NAME:</span>
                  <strong>{selectedOrder.shippingAddress?.fullName}</strong>
                </div>
                <div>
                  <span className="meta-label">CONTACT PHONE:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedOrder.shippingAddress?.phone}</strong>
                </div>
                <div>
                  <span className="meta-label">SETTLEMENT METHOD:</span>
                  <span>{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus?.toUpperCase()})</span>
                </div>
                <div>
                  <span className="meta-label">DESTINATION:</span>
                  <span>
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}{' '}
                    ({selectedOrder.shippingAddress?.postalCode})
                  </span>
                </div>
              </div>

              <h4 style={{ margin: 'var(--space-6) 0 var(--space-3)', fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--color-text-heading)', textTransform: 'uppercase' }}>
                MANIFESTED VOLUMES
              </h4>
              <div className="modal-items-list">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="modal-item-row">
                    <img
                      src={item.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                      alt=""
                      className="modal-item-thumb"
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontFamily: 'var(--font-heading)' }}>{item.titleSnapshot}</strong>
                      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--brivon-text-muted)' }}>
                        BY {item.authorSnapshot?.toUpperCase()} &bull; {item.quantity} {item.quantity === 1 ? 'COPY' : 'COPIES'} &times; ₹{item.unitPrice}
                      </div>
                    </div>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>₹{(item.unitPrice * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <div className="modal-order-total-bar">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>TOTAL PAYABLE:</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--brivon-lime)', fontFamily: 'var(--font-mono)' }}>
                  ₹{selectedOrder.total?.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
