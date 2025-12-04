import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Layers,
  AlertTriangle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  Globe,
  CheckCircle,
  Building2,
  Github,
  Cpu,
  Activity,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  BarChart3,
  Rocket,
  CircleDot,
  Bot,
  HardDrive,
  Database,
  Container,
  Terminal,
  Code,
  Crosshair,
  X,
  Check
} from 'lucide-react'
import './PitchDeck.css'

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
  { id: 'cover', title: 'Cover' },
  { id: 'problem', title: 'Problem' },
  { id: 'solution', title: 'Solution' },
  { id: 'how-it-works', title: 'How It Works' },
  { id: 'market', title: 'Market' },
  { id: 'competitors', title: 'Competitors' },
  { id: 'business-model', title: 'Business Model' },
  { id: 'traction', title: 'Traction' },
  { id: 'partnerships', title: 'Partnerships' },
  { id: 'roadmap', title: 'Roadmap' },
  { id: 'team', title: 'Team' },
  { id: 'ask', title: 'The Ask' },
]

function PitchHeader({ currentSlide, onSlideChange }) {
  return (
    <header className="pitch-header">
      <div className="pitch-header__container">
        <Link to="/" className="pitch-header__back">
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

        <div className="pitch-header__badge">
          Investor Deck
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

// Slide Components
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
          Shepherd
        </motion.h1>
        
        <motion.p className="pitch-cover__tagline" variants={fadeInUp}>
          The observability layer for AI agents
        </motion.p>

        <motion.p className="pitch-cover__hook" variants={fadeInUp}>
          Shepherd traces AI agents—<span className="pitch-cover__hook-emphasis">so they don't fail.</span>
        </motion.p>
        
        <motion.div className="pitch-cover__meta" variants={fadeInUp}>
          <span className="pitch-cover__category">AI Infrastructure • DevTools • B2B SaaS</span>
        </motion.div>

        <motion.div className="pitch-cover__stats" variants={fadeInUp}>
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">Open Source</span>
            <span className="pitch-cover__stat-label">aiobs SDK</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">Pre-Seed</span>
            <span className="pitch-cover__stat-label">Stage</span>
          </div>
          <div className="pitch-cover__stat-divider" />
          <div className="pitch-cover__stat">
            <span className="pitch-cover__stat-value">2025</span>
            <span className="pitch-cover__stat-label">Founded</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ProblemSlide() {
  const problems = [
    {
      icon: <AlertTriangle size={24} />,
      title: 'Silent Failures',
      description: 'AI agents fail without any visibility into what went wrong'
    },
    {
      icon: <Clock size={24} />,
      title: 'Hours of Debugging',
      description: 'Engineers spend countless hours trying to reproduce issues'
    },
    {
      icon: <Shield size={24} />,
      title: 'No Accountability',
      description: 'Production agents make decisions without audit trails'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Blind Scaling',
      description: 'Teams scale agents without understanding their behavior'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--problem"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Problem</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          AI agents are black boxes
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Enterprises are deploying AI agents in production, but have zero visibility 
          into their decision-making process. When they fail, debugging is nearly impossible.
        </motion.p>

        <motion.div className="pitch-problems" variants={fadeInUp}>
          {problems.map((problem, i) => (
            <motion.div 
              key={i} 
              className="pitch-problem-card"
              variants={fadeInUp}
            >
              <div className="pitch-problem-card__icon">{problem.icon}</div>
              <h4 className="pitch-problem-card__title">{problem.title}</h4>
              <p className="pitch-problem-card__desc">{problem.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="pitch-problem-stat" variants={fadeInUp}>
          <span className="pitch-problem-stat__value">74%</span>
          <span className="pitch-problem-stat__label">
            of companies struggle to achieve and scale value from AI Agents
          </span>
        </motion.div>

        <motion.p className="pitch-problem-source" variants={fadeInUp}>
          Source: <a href="https://www.bcg.com/press/24october2024-ai-adoption-in-2024-74-of-companies-struggle-to-achieve-and-scale-value" target="_blank" rel="noopener noreferrer">BCG 2024</a>
        </motion.p>
      </div>
    </motion.div>
  )
}

function SolutionSlide() {
  const features = [
    'Deterministic execution traces',
    'Full LLM call visibility',
    'Tool invocation tracking',
    'Error detection & alerting',
    'Cloud storage integration',
    'Self-healing prompts (coming soon)'
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--solution"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Solution</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Shepherd makes AI agents transparent
        </motion.h2>
        
        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          A lightweight SDK that instruments your AI agents with just 3 lines of code, 
          providing complete observability into every decision, tool call, and LLM interaction.
        </motion.p>

        <motion.div className="pitch-solution-grid" variants={fadeInUp}>
          <div className="pitch-solution-code">
            <div className="pitch-solution-code__header">
              <span className="pitch-solution-code__dots">
                <span></span><span></span><span></span>
              </span>
              <span className="pitch-solution-code__title">agent.py</span>
            </div>
            <pre className="pitch-solution-code__content">
              <code>
                <span className="keyword">from</span> aiobs <span className="keyword">import</span> observer{'\n\n'}
                observer.<span className="function">observe</span>(){'\n'}
                <span className="comment"># Your existing agent code</span>{'\n'}
                result = agent.<span className="function">run</span>(<span className="string">"Plan a trip to Tokyo"</span>){'\n'}
                observer.<span className="function">end</span>(){'\n'}
                observer.<span className="function">flush</span>()
              </code>
            </pre>
          </div>

          <div className="pitch-solution-features">
            <h4>What you get:</h4>
            <ul>
              {features.map((feature, i) => (
                <li key={i}>
                  <CheckCircle size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Architecture Diagram Component (from landing page)
function PitchWorkflowDiagram() {
  const basePath = import.meta.env.BASE_URL
  
  const agents = [
    { id: 1, platform: 'GKE' },
    { id: 2, platform: 'EC2' },
    { id: 3, platform: 'Cloud Run' },
    { id: 4, platform: 'Lambda' },
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
              animate={{ scale: 1, opacity: 1 }}
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
        animate={{ scale: 1, opacity: 1 }}
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
        animate={{ scale: 1, opacity: 1 }}
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
        animate={{ scale: 1, opacity: 1 }}
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

function HowItWorksSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--how"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>How It Works</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Simple integration, powerful insights
        </motion.h2>

        <motion.p className="pitch-slide__subtitle" variants={fadeInUp}>
          Shepherd seamlessly instruments your agents and streams traces to your infrastructure.
        </motion.p>

        <motion.div className="pitch-how-diagram" variants={scaleIn}>
          <PitchWorkflowDiagram />
        </motion.div>
      </div>
    </motion.div>
  )
}

function MarketSlide() {
  const marketData = [
    { year: '2024', value: 5.7, height: 30 },
    { year: '2026', value: 12.0, height: 60 },
    { year: '2028', value: 26.8, height: 110 },
    { year: '2030', value: 52.1, height: 160 },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--market"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Market Opportunity</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          AI agents are the next platform shift
        </motion.h2>

        <motion.div className="pitch-market-chart-section" variants={fadeInUp}>
          <div className="pitch-market-chart">
            <div className="pitch-market-chart__header">
              <h4>AI Agent Market Size</h4>
              <span className="pitch-market-chart__cagr">45% CAGR</span>
            </div>
            <div className="pitch-market-chart__container">
              {marketData.map((item, i) => (
                <div key={item.year} className="pitch-market-chart__bar-group">
                  <motion.span 
                    className="pitch-market-chart__value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.15 }}
                    style={{ bottom: item.height + 8 }}
                  >
                    ${item.value}B
                  </motion.span>
                  <motion.div 
                    className="pitch-market-chart__bar"
                    initial={{ height: 0 }}
                    animate={{ height: item.height }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
            <div className="pitch-market-chart__years">
              {marketData.map((item) => (
                <span key={item.year} className="pitch-market-chart__year">{item.year}</span>
              ))}
            </div>
          </div>

          <div className="pitch-market-stats-side">
            <div className="pitch-market-stat-mini">
              <span className="pitch-market-stat-mini__value">$109.1B</span>
              <span className="pitch-market-stat-mini__label">U.S. Private AI Investment (2024)</span>
            </div>
            <div className="pitch-market-stat-mini">
              <span className="pitch-market-stat-mini__value">78%</span>
              <span className="pitch-market-stat-mini__label">Organizations using AI in 2024</span>
            </div>
            <div className="pitch-market-stat-mini">
              <span className="pitch-market-stat-mini__value">90%</span>
              <span className="pitch-market-stat-mini__label">AI models from industry (2024)</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="pitch-market-usecases" variants={fadeInUp}>
          <h4>AI Agents Already Delivering ROI</h4>
          <div className="pitch-market-usecases__grid">
            <div className="pitch-market-usecase">
              <span className="pitch-market-usecase__stat">95%</span>
              <span className="pitch-market-usecase__label">Cost reduction in content marketing</span>
            </div>
            <div className="pitch-market-usecase">
              <span className="pitch-market-usecase__stat">10×</span>
              <span className="pitch-market-usecase__label">Cheaper customer service ops</span>
            </div>
            <div className="pitch-market-usecase">
              <span className="pitch-market-usecase__stat">40%</span>
              <span className="pitch-market-usecase__label">Productivity boost in IT</span>
            </div>
            <div className="pitch-market-usecase">
              <span className="pitch-market-usecase__stat">25%</span>
              <span className="pitch-market-usecase__label">Faster R&D cycles</span>
            </div>
          </div>
        </motion.div>

        <motion.p className="pitch-market-source" variants={fadeInUp}>
          Sources: <a href="https://hai.stanford.edu/ai-index/2025-ai-index-report" target="_blank" rel="noopener noreferrer">Stanford HAI 2025</a>, <a href="https://www.bcg.com/capabilities/artificial-intelligence/ai-agents" target="_blank" rel="noopener noreferrer">BCG AI Agents</a>
        </motion.p>
      </div>
    </motion.div>
  )
}

function CompetitorsSlide() {
  const competitors = [
    { name: 'LangSmith', focus: 'LLM Tracing', origin: 'LangChain ecosystem' },
    { name: 'Arize AI', focus: 'ML Observability', origin: 'Model monitoring pivot' },
    { name: 'Dynatrace', focus: 'APM Giant', origin: 'Traditional APM + AI bolt-on' },
    { name: 'Portkey', focus: 'LLM Gateway', origin: 'API management focus' },
    { name: 'Datadog', focus: 'APM Giant', origin: 'Traditional APM + AI bolt-on' },
  ]

  const differentiators = [
    {
      icon: <Bot size={24} />,
      title: 'Agent-Native Architecture',
      desc: 'Built ground-up for AI agents, not LLMs retrofitted',
      us: true,
      them: false
    },
    {
      icon: <Terminal size={24} />,
      title: 'shepherd-cli First',
      desc: 'Engineer-oriented CLI workflow, not locked dashboards',
      us: true,
      them: false
    },
    {
      icon: <Code size={24} />,
      title: 'Open Source Core',
      desc: 'aiobs SDK is MIT licensed, full transparency',
      us: true,
      them: false
    },
    {
      icon: <HardDrive size={24} />,
      title: 'Your Infrastructure',
      desc: 'Data stays in your cloud, not vendor silos',
      us: true,
      them: false
    },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--competitors"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Competitive Landscape</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          They pivoted to agents. We started there.
        </motion.h2>

        <motion.div className="pitch-competitors-grid" variants={fadeInUp}>
          <div className="pitch-competitors-players">
            <h4>Existing Players</h4>
            <div className="pitch-competitors-list">
              {competitors.map((comp, i) => (
                <motion.div 
                  key={comp.name}
                  className="pitch-competitor-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="pitch-competitor-card__name">{comp.name}</span>
                  <span className="pitch-competitor-card__focus">{comp.focus}</span>
                  <span className="pitch-competitor-card__origin">{comp.origin}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pitch-competitors-wedge">
            <h4>Our Wedge</h4>
            <div className="pitch-wedge-list">
              {differentiators.map((diff, i) => (
                <motion.div 
                  key={diff.title}
                  className="pitch-wedge-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="pitch-wedge-item__icon">{diff.icon}</div>
                  <div className="pitch-wedge-item__content">
                    <span className="pitch-wedge-item__title">{diff.title}</span>
                    <span className="pitch-wedge-item__desc">{diff.desc}</span>
                  </div>
                  <div className="pitch-wedge-item__check">
                    <Check size={16} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="pitch-competitors-summary" variants={fadeInUp}>
          <div className="pitch-competitors-summary__item">
            <Crosshair size={20} />
            <span><strong>Focus:</strong> Purpose-built for agentic workflows</span>
          </div>
          <div className="pitch-competitors-summary__item">
            <Terminal size={20} />
            <span><strong>Interface:</strong> CLI-first for engineers, not sales demos</span>
          </div>
          <div className="pitch-competitors-summary__item">
            <Shield size={20} />
            <span><strong>Control:</strong> Your data, your infrastructure</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function BusinessModelSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--business"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Business Model</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Open-source core, enterprise monetization
        </motion.h2>

        <motion.div className="pitch-business-tiers" variants={fadeInUp}>
          <div className="pitch-business-tier">
            <div className="pitch-business-tier__header">
              <Github size={24} />
              <h4>Free / Open Source</h4>
            </div>
            <ul>
              <li>aiobs SDK (MIT licensed)</li>
              <li>10,000 traces/month</li>
              <li>7-day retention</li>
              <li>Community support</li>
            </ul>
            <div className="pitch-business-tier__price">
              <span className="pitch-business-tier__amount">$0</span>
              <span className="pitch-business-tier__period">/forever</span>
            </div>
          </div>

          <div className="pitch-business-tier pitch-business-tier--enterprise">
            <div className="pitch-business-tier__badge">Revenue Driver</div>
            <div className="pitch-business-tier__header">
              <Building2 size={24} />
              <h4>Enterprise</h4>
            </div>
            <ul>
              <li>Unlimited traces</li>
              <li>Advanced analytics</li>
              <li>SSO, RBAC, compliance</li>
              <li>On-premise deployment</li>
              <li>Self-healing prompts</li>
              <li>Dedicated support</li>
            </ul>
            <div className="pitch-business-tier__price">
              <span className="pitch-business-tier__amount">Custom</span>
              <span className="pitch-business-tier__period">/annual contract</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="pitch-business-model" variants={fadeInUp}>
          <div className="pitch-business-model__item">
            <DollarSign size={20} />
            <span><strong>Land:</strong> Developers adopt free SDK</span>
          </div>
          <div className="pitch-business-model__arrow">→</div>
          <div className="pitch-business-model__item">
            <Users size={20} />
            <span><strong>Expand:</strong> Teams upgrade for collaboration</span>
          </div>
          <div className="pitch-business-model__arrow">→</div>
          <div className="pitch-business-model__item">
            <Building2 size={20} />
            <span><strong>Enterprise:</strong> Org-wide deployment + support</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function TractionSlide() {
  const milestones = [
    { icon: '🚀', title: 'aiobs SDK', desc: 'Open source SDK launched', date: 'Nov 2025' },
    { icon: '⚡', title: 'Shepherd', desc: 'Platform ready', date: 'Nov 2025' },
    { icon: '🤝', title: 'Intraintel.ai', desc: 'Pilot talks advanced', date: 'Dec 2025' },
    { icon: '🔧', title: 'Verifast.ai', desc: 'PoC in development', date: 'Dec 2025' },
    { icon: '🔬', title: 'Exosphere.host', desc: 'Research collaboration', date: 'Dec 2025' },
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--traction"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Early Traction</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Real conversations, real momentum
        </motion.h2>

        <motion.div className="pitch-traction-metrics" variants={fadeInUp}>
          <div className="pitch-traction-metric">
            <span className="pitch-traction-metric__value">1</span>
            <span className="pitch-traction-metric__label">Pilot in Advanced Talks</span>
          </div>
          <div className="pitch-traction-metric">
            <span className="pitch-traction-metric__value">1</span>
            <span className="pitch-traction-metric__label">PoC in Development</span>
          </div>
          <div className="pitch-traction-metric">
            <span className="pitch-traction-metric__value">1</span>
            <span className="pitch-traction-metric__label">Research Partnership</span>
          </div>
        </motion.div>

        <motion.div className="pitch-horizontal-timeline" variants={fadeInUp}>
          <h4>Journey So Far</h4>
          
          <div className="pitch-h-timeline">
            <div className="pitch-h-timeline__line" />
            {milestones.map((m, i) => (
              <motion.div 
                key={i}
                className="pitch-h-timeline__item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <div className="pitch-h-timeline__dot" />
                <div className="pitch-h-timeline__card">
                  <span className="pitch-h-timeline__icon">{m.icon}</span>
                  <span className="pitch-h-timeline__title">{m.title}</span>
                  <span className="pitch-h-timeline__desc">{m.desc}</span>
                  <span className="pitch-h-timeline__date">{m.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function PartnershipsSlide() {
  const partnerships = [
    {
      company: 'Intraintel.ai',
      logo: `${import.meta.env.BASE_URL}intraintel.jpeg`,
      status: 'Pilot Signing',
      statusColor: '#10B981',
      description: 'AI-powered enterprise solutions company. Advanced discussions for pilot deployment of Shepherd for their agent infrastructure.',
      useCase: 'Enterprise Agent Observability'
    },
    {
      company: 'Verifast.ai',
      logo: `${import.meta.env.BASE_URL}verifast_tech_logo.jpeg`,
      status: 'PoC In Progress',
      statusColor: '#F59E0B',
      description: 'Building proof-of-concept for self-healing prompts — automatically detecting and fixing failing prompts in production.',
      useCase: 'Self-Healing Prompts'
    },
    {
      company: 'Exosphere.host',
      logo: `${import.meta.env.BASE_URL}exosphere.jpg`,
      status: 'Research Collab',
      statusColor: '#6366F1',
      description: 'Joint research initiative to understand why AI agents fail in production environments and how observability can prevent failures.',
      useCase: 'AI Agent Failure Research'
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--partnerships"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Partnerships & Pilots</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Early adopters validating the vision
        </motion.h2>

        <motion.div className="pitch-partnerships-grid" variants={fadeInUp}>
          {partnerships.map((partner, i) => (
            <motion.div 
              key={partner.company}
              className="pitch-partnership-card"
              variants={fadeInUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="pitch-partnership-card__header">
                <img src={partner.logo} alt={partner.company} className="pitch-partnership-card__logo" />
                <div className="pitch-partnership-card__info">
                  <h4 className="pitch-partnership-card__company">{partner.company}</h4>
                  <span 
                    className="pitch-partnership-card__status"
                    style={{ background: `${partner.statusColor}20`, color: partner.statusColor }}
                  >
                    {partner.status}
                  </span>
                </div>
              </div>
              <p className="pitch-partnership-card__desc">{partner.description}</p>
              <div className="pitch-partnership-card__usecase">
                <Target size={14} />
                <span>{partner.useCase}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="pitch-partnerships-quote" variants={fadeInUp}>
          <p>"Understanding agent behavior in production is the #1 challenge for enterprise AI adoption."</p>
          <span>— Common theme from pilot conversations</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function RoadmapSlide() {
  const roadmap = [
    {
      quarter: '1',
      title: 'Shepherd',
      items: ['Mature playground', 'Cloud integrations', 'Enhanced analytics']
    },
    {
      quarter: '2',
      title: 'aiobs SDK',
      items: ['Setup evals framework', 'Multi-LLM providers', 'GSoC 2026 application']
    },
    {
      quarter: '3',
      title: 'Self-Healing + CLI',
      items: ['shepherd-cli launch', 'Prompt optimizer', 'Auto-fix implementation']
    },
    {
      quarter: '4',
      title: 'Traction',
      items: ['Research partnerships', 'Client pitches', 'Pilot conversions']
    },
    {
      quarter: '5',
      title: 'Scale',
      items: ['Enterprise features', 'Multi-agent support', 'Global expansion']
    }
  ]

  return (
    <motion.div 
      className="pitch-slide pitch-slide--roadmap"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Roadmap</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Building the future of AI observability
        </motion.h2>

        <motion.div className="pitch-roadmap" variants={fadeInUp}>
          {roadmap.map((phase, i) => (
            <div key={i} className={`pitch-roadmap__phase ${i === 0 ? 'pitch-roadmap__phase--active' : ''}`}>
              <span className="pitch-roadmap__quarter">{phase.quarter}</span>
              <h4 className="pitch-roadmap__title">{phase.title}</h4>
              <ul className="pitch-roadmap__items">
                {phase.items.map((item, j) => (
                  <li key={j}><CircleDot size={12} /> {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

function TeamSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--team"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>Team</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Built by engineers, for engineers
        </motion.h2>

        <motion.div className="pitch-team" variants={fadeInUp}>
          <div className="pitch-team__member">
            <div className="pitch-team__avatar">
              <Users size={32} />
            </div>
            <h4 className="pitch-team__name">Pranav Goswami</h4>
            <span className="pitch-team__role">Founder</span>
            <p className="pitch-team__bio">
              Machine Learning Engineer at Warner Bros. Discovery. 
              Maintainer at LFortran — open-source Fortran compiler. 
              Previously led teams to develop agentic solutions.
            </p>
          </div>
        </motion.div>

        <motion.div className="pitch-team-hiring" variants={fadeInUp}>
          <h4>We need people!</h4>
          <p>"Every Dream Needs a Team" — Mercedes AMG Petronas Formula 1</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function AskSlide() {
  return (
    <motion.div 
      className="pitch-slide pitch-slide--ask"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="pitch-slide__content">
        <motion.span className="pitch-slide__label" variants={fadeInUp}>The Ask</motion.span>
        
        <motion.h2 className="pitch-slide__title" variants={fadeInUp}>
          Help us in making AI agents trustworthy
        </motion.h2>

        <motion.div className="pitch-ask-details" variants={fadeInUp}>
          <div className="pitch-ask-amount">
            <span className="pitch-ask-amount__value">$400K</span>
            <span className="pitch-ask-amount__label">Pre-Seed Round</span>
          </div>

          <div className="pitch-ask-use">
            <h4>Use of Funds</h4>
            <div className="pitch-ask-use__grid">
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">40%</span>
                <span className="pitch-ask-use__label">Engineering</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">25%</span>
                <span className="pitch-ask-use__label">Go-to-Market</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">15%</span>
                <span className="pitch-ask-use__label">Cloud Infrastructure</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">10%</span>
                <span className="pitch-ask-use__label">Open Source</span>
              </div>
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">10%</span>
                <span className="pitch-ask-use__label">Operations</span>
              </div>
            </div>
          </div>

          <div className="pitch-ask-runway">
            <span className="pitch-ask-runway__value">14 months</span>
            <span className="pitch-ask-runway__label">Runway to Series A milestones</span>
          </div>
        </motion.div>

        <motion.div className="pitch-ask-cta" variants={fadeInUp}>
          <p>Let's discuss how we can work together.</p>
          <Link to="/contact" className="btn btn--primary btn--lg">
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main component
export default function PitchDeck() {
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

  // Scroll wheel navigation - disabled to prevent accidental navigation
  // Users can navigate via arrow keys, nav dots, or bottom navigation buttons

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case 'cover': return <CoverSlide />
      case 'problem': return <ProblemSlide />
      case 'solution': return <SolutionSlide />
      case 'how-it-works': return <HowItWorksSlide />
      case 'market': return <MarketSlide />
      case 'competitors': return <CompetitorsSlide />
      case 'business-model': return <BusinessModelSlide />
      case 'traction': return <TractionSlide />
      case 'partnerships': return <PartnershipsSlide />
      case 'roadmap': return <RoadmapSlide />
      case 'team': return <TeamSlide />
      case 'ask': return <AskSlide />
      default: return <CoverSlide />
    }
  }

  return (
    <div className="pitch-deck" ref={containerRef}>
      <PitchHeader currentSlide={currentSlide} onSlideChange={handleSlideChange} />
      
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

