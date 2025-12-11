import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Zap,
  TrendingUp,
  Users,
  CheckCircle,
  Github,
  Activity,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Code,
  Star,
  MessageSquare,
  GitBranch,
  BarChart3,
  Bot,
  Monitor,
  ExternalLink,
  Rocket,
  Clock,
  Target,
  Play,
  PieChart,
  User,
  X,
  Sparkles,
  FlaskConical
} from 'lucide-react'
import './ShepherdProgress.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Slide data
const slides = [
  { id: 'cover', title: 'Progress' },
  { id: 'recap', title: 'Recap' },
  { id: 'dev-updates', title: 'Development' },
  { id: 'traction', title: 'Traction' },
  { id: 'cli-wedge', title: 'CLI Wedge' },
  { id: 'why-cli-business', title: 'Why CLI' },
  { id: 'why-cli-solution', title: 'Solution' },
  { id: 'cli-demo', title: 'Demo' },
  { id: 'async-evals', title: 'Async Evals' },
  { id: 'next-week', title: "What's Next" },
]

function ProgressHeader({ currentSlide, onSlideChange }) {
  return (
    <header className="pitch-header">
      <div className="pitch-header__container">
        <Link to="/pitch-deck" className="pitch-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="pitch-header__logo">
          <svg viewBox="0 0 32 32" className="pitch-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        
        <nav className="pitch-header__nav">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`pitch-header__nav-item ${currentSlide === index ? 'active' : ''}`}
              onClick={() => onSlideChange(index)}
            >
              <span className="pitch-header__nav-dot" />
              <span className="pitch-header__nav-label">{slide.title}</span>
            </button>
          ))}
        </nav>

        <div className="pitch-header__badge pitch-header__badge--progress">
          Shepherd Progress
        </div>
      </div>
    </header>
  )
}

function SlideNavigation({ currentSlide, totalSlides, onPrev, onNext }) {
  return (
    <div className="pitch-nav">
      <button 
        className="pitch-nav__btn" 
        onClick={onPrev}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={20} />
      </button>
      <span className="pitch-nav__counter">
        {currentSlide + 1} / {totalSlides}
      </span>
      <button 
        className="pitch-nav__btn" 
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

// Cover Slide
function CoverSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--cover"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.div className="pitch-cover__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="pitch-cover__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="pitch-cover__title" variants={fadeInUp}>
          Progress Report
        </motion.h1>
        
        <motion.p className="pitch-cover__tagline" variants={fadeInUp}>
          Building the observability layer for AI agents
        </motion.p>

        <motion.p className="pitch-cover__hook" variants={fadeInUp}>
          December 5 – December 12, 2025
        </motion.p>
        
        <motion.div className="pitch-cover__stats" variants={fadeInUp}>
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">2</span>
            <span className="pitch-cover__stat-label">Dev Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">4</span>
            <span className="pitch-cover__stat-label">Traction Updates</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">5</span>
            <span className="pitch-cover__stat-label">aiobs Contributors</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Recap Slide
function RecapSlide() {
  const keyPoints = [
    {
      icon: <Layers size={24} />,
      title: 'AI Agent Observability',
      description: 'Trace every LLM call, tool invocation, and decision in your agentic pipelines'
    },
    {
      icon: <Terminal size={24} />,
      title: 'CLI-First Approach',
      description: 'Built for AI-powered IDEs and coding agents, not just browser dashboards'
    },
    {
      icon: <Github size={24} />,
      title: 'Open Source Core',
      description: 'aiobs SDK is MIT licensed — full transparency and community-driven'
    },
    {
      icon: <Zap size={24} />,
      title: 'Simple Integration',
      description: 'Just 3 lines of code: observe(), end(), flush()'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--recap"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Quick Recap</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What is Shepherd?
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Shepherd traces AI agents — so they don't fail. We provide full observability 
          for agentic pipelines, turning opaque agent behavior into debuggable timelines.
        </motion.p>

        <motion.div className="progress-recap-grid" variants={fadeInUp}>
          {keyPoints.map((point, i) => (
            <motion.div 
              key={i} 
              className="progress-recap-card"
              variants={fadeInUp}
            >
              <div className="progress-recap-card__icon">{point.icon}</div>
              <h4 className="progress-recap-card__title">{point.title}</h4>
              <p className="progress-recap-card__desc">{point.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-recap-tagline" variants={fadeInUp}>
          <p>"Shepherd traces AI agents — <strong>so they don't fail.</strong>"</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Development Updates Slide
function DevUpdatesSlide() {
  const devUpdates = [
    {
      icon: <Star size={28} />,
      title: 'Shepherd CLI v0.0.1',
      description: 'Released first version of CLI for searching sessions, viewing traces, and debugging. CLI-first observability for agentic coding tools.',
      status: 'shipped',
      highlight: true,
      details: [
        'Session listing and search',
        'Trace tree visualization',
        'Session diff for debugging',
        'JSON output for AI IDEs'
      ]
    },
    {
      icon: <FlaskConical size={28} />,
      title: 'Asynchronous Evals Setup',
      description: 'Built infrastructure for running evaluations asynchronously on agent traces without blocking production.',
      status: 'completed',
      details: [
        'Non-blocking evaluation pipeline',
        'Correctness, latency, cost metrics',
        'Dashboard integration'
      ]
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--dev-updates"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Week</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <Code size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Development Updates
        </motion.h2>

        <motion.div className="progress-dev-grid" variants={fadeInUp}>
          {devUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className={`progress-dev-card ${update.highlight ? 'progress-dev-card--highlight' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="progress-dev-card__header">
                <div className="progress-dev-card__icon">{update.icon}</div>
                <div className="progress-dev-card__title-section">
                  <h3>{update.title}</h3>
                  <span className={`progress-dev-card__status progress-dev-card__status--${update.status}`}>
                    {update.status === 'shipped' && <Rocket size={14} />}
                    {update.status === 'completed' && <CheckCircle size={14} />}
                    {update.status}
                  </span>
                </div>
              </div>
              <p className="progress-dev-card__desc">{update.description}</p>
              {update.details && (
                <ul className="progress-dev-card__details">
                  {update.details.map((detail, j) => (
                    <li key={j}>
                      <CheckCircle size={14} />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-dev-summary" variants={fadeInUp}>
          <p>
            <strong>Key Achievement:</strong> Shepherd CLI is now live — enabling AI-powered IDEs like Cursor and Windsurf 
            to debug agentic systems directly from the terminal.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Traction Updates Slide
function TractionSlide() {
  const tractionUpdates = [
    {
      icon: <MessageSquare size={24} />,
      company: 'Fenmo AI',
      title: 'Advancing to Pilot',
      description: 'Talked with Fenmo AI and advancing to pilot with Shepherd CLI for their agent infrastructure.',
      status: 'pilot',
      statusLabel: 'Pilot Stage'
    },
    {
      icon: <Activity size={24} />,
      company: 'Intraintel.ai',
      title: 'Active Integration',
      description: 'Intraintel.ai has started using Shepherd in their production traces for agent observability.',
      status: 'active',
      statusLabel: 'Using Shepherd'
    },
    {
      icon: <GitBranch size={24} />,
      company: 'LambdaTest',
      title: 'A/B Testing Discussions',
      description: 'Initiated talks with LambdaTest for A/B Testing integration and collaboration opportunities.',
      status: 'talks',
      statusLabel: 'In Talks'
    },
    {
      icon: <Users size={24} />,
      company: 'aiobs Community',
      title: 'Growing Contributors',
      description: 'Open source aiobs SDK community is growing with active contributors helping build the ecosystem.',
      status: 'growing',
      statusLabel: '5 Contributors'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--traction"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>This Week</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          <TrendingUp size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Traction Updates
        </motion.h2>

        <motion.div className="progress-traction-grid" variants={fadeInUp}>
          {tractionUpdates.map((update, i) => (
            <motion.div 
              key={i}
              className="progress-traction-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="progress-traction-card__header">
                <div className="progress-traction-card__icon">{update.icon}</div>
                <div className="progress-traction-card__company">{update.company}</div>
                <span className={`progress-traction-card__status progress-traction-card__status--${update.status}`}>
                  {update.statusLabel}
                </span>
              </div>
              <h4 className="progress-traction-card__title">{update.title}</h4>
              <p className="progress-traction-card__desc">{update.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-traction-summary" variants={fadeInUp}>
          <p>"Real conversations, real momentum — building trust with early adopters."</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// CLI Commands data (outside component to prevent recreation on each render)
const cliCommands = [
  {
    cmd: 'shepherd sessions list -n 5',
    output: [
      { type: 'header', text: '╭────────────────────────────────────────────────╮' },
      { type: 'header', text: '│  📋 Recent Sessions                            │' },
      { type: 'header', text: '╰────────────────────────────────────────────────╯' },
      { type: 'info', text: '' },
      { type: 'label', text: '  sess_7x8k2m', value: 'travel_agent  ✓ 2.4s' },
      { type: 'error', text: '  sess_4h5j6k', value: 'order_bot     ✗ 4.1s' },
      { type: 'label', text: '  sess_2w3e4r', value: 'data_analyst  ✓ 3.2s' },
    ]
  },
  {
    cmd: 'shepherd sessions get sess_4h5j6k',
    output: [
      { type: 'header', text: '╭────────────────────────────────────────────────╮' },
      { type: 'header', text: '│  🌳 Trace Tree: sess_4h5j6k                    │' },
      { type: 'header', text: '╰────────────────────────────────────────────────╯' },
      { type: 'info', text: '' },
      { type: 'success', text: '  └─ order_bot.process', value: '4.1s' },
      { type: 'success', text: '      ├─ chat.completions', value: '890ms ✓' },
      { type: 'error', text: '      └─ set_price()', value: '3.0s ✗' },
    ]
  },
  {
    cmd: 'shepherd --provider langfuse sessions list',
    output: [
      { type: 'header', text: '╭────────────────────────────────────────────────╮' },
      { type: 'header', text: '│  🔥 Langfuse Sessions                          │' },
      { type: 'header', text: '╰────────────────────────────────────────────────╯' },
      { type: 'info', text: '' },
      { type: 'success', text: '  ✓ Connected to Langfuse' },
      { type: 'label', text: '  trace_abc123', value: 'chat_agent  ✓ 1.2s' },
      { type: 'label', text: '  trace_def456', value: 'qa_bot      ✓ 2.8s' },
    ]
  },
]

const currentProviders = [
  { name: 'Langfuse', status: 'supported', icon: '🔥' },
  { name: 'aiobs', status: 'supported', icon: '🐑' },
]

const plannedProviders = [
  { name: 'LangSmith', icon: '🦜' },
  { name: 'Portkey', icon: '🚪' },
  { name: 'Phoenix', icon: '🔶' },
  { name: 'OpenTelemetry', icon: '📡' },
]

// CLI Wedge Slide - Provider Agnostic with Terminal Demo
function CLIWedgeSlide() {
  const [activeCommand, setActiveCommand] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [displayedOutput, setDisplayedOutput] = useState([])

  useEffect(() => {
    const command = cliCommands[activeCommand]
    let outputIndex = 0
    setDisplayedOutput([])
    setIsTyping(true)

    const outputTimer = setInterval(() => {
      if (outputIndex < command.output.length) {
        // Capture the current output item to avoid closure issues
        const currentOutput = command.output[outputIndex]
        setDisplayedOutput(prev => [...prev, currentOutput])
        outputIndex++
      } else {
        setIsTyping(false)
        clearInterval(outputTimer)
      }
    }, 120)

    return () => clearInterval(outputTimer)
  }, [activeCommand])

  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setActiveCommand(prev => (prev + 1) % cliCommands.length)
    }, 6000)
    return () => clearInterval(cycleTimer)
  }, [])

  return (
    <motion.div 
      className="pitch-slide pitch-slide--cli-wedge"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Star of the Show</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          🐑 Shepherd CLI
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          <strong>Provider-agnostic observability CLI.</strong> Works with your existing tools — 
          no vendor lock-in, no migration needed.
        </motion.p>

        <motion.div className="progress-wedge-layout" variants={fadeInUp}>
          <div className="progress-wedge-terminal">
            <div className="progress-wedge-terminal__header">
              <div className="progress-wedge-terminal__dots">
                <span></span><span></span><span></span>
              </div>
              <span className="progress-wedge-terminal__title">Shepherd CLI</span>
              <div className="progress-wedge-terminal__tabs">
                {cliCommands.map((_, i) => (
                  <button
                    key={i}
                    className={`progress-wedge-terminal__tab ${activeCommand === i ? 'progress-wedge-terminal__tab--active' : ''}`}
                    onClick={() => setActiveCommand(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="progress-wedge-terminal__body">
              <div className="progress-wedge-terminal__prompt">
                <span className="progress-wedge-terminal__symbol">$</span>
                <motion.span 
                  className="progress-wedge-terminal__command"
                  key={activeCommand}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {cliCommands[activeCommand].cmd}
                </motion.span>
                {isTyping && <span className="progress-wedge-terminal__cursor">▋</span>}
              </div>
              <div className="progress-wedge-terminal__output">
                {displayedOutput.map((line, i) => (
                  line && (
                    <motion.div
                      key={`${activeCommand}-${i}`}
                      className={`progress-wedge-terminal__line progress-wedge-terminal__line--${line.type}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {line.text}
                      {line.value && <span className="progress-wedge-terminal__value">{line.value}</span>}
                    </motion.div>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="progress-wedge-providers-section">
            <div className="progress-wedge-section">
              <h3 className="progress-wedge-section__title">
                <CheckCircle size={18} />
                Supported
              </h3>
              <div className="progress-wedge-providers">
                {currentProviders.map((provider, i) => (
                  <div key={i} className="progress-wedge-provider progress-wedge-provider--active">
                    <span className="progress-wedge-provider__icon">{provider.icon}</span>
                    <span className="progress-wedge-provider__name">{provider.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="progress-wedge-section">
              <h3 className="progress-wedge-section__title">
                <Rocket size={18} />
                Coming Soon
              </h3>
              <div className="progress-wedge-providers progress-wedge-providers--planned">
                {plannedProviders.map((provider, i) => (
                  <div key={i} className="progress-wedge-provider progress-wedge-provider--planned">
                    <span className="progress-wedge-provider__icon">{provider.icon}</span>
                    <span className="progress-wedge-provider__name">{provider.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-wedge-tagline" variants={fadeInUp}>
          <p><strong>One CLI, All Your Observability Tools</strong> — Switch providers with a single flag</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Why CLI - Business Case Slide
function WhyCLIBusinessSlide() {
  const stats = [
    { 
      value: '72%', 
      label: 'of developers now use AI-powered IDEs',
      source: 'Stack Overflow 2024'
    },
    { 
      value: '3M+', 
      label: 'Cursor users worldwide',
      source: 'Cursor Stats'
    },
    { 
      value: '50%', 
      label: 'of code written by AI assistants',
      source: 'GitHub Copilot'
    },
  ]

  const tools = [
    { name: 'Cursor', users: '3M+', growth: '↑ 400%' },
    { name: 'Windsurf', users: '500K+', growth: '↑ 200%' },
    { name: 'Claude Code', users: 'New', growth: '🚀' },
    { name: 'GitHub Copilot', users: '1.8M+', growth: '↑ 150%' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--why-business"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Why CLI?</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          The Rise of Agentic Coding
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Developers have moved to AI-powered IDEs. The way we write and debug code has fundamentally changed.
        </motion.p>

        <motion.div className="progress-business-quote" variants={fadeInUp}>
          <p>"The future of coding is agentic — and debugging tools need to keep up."</p>
        </motion.div>

        <motion.div className="progress-business-stats" variants={fadeInUp}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              className="progress-business-stat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <span className="progress-business-stat__value">{stat.value}</span>
              <span className="progress-business-stat__label">{stat.label}</span>
              <span className="progress-business-stat__source">{stat.source}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-business-tools" variants={fadeInUp}>
          <h4>AI-Powered IDEs & Coding Agents</h4>
          <div className="progress-business-tools__grid">
            {tools.map((tool, i) => (
              <motion.div 
                key={i}
                className="progress-business-tool"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="progress-business-tool__name">{tool.name}</span>
                <span className="progress-business-tool__users">{tool.users}</span>
                <span className="progress-business-tool__growth">{tool.growth}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Why CLI - Solution Slide (Traditional vs New)
function WhyCLISolutionSlide() {
  const oldWay = [
    { icon: <PieChart size={20} />, text: "Proprietary dashboards", problem: "Can't be accessed by AI agents" },
    { icon: <User size={20} />, text: "Human-in-the-loop", problem: "Requires manual intervention" },
    { icon: <Monitor size={20} />, text: "Click-heavy workflows", problem: "No automation possible" },
    { icon: <Clock size={20} />, text: "Context switching", problem: "Leave IDE to debug" },
  ]

  const newWay = [
    { icon: <Terminal size={20} />, text: "CLI-first", benefit: "AI agents can query directly" },
    { icon: <Bot size={20} />, text: "Agent-friendly", benefit: "Automated debugging" },
    { icon: <Code size={20} />, text: "JSON output", benefit: "Parseable by any tool" },
    { icon: <Zap size={20} />, text: "In-flow", benefit: "Never leave your IDE" },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--why-solution"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Problem</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Traditional Observability Doesn't Fit
        </motion.h2>

        <motion.div className="progress-solution-comparison" variants={fadeInUp}>
          <div className="progress-solution-column progress-solution-column--old">
            <h3>
              <X size={20} />
              Traditional Observability
            </h3>
            <div className="progress-solution-list">
              {oldWay.map((item, i) => (
                <motion.div 
                  key={i}
                  className="progress-solution-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="progress-solution-item__icon">{item.icon}</div>
                  <div className="progress-solution-item__content">
                    <span className="progress-solution-item__text">{item.text}</span>
                    <span className="progress-solution-item__problem">{item.problem}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="progress-solution-arrow">
            <ArrowRight size={32} />
          </div>

          <div className="progress-solution-column progress-solution-column--new">
            <h3>
              <CheckCircle size={20} />
              Shepherd CLI
            </h3>
            <div className="progress-solution-list">
              {newWay.map((item, i) => (
                <motion.div 
                  key={i}
                  className="progress-solution-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="progress-solution-item__icon">{item.icon}</div>
                  <div className="progress-solution-item__content">
                    <span className="progress-solution-item__text">{item.text}</span>
                    <span className="progress-solution-item__benefit">{item.benefit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-solution-tagline" variants={fadeInUp}>
          <p><strong>Dashboards are for humans.</strong></p>
          <p><strong>CLI is for agents.</strong></p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// CLI Demo Slide
function CLIDemoSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--cli-demo"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>See It In Action</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Shepherd CLI Demo
        </motion.h2>

        <motion.div className="progress-demo-video" variants={scaleIn}>
          <div className="progress-demo-video__container">
            <iframe
              src="https://drive.google.com/file/d/1YdieuVpQ9vDeCppCZn_pqI8GfiiHlpi1/preview"
              width="100%"
              height="100%"
              allow="autoplay"
              allowFullScreen
              title="Shepherd CLI Demo"
              style={{ border: 'none', borderRadius: '12px' }}
            />
          </div>
        </motion.div>

        <motion.div className="progress-demo-cta" variants={fadeInUp}>
          <p>Try it yourself:</p>
          <div className="progress-demo-install">
            <code>pip install shepherd-cli</code>
          </div>
          <div className="progress-demo-buttons">
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
      </div>
    </motion.div>
  )
}

// Async Evals Slide
function AsyncEvalsSlide() {
  const evalTypes = [
    { name: 'Correctness', description: 'Validate agent outputs against expected results' },
    { name: 'Latency', description: 'Track response times across LLM calls' },
    { name: 'Cost', description: 'Monitor token usage and API costs' },
    { name: 'Safety', description: 'Check for harmful or unexpected behaviors' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--evals"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>New Feature</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Asynchronous Evaluations
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Run evaluations on your agent traces without blocking production. 
          Get insights into correctness, latency, cost, and safety — all async.
        </motion.p>

        <motion.div className="progress-evals-grid" variants={fadeInUp}>
          <div className="progress-evals-diagram">
            <div className="progress-evals-flow">
              <div className="progress-evals-flow__step">
                <div className="progress-evals-flow__icon">
                  <Bot size={24} />
                </div>
                <span>Agent Run</span>
              </div>
              <div className="progress-evals-flow__arrow">→</div>
              <div className="progress-evals-flow__step">
                <div className="progress-evals-flow__icon">
                  <Layers size={24} />
                </div>
                <span>Trace Captured</span>
              </div>
              <div className="progress-evals-flow__arrow">→</div>
              <div className="progress-evals-flow__step progress-evals-flow__step--highlight">
                <div className="progress-evals-flow__icon">
                  <FlaskConical size={24} />
                </div>
                <span>Async Evals</span>
              </div>
              <div className="progress-evals-flow__arrow">→</div>
              <div className="progress-evals-flow__step">
                <div className="progress-evals-flow__icon">
                  <BarChart3 size={24} />
                </div>
                <span>Dashboard</span>
              </div>
            </div>
          </div>

          <div className="progress-evals-types">
            <h4>Evaluation Types</h4>
            <div className="progress-evals-types__grid">
              {evalTypes.map((evalType, i) => (
                <motion.div 
                  key={i}
                  className="progress-eval-type"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <CheckCircle size={16} />
                  <div>
                    <h5>{evalType.name}</h5>
                    <p>{evalType.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="progress-evals-note" variants={fadeInUp}>
          <Sparkles size={18} />
          <p>Non-blocking evaluations = faster iteration cycles for your agents</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Next Week Slide
function NextWeekSlide() {
  const nextItems = [
    {
      icon: <GitBranch size={24} />,
      title: 'A/B Testing Setup',
      description: 'Infrastructure for comparing agent versions and prompt variations',
      priority: 'high'
    },
    {
      icon: <Bot size={24} />,
      title: 'Shepherd Agent',
      description: 'AI agent that works alongside CLI to auto-diagnose failures',
      priority: 'high'
    },
    {
      icon: <Code size={24} />,
      title: 'aiobs Development',
      description: 'Continue expanding SDK features and provider support',
      priority: 'medium'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--next"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Looking Ahead</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          What's Next?
        </motion.h2>
        
        <motion.div className="progress-next-grid" variants={fadeInUp}>
          {nextItems.map((item, i) => (
            <motion.div 
              key={i}
              className={`progress-next-card progress-next-card--${item.priority}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="progress-next-card__icon">{item.icon}</div>
              <div className="progress-next-card__content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <span className={`progress-next-card__priority progress-next-card__priority--${item.priority}`}>
                {item.priority === 'high' && <Target size={14} />}
                {item.priority}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="progress-next-summary" variants={fadeInUp}>
          <h4>Coming Up</h4>
          <p>
            Building the foundation for A/B testing and introducing Shepherd Agent — 
            an AI-powered debugging assistant that pairs with the CLI to automatically 
            identify and suggest fixes for agent failures.
          </p>
        </motion.div>

        <motion.div className="progress-next-cta" variants={fadeInUp}>
          <Link to="/pitch-deck" className="btn btn--secondary">
            <ArrowLeft size={16} />
            Back to Pitch Deck
          </Link>
          <Link to="/contact" className="btn btn--primary">
            Get in Touch
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main component
export default function ShepherdProgress() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef(null)

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handleSlideChange = (index) => {
    setCurrentSlide(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case 'cover': return <CoverSlide />
      case 'recap': return <RecapSlide />
      case 'dev-updates': return <DevUpdatesSlide />
      case 'traction': return <TractionSlide />
      case 'cli-wedge': return <CLIWedgeSlide />
      case 'why-cli-business': return <WhyCLIBusinessSlide />
      case 'why-cli-solution': return <WhyCLISolutionSlide />
      case 'cli-demo': return <CLIDemoSlide />
      case 'async-evals': return <AsyncEvalsSlide />
      case 'next-week': return <NextWeekSlide />
      default: return <CoverSlide />
    }
  }

  return (
    <div className="pitch-deck" ref={containerRef}>
      <ProgressHeader currentSlide={currentSlide} onSlideChange={handleSlideChange} />
      
      <main className="pitch-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="pitch-slide-container"
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </main>

      <SlideNavigation 
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}
