import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Brain, 
  GitCompare, 
  ThumbsUp, 
  ThumbsDown,
  ArrowRight,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  Code,
  Eye,
  Edit3,
  Send,
  Crown,
  Rocket
} from 'lucide-react'
import './PromptEnhancement.css'

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

// Sample responses for the demo
const sampleResponses = [
  { 
    id: 1, 
    input: "What's the weather in Tokyo?",
    output: "I don't have access to real-time data...",
    classification: 'bad',
    reason: 'Failed to use weather tool'
  },
  { 
    id: 2, 
    input: "Book a flight to Paris",
    output: "I've found several options for you...",
    classification: 'good',
    reason: null
  },
  { 
    id: 3, 
    input: "Calculate 15% tip on $85",
    output: "The answer is approximately $13...",
    classification: 'bad',
    reason: 'Imprecise calculation'
  },
  { 
    id: 4, 
    input: "Summarize this document",
    output: "Here's a comprehensive summary...",
    classification: 'good',
    reason: null
  },
  { 
    id: 5, 
    input: "Find nearby restaurants",
    output: "I apologize, I cannot access...",
    classification: 'bad',
    reason: 'Didnt invoke location tool'
  },
]

// Floating Window Component
function FloatingWindow({ 
  title, 
  children, 
  position, 
  delay = 0, 
  badge = null, 
  isActive = false,
  icon: Icon,
  variant = 'default'
}) {
  return (
    <motion.div
      className={`pe-window pe-window--${variant} ${isActive ? 'pe-window--active' : ''}`}
      style={{
        '--window-x': position.x,
        '--window-y': position.y,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="pe-window__header">
        <div className="pe-window__dots">
          <span></span><span></span><span></span>
        </div>
        <div className="pe-window__title">
          {Icon && <Icon size={12} />}
          <span>{title}</span>
        </div>
        {badge && (
          <span className={`pe-window__badge pe-window__badge--${badge.type}`}>
            {badge.text}
          </span>
        )}
      </div>
      <div className="pe-window__body">
        {children}
      </div>
    </motion.div>
  )
}

// Code Decorator Window
function DecoratorWindow() {
  return (
    <FloatingWindow 
      title="agent.py" 
      position={{ x: '0%', y: '0%' }}
      delay={0.1}
      icon={Code}
      variant="code"
    >
      <div className="pe-code">
        <div className="pe-code__line pe-code__line--highlight">
          <span className="pe-code__decorator">@observe</span>
          <span className="pe-code__paren">(</span>
          <span className="pe-code__param">enh_prompt</span>
          <span className="pe-code__op">=</span>
          <span className="pe-code__bool">True</span>
          <span className="pe-code__comma">,</span>
          <span className="pe-code__param">threshold</span>
          <span className="pe-code__op">=</span>
          <span className="pe-code__num">500</span>
          <span className="pe-code__paren">)</span>
        </div>
        <div className="pe-code__line">
          <span className="pe-code__keyword">def</span>
          <span className="pe-code__func"> process_query</span>
          <span className="pe-code__paren">(</span>
          <span className="pe-code__param">self</span>
          <span className="pe-code__comma">,</span>
          <span className="pe-code__param">query</span>
          <span className="pe-code__paren">)</span>
          <span className="pe-code__colon">:</span>
        </div>
        <div className="pe-code__line pe-code__line--indent">
          <span className="pe-code__comment"># LLM calls traced here</span>
        </div>
        <div className="pe-code__line pe-code__line--indent">
          <span className="pe-code__var">response</span>
          <span className="pe-code__op"> = </span>
          <span className="pe-code__call">self.llm.generate</span>
          <span className="pe-code__paren">(</span>
          <span className="pe-code__param">query</span>
          <span className="pe-code__paren">)</span>
        </div>
      </div>
      <div className="pe-code__footer">
        <div className="pe-code__trace-indicator">
          <div className="pe-code__trace-dot"></div>
          <span>Collecting traces...</span>
        </div>
        <span className="pe-code__counter">247 / 500</span>
      </div>
    </FloatingWindow>
  )
}

// Trace Collection Window
function TraceCollectionWindow() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 1
      })
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <FloatingWindow 
      title="Trace Collection" 
      position={{ x: '0%', y: '0%' }}
      delay={0.2}
      icon={Eye}
      badge={{ text: 'Live', type: 'live' }}
      variant="trace"
    >
      <div className="pe-trace-collection">
        <div className="pe-trace-collection__progress">
          <div className="pe-trace-collection__bar">
            <motion.div 
              className="pe-trace-collection__fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="pe-trace-collection__count">
            {Math.floor(progress * 5)} / 500 traces
          </span>
        </div>
        <div className="pe-trace-collection__items">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              className="pe-trace-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="pe-trace-item__icon">
                <Zap size={10} />
              </div>
              <div className="pe-trace-item__content">
                <span className="pe-trace-item__model">gpt-4o</span>
                <span className="pe-trace-item__time">42ms</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </FloatingWindow>
  )
}

// Classification Agent Window
function ClassificationWindow() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % sampleResponses.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <FloatingWindow 
      title="Classification Agent" 
      position={{ x: '0%', y: '0%' }}
      delay={0.3}
      icon={Brain}
      badge={{ text: 'AI', type: 'ai' }}
      variant="classification"
    >
      <div className="pe-classification">
        <div className="pe-classification__header">
          <span>Analyzing responses...</span>
          <RefreshCw size={12} className="pe-classification__spinner" />
        </div>
        <div className="pe-classification__list">
          {sampleResponses.slice(0, 4).map((response, i) => (
            <motion.div 
              key={response.id}
              className={`pe-classification__item ${i === activeIndex ? 'pe-classification__item--active' : ''}`}
              animate={i === activeIndex ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <span className="pe-classification__input">
                "{response.input.slice(0, 25)}..."
              </span>
              <span className={`pe-classification__tag pe-classification__tag--${response.classification}`}>
                {response.classification === 'bad' ? (
                  <><XCircle size={10} /> BAD</>
                ) : (
                  <><CheckCircle size={10} /> GOOD</>
                )}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="pe-classification__stats">
          <div className="pe-classification__stat">
            <ThumbsDown size={12} />
            <span>23 Bad</span>
          </div>
          <div className="pe-classification__stat">
            <ThumbsUp size={12} />
            <span>477 Good</span>
          </div>
        </div>
      </div>
    </FloatingWindow>
  )
}

// Prompt Enhancer Window
function PromptEnhancerWindow() {
  return (
    <FloatingWindow 
      title="Prompt Enhancer Agent" 
      position={{ x: '0%', y: '0%' }}
      delay={0.4}
      icon={Sparkles}
      badge={{ text: 'Generating', type: 'generating' }}
      variant="enhancer"
    >
      <div className="pe-enhancer">
        <div className="pe-enhancer__section">
          <span className="pe-enhancer__label">Original Prompt</span>
          <div className="pe-enhancer__prompt pe-enhancer__prompt--old">
            You are a helpful assistant. Answer the user's question.
          </div>
        </div>
        <div className="pe-enhancer__arrow">
          <ArrowRight size={16} />
          <Sparkles size={12} className="pe-enhancer__sparkle" />
        </div>
        <div className="pe-enhancer__section">
          <span className="pe-enhancer__label">Enhanced Prompt</span>
          <div className="pe-enhancer__prompt pe-enhancer__prompt--new">
            <span className="pe-enhancer__typing">
              You are a helpful assistant with access to real-time tools. 
              <span className="pe-enhancer__highlight">Always use available tools</span> 
              before responding. For calculations, 
              <span className="pe-enhancer__highlight">provide precise values</span>...
            </span>
            <span className="pe-enhancer__cursor">|</span>
          </div>
        </div>
      </div>
    </FloatingWindow>
  )
}

// A/B Testing Window
function ABTestingWindow() {
  return (
    <FloatingWindow 
      title="A/B Testing" 
      position={{ x: '0%', y: '0%' }}
      delay={0.5}
      icon={GitCompare}
      badge={{ text: 'Running', type: 'running' }}
      variant="ab"
    >
      <div className="pe-ab-test">
        <div className="pe-ab-test__variants">
          <div className="pe-ab-test__variant pe-ab-test__variant--a">
            <div className="pe-ab-test__variant-header">
              <span className="pe-ab-test__variant-label">Variant A</span>
              <span className="pe-ab-test__variant-tag">Control</span>
            </div>
            <div className="pe-ab-test__variant-stats">
              <div className="pe-ab-test__metric">
                <span className="pe-ab-test__metric-value">72%</span>
                <span className="pe-ab-test__metric-label">Success</span>
              </div>
              <div className="pe-ab-test__bar pe-ab-test__bar--a" style={{ width: '72%' }}></div>
            </div>
          </div>
          <div className="pe-ab-test__vs">VS</div>
          <div className="pe-ab-test__variant pe-ab-test__variant--b">
            <div className="pe-ab-test__variant-header">
              <span className="pe-ab-test__variant-label">Variant B</span>
              <span className="pe-ab-test__variant-tag pe-ab-test__variant-tag--new">Enhanced</span>
            </div>
            <div className="pe-ab-test__variant-stats">
              <div className="pe-ab-test__metric">
                <span className="pe-ab-test__metric-value pe-ab-test__metric-value--winning">94%</span>
                <span className="pe-ab-test__metric-label">Success</span>
              </div>
              <div className="pe-ab-test__bar pe-ab-test__bar--b" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
        <div className="pe-ab-test__improvement">
          <TrendingUp size={14} />
          <span>+22% improvement with enhanced prompt</span>
        </div>
      </div>
    </FloatingWindow>
  )
}

// Human Review Window
function HumanReviewWindow() {
  return (
    <FloatingWindow 
      title="Human Review" 
      position={{ x: '0%', y: '0%' }}
      delay={0.6}
      icon={Users}
      badge={{ text: 'Action Required', type: 'action' }}
      variant="review"
    >
      <div className="pe-review">
        <div className="pe-review__header">
          <span>Review speculated classifications</span>
        </div>
        <div className="pe-review__items">
          {sampleResponses.filter(r => r.classification === 'bad').slice(0, 2).map((response, i) => (
            <div key={response.id} className="pe-review__item">
              <div className="pe-review__item-content">
                <div className="pe-review__item-query">
                  "{response.input}"
                </div>
                <div className="pe-review__item-reason">
                  <XCircle size={10} /> {response.reason}
                </div>
              </div>
              <div className="pe-review__item-actions">
                <button className="pe-review__btn pe-review__btn--approve">
                  <CheckCircle size={12} />
                </button>
                <button className="pe-review__btn pe-review__btn--edit">
                  <Edit3 size={12} />
                </button>
                <button className="pe-review__btn pe-review__btn--reject">
                  <XCircle size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="pe-review__trigger-btn">
          <Send size={12} />
          Trigger Enhancement
        </button>
      </div>
    </FloatingWindow>
  )
}

// Dashboard Analytics Window
function AnalyticsDashboardWindow() {
  return (
    <FloatingWindow 
      title="Analytics Dashboard" 
      position={{ x: '0%', y: '0%' }}
      delay={0.7}
      icon={BarChart3}
      variant="dashboard"
    >
      <div className="pe-dashboard">
        <div className="pe-dashboard__metrics">
          <div className="pe-dashboard__metric">
            <span className="pe-dashboard__metric-value">+31%</span>
            <span className="pe-dashboard__metric-label">Response Quality</span>
          </div>
          <div className="pe-dashboard__metric">
            <span className="pe-dashboard__metric-value">-45%</span>
            <span className="pe-dashboard__metric-label">Tool Failures</span>
          </div>
          <div className="pe-dashboard__metric">
            <span className="pe-dashboard__metric-value">+18%</span>
            <span className="pe-dashboard__metric-label">User Satisfaction</span>
          </div>
        </div>
        <div className="pe-dashboard__chart">
          <div className="pe-dashboard__chart-bars">
            {[40, 45, 38, 52, 48, 65, 72, 78, 85, 92].map((height, i) => (
              <motion.div 
                key={i}
                className="pe-dashboard__chart-bar"
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
              />
            ))}
          </div>
          <div className="pe-dashboard__chart-label">
            <span>Before</span>
            <span>After Enhancement</span>
          </div>
        </div>
      </div>
    </FloatingWindow>
  )
}

// Flow Step Component
function FlowStep({ number, title, description, isActive, icon: Icon }) {
  return (
    <motion.div 
      className={`pe-flow-step ${isActive ? 'pe-flow-step--active' : ''}`}
      variants={fadeInUp}
    >
      <div className="pe-flow-step__number">{number}</div>
      <div className="pe-flow-step__icon">
        <Icon size={20} />
      </div>
      <h4 className="pe-flow-step__title">{title}</h4>
      <p className="pe-flow-step__desc">{description}</p>
    </motion.div>
  )
}

// Main Component
export default function PromptEnhancement() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 6)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    { icon: Code, title: 'Decorate', description: 'Add @observe decorator with enhancement params' },
    { icon: Eye, title: 'Collect', description: 'Gather threshold traces automatically' },
    { icon: Brain, title: 'Classify', description: 'AI identifies SPECULATED BAD responses' },
    { icon: Sparkles, title: 'Enhance', description: 'Generate optimized prompts' },
    { icon: GitCompare, title: 'A/B Test', description: 'Compare prompt performance' },
    { icon: Users, title: 'Review', description: 'Human-in-loop validation' },
  ]

  return (
    <section className="pe-section" ref={sectionRef}>
      <div className="pe-section__bg">
        <div className="pe-section__grid"></div>
      </div>

      <div className="container">
        <motion.div 
          className="pe-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="pe-badges" variants={fadeInUp}>
            <span className="pe-badge pe-badge--enterprise">
              <Crown size={12} />
              Enterprise Plan
            </span>
            <span className="pe-badge pe-badge--coming">
              <Rocket size={12} />
              Coming Soon
            </span>
          </motion.div>

          <motion.h2 className="heading-lg pe-title" variants={fadeInUp}>
            Self-Healing Prompts
          </motion.h2>

          <motion.p className="text-lg pe-subtitle" variants={fadeInUp}>
            Automatically identify weak responses, enhance prompts with AI, and validate 
            improvements through A/B testing — all with human oversight.
          </motion.p>
        </motion.div>

        {/* Flow Steps */}
        <motion.div 
          className="pe-flow-steps"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {steps.map((step, i) => (
            <FlowStep 
              key={i}
              number={i + 1}
              title={step.title}
              description={step.description}
              icon={step.icon}
              isActive={i === activeStep}
            />
          ))}
        </motion.div>

        {/* Interactive Demo */}
        <div className="pe-demo">
          <div className="pe-demo__container">
            {/* Row 1: Code + Trace Collection */}
            <div className="pe-demo__row pe-demo__row--1">
              <DecoratorWindow />
              <div className="pe-demo__connector">
                <div className="pe-demo__connector-line"></div>
                <div className="pe-demo__connector-particle"></div>
              </div>
              <TraceCollectionWindow />
            </div>

            {/* Row 2: Classification + Enhancer */}
            <div className="pe-demo__row pe-demo__row--2">
              <ClassificationWindow />
              <div className="pe-demo__connector pe-demo__connector--vertical">
                <div className="pe-demo__connector-line"></div>
                <div className="pe-demo__connector-particle"></div>
              </div>
              <PromptEnhancerWindow />
            </div>

            {/* Row 3: A/B Testing + Human Review + Dashboard */}
            <div className="pe-demo__row pe-demo__row--3">
              <ABTestingWindow />
              <HumanReviewWindow />
              <AnalyticsDashboardWindow />
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          className="pe-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="pe-cta__text">
            Want to be notified when Self-Healing Prompts launches?
          </p>
          <button className="btn btn--primary pe-cta__btn">
            Join Waitlist <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

