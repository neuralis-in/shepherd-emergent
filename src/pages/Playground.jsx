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
  Terminal
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
  SessionSidebar,
  validateObservabilityJson
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

  const selectedSession = useMemo(() => {
    if (selectedSessionId === null) return null
    return sessions.find(s => s.id === selectedSessionId)
  }, [sessions, selectedSessionId])

  const currentData = selectedSession?.data || null

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
  const isOverviewMode = selectedSessionId === null && hasData
  const hasTraceTree = currentData?.trace_tree && currentData.trace_tree.length > 0
  const hasEvents = (currentData?.events && currentData.events.length > 0) || (currentData?.function_events && currentData.function_events.length > 0)
  const session = currentData?.sessions?.[0]

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

      <header className="playground-header">
        <div className="playground-header__left">
          <Link to="/" className="playground-header__back">
            <ArrowLeft size={18} />
          </Link>
          <div className="playground-header__title">
            <h1>Playground</h1>
            <span className="playground-header__subtitle">
              {isOverviewMode 
                ? `Analyzing ${sessions.length} session${sessions.length > 1 ? 's' : ''}`
                : 'Visualize LLM Observability Data'
              }
            </span>
          </div>
        </div>
        {hasData && (
          <div className="playground-header__right">
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
            {/* Session Sidebar */}
            <SessionSidebar
              sessions={sessions}
              selectedSession={selectedSessionId}
              onSelectSession={setSelectedSessionId}
              onRemoveSession={handleRemoveSession}
              onUpload={handleUpload}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              onOpenGCPModal={() => setIsGCPModalOpen(true)}
            />

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
                        <p>Aggregated {viewMode === 'timeline' ? 'timeline' : 'analytics'} across {sessions.length} uploaded session{sessions.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="playground-viewer">
                      {viewMode === 'timeline' ? (
                        <Timeline 
                          data={{}} 
                          isAggregated={true} 
                          sessions={sessions}
                        />
                      ) : viewMode === 'enhance' ? (
                        <EnhancePrompts 
                          data={{}} 
                          isAggregated={true} 
                          sessions={sessions}
                        />
                      ) : (
                        <Analytics 
                          data={{}} 
                          isAggregated={true} 
                          sessions={sessions}
                        />
                      )}
                    </div>
                  </>
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
                      ) : viewMode === 'analytics' ? (
                        <Analytics data={currentData} />
                      ) : viewMode === 'tree' && hasTraceTree ? (
                        <div className="trace-tree">
                          <div className="trace-tree__header">
                            <h3>
                              <Layers size={16} />
                              Trace Tree
                            </h3>
                            <span className="trace-tree__count">
                              {currentData.trace_tree.length} root {currentData.trace_tree.length === 1 ? 'trace' : 'traces'}
                            </span>
                          </div>
                          <div className="trace-tree__body">
                            {currentData.trace_tree.map((trace, i) => (
                              <TreeNode key={trace.span_id || i} node={trace} index={i} />
                            ))}
                          </div>
                        </div>
                      ) : viewMode === 'list' && hasEvents ? (
                        <div className="events-list">
                          {currentData.events && currentData.events.length > 0 && (
                            <div className="events-section">
                              <h3 className="events-section__title">
                                <Cpu size={16} />
                                Provider Events
                                <span className="events-section__count">{currentData.events.length}</span>
                              </h3>
                              <div className="events-section__body">
                                {currentData.events.map((event, i) => (
                                  <EventCard key={event.span_id || i} event={event} index={i} />
                                ))}
                              </div>
                            </div>
                          )}

                          {currentData.function_events && currentData.function_events.length > 0 && (
                            <div className="events-section">
                              <h3 className="events-section__title">
                                <Terminal size={16} />
                                Function Events
                                <span className="events-section__count">{currentData.function_events.length}</span>
                              </h3>
                              <div className="events-section__body">
                                {currentData.function_events.map((event, i) => (
                                  <EventCard key={event.span_id || i} event={event} index={i} />
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
