import { Search, X } from 'lucide-react'
import './SearchBar.css'

/**
 * SearchBar Component
 * 
 * A search input for filtering traces in the playground.
 * Searches through prompts, responses, model names, API names, etc.
 */
export default function SearchBar({ 
  value = '', 
  onChange, 
  resultsCount = null,
  placeholder = 'Search traces...',
  className = ''
}) {
  const isActive = value.length > 0

  return (
    <div className={`playground-search ${isActive ? 'playground-search--active' : ''} ${className}`}>
      <Search size={14} className="playground-search__icon" />
      <input
        type="text"
        className="playground-search__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isActive && (
        <>
          {resultsCount !== null && (
            <span className="playground-search__count">
              {resultsCount} result{resultsCount !== 1 ? 's' : ''}
            </span>
          )}
          <button 
            className="playground-search__clear"
            onClick={() => onChange('')}
          >
            <X size={12} />
          </button>
        </>
      )}
    </div>
  )
}

