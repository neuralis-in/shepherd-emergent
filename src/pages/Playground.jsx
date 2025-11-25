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
  HardDrive
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
        <div className="upload-zone__actions">
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

// Expandable Prompt Card Component for Analytics
function PromptCard({ event, index, variant = 'default', formatDuration }) {
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
function extractLLMEvents(traceTree, events = []) {
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
        model: node.request?.model || 'unknown'
      })
    }
    // Recursively process children
    if (node.children && node.children.length > 0) {
      extractLLMEvents(node.children, events)
    }
  }
  
  return events
}

// Analytics Component
function Analytics({ data }) {
  // Extract all LLM events from trace tree or use flat events
  const llmEvents = data.trace_tree 
    ? extractLLMEvents(data.trace_tree)
    : (data.events || []).filter(e => e.provider !== 'function').map(e => {
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

// Main Playground Component
export default function Playground() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [viewMode, setViewMode] = useState('tree') // 'tree', 'list', or 'analytics'
  const [isLoadingSample, setIsLoadingSample] = useState(false)

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

  const handleLoadSample = useCallback(async () => {
    setIsLoadingSample(true)
    setError(null)
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}sample_observability.json`)
      if (!response.ok) {
        throw new Error('Failed to load sample data')
      }
      const parsed = await response.json()
      setData(parsed)
      // Set view mode based on data
      if (parsed.trace_tree && parsed.trace_tree.length > 0) {
        setViewMode('tree')
      } else {
        setViewMode('list')
      }
    } catch (err) {
      setError('Failed to load sample data. Please try again.')
      setData(null)
    } finally {
      setIsLoadingSample(false)
    }
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
              <button
                className={`view-toggle__btn ${viewMode === 'analytics' ? 'view-toggle__btn--active' : ''}`}
                onClick={() => setViewMode('analytics')}
              >
                <BarChart3 size={14} />
                <span>Analytics</span>
              </button>
            </div>
            <button className="playground-btn playground-btn--ghost" onClick={handleClear}>
              <X size={14} />
              <span>Clear</span>
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
                {viewMode === 'analytics' ? (
                  <Analytics data={data} />
                ) : viewMode === 'tree' && hasTraceTree ? (
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

