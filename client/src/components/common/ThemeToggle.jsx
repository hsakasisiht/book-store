import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export const ThemeToggle = ({ compact = false, className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`brivon-theme-toggle ${compact ? 'compact' : ''} ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Studio Light' : 'Switch to Carbon Dark'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Carbon Dark'}
    >
      <span className="toggle-dot" aria-hidden="true"></span>
      <span className="toggle-text">
        {isDark ? 'LIGHT' : 'DARK'}
      </span>
    </button>
  );
};

export default ThemeToggle;
