import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Layers,
  Activity,
  AlertCircle,
  BarChart3,
  Files,
  Trash2,
  LineChart,
  Wand2,
  Cpu,
  Terminal,
  AlertTriangle
} from 'lucide-react'
import './Playground.css'

// Import components from the playground component library
import {
  TreeNode,
  EventCard,
  SessionInfo,
  StatsBar,
  Timeline,
  Analytics,
  UploadZone,
  GCPConnectionModal,
  YourTracesModal,
  SessionSidebar,
  PlaygroundFilters,
  SearchBar,
  filterSessions,
  validateObservabilityJson,
  IssuesView
} from '../components/playground'

import EnhancePrompts from '../components/EnhancePrompts'

// Main Playground Component
export default function Playground() {
  const [sessions, setSessions] = useState([])
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState('analytics') // 'tree', 'list', 'analytics', or 'timeline'
  const [isLoadingSample, setIsLoadingSample] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const [isGCPModalOpen, setIsGCPModalOpen] = useState(false)
  const [isYourTracesModalOpen, setIsYourTracesModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [issuesFilter, setIssuesFilter] = useState('all') // Filter for issues view

  // Apply filters to sessions
  const filteredSessions = useMemo(() => {
    return filterSessions(sessions, activeFilters)
  }, [sessions, activeFilters])

  const selectedSession = useMemo(() => {
    if (selectedSessionId === null) return null
    return filteredSessions.find(s => s.id === selectedSessionId)
  }, [filteredSessions, selectedSessionId])

  const currentData = selectedSession?.data || null

  // Search through traces - searches in prompts, responses, model names, API names
  const searchTraces = useCallback((traces, query) => {
    if (!query.trim() || !traces) return traces
    const lowerQuery = query.toLowerCase()
    
    const searchInNode = (node) => {
      // Search in API name
      if (node.api?.toLowerCase().includes(lowerQuery)) return true
      // Search in provider
      if (node.provider?.toLowerCase().includes(lowerQuery)) return true
      // Search in model name
      if (node.request?.model?.toLowerCase().includes(lowerQuery)) return true
      // Search in messages (OpenAI format)
      if (node.request?.messages?.some(m => m.content?.toLowerCase().includes(lowerQuery))) return true
      // Search in contents (Gemini format)
      if (node.request?.contents?.toLowerCase().includes(lowerQuery)) return true
      // Search in input (embeddings)
      if (node.request?.input) {
        const input = Array.isArray(node.request.input) ? node.request.input.join(' ') : node.request.input
        if (input.toLowerCase().includes(lowerQuery)) return true
      }
      // Search in response text
      if (node.response?.text?.toLowerCase().includes(lowerQuery)) return true
      // Search in function name
      if (node.name?.toLowerCase().includes(lowerQuery)) return true
      // Search in error
      if (typeof node.error === 'string' && node.error.toLowerCase().includes(lowerQuery)) return true
      // Search in result
      if (typeof node.result === 'string' && node.result.toLowerCase().includes(lowerQuery)) return true
      return false
    }

    const filterTraceTree = (nodes) => {
      return nodes.filter(node => {
        const nodeMatches = searchInNode(node)
        const hasMatchingChildren = node.children && filterTraceTree(node.children).length > 0
        return nodeMatches || hasMatchingChildren
      }).map(node => ({
        ...node,
        children: node.children ? filterTraceTree(node.children) : []
      }))
    }

    return filterTraceTree(traces)
  }, [])

  // Get filtered data based on search query
  const filteredCurrentData = useMemo(() => {
    if (!currentData || !searchQuery.trim()) return currentData
    
    return {
      ...currentData,
      trace_tree: searchTraces(currentData.trace_tree, searchQuery),
      events: currentData.events?.filter(event => {
        const lowerQuery = searchQuery.toLowerCase()
        if (event.api?.toLowerCase().includes(lowerQuery)) return true
        if (event.provider?.toLowerCase().includes(lowerQuery)) return true
        if (event.request?.model?.toLowerCase().includes(lowerQuery)) return true
        if (event.request?.messages?.some(m => m.content?.toLowerCase().includes(lowerQuery))) return true
        if (event.response?.text?.toLowerCase().includes(lowerQuery)) return true
        return false
      }),
      function_events: currentData.function_events?.filter(event => {
        const lowerQuery = searchQuery.toLowerCase()
        if (event.name?.toLowerCase().includes(lowerQuery)) return true
        if (typeof event.result === 'string' && event.result.toLowerCase().includes(lowerQuery)) return true
        return false
      })
    }
  }, [currentData, searchQuery, searchTraces])

  // Count search results
  const searchResultsCount = useMemo(() => {
    if (!searchQuery.trim() || !filteredCurrentData) return null
    const traceCount = filteredCurrentData.trace_tree?.length || 0
    const eventCount = filteredCurrentData.events?.length || 0
    const funcCount = filteredCurrentData.function_events?.length || 0
    return traceCount + eventCount + funcCount
  }, [searchQuery, filteredCurrentData])

  const handleUpload = useCallback((file) => {
    // Only accept JSON files
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setValidationError(`"${file.name}" is not a JSON file. Only JSON files are supported.`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        
        // Validate the JSON structure
        const validation = validateObservabilityJson(parsed, file.name)
        if (!validation.valid) {
          setValidationError(validation.error)
          return
        }

        const newSession = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fileName: file.name,
          data: parsed,
          uploadedAt: Date.now()
        }
        setSessions(prev => [...prev, newSession])
        setError(null)
        setValidationError(null)
        
        // If this is the first session or no session is selected, show overview
        if (sessions.length === 0) {
          setSelectedSessionId(null)
          setViewMode('analytics')
        }
      } catch {
        setValidationError(`"${file.name}" contains invalid JSON. Please upload valid llm_observability.json files.`)
      }
    }
    reader.readAsText(file)
  }, [sessions.length])

  const handleLoadSample = useCallback(async () => {
    setIsLoadingSample(true)
    setError(null)
    setValidationError(null)
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}sample_observability.json`)
      if (!response.ok) {
        throw new Error('Failed to load sample data')
      }
      const parsed = await response.json()
      
      // Validate the JSON structure
      const validation = validateObservabilityJson(parsed, 'sample_observability.json')
      if (!validation.valid) {
        setValidationError(validation.error)
        return
      }

      const newSession = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fileName: 'sample_observability.json',
        data: parsed,
        uploadedAt: Date.now()
      }
      setSessions([newSession])
      setSelectedSessionId(null)
      setViewMode('analytics')
    } catch {
      setError('Failed to load sample data. Please try again.')
    } finally {
      setIsLoadingSample(false)
    }
  }, [])

  const handleGCPImport = useCallback((importedFiles) => {
    const newSessions = importedFiles.map((file, index) => ({
      id: `${Date.now()}-gcp-${index}-${Math.random().toString(36).substr(2, 9)}`,
      fileName: file.fileName,
      data: file.data,
      uploadedAt: Date.now(),
      source: 'gcp'
    }))
    
    setSessions(prev => [...prev, ...newSessions])
    setError(null)
    setValidationError(null)
    
    if (sessions.length === 0) {
      setSelectedSessionId(null)
      setViewMode('analytics')
    }
  }, [sessions.length])

  const handleYourTracesImport = useCallback((importedSessions) => {
    setSessions(prev => [...prev, ...importedSessions])
    setError(null)
    setValidationError(null)
    
    if (sessions.length === 0) {
      setSelectedSessionId(null)
      setViewMode('analytics')
    }
  }, [sessions.length])

  const handleRemoveSession = useCallback((sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null)
    }
  }, [selectedSessionId])

  const handleClearAll = () => {
    setSessions([])
    setSelectedSessionId(null)
    setError(null)
  }

  const hasData = sessions.length > 0
  const hasFilteredData = filteredSessions.length > 0
  const isOverviewMode = selectedSessionId === null && hasFilteredData
  const hasTraceTree = filteredCurrentData?.trace_tree && filteredCurrentData.trace_tree.length > 0
  const hasEvents = (filteredCurrentData?.events && filteredCurrentData.events.length > 0) || (filteredCurrentData?.function_events && filteredCurrentData.function_events.length > 0)
  const session = currentData?.sessions?.[0]
  const displayData = filteredCurrentData || currentData

  return (
    <div className="playground">
      {/* Validation Error Popup */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            className="validation-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setValidationError(null)}
          >
            <motion.div
              className="validation-popup"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="validation-popup__icon">
                <AlertCircle size={32} />
              </div>
              <h3 className="validation-popup__title">Invalid File Format</h3>
              <p className="validation-popup__message">{validationError}</p>
              <p className="validation-popup__hint">
                This file was not generated by <strong>aiobs</strong> and is not supported.
              </p>
              <button
                className="validation-popup__btn"
                onClick={() => setValidationError(null)}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

      {/* GCP Connection Modal */}
      <AnimatePresence>
        {isGCPModalOpen && (
          <GCPConnectionModal
            isOpen={isGCPModalOpen}
            onClose={() => setIsGCPModalOpen(false)}
            onImportFiles={handleGCPImport}
          />
        )}
      </AnimatePresence>

      {/* Your Traces Modal */}
      <AnimatePresence>
        {isYourTracesModalOpen && (
          <YourTracesModal
            isOpen={isYourTracesModalOpen}
            onClose={() => setIsYourTracesModalOpen(false)}
            onImportSessions={handleYourTracesImport}
          />
        )}
      </AnimatePresence>

      <header className="playground-header">
        <div className="playground-header__left">
          <Link to="/" className="playground-header__back">
            <ArrowLeft size={18} />
          </Link>
          <div className="playground-header__title">
            <h1>Playground</h1>
            <span className="playground-header__subtitle">
              {isOverviewMode 
                ? `Analyzing ${filteredSessions.length} session${filteredSessions.length > 1 ? 's' : ''}${filteredSessions.length !== sessions.length ? ` (${sessions.length} total)` : ''}`
                : 'Visualize LLM Observability Data'
              }
            </span>
          </div>
        </div>
        {hasData && (
          <div className="playground-header__right">
            {/* Search Bar - only show on tree, list, and timeline views */}
            {(viewMode === 'tree' || viewMode === 'list' || viewMode === 'timeline') && (
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultsCount={searchResultsCount}
              />
            )}

            <div className="playground-header__view-toggle">
              {!isOverviewMode && (
                <>
                  <button
                    className={`view-toggle__btn ${viewMode === 'tree' ? 'view-toggle__btn--active' : ''}`}
                    onClick={() => setViewMode('tree')}
                    disabled={!hasTraceTree}
                  >
                    <Layers size={14} />
                    <span>Tree</span>
                  </button>
                  <button
                    className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
                    onClick={() => setViewMode('list')}
                    disabled={!hasEvents}
                  >
                    <Activity size={14} />
                    <span>List</span>
                  </button>
                </>
              )}
              <button
                className={`view-toggle__btn ${viewMode === 'analytics' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('analytics')}
              >
                <BarChart3 size={14} />
                <span>Analytics</span>
              </button>
              <button
                className={`view-toggle__btn ${viewMode === 'timeline' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('timeline')}
              >
                <LineChart size={14} />
                <span>Timeline</span>
              </button>
              <button
                className={`view-toggle__btn ${viewMode === 'enhance' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('enhance')}
              >
                <Wand2 size={14} />
                <span>Enhance</span>
              </button>
              <button
                className={`view-toggle__btn ${viewMode === 'issues' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('issues')}
              >
                <AlertTriangle size={14} />
                <span>Issues</span>
              </button>
            </div>
            <button className="playground-btn playground-btn--ghost" onClick={handleClearAll}>
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </header>

      <main className="playground-main">
        {!hasData ? (
          <div className="playground-container">
            <UploadZone
              onUpload={handleUpload}
              onLoadSample={handleLoadSample}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              isLoadingSample={isLoadingSample}
              onOpenGCPModal={() => setIsGCPModalOpen(true)}
              onOpenYourTracesModal={() => setIsYourTracesModalOpen(true)}
            />
            {error && (
              <motion.div
                className="playground-error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </div>
        ) : (
          <div className="playground-layout">
            {/* Filters and Session Sidebar */}
            <div className="playground-sidebar-wrapper">
              {/* Filters */}
              <PlaygroundFilters
                sessions={sessions}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />
              
              {/* Session Sidebar */}
              <SessionSidebar
                sessions={filteredSessions}
                selectedSession={selectedSessionId}
                onSelectSession={setSelectedSessionId}
                onRemoveSession={handleRemoveSession}
                onUpload={handleUpload}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                onOpenGCPModal={() => setIsGCPModalOpen(true)}
                onOpenYourTracesModal={() => setIsYourTracesModalOpen(true)}
              />
            </div>

            {/* Main Content */}
            <div className="playground-content-area">
              <motion.div
                className="playground-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {isOverviewMode ? (
                  <>
                    {/* Aggregated Overview */}
                    <div className="overview-header">
                      <div className="overview-header__info">
                        <h2>
                          <Files size={20} />
                          All Sessions Overview
                        </h2>
                        <p>Aggregated {viewMode === 'timeline' ? 'timeline' : 'analytics'} across {filteredSessions.length} uploaded session{filteredSessions.length > 1 ? 's' : ''}{filteredSessions.length !== sessions.length ? ` (filtered from ${sessions.length})` : ''}</p>
                      </div>
                    </div>

                    <div className="playground-viewer">
                      {viewMode === 'timeline' ? (
                        <Timeline 
                          data={{}} 
                          isAggregated={true} 
                          sessions={filteredSessions}
                        />
                      ) : viewMode === 'enhance' ? (
                        <EnhancePrompts 
                          data={{}} 
                          isAggregated={true} 
                          sessions={filteredSessions}
                        />
                      ) : viewMode === 'issues' ? (
                        <IssuesView
                          data={{}}
                          isAggregated={true}
                          sessions={filteredSessions}
                          initialFilter={issuesFilter}
                          onBack={() => setViewMode('analytics')}
                        />
                      ) : (
                        <Analytics 
                          data={{}} 
                          isAggregated={true} 
                          sessions={filteredSessions}
                          onNavigateToIssues={(filter) => {
                            setIssuesFilter(filter)
                            setViewMode('issues')
                          }}
                        />
                      )}
                    </div>
                  </>
                ) : !hasFilteredData ? (
                  <div className="playground-empty playground-empty--filtered">
                    <AlertCircle size={24} />
                    <p>No sessions match the current filters.</p>
                    <button 
                      className="playground-btn playground-btn--ghost"
                      onClick={() => setActiveFilters({})}
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Single Session View */}
                    <SessionInfo session={session} />
                    <StatsBar data={currentData} />

                    <div className="playground-viewer">
                      {viewMode === 'timeline' ? (
                        <Timeline data={currentData} />
                      ) : viewMode === 'enhance' ? (
                        <EnhancePrompts data={currentData} />
                      ) : viewMode === 'issues' ? (
                        <IssuesView
                          data={currentData}
                          initialFilter={issuesFilter}
                          onBack={() => setViewMode('analytics')}
                        />
                      ) : viewMode === 'analytics' ? (
                        <Analytics 
                          data={currentData}
                          onNavigateToIssues={(filter) => {
                            setIssuesFilter(filter)
                            setViewMode('issues')
                          }}
                        />
                      ) : viewMode === 'tree' && hasTraceTree ? (
                        <div className="trace-tree">
                          <div className="trace-tree__header">
                            <h3>
                              <Layers size={16} />
                              Trace Tree
                              {searchQuery && (
                                <span className="trace-tree__search-badge">
                                  Filtered
                                </span>
                              )}
                            </h3>
                            <span className="trace-tree__count">
                              {displayData.trace_tree.length} root {displayData.trace_tree.length === 1 ? 'trace' : 'traces'}
                            </span>
                          </div>
                          <div className="trace-tree__body">
                            {displayData.trace_tree.map((trace, i) => (
                              <TreeNode key={trace.span_id || i} node={trace} index={i} searchQuery={searchQuery} />
                            ))}
                          </div>
                        </div>
                      ) : viewMode === 'list' && hasEvents ? (
                        <div className="events-list">
                          {displayData.events && displayData.events.length > 0 && (
                            <div className="events-section">
                              <h3 className="events-section__title">
                                <Cpu size={16} />
                                Provider Events
                                <span className="events-section__count">{displayData.events.length}</span>
                              </h3>
                              <div className="events-section__body">
                                {displayData.events.map((event, i) => (
                                  <EventCard key={event.span_id || i} event={event} index={i} searchQuery={searchQuery} />
                                ))}
                              </div>
                            </div>
                          )}

                          {displayData.function_events && displayData.function_events.length > 0 && (
                            <div className="events-section">
                              <h3 className="events-section__title">
                                <Terminal size={16} />
                                Function Events
                                <span className="events-section__count">{displayData.function_events.length}</span>
                              </h3>
                              <div className="events-section__body">
                                {displayData.function_events.map((event, i) => (
                                  <EventCard key={event.span_id || i} event={event} index={i} searchQuery={searchQuery} />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="playground-empty">
                          <AlertCircle size={24} />
                          <p>No trace data available in this file.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
