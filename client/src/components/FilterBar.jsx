import { useState, useEffect, useRef } from 'react';
import './FilterBar.css';

/**
 * FilterBar — controls for filtering, searching, and sorting tasks.
 * Debounces search input by 300ms to avoid excessive API calls.
 */
function FilterBar({ filters, onFilterChange }) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const debounceRef = useRef(null);

  // Debounced search — waits 300ms after user stops typing
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFilterChange({ ...filters, search: searchValue });
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue]);

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="filter-bar">
      {/* Search input */}
      <div className="filter-bar__search">
        <svg className="filter-bar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="filter-search"
          type="text"
          className="filter-bar__search-input"
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <button
            className="filter-bar__search-clear"
            onClick={() => {
              setSearchValue('');
              onFilterChange({ ...filters, search: '' });
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter controls */}
      <div className="filter-bar__controls">
        <select
          id="filter-status"
          className="filter-bar__select"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          id="filter-priority"
          className="filter-bar__select"
          value={filters.priority || ''}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          id="filter-sort"
          className="filter-bar__select"
          value={filters.sort || ''}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="dueDate">Due Date ↑</option>
          <option value="-dueDate">Due Date ↓</option>
          <option value="-priority">Priority ↓</option>
          <option value="priority">Priority ↑</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
