import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Layers,
  AlertTriangle,
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
  CircleDot
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
  { id: 'business-model', title: 'Business Model' },
  { id: 'traction', title: 'Traction' },
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
      
      <motion.div className="pitch-scroll-hint" variants={fadeInUp}>
        <ArrowDown size={20} />
        <span>Scroll or use arrows to navigate</span>
      </motion.div>
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
          <span className="pitch-problem-stat__value">73%</span>
          <span className="pitch-problem-stat__label">
            of AI projects fail to reach production due to observability challenges
          </span>
        </motion.div>
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

function HowItWorksSlide() {
  const steps = [
    {
      number: '01',
      title: 'Instrument',
      description: 'Add 3 lines to your agent code. No rewrites needed.',
      icon: <Cpu size={24} />
    },
    {
      number: '02',
      title: 'Capture',
      description: 'Shepherd traces every LLM call, tool use, and decision.',
      icon: <Activity size={24} />
    },
    {
      number: '03',
      title: 'Store',
      description: 'Traces stream to your cloud (GCP, AWS, Azure, or on-prem).',
      icon: <Layers size={24} />
    },
    {
      number: '04',
      title: 'Analyze',
      description: 'Debug, replay, and optimize agent behavior.',
      icon: <BarChart3 size={24} />
    }
  ]

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

        <motion.div className="pitch-how-steps" variants={fadeInUp}>
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="pitch-how-step"
              variants={fadeInUp}
            >
              <div className="pitch-how-step__icon">{step.icon}</div>
              <span className="pitch-how-step__number">{step.number}</span>
              <h4 className="pitch-how-step__title">{step.title}</h4>
              <p className="pitch-how-step__desc">{step.description}</p>
              {i < steps.length - 1 && <div className="pitch-how-step__connector" />}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

function MarketSlide() {
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
          The AI agent market is exploding
        </motion.h2>

        <motion.div className="pitch-market-stats" variants={fadeInUp}>
          <div className="pitch-market-stat pitch-market-stat--hero">
            <span className="pitch-market-stat__value">$47B</span>
            <span className="pitch-market-stat__label">AI Agent Market by 2030</span>
            <span className="pitch-market-stat__growth">44% CAGR</span>
          </div>
          
          <div className="pitch-market-stat">
            <span className="pitch-market-stat__value">$28B</span>
            <span className="pitch-market-stat__label">Observability Market 2024</span>
          </div>
          
          <div className="pitch-market-stat">
            <span className="pitch-market-stat__value">80%</span>
            <span className="pitch-market-stat__label">Enterprises planning AI agents by 2026</span>
          </div>
        </motion.div>

        <motion.div className="pitch-market-position" variants={fadeInUp}>
          <h4>Why Now?</h4>
          <div className="pitch-market-reasons">
            <div className="pitch-market-reason">
              <Target size={20} />
              <span>LLM costs dropping rapidly, making agents economically viable</span>
            </div>
            <div className="pitch-market-reason">
              <Rocket size={20} />
              <span>OpenAI, Anthropic, Google all pushing agentic capabilities</span>
            </div>
            <div className="pitch-market-reason">
              <Shield size={20} />
              <span>Regulatory pressure for AI explainability (EU AI Act)</span>
            </div>
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
    { date: 'Q4 2024', event: 'aiobs SDK launched on GitHub' },
    { date: 'Q1 2025', event: 'First enterprise pilot discussions' },
    { date: 'Q1 2025', event: 'GSoC 2026 application submitted' },
    { date: 'Q2 2025', event: 'Shepherd platform launch' },
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
          Building momentum
        </motion.h2>

        <motion.div className="pitch-traction-metrics" variants={fadeInUp}>
          <div className="pitch-traction-metric">
            <span className="pitch-traction-metric__value">Open Source</span>
            <span className="pitch-traction-metric__label">aiobs SDK (MIT)</span>
          </div>
          <div className="pitch-traction-metric">
            <span className="pitch-traction-metric__value">2</span>
            <span className="pitch-traction-metric__label">LLM Providers</span>
          </div>
          <div className="pitch-traction-metric">
            <span className="pitch-traction-metric__value">GSoC</span>
            <span className="pitch-traction-metric__label">2026 Applicant</span>
          </div>
        </motion.div>

        <motion.div className="pitch-traction-timeline" variants={fadeInUp}>
          <h4>Key Milestones</h4>
          <div className="pitch-timeline">
            {milestones.map((milestone, i) => (
              <div key={i} className="pitch-timeline__item">
                <span className="pitch-timeline__date">{milestone.date}</span>
                <div className="pitch-timeline__dot" />
                <span className="pitch-timeline__event">{milestone.event}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function RoadmapSlide() {
  const roadmap = [
    {
      quarter: 'Q2 2025',
      title: 'Platform Launch',
      items: ['Public beta launch', 'GCP/AWS integrations', 'Analytics dashboard']
    },
    {
      quarter: 'Q3 2025',
      title: 'Enterprise Features',
      items: ['SSO & RBAC', 'On-premise deployment', 'Advanced alerting']
    },
    {
      quarter: 'Q4 2025',
      title: 'Self-Healing',
      items: ['Self-healing prompts', 'Auto-optimization', 'A/B testing']
    },
    {
      quarter: '2026',
      title: 'Scale',
      items: ['Agent marketplace', 'Multi-agent support', 'Global expansion']
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
            <span className="pitch-team__role">Founder & CEO</span>
            <p className="pitch-team__bio">
              Full-stack engineer with experience in distributed systems 
              and AI/ML infrastructure. Previously built developer tools at scale.
            </p>
          </div>
        </motion.div>

        <motion.div className="pitch-team-hiring" variants={fadeInUp}>
          <h4>We're hiring!</h4>
          <p>Looking for founding engineers passionate about AI infrastructure.</p>
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
          Join us in making AI agents trustworthy
        </motion.h2>

        <motion.div className="pitch-ask-details" variants={fadeInUp}>
          <div className="pitch-ask-amount">
            <span className="pitch-ask-amount__value">$500K</span>
            <span className="pitch-ask-amount__label">Pre-Seed Round</span>
          </div>

          <div className="pitch-ask-use">
            <h4>Use of Funds</h4>
            <div className="pitch-ask-use__grid">
              <div className="pitch-ask-use__item">
                <span className="pitch-ask-use__percent">50%</span>
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
                <span className="pitch-ask-use__label">Operations</span>
              </div>
            </div>
          </div>

          <div className="pitch-ask-runway">
            <span className="pitch-ask-runway__value">18 months</span>
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
      case 'business-model': return <BusinessModelSlide />
      case 'traction': return <TractionSlide />
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

