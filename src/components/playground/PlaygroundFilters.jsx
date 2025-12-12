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
  Settings,
  Clock,
  Calendar
} from 'lucide-react'
import './PlaygroundFilters.css'

// Time filter presets
const TIME_PRESETS = [
  { id: 'all', label: 'All Time', value: null },
  { id: '30m', label: 'Past 30 min', value: 30 * 60 * 1000 },
  { id: '1h', label: 'Past 1 hour', value: 60 * 60 * 1000 },
  { id: '6h', label: 'Past 6 hours', value: 6 * 60 * 60 * 1000 },
  { id: '1d', label: 'Past 1 day', value: 24 * 60 * 60 * 1000 },
  { id: '3d', label: 'Past 3 days', value: 3 * 24 * 60 * 60 * 1000 },
  { id: '7d', label: 'Past 7 days', value: 7 * 24 * 60 * 60 * 1000 },
  { id: '14d', label: 'Past 14 days', value: 14 * 24 * 60 * 60 * 1000 },
  { id: '30d', label: 'Past 30 days', value: 30 * 24 * 60 * 60 * 1000 },
  { id: 'custom', label: 'Custom Range', value: 'custom' }
]

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
  const [expandedCategories, setExpandedCategories] = useState({ time: true, system: true, custom: true })
  const [dropdownPosition, setDropdownPosition] = useState('below') // 'below' or 'above'
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
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
    if (activeFilters.timeFilter && activeFilters.timeFilter !== 'all') {
      count += 1
    }
    return count
  }, [activeFilters])

  // Get active time preset
  const activeTimePreset = useMemo(() => {
    if (!activeFilters.timeFilter) return TIME_PRESETS[0]
    return TIME_PRESETS.find(p => p.id === activeFilters.timeFilter) || TIME_PRESETS[0]
  }, [activeFilters.timeFilter])

  // Handle time filter change
  const handleTimeFilterChange = useCallback((presetId) => {
    if (presetId === 'custom') {
      setShowDatePicker(true)
      setOpenDropdown(null)
      return
    }
    
    setShowDatePicker(false)
    onFilterChange({
      ...activeFilters,
      timeFilter: presetId === 'all' ? undefined : presetId,
      customDateRange: undefined
    })
    setOpenDropdown(null)
  }, [activeFilters, onFilterChange])

  // Handle custom date range apply
  const handleCustomDateApply = useCallback(() => {
    if (customDateRange.start && customDateRange.end) {
      onFilterChange({
        ...activeFilters,
        timeFilter: 'custom',
        customDateRange: {
          start: new Date(customDateRange.start).getTime(),
          end: new Date(customDateRange.end).setHours(23, 59, 59, 999)
        }
      })
      setShowDatePicker(false)
      setOpenDropdown(null)
    }
  }, [activeFilters, customDateRange, onFilterChange])

  // Clear time filter
  const handleClearTimeFilter = useCallback(() => {
    onFilterChange({
      ...activeFilters,
      timeFilter: undefined,
      customDateRange: undefined
    })
    setCustomDateRange({ start: '', end: '' })
    setShowDatePicker(false)
  }, [activeFilters, onFilterChange])

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
    setShowDatePicker(false)
    setCustomDateRange({ start: '', end: '' })
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

  if (allLabels.length === 0 && sessions.length === 0) {
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
                  {/* Time filter chip */}
                  {activeFilters.timeFilter && activeFilters.timeFilter !== 'all' && (
                    <span className="filter-chip filter-chip--time">
                      <Clock size={10} />
                      <span className="filter-chip__text">
                        {activeFilters.timeFilter === 'custom' && activeFilters.customDateRange
                          ? `${new Date(activeFilters.customDateRange.start).toLocaleDateString()} - ${new Date(activeFilters.customDateRange.end).toLocaleDateString()}`
                          : activeTimePreset.label
                        }
                      </span>
                      <button 
                        className="filter-chip__remove"
                        onClick={handleClearTimeFilter}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
                  {/* Label filter chips */}
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

            {/* Time Filter */}
            <div className="filter-category filter-category--time">
              <button 
                className="filter-category__header"
                onClick={() => toggleCategory('time')}
              >
                <Clock size={12} />
                <span>Time Range</span>
                {activeFilters.timeFilter && activeFilters.timeFilter !== 'all' && (
                  <span className="filter-category__active">Active</span>
                )}
                <ChevronRight 
                  size={12} 
                  className={`filter-category__chevron ${expandedCategories.time ? 'filter-category__chevron--open' : ''}`}
                />
              </button>
              <AnimatePresence>
                {expandedCategories.time && (
                  <motion.div
                    className="filter-category__content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="time-filter">
                      <div 
                        className="filter-row"
                        ref={el => filterRowRefs.current['time'] = el}
                      >
                        <div className="filter-row__label">
                          <span className="filter-row__key">Filter by time</span>
                        </div>
                        <div className="filter-row__control">
                          <button
                            className={`filter-select ${activeFilters.timeFilter ? 'filter-select--active' : ''} ${openDropdown === 'time' ? 'filter-select--open' : ''}`}
                            onClick={() => handleDropdownOpen('time')}
                          >
                            <span className="filter-select__text">
                              {activeFilters.timeFilter === 'custom' && activeFilters.customDateRange
                                ? 'Custom Range'
                                : activeTimePreset.label
                              }
                            </span>
                            <ChevronDown size={12} className="filter-select__icon" />
                          </button>
                          
                          <AnimatePresence>
                            {openDropdown === 'time' && (
                              <motion.div
                                className={`filter-menu filter-menu--time ${dropdownPosition === 'above' ? 'filter-menu--above' : ''}`}
                                initial={{ opacity: 0, y: dropdownPosition === 'above' ? 4 : -4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: dropdownPosition === 'above' ? 4 : -4, scale: 0.98 }}
                                transition={{ duration: 0.12 }}
                              >
                                <div className="filter-menu__header">
                                  <span className="filter-menu__title">Time Range</span>
                                  {activeFilters.timeFilter && (
                                    <button 
                                      className="filter-menu__clear"
                                      onClick={handleClearTimeFilter}
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                                <div className="filter-menu__options time-presets">
                                  {TIME_PRESETS.map(preset => {
                                    const isSelected = activeFilters.timeFilter 
                                      ? activeFilters.timeFilter === preset.id 
                                      : preset.id === 'all'
                                    return (
                                      <button
                                        key={preset.id}
                                        className={`filter-option ${isSelected ? 'filter-option--selected' : ''} ${preset.id === 'custom' ? 'filter-option--custom' : ''}`}
                                        onClick={() => handleTimeFilterChange(preset.id)}
                                      >
                                        <span className="filter-option__checkbox">
                                          {isSelected && <Check size={10} />}
                                        </span>
                                        <span className="filter-option__text">
                                          {preset.id === 'custom' && <Calendar size={12} style={{ marginRight: '4px' }} />}
                                          {preset.label}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Custom Date Range Picker */}
                      <AnimatePresence>
                        {showDatePicker && (
                          <motion.div
                            className="date-range-picker"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <div className="date-range-picker__row">
                              <div className="date-range-picker__field">
                                <label>Start Date</label>
                                <input
                                  type="date"
                                  value={customDateRange.start}
                                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                                  max={customDateRange.end || undefined}
                                />
                              </div>
                              <div className="date-range-picker__field">
                                <label>End Date</label>
                                <input
                                  type="date"
                                  value={customDateRange.end}
                                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                                  min={customDateRange.start || undefined}
                                />
                              </div>
                            </div>
                            <div className="date-range-picker__actions">
                              <button
                                className="date-range-picker__cancel"
                                onClick={() => {
                                  setShowDatePicker(false)
                                  setCustomDateRange({ start: '', end: '' })
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                className="date-range-picker__apply"
                                onClick={handleCustomDateApply}
                                disabled={!customDateRange.start || !customDateRange.end}
                              >
                                Apply
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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

  const now = Date.now()

  return sessions.filter(session => {
    // Time filter
    if (activeFilters.timeFilter && activeFilters.timeFilter !== 'all') {
      // Get session timestamp - try session data first (started_at or created_at), then uploadedAt
      let sessionTimestamp = session.uploadedAt || 0
      
      const sessionData = session.data?.sessions?.[0]
      if (sessionData) {
        // Try different timestamp fields
        const rawTimestamp = sessionData.started_at || sessionData.created_at || sessionData.timestamp
        if (rawTimestamp) {
          // Convert to milliseconds if the timestamp is in seconds
          // (Unix timestamps in seconds are ~10 digits, milliseconds are ~13 digits)
          sessionTimestamp = rawTimestamp < 10000000000 
            ? rawTimestamp * 1000 
            : rawTimestamp
        }
      }

      if (activeFilters.timeFilter === 'custom' && activeFilters.customDateRange) {
        // Custom date range filter
        const { start, end } = activeFilters.customDateRange
        if (sessionTimestamp < start || sessionTimestamp > end) {
          return false
        }
      } else {
        // Preset time filter
        const preset = TIME_PRESETS.find(p => p.id === activeFilters.timeFilter)
        if (preset && preset.value) {
          const cutoffTime = now - preset.value
          if (sessionTimestamp < cutoffTime) {
            return false
          }
        }
      }
    }

    // Label filters
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
