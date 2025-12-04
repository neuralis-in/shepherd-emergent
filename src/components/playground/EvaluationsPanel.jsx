import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  Gauge,
  FileWarning,
  ShieldCheck,
  Activity,
  Info
} from 'lucide-react'
import { getEvalTypeInfo } from './EvaluationBadge'
import './EvaluationsPanel.css'

/**
 * Get icon for evaluation type
 */
const getEvalIcon = (evalType) => {
  const icons = {
    pii_detection: ShieldCheck,
    latency_consistency: Activity,
    hallucination_detection: FileWarning,
    toxicity_detection: AlertTriangle,
    relevance_check: Gauge,
    coherence_check: Info
  }
  return icons[evalType] || Info
}

/**
 * Format assertion result
 */
function AssertionItem({ assertion }) {
  return (
    <div className={`assertion-item ${assertion.passed ? 'assertion-item--passed' : 'assertion-item--failed'}`}>
      <div className="assertion-item__status">
        {assertion.passed ? (
          <CheckCircle2 size={12} />
        ) : (
          <XCircle size={12} />
        )}
      </div>
      <div className="assertion-item__content">
        <span className="assertion-item__name">{assertion.name}</span>
        {assertion.message && (
          <span className="assertion-item__message">{assertion.message}</span>
        )}
        {(assertion.expected || assertion.actual) && (
          <div className="assertion-item__details">
            {assertion.expected && (
              <span className="assertion-item__detail">
                <strong>Expected:</strong> {assertion.expected}
              </span>
            )}
            {assertion.actual && (
              <span className="assertion-item__detail">
                <strong>Actual:</strong> {assertion.actual}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Hallucination item display
 */
function HallucinationItem({ hallucination, index }) {
  return (
    <div className={`hallucination-item hallucination-item--${hallucination.severity}`}>
      <div className="hallucination-item__header">
        <span className="hallucination-item__index">#{index + 1}</span>
        <span className={`hallucination-item__severity hallucination-item__severity--${hallucination.severity}`}>
          {hallucination.severity}
        </span>
      </div>
      <p className="hallucination-item__claim">"{hallucination.claim}"</p>
      <p className="hallucination-item__reason">{hallucination.reason}</p>
    </div>
  )
}

/**
 * Latency statistics display
 */
function LatencyStats({ result }) {
  const stats = [
    { label: 'Mean', value: result.mean, unit: 'ms' },
    { label: 'P50', value: result.p50, unit: 'ms' },
    { label: 'P95', value: result.p95, unit: 'ms' },
    { label: 'P99', value: result.p99, unit: 'ms' },
    { label: 'Min', value: result.min, unit: 'ms' },
    { label: 'Max', value: result.max, unit: 'ms' }
  ].filter(s => s.value != null)

  return (
    <div className="latency-stats">
      {stats.map(stat => (
        <div key={stat.label} className="latency-stats__item">
          <span className="latency-stats__label">{stat.label}</span>
          <span className="latency-stats__value">
            {typeof stat.value === 'number' ? stat.value.toFixed(2) : stat.value}{stat.unit}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Single evaluation card
 */
function EvaluationCard({ evaluation }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { label, color } = getEvalTypeInfo(evaluation.eval_type)
  const Icon = getEvalIcon(evaluation.eval_type)
  const hasDetails = evaluation.result && (
    evaluation.result.assertions?.length > 0 ||
    evaluation.result.hallucinations?.length > 0 ||
    evaluation.result.analysis ||
    evaluation.eval_type === 'latency_consistency'
  )

  return (
    <div className={`evaluation-card evaluation-card--${color} ${!evaluation.passed ? 'evaluation-card--failed' : ''}`}>
      <div 
        className="evaluation-card__header"
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
        style={{ cursor: hasDetails ? 'pointer' : 'default' }}
      >
        <div className={`evaluation-card__icon evaluation-card__icon--${color}`}>
          <Icon size={16} />
        </div>
        
        <div className="evaluation-card__info">
          <span className="evaluation-card__type">{label}</span>
          <span className="evaluation-card__feedback">
            {evaluation.feedback || (evaluation.passed ? 'Passed' : 'Failed')}
          </span>
        </div>

        <div className="evaluation-card__meta">
          <div className="evaluation-card__score">
            <Gauge size={12} />
            <span>{(evaluation.score * 100).toFixed(0)}%</span>
          </div>
          
          {evaluation.latency_ms > 0 && (
            <div className="evaluation-card__latency">
              <Clock size={12} />
              <span>{evaluation.latency_ms}ms</span>
            </div>
          )}
          
          <div className={`evaluation-card__status ${evaluation.passed ? 'evaluation-card__status--passed' : 'evaluation-card__status--failed'}`}>
            {evaluation.passed ? (
              <CheckCircle2 size={14} />
            ) : (
              <XCircle size={14} />
            )}
          </div>

          {hasDetails && (
            <button className="evaluation-card__toggle">
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && hasDetails && (
          <motion.div
            className="evaluation-card__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Analysis (for hallucination detection) */}
            {evaluation.result.analysis && (
              <div className="evaluation-card__section">
                <h5>Analysis</h5>
                <p className="evaluation-card__analysis">{evaluation.result.analysis}</p>
              </div>
            )}

            {/* Latency stats */}
            {evaluation.eval_type === 'latency_consistency' && evaluation.result && (
              <div className="evaluation-card__section">
                <h5>Latency Metrics</h5>
                <LatencyStats result={evaluation.result} />
              </div>
            )}

            {/* Hallucinations */}
            {evaluation.result.hallucinations?.length > 0 && (
              <div className="evaluation-card__section">
                <h5>Detected Hallucinations ({evaluation.result.hallucination_count})</h5>
                <div className="evaluation-card__hallucinations">
                  {evaluation.result.hallucinations.map((h, i) => (
                    <HallucinationItem key={i} hallucination={h} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Assertions */}
            {evaluation.result.assertions?.length > 0 && (
              <div className="evaluation-card__section">
                <h5>Assertions</h5>
                <div className="evaluation-card__assertions">
                  {evaluation.result.assertions.map((assertion, i) => (
                    <AssertionItem key={i} assertion={assertion} />
                  ))}
                </div>
              </div>
            )}

            {/* PII-specific info */}
            {evaluation.eval_type === 'pii_detection' && evaluation.result && (
              <div className="evaluation-card__section">
                <h5>PII Detection Details</h5>
                <div className="evaluation-card__pii-info">
                  <span><strong>PII Count:</strong> {evaluation.result.pii_count || 0}</span>
                  <span><strong>Checked Fields:</strong> {evaluation.result.checked_fields?.join(', ') || 'N/A'}</span>
                  {evaluation.result.pii_types_found?.length > 0 && (
                    <span><strong>Types Found:</strong> {evaluation.result.pii_types_found.join(', ')}</span>
                  )}
                </div>
              </div>
            )}

            {/* Human feedback */}
            {evaluation.human_feedback && (
              <div className="evaluation-card__section">
                <h5>Human Feedback</h5>
                <p className="evaluation-card__human-feedback">{evaluation.human_feedback}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="evaluation-card__metadata">
              <span>Evaluator: <code>{evaluation.evaluator}</code></span>
              {evaluation.result.judge_model && (
                <span>Judge Model: <code>{evaluation.result.judge_model}</code></span>
              )}
              <span>Status: {evaluation.status}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Evaluations Panel Component - Full details view of all evaluations
 */
export default function EvaluationsPanel({ evaluations }) {
  if (!evaluations || evaluations.length === 0) return null

  const passedCount = evaluations.filter(e => e.passed).length
  const failedCount = evaluations.length - passedCount

  return (
    <div className="evaluations-panel">
      <div className="evaluations-panel__header">
        <h4>
          <ShieldCheck size={14} />
          Evaluations
        </h4>
        <div className="evaluations-panel__summary">
          <span className="evaluations-panel__stat evaluations-panel__stat--passed">
            <CheckCircle2 size={12} />
            {passedCount} passed
          </span>
          {failedCount > 0 && (
            <span className="evaluations-panel__stat evaluations-panel__stat--failed">
              <XCircle size={12} />
              {failedCount} failed
            </span>
          )}
        </div>
      </div>
      
      <div className="evaluations-panel__list">
        {evaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>
    </div>
  )
}

export { EvaluationCard, AssertionItem, LatencyStats }

