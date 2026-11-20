import React from 'react';
import './BookFilters.css';

export const BookFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  onReset,
}) => {
  return (
    <div className="brivon-filters-bar card-plate">
      {/* Search Input */}
      <div className="filter-search-box">
        <span className="search-label-mono">SEARCH ARCHIVE:</span>
        <input
          id="search-input"
          type="search"
          className="brivon-search-input"
          placeholder="TYPE TITLE, DESIGNER, OR AUTHOR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filter Pills */}
      <div className="filter-controls-flex">
        <div className="filter-select-wrapper">
          <label className="select-label-mono" htmlFor="category-select">
            DISCIPLINE:
          </label>
          <select
            id="category-select"
            className="brivon-select-pill"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">ALL DISCIPLINES</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug || cat._id}>
                {cat.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="filter-select-wrapper">
          <label className="select-label-mono" htmlFor="sort-select">
            ORDER:
          </label>
          <select
            id="sort-select"
            className="brivon-select-pill"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">NEWEST ARRIVALS</option>
            <option value="price_asc">PRICE: LOW &rarr; HIGH</option>
            <option value="price_desc">PRICE: HIGH &rarr; LOW</option>
            <option value="title_asc">TITLE: A &rarr; Z</option>
          </select>
        </div>

        {/* Reset Action */}
        <button
          type="button"
          className="btn btn-secondary btn-reset-pill"
          onClick={onReset}
          title="Reset all filters"
        >
          RESET &times;
        </button>
      </div>
    </div>
  );
};

export default BookFilters;
