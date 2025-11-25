import { useState } from 'react'
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
  Check
} from 'lucide-react'
import './App.css'

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
        <nav className="header__nav">
          <a href="#features" className="header__link">Features</a>
          <Link to="/pricing" className="header__link">Pricing</Link>
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="header__link">
            <Github size={16} />
          </a>
          <Link to="/dashboard" className="btn btn--secondary btn--sm">
            Dashboard
          </Link>
          <button className="btn btn--primary btn--sm" onClick={onOpenModal}>Book a Demo</button>
        </nav>
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
          <motion.h1 className="heading-xl hero__title" variants={fadeInUp}>
            Shepherd traces AI agents<br />so they don't fail.
          </motion.h1>
          <motion.p className="text-lg hero__subtitle" variants={fadeInUp}>
            Wrap your agent code with observer calls to trace every LLM step, tool call, and decision — 
            turning opaque agent pipelines into deterministic, debuggable timelines.
          </motion.p>
          <motion.div className="hero__actions" variants={fadeInUp}>
            <button className="btn btn--primary" onClick={onOpenModal}>
              Book a Demo <ArrowRight size={16} />
            </button>
            <Link to="/dashboard" className="btn btn--secondary">
              <Play size={16} /> View Dashboard
            </Link>
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
          <motion.div className="solution__mockup" variants={scaleIn}>
            <TimelineMockup />
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
            <div className="aiobs__badge">
              <Github size={14} />
              Open Source
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
    }
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
          
          <motion.div className="how-it-works__grid" variants={fadeInUp}>
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
        </motion.div>
      </div>
    </section>
  )
}

// Workflow Diagram
function WorkflowDiagram() {
  return (
    <div className="workflow-diagram">
      <svg viewBox="0 0 800 120" className="workflow-diagram__svg">
        <defs>
          <marker id="arrowBlack" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 z" fill="#111" />
          </marker>
        </defs>
        
        {/* Boxes */}
        <g className="workflow-box">
          <rect x="20" y="40" width="120" height="50" rx="6" fill="white" stroke="#E5E5E5" />
          <text x="80" y="70" textAnchor="middle" fontSize="12" fontWeight="500" fill="#111">Your Agent</text>
        </g>
        
        <g className="workflow-box">
          <rect x="200" y="40" width="120" height="50" rx="6" fill="#111" />
          <text x="260" y="70" textAnchor="middle" fontSize="12" fontWeight="500" fill="white">Shepherd</text>
        </g>
        
        <g className="workflow-box">
          <rect x="380" y="40" width="120" height="50" rx="6" fill="white" stroke="#E5E5E5" />
          <text x="440" y="70" textAnchor="middle" fontSize="12" fontWeight="500" fill="#111">LLM Provider</text>
        </g>
        
        <g className="workflow-box">
          <rect x="560" y="40" width="120" height="50" rx="6" fill="white" stroke="#E5E5E5" />
          <text x="620" y="70" textAnchor="middle" fontSize="12" fontWeight="500" fill="#111">JSON Traces</text>
        </g>
        
        {/* Arrows */}
        <line x1="140" y1="65" x2="195" y2="65" stroke="#111" strokeWidth="1.5" markerEnd="url(#arrowBlack)" />
        <line x1="320" y1="65" x2="375" y2="65" stroke="#111" strokeWidth="1.5" markerEnd="url(#arrowBlack)" />
        <line x1="500" y1="65" x2="555" y2="65" stroke="#111" strokeWidth="1.5" markerEnd="url(#arrowBlack)" />
        
        {/* Labels */}
        <text x="168" y="55" textAnchor="middle" fontSize="9" fill="#666">observe()</text>
        <text x="348" y="55" textAnchor="middle" fontSize="9" fill="#666">intercept</text>
        <text x="528" y="55" textAnchor="middle" fontSize="9" fill="#666">capture</text>
      </svg>
    </div>
  )
}

// Developer Section
function Developer() {
  return (
    <section className="section developer">
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
          
          <motion.div className="code-block developer__code" variants={scaleIn}>
            <div className="code-block__header">
              <span className="code-block__title">agent.py</span>
            </div>
            <div className="code-block__content">
              <pre><code><span className="keyword">from</span> aiobs <span className="keyword">import</span> observer{'\n\n'}observer.<span className="function">observe</span>(){'\n\n'}result = agent.<span className="function">run</span>(<span className="string">"Plan a 3-day trip to Tokyo"</span>){'\n\n'}observer.<span className="function">end</span>(){'\n'}observer.<span className="function">flush</span>()</code></pre>
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

// Features Section
function Features() {
  const features = [
    { icon: <Clock size={20} />, title: "Deterministic Timeline", desc: "Replay any agent run" },
    { icon: <Layers size={20} />, title: "LLM + Tool Visibility", desc: "See all inputs/outputs clearly" },
    { icon: <AlertCircle size={20} />, title: "Failure Surfacing", desc: "Detect loops, stalls, broken tool chains" },
    { icon: <GitBranch size={20} />, title: "Reproducible Debugging", desc: "Get exact callsites & parameters" },
    { icon: <Cpu size={20} />, title: "SDK-native", desc: "Works with OpenAI, Gemini, custom providers" },
    { icon: <Github size={20} />, title: "Open-source Core", desc: "aiobs powers all event capture" },
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
          <Link to="/pricing">Pricing</Link>
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
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
        <AiobsSection />
        <HowItWorks />
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
