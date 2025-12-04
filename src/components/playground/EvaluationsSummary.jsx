import { useMemo } from 'react'
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
  Clock
} from 'lucide-react'
import { getEvalTypeInfo } from './EvaluationBadge'
import './EvaluationsSummary.css'

/**
 * Extract all evaluations from events and trace tree
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
function StatCard({ icon: Icon, label, value, subValue, variant = 'default', trend }) {
  return (
    <div className={`eval-stat-card eval-stat-card--${variant}`}>
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
 * Evaluations Summary Component - Aggregated overview of all evaluations
 */
export default function EvaluationsSummary({ data, isAggregated = false, sessions = [] }) {
  const evaluations = useMemo(() => 
    extractAllEvaluations(data, sessions, isAggregated), 
    [data, sessions, isAggregated]
  )
  
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
  
  return (
    <div className="evaluations-summary">
      <h3 className="evaluations-summary__title">
        <ShieldCheck size={18} />
        Evaluations Overview
      </h3>
      
      {/* Overall Stats Row */}
      <div className="evaluations-summary__overview">
        <StatCard
          icon={overallStats.passRate >= 90 ? ShieldCheck : ShieldAlert}
          label="Overall Pass Rate"
          value={`${overallStats.passRate.toFixed(1)}%`}
          subValue={`${overallStats.passed}/${overallStats.total} evaluations`}
          variant={overallStats.passRate >= 90 ? 'success' : overallStats.passRate >= 70 ? 'warning' : 'danger'}
        />
        
        <StatCard
          icon={Eye}
          label="PII Detected"
          value={totalPII}
          subValue={totalPII === 0 ? 'No PII found' : `${totalPII} instance${totalPII !== 1 ? 's' : ''}`}
          variant={totalPII === 0 ? 'success' : 'danger'}
        />
        
        <StatCard
          icon={FileWarning}
          label="Hallucinations"
          value={totalHallucinations}
          subValue={totalHallucinations === 0 ? 'No hallucinations' : `${totalHallucinations} detected`}
          variant={totalHallucinations === 0 ? 'success' : 'warning'}
        />
        
        <StatCard
          icon={Activity}
          label="Latency Issues"
          value={failedLatencyChecks}
          subValue={failedLatencyChecks === 0 ? 'All checks passed' : `${failedLatencyChecks} failed`}
          variant={failedLatencyChecks === 0 ? 'success' : 'warning'}
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
      {(totalPII > 0 || totalHallucinations > 0 || overallStats.failed > 0) && (
        <div className="evaluations-summary__issues">
          <h4 className="evaluations-summary__section-title">
            <AlertTriangle size={16} />
            Issues Requiring Attention
          </h4>
          <div className="evaluations-summary__issue-list">
            {totalPII > 0 && (
              <div className="eval-issue-item eval-issue-item--pii">
                <Eye size={16} />
                <span><strong>{totalPII}</strong> PII instance{totalPII !== 1 ? 's' : ''} detected in model outputs</span>
              </div>
            )}
            {totalHallucinations > 0 && (
              <div className="eval-issue-item eval-issue-item--hallucination">
                <FileWarning size={16} />
                <span><strong>{totalHallucinations}</strong> hallucination{totalHallucinations !== 1 ? 's' : ''} detected across responses</span>
              </div>
            )}
            {failedLatencyChecks > 0 && (
              <div className="eval-issue-item eval-issue-item--latency">
                <Activity size={16} />
                <span><strong>{failedLatencyChecks}</strong> latency check{failedLatencyChecks !== 1 ? 's' : ''} exceeded thresholds</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { extractAllEvaluations }

