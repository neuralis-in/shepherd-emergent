import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  FileWarning,
  Activity,
  Gauge,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronRight,
  X,
  ExternalLink,
  AlertOctagon
} from 'lucide-react'
import { getEvalTypeInfo } from './EvaluationBadge'
import { formatDuration, truncateString } from './utils'
import './EvaluationsSummary.css'

/**
 * Extract all evaluations from events and trace tree with full event context
 */
function extractAllEvaluations(data, sessions = [], isAggregated = false) {
  const evaluations = []
  
  const collectFromEvents = (events, sessionName = null) => {
    if (!events) return
    events.forEach(event => {
      if (event.evaluations && event.evaluations.length > 0) {
        event.evaluations.forEach(evaluation => {
          evaluations.push({
            ...evaluation,
            eventApi: event.api || event.name,
            eventModel: event.request?.model,
            eventProvider: event.provider,
            eventSpanId: event.span_id,
            eventDuration: event.duration_ms,
            eventStartedAt: event.started_at,
            eventRequest: event.request,
            eventResponse: event.response,
            sessionName
          })
        })
      }
    })
  }
  
  const collectFromTraceTree = (nodes, sessionName = null) => {
    if (!nodes) return
    nodes.forEach(node => {
      if (node.evaluations && node.evaluations.length > 0) {
        node.evaluations.forEach(evaluation => {
          evaluations.push({
            ...evaluation,
            eventApi: node.api || node.name,
            eventModel: node.request?.model,
            eventProvider: node.provider,
            eventSpanId: node.span_id,
            eventDuration: node.duration_ms,
            eventStartedAt: node.started_at,
            eventRequest: node.request,
            eventResponse: node.response,
            sessionName
          })
        })
      }
      if (node.children) {
        collectFromTraceTree(node.children, sessionName)
      }
    })
  }
  
  if (isAggregated && sessions.length > 0) {
    sessions.forEach(session => {
      const sessionName = session.data.sessions?.[0]?.name || session.fileName
      collectFromEvents(session.data.events, sessionName)
      collectFromEvents(session.data.function_events, sessionName)
      collectFromTraceTree(session.data.trace_tree, sessionName)
    })
  } else {
    collectFromEvents(data.events)
    collectFromEvents(data.function_events)
    collectFromTraceTree(data.trace_tree)
  }
  
  return evaluations
}

/**
 * Stat Card Component
 */
function StatCard({ icon: Icon, label, value, subValue, variant = 'default', trend, onClick, clickable }) {
  const handleClick = (e) => {
    if (onClick && clickable) {
      e.stopPropagation()
      onClick()
    }
  }
  
  return (
    <div 
      className={`eval-stat-card eval-stat-card--${variant} ${clickable ? 'eval-stat-card--clickable' : ''}`}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="eval-stat-card__icon">
        <Icon size={20} />
      </div>
      <div className="eval-stat-card__content">
        <span className="eval-stat-card__value">{value}</span>
        <span className="eval-stat-card__label">{label}</span>
        {subValue && <span className="eval-stat-card__subvalue">{subValue}</span>}
      </div>
      {trend && (
        <div className={`eval-stat-card__trend eval-stat-card__trend--${trend.direction}`}>
          <TrendingUp size={14} />
          <span>{trend.value}</span>
        </div>
      )}
      {clickable && (
        <div className="eval-stat-card__click-hint">
          <ExternalLink size={14} />
        </div>
      )}
    </div>
  )
}

/**
 * Evaluation Type Breakdown Card
 */
function EvalTypeCard({ evalType, stats }) {
  const { label, color } = getEvalTypeInfo(evalType)
  const passRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0
  
  const getIcon = () => {
    switch (evalType) {
      case 'pii_detection': return Eye
      case 'hallucination_detection': return FileWarning
      case 'latency_consistency': return Activity
      default: return Gauge
    }
  }
  
  const Icon = getIcon()
  
  return (
    <div className={`eval-type-card eval-type-card--${color}`}>
      <div className="eval-type-card__header">
        <div className={`eval-type-card__icon eval-type-card__icon--${color}`}>
          <Icon size={18} />
        </div>
        <div className="eval-type-card__title">
          <span className="eval-type-card__name">{label}</span>
          <span className="eval-type-card__count">{stats.total} evaluations</span>
        </div>
        <div className={`eval-type-card__badge ${passRate === 100 ? 'eval-type-card__badge--success' : passRate >= 80 ? 'eval-type-card__badge--warning' : 'eval-type-card__badge--danger'}`}>
          {passRate.toFixed(0)}% pass
        </div>
      </div>
      
      <div className="eval-type-card__progress">
        <div className="eval-type-card__progress-bar">
          <div 
            className="eval-type-card__progress-fill eval-type-card__progress-fill--passed"
            style={{ width: `${passRate}%` }}
          />
        </div>
        <div className="eval-type-card__progress-labels">
          <span className="eval-type-card__progress-label eval-type-card__progress-label--passed">
            <CheckCircle2 size={12} /> {stats.passed} passed
          </span>
          <span className="eval-type-card__progress-label eval-type-card__progress-label--failed">
            <XCircle size={12} /> {stats.failed} failed
          </span>
        </div>
      </div>
      
      {/* Type-specific details */}
      {evalType === 'pii_detection' && stats.details && (
        <div className="eval-type-card__details">
          <div className="eval-type-card__detail">
            <span className="eval-type-card__detail-label">PII Instances Found</span>
            <span className={`eval-type-card__detail-value ${stats.details.piiCount > 0 ? 'eval-type-card__detail-value--danger' : 'eval-type-card__detail-value--success'}`}>
              {stats.details.piiCount}
            </span>
          </div>
          {stats.details.piiTypes.length > 0 && (
            <div className="eval-type-card__detail eval-type-card__detail--full">
              <span className="eval-type-card__detail-label">Types Detected</span>
              <div className="eval-type-card__tags">
                {stats.details.piiTypes.map((type, i) => (
                  <span key={i} className="eval-type-card__tag">{type}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {evalType === 'hallucination_detection' && stats.details && (
        <div className="eval-type-card__details">
          <div className="eval-type-card__detail">
            <span className="eval-type-card__detail-label">Hallucinations Detected</span>
            <span className={`eval-type-card__detail-value ${stats.details.hallucinationCount > 0 ? 'eval-type-card__detail-value--danger' : 'eval-type-card__detail-value--success'}`}>
              {stats.details.hallucinationCount}
            </span>
          </div>
          {stats.details.severityCounts && Object.keys(stats.details.severityCounts).length > 0 && (
            <div className="eval-type-card__severity-breakdown">
              {stats.details.severityCounts.minor > 0 && (
                <span className="eval-type-card__severity eval-type-card__severity--minor">
                  {stats.details.severityCounts.minor} minor
                </span>
              )}
              {stats.details.severityCounts.major > 0 && (
                <span className="eval-type-card__severity eval-type-card__severity--major">
                  {stats.details.severityCounts.major} major
                </span>
              )}
              {stats.details.severityCounts.critical > 0 && (
                <span className="eval-type-card__severity eval-type-card__severity--critical">
                  {stats.details.severityCounts.critical} critical
                </span>
              )}
            </div>
          )}
          {stats.details.avgScore != null && (
            <div className="eval-type-card__detail">
              <span className="eval-type-card__detail-label">Average Score</span>
              <span className="eval-type-card__detail-value">{(stats.details.avgScore * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
      )}
      
      {evalType === 'latency_consistency' && stats.details && (
        <div className="eval-type-card__details">
          <div className="eval-type-card__latency-stats">
            <div className="eval-type-card__detail">
              <span className="eval-type-card__detail-label">Avg Latency</span>
              <span className="eval-type-card__detail-value">{stats.details.avgLatency?.toFixed(0) || 0}ms</span>
            </div>
            <div className="eval-type-card__detail">
              <span className="eval-type-card__detail-label">P95</span>
              <span className="eval-type-card__detail-value">{stats.details.p95?.toFixed(0) || 0}ms</span>
            </div>
            <div className="eval-type-card__detail">
              <span className="eval-type-card__detail-label">Max</span>
              <span className="eval-type-card__detail-value">{stats.details.maxLatency?.toFixed(0) || 0}ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
 * Issue Traces Modal - Shows list of traces with specific issues
 */
function IssueTracesModal({ isOpen, onClose, issueType, evaluations, title }) {
  if (!isOpen) return null
  
  // Filter evaluations based on issue type
  const filteredEvaluations = useMemo(() => {
    if (!evaluations) return []
    
    switch (issueType) {
      case 'pii':
        return evaluations.filter(e => 
          e.eval_type === 'pii_detection' && !e.passed
        )
      case 'hallucination':
        return evaluations.filter(e => 
          e.eval_type === 'hallucination_detection' && !e.passed
        )
      case 'latency':
        return evaluations.filter(e => 
          e.eval_type === 'latency_consistency' && !e.passed
        )
      case 'failed':
        return evaluations.filter(e => !e.passed)
      default:
        return evaluations
    }
  }, [evaluations, issueType])
  
  const getIssueIcon = () => {
    switch (issueType) {
      case 'pii': return Eye
      case 'hallucination': return FileWarning
      case 'latency': return Activity
      case 'failed': return AlertOctagon
      default: return AlertTriangle
    }
  }
  
  const getIssueColor = () => {
    switch (issueType) {
      case 'pii': return 'purple'
      case 'hallucination': return 'amber'
      case 'latency': return 'blue'
      case 'failed': return 'red'
      default: return 'gray'
    }
  }
  
  const Icon = getIssueIcon()
  const color = getIssueColor()
  
  return (
    <motion.div
      className="issue-traces-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="issue-traces-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="issue-traces-modal__header">
          <div className={`issue-traces-modal__title-icon issue-traces-modal__title-icon--${color}`}>
            <Icon size={20} />
          </div>
          <div className="issue-traces-modal__title-content">
            <h3 className="issue-traces-modal__title">{title}</h3>
            <span className="issue-traces-modal__count">
              {filteredEvaluations.length} trace{filteredEvaluations.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <button className="issue-traces-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="issue-traces-modal__body">
          {filteredEvaluations.length === 0 ? (
            <div className="issue-traces-modal__empty">
              <CheckCircle2 size={32} />
              <p>No issues found for this category.</p>
            </div>
          ) : (
            <div className="issue-traces-list">
              {filteredEvaluations.map((evaluation, index) => (
                <div key={evaluation.id || index} className={`issue-trace-item issue-trace-item--${color}`}>
                  <div className="issue-trace-item__header">
                    <div className="issue-trace-item__api">
                      <span className="issue-trace-item__provider">{evaluation.eventProvider}</span>
                      <span className="issue-trace-item__api-name">{evaluation.eventApi}</span>
                    </div>
                    <div className="issue-trace-item__meta">
                      {evaluation.eventModel && (
                        <span className="issue-trace-item__model">{evaluation.eventModel}</span>
                      )}
                      {evaluation.eventDuration && (
                        <span className="issue-trace-item__duration">{formatDuration(evaluation.eventDuration)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="issue-trace-item__prompt">
                    <span className="issue-trace-item__prompt-label">Prompt</span>
                    <p className="issue-trace-item__prompt-text">
                      {truncateString(getPromptFromRequest(evaluation.eventRequest), 200)}
                    </p>
                  </div>
                  
                  {evaluation.eventResponse?.text && (
                    <div className="issue-trace-item__response">
                      <span className="issue-trace-item__response-label">Response</span>
                      <p className="issue-trace-item__response-text">
                        {truncateString(evaluation.eventResponse.text, 200)}
                      </p>
                    </div>
                  )}
                  
                  <div className="issue-trace-item__details">
                    <div className="issue-trace-item__eval-info">
                      <span className={`issue-trace-item__badge issue-trace-item__badge--${evaluation.passed ? 'passed' : 'failed'}`}>
                        {evaluation.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {evaluation.passed ? 'Passed' : 'Failed'}
                      </span>
                      <span className="issue-trace-item__score">
                        Score: {(evaluation.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    {evaluation.feedback && (
                      <p className="issue-trace-item__feedback">{evaluation.feedback}</p>
                    )}
                    
                    {/* PII specific details */}
                    {issueType === 'pii' && evaluation.result?.pii_types_found?.length > 0 && (
                      <div className="issue-trace-item__pii-types">
                        <span className="issue-trace-item__pii-label">PII Types Found:</span>
                        <div className="issue-trace-item__pii-tags">
                          {evaluation.result.pii_types_found.map((type, i) => (
                            <span key={i} className="issue-trace-item__pii-tag">{type}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Hallucination specific details */}
                    {issueType === 'hallucination' && evaluation.result?.hallucinations?.length > 0 && (
                      <div className="issue-trace-item__hallucinations">
                        {evaluation.result.hallucinations.map((h, i) => (
                          <div key={i} className={`issue-trace-item__hallucination issue-trace-item__hallucination--${h.severity || 'minor'}`}>
                            <span className="issue-trace-item__hallucination-severity">{h.severity || 'unknown'}</span>
                            <span className="issue-trace-item__hallucination-text">{h.text || h.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Latency specific details */}
                    {issueType === 'latency' && evaluation.result && (
                      <div className="issue-trace-item__latency">
                        <span>Mean: {evaluation.result.mean?.toFixed(0) || 0}ms</span>
                        <span>P95: {evaluation.result.p95?.toFixed(0) || 0}ms</span>
                        <span>Max: {evaluation.result.max?.toFixed(0) || 0}ms</span>
                      </div>
                    )}
                  </div>
                  
                  {evaluation.sessionName && (
                    <div className="issue-trace-item__session">
                      <span>Session: {evaluation.sessionName}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Evaluations Summary Component - Aggregated overview of all evaluations
 */
export default function EvaluationsSummary({ data, isAggregated = false, sessions = [], onNavigateToIssues }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [modalState, setModalState] = useState({ isOpen: false, issueType: null, title: '' })
  
  const evaluations = useMemo(() => 
    extractAllEvaluations(data, sessions, isAggregated), 
    [data, sessions, isAggregated]
  )
  
  const handleIssueClick = (issueType, title) => {
    // If navigation callback is provided, use it; otherwise fall back to modal
    if (onNavigateToIssues) {
      onNavigateToIssues(issueType)
    } else {
      setModalState({ isOpen: true, issueType, title })
    }
  }
  
  const closeIssueModal = () => {
    setModalState({ isOpen: false, issueType: null, title: '' })
  }
  
  // Calculate overall stats
  const overallStats = useMemo(() => {
    const total = evaluations.length
    const passed = evaluations.filter(e => e.passed).length
    const failed = total - passed
    const passRate = total > 0 ? (passed / total) * 100 : 0
    const avgScore = total > 0 ? evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / total : 0
    const avgLatency = total > 0 ? evaluations.reduce((sum, e) => sum + (e.latency_ms || 0), 0) / total : 0
    
    return { total, passed, failed, passRate, avgScore, avgLatency }
  }, [evaluations])
  
  // Calculate stats by evaluation type
  const statsByType = useMemo(() => {
    const byType = {}
    
    evaluations.forEach(evaluation => {
      const type = evaluation.eval_type
      if (!byType[type]) {
        byType[type] = {
          total: 0,
          passed: 0,
          failed: 0,
          details: {}
        }
      }
      
      byType[type].total++
      if (evaluation.passed) {
        byType[type].passed++
      } else {
        byType[type].failed++
      }
      
      // Type-specific details
      if (type === 'pii_detection') {
        byType[type].details.piiCount = (byType[type].details.piiCount || 0) + (evaluation.result?.pii_count || 0)
        const piiTypes = evaluation.result?.pii_types_found || []
        byType[type].details.piiTypes = [...new Set([...(byType[type].details.piiTypes || []), ...piiTypes])]
      }
      
      if (type === 'hallucination_detection') {
        byType[type].details.hallucinationCount = (byType[type].details.hallucinationCount || 0) + (evaluation.result?.hallucination_count || 0)
        byType[type].details.scores = [...(byType[type].details.scores || []), evaluation.score || 0]
        byType[type].details.avgScore = byType[type].details.scores.reduce((a, b) => a + b, 0) / byType[type].details.scores.length
        
        // Count by severity
        if (!byType[type].details.severityCounts) {
          byType[type].details.severityCounts = { minor: 0, major: 0, critical: 0 }
        }
        const hallucinations = evaluation.result?.hallucinations || []
        hallucinations.forEach(h => {
          if (h.severity && byType[type].details.severityCounts[h.severity] !== undefined) {
            byType[type].details.severityCounts[h.severity]++
          }
        })
      }
      
      if (type === 'latency_consistency') {
        byType[type].details.latencies = [...(byType[type].details.latencies || []), evaluation.result?.mean || 0]
        byType[type].details.avgLatency = byType[type].details.latencies.reduce((a, b) => a + b, 0) / byType[type].details.latencies.length
        byType[type].details.maxLatency = Math.max(byType[type].details.maxLatency || 0, evaluation.result?.max || 0)
        byType[type].details.p95 = Math.max(byType[type].details.p95 || 0, evaluation.result?.p95 || 0)
      }
    })
    
    return byType
  }, [evaluations])
  
  // If no evaluations, show empty state
  if (evaluations.length === 0) {
    return (
      <div className="evaluations-summary evaluations-summary--empty">
        <ShieldCheck size={24} />
        <p>No evaluations found in this data.</p>
      </div>
    )
  }
  
  // Calculate issue counts for display
  const totalPII = statsByType.pii_detection?.details?.piiCount || 0
  const totalHallucinations = statsByType.hallucination_detection?.details?.hallucinationCount || 0
  const failedLatencyChecks = statsByType.latency_consistency?.failed || 0
  const hasIssues = totalPII > 0 || totalHallucinations > 0 || failedLatencyChecks > 0
  
  return (
    <div className={`evaluations-summary ${isCollapsed ? 'evaluations-summary--collapsed' : ''}`}>
      <div 
        className="evaluations-summary__header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="evaluations-summary__header-left">
          <button className="evaluations-summary__toggle">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </button>
          <h3 className="evaluations-summary__title">
            <ShieldCheck size={18} />
            Evaluations Overview
          </h3>
        </div>
        
        {/* Collapsed summary badges */}
        <div className="evaluations-summary__header-right">
          <div className={`evaluations-summary__quick-badge ${overallStats.passRate >= 90 ? 'evaluations-summary__quick-badge--success' : overallStats.passRate >= 70 ? 'evaluations-summary__quick-badge--warning' : 'evaluations-summary__quick-badge--danger'}`}>
            {overallStats.passRate >= 90 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            <span>{overallStats.passRate.toFixed(0)}% pass</span>
          </div>
          {totalPII > 0 && (
            <div className="evaluations-summary__quick-badge evaluations-summary__quick-badge--danger">
              <Eye size={14} />
              <span>{totalPII} PII</span>
            </div>
          )}
          {totalHallucinations > 0 && (
            <div className="evaluations-summary__quick-badge evaluations-summary__quick-badge--warning">
              <FileWarning size={14} />
              <span>{totalHallucinations} halluc.</span>
            </div>
          )}
          <span className="evaluations-summary__eval-count">{overallStats.total} evals</span>
        </div>
      </div>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="evaluations-summary__content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overall Stats Row */}
            <div className="evaluations-summary__overview">
              <StatCard
                icon={overallStats.passRate >= 90 ? ShieldCheck : ShieldAlert}
                label="Overall Pass Rate"
                value={`${overallStats.passRate.toFixed(1)}%`}
                subValue={`${overallStats.passed}/${overallStats.total} evaluations`}
                variant={overallStats.passRate >= 90 ? 'success' : overallStats.passRate >= 70 ? 'warning' : 'danger'}
                clickable={overallStats.failed > 0}
                onClick={() => handleIssueClick('all', 'All Failed Evaluations')}
              />
              
              <StatCard
                icon={Eye}
                label="PII Detected"
                value={totalPII}
                subValue={totalPII === 0 ? 'No PII found' : `${totalPII} instance${totalPII !== 1 ? 's' : ''} • Click to view`}
                variant={totalPII === 0 ? 'success' : 'danger'}
                clickable={totalPII > 0}
                onClick={() => handleIssueClick('pii', 'PII Detection Issues')}
              />
              
              <StatCard
                icon={FileWarning}
                label="Hallucinations"
                value={totalHallucinations}
                subValue={totalHallucinations === 0 ? 'No hallucinations' : `${totalHallucinations} detected • Click to view`}
                variant={totalHallucinations === 0 ? 'success' : 'warning'}
                clickable={totalHallucinations > 0}
                onClick={() => handleIssueClick('hallucination', 'Hallucination Detection Issues')}
              />
              
              <StatCard
                icon={Activity}
                label="Latency Issues"
                value={failedLatencyChecks}
                subValue={failedLatencyChecks === 0 ? 'All checks passed' : `${failedLatencyChecks} failed • Click to view`}
                variant={failedLatencyChecks === 0 ? 'success' : 'warning'}
                clickable={failedLatencyChecks > 0}
                onClick={() => handleIssueClick('latency', 'Latency Consistency Issues')}
              />
              
              <StatCard
                icon={Gauge}
                label="Avg Quality Score"
                value={`${(overallStats.avgScore * 100).toFixed(0)}%`}
                subValue="Across all evaluations"
                variant={overallStats.avgScore >= 0.9 ? 'success' : overallStats.avgScore >= 0.7 ? 'warning' : 'danger'}
              />
              
              <StatCard
                icon={Clock}
                label="Avg Eval Latency"
                value={`${overallStats.avgLatency.toFixed(0)}ms`}
                subValue="Evaluation processing time"
                variant="default"
              />
            </div>
            
            {/* Evaluation Types Breakdown */}
            <div className="evaluations-summary__breakdown">
              <h4 className="evaluations-summary__section-title">Breakdown by Type</h4>
              <div className="evaluations-summary__types">
                {Object.entries(statsByType).map(([type, stats]) => (
                  <EvalTypeCard key={type} evalType={type} stats={stats} />
                ))}
              </div>
            </div>
            
            {/* Quick Issues Summary */}
            {hasIssues && (
              <div className="evaluations-summary__issues">
                <h4 className="evaluations-summary__section-title">
                  <AlertTriangle size={16} />
                  Issues Requiring Attention
                </h4>
                <div className="evaluations-summary__issue-list">
                  {totalPII > 0 && (
                    <div 
                      className="eval-issue-item eval-issue-item--pii eval-issue-item--clickable"
                      onClick={() => handleIssueClick('pii', 'PII Detection Issues')}
                      role="button"
                      tabIndex={0}
                    >
                      <Eye size={16} />
                      <span><strong>{totalPII}</strong> PII instance{totalPII !== 1 ? 's' : ''} detected in model outputs</span>
                      <ExternalLink size={14} className="eval-issue-item__arrow" />
                    </div>
                  )}
                  {totalHallucinations > 0 && (
                    <div 
                      className="eval-issue-item eval-issue-item--hallucination eval-issue-item--clickable"
                      onClick={() => handleIssueClick('hallucination', 'Hallucination Detection Issues')}
                      role="button"
                      tabIndex={0}
                    >
                      <FileWarning size={16} />
                      <span><strong>{totalHallucinations}</strong> hallucination{totalHallucinations !== 1 ? 's' : ''} detected across responses</span>
                      <ExternalLink size={14} className="eval-issue-item__arrow" />
                    </div>
                  )}
                  {failedLatencyChecks > 0 && (
                    <div 
                      className="eval-issue-item eval-issue-item--latency eval-issue-item--clickable"
                      onClick={() => handleIssueClick('latency', 'Latency Consistency Issues')}
                      role="button"
                      tabIndex={0}
                    >
                      <Activity size={16} />
                      <span><strong>{failedLatencyChecks}</strong> latency check{failedLatencyChecks !== 1 ? 's' : ''} exceeded thresholds</span>
                      <ExternalLink size={14} className="eval-issue-item__arrow" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Issue Traces Modal */}
      <AnimatePresence>
        {modalState.isOpen && (
          <IssueTracesModal
            isOpen={modalState.isOpen}
            onClose={closeIssueModal}
            issueType={modalState.issueType}
            evaluations={evaluations}
            title={modalState.title}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export { extractAllEvaluations }

