import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  Database,
  Server,
  Code,
  Eye,
  Layers,
  Upload,
  BarChart3,
  Shield,
  Users,
  Clock,
  Zap,
  HardDrive,
  Lock,
  Box,
  GitBranch,
  Container,
  Github,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Brain,
  GitCompare,
  Crown,
  Rocket,
  Building2,
  Activity,
  Key,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  TrendingUp,
  Edit3,
  Send,
  Play
} from 'lucide-react'
import './IntraintelEnterprise.css'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

// Header Component
function IntraintelHeader() {
  return (
    <header className="intraintel-header">
      <div className="container intraintel-header__container">
        <Link to="/" className="intraintel-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="intraintel-header__logo">
          <svg viewBox="0 0 32 32" className="intraintel-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="intraintel-header__nav">
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="intraintel-header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="intraintel-header__link">
            <Github size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

// Thank You Hero Section
function ThankYouHero() {
  return (
    <section className="intraintel-hero">
      <div className="intraintel-hero__bg">
        <div className="intraintel-hero__gradient"></div>
        <div className="intraintel-hero__grid"></div>
      </div>
      <div className="container">
        <motion.div 
          className="intraintel-hero__content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="intraintel-hero__badge" variants={fadeInUp}>
            <span className="intraintel-hero__badge-dot"></span>
            Enterprise Partnership
          </motion.div>
          <motion.h1 className="intraintel-hero__title" variants={fadeInUp}>
            {/* Party Poppers */}
            <span className="intraintel-hero__party intraintel-hero__party--left">🎉</span>
            Thank you, <span className="intraintel-hero__highlight">Intraintel.ai</span>
            <span className="intraintel-hero__party intraintel-hero__party--right">🎊</span>
            
            {/* Confetti particles */}
            <span className="intraintel-hero__confetti">
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0s', '--x': '-60px', '--y': '-40px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.1s', '--x': '70px', '--y': '-50px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.2s', '--x': '-80px', '--y': '20px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.3s', '--x': '90px', '--y': '10px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.4s', '--x': '-40px', '--y': '-70px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.5s', '--x': '50px', '--y': '-60px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.6s', '--x': '-100px', '--y': '-20px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.7s', '--x': '100px', '--y': '-30px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.8s', '--x': '-30px', '--y': '40px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '0.9s', '--x': '40px', '--y': '50px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '1s', '--x': '-70px', '--y': '60px' }}></span>
              <span className="intraintel-hero__confetti-piece" style={{ '--delay': '1.1s', '--x': '80px', '--y': '40px' }}></span>
            </span>
          </motion.h1>
          <motion.p className="intraintel-hero__subtitle" variants={fadeInUp}>
            We're excited to partner with you on building robust AI agent observability. 
            This page outlines our proposed integration architecture and answers to your questions.
          </motion.p>
          <motion.div className="intraintel-hero__cta" variants={fadeInUp}>
            <a href="#questions" className="btn btn--primary">
              View Proposal <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Open Questions Section
function OpenQuestions() {
  return (
    <section className="intraintel-questions" id="questions">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="intraintel-section-header" variants={fadeInUp}>
            <span className="intraintel-section-badge">
              <MessageSquare size={14} />
              Open Questions
            </span>
            <h2 className="heading-lg">We'd love your input</h2>
            <p className="text-lg">
              To tailor the integration perfectly for your needs, we have a couple of questions:
            </p>
          </motion.div>

          <div className="intraintel-questions__grid">
            <motion.div 
              className="intraintel-question-card"
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="intraintel-question-card__number">1</div>
              <h3 className="intraintel-question-card__title">
                Additional LLM Providers
              </h3>
              <p className="intraintel-question-card__text">
                Apart from <strong>OpenAI</strong> and <strong>Gemini</strong>, are you planning to integrate any additional LLM providers?
              </p>
              <div className="intraintel-question-card__examples">
                <span className="intraintel-question-card__example">Anthropic Claude</span>
                <span className="intraintel-question-card__example">Llama</span>
                <span className="intraintel-question-card__example">Mistral</span>
                <span className="intraintel-question-card__example">Custom Models</span>
              </div>
              <div className="intraintel-question-card__note">
                <Zap size={14} />
                We can support custom providers via our BaseProvider interface
              </div>
            </motion.div>

            <motion.div 
              className="intraintel-question-card"
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="intraintel-question-card__number">2</div>
              <h3 className="intraintel-question-card__title">
                Specific APIs in Use
              </h3>
              <p className="intraintel-question-card__text">
                Within the existing providers, which specific APIs do you expect to use?
              </p>
              <div className="intraintel-question-card__code">
                <div className="intraintel-question-card__code-header">
                  <span>Example APIs</span>
                </div>
                <div className="intraintel-question-card__code-body">
                  <code>
                    <span className="code-provider">OpenAI</span>.<span className="code-api">chat.completions</span>{'\n'}
                    <span className="code-provider">OpenAI</span>.<span className="code-api">embeddings</span>{'\n'}
                    <span className="code-provider">Gemini</span>.<span className="code-api">model.generate_content</span>{'\n'}
                    <span className="code-provider">Gemini</span>.<span className="code-api">model.count_tokens</span>
                  </code>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// SDK Integration Flow - Same style as Integrations page
function SDKIntegrationFlow() {
  return (
    <section className="intraintel-sdk-flow">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="intraintel-section-header" variants={fadeInUp}>
            <span className="intraintel-section-badge">
              <Code size={14} />
              SDK Integration
            </span>
            <h2 className="heading-lg">On-Premise Deployment</h2>
            <p className="text-lg">
              The aiobs SDK captures traces from your agents and flushes them to your own GCS storage.
            </p>
          </motion.div>

          <motion.div 
            className="intraintel-integrations-flow"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="intraintel-integrations-flow__title">
              <GitBranch size={18} />
              Data Flow Pipeline
            </div>
            <div className="intraintel-flow-diagram">
              {/* Step 1: Your Agent */}
              <div className="intraintel-flow-diagram__step">
                <div className="intraintel-flow-diagram__node intraintel-flow-diagram__node--agent">
                  <Code size={24} />
                  <span>Your Agent</span>
                </div>
                <div className="intraintel-flow-diagram__label">observer.observe()</div>
              </div>

              {/* Arrow */}
              <div className="intraintel-flow-diagram__arrow">
                <ArrowRight size={20} />
              </div>

              {/* Step 2: aiobs SDK */}
              <div className="intraintel-flow-diagram__step">
                <div className="intraintel-flow-diagram__node intraintel-flow-diagram__node--aiobs">
                  <Layers size={24} />
                  <span>aiobs SDK</span>
                </div>
                <div className="intraintel-flow-diagram__label">Captures traces</div>
              </div>

              {/* Arrow */}
              <div className="intraintel-flow-diagram__arrow">
                <ArrowRight size={20} />
              </div>

              {/* Step 3: Flush */}
              <div className="intraintel-flow-diagram__step">
                <div className="intraintel-flow-diagram__node intraintel-flow-diagram__node--flush">
                  <Upload size={24} />
                  <span>.flush()</span>
                </div>
                <div className="intraintel-flow-diagram__label">Export data</div>
              </div>

              {/* Arrow */}
              <div className="intraintel-flow-diagram__arrow">
                <ArrowRight size={20} />
              </div>

              {/* Step 4: GCS Storage */}
              <div className="intraintel-flow-diagram__step">
                <div className="intraintel-flow-diagram__node intraintel-flow-diagram__node--storage">
                  <Cloud size={24} />
                  <span>GCS Storage</span>
                </div>
                <div className="intraintel-flow-diagram__label">
                  BigQuery, CloudSQL
                  <span className="intraintel-coming-badge">coming soon</span>
                </div>
              </div>

              {/* Arrow with Subscribe */}
              <div className="intraintel-flow-diagram__arrow intraintel-flow-diagram__arrow--subscribe">
                <RefreshCw size={16} />
                <span>Subscribe</span>
              </div>

              {/* Step 5: Dashboard */}
              <div className="intraintel-flow-diagram__step">
                <div className="intraintel-flow-diagram__node intraintel-flow-diagram__node--dashboard">
                  <BarChart3 size={24} />
                  <span>Dashboard</span>
                </div>
                <div className="intraintel-flow-diagram__label">Monitor & Analyze</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Dashboard Deployment Flow - Matching pe-window theme
function DashboardDeploymentFlow() {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 6)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="intraintel-deployment">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="intraintel-section-header" variants={fadeInUp}>
            <span className="intraintel-section-badge">
              <Container size={14} />
              Dashboard Deployment
            </span>
            <h2 className="heading-lg">On-Premise Dashboard</h2>
            <p className="text-lg">
              The Shepherd Dashboard runs entirely on your infrastructure via Cloud Run.
            </p>
          </motion.div>

          <motion.div 
            className="intraintel-pipeline"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Shepherd Side Window */}
            <div className="intraintel-pipeline__section">
              <div className="intraintel-pipeline__window">
                <div className="intraintel-pipeline__window-header">
                  <div className="intraintel-pipeline__window-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="intraintel-pipeline__window-title">
                    <Github size={12} />
                    Shepherd Side
                  </span>
                  <span className="intraintel-pipeline__window-badge">Source</span>
                </div>
                <div className="intraintel-pipeline__window-body">
                  <div className="intraintel-pipeline__steps">
                    {/* GitHub Repo */}
                    <div className={`intraintel-pipeline__step ${animationStep >= 0 ? 'intraintel-pipeline__step--active' : ''}`}>
                      <div className="intraintel-pipeline__step-icon intraintel-pipeline__step-icon--github">
                        <Github size={18} />
                      </div>
                      <div className="intraintel-pipeline__step-info">
                        <span className="intraintel-pipeline__step-title">Private Repository</span>
                        <span className="intraintel-pipeline__step-desc">shepherd/dashboard</span>
                      </div>
                      {animationStep === 0 && <div className="intraintel-pipeline__step-pulse"></div>}
                    </div>

                    {/* Arrow */}
                    <div className={`intraintel-pipeline__arrow ${animationStep >= 1 ? 'intraintel-pipeline__arrow--active' : ''}`}>
                      <div className="intraintel-pipeline__arrow-line">
                        <div className="intraintel-pipeline__arrow-particle"></div>
                      </div>
                      <span>git push</span>
                    </div>

                    {/* GitHub Action */}
                    <div className={`intraintel-pipeline__step ${animationStep >= 1 ? 'intraintel-pipeline__step--active' : ''}`}>
                      <div className="intraintel-pipeline__step-icon intraintel-pipeline__step-icon--action">
                        <Play size={18} />
                        {animationStep === 1 && <RefreshCw size={10} className="intraintel-pipeline__spinner" />}
                      </div>
                      <div className="intraintel-pipeline__step-info">
                        <span className="intraintel-pipeline__step-title">GitHub Action</span>
                        <span className="intraintel-pipeline__step-desc">
                          {animationStep === 1 ? 'Running...' : 'CI/CD Pipeline'}
                        </span>
                      </div>
                      {animationStep === 1 && (
                        <span className="intraintel-pipeline__status intraintel-pipeline__status--running">
                          <RefreshCw size={10} className="intraintel-pipeline__spinner" /> Running
                        </span>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className={`intraintel-pipeline__arrow ${animationStep >= 2 ? 'intraintel-pipeline__arrow--active' : ''}`}>
                      <div className="intraintel-pipeline__arrow-line">
                        <div className="intraintel-pipeline__arrow-particle"></div>
                      </div>
                      <span>build</span>
                    </div>

                    {/* Docker Image */}
                    <div className={`intraintel-pipeline__step ${animationStep >= 2 ? 'intraintel-pipeline__step--active' : ''}`}>
                      <div className="intraintel-pipeline__step-icon intraintel-pipeline__step-icon--docker">
                        <Box size={18} />
                      </div>
                      <div className="intraintel-pipeline__step-info">
                        <span className="intraintel-pipeline__step-title">Docker Image</span>
                        <span className="intraintel-pipeline__step-desc">
                          {animationStep === 2 ? 'Building...' : 'Container Ready'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Connector */}
            <div className={`intraintel-pipeline__connector ${animationStep >= 3 ? 'intraintel-pipeline__connector--active' : ''}`}>
              <div className="intraintel-pipeline__connector-line">
                <div className="intraintel-pipeline__connector-particle"></div>
              </div>
              <ArrowRight size={18} />
              <span className="intraintel-pipeline__connector-label">push image</span>
            </div>

            {/* Intraintel Side Window */}
            <div className="intraintel-pipeline__section intraintel-pipeline__section--highlighted">
              <div className="intraintel-pipeline__window intraintel-pipeline__window--intraintel">
                <div className="intraintel-pipeline__window-header">
                  <div className="intraintel-pipeline__window-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="intraintel-pipeline__window-title">
                    <Server size={12} />
                    Intraintel.ai Infrastructure
                  </span>
                  <span className="intraintel-pipeline__window-badge intraintel-pipeline__window-badge--live">Your Cloud</span>
                </div>
                <div className="intraintel-pipeline__window-body">
                  <div className="intraintel-pipeline__steps">
                    {/* Artifact Registry */}
                    <div className={`intraintel-pipeline__step ${animationStep >= 3 ? 'intraintel-pipeline__step--active' : ''}`}>
                      <div className="intraintel-pipeline__step-icon intraintel-pipeline__step-icon--registry">
                        <HardDrive size={18} />
                      </div>
                      <div className="intraintel-pipeline__step-info">
                        <span className="intraintel-pipeline__step-title">Artifact Registry</span>
                        <span className="intraintel-pipeline__step-desc">Your GCP Project</span>
                      </div>
                      {animationStep === 3 && (
                        <span className="intraintel-pipeline__status intraintel-pipeline__status--success">
                          <Check size={10} /> Pushed
                        </span>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className={`intraintel-pipeline__arrow ${animationStep >= 4 ? 'intraintel-pipeline__arrow--active' : ''}`}>
                      <div className="intraintel-pipeline__arrow-line">
                        <div className="intraintel-pipeline__arrow-particle"></div>
                      </div>
                      <span>deploy</span>
                    </div>

                    {/* Cloud Run */}
                    <div className={`intraintel-pipeline__step ${animationStep >= 4 ? 'intraintel-pipeline__step--active' : ''}`}>
                      <div className="intraintel-pipeline__step-icon intraintel-pipeline__step-icon--cloudrun">
                        <Cloud size={18} />
                      </div>
                      <div className="intraintel-pipeline__step-info">
                        <span className="intraintel-pipeline__step-title">Cloud Run</span>
                        <span className="intraintel-pipeline__step-desc">
                          {animationStep >= 4 ? 'dashboard.intraintel.ai' : 'Deploying...'}
                        </span>
                      </div>
                      {animationStep === 4 && (
                        <span className="intraintel-pipeline__status intraintel-pipeline__status--success">
                          <Check size={10} /> Live
                        </span>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="intraintel-pipeline__divider">
                      <span>Data Flow</span>
                    </div>

                    {/* Dashboard + GCS Row */}
                    <div className="intraintel-pipeline__data-row">
                      {/* Dashboard Preview */}
                      <div className={`intraintel-pipeline__step intraintel-pipeline__step--wide ${animationStep >= 5 ? 'intraintel-pipeline__step--active' : ''}`}>
                        <div className="intraintel-pipeline__dashboard">
                          <div className="intraintel-pipeline__dashboard-header">
                            <div className="intraintel-pipeline__dashboard-dots">
                              <span></span><span></span><span></span>
                            </div>
                            <span>dashboard.intraintel.ai</span>
                          </div>
                          <div className="intraintel-pipeline__dashboard-body">
                            <div className="intraintel-pipeline__dashboard-chart">
                              <BarChart3 size={14} />
                              <div className="intraintel-pipeline__dashboard-bars">
                                <div style={{ height: '50%' }}></div>
                                <div style={{ height: '75%' }}></div>
                                <div style={{ height: '40%' }}></div>
                                <div style={{ height: '90%' }}></div>
                                <div style={{ height: '65%' }}></div>
                              </div>
                            </div>
                            <div className="intraintel-pipeline__dashboard-stats">
                              <div className="intraintel-pipeline__dashboard-stat">
                                <span className="intraintel-pipeline__dashboard-stat-value">2.4k</span>
                                <span className="intraintel-pipeline__dashboard-stat-label">Traces</span>
                              </div>
                              <div className="intraintel-pipeline__dashboard-stat">
                                <span className="intraintel-pipeline__dashboard-stat-value">12ms</span>
                                <span className="intraintel-pipeline__dashboard-stat-label">Latency</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow from GCS to Dashboard */}
                      <div className={`intraintel-pipeline__horiz-arrow ${animationStep >= 5 ? 'intraintel-pipeline__horiz-arrow--active' : ''}`}>
                        <ArrowLeft size={14} />
                        <div className="intraintel-pipeline__horiz-arrow-line">
                          <div className="intraintel-pipeline__horiz-arrow-particle"></div>
                        </div>
                        <span>traces</span>
                      </div>

                      {/* GCS Bucket */}
                      <div className={`intraintel-pipeline__gcs-node ${animationStep >= 5 ? 'intraintel-pipeline__gcs-node--active' : ''}`}>
                        <div className="intraintel-pipeline__gcs-icon">
                          <Database size={20} />
                        </div>
                        <div className="intraintel-pipeline__gcs-info">
                          <span className="intraintel-pipeline__gcs-title">GCS Storage</span>
                          <span className="intraintel-pipeline__gcs-desc">Trace data bucket</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="intraintel-data-note"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Shield size={20} />
            <div>
              <strong>No data on Shepherd side.</strong>
              <p>Images run entirely on Intraintel servers. Complete data sovereignty.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Requirements Section
function RequirementsSection() {
  const requirements = [
    {
      icon: <Cloud size={24} />,
      title: "Cloud Run Service",
      description: "One Cloud Run service for the dashboard. GKE recommended if you anticipate scaling further.",
      tag: "Required"
    },
    {
      icon: <HardDrive size={24} />,
      title: "Artifact Registry Access",
      description: "Access to your Artifact Registry to push Docker images from our CI/CD pipeline.",
      tag: "Required"
    },
    {
      icon: <Key size={24} />,
      title: "Service Account",
      description: "SA (intraintel-shepherd-playground) with ONLY TWO permissions:",
      tag: "Required",
      permissions: [
        "Push access to Artifact Registry",
        "Deploy to Cloud Run"
      ]
    }
  ]

  return (
    <section className="intraintel-requirements">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="intraintel-section-header" variants={fadeInUp}>
            <span className="intraintel-section-badge">
              <Server size={14} />
              Infrastructure Requirements
            </span>
            <h2 className="heading-lg">What we need from you</h2>
            <p className="text-lg">
              Minimal setup required on your GCP project for the on-premise deployment.
            </p>
          </motion.div>

          <div className="intraintel-requirements__grid">
            {requirements.map((req, i) => (
              <motion.div 
                key={i}
                className="intraintel-requirement-card"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="intraintel-requirement-card__header">
                  <div className="intraintel-requirement-card__icon">
                    {req.icon}
                  </div>
                  <span className="intraintel-requirement-card__tag">{req.tag}</span>
                </div>
                <h3 className="intraintel-requirement-card__title">{req.title}</h3>
                <p className="intraintel-requirement-card__desc">{req.description}</p>
                {req.permissions && (
                  <ul className="intraintel-requirement-card__permissions">
                    {req.permissions.map((perm, j) => (
                      <li key={j}>
                        <Check size={14} />
                        {perm}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Self-Healing Prompts Teaser
function SelfHealingPromptsTeaser() {
  const steps = [
    { icon: Code, title: 'Decorate', description: 'Add @observe decorator with enhancement params' },
    { icon: Eye, title: 'Collect', description: 'Gather threshold traces automatically' },
    { icon: Brain, title: 'Classify', description: 'AI identifies SPECULATED BAD responses' },
    { icon: Sparkles, title: 'Enhance', description: 'Generate optimized prompts' },
    { icon: GitCompare, title: 'A/B Test', description: 'Compare prompt performance' },
    { icon: Users, title: 'Review', description: 'Human-in-loop validation' },
  ]

  return (
    <section className="intraintel-healing">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="intraintel-section-header" variants={fadeInUp}>
            <div className="intraintel-healing__badges">
              <span className="intraintel-section-badge intraintel-section-badge--enterprise">
                <Crown size={14} />
                Enterprise Plan
              </span>
              <span className="intraintel-section-badge intraintel-section-badge--coming">
                <Rocket size={14} />
                Rolling Out Soon
              </span>
            </div>
            <h2 className="heading-lg">Self-Healing Prompts</h2>
            <p className="text-lg">
              Automatically identify weak responses, enhance prompts with AI, and validate 
              improvements through A/B testing — all with human oversight.
            </p>
          </motion.div>

          <motion.div 
            className="intraintel-healing__flow"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                className="intraintel-healing__step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="intraintel-healing__step-number">{i + 1}</div>
                <div className="intraintel-healing__step-icon">
                  <step.icon size={20} />
                </div>
                <h4 className="intraintel-healing__step-title">{step.title}</h4>
                <p className="intraintel-healing__step-desc">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Demo Preview */}
          <motion.div 
            className="intraintel-healing__demo"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="intraintel-healing__demo-window">
              <div className="intraintel-healing__demo-header">
                <div className="intraintel-healing__demo-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="intraintel-healing__demo-title">Prompt Enhancement Dashboard</span>
                <span className="intraintel-healing__demo-badge">Preview</span>
              </div>
              <div className="intraintel-healing__demo-content">
                <div className="intraintel-healing__demo-section">
                  <div className="intraintel-healing__demo-label">Original Prompt</div>
                  <div className="intraintel-healing__demo-prompt intraintel-healing__demo-prompt--old">
                    You are a helpful assistant. Answer the user's question.
                  </div>
                </div>
                <div className="intraintel-healing__demo-arrow">
                  <ArrowRight size={20} />
                  <Sparkles size={14} className="intraintel-healing__sparkle" />
                </div>
                <div className="intraintel-healing__demo-section">
                  <div className="intraintel-healing__demo-label">Enhanced Prompt</div>
                  <div className="intraintel-healing__demo-prompt intraintel-healing__demo-prompt--new">
                    You are a helpful assistant with access to real-time tools. 
                    <span className="intraintel-healing__highlight">Always use available tools</span> before responding. 
                    For calculations, <span className="intraintel-healing__highlight">provide precise values</span>...
                  </div>
                </div>
              </div>
              <div className="intraintel-healing__demo-stats">
                <div className="intraintel-healing__demo-stat">
                  <TrendingUp size={16} />
                  <span>+22% improvement</span>
                </div>
                <div className="intraintel-healing__demo-stat">
                  <CheckCircle size={16} />
                  <span>94% success rate</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Enterprise Features Section
function EnterpriseFeatures() {
  const features = [
    {
      icon: <Server size={20} />,
      title: "Fully on-premise deployment",
      description: "Your Cloud Runs, your GKE cluster, your network"
    },
    {
      icon: <Activity size={20} />,
      title: "Unlimited traces",
      description: "Pay-as-you-go plan with 10,000 + 2,000 free traces, then $10 per additional 2,000 traces"
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Advanced analytics dashboard",
      description: "Deep session, token, cost, and latency insights"
    },
    {
      icon: <Database size={20} />,
      title: "Unlimited data retention",
      description: "Stored entirely within your servers"
    },
    {
      icon: <Users size={20} />,
      title: "Unlimited projects and team workspaces",
      description: "Scale your organization without limits"
    },
    {
      icon: <Clock size={20} />,
      title: "Priority support with SLAs",
      description: "Dedicated support channel with guaranteed response times"
    },
    {
      icon: <Lock size={20} />,
      title: "Enterprise SSO, RBAC, and audit logs",
      description: "Complete security and compliance features"
    },
    {
      icon: <GitBranch size={20} />,
      title: "Custom integrations",
      description: "Tailored to your internal systems"
    },
    {
      icon: <Zap size={20} />,
      title: "Custom provider support",
      description: "Anthropic, Llama, internal models, or any private endpoints"
    }
  ]

  return (
    <section className="intraintel-features">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="intraintel-section-header" variants={fadeInUp}>
            <span className="intraintel-section-badge">
              <Building2 size={14} />
              Enterprise Plan
            </span>
            <h2 className="heading-lg">Everything you need</h2>
            <p className="text-lg">
              Comprehensive enterprise features for your AI observability needs.
            </p>
          </motion.div>

          <div className="intraintel-features__grid">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                className="intraintel-feature-card"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="intraintel-feature-card__icon">
                  {feature.icon}
                </div>
                <div className="intraintel-feature-card__content">
                  <h4 className="intraintel-feature-card__title">{feature.title}</h4>
                  <p className="intraintel-feature-card__desc">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Pricing & What's Next Section (Side by Side)
function PricingAndNextSteps() {
  const steps = [
    {
      number: 1,
      title: "Setup Contract",
      description: "Have contract signed by both parties"
    },
    {
      number: 2,
      title: "Onboarding Call",
      description: "Setup call with developers to show how to use it"
    },
    {
      number: 3,
      title: "Dashboard Setup",
      description: "Setup dashboard for Intraintel.ai"
    }
  ]

  return (
    <section className="intraintel-pricing-next">
      <div className="container">
        <motion.div
          className="intraintel-pricing-next__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Enterprise Plan Card */}
          <motion.div 
            className="intraintel-pricing__card"
            variants={scaleIn}
          >
            <div className="intraintel-pricing__header">
              <div className="intraintel-pricing__icon">
                <Building2 size={32} />
              </div>
              <h3 className="intraintel-pricing__title">Enterprise Plan</h3>
              <p className="intraintel-pricing__subtitle">For Intraintel.ai</p>
            </div>

            <div className="intraintel-pricing__price">
              <span className="intraintel-pricing__amount">$30</span>
              <span className="intraintel-pricing__period">/month</span>
            </div>

            <div className="intraintel-pricing__usage">
              <div className="intraintel-pricing__usage-header">
                <Activity size={16} />
                <span>Pay-as-you-go Usage</span>
              </div>
              <ul className="intraintel-pricing__usage-list">
                <li>
                  <Check size={16} />
                  <span><strong>10,000 + 2,000</strong> free traces included</span>
                </li>
                <li>
                  <Check size={16} />
                  <span><strong>$10</strong> per additional 2,000 traces</span>
                </li>
              </ul>
            </div>

            <div className="intraintel-pricing__includes">
              <span className="intraintel-pricing__includes-title">All enterprise features included:</span>
              <div className="intraintel-pricing__includes-grid">
                <span><Check size={12} /> On-premise deployment</span>
                <span><Check size={12} /> Unlimited retention</span>
                <span><Check size={12} /> Priority support</span>
                <span><Check size={12} /> SSO & RBAC</span>
                <span><Check size={12} /> Custom integrations</span>
                <span><Check size={12} /> Audit logs</span>
              </div>
            </div>

          </motion.div>

          {/* What's Next Card */}
          <motion.div 
            className="intraintel-whats-next__card"
            variants={scaleIn}
          >
            <div className="intraintel-whats-next__header">
              <h3 className="intraintel-whats-next__heading">What's Next</h3>
              <p className="intraintel-whats-next__subheading">Next steps to get you started</p>
            </div>

            <div className="intraintel-whats-next__steps">
              {steps.map((step, index) => (
                <div key={step.number} className="intraintel-whats-next__step">
                  <div className="intraintel-whats-next__number">{step.number}</div>
                  <div className="intraintel-whats-next__content">
                    <h4 className="intraintel-whats-next__title">{step.title}</h4>
                    <p className="intraintel-whats-next__desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function IntraintelFooter() {
  return (
    <footer className="intraintel-footer">
      <div className="container intraintel-footer__container">
        <span>© Shepherd, 2025</span>
        <div className="intraintel-footer__links">
          <Link to="/">Home</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/integrations">Integrations</Link>
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer">Docs</a>
        </div>
      </div>
    </footer>
  )
}

// Main Component
export default function IntraintelEnterprise() {
  return (
    <div className="intraintel-page">
      <IntraintelHeader />
      <main>
        <ThankYouHero />
        <OpenQuestions />
        <SDKIntegrationFlow />
        <DashboardDeploymentFlow />
        <RequirementsSection />
        <SelfHealingPromptsTeaser />
        <EnterpriseFeatures />
        <PricingAndNextSteps />
      </main>
      <IntraintelFooter />
    </div>
  )
}

