import { useState, useCallback, useMemo } from 'react'
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
  Box,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Layers,
  Activity,
  Terminal,
  X,
  Eye,
  Play,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Timer,
  Gauge,
  Hash,
  Database,
  HardDrive,
  FolderOpen,
  Files,
  ChevronLeft,
  Trash2,
  Plus,
  LineChart,
  Circle,
  Cloud
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
function UploadZone({ onUpload, onLoadSample, isDragging, setIsDragging, isLoadingSample }) {
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
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/json' || f.name.endsWith('.json'))
    if (files.length > 0) {
      files.forEach(file => onUpload(file))
    }
  }, [onUpload, setIsDragging])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => onUpload(file))
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
          Drag & drop your <code>llm_observability.json</code> files here, or click to browse
        </p>
        <div className="upload-zone__actions">
          <label className="upload-zone__button">
            <Upload size={18} />
            Select Files
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              multiple
              hidden
            />
          </label>
          <button 
            className="upload-zone__sample-btn"
            onClick={onLoadSample}
            disabled={isLoadingSample}
          >
            <Play size={18} />
            {isLoadingSample ? 'Loading...' : 'Use Sample Data'}
          </button>
        </div>
        <span className="upload-zone__hint">
          Supports multiple JSON files exported from aiobs
        </span>

        <div className="upload-zone__cloud-teaser">
          <div className="upload-zone__cloud-divider">
            <span>or</span>
          </div>
          <Link to="/integrations" className="upload-zone__cloud-link">
            <Cloud size={18} className="upload-zone__cloud-icon" />
            <span className="upload-zone__cloud-title">Cloud Integration</span>
            <span className="upload-zone__cloud-badge">Coming Soon</span>
            <ChevronRight size={16} className="upload-zone__cloud-arrow" />
          </Link>
        </div>
      </div>
      <div className="upload-zone__pattern" />
    </motion.div>
  )
}

// Stats Bar Component
function StatsBar({ data }) {
  const eventCount = (data.events?.length || 0) + (data.function_events?.length || 0)

  const totalDuration = data.events?.reduce((acc, e) => acc + (e.duration_ms || 0), 0) || 0
  const totalTokens = data.events?.reduce((acc, e) => acc + (e.response?.usage?.total_token_count || 0), 0) || 0

  return (
    <div className="stats-bar">
      <div className="stats-bar__item">
        <Layers size={16} />
        <span className="stats-bar__value">{eventCount}</span>
        <span className="stats-bar__label">Traces</span>
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

// Expandable Prompt Card Component for Analytics
function PromptCard({ event, index, variant = 'default', formatDuration, sessionName }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const truncatePrompt = (prompt, maxLen = 50) => {
    if (!prompt || prompt === 'N/A') return 'N/A'
    if (prompt.length <= maxLen) return prompt
    return prompt.substring(0, maxLen) + '...'
  }

  return (
    <motion.div
      className={`prompt-item prompt-item--${variant} ${isExpanded ? 'prompt-item--expanded' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="prompt-item__header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="prompt-item__rank">#{index + 1}</div>
        <div className="prompt-item__content">
          <span className="prompt-item__text">{truncatePrompt(event.prompt)}</span>
          <div className="prompt-item__meta">
            {variant === 'tokens' && (
              <span className="prompt-item__tokens-highlight">{event.tokens?.toLocaleString()} tokens</span>
            )}
            <span className="prompt-item__duration">{formatDuration(event.duration_ms)}</span>
            {variant !== 'tokens' && (
              <span className="prompt-item__tokens">{event.tokens} tokens</span>
            )}
            {variant === 'tokens' && event.model && (
              <span className="prompt-item__model">{event.model}</span>
            )}
            {sessionName && (
              <span className="prompt-item__session-tag">{sessionName}</span>
            )}
          </div>
        </div>
        <div className="prompt-item__expand">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="prompt-item__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="prompt-item__details">
              <div className="prompt-item__detail-section">
                <h4>Prompt</h4>
                <p className="prompt-item__full-text">{event.prompt || 'N/A'}</p>
              </div>

              {event.response?.text && (
                <div className="prompt-item__detail-section">
                  <h4>Response</h4>
                  <p className="prompt-item__full-text prompt-item__full-text--response">
                    {event.response.text}
                  </p>
                </div>
              )}

              <div className="prompt-item__detail-stats">
                <div className="prompt-item__detail-stat">
                  <span className="prompt-item__detail-stat-label">Duration</span>
                  <span className="prompt-item__detail-stat-value">{formatDuration(event.duration_ms)}</span>
                </div>
                <div className="prompt-item__detail-stat">
                  <span className="prompt-item__detail-stat-label">Input Tokens</span>
                  <span className="prompt-item__detail-stat-value">{event.inputTokens?.toLocaleString() || 0}</span>
                </div>
                <div className="prompt-item__detail-stat">
                  <span className="prompt-item__detail-stat-label">Output Tokens</span>
                  <span className="prompt-item__detail-stat-value">{event.outputTokens?.toLocaleString() || 0}</span>
                </div>
                <div className="prompt-item__detail-stat">
                  <span className="prompt-item__detail-stat-label">Total Tokens</span>
                  <span className="prompt-item__detail-stat-value">{event.tokens?.toLocaleString() || 0}</span>
                </div>
                {event.model && (
                  <div className="prompt-item__detail-stat">
                    <span className="prompt-item__detail-stat-label">Model</span>
                    <span className="prompt-item__detail-stat-value">{event.model}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Model pricing (per 1M tokens) - approximate costs
const MODEL_PRICING = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-4': { input: 30.00, output: 60.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'gemini-2.0-flash': { input: 0.10, output: 0.40 },
  'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  'gemini-1.5-pro': { input: 1.25, output: 5.00 },
  'gemini-pro': { input: 0.50, output: 1.50 },
  'claude-3-opus': { input: 15.00, output: 75.00 },
  'claude-3-sonnet': { input: 3.00, output: 15.00 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
  'default': { input: 1.00, output: 3.00 }
}

// Helper function to extract all LLM events from trace tree
function extractLLMEvents(traceTree, events = [], sessionName = null) {
  if (!traceTree) return events
  
  for (const node of traceTree) {
    // Check if this is an LLM call (has provider and response)
    if (node.provider && node.provider !== 'function' && node.duration_ms) {
      const usage = node.response?.usage || {}
      events.push({
        ...node,
        prompt: node.request?.contents || node.request?.messages?.[0]?.content || 'N/A',
        tokens: usage.total_token_count || 0,
        inputTokens: usage.prompt_token_count || 0,
        outputTokens: usage.candidates_token_count || usage.completion_tokens || 0,
        cachedTokens: usage.cached_content_token_count || usage.cached_tokens || 0,
        reasoningTokens: usage.thoughts_token_count || usage.reasoning_tokens || 0,
        toolUseTokens: usage.tool_use_prompt_token_count || 0,
        model: node.request?.model || 'unknown',
        sessionName
      })
    }
    // Recursively process children
    if (node.children && node.children.length > 0) {
      extractLLMEvents(node.children, events, sessionName)
    }
  }
  
  return events
}

// Timeline Component
function Timeline({ data, isAggregated = false, sessions = [] }) {
  const [selectedMetric, setSelectedMetric] = useState('duration')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Extract all events with timestamps
  const timelineEvents = useMemo(() => {
    let allEvents = []
    
    if (isAggregated && sessions.length > 0) {
      sessions.forEach(session => {
        const sessionName = session.data.sessions?.[0]?.name || session.fileName
        if (session.data.trace_tree) {
          extractLLMEvents(session.data.trace_tree, allEvents, sessionName)
        } else {
          const events = (session.data.events || []).filter(e => e.provider !== 'function').map(e => {
            const usage = e.response?.usage || {}
            return {
              ...e,
              prompt: e.request?.contents || 'N/A',
              tokens: usage.total_token_count || 0,
              inputTokens: usage.prompt_token_count || 0,
              outputTokens: usage.candidates_token_count || usage.completion_tokens || 0,
              model: e.request?.model || 'unknown',
              sessionName
            }
          })
          allEvents = [...allEvents, ...events]
        }
      })
    } else if (data.trace_tree) {
      allEvents = extractLLMEvents(data.trace_tree)
    } else {
      allEvents = (data.events || []).filter(e => e.provider !== 'function').map(e => {
        const usage = e.response?.usage || {}
        return {
          ...e,
          prompt: e.request?.contents || 'N/A',
          tokens: usage.total_token_count || 0,
          inputTokens: usage.prompt_token_count || 0,
          outputTokens: usage.candidates_token_count || usage.completion_tokens || 0,
          model: e.request?.model || 'unknown'
        }
      })
    }

    // Sort by start time
    return allEvents.sort((a, b) => (a.started_at || 0) - (b.started_at || 0))
  }, [data, isAggregated, sessions])

  if (timelineEvents.length === 0) {
    return (
      <div className="analytics-empty">
        <LineChart size={24} />
        <p>No events found for timeline visualization.</p>
      </div>
    )
  }

  const formatDuration = (ms) => {
    if (!ms) return '0ms'
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp * 1000)
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  // Cost calculation helper
  const calculateEventCost = (event) => {
    const model = event.model?.toLowerCase() || 'default'
    const pricing = Object.entries(MODEL_PRICING).find(([key]) => model.includes(key))?.[1] || MODEL_PRICING.default
    const inputCost = ((event.inputTokens || 0) / 1_000_000) * pricing.input
    const outputCost = ((event.outputTokens || 0) / 1_000_000) * pricing.output
    return inputCost + outputCost
  }

  // Calculate metrics for charts
  const maxDuration = Math.max(...timelineEvents.map(e => e.duration_ms || 0))
  const maxTokens = Math.max(...timelineEvents.map(e => e.tokens || 0))
  const maxInputTokens = Math.max(...timelineEvents.map(e => e.inputTokens || 0))
  const maxOutputTokens = Math.max(...timelineEvents.map(e => e.outputTokens || 0))
  const maxCost = Math.max(...timelineEvents.map(e => calculateEventCost(e)))

  // Cumulative data
  const cumulativeData = timelineEvents.reduce((acc, event, index) => {
    const prev = acc[index - 1] || { totalDuration: 0, totalTokens: 0, totalCost: 0, totalRequests: 0 }
    acc.push({
      ...event,
      totalDuration: prev.totalDuration + (event.duration_ms || 0),
      totalTokens: prev.totalTokens + (event.tokens || 0),
      totalCost: prev.totalCost + calculateEventCost(event),
      totalRequests: prev.totalRequests + 1,
      index
    })
    return acc
  }, [])

  const totalDuration = cumulativeData[cumulativeData.length - 1]?.totalDuration || 0
  const totalTokens = cumulativeData[cumulativeData.length - 1]?.totalTokens || 0
  const totalCost = cumulativeData[cumulativeData.length - 1]?.totalCost || 0

  // Get unique models for color coding
  const models = [...new Set(timelineEvents.map(e => e.model))]
  const modelColors = {
    'gemini-2.5-pro': '#4285F4',
    'gemini-2.0-flash': '#34A853',
    'gemini-1.5-pro': '#FBBC05',
    'gemini-1.5-flash': '#EA4335',
    'gpt-4o': '#10A37F',
    'gpt-4o-mini': '#74AA9C',
    'gpt-4-turbo': '#00A67E',
    'gpt-4': '#19C37D',
    'gpt-3.5-turbo': '#5AB8A3',
    'claude-3-opus': '#D97706',
    'claude-3-sonnet': '#F59E0B',
    'claude-3-haiku': '#FBBF24',
    'unknown': '#9CA3AF'
  }

  const getModelColor = (model) => {
    const key = Object.keys(modelColors).find(k => model?.toLowerCase().includes(k))
    return modelColors[key] || modelColors.unknown
  }

  const metrics = [
    { id: 'duration', label: 'Duration', icon: Timer },
    { id: 'tokens', label: 'Total Tokens', icon: Hash },
    { id: 'inputTokens', label: 'Input Tokens', icon: TrendingUp },
    { id: 'outputTokens', label: 'Output Tokens', icon: TrendingDown },
    { id: 'cost', label: 'Cost', icon: DollarSign },
  ]

  const getMetricValue = (event) => {
    switch (selectedMetric) {
      case 'duration': return event.duration_ms || 0
      case 'tokens': return event.tokens || 0
      case 'inputTokens': return event.inputTokens || 0
      case 'outputTokens': return event.outputTokens || 0
      case 'cost': return calculateEventCost(event)
      default: return 0
    }
  }

  const getMaxMetricValue = () => {
    switch (selectedMetric) {
      case 'duration': return maxDuration
      case 'tokens': return maxTokens
      case 'inputTokens': return maxInputTokens
      case 'outputTokens': return maxOutputTokens
      case 'cost': return maxCost
      default: return 1
    }
  }

  const formatMetricValue = (value) => {
    if (selectedMetric === 'duration') return formatDuration(value)
    if (selectedMetric === 'cost') return `$${value.toFixed(4)}`
    return value.toLocaleString()
  }

  return (
    <div className="timeline">
      {/* Aggregated Banner */}
      {isAggregated && (
        <div className="analytics-banner">
          <Files size={18} />
          <span>Showing timeline across <strong>{sessions.length} sessions</strong></span>
        </div>
      )}

      {/* Summary Stats */}
      <div className="timeline-summary">
        <div className="timeline-summary__item">
          <span className="timeline-summary__label">Total Requests</span>
          <span className="timeline-summary__value">{timelineEvents.length}</span>
        </div>
        <div className="timeline-summary__item">
          <span className="timeline-summary__label">Total Duration</span>
          <span className="timeline-summary__value">{formatDuration(totalDuration)}</span>
        </div>
        <div className="timeline-summary__item">
          <span className="timeline-summary__label">Total Tokens</span>
          <span className="timeline-summary__value">{totalTokens.toLocaleString()}</span>
        </div>
        <div className="timeline-summary__item">
          <span className="timeline-summary__label">Total Cost</span>
          <span className="timeline-summary__value timeline-summary__value--cost">${totalCost.toFixed(4)}</span>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="timeline-controls">
        <span className="timeline-controls__label">Metric:</span>
        <div className="timeline-controls__options">
          {metrics.map(metric => (
            <button
              key={metric.id}
              className={`timeline-controls__btn ${selectedMetric === metric.id ? 'timeline-controls__btn--active' : ''}`}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <metric.icon size={14} />
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="timeline-section">
        <h3 className="timeline-section__title">
          <BarChart3 size={16} />
          {metrics.find(m => m.id === selectedMetric)?.label} per Request
        </h3>
        <div className="timeline-chart">
          <div className="timeline-chart__bars">
            {timelineEvents.map((event, index) => {
              const value = getMetricValue(event)
              const maxValue = getMaxMetricValue()
              const height = maxValue > 0 ? (value / maxValue) * 100 : 0
              const isHovered = hoveredPoint === index

              return (
                <div
                  key={index}
                  className={`timeline-chart__bar-wrapper ${isHovered ? 'timeline-chart__bar-wrapper--hovered' : ''}`}
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <div
                    className="timeline-chart__bar"
                    style={{ 
                      height: `${Math.max(height, 2)}%`,
                      backgroundColor: getModelColor(event.model)
                    }}
                  />
                  {isHovered && (
                    <div className="timeline-chart__tooltip">
                      <div className="timeline-chart__tooltip-header">
                        <span className="timeline-chart__tooltip-model" style={{ color: getModelColor(event.model) }}>
                          {event.model}
                        </span>
                        <span className="timeline-chart__tooltip-time">{formatTime(event.started_at)}</span>
                      </div>
                      <div className="timeline-chart__tooltip-value">
                        {formatMetricValue(value)}
                      </div>
                      {event.sessionName && (
                        <div className="timeline-chart__tooltip-session">{event.sessionName}</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="timeline-chart__axis">
            <span>Request #{1}</span>
            <span>Request #{timelineEvents.length}</span>
          </div>
        </div>
      </div>

      {/* Cumulative Chart */}
      <div className="timeline-section">
        <h3 className="timeline-section__title">
          <TrendingUp size={16} />
          Cumulative {selectedMetric === 'duration' ? 'Duration' : selectedMetric === 'cost' ? 'Cost' : 'Tokens'}
        </h3>
        <div className="timeline-cumulative">
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="timeline-cumulative__svg">
            {/* Grid lines */}
            <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#E5E7EB" strokeWidth="0.5" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="#E5E7EB" strokeWidth="0.5" />
            <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#E5E7EB" strokeWidth="0.5" />
            
            {/* Area */}
            <path
              d={`M 0 50 ${cumulativeData.map((d, i) => {
                const x = cumulativeData.length > 1 ? (i / (cumulativeData.length - 1)) * 100 : 50
                const maxCumulative = selectedMetric === 'duration' ? totalDuration : selectedMetric === 'cost' ? totalCost : totalTokens
                const value = selectedMetric === 'duration' ? d.totalDuration : selectedMetric === 'cost' ? d.totalCost : d.totalTokens
                const y = 50 - (maxCumulative > 0 ? (value / maxCumulative) * 45 : 0)
                return `L ${x} ${y}`
              }).join(' ')} L 100 50 Z`}
              fill={selectedMetric === 'cost' ? 'url(#cumulativeGradientCost)' : 'url(#cumulativeGradient)'}
            />
            
            {/* Line */}
            <path
              d={`M ${cumulativeData.map((d, i) => {
                const x = cumulativeData.length > 1 ? (i / (cumulativeData.length - 1)) * 100 : 50
                const maxCumulative = selectedMetric === 'duration' ? totalDuration : selectedMetric === 'cost' ? totalCost : totalTokens
                const value = selectedMetric === 'duration' ? d.totalDuration : selectedMetric === 'cost' ? d.totalCost : d.totalTokens
                const y = 50 - (maxCumulative > 0 ? (value / maxCumulative) * 45 : 0)
                return `${i === 0 ? '' : 'L '}${x} ${y}`
              }).join(' ')}`}
              fill="none"
              stroke={selectedMetric === 'cost' ? '#10B981' : '#6366F1'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="cumulativeGradientCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
          <div className="timeline-cumulative__labels">
            <span>{selectedMetric === 'cost' ? '$0' : '0'}</span>
            <span>
              {selectedMetric === 'duration' 
                ? formatDuration(totalDuration) 
                : selectedMetric === 'cost' 
                  ? `$${totalCost.toFixed(4)}`
                  : totalTokens.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Model Distribution Over Time */}
      <div className="timeline-section">
        <h3 className="timeline-section__title">
          <Layers size={16} />
          Model Usage Timeline
        </h3>
        <div className="timeline-models">
          <div className="timeline-models__legend">
            {models.map(model => (
              <div key={model} className="timeline-models__legend-item">
                <span 
                  className="timeline-models__legend-dot" 
                  style={{ backgroundColor: getModelColor(model) }}
                />
                <span className="timeline-models__legend-label">{model}</span>
              </div>
            ))}
          </div>
          <div className="timeline-models__track">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="timeline-models__marker"
                style={{ backgroundColor: getModelColor(event.model) }}
                title={`${event.model} - ${formatTime(event.started_at)}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Event Timeline List */}
      <div className="timeline-section">
        <h3 className="timeline-section__title">
          <Clock size={16} />
          Request Timeline
        </h3>
        <div className="timeline-events">
          {timelineEvents.map((event, index) => (
            <motion.div
              key={index}
              className="timeline-event"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <div className="timeline-event__marker">
                <div 
                  className="timeline-event__dot"
                  style={{ backgroundColor: getModelColor(event.model) }}
                />
                {index < timelineEvents.length - 1 && (
                  <div className="timeline-event__line" />
                )}
              </div>
              <div className="timeline-event__content">
                <div className="timeline-event__header">
                  <span className="timeline-event__time">{formatDateTime(event.started_at)}</span>
                  <span className="timeline-event__model" style={{ color: getModelColor(event.model) }}>
                    {event.model}
                  </span>
                </div>
                <div className="timeline-event__stats">
                  <span><Timer size={12} /> {formatDuration(event.duration_ms)}</span>
                  <span><Hash size={12} /> {event.tokens?.toLocaleString()} tokens</span>
                  {event.sessionName && (
                    <span className="timeline-event__session">{event.sessionName}</span>
                  )}
                </div>
                <div className="timeline-event__prompt">
                  {(event.prompt || 'N/A').substring(0, 100)}{event.prompt?.length > 100 ? '...' : ''}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Analytics Component
function Analytics({ data, isAggregated = false, sessions = [] }) {
  // Extract all LLM events from trace tree or use flat events
  const llmEvents = useMemo(() => {
    if (isAggregated && sessions.length > 0) {
      // Aggregate from all sessions
      let allEvents = []
      sessions.forEach(session => {
        const sessionName = session.data.sessions?.[0]?.name || session.fileName
        if (session.data.trace_tree) {
          extractLLMEvents(session.data.trace_tree, allEvents, sessionName)
        } else {
          const events = (session.data.events || []).filter(e => e.provider !== 'function').map(e => {
            const usage = e.response?.usage || {}
            return {
              ...e,
              prompt: e.request?.contents || 'N/A',
              tokens: usage.total_token_count || 0,
              inputTokens: usage.prompt_token_count || 0,
              outputTokens: usage.candidates_token_count || usage.completion_tokens || 0,
              cachedTokens: usage.cached_content_token_count || usage.cached_tokens || 0,
              reasoningTokens: usage.thoughts_token_count || usage.reasoning_tokens || 0,
              toolUseTokens: usage.tool_use_prompt_token_count || 0,
              model: e.request?.model || 'unknown',
              sessionName
            }
          })
          allEvents = [...allEvents, ...events]
        }
      })
      return allEvents
    }

    // Single session
    if (data.trace_tree) {
      return extractLLMEvents(data.trace_tree)
    }
    return (data.events || []).filter(e => e.provider !== 'function').map(e => {
      const usage = e.response?.usage || {}
      return {
        ...e,
        prompt: e.request?.contents || 'N/A',
        tokens: usage.total_token_count || 0,
        inputTokens: usage.prompt_token_count || 0,
        outputTokens: usage.candidates_token_count || usage.completion_tokens || 0,
        cachedTokens: usage.cached_content_token_count || usage.cached_tokens || 0,
        reasoningTokens: usage.thoughts_token_count || usage.reasoning_tokens || 0,
        toolUseTokens: usage.tool_use_prompt_token_count || 0,
        model: e.request?.model || 'unknown'
      }
    })
  }, [data, isAggregated, sessions])

  if (llmEvents.length === 0) {
    return (
      <div className="analytics-empty">
        <BarChart3 size={24} />
        <p>No LLM events found for analysis.</p>
      </div>
    )
  }

  // Calculate metrics
  const durations = llmEvents.map(e => e.duration_ms).filter(d => d > 0).sort((a, b) => a - b)
  const totalDuration = durations.reduce((a, b) => a + b, 0)
  const avgDuration = durations.length > 0 ? totalDuration / durations.length : 0
  const p50Index = Math.floor(durations.length * 0.5)
  const p90Index = Math.floor(durations.length * 0.9)
  const p99Index = Math.floor(durations.length * 0.99)
  const p50 = durations[p50Index] || 0
  const p90 = durations[p90Index] || 0
  const p99 = durations[p99Index] || 0
  const minDuration = durations[0] || 0
  const maxDuration = durations[durations.length - 1] || 0

  // Sort by duration for fastest/slowest
  const sortedByDuration = [...llmEvents].sort((a, b) => (a.duration_ms || 0) - (b.duration_ms || 0))
  const fastest = sortedByDuration.slice(0, 3)
  const slowest = sortedByDuration.slice(-3).reverse()

  // Sort by tokens for max tokens
  const sortedByTokens = [...llmEvents].sort((a, b) => (b.tokens || 0) - (a.tokens || 0))
  const maxTokenPrompts = sortedByTokens.slice(0, 3)

  // Token stats
  const totalTokens = llmEvents.reduce((acc, e) => acc + (e.tokens || 0), 0)
  const totalInputTokens = llmEvents.reduce((acc, e) => acc + (e.inputTokens || 0), 0)
  const totalOutputTokens = llmEvents.reduce((acc, e) => acc + (e.outputTokens || 0), 0)
  const totalCachedTokens = llmEvents.reduce((acc, e) => acc + (e.cachedTokens || 0), 0)
  const totalReasoningTokens = llmEvents.reduce((acc, e) => acc + (e.reasoningTokens || 0), 0)
  const totalToolUseTokens = llmEvents.reduce((acc, e) => acc + (e.toolUseTokens || 0), 0)
  const avgTokens = llmEvents.length > 0 ? totalTokens / llmEvents.length : 0
  
  // Calculate cache hit rate
  const cacheHitRate = totalInputTokens > 0 ? (totalCachedTokens / totalInputTokens) * 100 : 0

  // Cost analysis
  const calculateCost = (event) => {
    const model = event.model?.toLowerCase() || 'default'
    const pricing = Object.entries(MODEL_PRICING).find(([key]) => model.includes(key))?.[1] || MODEL_PRICING.default
    const inputCost = (event.inputTokens / 1_000_000) * pricing.input
    const outputCost = (event.outputTokens / 1_000_000) * pricing.output
    return inputCost + outputCost
  }

  const totalCost = llmEvents.reduce((acc, e) => acc + calculateCost(e), 0)
  const costByModel = llmEvents.reduce((acc, e) => {
    const model = e.model || 'unknown'
    if (!acc[model]) acc[model] = { cost: 0, count: 0, tokens: 0 }
    acc[model].cost += calculateCost(e)
    acc[model].count += 1
    acc[model].tokens += e.tokens || 0
    return acc
  }, {})

  const formatDuration = (ms) => {
    if (!ms) return '0ms'
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const truncatePrompt = (prompt, maxLen = 60) => {
    if (!prompt || prompt === 'N/A') return 'N/A'
    if (prompt.length <= maxLen) return prompt
    return prompt.substring(0, maxLen) + '...'
  }

  return (
    <div className="analytics">
      {/* Aggregated Banner */}
      {isAggregated && (
        <div className="analytics-banner">
          <Files size={18} />
          <span>Showing aggregated analytics across <strong>{sessions.length} sessions</strong></span>
        </div>
      )}

      {/* Overview Stats - Full Width Row */}
      <div className="analytics-section analytics-section--full">
        <h3 className="analytics-section__title">
          <Gauge size={16} />
          Performance Overview
        </h3>
        <div className="analytics-stats-grid">
          <div className="analytics-stat">
            <span className="analytics-stat__label">Total Requests</span>
            <span className="analytics-stat__value">{llmEvents.length}</span>
          </div>
          <div className="analytics-stat">
            <span className="analytics-stat__label">Avg Duration</span>
            <span className="analytics-stat__value">{formatDuration(avgDuration)}</span>
          </div>
          <div className="analytics-stat">
            <span className="analytics-stat__label">P50 Latency</span>
            <span className="analytics-stat__value">{formatDuration(p50)}</span>
          </div>
          <div className="analytics-stat">
            <span className="analytics-stat__label">P90 Latency</span>
            <span className="analytics-stat__value">{formatDuration(p90)}</span>
          </div>
          <div className="analytics-stat analytics-stat--highlight">
            <span className="analytics-stat__label">P99 Latency</span>
            <span className="analytics-stat__value">{formatDuration(p99)}</span>
          </div>
          <div className="analytics-stat">
            <span className="analytics-stat__label">Min / Max</span>
            <span className="analytics-stat__value">{formatDuration(minDuration)} / {formatDuration(maxDuration)}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Latency Percentiles + Cost Analysis */}
      <div className="analytics-row">
        <div className="analytics-section">
          <h3 className="analytics-section__title">
            <Timer size={16} />
            Latency Percentiles
          </h3>
          <div className="latency-bars">
            <div className="latency-bar-item">
              <span className="latency-bar-item__label">P50</span>
              <div className="latency-bar-item__bar">
                <div className="latency-bar-item__fill" style={{ width: `${maxDuration > 0 ? (p50 / maxDuration) * 100 : 0}%` }} />
              </div>
              <span className="latency-bar-item__value">{formatDuration(p50)}</span>
            </div>
            <div className="latency-bar-item">
              <span className="latency-bar-item__label">P90</span>
              <div className="latency-bar-item__bar">
                <div className="latency-bar-item__fill latency-bar-item__fill--warning" style={{ width: `${maxDuration > 0 ? (p90 / maxDuration) * 100 : 0}%` }} />
              </div>
              <span className="latency-bar-item__value">{formatDuration(p90)}</span>
            </div>
            <div className="latency-bar-item">
              <span className="latency-bar-item__label">P99</span>
              <div className="latency-bar-item__bar">
                <div className="latency-bar-item__fill latency-bar-item__fill--critical" style={{ width: `${maxDuration > 0 ? (p99 / maxDuration) * 100 : 0}%` }} />
              </div>
              <span className="latency-bar-item__value">{formatDuration(p99)}</span>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section__title">
            <DollarSign size={16} />
            Cost Analysis (Estimated)
          </h3>
          <div className="cost-analysis">
            <div className="cost-total">
              <span className="cost-total__label">Total Estimated Cost</span>
              <span className="cost-total__value">${totalCost.toFixed(4)}</span>
            </div>
            <div className="cost-by-model">
              {Object.entries(costByModel).map(([model, modelData]) => (
                <div key={model} className="cost-model-item">
                  <div className="cost-model-item__info">
                    <span className="cost-model-item__name">{model}</span>
                    <span className="cost-model-item__count">{modelData.count} calls • {modelData.tokens.toLocaleString()} tokens</span>
                  </div>
                  <span className="cost-model-item__cost">${modelData.cost.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Token Analysis + Highest Token Usage */}
      <div className="analytics-row">
        <div className="analytics-section">
          <h3 className="analytics-section__title">
            <Hash size={16} />
            Token Analysis
          </h3>
          <div className="token-analysis">
            <div className="token-analysis__stats token-analysis__stats--extended">
              <div className="token-stat token-stat--primary">
                <span className="token-stat__label">Total Tokens</span>
                <span className="token-stat__value">{totalTokens.toLocaleString()}</span>
              </div>
              <div className="token-stat">
                <span className="token-stat__label">Input</span>
                <span className="token-stat__value token-stat__value--input">{totalInputTokens.toLocaleString()}</span>
              </div>
              <div className="token-stat">
                <span className="token-stat__label">Output</span>
                <span className="token-stat__value token-stat__value--output">{totalOutputTokens.toLocaleString()}</span>
              </div>
              <div className="token-stat">
                <span className="token-stat__label">Cached</span>
                <span className="token-stat__value token-stat__value--cached">{totalCachedTokens.toLocaleString()}</span>
              </div>
              {totalReasoningTokens > 0 && (
                <div className="token-stat">
                  <span className="token-stat__label">Reasoning</span>
                  <span className="token-stat__value token-stat__value--reasoning">{totalReasoningTokens.toLocaleString()}</span>
                </div>
              )}
              {totalToolUseTokens > 0 && (
                <div className="token-stat">
                  <span className="token-stat__label">Tool Use</span>
                  <span className="token-stat__value token-stat__value--tool">{totalToolUseTokens.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {/* Token Distribution Bar */}
            <div className="token-analysis__bar-container">
              <div className="token-analysis__bar-label">Token Distribution</div>
              <div className="token-analysis__bar">
                {totalInputTokens > 0 && (
                  <div 
                    className="token-analysis__segment token-analysis__segment--input" 
                    style={{ width: `${totalTokens > 0 ? (totalInputTokens / totalTokens) * 100 : 0}%` }}
                    title={`Input: ${totalInputTokens.toLocaleString()} tokens (${Math.round((totalInputTokens / totalTokens) * 100)}%)`}
                  >
                    {(totalInputTokens / totalTokens) * 100 > 12 && 'Input'}
                  </div>
                )}
                {totalOutputTokens > 0 && (
                  <div 
                    className="token-analysis__segment token-analysis__segment--output"
                    style={{ width: `${totalTokens > 0 ? (totalOutputTokens / totalTokens) * 100 : 0}%` }}
                    title={`Output: ${totalOutputTokens.toLocaleString()} tokens (${Math.round((totalOutputTokens / totalTokens) * 100)}%)`}
                  >
                    {(totalOutputTokens / totalTokens) * 100 > 12 && 'Output'}
                  </div>
                )}
                {totalCachedTokens > 0 && (
                  <div 
                    className="token-analysis__segment token-analysis__segment--cached"
                    style={{ width: `${totalTokens > 0 ? (totalCachedTokens / totalTokens) * 100 : 0}%` }}
                    title={`Cached: ${totalCachedTokens.toLocaleString()} tokens (${Math.round((totalCachedTokens / totalTokens) * 100)}%)`}
                  >
                    {(totalCachedTokens / totalTokens) * 100 > 12 && 'Cached'}
                  </div>
                )}
                {totalReasoningTokens > 0 && (
                  <div 
                    className="token-analysis__segment token-analysis__segment--reasoning"
                    style={{ width: `${totalTokens > 0 ? (totalReasoningTokens / totalTokens) * 100 : 0}%` }}
                    title={`Reasoning: ${totalReasoningTokens.toLocaleString()} tokens (${Math.round((totalReasoningTokens / totalTokens) * 100)}%)`}
                  >
                    {(totalReasoningTokens / totalTokens) * 100 > 12 && 'Reasoning'}
                  </div>
                )}
                {totalToolUseTokens > 0 && (
                  <div 
                    className="token-analysis__segment token-analysis__segment--tool"
                    style={{ width: `${totalTokens > 0 ? (totalToolUseTokens / totalTokens) * 100 : 0}%` }}
                    title={`Tool Use: ${totalToolUseTokens.toLocaleString()} tokens (${Math.round((totalToolUseTokens / totalTokens) * 100)}%)`}
                  >
                    {(totalToolUseTokens / totalTokens) * 100 > 12 && 'Tool'}
                  </div>
                )}
              </div>
              <div className="token-analysis__bar-legend">
                <span className="token-analysis__legend-item token-analysis__legend-item--input">
                  <span className="token-analysis__legend-dot"></span>
                  Input ({Math.round((totalInputTokens / totalTokens) * 100) || 0}%)
                </span>
                <span className="token-analysis__legend-item token-analysis__legend-item--output">
                  <span className="token-analysis__legend-dot"></span>
                  Output ({Math.round((totalOutputTokens / totalTokens) * 100) || 0}%)
                </span>
                {totalCachedTokens > 0 && (
                  <span className="token-analysis__legend-item token-analysis__legend-item--cached">
                    <span className="token-analysis__legend-dot"></span>
                    Cached ({Math.round((totalCachedTokens / totalTokens) * 100)}%)
                  </span>
                )}
                {totalReasoningTokens > 0 && (
                  <span className="token-analysis__legend-item token-analysis__legend-item--reasoning">
                    <span className="token-analysis__legend-dot"></span>
                    Reasoning ({Math.round((totalReasoningTokens / totalTokens) * 100)}%)
                  </span>
                )}
                {totalToolUseTokens > 0 && (
                  <span className="token-analysis__legend-item token-analysis__legend-item--tool">
                    <span className="token-analysis__legend-dot"></span>
                    Tool ({Math.round((totalToolUseTokens / totalTokens) * 100)}%)
                  </span>
                )}
              </div>
            </div>

            {/* Cache Performance */}
            <div className="token-analysis__cache">
              <div className="token-analysis__cache-header">
                <span className="token-analysis__cache-label">Cache Performance</span>
                <span className="token-analysis__cache-rate">{cacheHitRate.toFixed(1)}% hit rate</span>
              </div>
              <div className="token-analysis__cache-bar">
                <div 
                  className="token-analysis__cache-fill"
                  style={{ width: `${cacheHitRate}%` }}
                />
              </div>
              <div className="token-analysis__cache-stats">
                <span>{totalCachedTokens.toLocaleString()} cached</span>
                <span>{(totalInputTokens - totalCachedTokens).toLocaleString()} uncached</span>
              </div>
            </div>

            {/* Avg per Request */}
            <div className="token-analysis__avg">
              <span className="token-analysis__avg-label">Average per Request</span>
              <span className="token-analysis__avg-value">{Math.round(avgTokens).toLocaleString()} tokens</span>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section__title">
            <Zap size={16} />
            Highest Token Usage
          </h3>
          <div className="prompt-list">
            {maxTokenPrompts.map((event, i) => (
              <PromptCard
                key={i}
                event={event}
                index={i}
                variant="tokens"
                formatDuration={formatDuration}
                sessionName={isAggregated ? event.sessionName : null}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Fastest & Slowest Prompts */}
      <div className="analytics-row">
        <div className="analytics-section">
          <h3 className="analytics-section__title">
            <TrendingDown size={16} />
            Fastest Prompts
          </h3>
          <div className="prompt-list">
            {fastest.map((event, i) => (
              <PromptCard
                key={i}
                event={event}
                index={i}
                variant="fast"
                formatDuration={formatDuration}
                sessionName={isAggregated ? event.sessionName : null}
              />
            ))}
          </div>
        </div>

        <div className="analytics-section">
          <h3 className="analytics-section__title">
            <TrendingUp size={16} />
            Slowest Prompts
          </h3>
          <div className="prompt-list">
            {slowest.map((event, i) => (
              <PromptCard
                key={i}
                event={event}
                index={i}
                variant="slow"
                formatDuration={formatDuration}
                sessionName={isAggregated ? event.sessionName : null}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Prompt Caching */}
      {totalCachedTokens > 0 && (() => {
        const cachedEvents = llmEvents
          .filter(e => e.cachedTokens > 0)
          .sort((a, b) => b.cachedTokens - a.cachedTokens)
          .slice(0, 5)
        
        const cacheHits = cachedEvents.length
        const cacheMisses = llmEvents.length - cacheHits
        const tokensSaved = totalCachedTokens
        const avgCostPerToken = totalCost / totalTokens || 0
        const costSaved = tokensSaved * avgCostPerToken

        return (
          <div className="analytics-row">
            <div className="analytics-section">
              <h3 className="analytics-section__title">
                <Database size={16} />
                Cache Performance
              </h3>
              <div className="cache-performance">
                <div className="cache-performance__visual">
                  <svg viewBox="0 0 100 100" className="cache-performance__ring">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E5E5" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="40" fill="none" 
                      stroke="#10B981" strokeWidth="8"
                      strokeDasharray={`${cacheHitRate * 2.51} 251`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="cache-performance__percentage">{cacheHitRate.toFixed(1)}%</span>
                </div>
                <div className="cache-performance__stats">
                  <div className="cache-performance__stat">
                    <CheckCircle size={16} className="cache-performance__icon cache-performance__icon--hit" />
                    <span className="cache-performance__value">{cacheHits.toLocaleString()}</span>
                    <span className="cache-performance__label">Cache Hits</span>
                  </div>
                  <div className="cache-performance__stat">
                    <XCircle size={16} className="cache-performance__icon cache-performance__icon--miss" />
                    <span className="cache-performance__value">{cacheMisses.toLocaleString()}</span>
                    <span className="cache-performance__label">Cache Misses</span>
                  </div>
                </div>
                <div className="cache-performance__savings">
                  <div className="cache-performance__saving">
                    <span className="cache-performance__saving-label">Tokens Saved</span>
                    <span className="cache-performance__saving-value">{tokensSaved.toLocaleString()}</span>
                  </div>
                  <div className="cache-performance__saving">
                    <span className="cache-performance__saving-label">Est. Cost Saved</span>
                    <span className="cache-performance__saving-value cache-performance__saving-value--money">${costSaved.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="analytics-section">
              <h3 className="analytics-section__title">
                <HardDrive size={16} />
                Top Cached Prompts
              </h3>
              <div className="cached-prompts-list">
                {cachedEvents.length > 0 ? (
                  cachedEvents.map((event, i) => (
                    <div key={i} className="cached-prompt-item">
                      <div className="cached-prompt-item__rank">#{i + 1}</div>
                      <div className="cached-prompt-item__content">
                        <span className="cached-prompt-item__text">{truncatePrompt(event.prompt, 50)}</span>
                        <div className="cached-prompt-item__meta">
                          <span>{event.cachedTokens.toLocaleString()} cached tokens</span>
                          <span className="cached-prompt-item__model">{event.model}</span>
                          <span className="cached-prompt-item__savings">
                            ~${(event.cachedTokens * avgCostPerToken).toFixed(4)} saved
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="cached-prompts-empty">
                    <Database size={20} />
                    <span>No cached prompts found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

// Session List Sidebar Component
function SessionSidebar({ sessions, selectedSession, onSelectSession, onRemoveSession, onUpload, isDragging, setIsDragging }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getSessionStats = (session) => {
    const data = session.data
    const eventCount = (data.events?.length || 0) + (data.trace_tree?.length || 0)
    const totalTokens = data.events?.reduce((acc, e) => acc + (e.response?.usage?.total_token_count || 0), 0) || 0
    return { eventCount, totalTokens }
  }

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
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/json' || f.name.endsWith('.json'))
    if (files.length > 0) {
      files.forEach(file => onUpload(file))
    }
  }, [onUpload, setIsDragging])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => onUpload(file))
  }, [onUpload])

  return (
    <div className="session-sidebar">
      <div className="session-sidebar__header">
        <h3>
          <FolderOpen size={16} />
          Sessions
        </h3>
        <span className="session-sidebar__count">{sessions.length}</span>
      </div>

      <div className="session-sidebar__list">
        {/* Overview Item */}
        <motion.div
          className={`session-sidebar__item ${selectedSession === null ? 'session-sidebar__item--active' : ''}`}
          onClick={() => onSelectSession(null)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="session-sidebar__item-icon session-sidebar__item-icon--overview">
            <BarChart3 size={16} />
          </div>
          <div className="session-sidebar__item-info">
            <span className="session-sidebar__item-name">All Sessions Overview</span>
            <span className="session-sidebar__item-meta">Aggregated analytics</span>
          </div>
        </motion.div>

        <div className="session-sidebar__divider" />

        {/* Session Items */}
        {sessions.map((session, index) => {
          const sessionInfo = session.data.sessions?.[0]
          const stats = getSessionStats(session)
          const isSelected = selectedSession === session.id

          return (
            <motion.div
              key={session.id}
              className={`session-sidebar__item ${isSelected ? 'session-sidebar__item--active' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className="session-sidebar__item-content"
                onClick={() => onSelectSession(session.id)}
              >
                <div className="session-sidebar__item-icon">
                  <FileJson size={16} />
                </div>
                <div className="session-sidebar__item-info">
                  <span className="session-sidebar__item-name">
                    {sessionInfo?.name || session.fileName}
                  </span>
                  <span className="session-sidebar__item-meta">
                    {stats.eventCount} events • {stats.totalTokens.toLocaleString()} tokens
                  </span>
                  {sessionInfo?.started_at && (
                    <span className="session-sidebar__item-date">
                      {formatDate(sessionInfo.started_at)}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="session-sidebar__item-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveSession(session.id)
                }}
                title="Remove session"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Add More Sessions */}
      <div 
        className={`session-sidebar__add ${isDragging ? 'session-sidebar__add--dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="session-sidebar__add-btn">
          <Plus size={16} />
          <span>Add Sessions</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            multiple
            hidden
          />
        </label>
      </div>
    </div>
  )
}

// Validation helper
function validateObservabilityJson(data, fileName) {
  // Check if sessions key exists and is an array
  if (!data.sessions || !Array.isArray(data.sessions)) {
    return {
      valid: false,
      error: `"${fileName}" is not a valid aiobs observability file. Missing "sessions" array.`
    }
  }
  
  // Check if sessions array has at least one entry with an id
  if (data.sessions.length === 0 || !data.sessions[0]?.id) {
    return {
      valid: false,
      error: `"${fileName}" is not a valid aiobs observability file. Sessions must contain at least one entry with an "id".`
    }
  }
  
  return { valid: true }
}

// Main Playground Component
export default function Playground() {
  const [sessions, setSessions] = useState([])
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState('analytics') // 'tree', 'list', 'analytics', or 'timeline'
  const [isLoadingSample, setIsLoadingSample] = useState(false)
  const [validationError, setValidationError] = useState(null)

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
      } catch (err) {
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
    } catch (err) {
      setError('Failed to load sample data. Please try again.')
    } finally {
      setIsLoadingSample(false)
    }
  }, [])

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
