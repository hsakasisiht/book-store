import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminBooks } from '../../services/adminService';
import { getCategories } from '../../services/bookService';

export const DashboardPage = () => {
  const [bookCount, setBookCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [bookRes, catList] = await Promise.all([
          getAdminBooks({ limit: 100 }),
          getCategories(),
        ]);
        const books = bookRes.books || [];
        setBookCount(books.length);
        setCategoryCount(catList.length);
        const low = books.filter((b) => (b.stock ?? 0) < 5).length;
        setLowStockCount(low);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <span className="eyebrow-tag">
          <span className="eyebrow-dot"></span>
          01 // CENTRAL ARCHIVES OPERATIONS
        </span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-text-heading)', letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
          DESK OVERVIEW
        </h1>
        <p style={{ color: 'var(--brivon-text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
          Live metrics on physical archive volumes, discipline taxonomies, and fulfillment throughput.
        </p>
      </div>

      {/* Metric Plates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card-plate" style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--brivon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              01 // ACTIVE VOLUMES
            </span>
            <span className="badge-pill badge-lime">CATALOGUED</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '2.8rem', fontWeight: 800, marginTop: 'var(--space-3)', marginBottom: 'var(--space-1)', color: 'var(--color-text)' }}>
            {bookCount}
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--brivon-lime)', fontWeight: 700 }}>
            Curated across {categoryCount} disciplines
          </span>
        </div>

        <div className="card-plate" style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--brivon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              02 // DISPATCH STATUS
            </span>
            <span className="badge-pill badge-confirmed">LIVE</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, marginTop: 'var(--space-3)', marginBottom: 'var(--space-1)', color: 'var(--color-text-heading)', textTransform: 'uppercase' }}>
            ONLINE
          </h2>
          <span className="badge-pill badge-dark">
            DOORSTEP COURIER ACTIVE
          </span>
        </div>

        <div className="card-plate" style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--brivon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              03 // INVENTORY HEALTH
            </span>
            <span className={`badge-pill ${lowStockCount > 0 ? '' : 'badge-lime'}`} style={lowStockCount > 0 ? { color: 'var(--brivon-rose)', border: '1px solid var(--brivon-rose)' } : {}}>
              {lowStockCount > 0 ? 'RESTOCK' : 'STABLE'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, marginTop: 'var(--space-3)', marginBottom: 'var(--space-1)', color: lowStockCount > 0 ? 'var(--brivon-rose)' : 'var(--brivon-lime)', textTransform: 'uppercase' }}>
            {lowStockCount > 0 ? `${lowStockCount} LOW` : 'OPTIMAL'}
          </h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--brivon-text-muted)' }}>
            {lowStockCount > 0 ? 'Editions require press reprint' : 'All titles in sufficient archival stock'}
          </span>
        </div>
      </div>

      <div className="card-plate" style={{ padding: 'var(--space-8)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'var(--color-text-heading)', textTransform: 'uppercase' }}>
          QUICK OPERATIONS ACTIONS
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Link to="/admin/books" className="btn btn-primary">
            MANAGE INVENTORY &rarr;
          </Link>
          <Link to="/admin/categories" className="btn btn-secondary">
            DISCIPLINE TAXONOMIES
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary">
            VIEW DISPATCHES
          </Link>
          <Link to="/books" className="btn btn-secondary" style={{ borderColor: 'var(--brivon-lime)', color: 'var(--brivon-lime)' }}>
            VISIT STOREFRONT &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
