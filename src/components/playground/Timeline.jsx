import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  Hash,
  Timer,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers,
  BarChart3,
  LineChart,
  Files
} from 'lucide-react'
import { 
  formatDuration, 
  formatTime, 
  formatDateTime,
  extractLLMEvents, 
  getPromptText,
  getModelColor,
  calculateCost 
} from './utils'
import './Timeline.css'

/**
 * Timeline Component - Visualizes LLM events over time
 */
export default function Timeline({ data, isAggregated = false, sessions = [] }) {
  const [selectedMetric, setSelectedMetric] = useState('duration')
  const [hoveredPoint, setHoveredPoint] = useState(null)

  // Extract all events with timestamps
  const timelineEvents = useMemo(() => {
    // Helper to transform a single event
    const transformEvent = (e, sessionName = null) => {
      const usage = e.response?.usage || {}
      const api = e.api || 'unknown'
      const isEmbedding = api === 'embeddings.create'
      return {
        ...e,
        api,
        prompt: getPromptText(e.request, api),
        tokens: usage.total_tokens || usage.total_token_count || 0,
        inputTokens: usage.prompt_tokens || usage.prompt_token_count || 0,
        outputTokens: isEmbedding ? 0 : (usage.completion_tokens || usage.candidates_token_count || 0),
        model: e.request?.model || 'unknown',
        embeddingDimensions: isEmbedding ? e.response?.embedding_dimensions : null,
        sessionName
      }
    }

    let allEvents = []
    
    if (isAggregated && sessions.length > 0) {
      sessions.forEach(session => {
        const sessionName = session.data.sessions?.[0]?.name || session.fileName
        if (session.data.trace_tree) {
          extractLLMEvents(session.data.trace_tree, allEvents, sessionName)
        } else {
          const events = (session.data.events || []).filter(e => e.provider !== 'function').map(e => transformEvent(e, sessionName))
          allEvents = [...allEvents, ...events]
        }
      })
    } else if (data.trace_tree) {
      allEvents = extractLLMEvents(data.trace_tree)
    } else {
      allEvents = (data.events || []).filter(e => e.provider !== 'function').map(e => transformEvent(e))
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

  // Calculate metrics for charts
  const maxDuration = Math.max(...timelineEvents.map(e => e.duration_ms || 0))
  const maxTokens = Math.max(...timelineEvents.map(e => e.tokens || 0))
  const maxInputTokens = Math.max(...timelineEvents.map(e => e.inputTokens || 0))
  const maxOutputTokens = Math.max(...timelineEvents.map(e => e.outputTokens || 0))
  const maxCost = Math.max(...timelineEvents.map(e => calculateCost(e)))

  // Cumulative data
  const cumulativeData = timelineEvents.reduce((acc, event, index) => {
    const prev = acc[index - 1] || { totalDuration: 0, totalTokens: 0, totalCost: 0, totalRequests: 0 }
    acc.push({
      ...event,
      totalDuration: prev.totalDuration + (event.duration_ms || 0),
      totalTokens: prev.totalTokens + (event.tokens || 0),
      totalCost: prev.totalCost + calculateCost(event),
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
      case 'cost': return calculateCost(event)
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

