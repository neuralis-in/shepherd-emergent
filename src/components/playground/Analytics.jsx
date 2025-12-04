import { useState, useMemo } from 'react'
import {
  BarChart3,
  Hash,
  Timer,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  Gauge,
  Database,
  HardDrive,
  CheckCircle,
  XCircle,
  Files
} from 'lucide-react'
import { MODEL_PRICING } from './constants'
import { 
  formatDuration, 
  extractLLMEvents, 
  getPromptText, 
  getProviderFromModel,
  truncateString 
} from './utils'
import PromptCard from './PromptCard'
import EvaluationsSummary from './EvaluationsSummary'
import './Analytics.css'

/**
 * Analytics Component - Dashboard for analyzing LLM usage
 */
export default function Analytics({ data, isAggregated = false, sessions = [] }) {
  const [costProviderFilter, setCostProviderFilter] = useState('all')
  
  // Extract all LLM events from trace tree or use flat events
  const llmEvents = useMemo(() => {
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
        cachedTokens: usage.cached_content_token_count || usage.cached_tokens || 0,
        reasoningTokens: usage.thoughts_token_count || usage.reasoning_tokens || 0,
        toolUseTokens: usage.tool_use_prompt_token_count || 0,
        model: e.request?.model || 'unknown',
        embeddingDimensions: isEmbedding ? e.response?.embedding_dimensions : null,
        sessionName
      }
    }

    if (isAggregated && sessions.length > 0) {
      let allEvents = []
      sessions.forEach(session => {
        const sessionName = session.data.sessions?.[0]?.name || session.fileName
        if (session.data.trace_tree) {
          extractLLMEvents(session.data.trace_tree, allEvents, sessionName)
        } else {
          const events = (session.data.events || []).filter(e => e.provider !== 'function').map(e => transformEvent(e, sessionName))
          allEvents = [...allEvents, ...events]
        }
      })
      return allEvents
    }

    if (data.trace_tree) {
      return extractLLMEvents(data.trace_tree)
    }
    return (data.events || []).filter(e => e.provider !== 'function').map(e => transformEvent(e))
  }, [data, isAggregated, sessions])

  if (llmEvents.length === 0) {
    return (
      <div className="analytics-empty">
        <BarChart3 size={24} />
        <p>No LLM events found for analysis.</p>
      </div>
    )
  }

  // Separate chat/completion events from embedding events
  const chatEvents = llmEvents.filter(e => e.api !== 'embeddings.create')
  const embeddingEvents = llmEvents.filter(e => e.api === 'embeddings.create')

  // Calculate duration metrics (includes all events)
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

  // Sort by duration for fastest/slowest (chat events only)
  const sortedByDuration = [...chatEvents].sort((a, b) => (a.duration_ms || 0) - (b.duration_ms || 0))
  const fastest = sortedByDuration.slice(0, 3)
  const slowest = sortedByDuration.slice(-3).reverse()

  // Sort by tokens for max tokens (chat events only)
  const sortedByTokens = [...chatEvents].sort((a, b) => (b.tokens || 0) - (a.tokens || 0))
  const maxTokenPrompts = sortedByTokens.slice(0, 3)

  // Token stats (chat events only)
  const totalTokens = chatEvents.reduce((acc, e) => acc + (e.tokens || 0), 0)
  const totalInputTokens = chatEvents.reduce((acc, e) => acc + (e.inputTokens || 0), 0)
  const totalOutputTokens = chatEvents.reduce((acc, e) => acc + (e.outputTokens || 0), 0)
  const totalCachedTokens = chatEvents.reduce((acc, e) => acc + (e.cachedTokens || 0), 0)
  const totalReasoningTokens = chatEvents.reduce((acc, e) => acc + (e.reasoningTokens || 0), 0)
  const totalToolUseTokens = chatEvents.reduce((acc, e) => acc + (e.toolUseTokens || 0), 0)
  const avgTokens = chatEvents.length > 0 ? totalTokens / chatEvents.length : 0

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

  // Filter events by provider for cost analysis
  const filteredCostEvents = costProviderFilter === 'all' 
    ? llmEvents 
    : llmEvents.filter(e => getProviderFromModel(e.model) === costProviderFilter)
  
  const totalCost = filteredCostEvents.reduce((acc, e) => acc + calculateCost(e), 0)
  const costByModel = filteredCostEvents.reduce((acc, e) => {
    const model = e.model || 'unknown'
    if (!acc[model]) acc[model] = { cost: 0, count: 0, tokens: 0 }
    acc[model].cost += calculateCost(e)
    acc[model].count += 1
    acc[model].tokens += e.tokens || 0
    return acc
  }, {})

  return (
    <div className="analytics">
      {/* Aggregated Banner */}
      {isAggregated && (
        <div className="analytics-banner">
          <Files size={18} />
          <span>Showing aggregated analytics across <strong>{sessions.length} sessions</strong></span>
        </div>
      )}

      {/* Evaluations Summary */}
      <EvaluationsSummary data={data} isAggregated={isAggregated} sessions={sessions} />

      {/* Overview Stats - Full Width Row */}
      <div className="analytics-section analytics-section--full">
        <h3 className="analytics-section__title">
          <Gauge size={16} />
          Performance Overview
        </h3>
        <div className="analytics-stats-grid">
          <div className="analytics-stat">
            <span className="analytics-stat__label">Total Requests</span>
            <span className="analytics-stat__value">
              {llmEvents.length}
              {embeddingEvents.length > 0 && (
                <span style={{ fontSize: '0.7em', opacity: 0.7, marginLeft: '4px' }}>
                  ({chatEvents.length} chat, {embeddingEvents.length} embed)
                </span>
              )}
            </span>
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
          <div className="analytics-section__header">
            <h3 className="analytics-section__title">
              <DollarSign size={16} />
              Cost Analysis (Estimated)
            </h3>
            <div className="cost-provider-filter">
              <button 
                className={`cost-provider-filter__btn ${costProviderFilter === 'all' ? 'cost-provider-filter__btn--active' : ''}`}
                onClick={() => setCostProviderFilter('all')}
              >
                All
              </button>
              <button 
                className={`cost-provider-filter__btn ${costProviderFilter === 'openai' ? 'cost-provider-filter__btn--active' : ''}`}
                onClick={() => setCostProviderFilter('openai')}
              >
                OpenAI
              </button>
              <button 
                className={`cost-provider-filter__btn ${costProviderFilter === 'gemini' ? 'cost-provider-filter__btn--active' : ''}`}
                onClick={() => setCostProviderFilter('gemini')}
              >
                Gemini
              </button>
              <button 
                className="cost-provider-filter__btn cost-provider-filter__btn--disabled"
                disabled
                title="Coming soon"
              >
                Other
              </button>
            </div>
          </div>
          <div className="cost-analysis">
            <div className="cost-total">
              <span className="cost-total__label">Total Estimated Cost</span>
              <span className="cost-total__value">${totalCost.toFixed(4)}</span>
            </div>
            <div className="cost-by-model">
              {Object.entries(costByModel).length > 0 ? (
                Object.entries(costByModel).map(([model, modelData]) => (
                  <div key={model} className="cost-model-item">
                    <div className="cost-model-item__info">
                      <span className="cost-model-item__name">{model}</span>
                      <span className="cost-model-item__count">{modelData.count} calls • {modelData.tokens.toLocaleString()} tokens</span>
                    </div>
                    <span className="cost-model-item__cost">${modelData.cost.toFixed(4)}</span>
                  </div>
                ))
              ) : (
                <div className="cost-empty">
                  <span>No models found for this provider</span>
                </div>
              )}
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
                sessionName={isAggregated ? event.sessionName : null}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Prompt Caching */}
      {totalCachedTokens > 0 && (() => {
        const cachedEvents = chatEvents
          .filter(e => e.cachedTokens > 0)
          .sort((a, b) => b.cachedTokens - a.cachedTokens)
          .slice(0, 5)
        
        const cacheHits = cachedEvents.length
        const cacheMisses = chatEvents.length - cacheHits
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
                        <span className="cached-prompt-item__text">{truncateString(event.prompt, 50)}</span>
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

