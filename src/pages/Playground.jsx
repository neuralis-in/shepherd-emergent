import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  FileJson,
  ChevronRight,
  ChevronDown,
  Clock,
  Cpu,
  Code,
  Box,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Layers,
  Activity,
  Terminal,
  X,
  Eye
} from 'lucide-react'
import './Playground.css'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
}

// Tree Node Component
function TreeNode({ node, depth = 0, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  const getNodeIcon = () => {
    if (node.event_type === 'function' || node.provider === 'function') {
      return <Terminal size={14} />
    }
    return <Cpu size={14} />
  }

  const getStatusColor = () => {
    if (node.error) return 'error'
    if (node.response?.text || node.result) return 'success'
    return 'default'
  }

  const formatDuration = (ms) => {
    if (!ms) return '—'
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getNodeLabel = () => {
    if (node.name) return node.name
    if (node.api) return node.api
    return node.provider || 'Unknown'
  }

  const getNodeSublabel = () => {
    if (node.request?.model) return node.request.model
    if (node.module && node.module !== '__main__') return node.module
    return null
  }

  return (
    <motion.div
      className="tree-node"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div
        className={`tree-node__content tree-node__content--${getStatusColor()}`}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button
            className="tree-node__toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="tree-node__toggle tree-node__toggle--empty" />
        )}

        <div className={`tree-node__icon tree-node__icon--${node.event_type || node.provider}`}>
          {getNodeIcon()}
        </div>

        <div className="tree-node__info">
          <span className="tree-node__label">{getNodeLabel()}</span>
          {getNodeSublabel() && (
            <span className="tree-node__sublabel">{getNodeSublabel()}</span>
          )}
        </div>

        <div className="tree-node__meta">
          {node.duration_ms && (
            <span className="tree-node__duration">
              <Clock size={12} />
              {formatDuration(node.duration_ms)}
            </span>
          )}
          <span className={`tree-node__status tree-node__status--${getStatusColor()}`}>
            {node.error ? (
              <XCircle size={14} />
            ) : (
              <CheckCircle size={14} />
            )}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            className="tree-node__children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child, i) => (
              <TreeNode key={child.span_id || i} node={child} depth={depth + 1} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable details panel */}
      <NodeDetails node={node} depth={depth} />
    </motion.div>
  )
}

// Node Details Component
function NodeDetails({ node, depth }) {
  const [isOpen, setIsOpen] = useState(false)

  const hasDetails = node.request || node.response || node.result || node.error

  if (!hasDetails) return null

  return (
    <div className="node-details" style={{ marginLeft: `${depth * 24 + 36}px` }}>
      <button
        className="node-details__toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Eye size={12} />
        {isOpen ? 'Hide details' : 'Show details'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="node-details__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {node.request && (
              <div className="node-details__section">
                <h4>Request</h4>
                {node.request.contents && (
                  <div className="node-details__field">
                    <span className="node-details__field-label">Prompt:</span>
                    <p className="node-details__field-value">{node.request.contents}</p>
                  </div>
                )}
                {node.request.model && (
                  <div className="node-details__field">
                    <span className="node-details__field-label">Model:</span>
                    <code>{node.request.model}</code>
                  </div>
                )}
                {node.request.config && (
                  <div className="node-details__field">
                    <span className="node-details__field-label">Config:</span>
                    <pre className="node-details__code">
                      {JSON.stringify(node.request.config, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {node.response && (
              <div className="node-details__section">
                <h4>Response</h4>
                {node.response.text && (
                  <div className="node-details__field">
                    <span className="node-details__field-label">Output:</span>
                    <p className="node-details__field-value node-details__field-value--output">
                      {node.response.text}
                    </p>
                  </div>
                )}
                {node.response.usage && (
                  <div className="node-details__usage">
                    <div className="node-details__usage-item">
                      <span>Input tokens</span>
                      <strong>{node.response.usage.prompt_token_count || 0}</strong>
                    </div>
                    <div className="node-details__usage-item">
                      <span>Output tokens</span>
                      <strong>{node.response.usage.candidates_token_count || 0}</strong>
                    </div>
                    <div className="node-details__usage-item">
                      <span>Total tokens</span>
                      <strong>{node.response.usage.total_token_count || 0}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {node.result && (
              <div className="node-details__section">
                <h4>Result</h4>
                <p className="node-details__field-value node-details__field-value--output">
                  {typeof node.result === 'string' ? node.result : JSON.stringify(node.result, null, 2)}
                </p>
              </div>
            )}

            {node.error && (
              <div className="node-details__section node-details__section--error">
                <h4>Error</h4>
                <pre className="node-details__code node-details__code--error">
                  {typeof node.error === 'string' ? node.error : JSON.stringify(node.error, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Event Card Component (for flat event list)
function EventCard({ event, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getEventIcon = () => {
    if (event.provider === 'function') return <Terminal size={16} />
    return <Cpu size={16} />
  }

  const formatDuration = (ms) => {
    if (!ms) return '—'
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  return (
    <motion.div
      className="event-card"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
    >
      <div className="event-card__header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className={`event-card__icon event-card__icon--${event.provider}`}>
          {getEventIcon()}
        </div>
        <div className="event-card__info">
          <span className="event-card__api">{event.api || event.name}</span>
          {event.request?.model && (
            <span className="event-card__model">{event.request.model}</span>
          )}
        </div>
        <div className="event-card__meta">
          <span className="event-card__duration">
            <Clock size={12} />
            {formatDuration(event.duration_ms)}
          </span>
          <span className={`event-card__status ${event.error ? 'event-card__status--error' : ''}`}>
            {event.error ? <XCircle size={14} /> : <CheckCircle size={14} />}
          </span>
          <button className="event-card__expand">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="event-card__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {event.request?.contents && (
              <div className="event-card__section">
                <h4>Input</h4>
                <p className="event-card__text">{event.request.contents}</p>
              </div>
            )}
            {event.response?.text && (
              <div className="event-card__section">
                <h4>Output</h4>
                <p className="event-card__text event-card__text--output">{event.response.text}</p>
              </div>
            )}
            {event.result && (
              <div className="event-card__section">
                <h4>Result</h4>
                <p className="event-card__text event-card__text--output">
                  {typeof event.result === 'string' ? event.result : JSON.stringify(event.result)}
                </p>
              </div>
            )}
            {event.response?.usage && (
              <div className="event-card__usage">
                <span>Tokens: {event.response.usage.total_token_count || 0}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Session Info Component
function SessionInfo({ session }) {
  if (!session) return null

  const formatDate = (timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  const getDuration = () => {
    if (!session.started_at || !session.ended_at) return '—'
    const duration = (session.ended_at - session.started_at) * 1000
    if (duration < 1000) return `${duration.toFixed(0)}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  return (
    <div className="session-info">
      <div className="session-info__header">
        <Activity size={16} />
        <span className="session-info__name">{session.name || 'Session'}</span>
      </div>
      <div className="session-info__details">
        <div className="session-info__item">
          <span className="session-info__label">Started</span>
          <span className="session-info__value">{formatDate(session.started_at)}</span>
        </div>
        <div className="session-info__item">
          <span className="session-info__label">Duration</span>
          <span className="session-info__value">{getDuration()}</span>
        </div>
        {session.meta?.cwd && (
          <div className="session-info__item">
            <span className="session-info__label">Working Dir</span>
            <code className="session-info__code">{session.meta.cwd}</code>
          </div>
        )}
      </div>
    </div>
  )
}

// Upload Zone Component
function UploadZone({ onUpload, isDragging, setIsDragging }) {
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [setIsDragging])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [setIsDragging])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/json') {
      onUpload(file)
    }
  }, [onUpload, setIsDragging])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
    }
  }, [onUpload])

  return (
    <motion.div
      className={`upload-zone ${isDragging ? 'upload-zone--dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="upload-zone__content">
        <div className="upload-zone__icon">
          <FileJson size={48} />
        </div>
        <h2 className="upload-zone__title">Upload Observability Data</h2>
        <p className="upload-zone__desc">
          Drag & drop your <code>llm_observability.json</code> file here, or click to browse
        </p>
        <label className="upload-zone__button">
          <Upload size={18} />
          Select File
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            hidden
          />
        </label>
        <span className="upload-zone__hint">
          Supports JSON files exported from aiobs
        </span>
      </div>
      <div className="upload-zone__pattern" />
    </motion.div>
  )
}

// Stats Bar Component
function StatsBar({ data }) {
  const eventCount = (data.events?.length || 0) + (data.function_events?.length || 0)
  const traceCount = data.trace_tree?.length || 0

  const totalDuration = data.events?.reduce((acc, e) => acc + (e.duration_ms || 0), 0) || 0
  const totalTokens = data.events?.reduce((acc, e) => acc + (e.response?.usage?.total_token_count || 0), 0) || 0

  return (
    <div className="stats-bar">
      <div className="stats-bar__item">
        <Layers size={16} />
        <span className="stats-bar__value">{traceCount || eventCount}</span>
        <span className="stats-bar__label">{traceCount ? 'Traces' : 'Events'}</span>
      </div>
      <div className="stats-bar__item">
        <Clock size={16} />
        <span className="stats-bar__value">
          {totalDuration < 1000 ? `${totalDuration.toFixed(0)}ms` : `${(totalDuration / 1000).toFixed(2)}s`}
        </span>
        <span className="stats-bar__label">Total Time</span>
      </div>
      <div className="stats-bar__item">
        <Zap size={16} />
        <span className="stats-bar__value">{totalTokens.toLocaleString()}</span>
        <span className="stats-bar__label">Tokens</span>
      </div>
    </div>
  )
}

// Main Playground Component
export default function Playground() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState('tree') // 'tree' or 'list'

  const handleUpload = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        setData(parsed)
        setError(null)
        // Set view mode based on data
        if (parsed.trace_tree && parsed.trace_tree.length > 0) {
          setViewMode('tree')
        } else {
          setViewMode('list')
        }
      } catch (err) {
        setError('Invalid JSON file. Please upload a valid llm_observability.json file.')
        setData(null)
      }
    }
    reader.readAsText(file)
  }, [])

  const handleClear = () => {
    setData(null)
    setError(null)
  }

  const session = data?.sessions?.[0]
  const hasTraceTree = data?.trace_tree && data.trace_tree.length > 0
  const hasEvents = (data?.events && data.events.length > 0) || (data?.function_events && data.function_events.length > 0)

  return (
    <div className="playground">
      <header className="playground-header">
        <div className="playground-header__left">
          <Link to="/" className="playground-header__back">
            <ArrowLeft size={18} />
          </Link>
          <div className="playground-header__title">
            <h1>Playground</h1>
            <span className="playground-header__subtitle">Visualize LLM Observability Data</span>
          </div>
        </div>
        {data && (
          <div className="playground-header__right">
            <div className="playground-header__view-toggle">
              <button
                className={`view-toggle__btn ${viewMode === 'tree' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('tree')}
                disabled={!hasTraceTree}
              >
                <Layers size={14} />
                Tree
              </button>
              <button
                className={`view-toggle__btn ${viewMode === 'list' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                disabled={!hasEvents}
              >
                <Activity size={14} />
                List
              </button>
            </div>
            <button className="playground-btn playground-btn--ghost" onClick={handleClear}>
              <X size={14} />
              Clear
            </button>
          </div>
        )}
      </header>

      <main className="playground-main">
        <div className="playground-container">
          {!data ? (
            <>
              <UploadZone
                onUpload={handleUpload}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
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
            </>
          ) : (
            <motion.div
              className="playground-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SessionInfo session={session} />
              <StatsBar data={data} />

              <div className="playground-viewer">
                {viewMode === 'tree' && hasTraceTree ? (
                  <div className="trace-tree">
                    <div className="trace-tree__header">
                      <h3>
                        <Layers size={16} />
                        Trace Tree
                      </h3>
                      <span className="trace-tree__count">
                        {data.trace_tree.length} root {data.trace_tree.length === 1 ? 'trace' : 'traces'}
                      </span>
                    </div>
                    <div className="trace-tree__body">
                      {data.trace_tree.map((trace, i) => (
                        <TreeNode key={trace.span_id || i} node={trace} index={i} />
                      ))}
                    </div>
                  </div>
                ) : viewMode === 'list' && hasEvents ? (
                  <div className="events-list">
                    {data.events && data.events.length > 0 && (
                      <div className="events-section">
                        <h3 className="events-section__title">
                          <Cpu size={16} />
                          Provider Events
                          <span className="events-section__count">{data.events.length}</span>
                        </h3>
                        <div className="events-section__body">
                          {data.events.map((event, i) => (
                            <EventCard key={event.span_id || i} event={event} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {data.function_events && data.function_events.length > 0 && (
                      <div className="events-section">
                        <h3 className="events-section__title">
                          <Terminal size={16} />
                          Function Events
                          <span className="events-section__count">{data.function_events.length}</span>
                        </h3>
                        <div className="events-section__body">
                          {data.function_events.map((event, i) => (
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
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

