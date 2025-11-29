import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  FolderOpen,
  BarChart3,
  FileJson,
  X,
  Plus,
  ChevronDown,
  Upload
} from 'lucide-react'
import './SessionSidebar.css'

function SessionSidebar({ 
  sessions, 
  selectedSession, 
  onSelectSession, 
  onRemoveSession, 
  onUpload, 
  isDragging, 
  setIsDragging, 
  onOpenGCPModal,
  basePath = '' 
}) {
  const [showAddMenu, setShowAddMenu] = useState(false)
  
  const formatDate = (timestamp) => {
    if (!timestamp) return '—'
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getSessionStats = (session) => {
    const data = session.data
    const eventCount = (data.events?.length || 0) + (data.trace_tree?.length || 0)
    // Exclude embeddings.create from token counts
    const totalTokens = data.events?.reduce((acc, e) => {
      if (e.api === 'embeddings.create') return acc
      return acc + (e.response?.usage?.total_tokens || e.response?.usage?.total_token_count || 0)
    }, 0) || 0
    return { eventCount, totalTokens }
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [setIsDragging])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [setIsDragging])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/json' || f.name.endsWith('.json'))
    if (files.length > 0) {
      files.forEach(file => onUpload(file))
    }
  }, [onUpload, setIsDragging])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => onUpload(file))
  }, [onUpload])

  // Resolve GCP icon path
  const gcpIconPath = basePath ? `${basePath}gcp.png` : `${import.meta.env.BASE_URL}gcp.png`

  return (
    <div className="session-sidebar">
      <div className="session-sidebar__header">
        <h3>
          <FolderOpen size={16} />
          Sessions
        </h3>
        <span className="session-sidebar__count">{sessions.length}</span>
      </div>

      <div className="session-sidebar__list">
        {/* Overview Item */}
        <motion.div
          className={`session-sidebar__item ${selectedSession === null ? 'session-sidebar__item--active' : ''}`}
          onClick={() => onSelectSession(null)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="session-sidebar__item-icon session-sidebar__item-icon--overview">
            <BarChart3 size={16} />
          </div>
          <div className="session-sidebar__item-info">
            <span className="session-sidebar__item-name">All Sessions Overview</span>
            <span className="session-sidebar__item-meta">Aggregated analytics</span>
          </div>
        </motion.div>

        <div className="session-sidebar__divider" />

        {/* Session Items */}
        {sessions.map((session, index) => {
          const sessionInfo = session.data.sessions?.[0]
          const stats = getSessionStats(session)
          const isSelected = selectedSession === session.id

          return (
            <motion.div
              key={session.id}
              className={`session-sidebar__item ${isSelected ? 'session-sidebar__item--active' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div 
                className="session-sidebar__item-content"
                onClick={() => onSelectSession(session.id)}
              >
                <div className="session-sidebar__item-icon">
                  <FileJson size={16} />
                </div>
                <div className="session-sidebar__item-info">
                  <span className="session-sidebar__item-name">
                    {sessionInfo?.name || session.fileName}
                  </span>
                  <span className="session-sidebar__item-meta">
                    {stats.eventCount} events • {stats.totalTokens.toLocaleString()} tokens
                  </span>
                  {sessionInfo?.started_at && (
                    <span className="session-sidebar__item-date">
                      {formatDate(sessionInfo.started_at)}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="session-sidebar__item-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveSession(session.id)
                }}
                title="Remove session"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Add More Sessions */}
      <div 
        className={`session-sidebar__add ${isDragging ? 'session-sidebar__add--dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="session-sidebar__add-wrapper">
          <button 
            className="session-sidebar__add-btn"
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            <Plus size={16} />
            <span>Add Sessions</span>
            <ChevronDown size={14} className={`session-sidebar__add-chevron ${showAddMenu ? 'session-sidebar__add-chevron--open' : ''}`} />
          </button>
          
          {showAddMenu && (
            <div className="session-sidebar__add-menu">
              <label className="session-sidebar__add-menu-item">
                <Upload size={16} />
                <span>Upload from Files</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    handleFileSelect(e)
                    setShowAddMenu(false)
                  }}
                  multiple
                  hidden
                />
              </label>
              <button 
                className="session-sidebar__add-menu-item"
                onClick={() => {
                  onOpenGCPModal()
                  setShowAddMenu(false)
                }}
              >
                <img src={gcpIconPath} alt="GCP" className="session-sidebar__add-menu-gcp-icon" />
                <span>Import from GCP</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SessionSidebar

