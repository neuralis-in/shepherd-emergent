import { Activity } from 'lucide-react'
import { formatDate } from './utils'
import './SessionInfo.css'

/**
 * Session Info Component - Displays session metadata
 */
export default function SessionInfo({ session }) {
  if (!session) return null

  const getDuration = () => {
    if (!session.started_at || !session.ended_at) return '—'
    const duration = (session.ended_at - session.started_at) * 1000
    if (duration < 1000) return `${duration.toFixed(0)}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  return (
    <div className="session-info">
      <div className="session-info__header">
        <Activity size={16} />
        <span className="session-info__name">{session.name || 'Session'}</span>
      </div>
      <div className="session-info__details">
        <div className="session-info__item">
          <span className="session-info__label">Started</span>
          <span className="session-info__value">{formatDate(session.started_at)}</span>
        </div>
        <div className="session-info__item">
          <span className="session-info__label">Duration</span>
          <span className="session-info__value">{getDuration()}</span>
        </div>
        {session.meta?.cwd && (
          <div className="session-info__item">
            <span className="session-info__label">Working Dir</span>
            <code className="session-info__code">{session.meta.cwd}</code>
          </div>
        )}
      </div>
    </div>
  )
}

