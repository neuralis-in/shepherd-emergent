import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Cpu,
  Terminal,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react'
import { formatDuration } from './utils'
import EvaluationBadge from './EvaluationBadge'
import EvaluationsPanel from './EvaluationsPanel'
import './TreeNode.css'

/**
 * Node Details Component - Shows expanded details for a trace node
 */
export function NodeDetails({ node, depth }) {
  const [isOpen, setIsOpen] = useState(false)

  const hasEvaluations = node.evaluations && node.evaluations.length > 0
  const hasDetails = node.request || node.response || node.result || node.error || hasEvaluations

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
                {/* Handle different input formats: contents (Gemini), messages (OpenAI chat), input (OpenAI embeddings) */}
                {(node.request.contents || node.request.messages || node.request.input) && (
                  <div className="node-details__field">
                    <span className="node-details__field-label">
                      {node.api === 'embeddings.create' ? 'Input Text:' : 'Prompt:'}
                    </span>
                    <p className="node-details__field-value">
                      {node.request.contents || 
                       (node.request.messages && node.request.messages.map(m => `[${m.role}]: ${m.content}`).join('\n')) ||
                       (node.request.input && (Array.isArray(node.request.input) ? node.request.input.join(' | ') : node.request.input))}
                    </p>
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
                {/* For embeddings, show dimensions instead of output text */}
                {node.api === 'embeddings.create' && node.response.embedding_dimensions && (
                  <div className="node-details__field">
                    <span className="node-details__field-label">Embedding Output:</span>
                    <p className="node-details__field-value node-details__field-value--output">
                      {node.response.data?.length || 1} embedding(s) with {node.response.embedding_dimensions} dimensions
                    </p>
                  </div>
                )}
                {node.response.usage && (
                  <div className="node-details__usage">
                    <div className="node-details__usage-item">
                      <span>Input tokens</span>
                      <strong>{node.response.usage.prompt_tokens || node.response.usage.prompt_token_count || 0}</strong>
                    </div>
                    {node.api !== 'embeddings.create' && (
                      <div className="node-details__usage-item">
                        <span>Output tokens</span>
                        <strong>{node.response.usage.completion_tokens || node.response.usage.candidates_token_count || 0}</strong>
                      </div>
                    )}
                    <div className="node-details__usage-item">
                      <span>Total tokens</span>
                      <strong>{node.response.usage.total_tokens || node.response.usage.total_token_count || 0}</strong>
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

            {/* Evaluations */}
            {hasEvaluations && (
              <EvaluationsPanel evaluations={node.evaluations} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Tree Node Component - Displays a trace node in tree view
 */
export default function TreeNode({ node, depth = 0, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0
  const hasEvaluations = node.evaluations && node.evaluations.length > 0

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
          {hasEvaluations && (
            <EvaluationBadge evaluations={node.evaluations} compact />
          )}
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

