import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { formatDuration, truncateString } from './utils'
import './PromptCard.css'

/**
 * Expandable Prompt Card Component for Analytics
 */
export default function PromptCard({ event, index, variant = 'default', sessionName }) {
  const [isExpanded, setIsExpanded] = useState(false)

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
          <span className="prompt-item__text">{truncateString(event.prompt, 50)}</span>
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
            {sessionName && (
              <span className="prompt-item__session-tag">{sessionName}</span>
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

