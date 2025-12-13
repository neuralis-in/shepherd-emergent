import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Github, 
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Ghost,
  Shuffle,
  EyeOff,
  Activity,
  Layers,
  AlertCircle,
  Copy,
  Play,
  Search,
  Zap,
  Code,
  Clock,
  GitBranch,
  CheckCircle,
  Terminal,
  Box,
  Cpu,
  Database,
  X,
  Mail,
  User,
  Loader2,
  Check,
  Cloud,
  Server,
  Bot,
  Container,
  HardDrive,
  BarChart3,
  TrendingUp,
  PieChart,
  ChevronDown,
  ChevronRight,
  LogIn,
  Target
} from 'lucide-react'
import './App.css'
import PromptEnhancement from './components/PromptEnhancement'
import api, { signInWithGoogle } from './api'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
}

// Book a Demo Modal Component
function BookDemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'b5090d55-66a0-4e7d-959a-4f90c5eb722d', // Get your key at https://web3forms.com
          to: 'pranavchiku11@gmail.com',
          subject: `🚀 Shepherd Demo Request - ${formData.name}`,
          from_name: 'Shepherd Demo',
          name: formData.name,
          email: formData.email,
          message: `New demo request:\n\nName: ${formData.name}\nEmail: ${formData.email}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setFormData({ name: '', email: '' })
      } else {
        throw new Error(data.message || 'Something went wrong')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message || 'Failed to submit. Please try again.')
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form after animation completes
    setTimeout(() => {
      setStatus('idle')
      setFormData({ name: '', email: '' })
      setErrorMessage('')
    }, 300)
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
            className="modal"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal__close" onClick={handleClose}>
              <X size={20} />
            </button>

            {status === 'success' ? (
              <div className="modal__success">
                <div className="modal__success-icon">
                  <Check size={32} />
                </div>
                <h2 className="heading-md">You're on the list!</h2>
                <p className="text-base">
                  Thanks for your interest in Shepherd. We'll be in touch soon to schedule your demo.
                </p>
                <button className="btn btn--primary" onClick={handleClose}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="modal__header">
                  <div className="modal__icon">
                    <Mail size={24} />
                  </div>
                  <h2 className="heading-md">Book a Demo</h2>
                  <p className="text-base">
                    See how Shepherd can help you trace and debug your AI agents.
                  </p>
                </div>

                <form className="modal__form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Name</label>
                    <div className="form-input-wrapper">
                      <User size={18} className="form-input-icon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="form-input-wrapper">
                      <Mail size={18} className="form-input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="form-error">
                      <AlertCircle size={16} />
                      {errorMessage}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn--primary btn--full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Book Demo
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <p className="modal__footer">
                  We respect your privacy. No spam, ever.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Header Component
function Header({ onOpenModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      if (api.isLoggedIn()) {
        setIsLoggedIn(true)
        const cachedUser = api.getUser()
        if (cachedUser) {
          setUser(cachedUser)
        }
        // Try to refresh user data
        try {
          const userData = await api.getMe()
          setUser(userData)
        } catch (err) {
          // If token is invalid, clear login state
          if (err.message === 'Not authenticated') {
            setIsLoggedIn(false)
            setUser(null)
          }
        }
      }
    }
    checkAuth()
  }, [])

  const handleLogin = async () => {
    setIsLoggingIn(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Login failed:', err)
      setIsLoggingIn(false)
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="header">
      <div className="container header__container">
        <Link to="/" className="header__logo">
          <svg viewBox="0 0 32 32" className="header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="header__nav header__nav--desktop">
          <div className="header__nav-links">
            <a href="#features" className="header__link">Features</a>
            <Link to="/pricing" className="header__link">Pricing</Link>
            <Link to="/integrations" className="header__link">Integrations</Link>
            <Link to="/blog" className="header__link">Blog</Link>
            <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="header__link">
              Docs <ExternalLink size={12} />
            </a>
          </div>
          <div className="header__nav-divider"></div>
          <div className="header__nav-actions">
            <Link to="/playground" className="header__link header__link--highlight">
              Playground
            </Link>
            {isLoggedIn ? (
              <Link to="/api-keys" className="header__profile">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="header__avatar" />
                ) : (
                  <div className="header__avatar header__avatar--placeholder">
                    <User size={14} />
                  </div>
                )}
                <span>Profile</span>
              </Link>
            ) : (
              <button 
                className="header__login-btn"
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Loader2 size={16} className="spinner" />
                ) : (
                  <LogIn size={16} />
                )}
                <span>{isLoggingIn ? 'Connecting...' : 'Login'}</span>
              </button>
            )}
          </div>
          <button className="btn btn--primary btn--sm" onClick={onOpenModal}>Book a Demo</button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="header__mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav 
              className="header__nav--mobile"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <a href="#features" className="header__mobile-link" onClick={closeMobileMenu}>Features</a>
              <Link to="/pricing" className="header__mobile-link" onClick={closeMobileMenu}>Pricing</Link>
              <Link to="/integrations" className="header__mobile-link" onClick={closeMobileMenu}>Integrations</Link>
              <Link to="/blog" className="header__mobile-link" onClick={closeMobileMenu}>Blog</Link>
              <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="header__mobile-link">
                Docs <ExternalLink size={14} />
              </a>
              <div className="header__mobile-actions">
                <Link to="/playground" className="btn btn--highlight btn--sm btn--full" onClick={closeMobileMenu}>
                  Playground
                </Link>
                {isLoggedIn ? (
                  <Link to="/api-keys" className="btn btn--secondary btn--sm btn--full header__mobile-profile" onClick={closeMobileMenu}>
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="header__avatar header__avatar--sm" />
                    ) : (
                      <User size={16} />
                    )}
                    Profile
                  </Link>
                ) : (
                  <button 
                    className="btn btn--secondary btn--sm btn--full"
                    onClick={() => { closeMobileMenu(); handleLogin(); }}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? <Loader2 size={16} className="spinner" /> : <LogIn size={16} />}
                    {isLoggingIn ? 'Connecting...' : 'Login'}
                  </button>
                )}
                <button className="btn btn--primary btn--sm btn--full" onClick={() => { closeMobileMenu(); onOpenModal(); }}>
                  Book a Demo
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

// Hero Section
function Hero({ onOpenModal }) {
  return (
    <section className="hero">
      <div className="hero__bg">
        <FlowDiagram />
      </div>
      <div className="container hero__container">
        <motion.div 
          className="hero__content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="hero__badge" variants={fadeInUp}>
            <span className="hero__badge-dot"></span>
            Built on aiobs — open-source Python SDK
          </motion.div>
          <motion.div className="hero__title-wrapper" variants={fadeInUp}>
            <a href="#shell" className="hero__cli-ribbon hero__cli-ribbon--live">
              <Terminal size={10} />
              <span>shepherd-cli v0.0.1</span>
              <span className="hero__ribbon-badge">NEW</span>
            </a>
            <span className="hero__coming-soon-ribbon">
              <span className="hero__ribbon-dot"></span>
              prompt-enhancer coming soon
            </span>
            <h1 className="heading-xl hero__title">
              Shepherd traces AI agents<br />so they don't fail.
            </h1>
          </motion.div>
          <motion.p className="text-lg hero__subtitle" variants={fadeInUp}>
            Trace every LLM call, tool invocation, and decision — turning opaque agent pipelines 
            into debuggable timelines. CLI-first, so AI coding agents can use it too.
          </motion.p>
          <motion.div className="hero__actions" variants={fadeInUp}>
            <div className="hero__action-group">
              <button className="btn btn--primary" onClick={onOpenModal}>
                Book a Demo <ArrowRight size={16} />
              </button>
              <span className="hero__action-note">For teams & companies</span>
            </div>
            <div className="hero__action-group">
              <Link to="/api-keys" className="btn btn--secondary">
                Start for Free <ArrowRight size={16} />
              </Link>
              <span className="hero__action-note">For individual developers</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Animated Flow Diagram for Hero
function FlowDiagram() {
  return (
    <svg className="flow-diagram" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E5E5E5" stopOpacity="0" />
          <stop offset="50%" stopColor="#111" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E5E5E5" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Horizontal lines */}
      {[80, 140, 200, 260, 320].map((y, i) => (
        <line key={`h-${i}`} x1="0" y1={y} x2="1200" y2={y} stroke="url(#lineGrad)" strokeWidth="1" />
      ))}
      
      {/* Vertical lines */}
      {[200, 400, 600, 800, 1000].map((x, i) => (
        <line key={`v-${i}`} x1={x} y1="0" x2={x} y2="400" stroke="url(#lineGrad)" strokeWidth="1" />
      ))}
      
      {/* Flow path */}
      <motion.path
        d="M 100 200 Q 300 200 400 140 Q 500 80 600 140 Q 700 200 800 200 Q 900 200 1000 260 Q 1100 320 1100 260"
        fill="none"
        stroke="#111"
        strokeWidth="2"
        strokeDasharray="8 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.2 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Nodes */}
      {[
        { x: 200, y: 200, delay: 0.5 },
        { x: 400, y: 140, delay: 0.8 },
        { x: 600, y: 140, delay: 1.1 },
        { x: 800, y: 200, delay: 1.4 },
        { x: 1000, y: 260, delay: 1.7 },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="6"
            fill="#111"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: node.delay, duration: 0.3 }}
          />
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="12"
            fill="none"
            stroke="#111"
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ delay: node.delay + 0.1, duration: 0.4 }}
          />
        </motion.g>
      ))}
    </svg>
  )
}

// Problem Section
function Problem() {
  const problems = [
    { icon: <Shuffle size={20} />, text: "Pick wrong tools" },
    { icon: <RotateCcw size={20} />, text: "Loop indefinitely" },
    { icon: <Ghost size={20} />, text: "Hallucinate" },
    { icon: <Shuffle size={20} />, text: "Behave non-deterministically" },
    { icon: <EyeOff size={20} />, text: "Fail with zero visibility" },
  ]

  return (
    <section className="section problem">
      <div className="container">
        <motion.div 
          className="problem__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-lg problem__title" variants={fadeInUp}>
            AI agents fail silently.
          </motion.h2>
          <motion.div className="problem__grid" variants={fadeInUp}>
            <div className="problem__list">
              {problems.map((problem, i) => (
                <motion.div 
                  key={i} 
                  className="problem__item"
                  variants={fadeInUp}
                >
                  <span className="problem__icon">{problem.icon}</span>
                  <span>{problem.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="problem__visual">
              <BrokenPipeline />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Broken Pipeline Visual
function BrokenPipeline() {
  return (
    <div className="broken-pipeline">
      <svg viewBox="0 0 400 200" className="broken-pipeline__svg">
        <defs>
          <marker id="arrowGray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#CCC" />
          </marker>
          <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#EF4444" />
          </marker>
        </defs>
        
        {/* Pipeline boxes */}
        <rect x="20" y="80" width="70" height="40" rx="4" fill="#F5F5F5" stroke="#E5E5E5" />
        <text x="55" y="105" textAnchor="middle" fontSize="10" fill="#666">LLM</text>
        
        <rect x="120" y="80" width="70" height="40" rx="4" fill="#F5F5F5" stroke="#E5E5E5" />
        <text x="155" y="105" textAnchor="middle" fontSize="10" fill="#666">Tool</text>
        
        <rect x="220" y="80" width="70" height="40" rx="4" fill="#FEF2F2" stroke="#EF4444" strokeDasharray="4 2" />
        <text x="255" y="100" textAnchor="middle" fontSize="10" fill="#EF4444">???</text>
        <text x="255" y="112" textAnchor="middle" fontSize="8" fill="#EF4444">FAILURE</text>
        
        <rect x="320" y="80" width="60" height="40" rx="4" fill="#F5F5F5" stroke="#E5E5E5" strokeOpacity="0.5" />
        <text x="350" y="105" textAnchor="middle" fontSize="10" fill="#CCC">Output</text>
        
        {/* Arrows */}
        <line x1="90" y1="100" x2="118" y2="100" stroke="#CCC" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
        <line x1="190" y1="100" x2="218" y2="100" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#arrowRed)" />
        <line x1="290" y1="100" x2="318" y2="100" stroke="#E5E5E5" strokeWidth="1.5" strokeDasharray="4 2" />
        
        {/* Error indicator */}
        <circle cx="255" cy="60" r="12" fill="#EF4444" />
        <text x="255" y="64" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">!</text>
      </svg>
    </div>
  )
}

// Demo Details Panel Component (Right side)
function DemoDetailsPanel({ node }) {
  if (!node || !node.details) {
    return (
      <div className="demo-details-panel demo-details-panel--empty">
        <div className="demo-details-panel__placeholder">
          <Cpu size={32} />
          <p>Select an LLM call to view details</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="demo-details-panel"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      key={node.details.input}
    >
      <div className="demo-details-panel__header">
        <div className="demo-details-panel__title">
          <Cpu size={14} />
          <span>{node.name}</span>
        </div>
        <span className="demo-details-panel__model">{node.details.model}</span>
      </div>

      <div className="demo-details-panel__body">
        {/* Input/Prompt */}
        <div className="demo-details-panel__section">
          <h4><Terminal size={12} /> Input</h4>
          <p className="demo-details-panel__text">{node.details.input}</p>
        </div>

        {/* Model Config */}
        <div className="demo-details-panel__section">
          <h4><Code size={12} /> Configuration</h4>
          <div className="demo-details-panel__config">
            <div className="demo-details-panel__config-item">
              <span>temperature</span>
              <code>{node.details.config.temperature}</code>
            </div>
            <div className="demo-details-panel__config-item">
              <span>max_tokens</span>
              <code>{node.details.config.max_tokens}</code>
            </div>
            <div className="demo-details-panel__config-item">
              <span>top_p</span>
              <code>{node.details.config.top_p}</code>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="demo-details-panel__section">
          <h4><CheckCircle size={12} /> Output</h4>
          <p className="demo-details-panel__text demo-details-panel__text--output">{node.details.output}</p>
        </div>

        {/* Usage Stats */}
        <div className="demo-details-panel__section">
          <h4><BarChart3 size={12} /> Usage</h4>
          <div className="demo-details-panel__stats">
            <div className="demo-details-panel__stat">
              <span className="demo-details-panel__stat-value">{node.details.tokens.input}</span>
              <span className="demo-details-panel__stat-label">Input</span>
            </div>
            <div className="demo-details-panel__stat">
              <span className="demo-details-panel__stat-value">{node.details.tokens.output}</span>
              <span className="demo-details-panel__stat-label">Output</span>
            </div>
            <div className="demo-details-panel__stat">
              <span className="demo-details-panel__stat-value">{node.details.tokens.total}</span>
              <span className="demo-details-panel__stat-label">Total</span>
            </div>
            <div className="demo-details-panel__stat demo-details-panel__stat--highlight">
              <span className="demo-details-panel__stat-value">{node.duration}</span>
              <span className="demo-details-panel__stat-label">Duration</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Demo Trace Tree Node Component for Landing Page
function DemoTreeNode({ node, depth = 0, index = 0, selectedNode, onSelectNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedNode === node
  const isLLM = node.type === 'llm'

  const getNodeIcon = () => {
    if (node.type === 'function') {
      return <Terminal size={14} />
    }
    return <Cpu size={14} />
  }

  const handleClick = () => {
    if (isLLM && node.details) {
      onSelectNode(isSelected ? null : node)
    }
  }

  return (
    <motion.div
      className="demo-tree-node"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <div
        className={`demo-tree-node__content demo-tree-node__content--${node.status}${isSelected ? ' demo-tree-node__content--selected' : ''}${isLLM && node.details ? ' demo-tree-node__content--clickable' : ''}`}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            className="demo-tree-node__toggle"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="demo-tree-node__toggle demo-tree-node__toggle--empty" />
        )}

        <div className={`demo-tree-node__icon demo-tree-node__icon--${node.type}`}>
          {getNodeIcon()}
        </div>

        <div className="demo-tree-node__info">
          <span className="demo-tree-node__label">{node.name}</span>
          {node.model && (
            <span className="demo-tree-node__sublabel">{node.model}</span>
          )}
        </div>

        <div className="demo-tree-node__meta">
          {node.duration && (
            <span className="demo-tree-node__duration">
              <Clock size={12} />
              {node.duration}
            </span>
          )}
          <span className={`demo-tree-node__status demo-tree-node__status--${node.status}`}>
            {node.status === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            className="demo-tree-node__children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {node.children.map((child, i) => (
              <DemoTreeNode 
                key={i} 
                node={child} 
                depth={depth + 1} 
                index={i}
                selectedNode={selectedNode}
                onSelectNode={onSelectNode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Demo Trace Tree Component
function DemoTraceTree() {
  // Set initial selected node to the first LLM call
  const firstLLMCall = {
    name: 'chat.completions',
    type: 'llm',
    model: 'gpt-4o',
    duration: '1.8s',
    status: 'success',
    details: {
      input: 'Plan a 3-day trip to Tokyo for a family of 4. Include flights, hotels, and activities. Budget: $5000.',
      model: 'gpt-4o',
      config: {
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.95
      },
      output: 'I\'ll help you plan a wonderful 3-day Tokyo trip! Let me search for the best flights and hotels within your budget...',
      tokens: {
        input: 142,
        output: 856,
        total: 998
      }
    },
    children: []
  }

  const [selectedNode, setSelectedNode] = useState(firstLLMCall)

  const demoData = [
    {
      name: 'travel_agent.plan_trip',
      type: 'function',
      duration: '4.2s',
      status: 'success',
      children: [
        firstLLMCall,
        {
          name: 'search_flights',
          type: 'function',
          duration: '890ms',
          status: 'success',
          children: [
            {
              name: 'chat.completions',
              type: 'llm',
              model: 'gpt-4o-mini',
              duration: '420ms',
              status: 'success',
              details: {
                input: 'Extract flight search parameters: destination Tokyo, 4 passengers, budget constraint $2000 for flights.',
                model: 'gpt-4o-mini',
                config: {
                  temperature: 0.3,
                  max_tokens: 512,
                  top_p: 0.9
                },
                output: '{"destination": "NRT", "passengers": 4, "max_price": 2000, "class": "economy"}',
                tokens: {
                  input: 89,
                  output: 124,
                  total: 213
                }
              },
              children: []
            }
          ]
        },
        {
          name: 'book_hotel',
          type: 'function',
          duration: '1.2s',
          status: 'success',
          children: [
            {
              name: 'chat.completions',
              type: 'llm',
              model: 'gpt-4o-mini',
              duration: '380ms',
              status: 'success',
              details: {
                input: 'Find family-friendly hotels in Shinjuku, Tokyo. 2 rooms, 3 nights. Budget: $1500.',
                model: 'gpt-4o-mini',
                config: {
                  temperature: 0.4,
                  max_tokens: 1024,
                  top_p: 0.9
                },
                output: 'Found 3 options: 1) Keio Plaza Hotel - $420/night, 2) Hilton Tokyo - $380/night, 3) Hotel Sunroute - $280/night',
                tokens: {
                  input: 76,
                  output: 245,
                  total: 321
                }
              },
              children: []
            },
            {
              name: 'validate_booking',
              type: 'function',
              duration: '45ms',
              status: 'success',
              children: []
            }
          ]
        },
        {
          name: 'chat.completions',
          type: 'llm',
          model: 'gpt-4o',
          duration: '920ms',
          status: 'success',
          details: {
            input: 'Generate final itinerary summary with all bookings: flights, hotel, and suggested activities for 3 days in Tokyo.',
            model: 'gpt-4o',
            config: {
              temperature: 0.8,
              max_tokens: 2048,
              top_p: 0.95
            },
            output: '🗼 Your Tokyo Adventure Awaits!\n\nDay 1: Arrive at Narita, check into Keio Plaza Hotel, explore Shinjuku...\nDay 2: Visit Senso-ji Temple, teamLab Borderless, Shibuya Crossing...\nDay 3: Tsukiji Market, Imperial Palace, departure...',
            tokens: {
              input: 234,
              output: 1247,
              total: 1481
            }
          },
          children: []
        }
      ]
    }
  ]

  return (
    <div className="demo-trace-tree">
      <div className="demo-trace-tree__header">
        <div className="demo-trace-tree__dots">
          <span></span><span></span><span></span>
        </div>
        <span className="demo-trace-tree__title">
          <Layers size={14} />
          Trace Tree
        </span>
        <span className="demo-trace-tree__badge">Live Demo</span>
      </div>
      <div className="demo-trace-tree__split">
        <div className="demo-trace-tree__left">
          <div className="demo-trace-tree__body">
            {demoData.map((trace, i) => (
              <DemoTreeNode 
                key={i} 
                node={trace} 
                index={i}
                selectedNode={selectedNode}
                onSelectNode={setSelectedNode}
              />
            ))}
          </div>
        </div>
        <div className="demo-trace-tree__right">
          <DemoDetailsPanel node={selectedNode} />
        </div>
      </div>
      <div className="demo-trace-tree__footer">
        <Link to="/playground" className="demo-trace-tree__link">
          Try with your own traces <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

// Paradigm Shift Section - Why CLI over Dashboards
function ParadigmShift() {
  const oldWay = [
    { icon: <PieChart size={18} />, text: "Proprietary dashboards" },
    { icon: <User size={18} />, text: "Human-in-the-loop analysis" },
    { icon: <Activity size={18} />, text: "Click-heavy workflows" },
    { icon: <Clock size={18} />, text: "Context-switch to browser" },
  ]

  const newWay = [
    { icon: <Terminal size={18} />, text: "CLI-first observability" },
    { icon: <Bot size={18} />, text: "Agent-friendly interfaces" },
    { icon: <Code size={18} />, text: "JSON output for automation" },
    { icon: <Zap size={18} />, text: "Stay in your coding flow" },
  ]

  return (
    <section className="section paradigm-shift">
      <div className="container">
        <motion.div
          className="paradigm-shift__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-lg paradigm-shift__title" variants={fadeInUp}>
            The world has moved to agentic coding.
            <br />
            <span className="paradigm-shift__highlight">Observability hasn't caught up.</span>
          </motion.h2>
          
          <motion.div className="paradigm-shift__comparison" variants={fadeInUp}>
            <div className="paradigm-shift__column paradigm-shift__column--old">
              <h3 className="paradigm-shift__column-title">
                <X size={18} />
                Traditional Observability
              </h3>
              <ul className="paradigm-shift__list">
                {oldWay.map((item, i) => (
                  <li key={i} className="paradigm-shift__item paradigm-shift__item--old">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="paradigm-shift__divider">
              <ArrowRight size={24} />
            </div>
            
            <div className="paradigm-shift__column paradigm-shift__column--new">
              <h3 className="paradigm-shift__column-title">
                <CheckCircle size={18} />
                Shepherd CLI
              </h3>
              <ul className="paradigm-shift__list">
                {newWay.map((item, i) => (
                  <li key={i} className="paradigm-shift__item paradigm-shift__item--new">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.p className="text-lg paradigm-shift__subtitle" variants={fadeInUp}>
            When an AI-powered IDE debugs your agent, it can't click through dashboards. It needs a CLI 
            that speaks JSON — to pull traces, filter failures, and diff sessions. <strong>That's Shepherd CLI.</strong>
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Solution Section
function Solution() {
  const traces = [
    "every LLM call",
    "every tool invocation",
    "every function call",
    "inputs/outputs",
    "timings & latency",
    "branching logic",
    "errors & silent failures"
  ]

  return (
    <section className="section section--subtle solution">
      <div className="container">
        <motion.div 
          className="solution__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-lg solution__title" variants={fadeInUp}>
            Full observability for agentic pipelines.
          </motion.h2>
          <motion.p className="text-lg solution__subtitle" variants={fadeInUp}>
            Shepherd instruments your agent with simple observer calls. It produces a deterministic 
            execution trace of:
          </motion.p>
          <motion.div className="solution__traces" variants={fadeInUp}>
            {traces.map((trace, i) => (
              <span key={i} className="solution__trace">
                <CheckCircle size={14} /> {trace}
              </span>
            ))}
          </motion.div>
          <motion.div className="solution__demo" variants={scaleIn}>
            <DemoTraceTree />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Timeline Mockup
function TimelineMockup() {
  const events = [
    { type: 'llm', time: '0ms', label: 'chat.completions', duration: '142ms', status: 'success' },
    { type: 'tool', time: '145ms', label: 'search_web()', duration: '89ms', status: 'success' },
    { type: 'llm', time: '238ms', label: 'chat.completions', duration: '156ms', status: 'success' },
    { type: 'tool', time: '398ms', label: 'get_weather()', duration: '45ms', status: 'success' },
    { type: 'func', time: '447ms', label: 'format_response()', duration: '12ms', status: 'success' },
  ]

  return (
    <div className="timeline-mockup">
      <div className="timeline-mockup__header">
        <div className="timeline-mockup__dots">
          <span></span><span></span><span></span>
        </div>
        <span className="timeline-mockup__title">agent_run_2847291</span>
        <div className="timeline-mockup__actions">
          <button className="timeline-mockup__btn"><Search size={12} /></button>
          <button className="timeline-mockup__btn"><Copy size={12} /></button>
        </div>
      </div>
      <div className="timeline-mockup__body">
        <div className="timeline-mockup__sidebar">
          <div className="timeline-mockup__stat">
            <span className="timeline-mockup__stat-label">Total Duration</span>
            <span className="timeline-mockup__stat-value">459ms</span>
          </div>
          <div className="timeline-mockup__stat">
            <span className="timeline-mockup__stat-label">Events</span>
            <span className="timeline-mockup__stat-value">5</span>
          </div>
          <div className="timeline-mockup__stat">
            <span className="timeline-mockup__stat-label">Status</span>
            <span className="timeline-mockup__stat-value timeline-mockup__stat-value--success">Success</span>
          </div>
        </div>
        <div className="timeline-mockup__timeline">
          {events.map((event, i) => (
            <motion.div 
              key={i} 
              className={`timeline-event timeline-event--${event.type}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="timeline-event__marker">
                {event.type === 'llm' && <Cpu size={12} />}
                {event.type === 'tool' && <Box size={12} />}
                {event.type === 'func' && <Code size={12} />}
              </div>
              <div className="timeline-event__content">
                <div className="timeline-event__header">
                  <span className="timeline-event__label">{event.label}</span>
                  <span className="timeline-event__duration">{event.duration}</span>
                </div>
                <div className="timeline-event__meta">
                  <span className="timeline-event__time">{event.time}</span>
                  <span className={`timeline-event__status timeline-event__status--${event.status}`}>
                    {event.status}
                  </span>
                </div>
              </div>
              {i < events.length - 1 && <div className="timeline-event__line"></div>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// aiobs Section
function AiobsSection() {
  return (
    <section className="section aiobs" id="aiobs">
      <div className="container">
        <motion.div 
          className="aiobs__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="aiobs__header" variants={fadeInUp}>
            <div className="aiobs__badges">
              <div className="aiobs__badge">
                <Github size={14} />
                Open Source
              </div>
              <div className="aiobs__badge aiobs__badge--gsoc">
                🎓 Applying for GSoC 2026
              </div>
            </div>
            <h2 className="heading-lg">
              Built on aiobs — an open-source Python observability SDK.
            </h2>
            <p className="text-lg">
              Shepherd's tracing is powered by aiobs, an extensible observability layer for LLM providers.
              It records JSON traces for requests, responses, timings, and errors with just three lines.
            </p>
          </motion.div>
          
          <motion.div className="aiobs__code-grid" variants={fadeInUp}>
            <div className="code-block">
              <div className="code-block__header">
                <span className="code-block__title">Install</span>
              </div>
              <div className="code-block__content">
                <pre><code><span className="function">pip</span> install aiobs[openai]</code></pre>
              </div>
            </div>
            
            <div className="code-block">
              <div className="code-block__header">
                <span className="code-block__title">Use</span>
              </div>
              <div className="code-block__content">
                <pre><code><span className="keyword">from</span> aiobs <span className="keyword">import</span> observer{'\n\n'}observer.<span className="function">observe</span>(){'\n'}<span className="comment"># your LLM calls here</span>{'\n'}observer.<span className="function">end</span>(){'\n'}observer.<span className="function">flush</span>()</code></pre>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="aiobs__providers" variants={fadeInUp}>
            <span className="aiobs__providers-label">Supported Providers:</span>
            <div className="aiobs__providers-list">
              <span className="aiobs__provider">OpenAI</span>
              <span className="aiobs__provider">Google Gemini</span>
              <span className="aiobs__provider aiobs__provider--custom">+ Custom via BaseProvider</span>
            </div>
          </motion.div>
          
          <motion.a 
            href="https://github.com/neuralis-in/aiobs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="aiobs__github"
            variants={fadeInUp}
          >
            <Github size={18} />
            <span>neuralis-in/aiobs</span>
            <ArrowRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorks() {
  const basePath = import.meta.env.BASE_URL
  const steps = [
    {
      icon: <Terminal size={24} />,
      title: "Wrap your agent",
      description: "Add observer.observe() before and observer.end() after your agent code."
    },
    {
      icon: <Activity size={24} />,
      title: "Trace every step",
      description: "Shepherd captures LLM events, tool calls, decisions, arguments, and errors."
    },
    {
      icon: <Search size={24} />,
      title: "Debug instantly",
      description: "Identify exactly where loops, failures, or wrong tool calls happened."
    },
    {
      icon: <Cloud size={24} />,
      title: "Stream to cloud",
      description: "Push traces to GCP, AWS, Azure, or on-prem for continuous monitoring."
    }
  ]

  const providers = [
    { name: 'GCP', icon: `${basePath}gcp.png`, type: 'image' },
    { name: 'AWS', icon: `${basePath}aws.png`, type: 'image' },
    { name: 'Azure', icon: `${basePath}azure.svg`, type: 'image' },
    { name: 'On-Prem', icon: <Server size={20} />, type: 'icon' },
  ]

  return (
    <section className="section section--subtle how-it-works" id="features">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-lg how-it-works__title" variants={fadeInUp}>
            How Shepherd Works
          </motion.h2>
          
          <motion.div className="how-it-works__grid how-it-works__grid--four" variants={fadeInUp}>
            {steps.map((step, i) => (
              <motion.div key={i} className="how-it-works__step" variants={fadeInUp}>
                <div className="how-it-works__step-number">{i + 1}</div>
                <div className="how-it-works__step-icon">{step.icon}</div>
                <h3 className="heading-sm">{step.title}</h3>
                <p className="text-base">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div className="how-it-works__flow" variants={scaleIn}>
            <WorkflowDiagram />
          </motion.div>

          <motion.div className="how-it-works__cloud" variants={fadeInUp}>
            <div className="how-it-works__cloud-providers">
              {providers.map((provider, i) => (
                <div key={i} className="how-it-works__cloud-provider">
                  {provider.type === 'image' ? (
                    <img src={provider.icon} alt={provider.name} className="how-it-works__cloud-provider-img" />
                  ) : (
                    <div className="how-it-works__cloud-provider-icon">{provider.icon}</div>
                  )}
                  <span>{provider.name}</span>
                </div>
              ))}
            </div>
            <Link to="/integrations" className="how-it-works__cloud-link">
              Learn more about integrations <ArrowRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Architecture Diagram
function WorkflowDiagram() {
  const basePath = import.meta.env.BASE_URL
  
  const agents = [
    { id: 1, label: 'Agent 1', platform: 'GKE', x: 60, y: 45 },
    { id: 2, label: 'Agent 2', platform: 'EC2', x: 130, y: 120 },
    { id: 3, label: 'Agent 3', platform: 'Cloud Run', x: 55, y: 200 },
    { id: 4, label: 'Agent 4', platform: 'Lambda', x: 140, y: 280 },
  ]

  return (
    <div className="architecture-diagram">
      {/* Section: Agents on Cloud Platforms */}
      <div className="arch-section arch-agents">
        <div className="arch-section-label">Your AI Agents</div>
        <div className="arch-agents-cloud">
          {agents.map((agent, i) => (
            <motion.div 
              key={agent.id}
              className="arch-agent-node"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, type: "spring" }}
              style={{ '--delay': `${i * 0.5}s` }}
            >
              <div className="arch-agent-circle">
                <Bot size={20} />
              </div>
              <span className="arch-agent-platform">{agent.platform}</span>
            </motion.div>
          ))}
        </div>
        <div className="arch-platforms-list">
          <span>GKE</span>
          <span>EC2</span>
          <span>Cloud Run</span>
          <span>Lambda</span>
        </div>
      </div>

      {/* Animated Flow Lines */}
      <div className="arch-flow arch-flow-1">
        <div className="arch-flow-line">
          <div className="arch-flow-particle"></div>
        </div>
        <span className="arch-flow-label">observe()</span>
      </div>

      {/* Section: Shepherd Layer */}
      <motion.div 
        className="arch-section arch-shepherd"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="arch-shepherd-badge">
          <img src={`${basePath}shepherd.svg`} alt="Shepherd" className="arch-shepherd-logo" />
          <span>Shepherd</span>
        </div>
        <div className="arch-shepherd-features">
          <div className="arch-shepherd-feature">
            <Activity size={14} />
            <span>Trace Capture</span>
          </div>
          <div className="arch-shepherd-feature">
            <Layers size={14} />
            <span>LLM Events</span>
          </div>
          <div className="arch-shepherd-feature">
            <AlertCircle size={14} />
            <span>Error Detection</span>
          </div>
        </div>
      </motion.div>

      {/* Animated Flow Lines */}
      <div className="arch-flow arch-flow-2">
        <div className="arch-flow-line">
          <div className="arch-flow-particle"></div>
        </div>
        <span className="arch-flow-label">flush()</span>
      </div>

      {/* Section: Cloud Storage */}
      <motion.div 
        className="arch-section arch-storage"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="arch-section-label">Your Cloud</div>
        <div className="arch-storage-icons">
          <div className="arch-storage-item">
            <div className="arch-storage-icon">
              <HardDrive size={18} />
            </div>
            <span>S3 / GCS</span>
          </div>
          <div className="arch-storage-item">
            <div className="arch-storage-icon">
              <Database size={18} />
            </div>
            <span>BigQuery</span>
          </div>
          <div className="arch-storage-item">
            <div className="arch-storage-icon">
              <Container size={18} />
            </div>
            <span>Postgres</span>
          </div>
        </div>
        <div className="arch-storage-badge">JSON Traces</div>
      </motion.div>

      {/* Animated Flow Lines */}
      <div className="arch-flow arch-flow-3">
        <div className="arch-flow-line">
          <div className="arch-flow-particle"></div>
        </div>
        <span className="arch-flow-label">query</span>
      </div>

      {/* Section: Dashboard */}
      <motion.div 
        className="arch-section arch-dashboard"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="arch-section-label">Insights</div>
        <div className="arch-dashboard-preview">
          <div className="arch-dashboard-header">
            <div className="arch-dashboard-dots">
              <span></span><span></span><span></span>
            </div>
            <span className="arch-dashboard-title">Dashboard</span>
          </div>
          <div className="arch-dashboard-content">
            <div className="arch-dashboard-chart arch-chart-bar">
              <BarChart3 size={16} />
              <div className="arch-mini-bars">
                <div className="arch-bar" style={{ height: '60%' }}></div>
                <div className="arch-bar" style={{ height: '80%' }}></div>
                <div className="arch-bar" style={{ height: '45%' }}></div>
                <div className="arch-bar" style={{ height: '90%' }}></div>
                <div className="arch-bar" style={{ height: '70%' }}></div>
              </div>
            </div>
            <div className="arch-dashboard-chart arch-chart-line">
              <TrendingUp size={16} />
              <svg viewBox="0 0 60 30" className="arch-line-svg">
                <path d="M0,25 Q15,20 25,15 T45,10 T60,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="arch-dashboard-stats">
              <div className="arch-stat">
                <span className="arch-stat-value">2.4k</span>
                <span className="arch-stat-label">Traces</span>
              </div>
              <div className="arch-stat">
                <span className="arch-stat-value">12ms</span>
                <span className="arch-stat-label">Avg Latency</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Syntax highlighting component - renders text with proper highlighting
function HighlightedCode({ text }) {
  if (!text) return null
  
  // Parse and render with syntax highlighting
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
    const methodMatch = remaining.match(/^\.(observe|end|flush|run)\(/)
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
    
    // Regular character
    parts.push(<span key={key++}>{remaining[0]}</span>)
    remaining = remaining.slice(1)
  }
  
  return <>{parts}</>
}

// Developer Section - Typing Animation Component
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
    }, 40)

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

        // Context line (existing code)
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

function Developer() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const codeLines = [
    { type: 'added', text: 'from aiobs import observer' },
    { type: 'empty', text: '' },
    { type: 'added', text: 'observer.observe(api_key="aiobs_sk_369•••••••••••")' },
    { type: 'empty', text: '' },
    { type: 'context', text: 'result = agent.run("Plan a 3-day trip to Tokyo")' },
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
    <section className="section developer" ref={sectionRef}>
      <div className="container container--narrow">
        <motion.div 
          className="developer__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-lg developer__title" variants={fadeInUp}>
            Built for engineers shipping agents at scale.
          </motion.h2>
          
          <motion.div className="developer__code-wrapper" variants={scaleIn}>
            <div className="developer__code-header">
              <span className="developer__code-title">Quick Start</span>
              <span className="developer__code-badge">
                <span className="developer__code-badge-dot"></span>
                patching...
              </span>
            </div>
            <div className="code-diff">
              <div className="code-diff__header">
                <span className="code-diff__title">agent.py</span>
              </div>
              <TypingCode lines={codeLines} isVisible={isVisible} />
            </div>
          </motion.div>
          
          <motion.p className="text-lg developer__subtitle" variants={fadeInUp}>
            No rewrites. No boilerplate. Get a timeline for every agent run.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Shepherd CLI Section - CLI-First Observability for Agentic Coding Tools
function ShepherdShell() {
  const [activeCommand, setActiveCommand] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [displayedOutput, setDisplayedOutput] = useState([])
  
  const commands = [
    {
      cmd: 'shepherd sessions list -n 5',
      output: [
        { type: 'header', text: '╭──────────────────────────────────────────────────────────────────╮' },
        { type: 'header', text: '│  📋 Recent Sessions                                              │' },
        { type: 'header', text: '╰──────────────────────────────────────────────────────────────────╯' },
        { type: 'info', text: '' },
        { type: 'label', text: '  sess_7x8k2m', value: 'travel_agent    ✓ 2.4s   gpt-4o' },
        { type: 'label', text: '  sess_9p3q1n', value: 'code_reviewer   ✓ 1.8s   claude-3' },
        { type: 'error', text: '  sess_4h5j6k', value: 'order_bot       ✗ 4.1s   gpt-4o' },
        { type: 'label', text: '  sess_2w3e4r', value: 'data_analyst    ✓ 3.2s   gpt-4o-mini' },
        { type: 'label', text: '  sess_1a2b3c', value: 'support_agent   ✓ 1.5s   gemini-pro' },
      ]
    },
    {
      cmd: 'shepherd sessions search --has-errors --after 2025-12-01',
      output: [
        { type: 'header', text: '╭──────────────────────────────────────────────────────────────────╮' },
        { type: 'header', text: '│  🔍 Sessions with Errors (since Dec 1)                           │' },
        { type: 'header', text: '╰──────────────────────────────────────────────────────────────────╯' },
        { type: 'info', text: '' },
        { type: 'error', text: '  sess_4h5j6k', value: 'order_bot - Tool timeout at step 4' },
        { type: 'error', text: '  sess_8m9n0p', value: 'invoice_gen - Rate limit exceeded' },
        { type: 'error', text: '  sess_5t6y7u', value: 'email_agent - Invalid JSON response' },
        { type: 'info', text: '' },
        { type: 'label', text: '  Found:', value: '3 sessions with errors' },
      ]
    },
    {
      cmd: 'shepherd sessions get sess_4h5j6k',
      output: [
        { type: 'header', text: '╭──────────────────────────────────────────────────────────────────╮' },
        { type: 'header', text: '│  🌳 Trace Tree: sess_4h5j6k                                      │' },
        { type: 'header', text: '╰──────────────────────────────────────────────────────────────────╯' },
        { type: 'info', text: '' },
        { type: 'success', text: '  └─ order_bot.process_order', value: '4.1s' },
        { type: 'success', text: '      ├─ chat.completions (gpt-4o)', value: '890ms ✓' },
        { type: 'success', text: '      ├─ validate_inventory()', value: '120ms ✓' },
        { type: 'error', text: '      └─ set_price()', value: '3.0s ✗ TIMEOUT' },
      ]
    },
    {
      cmd: 'shepherd sessions diff sess_4h5j6k sess_7x8k2m',
      output: [
        { type: 'header', text: '╭──────────────────────────────────────────────────────────────────╮' },
        { type: 'header', text: '│  📊 Session Diff                                                 │' },
        { type: 'header', text: '╰──────────────────────────────────────────────────────────────────╯' },
        { type: 'info', text: '' },
        { type: 'label', text: '  Duration:', value: '4.1s vs 2.4s (+1.7s)' },
        { type: 'label', text: '  LLM Calls:', value: '3 vs 3 (same)' },
        { type: 'error', text: '  Errors:', value: '1 vs 0' },
        { type: 'warning', text: '  Divergence:', value: 'Step 4 - set_price() timeout' },
        { type: 'info', text: '' },
        { type: 'success', text: '  💡 Root cause:', value: 'Missing retry logic' },
      ]
    },
    {
      cmd: 'shepherd shell',
      output: [
        { type: 'header', text: '╭──────────────────────────────────────────────────────────────────╮' },
        { type: 'header', text: '│  🐑 Shepherd Interactive Shell v0.0.1                            │' },
        { type: 'header', text: '╰──────────────────────────────────────────────────────────────────╯' },
        { type: 'info', text: '' },
        { type: 'success', text: '  ✓ Connected to aiobs backend' },
        { type: 'label', text: '  Provider:', value: 'aiobs' },
        { type: 'info', text: '' },
        { type: 'info', text: '  Type "help" for commands, "exit" to quit' },
        { type: 'success', text: '  shepherd >', value: '▋' },
      ]
    }
  ]

  const features = [
    { icon: <Search size={18} />, title: 'Search & Filter', desc: 'Find sessions by provider, model, errors, labels, date' },
    { icon: <GitBranch size={18} />, title: 'Trace Trees', desc: 'View full execution trees with timing & status' },
    { icon: <Activity size={18} />, title: 'Session Diff', desc: 'Compare two sessions side-by-side to find regressions' },
    { icon: <Bot size={18} />, title: 'Agent-Friendly', desc: 'JSON output for AI-powered IDEs & coding agents' },
  ]

  useEffect(() => {
    const command = commands[activeCommand]
    let outputIndex = 0
    setDisplayedOutput([])
    setIsTyping(true)

    // Type command first, then show output
    const outputTimer = setInterval(() => {
      if (outputIndex < command.output.length) {
        setDisplayedOutput(prev => [...prev, command.output[outputIndex]])
        outputIndex++
      } else {
        setIsTyping(false)
        clearInterval(outputTimer)
      }
    }, 120)

    return () => clearInterval(outputTimer)
  }, [activeCommand])

  // Cycle through commands
  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setActiveCommand(prev => (prev + 1) % commands.length)
    }, 6000)
    return () => clearInterval(cycleTimer)
  }, [])

  return (
    <section className="section section--subtle cli-preview" id="shell">
      <div className="container">
        <motion.div
          className="cli-preview__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="cli-preview__header" variants={fadeInUp}>
            <div className="cli-preview__badges">
              <div className="cli-preview__badge cli-preview__badge--live">
                <CheckCircle size={12} />
                v0.0.1 Live
              </div>
              <div className="cli-preview__badge">
                <Terminal size={14} />
                CLI-First Observability
              </div>
            </div>
            <h2 className="heading-lg">
              🐑 Shepherd CLI
            </h2>
            <p className="text-lg">
              Observability built for agentic coding tools. Give AI-powered IDEs and coding agents 
              access to search sessions, filter by errors, compare traces, and debug — all via CLI.
              <br /><strong>Dashboards are for humans. CLI is for agents.</strong>
            </p>
          </motion.div>

          <motion.div className="cli-preview__demo" variants={scaleIn}>
            <div className="cli-terminal">
              <div className="cli-terminal__header">
                <div className="cli-terminal__dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="cli-terminal__title">Shepherd Shell — Interactive Debugger</span>
                <div className="cli-terminal__tabs">
                  {commands.map((c, i) => (
                    <button
                      key={i}
                      className={`cli-terminal__tab ${activeCommand === i ? 'cli-terminal__tab--active' : ''}`}
                      onClick={() => setActiveCommand(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              <div className="cli-terminal__body">
                <div className="cli-terminal__prompt">
                  <span className="cli-terminal__user">~</span>
                  <span className="cli-terminal__path"></span>
                  <span className="cli-terminal__symbol">$</span>
                  <motion.span 
                    className="cli-terminal__command"
                    key={activeCommand}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {commands[activeCommand].cmd}
                  </motion.span>
                  {isTyping && <span className="cli-terminal__cursor">▋</span>}
                </div>
                <div className="cli-terminal__output">
                  <AnimatePresence mode="wait">
                    {displayedOutput.map((line, i) => (
                      <motion.div
                        key={`${activeCommand}-${i}`}
                        className={`cli-terminal__line cli-terminal__line--${line.type}`}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        {line.text}
                        {line.value && <span className="cli-terminal__value">{line.value}</span>}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="cli-preview__features" variants={fadeInUp}>
            {features.map((feature, i) => (
              <div key={i} className="cli-preview__feature">
                <div className="cli-preview__feature-icon">{feature.icon}</div>
                <div className="cli-preview__feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div className="cli-preview__cta" variants={fadeInUp}>
            <div className="cli-preview__install">
              <code>pip install shepherd-cli</code>
              <button 
                className="cli-preview__copy-btn"
                onClick={() => navigator.clipboard.writeText('pip install shepherd-cli')}
                title="Copy to clipboard"
              >
                <Copy size={14} />
              </button>
            </div>
            <p className="cli-preview__cta-subtext">
              Works with aiobs today. Langfuse, Phoenix & more coming soon
            </p>
            <div className="cli-preview__cta-buttons">
              <a 
                href="https://github.com/neuralis-in/shepherd-cli" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                <Github size={16} />
                View on GitHub
              </a>
              <a 
                href="https://neuralis-in.github.io/shepherd-cli/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn--secondary"
              >
                <ExternalLink size={16} />
                Documentation
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Shepherd MCP Section - MCP Server Integration
function ShepherdMCP() {
  const [activeTab, setActiveTab] = useState('setup')
  const [installMethod, setInstallMethod] = useState('pip') // pip | uvx
  const [client, setClient] = useState('cursor') // cursor | claude
  const [copiedKey, setCopiedKey] = useState('')
  const [openAccordion, setOpenAccordion] = useState('tools')

  const githubUrl = 'http://github.com/neuralis-in/shepherd-mcp'

  const features = [
    {
      icon: <Bot size={24} />,
      title: 'MCP Protocol',
      desc: 'Model Context Protocol support so assistants can query sessions, traces, and evaluations.'
    },
    {
      icon: <Server size={24} />,
      title: 'Runs Locally',
      desc: 'The MCP server runs as a subprocess (stdio) and talks to Shepherd over HTTPS.'
    },
    {
      icon: <Search size={24} />,
      title: 'Search & Filters',
      desc: 'Find sessions by provider/model, function name, errors, eval failures, and time windows.'
    },
    {
      icon: <GitBranch size={24} />,
      title: 'Session Diff',
      desc: 'Compare two sessions to understand what changed and why your agent regressed.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Fast Debug Loop',
      desc: 'Use your IDE assistant to inspect traces without leaving your editor.'
    },
    {
      icon: <Code size={24} />,
      title: 'Client Compatible',
      desc: 'Works with Cursor and Claude Desktop (and any MCP-compatible client).'
    }
  ]

  const tabs = [
    {
      id: 'setup',
      icon: <Terminal size={16} />,
      label: 'Setup'
    },
    {
      id: 'configure',
      icon: <SlidersIcon size={16} />,
      label: 'Configure'
    },
    {
      id: 'use',
      icon: <Target size={16} />,
      label: 'Use'
    }
  ]

  const setupCommands = [
    {
      id: 'pip',
      label: 'pip',
      cmd: 'pip install shepherd-mcp',
      note: 'Install Shepherd MCP as a Python package.'
    },
    {
      id: 'uvx',
      label: 'uvx',
      cmd: 'uvx shepherd-mcp',
      note: 'Run instantly without installing globally.'
    }
  ]

  const startCmd = installMethod === 'uvx' ? 'uvx shepherd-mcp' : 'shepherd-mcp'
  const runCmd = `${startCmd} start`

  const envSnippet = `# .env
AIOBS_API_KEY=aiobs_sk_xxxx
# Optional
AIOBS_ENDPOINT=https://your-shepherd-endpoint.example.com`

  const cursorConfig = `{
  "mcpServers": {
    "shepherd": {
      "command": "${installMethod === 'uvx' ? 'uvx' : 'shepherd-mcp'}",
      "args": ${installMethod === 'uvx' ? '["shepherd-mcp"]' : '[]'},
      "env": {
        "AIOBS_API_KEY": "aiobs_sk_xxxx"
      }
    }
  }
}`

  const claudeConfig = `{
  "mcpServers": {
    "shepherd": {
      "command": "${installMethod === 'uvx' ? 'uvx' : 'shepherd-mcp'}",
      "args": ${installMethod === 'uvx' ? '["shepherd-mcp"]' : '[]'},
      "env": {
        "AIOBS_API_KEY": "aiobs_sk_xxxx"
      }
    }
  }
}`

  const activeConfig = client === 'cursor' ? cursorConfig : claudeConfig

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(''), 1100)
    } catch {
      // no-op: clipboard may be blocked in some browsers
    }
  }

  const integrations = [
    { name: 'Cursor', icon: <Code size={20} /> },
    { name: 'Claude Desktop', icon: <Bot size={20} /> },
    { name: 'Windsurf', icon: <Activity size={20} /> },
    { name: 'VS Code', icon: <Terminal size={20} /> }
  ]

  const tools = [
    {
      name: 'list_sessions',
      desc: 'List recent AI agent sessions'
    },
    {
      name: 'get_session',
      desc: 'Inspect a session’s trace tree + tool calls'
    },
    {
      name: 'search_sessions',
      desc: 'Search by provider, model, labels, function, date, errors'
    },
    {
      name: 'diff_sessions',
      desc: 'Compare two sessions and summarize changes'
    }
  ]

  const prompts = [
    {
      title: 'Debug a failing run',
      prompt: 'Show me all sessions that had errors in the last 24 hours'
    },
    {
      title: 'Performance analysis',
      prompt: 'Compare session abc123 with session def456 and tell me which one was more efficient'
    },
    {
      title: 'Prompt regression',
      prompt: 'Find sessions using gpt-4o-mini model that failed evaluations'
    },
    {
      title: 'Cost tracking',
      prompt: 'List all sessions and summarize the total token usage'
    }
  ]

  return (
    <section className="section mcp-section" id="shepherd-mcp">
      <div className="container">
        <motion.div
          className="mcp-section__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="mcp-section__header" variants={fadeInUp}>
            <div className="mcp-section__badges">
              <div className="mcp-section__badge mcp-section__badge--new">
                <Zap size={12} />
                New
              </div>
              <div className="mcp-section__badge">
                <Server size={14} />
                MCP Server
              </div>
              <div className="mcp-section__badge">
                <Container size={14} />
                Local + Stdio
              </div>
            </div>

            <h2 className="heading-lg mcp-section__title">
              <span className="mcp-section__title-icon" aria-hidden="true">
                <Server size={22} />
              </span>
              Shepherd MCP
            </h2>

            <p className="text-lg">
              MCP (Model Context Protocol) server for Shepherd — debug your AI agents like you debug your code.
              Query sessions, traces, and evals directly from your assistant.
            </p>
          </motion.div>

          <motion.div className="mcp-section__panel" variants={fadeInUp}>
            <div className="mcp-panel__top">
              <div className="mcp-tabs" role="tablist" aria-label="Shepherd MCP">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    className={`mcp-tab ${activeTab === t.id ? 'mcp-tab--active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                    role="tab"
                    aria-selected={activeTab === t.id}
                  >
                    <span className="mcp-tab__icon">{t.icon}</span>
                    <span className="mcp-tab__label">{t.label}</span>
                  </button>
                ))}
              </div>

              <div className="mcp-panel__actions">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary mcp-panel__cta"
                >
                  <Github size={16} />
                  View on GitHub
                </a>
                <button
                  className="btn btn--secondary mcp-panel__cta mcp-panel__cta--disabled"
                  type="button"
                  aria-disabled="true"
                  title="Docs are coming soon"
                >
                  <ExternalLink size={16} />
                  Docs (coming soon)
                </button>
              </div>
            </div>

            <div className="mcp-panel__body">
              <AnimatePresence mode="wait">
                {activeTab === 'setup' && (
                  <motion.div
                    key="setup"
                    className="mcp-panel__grid"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  >
                    <div className="mcp-block">
                      <div className="mcp-block__header">
                        <h3 className="heading-md">Quick Start</h3>
                        <p className="text-sm mcp-muted">Pick an install method, then start the server.</p>
                      </div>

                      <div className="mcp-choice">
                        {setupCommands.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className={`mcp-choice__pill ${installMethod === c.id ? 'mcp-choice__pill--active' : ''}`}
                            onClick={() => setInstallMethod(c.id)}
                          >
                            <span className="mcp-choice__label">{c.label}</span>
                            <span className="mcp-choice__note">{c.note}</span>
                          </button>
                        ))}
                      </div>

                      <div className="mcp-code-stack">
                        <div className="mcp-code-card">
                          <div className="mcp-code-card__top">
                            <span className="mcp-code-card__label">Install</span>
                            <button
                              className="mcp-code-card__copy"
                              type="button"
                              onClick={() => copy('install', setupCommands.find((c) => c.id === installMethod)?.cmd || '')}
                              title="Copy"
                            >
                              {copiedKey === 'install' ? <Check size={14} /> : <Copy size={14} />}
                              {copiedKey === 'install' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <pre className="mcp-code-card__code">{setupCommands.find((c) => c.id === installMethod)?.cmd}</pre>
                        </div>

                        <div className="mcp-code-card">
                          <div className="mcp-code-card__top">
                            <span className="mcp-code-card__label">Run</span>
                            <button
                              className="mcp-code-card__copy"
                              type="button"
                              onClick={() => copy('run', runCmd)}
                              title="Copy"
                            >
                              {copiedKey === 'run' ? <Check size={14} /> : <Copy size={14} />}
                              {copiedKey === 'run' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <pre className="mcp-code-card__code">{runCmd}</pre>
                        </div>
                      </div>
                    </div>

                    <div className="mcp-aside">
                      <div className="mcp-aside__card">
                        <div className="mcp-aside__icon"><Activity size={18} /></div>
                        <h4 className="heading-sm">How it works</h4>
                        <p className="text-sm">
                          Your MCP client launches <code>shepherd-mcp</code> and communicates over stdio.
                          The server calls Shepherd’s API to query sessions and trace trees.
                        </p>
                      </div>

                      <div className="mcp-aside__card">
                        <div className="mcp-aside__icon"><Layers size={18} /></div>
                        <h4 className="heading-sm">Works with</h4>
                        <div className="mcp-integrations-list mcp-integrations-list--compact">
                          {integrations.map((integration, i) => (
                            <div key={i} className="mcp-integration-item">
                              <div className="mcp-integration-item__icon">{integration.icon}</div>
                              <span className="mcp-integration-item__name">{integration.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'configure' && (
                  <motion.div
                    key="configure"
                    className="mcp-panel__grid"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  >
                    <div className="mcp-block">
                      <div className="mcp-block__header">
                        <h3 className="heading-md">Configuration</h3>
                        <p className="text-sm mcp-muted">
                          Shepherd MCP auto-loads <code>.env</code> files from your project root.
                          You can also pass env vars directly in your MCP client config.
                        </p>
                      </div>

                      <div className="mcp-config-row">
                        <div className="mcp-config-row__label">
                          <HardDrive size={16} />
                          <span>Environment</span>
                        </div>
                        <button
                          className="mcp-config-row__copy"
                          type="button"
                          onClick={() => copy('env', envSnippet)}
                          title="Copy"
                        >
                          {copiedKey === 'env' ? <Check size={14} /> : <Copy size={14} />}
                          {copiedKey === 'env' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="mcp-config__code">{envSnippet}</pre>

                      <div className="mcp-config-controls">
                        <div className="mcp-toggle">
                          <span className="mcp-toggle__label">Client</span>
                          <div className="mcp-toggle__group">
                            <button
                              type="button"
                              className={`mcp-toggle__btn ${client === 'cursor' ? 'mcp-toggle__btn--active' : ''}`}
                              onClick={() => setClient('cursor')}
                            >
                              Cursor
                            </button>
                            <button
                              type="button"
                              className={`mcp-toggle__btn ${client === 'claude' ? 'mcp-toggle__btn--active' : ''}`}
                              onClick={() => setClient('claude')}
                            >
                              Claude Desktop
                            </button>
                          </div>
                        </div>

                        <div className="mcp-toggle">
                          <span className="mcp-toggle__label">Install method</span>
                          <div className="mcp-toggle__group">
                            <button
                              type="button"
                              className={`mcp-toggle__btn ${installMethod === 'pip' ? 'mcp-toggle__btn--active' : ''}`}
                              onClick={() => setInstallMethod('pip')}
                            >
                              pip
                            </button>
                            <button
                              type="button"
                              className={`mcp-toggle__btn ${installMethod === 'uvx' ? 'mcp-toggle__btn--active' : ''}`}
                              onClick={() => setInstallMethod('uvx')}
                            >
                              uvx
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mcp-config-row mcp-config-row--spaced">
                        <div className="mcp-config-row__label">
                          <Box size={16} />
                          <span>MCP JSON</span>
                        </div>
                        <button
                          className="mcp-config-row__copy"
                          type="button"
                          onClick={() => copy('json', activeConfig)}
                          title="Copy"
                        >
                          {copiedKey === 'json' ? <Check size={14} /> : <Copy size={14} />}
                          {copiedKey === 'json' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="mcp-config__code">{activeConfig}</pre>

                      <p className="text-sm mcp-muted mcp-note">
                        Tip: if you prefer explicit config files, use <code>claude_desktop_config.json</code> for Claude Desktop
                        or <code>.cursor/mcp.json</code> for Cursor.
                      </p>
                    </div>

                    <div className="mcp-aside">
                      <div className="mcp-aside__card">
                        <div className="mcp-aside__icon"><AlertCircle size={18} /></div>
                        <h4 className="heading-sm">Required</h4>
                        <p className="text-sm">
                          <strong>AIOBS_API_KEY</strong> is required. <strong>AIOBS_ENDPOINT</strong> is optional for custom environments.
                        </p>
                      </div>

                      <div className="mcp-aside__card">
                        <div className="mcp-aside__icon"><Zap size={18} /></div>
                        <h4 className="heading-sm">Zero friction</h4>
                        <p className="text-sm">
                          Put a <code>.env</code> in your repo root and Shepherd MCP will pick it up automatically.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'use' && (
                  <motion.div
                    key="use"
                    className="mcp-panel__grid"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                  >
                    <div className="mcp-block">
                      <div className="mcp-block__header">
                        <h3 className="heading-md">Tools + Prompts</h3>
                        <p className="text-sm mcp-muted">
                          Ask your assistant to call MCP tools — then drill into the trace tree.
                        </p>
                      </div>

                      <div className="mcp-accordion" role="region" aria-label="Shepherd MCP tools">
                        {[
                          {
                            id: 'tools',
                            title: 'Available tools',
                            icon: <Box size={16} />,
                            content: (
                              <div className="mcp-tools">
                                {tools.map((t) => (
                                  <div key={t.name} className="mcp-tool-row">
                                    <code className="mcp-tool-row__name">{t.name}</code>
                                    <span className="mcp-tool-row__desc">{t.desc}</span>
                                  </div>
                                ))}
                              </div>
                            )
                          },
                          {
                            id: 'prompts',
                            title: 'Prompt templates',
                            icon: <Target size={16} />,
                            content: (
                              <div className="mcp-prompts">
                                {prompts.map((p) => (
                                  <div key={p.title} className="mcp-prompt-card">
                                    <div className="mcp-prompt-card__top">
                                      <span className="mcp-prompt-card__title">{p.title}</span>
                                      <button
                                        className="mcp-prompt-card__copy"
                                        type="button"
                                        onClick={() => copy(`prompt-${p.title}`, p.prompt)}
                                        title="Copy"
                                      >
                                        {copiedKey === `prompt-${p.title}` ? <Check size={14} /> : <Copy size={14} />}
                                        {copiedKey === `prompt-${p.title}` ? 'Copied' : 'Copy'}
                                      </button>
                                    </div>
                                    <pre className="mcp-prompt-card__prompt">{p.prompt}</pre>
                                  </div>
                                ))}
                              </div>
                            )
                          },
                          {
                            id: 'workflow',
                            title: 'Recommended workflow',
                            icon: <RotateCcw size={16} />,
                            content: (
                              <ol className="mcp-steps">
                                <li>Search sessions that failed (errors/evals_failed).</li>
                                <li>Open a specific session and inspect the trace tree.</li>
                                <li>Diff against a “known-good” run to isolate regressions.</li>
                                <li>Fix prompt/tooling, rerun, and verify the diff closes.</li>
                              </ol>
                            )
                          }
                        ].map((item) => (
                          <div key={item.id} className={`mcp-accordion__item ${openAccordion === item.id ? 'is-open' : ''}`}>
                            <button
                              type="button"
                              className="mcp-accordion__trigger"
                              onClick={() => setOpenAccordion(openAccordion === item.id ? '' : item.id)}
                              aria-expanded={openAccordion === item.id}
                            >
                              <span className="mcp-accordion__left">
                                <span className="mcp-accordion__icon">{item.icon}</span>
                                <span className="mcp-accordion__title">{item.title}</span>
                              </span>
                              <ChevronDown className="mcp-accordion__chev" size={18} />
                            </button>

                            <AnimatePresence initial={false}>
                              {openAccordion === item.id && (
                                <motion.div
                                  key="content"
                                  className="mcp-accordion__content"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1, transition: { duration: 0.22 } }}
                                  exit={{ height: 0, opacity: 0, transition: { duration: 0.18 } }}
                                >
                                  <div className="mcp-accordion__inner">{item.content}</div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mcp-aside">
                      <div className="mcp-aside__card">
                        <div className="mcp-aside__icon"><Clock size={18} /></div>
                        <h4 className="heading-sm">Great for on-call</h4>
                        <p className="text-sm">
                          When an agent fails in prod, ask your IDE to fetch the exact run and explain the failure path.
                        </p>
                      </div>

                      <div className="mcp-aside__card">
                        <div className="mcp-aside__icon"><BarChart3 size={18} /></div>
                        <h4 className="heading-sm">Scale debugging</h4>
                        <p className="text-sm">
                          Use search filters to spot patterns across runs (providers/models/functions) and prevent regressions.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div className="mcp-section__features" variants={fadeInUp}>
            <h3 className="heading-md mcp-section__features-title">Capabilities</h3>
            <div className="mcp-features-grid">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="mcp-feature-card"
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="mcp-feature-card__icon">{feature.icon}</div>
                  <h4 className="mcp-feature-card__title">{feature.title}</h4>
                  <p className="mcp-feature-card__desc">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="mcp-section__cta" variants={fadeInUp}>
            <div className="mcp-section__cta-buttons">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                <Github size={16} />
                View on GitHub
              </a>
              <button
                className="btn btn--secondary mcp-panel__cta--disabled"
                type="button"
                aria-disabled="true"
                title="Docs are coming soon"
              >
                <ExternalLink size={16} />
                Docs (coming soon)
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Features Section
function Features() {
  const features = [
    { icon: <Terminal size={20} />, title: "CLI-First", desc: "Built for agents, not browsers" },
    { icon: <Search size={20} />, title: "Powerful Search", desc: "Filter by provider, model, errors, labels, dates" },
    { icon: <GitBranch size={20} />, title: "Session Diff", desc: "Compare runs to find regressions" },
    { icon: <Code size={20} />, title: "JSON Output", desc: "-o json for AI IDEs & agents" },
    { icon: <Layers size={20} />, title: "Multi-Provider", desc: "aiobs now, Langfuse & Phoenix soon" },
    { icon: <Github size={20} />, title: "Open-Source", desc: "MIT licensed on GitHub" },
  ]

  return (
    <section className="section section--subtle features">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="features__grid" variants={fadeInUp}>
            {features.map((feature, i) => (
              <motion.div key={i} className="feature-card" variants={fadeInUp}>
                <div className="feature-card__icon">{feature.icon}</div>
                <h3 className="heading-sm feature-card__title">{feature.title}</h3>
                <p className="text-sm feature-card__desc">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// JSON Trace Section
function JsonTrace() {
  const jsonCode = `{
  "provider": "openai",
  "api": "chat.completions",
  "request": {...},
  "response": {...},
  "duration_ms": 142,
  "callsite": "agent/plan.py:42"
}`

  return (
    <section className="section json-trace">
      <div className="container container--narrow">
        <motion.div 
          className="json-trace__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-md json-trace__title" variants={fadeInUp}>
            Structured traces for every decision.
          </motion.h2>
          
          <motion.div className="code-block json-trace__code" variants={scaleIn}>
            <div className="code-block__header">
              <span className="code-block__title">trace.json</span>
            </div>
            <div className="code-block__content">
              <pre><code>{`{\n  `}<span className="property">"provider"</span>{`: `}<span className="string">"openai"</span>{`,\n  `}<span className="property">"api"</span>{`: `}<span className="string">"chat.completions"</span>{`,\n  `}<span className="property">"request"</span>{`: {...},\n  `}<span className="property">"response"</span>{`: {...},\n  `}<span className="property">"duration_ms"</span>{`: `}<span className="number">142</span>{`,\n  `}<span className="property">"callsite"</span>{`: `}<span className="string">"agent/plan.py:42"</span>{`\n}`}</code></pre>
            </div>
          </motion.div>
          
          <motion.p className="text-base json-trace__subtitle" variants={fadeInUp}>
            Shepherd gives you structured traces for every decision.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Why Shepherd Section
function WhyShepherd() {
  const benefits = [
    "Ship agents 10× faster",
    "Reduce debugging time from hours to minutes",
    "Eliminate silent failures",
    "Make agents predictable, reproducible, and explainable"
  ]

  return (
    <section className="section section--subtle why-shepherd">
      <div className="container container--narrow">
        <motion.div 
          className="why-shepherd__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-lg why-shepherd__title" variants={fadeInUp}>
            Why Shepherd
          </motion.h2>
          
          <motion.ul className="why-shepherd__list" variants={fadeInUp}>
            {benefits.map((benefit, i) => (
              <motion.li key={i} className="why-shepherd__item" variants={fadeInUp}>
                <Zap size={18} />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}

// Final CTA Section
function FinalCTA({ onOpenModal }) {
  return (
    <section className="section final-cta">
      <div className="container container--narrow">
        <motion.div 
          className="final-cta__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="heading-lg final-cta__title" variants={fadeInUp}>
            Start tracing your agents today.
          </motion.h2>
          <motion.div className="final-cta__actions" variants={fadeInUp}>
            <button className="btn btn--primary" onClick={onOpenModal}>
              Book a Demo <ArrowRight size={16} />
            </button>
            <button className="btn btn--secondary" onClick={onOpenModal}>
              Contact Us
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <svg viewBox="0 0 32 32" className="footer__logo-icon">
              <rect width="32" height="32" rx="6" fill="#111"/>
              <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
              <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>Shepherd</span>
          </Link>
        </div>
        <nav className="footer__links">
          <a href="https://github.com/neuralis-in/shepherd-cli" target="_blank" rel="noopener noreferrer">Shepherd CLI</a>
          <Link to="/pricing">Pricing</Link>
          <Link to="/integrations">Integrations</Link>
          <Link to="/blog">Blog</Link>
          <a href="https://neuralis-in.github.io/shepherd-cli/" target="_blank" rel="noopener noreferrer">CLI Docs</a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">aiobs SDK</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="footer__copyright">
          © Shepherd, 2025
        </div>
      </div>
    </footer>
  )
}

// Main App
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="app">
      <Header onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <hr className="divider" />
        <Problem />
        <Solution />
        <ParadigmShift />
        <ShepherdShell />
        <ShepherdMCP />
        <AiobsSection />
        <HowItWorks />
        <PromptEnhancement />
        <Developer />
        <Features />
        <JsonTrace />
        <WhyShepherd />
        <FinalCTA onOpenModal={openModal} />
      </main>
      <Footer />
      <BookDemoModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default App
