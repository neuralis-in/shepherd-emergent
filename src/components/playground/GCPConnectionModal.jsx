import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Key,
  RefreshCw,
  FolderOpen,
  Folder,
  FileJson,
  Database,
  Loader2,
  Check,
  Circle,
  CheckCircle,
  Upload
} from 'lucide-react'
import { formatSize } from './utils'
import './GCPConnectionModal.css'

/**
 * GCP Connection Modal Component - Connect to Google Cloud Storage
 */
export default function GCPConnectionModal({ 
  isOpen, 
  onClose, 
  onImportFiles 
}) {
  const [step, setStep] = useState('connect') // 'connect', 'buckets', 'browse', 'select'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [accessToken, setAccessToken] = useState('')
  const [projectId, setProjectId] = useState('')
  const [buckets, setBuckets] = useState([])
  const [selectedBucket, setSelectedBucket] = useState(null)
  const [currentPath, setCurrentPath] = useState('')
  const [items, setItems] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])

  // List buckets from GCS
  const handleConnect = useCallback(async () => {
    if (!accessToken.trim()) {
      setError('Please enter your GCP access token.')
      return
    }
    if (!projectId.trim()) {
      setError('Please enter your GCP project ID.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://storage.googleapis.com/storage/v1/b?project=${projectId.trim()}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken.trim()}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 401) {
          throw new Error('Invalid or expired access token. Please generate a new one.')
        } else if (response.status === 403) {
          throw new Error('Access denied. Make sure your account has Storage permissions.')
        } else {
          throw new Error(errorData.error?.message || `Failed to list buckets (${response.status})`)
        }
      }

      const data = await response.json()
      const bucketList = (data.items || []).map(b => ({
        name: b.name,
        created: new Date(b.timeCreated).toLocaleDateString(),
        location: b.location,
      }))

      if (bucketList.length === 0) {
        setError('No buckets found in this project.')
        return
      }

      setBuckets(bucketList)
      setStep('buckets')
    } catch (err) {
      setError(err.message || 'Failed to connect to GCP. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, projectId])

  // List objects in bucket
  const listBucketContents = useCallback(async (bucketName, prefix = '') => {
    const params = new URLSearchParams({
      delimiter: '/',
      ...(prefix && { prefix }),
    })

    const response = await fetch(
      `https://storage.googleapis.com/storage/v1/b/${bucketName}/o?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || 'Failed to list bucket contents')
    }

    const data = await response.json()
    const itemsList = []

    // Add folders (prefixes)
    if (data.prefixes) {
      data.prefixes.forEach(p => {
        const folderName = prefix ? p.replace(prefix, '') : p
        itemsList.push({
          name: folderName,
          fullPath: p,
          type: 'folder',
          size: null,
        })
      })
    }

    // Add files
    if (data.items) {
      data.items.forEach(item => {
        const fileName = prefix ? item.name.replace(prefix, '') : item.name
        // Skip if it's just the prefix itself (empty folder marker)
        if (fileName && fileName !== '/') {
          itemsList.push({
            name: fileName,
            fullPath: item.name,
            type: 'file',
            size: formatSize(parseInt(item.size || 0)),
            rawSize: parseInt(item.size || 0),
          })
        }
      })
    }

    return itemsList
  }, [accessToken])

  const handleSelectBucket = useCallback(async (bucket) => {
    setSelectedBucket(bucket)
    setIsLoading(true)
    setCurrentPath('')
    setError(null)

    try {
      const bucketItems = await listBucketContents(bucket.name)
      setItems(bucketItems)
      setStep('browse')
    } catch (err) {
      setError(err.message || 'Failed to list bucket contents.')
    } finally {
      setIsLoading(false)
    }
  }, [listBucketContents])

  const handleNavigate = useCallback(async (folderPath) => {
    setIsLoading(true)
    setError(null)

    try {
      const folderItems = await listBucketContents(selectedBucket.name, folderPath)
      setItems(folderItems)
      setCurrentPath(folderPath)
    } catch (err) {
      setError(err.message || 'Failed to navigate folder.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedBucket, listBucketContents])

  const handleGoBack = useCallback(async () => {
    if (!currentPath) {
      setStep('buckets')
      setSelectedBucket(null)
      setItems([])
      return
    }

    setIsLoading(true)
    setError(null)

    // Calculate parent path
    const pathParts = currentPath.split('/').filter(Boolean)
    pathParts.pop()
    const parentPath = pathParts.length > 0 ? pathParts.join('/') + '/' : ''

    try {
      const parentItems = await listBucketContents(selectedBucket.name, parentPath)
      setItems(parentItems)
      setCurrentPath(parentPath)
    } catch (err) {
      setError(err.message || 'Failed to navigate.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPath, selectedBucket, listBucketContents])

  const handleToggleFile = useCallback((file) => {
    setSelectedFiles(prev => {
      const exists = prev.find(f => f.fullPath === file.fullPath)
      if (exists) {
        return prev.filter(f => f.fullPath !== file.fullPath)
      }
      return [...prev, file]
    })
  }, [])

  const handleSelectAllJson = useCallback(() => {
    const jsonFiles = items.filter(item => item.type === 'file' && item.name.endsWith('.json'))
    const allSelected = jsonFiles.every(f => selectedFiles.find(sf => sf.fullPath === f.fullPath))
    
    if (allSelected) {
      setSelectedFiles(prev => prev.filter(f => !jsonFiles.find(jf => jf.fullPath === f.fullPath)))
    } else {
      setSelectedFiles(prev => {
        const newFiles = jsonFiles.filter(jf => !prev.find(p => p.fullPath === jf.fullPath))
        return [...prev, ...newFiles]
      })
    }
  }, [items, selectedFiles])

  const handleImport = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one JSON file.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const importedData = []

      for (const file of selectedFiles) {
        // Fetch actual file contents from GCS
        const response = await fetch(
          `https://storage.googleapis.com/storage/v1/b/${selectedBucket.name}/o/${encodeURIComponent(file.fullPath)}?alt=media`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken.trim()}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to download ${file.name}`)
        }

        const data = await response.json()
        importedData.push({
          fileName: file.name,
          data,
        })
      }

      onImportFiles(importedData)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to import files. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedFiles, selectedBucket, accessToken, onImportFiles, onClose])

  const handleReset = useCallback(() => {
    setStep('connect')
    setAccessToken('')
    setProjectId('')
    setBuckets([])
    setSelectedBucket(null)
    setCurrentPath('')
    setItems([])
    setSelectedFiles([])
    setError(null)
  }, [])

  if (!isOpen) return null

  const jsonFilesInView = items.filter(item => item.type === 'file' && item.name.endsWith('.json'))
  const allJsonSelected = jsonFilesInView.length > 0 && jsonFilesInView.every(f => selectedFiles.find(sf => sf.fullPath === f.fullPath))

  return (
    <motion.div
      className="gcp-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="gcp-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gcp-modal__header">
          <div className="gcp-modal__header-left">
            <img src={`${import.meta.env.BASE_URL}gcp.png`} alt="GCP" className="gcp-modal__logo" />
            <div>
              <h2>Connect to Google Cloud Storage</h2>
              <p>Import observability JSON files from your GCS bucket</p>
            </div>
          </div>
          <button className="gcp-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="gcp-modal__steps">
          <div className={`gcp-modal__step ${step === 'connect' ? 'gcp-modal__step--active' : ''} ${['buckets', 'browse', 'select'].includes(step) ? 'gcp-modal__step--done' : ''}`}>
            <div className="gcp-modal__step-number">
              {['buckets', 'browse', 'select'].includes(step) ? <Check size={14} /> : '1'}
            </div>
            <span>Connect</span>
          </div>
          <div className="gcp-modal__step-line" />
          <div className={`gcp-modal__step ${step === 'buckets' ? 'gcp-modal__step--active' : ''} ${['browse', 'select'].includes(step) ? 'gcp-modal__step--done' : ''}`}>
            <div className="gcp-modal__step-number">
              {['browse', 'select'].includes(step) ? <Check size={14} /> : '2'}
            </div>
            <span>Bucket</span>
          </div>
          <div className="gcp-modal__step-line" />
          <div className={`gcp-modal__step ${step === 'browse' || step === 'select' ? 'gcp-modal__step--active' : ''}`}>
            <div className="gcp-modal__step-number">3</div>
            <span>Select Files</span>
          </div>
        </div>

        <div className="gcp-modal__content">
          {error && (
            <motion.div
              className="gcp-modal__error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Step 1: Connect */}
          {step === 'connect' && (
            <div className="gcp-connect">
              <div className="gcp-connect__info">
                <Key size={20} />
                <div>
                  <h3>GCP Access Token Authentication</h3>
                  <p>Enter your GCP project ID and access token to connect.</p>
                </div>
              </div>

              <div className="gcp-connect__form">
                <div className="gcp-connect__field">
                  <label htmlFor="gcp-project-id">Project ID</label>
                  <input
                    id="gcp-project-id"
                    type="text"
                    placeholder="e.g., my-project-123456"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="gcp-connect__input"
                  />
                </div>

                <div className="gcp-connect__field">
                  <label htmlFor="gcp-access-token">Access Token</label>
                  <input
                    type="password"
                    id="gcp-access-token"
                    placeholder="Paste your access token here..."
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="gcp-connect__input"
                  />
                </div>
              </div>

              <div className="gcp-connect__help">
                <h4>How to get an access token:</h4>
                <ol>
                  <li>Install Google Cloud CLI (<code>gcloud</code>)</li>
                  <li>Run: <code>gcloud auth login</code></li>
                  <li>Run: <code>gcloud auth print-access-token</code></li>
                  <li>Copy the token and paste it above</li>
                </ol>
                <p className="gcp-connect__help-note">
                  <AlertCircle size={14} />
                  Tokens expire after ~1 hour. Generate a new one if needed.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Select Bucket */}
          {step === 'buckets' && (
            <div className="gcp-buckets">
              <div className="gcp-buckets__header">
                <h3>Select a Bucket</h3>
                <button className="gcp-buckets__refresh" onClick={handleConnect} disabled={isLoading}>
                  <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
                </button>
              </div>
              <div className="gcp-buckets__list">
                {buckets.map((bucket) => (
                  <button
                    key={bucket.name}
                    className="gcp-bucket-item"
                    onClick={() => handleSelectBucket(bucket)}
                    disabled={isLoading}
                  >
                    <Database size={18} />
                    <div className="gcp-bucket-item__info">
                      <span className="gcp-bucket-item__name">{bucket.name}</span>
                      <span className="gcp-bucket-item__date">Created: {bucket.created}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Browse & Select Files */}
          {(step === 'browse' || step === 'select') && (
            <div className="gcp-browser">
              <div className="gcp-browser__header">
                <div className="gcp-browser__breadcrumb">
                  <button 
                    className="gcp-browser__back" 
                    onClick={handleGoBack}
                    disabled={isLoading}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="gcp-browser__bucket-name">
                    <Database size={14} />
                    {selectedBucket?.name}
                  </span>
                  {currentPath && (
                    <>
                      <ChevronRight size={14} />
                      <span className="gcp-browser__path">{currentPath}</span>
                    </>
                  )}
                </div>
                {jsonFilesInView.length > 0 && (
                  <button 
                    className={`gcp-browser__select-all ${allJsonSelected ? 'gcp-browser__select-all--active' : ''}`}
                    onClick={handleSelectAllJson}
                  >
                    {allJsonSelected ? <CheckCircle size={14} /> : <Circle size={14} />}
                    Select all JSON
                  </button>
                )}
              </div>

              <div className="gcp-browser__list">
                {isLoading ? (
                  <div className="gcp-browser__loading">
                    <Loader2 size={24} className="spinning" />
                    <span>Loading...</span>
                  </div>
                ) : items.length === 0 ? (
                  <div className="gcp-browser__empty">
                    <FolderOpen size={24} />
                    <span>No items in this folder</span>
                  </div>
                ) : (
                  items.map((item) => {
                    const isSelected = selectedFiles.find(f => f.fullPath === item.fullPath)
                    return (
                      <div
                        key={item.fullPath || item.name}
                        className={`gcp-browser__item ${item.type === 'folder' ? 'gcp-browser__item--folder' : ''} ${isSelected ? 'gcp-browser__item--selected' : ''}`}
                      >
                        {item.type === 'folder' ? (
                          <button
                            className="gcp-browser__item-content"
                            onClick={() => handleNavigate(item.fullPath)}
                            disabled={isLoading}
                          >
                            <Folder size={18} className="gcp-browser__item-icon--folder" />
                            <span className="gcp-browser__item-name">{item.name}</span>
                            <ChevronRight size={16} />
                          </button>
                        ) : (
                          <button
                            className="gcp-browser__item-content"
                            onClick={() => item.name.endsWith('.json') && handleToggleFile(item)}
                            disabled={!item.name.endsWith('.json')}
                          >
                            <div className={`gcp-browser__checkbox ${isSelected ? 'gcp-browser__checkbox--checked' : ''}`}>
                              {isSelected && <Check size={12} />}
                            </div>
                            <FileJson size={18} className={`gcp-browser__item-icon--file ${item.name.endsWith('.json') ? 'gcp-browser__item-icon--json' : ''}`} />
                            <span className="gcp-browser__item-name">{item.name}</span>
                            <span className="gcp-browser__item-size">{item.size}</span>
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {selectedFiles.length > 0 && (
                <div className="gcp-browser__selection">
                  <span>{selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected</span>
                  <button className="gcp-browser__clear" onClick={() => setSelectedFiles([])}>
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="gcp-modal__footer">
          {step === 'connect' && (
            <>
              <button className="gcp-modal__btn gcp-modal__btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="gcp-modal__btn gcp-modal__btn--primary" 
                onClick={handleConnect}
                disabled={!accessToken.trim() || !projectId.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect to GCP
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </>
          )}
          {step === 'buckets' && (
            <>
              <button className="gcp-modal__btn gcp-modal__btn--secondary" onClick={handleReset}>
                <ChevronLeft size={16} />
                Back
              </button>
              <div />
            </>
          )}
          {(step === 'browse' || step === 'select') && (
            <>
              <button className="gcp-modal__btn gcp-modal__btn--secondary" onClick={() => { setStep('buckets'); setSelectedBucket(null); setCurrentPath(''); setItems([]); }}>
                <ChevronLeft size={16} />
                Change Bucket
              </button>
              <button 
                className="gcp-modal__btn gcp-modal__btn--primary" 
                onClick={handleImport}
                disabled={selectedFiles.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="spinning" />
                    Importing...
                  </>
                ) : (
                  <>
                    Import {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
                    <Upload size={16} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

