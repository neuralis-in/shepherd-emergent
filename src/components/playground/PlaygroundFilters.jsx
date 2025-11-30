import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  ChevronDown,
  ChevronRight,
  X,
  Tag,
  Check,
  RotateCcw,
  Settings
} from 'lucide-react'
import './PlaygroundFilters.css'

/**
 * PlaygroundFilters Component
 * 
 * A dynamic filter system for the playground that supports:
 * - Labels (dynamic key-value pairs from sessions)
 * - Extensible for future filter types (providers, models, date ranges, etc.)
 */
export default function PlaygroundFilters({ 
  sessions = [], 
  activeFilters = {},
  onFilterChange,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({ system: true, custom: true })
  const [dropdownPosition, setDropdownPosition] = useState('below') // 'below' or 'above'
  const filterRowRefs = useRef({})

  // Categorize labels into system (aiobs_*) and custom labels
  const { systemLabels, customLabels } = useMemo(() => {
    const labelMap = new Map()
    
    sessions.forEach(session => {
      const sessionLabels = session.data?.sessions?.[0]?.labels || {}
      Object.entries(sessionLabels).forEach(([key, value]) => {
        if (!labelMap.has(key)) {
          labelMap.set(key, new Set())
        }
        labelMap.get(key).add(String(value))
      })
    })

    const system = []
    const custom = []

    Array.from(labelMap.entries()).forEach(([key, values]) => {
      const label = {
        key,
        values: Array.from(values).sort((a, b) => a.localeCompare(b))
      }
      if (key.startsWith('aiobs_')) {
        system.push(label)
      } else {
        custom.push(label)
      }
    })

    return {
      systemLabels: system.sort((a, b) => a.key.localeCompare(b.key)),
      customLabels: custom.sort((a, b) => a.key.localeCompare(b.key))
    }
  }, [sessions])

  const allLabels = [...systemLabels, ...customLabels]

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (activeFilters.labels) {
      Object.values(activeFilters.labels).forEach(values => {
        count += values.length
      })
    }
    return count
  }, [activeFilters])

  // Handle label filter toggle
  const handleLabelToggle = useCallback((labelKey, value) => {
    const currentLabels = activeFilters.labels || {}
    const currentValues = currentLabels[labelKey] || []
    
    let newValues
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value)
    } else {
      newValues = [...currentValues, value]
    }

    const newLabels = {
      ...currentLabels,
      [labelKey]: newValues
    }

    if (newValues.length === 0) {
      delete newLabels[labelKey]
    }

    onFilterChange({
      ...activeFilters,
      labels: Object.keys(newLabels).length > 0 ? newLabels : undefined
    })
  }, [activeFilters, onFilterChange])

  // Clear all filters
  const handleClearAll = useCallback(() => {
    onFilterChange({})
    setOpenDropdown(null)
  }, [onFilterChange])

  // Clear specific label filter
  const handleClearLabel = useCallback((labelKey) => {
    const newLabels = { ...activeFilters.labels }
    delete newLabels[labelKey]
    
    onFilterChange({
      ...activeFilters,
      labels: Object.keys(newLabels).length > 0 ? newLabels : undefined
    })
  }, [activeFilters, onFilterChange])

  // Format label key for display
  const formatLabelKey = (key) => {
    return key
      .replace(/^aiobs_/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Handle dropdown open and determine position
  const handleDropdownOpen = useCallback((key) => {
    if (openDropdown === key) {
      setOpenDropdown(null)
      return
    }

    // Check if dropdown should appear above
    const rowElement = filterRowRefs.current[key]
    if (rowElement) {
      const rect = rowElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      
      // If less than 250px below, show dropdown above
      setDropdownPosition(spaceBelow < 250 ? 'above' : 'below')
    }
    
    setOpenDropdown(key)
  }, [openDropdown])

  // Render a label row
  const renderLabelRow = (label) => {
    const { key, values } = label
    const activeValues = activeFilters.labels?.[key] || []
    const isOpen = openDropdown === key
    const hasSelection = activeValues.length > 0
    const menuPositionClass = isOpen && dropdownPosition === 'above' ? 'filter-menu--above' : ''

    return (
      <div 
        key={key} 
        className="filter-row"
        ref={el => filterRowRefs.current[key] = el}
      >
        <div className="filter-row__label">
          <span className="filter-row__key">{formatLabelKey(key)}</span>
          {hasSelection && (
            <span className="filter-row__active-count">{activeValues.length} selected</span>
          )}
        </div>
        <div className="filter-row__control">
          <button
            className={`filter-select ${hasSelection ? 'filter-select--active' : ''} ${isOpen ? 'filter-select--open' : ''}`}
            onClick={() => handleDropdownOpen(key)}
          >
            <span className="filter-select__text">
              {hasSelection 
                ? activeValues.length === 1 
                  ? activeValues[0] 
                  : `${activeValues.length} values`
                : 'All'
              }
            </span>
            <ChevronDown size={12} className="filter-select__icon" />
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={`filter-menu ${menuPositionClass}`}
                initial={{ opacity: 0, y: dropdownPosition === 'above' ? 4 : -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: dropdownPosition === 'above' ? 4 : -4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
              >
                <div className="filter-menu__header">
                  <span className="filter-menu__title">{formatLabelKey(key)}</span>
                  {hasSelection && (
                    <button 
                      className="filter-menu__clear"
                      onClick={() => handleClearLabel(key)}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="filter-menu__options">
                  {values.map(value => {
                    const isSelected = activeValues.includes(value)
                    return (
                      <button
                        key={value}
                        className={`filter-option ${isSelected ? 'filter-option--selected' : ''}`}
                        onClick={() => handleLabelToggle(key, value)}
                      >
                        <span className="filter-option__checkbox">
                          {isSelected && <Check size={10} />}
                        </span>
                        <span className="filter-option__text">{value}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  if (allLabels.length === 0) {
    return null
  }

  return (
    <div className={`playground-filters ${className}`}>
      {/* Compact Header */}
      <button 
        className={`playground-filters__header ${isExpanded ? 'playground-filters__header--active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="playground-filters__header-left">
          <Filter size={14} />
          <span className="playground-filters__title">Filters</span>
          {activeFilterCount > 0 && (
            <span className="playground-filters__badge">{activeFilterCount}</span>
          )}
        </div>
        <ChevronRight 
          size={14} 
          className={`playground-filters__chevron ${isExpanded ? 'playground-filters__chevron--open' : ''}`}
        />
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="playground-filters__panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Active Filters Summary */}
            {activeFilterCount > 0 && (
              <div className="filter-summary">
                <div className="filter-summary__pills">
                  {Object.entries(activeFilters.labels || {}).map(([labelKey, values]) => (
                    values.map(value => (
                      <span key={`${labelKey}-${value}`} className="filter-chip">
                        <span className="filter-chip__text">
                          {formatLabelKey(labelKey)}: {value}
                        </span>
                        <button 
                          className="filter-chip__remove"
                          onClick={() => handleLabelToggle(labelKey, value)}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  ))}
                </div>
                <button 
                  className="filter-summary__clear"
                  onClick={handleClearAll}
                >
                  <RotateCcw size={10} />
                  Clear all
                </button>
              </div>
            )}

            {/* Custom Labels (User-defined) */}
            {customLabels.length > 0 && (
              <div className="filter-category">
                <button 
                  className="filter-category__header"
                  onClick={() => toggleCategory('custom')}
                >
                  <Tag size={12} />
                  <span>Custom Labels</span>
                  <span className="filter-category__count">{customLabels.length}</span>
                  <ChevronRight 
                    size={12} 
                    className={`filter-category__chevron ${expandedCategories.custom ? 'filter-category__chevron--open' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedCategories.custom && (
                    <motion.div
                      className="filter-category__content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {customLabels.map(renderLabelRow)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* System Labels (aiobs_*) */}
            {systemLabels.length > 0 && (
              <div className="filter-category">
                <button 
                  className="filter-category__header"
                  onClick={() => toggleCategory('system')}
                >
                  <Settings size={12} />
                  <span>System Labels</span>
                  <span className="filter-category__count">{systemLabels.length}</span>
                  <ChevronRight 
                    size={12} 
                    className={`filter-category__chevron ${expandedCategories.system ? 'filter-category__chevron--open' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedCategories.system && (
                    <motion.div
                      className="filter-category__content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {systemLabels.map(renderLabelRow)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Utility function to filter sessions based on active filters
 */
export function filterSessions(sessions, activeFilters) {
  if (!activeFilters || Object.keys(activeFilters).length === 0) {
    return sessions
  }

  return sessions.filter(session => {
    const sessionLabels = session.data?.sessions?.[0]?.labels || {}

    if (activeFilters.labels) {
      for (const [labelKey, allowedValues] of Object.entries(activeFilters.labels)) {
        if (allowedValues.length === 0) continue
        
        const sessionValue = String(sessionLabels[labelKey] || '')
        if (!allowedValues.includes(sessionValue)) {
          return false
        }
      }
    }

    return true
  })
}
