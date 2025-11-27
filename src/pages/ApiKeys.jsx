import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Loader2,
  Shield,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  LogOut,
  User,
  Zap,
  X,
  AlertTriangle
} from 'lucide-react'
import api, { copyToClipboard, signInWithGoogle } from '../api'
import './ApiKeys.css'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Syntax highlighting component
function HighlightedCode({ text }) {
  if (!text) return null
  
  const parts = []
  let remaining = text
  let key = 0
  
  while (remaining.length > 0) {
    // Check for keywords
    const keywordMatch = remaining.match(/^(from|import)\b/)
    if (keywordMatch) {
      parts.push(<span key={key++} className="keyword">{keywordMatch[1]}</span>)
      remaining = remaining.slice(keywordMatch[1].length)
      continue
    }
    
    // Check for method calls
    const methodMatch = remaining.match(/^\.(configure|observe|end|flush)\(/)
    if (methodMatch) {
      parts.push(<span key={key++}>.</span>)
      parts.push(<span key={key++} className="function">{methodMatch[1]}</span>)
      parts.push(<span key={key++}>(</span>)
      remaining = remaining.slice(methodMatch[0].length)
      continue
    }
    
    // Check for strings
    const stringMatch = remaining.match(/^"([^"]*)"?/)
    if (stringMatch) {
      parts.push(<span key={key++} className="string">{stringMatch[0]}</span>)
      remaining = remaining.slice(stringMatch[0].length)
      continue
    }
    
    // Check for comments
    const commentMatch = remaining.match(/^#.*/)
    if (commentMatch) {
      parts.push(<span key={key++} className="comment">{commentMatch[0]}</span>)
      remaining = remaining.slice(commentMatch[0].length)
      continue
    }
    
    // Check for parameter names (word followed by =)
    const paramMatch = remaining.match(/^(\w+)=/)
    if (paramMatch) {
      parts.push(<span key={key++} className="param">{paramMatch[1]}</span>)
      parts.push(<span key={key++}>=</span>)
      remaining = remaining.slice(paramMatch[0].length)
      continue
    }
    
    // Regular character
    parts.push(<span key={key++}>{remaining[0]}</span>)
    remaining = remaining.slice(1)
  }
  
  return <>{parts}</>
}

// Typing Animation Component
function TypingCode({ lines, isVisible }) {
  const [typingState, setTypingState] = useState({
    lineIndex: 0,
    charIndex: 0,
    isComplete: false
  })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!isVisible || hasStarted.current) return
    hasStarted.current = true

    const interval = setInterval(() => {
      setTypingState(prev => {
        if (prev.isComplete) {
          return prev
        }
        
        const currentLine = lines[prev.lineIndex]
        
        if (!currentLine) {
          return { ...prev, isComplete: true }
        }

        // For empty lines or context, skip quickly
        if (currentLine.type === 'empty' || currentLine.type === 'context') {
          if (prev.lineIndex < lines.length - 1) {
            return { ...prev, lineIndex: prev.lineIndex + 1, charIndex: 0 }
          }
          return { ...prev, isComplete: true }
        }

        // Type next character
        if (prev.charIndex < currentLine.text.length) {
          return { ...prev, charIndex: prev.charIndex + 1 }
        }

        // Move to next line
        if (prev.lineIndex < lines.length - 1) {
          return { ...prev, lineIndex: prev.lineIndex + 1, charIndex: 0 }
        }

        return { ...prev, isComplete: true }
      })
    }, 35)

    return () => clearInterval(interval)
  }, [isVisible, lines])

  const { lineIndex, charIndex, isComplete } = typingState

  return (
    <div className="code-diff__content">
      {lines.map((line, index) => {
        const isPastLine = index < lineIndex
        const isCurrentLine = index === lineIndex
        const isFutureLine = index > lineIndex
        
        // Don't show future lines
        if (isFutureLine && !isComplete) {
          return (
            <div key={index} className="code-diff__line code-diff__line--future">
              <span className="code-diff__gutter"></span>
              <code>&nbsp;</code>
            </div>
          )
        }

        // Empty lines
        if (line.type === 'empty') {
          return (
            <div key={index} className={`code-diff__line code-diff__line--empty${isPastLine || isCurrentLine || isComplete ? '' : ' code-diff__line--future'}`}>
              <span className="code-diff__gutter"></span>
              <code>&nbsp;</code>
            </div>
          )
        }

        // Context line (existing code - dimmed)
        if (line.type === 'context') {
          const showContent = isPastLine || isCurrentLine || isComplete
          return (
            <div key={index} className={`code-diff__line code-diff__line--context${showContent ? '' : ' code-diff__line--future'}`}>
              <span className="code-diff__gutter"></span>
              <code>
                {showContent ? <HighlightedCode text={line.text} /> : <>&nbsp;</>}
              </code>
            </div>
          )
        }

        // Added lines with typing effect
        const displayText = isPastLine || isComplete 
          ? line.text 
          : isCurrentLine 
            ? line.text.slice(0, charIndex)
            : ''

        const showCursor = isCurrentLine && !isComplete

        return (
          <div key={index} className={`code-diff__line code-diff__line--added${showCursor ? ' code-diff__line--typing' : ''}`}>
            <span className="code-diff__gutter">{(isPastLine || isCurrentLine || isComplete) ? '+' : ''}</span>
            <code>
              <HighlightedCode text={displayText} />
              {showCursor && <span className="code-diff__cursor">|</span>}
            </code>
          </div>
        )
      })}
    </div>
  )
}

// Quick Start Section Component
function QuickStartSection({ userApiKey }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  
  const codeLines = [
    { type: 'added', text: 'from aiobs import observer' },
    { type: 'empty', text: '' },
    { type: 'added', text: `observer.configure(api_key="${userApiKey || 'your-api-key-here'}")` },
    { type: 'added', text: 'observer.observe()' },
    { type: 'empty', text: '' },
    { type: 'context', text: '# your LLM calls here' },
    { type: 'empty', text: '' },
    { type: 'added', text: 'observer.end()' },
    { type: 'added', text: 'observer.flush()' },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="apikeys-quickstart" ref={sectionRef}>
      <div className="apikeys-quickstart__header">
        <h3>Quick Start</h3>
        <div className="apikeys-quickstart__badge">
          <span className="apikeys-quickstart__badge-dot"></span>
          patching...
        </div>
      </div>
      <div className="code-diff">
        <div className="code-diff__header">
          <span className="code-diff__title">agent.py</span>
        </div>
        <TypingCode lines={codeLines} isVisible={isVisible} />
      </div>
      <a 
        href="https://neuralis-in.github.io/aiobs/getting_started.html" 
        target="_blank" 
        rel="noopener noreferrer"
        className="apikeys-quickstart__link"
      >
        View full documentation →
      </a>
    </section>
  )
}

// Format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return 'Never used'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Login Section Component
function LoginSection({ onLogin, isLoading, error }) {
  return (
    <motion.div 
      className="apikeys-login"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.div className="apikeys-login__content" variants={fadeInUp}>
        <div className="apikeys-login__icon">
          <Key size={32} />
        </div>
        <h2 className="heading-lg">Access Your API Keys</h2>
        <p className="text-base">
          Sign in with Google to create and manage your Shepherd API keys.
          Free tier includes 10,000 traces per month.
        </p>
        
        {error && (
          <div className="apikeys-login__error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        <button 
          className="btn btn--google"
          onClick={onLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="spinner" />
              Connecting...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
        
        <div className="apikeys-login__features">
          <div className="apikeys-login__feature">
            <Shield size={16} />
            <span>Secure authentication</span>
          </div>
          <div className="apikeys-login__feature">
            <Zap size={16} />
            <span>10,000 free traces/month</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Create Key Modal
function CreateKeyModal({ isOpen, onClose, onCreate, isCreating }) {
  const [keyName, setKeyName] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(keyName || 'Default')
  }
  
  const handleClose = () => {
    setKeyName('')
    onClose()
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          <motion.div
            className="apikeys-modal"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="apikeys-modal__close" onClick={handleClose}>
              <X size={20} />
            </button>
            
            <div className="apikeys-modal__header">
              <div className="apikeys-modal__icon">
                <Key size={24} />
              </div>
              <h2 className="heading-md">Create New API Key</h2>
              <p className="text-sm">
                Give your key a memorable name to identify it later.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="apikeys-modal__form">
              <div className="form-group">
                <label htmlFor="keyName" className="form-label">Key Name</label>
                <input
                  type="text"
                  id="keyName"
                  className="form-input form-input--no-icon"
                  placeholder="e.g., Production, Development, My App"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  disabled={isCreating}
                  autoFocus
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn--primary btn--full"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Create API Key
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// New Key Display Modal
function NewKeyModal({ isOpen, onClose, apiKey }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    if (!apiKey?.api_key) return
    const success = await copyToClipboard(apiKey.api_key)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  // Don't render if not open
  if (!isOpen) return null
  
  // Get the key value - handle different possible response structures
  const keyValue = apiKey?.api_key || apiKey?.key || ''
  const keyName = apiKey?.name || 'API Key'
  
  return (
    <motion.div
      className="modal-overlay"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="apikeys-modal apikeys-modal--success"
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="apikeys-modal__header">
          <div className="apikeys-modal__icon apikeys-modal__icon--success">
            <Check size={24} />
          </div>
          <h2 className="heading-md">API Key Created!</h2>
          <p className="text-sm">
            Copy this key now. You won't be able to see it again.
          </p>
        </div>
        
        <div className="apikeys-newkey">
          <div className="apikeys-newkey__label">
            <span className="apikeys-newkey__name">{keyName}</span>
          </div>
          <div className="apikeys-newkey__value">
            <code>{keyValue || 'Key not available'}</code>
            <button 
              className={`apikeys-newkey__copy ${copied ? 'apikeys-newkey__copy--copied' : ''}`}
              onClick={handleCopy}
              disabled={!keyValue}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        
        <div className="apikeys-modal__warning">
          <AlertTriangle size={16} />
          <span>Store this key securely. It won't be shown again.</span>
        </div>
        
        <button className="btn btn--primary btn--full" onClick={onClose}>
          I've Saved My Key
        </button>
      </motion.div>
    </motion.div>
  )
}

// Revoke Confirmation Modal
function RevokeModal({ isOpen, onClose, onConfirm, keyName, isRevoking }) {
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="apikeys-modal apikeys-modal--danger"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="apikeys-modal__close" onClick={onClose}>
              <X size={20} />
            </button>
            
            <div className="apikeys-modal__header">
              <div className="apikeys-modal__icon apikeys-modal__icon--danger">
                <AlertTriangle size={24} />
              </div>
              <h2 className="heading-md">Revoke API Key?</h2>
              <p className="text-sm">
                This will permanently revoke <strong>{keyName}</strong>. 
                Any applications using this key will stop working immediately.
              </p>
            </div>
            
            <div className="apikeys-modal__actions">
              <button className="btn btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn--danger"
                onClick={onConfirm}
                disabled={isRevoking}
              >
                {isRevoking ? (
                  <>
                    <Loader2 size={16} className="spinner" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Revoke Key
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// API Key Card Component
function ApiKeyCard({ apiKey, onRevoke }) {
  const [showPrefix, setShowPrefix] = useState(false)
  
  return (
    <motion.div className="apikey-card" variants={fadeInUp}>
      <div className="apikey-card__header">
        <div className="apikey-card__icon">
          <Key size={18} />
        </div>
        <div className="apikey-card__info">
          <h3 className="apikey-card__name">{apiKey.name}</h3>
          <div className="apikey-card__prefix">
            {showPrefix ? (
              <code>{apiKey.key_prefix}•••••••••••••••</code>
            ) : (
              <code>••••••••••••••••••••••</code>
            )}
            <button 
              className="apikey-card__toggle"
              onClick={() => setShowPrefix(!showPrefix)}
              title={showPrefix ? 'Hide prefix' : 'Show prefix'}
            >
              {showPrefix ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="apikey-card__meta">
        <div className="apikey-card__meta-item">
          <Clock size={14} />
          <span>Created {formatDate(apiKey.created_at)}</span>
        </div>
        <div className="apikey-card__meta-item">
          <RefreshCw size={14} />
          <span>Last used {formatRelativeTime(apiKey.last_used_at)}</span>
        </div>
      </div>
      
      <div className="apikey-card__actions">
        <button 
          className="apikey-card__revoke"
          onClick={() => onRevoke(apiKey)}
        >
          <Trash2 size={14} />
          Revoke
        </button>
      </div>
    </motion.div>
  )
}

// User Header Component
function UserHeader({ user, onLogout }) {
  return (
    <div className="apikeys-user">
      <div className="apikeys-user__info">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="apikeys-user__avatar" />
        ) : (
          <div className="apikeys-user__avatar apikeys-user__avatar--placeholder">
            <User size={20} />
          </div>
        )}
        <div className="apikeys-user__details">
          <span className="apikeys-user__name">{user.name}</span>
          <span className="apikeys-user__email">{user.email}</span>
        </div>
      </div>
      <div className="apikeys-user__tier">
        <span className={`apikeys-tier apikeys-tier--${user.tier}`}>
          {user.tier === 'free' ? 'Free Tier' : user.tier}
        </span>
        <span className="apikeys-user__usage">
          {(user.traces_used || 0).toLocaleString()} / 10,000 traces
        </span>
      </div>
      <button className="apikeys-user__logout" onClick={onLogout}>
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  )
}

// Main API Keys Page
export default function ApiKeys() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [newApiKey, setNewApiKey] = useState(null)
  const [keyToRevoke, setKeyToRevoke] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isRevoking, setIsRevoking] = useState(false)
  
  // Load user and keys on mount
  useEffect(() => {
    loadUserData()
  }, [])
  
  async function loadUserData() {
    setIsLoading(true)
    setError('')
    
    if (!api.isLoggedIn()) {
      setIsLoading(false)
      return
    }
    
    try {
      const userData = await api.getMe()
      setUser(userData)
      
      try {
        const keys = await api.listApiKeys()
        // Ensure keys is always an array
        setApiKeys(Array.isArray(keys) ? keys : [])
      } catch (keysErr) {
        console.error('Failed to load API keys:', keysErr)
        // Don't fail the whole page if just keys fail to load
        setApiKeys([])
      }
    } catch (err) {
      console.error('Failed to load user data:', err)
      if (err.message === 'Not authenticated') {
        setUser(null)
        setApiKeys([])
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  async function handleLogin() {
    setIsLoggingIn(true)
    setError('')
    
    try {
      await signInWithGoogle()
    } catch (err) {
      setError('Failed to initiate sign in. Please try again.')
      setIsLoggingIn(false)
    }
  }
  
  async function handleLogout() {
    await api.logout()
    setUser(null)
    setApiKeys([])
    navigate('/api-keys')
  }
  
  async function handleCreateKey(name) {
    setIsCreating(true)
    setError('')
    
    try {
      const newKey = await api.createApiKey(name)
      console.log('Created API key:', newKey)
      setNewApiKey(newKey)
      setShowCreateModal(false)
      setShowNewKeyModal(true)
      
      // Refresh the keys list
      try {
        const keys = await api.listApiKeys()
        console.log('Fetched API keys:', keys)
        setApiKeys(Array.isArray(keys) ? keys : [])
      } catch (listErr) {
        console.error('Failed to refresh keys list:', listErr)
        // If we can't refresh the list, at least add the new key to local state
        // using the key_prefix since we don't have the full key anymore
        if (newKey && newKey.key_prefix) {
          setApiKeys(prev => [...prev, {
            id: newKey.id || Date.now().toString(),
            key_prefix: newKey.key_prefix,
            name: newKey.name || name,
            created_at: new Date().toISOString(),
            last_used_at: null
          }])
        }
      }
    } catch (err) {
      console.error('Failed to create API key:', err)
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }
  
  async function handleRevokeKey() {
    if (!keyToRevoke) return
    
    setIsRevoking(true)
    setError('')
    
    try {
      await api.revokeApiKey(keyToRevoke.id)
      setApiKeys(apiKeys.filter(k => k.id !== keyToRevoke.id))
      setShowRevokeModal(false)
      setKeyToRevoke(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRevoking(false)
    }
  }
  
  function openRevokeModal(key) {
    setKeyToRevoke(key)
    setShowRevokeModal(true)
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="apikeys">
        <header className="apikeys-header">
          <div className="apikeys-header__left">
            <Link to="/" className="apikeys-header__back">
              <ArrowLeft size={18} />
            </Link>
            <div className="apikeys-header__title">
              <h1>API Keys</h1>
              <span className="apikeys-header__subtitle">Manage your Shepherd API keys</span>
            </div>
          </div>
        </header>
        <main className="apikeys-main">
          <div className="apikeys-loading">
            <Loader2 size={32} className="spinner" />
            <span>Loading...</span>
          </div>
        </main>
      </div>
    )
  }
  
  // Not logged in
  if (!user) {
    return (
      <div className="apikeys">
        <header className="apikeys-header">
          <div className="apikeys-header__left">
            <Link to="/" className="apikeys-header__back">
              <ArrowLeft size={18} />
            </Link>
            <div className="apikeys-header__title">
              <h1>API Keys</h1>
              <span className="apikeys-header__subtitle">Manage your Shepherd API keys</span>
            </div>
          </div>
        </header>
        <main className="apikeys-main">
          <div className="apikeys-container">
            <LoginSection 
              onLogin={handleLogin} 
              isLoading={isLoggingIn}
              error={error}
            />
          </div>
        </main>
      </div>
    )
  }
  
  // Logged in - show keys
  return (
    <div className="apikeys">
      <header className="apikeys-header">
        <div className="apikeys-header__left">
          <Link to="/" className="apikeys-header__back">
            <ArrowLeft size={18} />
          </Link>
          <div className="apikeys-header__title">
            <h1>API Keys</h1>
            <span className="apikeys-header__subtitle">Manage your Shepherd API keys</span>
          </div>
        </div>
        <div className="apikeys-header__right">
          <button 
            className="btn btn--primary btn--sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            New Key
          </button>
        </div>
      </header>
      
      <main className="apikeys-main">
        <div className="apikeys-container">
          <UserHeader user={user} onLogout={handleLogout} />
          
          {error && (
            <div className="apikeys-error">
              <AlertCircle size={16} />
              {error}
              <button onClick={() => setError('')}>
                <X size={14} />
              </button>
            </div>
          )}
          
          <section className="apikeys-section">
            <div className="apikeys-section__header">
              <h2 className="apikeys-section__title">
                <Key size={18} />
                Your API Keys
              </h2>
              <span className="apikeys-section__count">
                {apiKeys.length} key{apiKeys.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {apiKeys.length === 0 ? (
              <motion.div 
                className="apikeys-empty"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="apikeys-empty__icon">
                  <Key size={40} />
                </div>
                <h3>No API Keys Yet</h3>
                <p>Create your first API key to start using Shepherd.</p>
                <button 
                  className="btn btn--primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={16} />
                  Create Your First Key
                </button>
              </motion.div>
            ) : (
              <motion.div 
                className="apikeys-list"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {apiKeys.map(key => (
                  <ApiKeyCard 
                    key={key.id} 
                    apiKey={key} 
                    onRevoke={openRevokeModal}
                  />
                ))}
              </motion.div>
            )}
          </section>
          
          <QuickStartSection userApiKey={apiKeys[0]?.key_prefix ? `${apiKeys[0].key_prefix}•••••••••••` : null} />
        </div>
      </main>
      
      {/* Modals */}
      <CreateKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateKey}
        isCreating={isCreating}
      />
      
      <NewKeyModal
        isOpen={showNewKeyModal}
        onClose={() => {
          setShowNewKeyModal(false)
          setNewApiKey(null)
        }}
        apiKey={newApiKey}
      />
      
      <RevokeModal
        isOpen={showRevokeModal}
        onClose={() => {
          setShowRevokeModal(false)
          setKeyToRevoke(null)
        }}
        onConfirm={handleRevokeKey}
        keyName={keyToRevoke?.name}
        isRevoking={isRevoking}
      />
    </div>
  )
}

