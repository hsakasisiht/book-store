import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, getCategories } from '../../services/bookService';
import BookCard from '../../components/books/BookCard';
import './HomePage.css';

export const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          getBooks({ featured: true, limit: 6 }),
          getCategories(),
        ]);
        setFeaturedBooks(booksRes.books || []);
        setCategories(catsRes || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="home-page-container">
      {/* 1. BRIVON HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content Column */}
            <div className="hero-content">
              <div className="eyebrow-tag">
                <span className="eyebrow-dot"></span>
                • BROOKLYN • BERLIN • EST. 2014
              </div>

              <h1 className="hero-headline">
                WE<br />
                COLLECT<br />
                <span className="lime-highlight">THE WORK,</span> NOT<br />
                THE / NOISE.
              </h1>

              <p className="hero-description">
                Brivon is an independent publisher and curatorial archive of art monographs, brutalist architecture, radical typography, and critical aesthetics. Every volume is selected for physical craft, intellectual rigour, and lasting presence on your shelf.
              </p>

              <div className="hero-actions">
                <Link to="/books" className="btn btn-primary">
                  SEE SELECTED WORK &rarr;
                </Link>
                <a href="#criteria" className="btn btn-secondary">
                  SERVICES &amp; RATES
                </a>
              </div>

              <div className="hero-ticker">
                <span>2,400+ volumes in circulation</span>
                <span className="ticker-sep">&bull;</span>
                <span>48 independent presses</span>
                <span className="ticker-sep">&bull;</span>
                <span>3 ADC awards, 2024</span>
              </div>
            </div>

            {/* Right Showcase Card Column */}
            <div className="hero-showcase-wrapper">
              <div className="brivon-showcase-card">
                <div className="showcase-card-header">
                  <span className="showcase-pill-lime">NO. 037</span>
                  <span className="showcase-title-tag">MÜLLER-BROCKMANN — GRID SYSTEMS</span>
                </div>

                <div className="showcase-media-frame">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=85"
                    alt="Grid Systems in Graphic Design Monograph"
                    className="showcase-cover-image"
                  />
                  <div className="showcase-meta-watermark">
                    35MM &bull; f/1.4 &bull; 1/250S &bull; ISO 400
                  </div>
                </div>

                <div className="showcase-card-footer">
                  <div className="showcase-caption">
                    <span className="caption-sub">FEATURED MONOGRAPH</span>
                    <strong className="caption-main">The Swiss Typographic Standard</strong>
                  </div>
                  <Link to="/books" className="showcase-action-btn">
                    VIEW VOLUME &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GENRES / CURATORIAL INDEX */}
      <section className="curatorial-index-section">
        <div className="container">
          <div className="section-header-editorial">
            <span className="eyebrow-tag">
              <span className="eyebrow-dot"></span>
              01 // INDEX TAXONOMY
            </span>
            <div className="section-title-row">
              <h2 className="section-title">BROWSE BY DISCIPLINE</h2>
              <Link to="/books" className="section-view-all">VIEW ALL &rarr;</Link>
            </div>
          </div>

          <div className="discipline-chips-grid">
            {categories.map((cat, idx) => (
              <Link
                key={cat._id || cat.slug}
                to={`/books?genre=${cat.slug}`}
                className="discipline-card"
              >
                <div className="discipline-num">0{idx + 1}</div>
                <h3 className="discipline-title">{cat.name}</h3>
                <p className="discipline-desc">{cat.description}</p>
                <span className="discipline-arrow">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED MONOGRAPHS */}
      <section className="featured-editions-section">
        <div className="container">
          <div className="section-header-editorial">
            <span className="eyebrow-tag">
              <span className="eyebrow-dot"></span>
              02 // CURATOR'S CHOICE
            </span>
            <div className="section-title-row">
              <h2 className="section-title">FEATURED VOLUMES</h2>
              <Link to="/books" className="btn btn-secondary btn-sm">
                FULL ARCHIVE &rarr;
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="skeleton-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-plate skeleton-card" style={{ height: '420px', padding: 'var(--space-6)' }}>
                  <div className="skeleton-line" style={{ height: '260px', marginBottom: 'var(--space-4)' }}></div>
                  <div className="skeleton-line" style={{ width: '40%', marginBottom: 'var(--space-2)' }}></div>
                  <div className="skeleton-line" style={{ width: '80%' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="books-grid">
              {featuredBooks.map((book, idx) => (
                <BookCard key={book._id} book={book} index={idx + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. EDITORIAL CRITERIA / VALUES */}
      <section id="criteria" className="values-manifesto-section">
        <div className="container">
          <div className="section-header-editorial">
            <span className="eyebrow-tag">
              <span className="eyebrow-dot"></span>
              03 // STUDIO CRITERIA
            </span>
            <h2 className="section-title">CRAFT OVER VOLUME</h2>
          </div>

          <div className="pillars-grid">
            <div className="card-plate pillar-card">
              <div className="pillar-num">01</div>
              <h3 className="pillar-heading">SWYTH-SEWN BINDING</h3>
              <p className="pillar-text">
                Every release in the archive lies completely flat when opened. We exclusively commission thread-sewn bindings on unbleached 140–200gsm archival paper stocks.
              </p>
              <div className="pillar-tag">NO GLUED SPINES</div>
            </div>

            <div className="card-plate pillar-card">
              <div className="pillar-num">02</div>
              <h3 className="pillar-heading">INDEPENDENT IMPRINTS</h3>
              <p className="pillar-text">
                Directly partnered with 48 small, editor-owned publishing houses across Zürich, London, Tokyo, and Berlin. No corporate conglomerate distribution.
              </p>
              <div className="pillar-tag">ORIGINAL PRESSES</div>
            </div>

            <div className="card-plate pillar-card">
              <div className="pillar-num">03</div>
              <h3 className="pillar-heading">ARCHIVAL PACKING</h3>
              <p className="pillar-text">
                Orders are prepared individually by hand. Each volume is wrapped in acid-free tissue paper with reinforced corner shielding for immaculate arrival.
              </p>
              <div className="pillar-tag">ZERO CORNER DAMAGE</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
