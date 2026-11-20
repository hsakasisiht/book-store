import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks, getCategories } from '../../services/bookService';
import BookCard from '../../components/books/BookCard';
import BookFilters from '../../components/books/BookFilters';
import './CataloguePage.css';

export const CataloguePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Load Categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catList = await getCategories();
        setCategories(catList);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }
    };
    fetchCats();
  }, []);

  // Fetch books on query state change
  useEffect(() => {
    let isMounted = true;
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBooks({
          search,
          category,
          sort,
          page,
          limit: 12,
        });

        if (isMounted) {
          setBooks(res.books || []);
          setPagination(res.pagination || { total: res.books?.length || 0, pages: 1 });
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load archive at this moment. Please verify backend connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [search, category, sort, page]);

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="catalogue-page container">
      {/* Header Bar */}
      <header className="catalogue-header">
        <div>
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            01 // PHYSICAL MONOGRAPHS &amp; EDITIONS
          </span>
          <h1 className="catalogue-title">ARCHIVE VOLUMES</h1>
          <p className="catalogue-subtitle">
            Curated catalogue of graphic design, brutalist architecture, 35mm photography, and critical aesthetics.
          </p>
        </div>
        <div className="catalogue-count-badge">
          <span className="count-dot"></span>
          <span>{pagination.total} {pagination.total === 1 ? 'VOLUME' : 'VOLUMES'} ARCHIVED</span>
        </div>
      </header>

      {error && (
        <div className="alert-feedback alert-error">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <BookFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setPage(1);
        }}
        categories={categories}
        sort={sort}
        setSort={(val) => {
          setSort(val);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {/* Main Books Grid */}
      <section className="catalogue-main">
        {loading ? (
          <div className="catalogue-grid-skeleton">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-plate skeleton-card" style={{ height: '420px', padding: 'var(--space-6)' }}>
                <div className="skeleton-line" style={{ height: '240px', marginBottom: 'var(--space-4)' }} />
                <div className="skeleton-line" style={{ width: '40%', marginBottom: 'var(--space-2)' }} />
                <div className="skeleton-line" style={{ width: '85%' }} />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="card-plate catalogue-empty-state">
            <div className="empty-mono-tag">ARCHIVE QUERY : 0 RESULTS</div>
            <h3>NO MATCHING VOLUMES FOUND</h3>
            <p>Your filter criteria did not return any titles currently in the archive. Check spelling or clear all filters.</p>
            <button onClick={handleReset} className="btn btn-primary">
              RESET ALL FILTERS &rarr;
            </button>
          </div>
        ) : (
          <>
            <div className="catalogue-grid">
              {books.map((book, idx) => (
                <BookCard key={book._id} book={book} index={idx + 1} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <nav className="pagination-wrapper" aria-label="Archive pagination">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  &larr; PREVIOUS
                </button>
                <span className="page-indicator-mono">
                  PAGE <strong>{page}</strong> / <strong>{pagination.pages}</strong>
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                >
                  NEXT &rarr;
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default CataloguePage;
