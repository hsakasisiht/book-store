import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  return (
    <div className="not-found-container container">
      <div className="card-plate not-found-card">
        <div className="brivon-mark" aria-hidden="true" style={{ margin: '0 auto var(--space-4)' }}>
          <span className="aperture-core"></span>
        </div>
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">INDEX NOT FOUND</h1>
        <p className="not-found-message">
          The requested coordinate or volume could not be located in the Brivon archives. It may have been deaccessioned, renamed, or never printed.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary not-found-btn">
            &larr; RETURN TO INDEX
          </Link>
          <Link to="/books" className="btn btn-secondary not-found-btn">
            VIEW VOLUMES &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
