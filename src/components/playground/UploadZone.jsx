import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Upload,
  FileJson,
  ChevronRight,
  Play,
  Cloud
} from 'lucide-react'
import './UploadZone.css'

/**
 * Upload Zone Component - Drag & drop file upload area
 */
export default function UploadZone({ 
  onUpload, 
  onLoadSample, 
  isDragging, 
  setIsDragging, 
  isLoadingSample, 
  onOpenGCPModal 
}) {
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

  return (
    <motion.div
      className={`upload-zone ${isDragging ? 'upload-zone--dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="upload-zone__content">
        <div className="upload-zone__icon">
          <FileJson size={48} />
        </div>
        <h2 className="upload-zone__title">Upload Observability Data</h2>
        <p className="upload-zone__desc">
          Drag & drop your <code>llm_observability.json</code> files here, or click to browse
        </p>
        <div className="upload-zone__actions">
          <label className="upload-zone__button">
            <Upload size={18} />
            Select Files
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              multiple
              hidden
            />
          </label>
          <button 
            className="upload-zone__sample-btn"
            onClick={onLoadSample}
            disabled={isLoadingSample}
          >
            <Play size={18} />
            {isLoadingSample ? 'Loading...' : 'Use Sample Data'}
          </button>
        </div>
        <span className="upload-zone__hint">
          Supports multiple JSON files exported from aiobs
        </span>

        <div className="upload-zone__cloud-section">
          <div className="upload-zone__cloud-divider">
            <span>or connect to cloud storage</span>
          </div>
          <div className="upload-zone__cloud-options">
            <button className="upload-zone__cloud-btn upload-zone__cloud-btn--gcp" onClick={onOpenGCPModal}>
              <img src={`${import.meta.env.BASE_URL}gcp.png`} alt="GCP" className="upload-zone__cloud-logo" />
              <div className="upload-zone__cloud-btn-text">
                <span className="upload-zone__cloud-btn-title">Google Cloud Storage</span>
                <span className="upload-zone__cloud-btn-desc">Connect to GCS bucket</span>
              </div>
              <ChevronRight size={16} className="upload-zone__cloud-btn-arrow" />
            </button>
            <Link to="/integrations" className="upload-zone__cloud-btn upload-zone__cloud-btn--more">
              <Cloud size={20} className="upload-zone__cloud-btn-icon" />
              <div className="upload-zone__cloud-btn-text">
                <span className="upload-zone__cloud-btn-title">More Integrations</span>
                <span className="upload-zone__cloud-btn-desc">AWS, Azure & more</span>
              </div>
              <span className="upload-zone__cloud-badge">Soon</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="upload-zone__pattern" />
    </motion.div>
  )
}

