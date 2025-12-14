import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  AlertTriangle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Users,
  Globe,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  BarChart3,
  Rocket,
  Bot,
  Terminal,
  Code,
  Eye,
  MousePointer,
  RefreshCw,
  MessageSquare,
  Lightbulb,
  Play,
  ExternalLink,
  Quote,
  Cpu,
  Workflow,
  Search,
  Wrench,
  GitBranch,
  MonitorPlay,
  BrainCircuit,
  Plug
} from 'lucide-react'
import './VibehackDeck.css'

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
  { id: 'cover', title: 'Shepherd' },
  { id: 'vibehack-intro', title: 'Shepherd-MCP' },
  { id: 'traditional-obs', title: 'Problem' },
  { id: 'experience', title: 'Experience' },
  { id: 'ai-ides', title: 'AI IDEs' },
  { id: 'solution', title: 'Solution' },
  { id: 'shepherd-mcp', title: 'Why MCP?' },
  { id: 'integration', title: 'Integration' },
  { id: 'validation', title: 'Validation' },
  { id: 'route', title: 'Route' },
  { id: 'demo', title: 'Demo' },
  { id: 'thank-you', title: 'Thank You' },
]

function VibehackHeader({ currentSlide, onSlideChange }) {
  return (
    <header className="vibehack-header">
      <div className="vibehack-header__container">
        <Link to="/" className="vibehack-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="vibehack-header__logo">
          <svg viewBox="0 0 32 32" className="vibehack-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        
        <nav className="vibehack-header__nav">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`vibehack-header__nav-item ${currentSlide === index ? 'active' : ''}`}
              onClick={() => onSlideChange(index)}
            >
              <span className="vibehack-header__nav-dot" />
              <span className="vibehack-header__nav-label">{slide.title}</span>
            </button>
          ))}
        </nav>

        <div className="vibehack-header__badge">
          Vibehack 2025
        </div>
      </div>
    </header>
  )
}

function SlideNavigation({ currentSlide, totalSlides, onPrev, onNext }) {
  return (
    <div className="vibehack-nav">
      <button 
        className="vibehack-nav__btn" 
        onClick={onPrev}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={20} />
      </button>
      <span className="vibehack-nav__counter">
        {currentSlide + 1} / {totalSlides}
      </span>
      <button 
        className="vibehack-nav__btn" 
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
      className="vibehack-slide vibehack-slide--cover"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.div className="vibehack-cover__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="vibehack-cover__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="vibehack-cover__title" variants={fadeInUp}>
          What is Shepherd?
        </motion.h1>
        
        <motion.p className="vibehack-cover__tagline" variants={fadeInUp}>
          The observability layer for AI agents
        </motion.p>

        <motion.p className="vibehack-cover__hook" variants={fadeInUp}>
          Open-source SDK that instruments your AI agents—<span className="vibehack-cover__hook-emphasis">traces every decision, tool call, and LLM interaction.</span>
        </motion.p>
        
        <motion.div className="vibehack-cover__features" variants={fadeInUp}>
          <div className="vibehack-cover__feature">
            <Eye size={20} />
            <span>Full Visibility</span>
          </div>
          <div className="vibehack-cover__feature">
            <Code size={20} />
            <span>3 Lines of Code</span>
          </div>
          <div className="vibehack-cover__feature">
            <Shield size={20} />
            <span>Your Infrastructure</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function VibehackIntroSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--intro"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>During Vibehack</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          We developed <span className="vibehack-highlight">Shepherd-MCP</span>!
        </motion.h2>
        
        <motion.div className="vibehack-intro-grid" variants={fadeInUp}>
          <div className="vibehack-intro-card vibehack-intro-card--why">
            <div className="vibehack-intro-card__icon">
              <Lightbulb size={32} />
            </div>
            <h3>Why MCP?</h3>
            <p>Model Context Protocol bridges the gap between observability tools and AI-powered coding environments.</p>
          </div>
          
          <div className="vibehack-intro-card vibehack-intro-card--what">
            <div className="vibehack-intro-card__icon">
              <Plug size={32} />
            </div>
            <h3>What does it do?</h3>
            <p>Brings traces directly into Cursor, Windsurf, or any MCP-compatible IDE—right where developers work.</p>
          </div>
          
          <div className="vibehack-intro-card vibehack-intro-card--result">
            <div className="vibehack-intro-card__icon">
              <Zap size={32} />
            </div>
            <h3>The Result</h3>
            <p>AI agents can now read, analyze, and fix issues from observability data without context switching.</p>
          </div>
        </motion.div>

        <motion.div className="vibehack-intro-tagline" variants={fadeInUp}>
          <Rocket size={24} />
          <span>Observability meets Agentic Coding</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function TraditionalObsSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--traditional"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>The Problem</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          Yet another observability tool? <span className="vibehack-no">No.</span>
        </motion.h2>
        
        <motion.div className="vibehack-traditional-layout" variants={fadeInUp}>
          <div className="vibehack-traditional-problems">
            <h3>Traditional Observability Pain Points</h3>
            <div className="vibehack-problem-list">
              <div className="vibehack-problem-item">
                <BarChart3 size={20} />
                <span>Proprietary dashboards</span>
              </div>
              <div className="vibehack-problem-item">
                <MousePointer size={20} />
                <span>Click-heavy navigation</span>
              </div>
              <div className="vibehack-problem-item">
                <ExternalLink size={20} />
                <span>Away from dev environment</span>
              </div>
              <div className="vibehack-problem-item">
                <RefreshCw size={20} />
                <span>Vicious debugging cycle</span>
              </div>
            </div>
          </div>
          
          <div className="vibehack-vicious-cycle">
            <h4>The Vicious Cycle</h4>
            <div className="vibehack-cycle-circular">
              {/* SVG for connecting arrows - viewBox matches 320x320 container */}
              <svg className="vibehack-cycle-arrows" viewBox="0 0 320 320">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>
                {/* L-shaped arrows with aligned axes - clockwise flow */}
                {/* PM → Alert: right on Y=40, then down to Alert */}
                <polyline points="200,40 264,40 264,68" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#arrowhead)" />
                {/* Alert → Dashboard: down on X=224 (moved left) */}
                <polyline points="264,132 264,188" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#arrowhead)" />
                {/* Dashboard → Click: down on X=264, then left on Y=280 */}
                <polyline points="264,252 264,280 200,280" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#arrowhead)" />
                {/* Click → Overwhelm: left on Y=280, then up to Overwhelm */}
                <polyline points="120,280 56,280 56,252" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#arrowhead)" />
                {/* Overwhelm → Fix: up on X=96 (moved right) */}
                <polyline points="56,188 56,132" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#arrowhead)" />
                {/* Fix → PM: up on X=56, then right on Y=40 */}
                <polyline points="56,68 56,40 120,40" fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" markerEnd="url(#arrowhead)" />
              </svg>
              
              {/* Cycle nodes positioned in a circle */}
              <div className="vibehack-cycle-node vibehack-cycle-node--pm">
                <Users size={20} />
                <span>Built for PMs</span>
              </div>
              <div className="vibehack-cycle-node vibehack-cycle-node--alert">
                <AlertTriangle size={20} />
                <span>Alert to Dev</span>
              </div>
              <div className="vibehack-cycle-node vibehack-cycle-node--dashboard">
                <MonitorPlay size={20} />
                <span>Go to Dashboard</span>
              </div>
              <div className="vibehack-cycle-node vibehack-cycle-node--click">
                <MousePointer size={20} />
                <span>Click Chaos</span>
              </div>
              <div className="vibehack-cycle-node vibehack-cycle-node--overwhelm">
                <AlertCircle size={20} />
                <span>Info Overload</span>
              </div>
              <div className="vibehack-cycle-node vibehack-cycle-node--fix">
                <Wrench size={20} />
                <span>Difficulty Fixing</span>
              </div>

              {/* Center label */}
              <div className="vibehack-cycle-center">
                <RefreshCw size={24} />
                <span>Repeat</span>
              </div>
            </div>
            <p className="vibehack-cycle-caption">Developers waste hours context-switching instead of fixing</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ExperienceSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--experience"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>First-Hand Experience</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          I've lived this problem.
        </motion.h2>
        
        <motion.div className="vibehack-experience-cards" variants={fadeInUp}>
          <div className="vibehack-exp-card">
            <div className="vibehack-exp-card__header">
              <BrainCircuit size={28} />
              <div>
                <h4>Machine Learning Engineer</h4>
                <span className="vibehack-exp-card__company">Warner Bros. Discovery</span>
              </div>
            </div>
            <p>Worked on ML systems at scale. Saw firsthand how observability tools fell short when debugging complex AI pipelines.</p>
          </div>
          
          <div className="vibehack-exp-card">
            <div className="vibehack-exp-card__header">
              <Users size={28} />
              <div>
                <h4>Led Agentic Solutions Teams</h4>
                <span className="vibehack-exp-card__company">Consulting Companies</span>
              </div>
            </div>
            <p>Led teams developing agentic AI solutions for enterprises. The debugging pain was real—traces everywhere, fixes nowhere near.</p>
          </div>
        </motion.div>

        <motion.div className="vibehack-experience-insight" variants={fadeInUp}>
          <Quote size={24} />
          <p>The tools weren't built for developers. They were built for dashboards.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function AIIDEsSlide() {
  const stats = [
    { name: 'Cursor', metric: '5M+', label: 'Daily Active Users', growth: '+400%' },
    { name: 'Windsurf', metric: '1M+', label: 'Downloads', growth: 'New' },
    { name: 'GitHub Copilot', metric: '1.3M+', label: 'Paid Subscribers', growth: '+35%' },
  ]

  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--aiides"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>The Opportunity</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          Why can't AI-powered IDEs do this?
        </motion.h2>
        
        <motion.p className="vibehack-slide__subtitle" variants={fadeInUp}>
          AI coding assistants are exploding. Developers live inside their IDEs. Why are we still leaving to debug?
        </motion.p>

        <motion.div className="vibehack-ide-stats" variants={fadeInUp}>
          {stats.map((stat, i) => (
            <div key={stat.name} className="vibehack-ide-stat">
              <span className="vibehack-ide-stat__name">{stat.name}</span>
              <span className="vibehack-ide-stat__value">{stat.metric}</span>
              <span className="vibehack-ide-stat__label">{stat.label}</span>
              <span className="vibehack-ide-stat__growth">{stat.growth}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className="vibehack-ide-insight" variants={fadeInUp}>
          <Terminal size={24} />
          <p>Developers already use AI to write code. Why not to <strong>debug</strong> it too?</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function SolutionSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--solution"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>The Solution</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          How can we cut the turnaround time?
        </motion.h2>

        <motion.p className="vibehack-slide__subtitle" variants={fadeInUp}>
          That's where <span className="vibehack-highlight">Shepherd-MCP</span> comes in.
        </motion.p>
        
        <motion.div className="vibehack-workflow-comparison" variants={fadeInUp}>
          <div className="vibehack-workflow vibehack-workflow--new vibehack-workflow--standalone">
            <h4>With Shepherd-MCP</h4>
            <div className="vibehack-workflow-steps vibehack-workflow-steps--simple">
              <div className="vibehack-workflow-step vibehack-workflow-step--highlight">
                <Bot size={16} />
                <span>Offload to Cursor/Windsurf</span>
              </div>
              <div className="vibehack-workflow-arrow">→</div>
              <div className="vibehack-workflow-step vibehack-workflow-step--highlight">
                <Search size={16} />
                <span>AI Isolates & RCA</span>
              </div>
              <div className="vibehack-workflow-arrow">→</div>
              <div className="vibehack-workflow-step vibehack-workflow-step--highlight">
                <Wrench size={16} />
                <span>Fix in Same Tool</span>
              </div>
            </div>
            <span className="vibehack-workflow-time vibehack-workflow-time--fast">Minutes</span>
          </div>
        </motion.div>

        <motion.p className="vibehack-solution-punchline" variants={fadeInUp}>
          Let AI isolate issues, conduct RCA, and fix—all without leaving your IDE.
        </motion.p>
      </div>
    </motion.div>
  )
}

function ShepherdMCPSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--mcp"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>The Paradigm Shift</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          Why <span className="vibehack-highlight">MCP</span>?
        </motion.h2>
        
        <motion.div className="vibehack-mcp-insight" variants={fadeInUp}>
          <blockquote>
            "The history of observability tools over the past couple of decades have been about a pretty simple concept: <strong>how do we make terabytes of heterogeneous telemetry data comprehensible to human beings?</strong>"
          </blockquote>
        </motion.div>

        <motion.div className="vibehack-mcp-death" variants={fadeInUp}>
          <div className="vibehack-mcp-death__icon">
            <BrainCircuit size={40} />
          </div>
          <div className="vibehack-mcp-death__content">
            <h3>In AI, I see the death of this paradigm.</h3>
            <p>It's already real. It's already here. It's going to fundamentally change the way we approach systems design and operation in the future.</p>
          </div>
        </motion.div>

        <motion.div className="vibehack-mcp-catchup" variants={fadeInUp}>
          <Globe size={24} />
          <p><strong>The world has moved to Agentic Coding.</strong> Observability is yet to catch up.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function IntegrationSlide() {
  const tools = [
    { name: 'Langfuse', icon: Eye, highlight: true },
    { name: 'aiobs', icon: BrainCircuit, highlight: true },
    { name: 'Portkey', icon: Shield, highlight: false },
    { name: 'Datadog', icon: BarChart3, highlight: false },
    { name: 'Any Tool', icon: Layers, highlight: false },
  ]

  const ides = [
    { name: 'Cursor', icon: Terminal, highlight: true },
    { name: 'Claude Code', icon: Code, highlight: true },
    { name: 'Emergent', icon: Rocket, highlight: true },
    { name: 'Windsurf', icon: Terminal, highlight: true },
    { name: 'Any MCP IDE', icon: Terminal, highlight: true },
  ]

  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--integration"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>Universal Integration</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          Works with what you already use.
        </motion.h2>
        
        <motion.p className="vibehack-slide__subtitle" variants={fadeInUp}>
          Simply integrate Shepherd-MCP to your IDE—whether you use Langfuse, aiobs, Portkey, Datadog, or any observability tool.
        </motion.p>

        <motion.div className="vibehack-integration-flow" variants={fadeInUp}>
          <div className="vibehack-integration-tools">
            {tools.map((tool, i) => (
              <motion.div 
                key={tool.name}
                className={`vibehack-integration-tool ${tool.highlight ? 'vibehack-integration-tool--highlight' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <tool.icon size={20} />
                <span>{tool.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="vibehack-integration-arrow">
            <Workflow size={32} />
          </div>

          <div className="vibehack-integration-mcp">
            <div className="vibehack-integration-mcp__badge">
              <svg viewBox="0 0 32 32" className="vibehack-integration-mcp__logo">
                <rect width="32" height="32" rx="6" fill="#111"/>
                <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
              <span>Shepherd-MCP</span>
            </div>
          </div>

          <div className="vibehack-integration-arrow">
            <Zap size={32} />
          </div>

          <div className="vibehack-integration-ides">
            {ides.map((ide, i) => (
              <motion.div 
                key={ide.name}
                className={`vibehack-integration-ide ${ide.highlight ? 'vibehack-integration-ide--highlight' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <ide.icon size={24} />
                <span>{ide.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className="vibehack-integration-bam" variants={fadeInUp}>
          <span>And bam!</span> Your AI can read, analyze, and fix production issues.
        </motion.div>
      </div>
    </motion.div>
  )
}

function ValidationSlide() {
  const quotes = [
    {
      company: 'Fenmo AI',
      role: 'Founder',
      quote: "Devs have to do frequent context-switching to move to dashboards...",
      insight: "Need a solution that fits in well",
      tool: "Uses Langfuse",
      color: '#F97316'
    },
    {
      company: 'Nurix.ai',
      role: 'Developers',
      quote: "Looking through Agentic trace containing 50 LLM calls + 20 tool dispatch...",
      insight: "Pain, chore, bloat—cut it down with agentic coding",
      tool: "Building AI Agents",
      color: '#3B82F6'
    },
    {
      company: 'AgnostAI',
      role: 'Founders',
      quote: "Analytics is for management. Real work is done by developers.",
      insight: "Building on top of analytics engine may significantly speedup developer pace",
      tool: "Analytics Platform",
      color: '#8B5CF6'
    }
  ]

  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--validation"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>Market Validation</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          Do teams really want this?
        </motion.h2>
        
        <motion.p className="vibehack-slide__subtitle" variants={fadeInUp}>
          Before we hop on to the demo, I've been talking with people here and prior to the hackathon to understand if this is real—or yet another cool AI feature.
        </motion.p>

        <motion.div className="vibehack-validation-quotes" variants={fadeInUp}>
          {quotes.map((q, i) => (
            <motion.div 
              key={q.company}
              className="vibehack-quote-card"
              style={{ '--quote-color': q.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="vibehack-quote-card__header">
                <div className="vibehack-quote-card__company">
                  <span className="vibehack-quote-card__name">{q.company}</span>
                  <span className="vibehack-quote-card__role">{q.role}</span>
                </div>
                <span className="vibehack-quote-card__tool">{q.tool}</span>
              </div>
              <blockquote className="vibehack-quote-card__quote">"{q.quote}"</blockquote>
              <p className="vibehack-quote-card__insight">
                <Lightbulb size={14} />
                {q.insight}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="vibehack-validation-verdict" variants={fadeInUp}>
          <CheckCircle size={24} />
          <span>Guess what? <strong>They want it.</strong></span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function RouteSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--route"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>The Path Forward</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          Route to Growth
        </motion.h2>

        <motion.div className="vibehack-route-milestones" variants={fadeInUp}>
          <div className="vibehack-route-milestone vibehack-route-milestone--first">
            <div className="vibehack-route-milestone__header">
              <Users size={28} />
              <span className="vibehack-route-milestone__number">100</span>
            </div>
            <h3>First 100 Users</h3>
            <ul className="vibehack-route-milestone__list">
              <li>Open-source community adoption</li>
              <li>Dev-focused content & tutorials</li>
              <li>Hackathon partnerships</li>
              <li>Direct outreach to AI teams</li>
            </ul>
          </div>

          <div className="vibehack-route-milestone vibehack-route-milestone--mrr">
            <div className="vibehack-route-milestone__header">
              <TrendingUp size={28} />
              <span className="vibehack-route-milestone__number">$1-10K</span>
            </div>
            <h3>Monthly Recurring Revenue</h3>
            <ul className="vibehack-route-milestone__list">
              <li>Enterprise tier with premium features</li>
              <li>Team collaboration & SSO</li>
              <li>Priority support & SLAs</li>
              <li>Custom integrations</li>
            </ul>
          </div>

          <div className="vibehack-route-milestone vibehack-route-milestone--tam">
            <div className="vibehack-route-milestone__header">
              <Globe size={28} />
              <span className="vibehack-route-milestone__number">$50B+</span>
            </div>
            <h3>Market Opportunity</h3>
            <ul className="vibehack-route-milestone__list">
              <li>Observability / AI Agent Market: $50B+ by 2030</li>
              <li>AI developer tools: fastest growing</li>
              <li>30M+ developers worldwide</li>
              <li>Every AI agent needs observability</li>
            </ul>
            <div className="vibehack-route-milestone__sources">
              <a href="https://hai.stanford.edu/ai-index/2025-ai-index-report" target="_blank" rel="noopener noreferrer">Stanford HAI</a>
              <a href="https://www.bcg.com/capabilities/artificial-intelligence/ai-agents" target="_blank" rel="noopener noreferrer">BCG</a>
            </div>
          </div>
        </motion.div>

        <motion.div className="vibehack-route-insight" variants={fadeInUp}>
          <Rocket size={24} />
          <p>The intersection of <strong>observability</strong> and <strong>agentic coding</strong> is where we play.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

function DemoSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--demo"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.span className="vibehack-slide__label" variants={fadeInUp}>Live Demo</motion.span>
        
        <motion.h2 className="vibehack-slide__title" variants={fadeInUp}>
          See it in action.
        </motion.h2>
        
        <motion.div className="vibehack-demo-videos" variants={fadeInUp}>
          <div className="vibehack-demo-card">
            <div className="vibehack-demo-card__embed">
              <iframe
                src="https://drive.google.com/file/d/1JzCdk9X0E9kI8ndOCPNzgbtljbsUhbHa/preview"
                allow="autoplay"
                allowFullScreen
                title="Emergent + aiobs Demo"
              />
            </div>
            <div className="vibehack-demo-card__info">
              <h4>Emergent + aiobs</h4>
              <p>Watch how Shepherd MCP integrates with Emergent.</p>
            </div>
          </div>

          <div className="vibehack-demo-card">
            <div className="vibehack-demo-card__embed">
              <iframe
                src="https://drive.google.com/file/d/1uKeHTKyr71cBYWk5_KdCzpm6XYoFmNc0/preview"
                allow="autoplay"
                allowFullScreen
                title="Cursor + Langfuse Demo"
              />
            </div>
            <div className="vibehack-demo-card__info">
              <h4>Cursor + Langfuse</h4>
              <p>See Shepherd-MCP powering debugging directly in Cursor IDE</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="vibehack-demo-note" variants={fadeInUp}>
          <Terminal size={20} />
          <span>Click to watch the full demo videos</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

function ThankYouSlide() {
  return (
    <motion.div 
      className="vibehack-slide vibehack-slide--thankyou"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="vibehack-slide__content">
        <motion.div className="vibehack-thankyou__logo" variants={fadeInUp}>
          <svg viewBox="0 0 32 32" className="vibehack-thankyou__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
        </motion.div>
        
        <motion.h1 className="vibehack-thankyou__title" variants={fadeInUp}>
          Thank You!
        </motion.h1>
        
        <motion.p className="vibehack-thankyou__tagline" variants={fadeInUp}>
          Shepherd-MCP: Bringing observability into the age of agentic coding.
        </motion.p>

        <motion.div className="vibehack-thankyou__qa" variants={fadeInUp}>
          <MessageSquare size={32} />
          <h3>Q&A</h3>
          <p>I'd love to hear your questions and feedback!</p>
        </motion.div>

        <motion.div className="vibehack-thankyou__links" variants={fadeInUp}>
          <a href="https://github.com/neuralis-ai/shepherd" target="_blank" rel="noopener noreferrer" className="vibehack-thankyou__link">
            <Code size={18} />
            <span>GitHub</span>
          </a>
          <Link to="/playground" className="vibehack-thankyou__link">
            <Play size={18} />
            <span>Try Playground</span>
          </Link>
          <Link to="/contact" className="vibehack-thankyou__link">
            <MessageSquare size={18} />
            <span>Get in Touch</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main component
export default function VibehackDeck() {
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
      case 'vibehack-intro': return <VibehackIntroSlide />
      case 'traditional-obs': return <TraditionalObsSlide />
      case 'experience': return <ExperienceSlide />
      case 'ai-ides': return <AIIDEsSlide />
      case 'solution': return <SolutionSlide />
      case 'shepherd-mcp': return <ShepherdMCPSlide />
      case 'integration': return <IntegrationSlide />
      case 'validation': return <ValidationSlide />
      case 'route': return <RouteSlide />
      case 'demo': return <DemoSlide />
      case 'thank-you': return <ThankYouSlide />
      default: return <CoverSlide />
    }
  }

  return (
    <div className="vibehack-deck" ref={containerRef}>
      <VibehackHeader currentSlide={currentSlide} onSlideChange={handleSlideChange} />
      
      <main className="vibehack-main">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="vibehack-slide-container"
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

