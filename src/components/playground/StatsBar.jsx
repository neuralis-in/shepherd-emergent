import { Layers, Clock, Zap } from 'lucide-react'
import './StatsBar.css'

/**
 * Stats Bar Component - Displays summary statistics
 */
export default function StatsBar({ data }) {
  const eventCount = (data.events?.length || 0) + (data.function_events?.length || 0)

  const totalDuration = data.events?.reduce((acc, e) => acc + (e.duration_ms || 0), 0) || 0
  
  // Support both OpenAI (total_tokens) and Gemini (total_token_count) formats
  // Exclude embeddings.create from token counts
  const totalTokens = data.events?.reduce((acc, e) => {
    if (e.api === 'embeddings.create') return acc
    return acc + (e.response?.usage?.total_tokens || e.response?.usage?.total_token_count || 0)
  }, 0) || 0

  return (
    <div className="stats-bar">
      <div className="stats-bar__item">
        <Layers size={16} />
        <span className="stats-bar__value">{eventCount}</span>
        <span className="stats-bar__label">Traces</span>
      </div>
      <div className="stats-bar__item">
        <Clock size={16} />
        <span className="stats-bar__value">
          {totalDuration < 1000 ? `${totalDuration.toFixed(0)}ms` : `${(totalDuration / 1000).toFixed(2)}s`}
        </span>
        <span className="stats-bar__label">Total Time</span>
      </div>
      <div className="stats-bar__item">
        <Zap size={16} />
        <span className="stats-bar__value">{totalTokens.toLocaleString()}</span>
        <span className="stats-bar__label">Tokens</span>
      </div>
    </div>
  )
}

