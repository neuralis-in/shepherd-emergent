import { CheckCircle2, XCircle, AlertTriangle, Shield } from 'lucide-react'
import './EvaluationBadge.css'

/**
 * Get evaluation type display info
 */
const getEvalTypeInfo = (evalType) => {
  const types = {
    pii_detection: { label: 'PII', color: 'purple' },
    latency_consistency: { label: 'Latency', color: 'blue' },
    hallucination_detection: { label: 'Hallucination', color: 'amber' },
    toxicity_detection: { label: 'Toxicity', color: 'red' },
    relevance_check: { label: 'Relevance', color: 'teal' },
    coherence_check: { label: 'Coherence', color: 'indigo' },
    custom: { label: 'Custom', color: 'gray' }
  }
  return types[evalType] || { label: evalType?.replace(/_/g, ' ') || 'Eval', color: 'gray' }
}

/**
 * Single evaluation pill - compact indicator for one evaluation
 */
function EvalPill({ evaluation }) {
  const { label, color } = getEvalTypeInfo(evaluation.eval_type)
  const passed = evaluation.passed
  
  return (
    <span 
      className={`eval-pill eval-pill--${color} ${!passed ? 'eval-pill--failed' : ''}`}
      title={`${label}: ${evaluation.feedback || (passed ? 'Passed' : 'Failed')} (Score: ${evaluation.score})`}
    >
      {passed ? (
        <CheckCircle2 size={10} className="eval-pill__icon" />
      ) : (
        <XCircle size={10} className="eval-pill__icon" />
      )}
      <span className="eval-pill__label">{label}</span>
    </span>
  )
}

/**
 * Evaluation Badge Component - Compact summary of evaluations
 * Shows pass/fail counts and individual eval pills
 */
export default function EvaluationBadge({ evaluations, compact = false }) {
  if (!evaluations || evaluations.length === 0) return null

  const passedCount = evaluations.filter(e => e.passed).length
  const failedCount = evaluations.length - passedCount
  const allPassed = failedCount === 0

  if (compact) {
    // Ultra-compact mode: just show icon and count
    return (
      <span 
        className={`eval-badge eval-badge--compact ${allPassed ? 'eval-badge--passed' : 'eval-badge--failed'}`}
        title={`${passedCount}/${evaluations.length} evaluations passed`}
      >
        <Shield size={12} />
        <span className="eval-badge__count">{passedCount}/{evaluations.length}</span>
      </span>
    )
  }

  // Standard mode: show summary + pills for failed/important evals
  return (
    <div className="eval-badge">
      <div className={`eval-badge__summary ${allPassed ? 'eval-badge__summary--passed' : 'eval-badge__summary--warning'}`}>
        {allPassed ? (
          <CheckCircle2 size={12} />
        ) : (
          <AlertTriangle size={12} />
        )}
        <span>{passedCount}/{evaluations.length}</span>
      </div>
      <div className="eval-badge__pills">
        {evaluations.slice(0, 3).map((evaluation) => (
          <EvalPill key={evaluation.id} evaluation={evaluation} />
        ))}
        {evaluations.length > 3 && (
          <span className="eval-badge__more">+{evaluations.length - 3}</span>
        )}
      </div>
    </div>
  )
}

export { getEvalTypeInfo, EvalPill }

