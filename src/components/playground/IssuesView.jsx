import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  FileWarning,
  Activity,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Filter,
  ChevronDown,
  Search
} from 'lucide-react'
import { formatDuration, truncateString } from './utils'
import { extractAllEvaluations } from './EvaluationsSummary'
import { getEvalTypeInfo } from './EvaluationBadge'
import './IssuesView.css'

/**
 * Get prompt text from request
 */
function getPromptFromRequest(request) {
  if (!request) return 'No prompt available'
  
  // OpenAI format
  if (request.messages) {
    const userMessages = request.messages.filter(m => m.role === 'user' || m.role === 'system')
    if (userMessages.length > 0) {
      return userMessages.map(m => m.content).join('\n')
    }
  }
  
  // Gemini format
  if (request.contents) {
    return typeof request.contents === 'string' ? request.contents : JSON.stringify(request.contents)
  }
  
  // Embeddings format
  if (request.input) {
    return Array.isArray(request.input) ? request.input.join('\n') : request.input
  }
  
  return 'No prompt available'
}

/**
 * Issue Filter Tabs
 */
function IssueFilterTabs({ activeFilter, onFilterChange, counts }) {
  const filters = [
    { id: 'all', label: 'All Issues', icon: AlertOctagon, color: 'gray' },
    { id: 'pii', label: 'PII Detection', icon: Eye, color: 'purple', count: counts.pii },
    { id: 'hallucination', label: 'Hallucinations', icon: FileWarning, color: 'amber', count: counts.hallucination },
    { id: 'latency', label: 'Latency Issues', icon: Activity, color: 'blue', count: counts.latency }
  ]
  
  return (
    <div className="issues-filter-tabs">
      {filters.map(filter => {
        const Icon = filter.icon
        const isActive = activeFilter === filter.id
        return (
          <button
            key={filter.id}
            className={`issues-filter-tab issues-filter-tab--${filter.color} ${isActive ? 'issues-filter-tab--active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <Icon size={16} />
            <span>{filter.label}</span>
            {filter.count !== undefined && filter.count > 0 && (
              <span className="issues-filter-tab__count">{filter.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Get summary text for collapsed card
 */
function getIssueSummary(evaluation) {
  const prompt = truncateString(getPromptFromRequest(evaluation.eventRequest), 80)
  const { label } = getEvalTypeInfo(evaluation.eval_type)
  
  // Type-specific summary
  if (evaluation.eval_type === 'pii_detection') {
    const count = evaluation.result?.pii_count || 0
    const types = evaluation.result?.pii_types_found || []
    if (count > 0) {
      return `${count} PII instance${count !== 1 ? 's' : ''} found${types.length > 0 ? ` (${types.slice(0, 2).join(', ')}${types.length > 2 ? '...' : ''})` : ''}`
    }
    return evaluation.feedback || 'PII detection check failed'
  }
  
  if (evaluation.eval_type === 'hallucination_detection') {
    const count = evaluation.result?.hallucination_count || 0
    if (count > 0) {
      return `${count} hallucination${count !== 1 ? 's' : ''} detected`
    }
    return evaluation.feedback || 'Hallucination check failed'
  }
  
  if (evaluation.eval_type === 'latency_consistency') {
    const mean = evaluation.result?.mean?.toFixed(0) || 0
    const max = evaluation.result?.max?.toFixed(0) || 0
    return `Mean: ${mean}ms, Max: ${max}ms - threshold exceeded`
  }
  
  return evaluation.feedback || `${label} check failed`
}

/**
 * Issue Card Component - Collapsible detailed view of a single issue
 */
function IssueCard({ evaluation, issueType }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getColorClass = () => {
    switch (evaluation.eval_type) {
      case 'pii_detection': return 'purple'
      case 'hallucination_detection': return 'amber'
      case 'latency_consistency': return 'blue'
      default: return 'gray'
    }
  }
  
  const color = getColorClass()
  const { label: evalTypeLabel } = getEvalTypeInfo(evaluation.eval_type)
  
  return (
    <div className={`issue-card issue-card--${color} ${isExpanded ? 'issue-card--expanded' : 'issue-card--collapsed'}`}>
      {/* Collapsed View - Single Line */}
      <div 
        className="issue-card__collapsed-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(!isExpanded) }}
      >
        <div className="issue-card__collapsed-left">
          <div className={`issue-card__type-icon issue-card__type-icon--${color}`}>
            {evaluation.eval_type === 'pii_detection' && <Eye size={16} />}
            {evaluation.eval_type === 'hallucination_detection' && <FileWarning size={16} />}
            {evaluation.eval_type === 'latency_consistency' && <Activity size={16} />}
          </div>
          <div className="issue-card__collapsed-info">
            <span className="issue-card__collapsed-api">{evaluation.eventApi}</span>
            <span className="issue-card__collapsed-separator">•</span>
            <span className="issue-card__collapsed-summary">{getIssueSummary(evaluation)}</span>
          </div>
        </div>
        <div className="issue-card__collapsed-right">
          {evaluation.eventModel && (
            <span className="issue-card__collapsed-model">{evaluation.eventModel}</span>
          )}
          <span className="issue-card__collapsed-score">{(evaluation.score * 100).toFixed(0)}%</span>
          <ChevronDown 
            size={18} 
            className={`issue-card__collapse-icon ${isExpanded ? 'issue-card__collapse-icon--rotated' : ''}`} 
          />
        </div>
      </div>
      
      {/* Expanded View - Full Details */}
      {isExpanded && (
        <div className="issue-card__expanded-content">
          {/* Event Info */}
          <div className="issue-card__event-info">
            <div className="issue-card__event-row">
              <span className="issue-card__provider">{evaluation.eventProvider}</span>
              <span className="issue-card__api">{evaluation.eventApi}</span>
              {evaluation.eventModel && (
                <span className="issue-card__model">{evaluation.eventModel}</span>
              )}
              {evaluation.eventDuration && (
                <span className="issue-card__duration">{formatDuration(evaluation.eventDuration)}</span>
              )}
            </div>
            {evaluation.sessionName && (
              <span className="issue-card__session">Session: {evaluation.sessionName}</span>
            )}
          </div>
          
          {/* Prompt Section */}
          <div className="issue-card__section">
            <div className="issue-card__section-header">
              <span className="issue-card__section-label">Prompt</span>
            </div>
            <div className="issue-card__section-content issue-card__section-content--prompt">
              <p>{getPromptFromRequest(evaluation.eventRequest)}</p>
            </div>
          </div>
          
          {/* Response Section */}
          {evaluation.eventResponse?.text && (
            <div className="issue-card__section">
              <div className="issue-card__section-header">
                <span className="issue-card__section-label">Response</span>
              </div>
              <div className="issue-card__section-content issue-card__section-content--response">
                <p>{evaluation.eventResponse.text}</p>
              </div>
            </div>
          )}
          
          {/* Issue Details */}
          <div className="issue-card__details">
            <div className="issue-card__details-header">
              <span className="issue-card__section-label">Evaluation Details</span>
            </div>
            
            {evaluation.feedback && (
              <div className="issue-card__feedback">
                <AlertTriangle size={14} />
                <span>{evaluation.feedback}</span>
              </div>
            )}
            
            {/* PII specific details */}
            {evaluation.eval_type === 'pii_detection' && evaluation.result && (
              <div className="issue-card__pii-details">
                <div className="issue-card__pii-count">
                  <span className="issue-card__pii-count-label">PII Instances Found</span>
                  <span className={`issue-card__pii-count-value ${evaluation.result.pii_count > 0 ? 'issue-card__pii-count-value--danger' : ''}`}>
                    {evaluation.result.pii_count || 0}
                  </span>
                </div>
                {evaluation.result.pii_types_found?.length > 0 && (
                  <div className="issue-card__pii-types">
                    <span className="issue-card__pii-types-label">Types Detected:</span>
                    <div className="issue-card__pii-tags">
                      {evaluation.result.pii_types_found.map((type, i) => (
                        <span key={i} className="issue-card__pii-tag">{type}</span>
                      ))}
                    </div>
                  </div>
                )}
                {evaluation.result.assertions?.length > 0 && (
                  <div className="issue-card__assertions">
                    {evaluation.result.assertions.map((assertion, i) => (
                      <div key={i} className={`issue-card__assertion ${assertion.passed ? 'issue-card__assertion--passed' : 'issue-card__assertion--failed'}`}>
                        {assertion.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span>{assertion.message || assertion.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Hallucination specific details */}
            {evaluation.eval_type === 'hallucination_detection' && evaluation.result && (
              <div className="issue-card__hallucination-details">
                <div className="issue-card__hallucination-count">
                  <span className="issue-card__hallucination-count-label">Hallucinations Detected</span>
                  <span className={`issue-card__hallucination-count-value ${evaluation.result.hallucination_count > 0 ? 'issue-card__hallucination-count-value--danger' : ''}`}>
                    {evaluation.result.hallucination_count || 0}
                  </span>
                </div>
                {evaluation.result.hallucinations?.length > 0 && (
                  <div className="issue-card__hallucinations-list">
                    {evaluation.result.hallucinations.map((h, i) => (
                      <div key={i} className={`issue-card__hallucination-item issue-card__hallucination-item--${h.severity || 'minor'}`}>
                        <div className="issue-card__hallucination-header">
                          <span className={`issue-card__hallucination-severity issue-card__hallucination-severity--${h.severity || 'minor'}`}>
                            {h.severity || 'unknown'}
                          </span>
                          {h.confidence && (
                            <span className="issue-card__hallucination-confidence">
                              {(h.confidence * 100).toFixed(0)}% confidence
                            </span>
                          )}
                        </div>
                        <p className="issue-card__hallucination-text">{h.text || h.description || h.claim}</p>
                        {h.explanation && (
                          <p className="issue-card__hallucination-explanation">{h.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Latency specific details */}
            {evaluation.eval_type === 'latency_consistency' && evaluation.result && (
              <div className="issue-card__latency-details">
                <div className="issue-card__latency-grid">
                  <div className="issue-card__latency-stat">
                    <span className="issue-card__latency-label">Mean</span>
                    <span className="issue-card__latency-value">{evaluation.result.mean?.toFixed(0) || 0}ms</span>
                  </div>
                  <div className="issue-card__latency-stat">
                    <span className="issue-card__latency-label">P95</span>
                    <span className="issue-card__latency-value">{evaluation.result.p95?.toFixed(0) || 0}ms</span>
                  </div>
                  <div className="issue-card__latency-stat">
                    <span className="issue-card__latency-label">Max</span>
                    <span className="issue-card__latency-value">{evaluation.result.max?.toFixed(0) || 0}ms</span>
                  </div>
                  <div className="issue-card__latency-stat">
                    <span className="issue-card__latency-label">Min</span>
                    <span className="issue-card__latency-value">{evaluation.result.min?.toFixed(0) || 0}ms</span>
                  </div>
                </div>
                {evaluation.result.threshold && (
                  <div className="issue-card__latency-threshold">
                    <span>Threshold: {evaluation.result.threshold}ms</span>
                    {evaluation.result.exceeded_by && (
                      <span className="issue-card__latency-exceeded">
                        Exceeded by {evaluation.result.exceeded_by.toFixed(0)}ms
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Issues View Component - Dedicated page for viewing issues
 */
export default function IssuesView({ 
  data, 
  isAggregated = false, 
  sessions = [], 
  initialFilter = 'all',
  onBack 
}) {
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Extract all evaluations
  const allEvaluations = useMemo(() => 
    extractAllEvaluations(data, sessions, isAggregated), 
    [data, sessions, isAggregated]
  )
  
  // Get failed evaluations
  const failedEvaluations = useMemo(() => 
    allEvaluations.filter(e => !e.passed),
    [allEvaluations]
  )
  
  // Count by type
  const counts = useMemo(() => ({
    pii: failedEvaluations.filter(e => e.eval_type === 'pii_detection').length,
    hallucination: failedEvaluations.filter(e => e.eval_type === 'hallucination_detection').length,
    latency: failedEvaluations.filter(e => e.eval_type === 'latency_consistency').length
  }), [failedEvaluations])
  
  // Filter evaluations based on active filter and search
  const filteredEvaluations = useMemo(() => {
    let filtered = failedEvaluations
    
    // Filter by type
    if (activeFilter !== 'all') {
      const typeMap = {
        pii: 'pii_detection',
        hallucination: 'hallucination_detection',
        latency: 'latency_consistency'
      }
      filtered = filtered.filter(e => e.eval_type === typeMap[activeFilter])
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e => {
        const prompt = getPromptFromRequest(e.eventRequest).toLowerCase()
        const response = (e.eventResponse?.text || '').toLowerCase()
        const model = (e.eventModel || '').toLowerCase()
        const api = (e.eventApi || '').toLowerCase()
        const feedback = (e.feedback || '').toLowerCase()
        
        return prompt.includes(query) || 
               response.includes(query) || 
               model.includes(query) || 
               api.includes(query) ||
               feedback.includes(query)
      })
    }
    
    return filtered
  }, [failedEvaluations, activeFilter, searchQuery])
  
  // Get title based on filter
  const getTitle = () => {
    switch (activeFilter) {
      case 'pii': return 'PII Detection Issues'
      case 'hallucination': return 'Hallucination Issues'
      case 'latency': return 'Latency Issues'
      default: return 'All Issues'
    }
  }
  
  const getIcon = () => {
    switch (activeFilter) {
      case 'pii': return Eye
      case 'hallucination': return FileWarning
      case 'latency': return Activity
      default: return AlertOctagon
    }
  }
  
  const Icon = getIcon()
  
  if (failedEvaluations.length === 0) {
    return (
      <div className="issues-view issues-view--empty">
        <div className="issues-view__empty-state">
          <CheckCircle2 size={48} />
          <h3>No Issues Found</h3>
          <p>All evaluations have passed. Great job!</p>
          {onBack && (
            <button className="issues-view__back-btn" onClick={onBack}>
              <ArrowLeft size={16} />
              Back to Analytics
            </button>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="issues-view">
      {/* Header */}
      <div className="issues-view__header">
        <div className="issues-view__header-left">
          {onBack && (
            <button className="issues-view__back-btn" onClick={onBack}>
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="issues-view__title-group">
            <div className={`issues-view__title-icon issues-view__title-icon--${activeFilter}`}>
              <Icon size={20} />
            </div>
            <div>
              <h2 className="issues-view__title">{getTitle()}</h2>
              <span className="issues-view__subtitle">
                {filteredEvaluations.length} issue{filteredEvaluations.length !== 1 ? 's' : ''} found
                {isAggregated && ` across ${sessions.length} sessions`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="issues-view__header-right">
          <div className="issues-view__search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <IssueFilterTabs 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />
      
      {/* Issues List */}
      <div className="issues-view__content">
        {filteredEvaluations.length === 0 ? (
          <div className="issues-view__no-results">
            <Filter size={32} />
            <p>No issues match your current filters</p>
            <button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="issues-view__list">
            {filteredEvaluations.map((evaluation, index) => (
              <IssueCard 
                key={`issue-${evaluation.id || evaluation.eventSpanId || index}-${index}`}
                evaluation={evaluation}
                issueType={activeFilter}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

