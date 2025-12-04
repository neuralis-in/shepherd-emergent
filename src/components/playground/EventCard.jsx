import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Cpu,
  Terminal,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { fadeInUp } from './constants'
import { formatDuration } from './utils'
import EvaluationBadge from './EvaluationBadge'
import EvaluationsPanel from './EvaluationsPanel'
import './EventCard.css'

/**
 * Event Card Component - Displays an event in flat list view
 */
export default function EventCard({ event, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getEventIcon = () => {
    if (event.provider === 'function') return <Terminal size={16} />
    return <Cpu size={16} />
  }

  const hasEvaluations = event.evaluations && event.evaluations.length > 0

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
          {hasEvaluations && (
            <EvaluationBadge evaluations={event.evaluations} compact />
          )}
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
            {/* Handle different input formats: contents (Gemini), messages (OpenAI chat), input (OpenAI embeddings) */}
            {(event.request?.contents || event.request?.messages || event.request?.input) && (
              <div className="event-card__section">
                <h4>Input</h4>
                <p className="event-card__text">
                  {event.request?.contents || 
                   (event.request?.messages && event.request.messages.map(m => `[${m.role}]: ${m.content}`).join('\n')) ||
                   (event.request?.input && (Array.isArray(event.request.input) ? event.request.input.join(' | ') : event.request.input))}
                </p>
              </div>
            )}
            {event.response?.text && (
              <div className="event-card__section">
                <h4>Output</h4>
                <p className="event-card__text event-card__text--output">{event.response.text}</p>
              </div>
            )}
            {/* For embeddings, show dimensions instead of output text */}
            {event.api === 'embeddings.create' && event.response?.embedding_dimensions && (
              <div className="event-card__section">
                <h4>Embedding Output</h4>
                <p className="event-card__text event-card__text--output">
                  {event.response.data?.length || 1} embedding(s) with {event.response.embedding_dimensions} dimensions
                </p>
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
                <span>Tokens: {event.response.usage.total_tokens || event.response.usage.total_token_count || 0}</span>
              </div>
            )}

            {/* Evaluations Panel */}
            {hasEvaluations && (
              <EvaluationsPanel evaluations={event.evaluations} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

