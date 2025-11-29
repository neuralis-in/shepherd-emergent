import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ArrowRight,
  Zap,
  Building2,
  Github,
  ExternalLink,
  X,
  Calendar,
  User,
  Mail,
  Building,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  ChevronDown,
  Globe
} from 'lucide-react'
import './Pricing.css'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', region: 'US' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', region: 'EU' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', region: 'GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', region: 'IN' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', region: 'JP' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', region: 'AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', region: 'CA' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', region: 'SG' },
]

// Map country codes to currencies
const regionToCurrency = {
  US: 'USD', CA: 'CAD', MX: 'USD',
  GB: 'GBP', UK: 'GBP',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR', AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR',
  IN: 'INR',
  JP: 'JPY',
  AU: 'AUD', NZ: 'AUD',
  SG: 'SGD',
}

const plans = [
  {
    name: 'Free',
    icon: <Zap size={24} />,
    basePrice: 0,
    period: 'forever',
    description: 'Perfect for developers exploring AI agent observability.',
    features: [
      'Up to 10,000 traces/month',
      'Basic timeline view',
      '7-day data retention',
      'Single project',
      'Community support',
      'aiobs SDK access',
      'OpenAI & Gemini support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/api-keys',
    isInternal: true,
    highlighted: false,
  },
  {
    name: 'Enterprise',
    icon: <Building2 size={24} />,
    basePrice: null, // Custom pricing
    period: 'contact us',
    description: 'For teams shipping production AI agents at scale.',
    features: [
      'Unlimited traces',
      'Advanced analytics dashboard',
      'Unlimited data retention',
      'Unlimited projects & teams',
      'Priority support & SLA',
      'SSO & RBAC',
      'Custom integrations',
      'On-premise deployment',
      'Dedicated success manager',
      'PII detection & compliance',
      'Custom provider support',
      { text: 'Self-healing prompts', comingSoon: true },
    ],
    cta: 'Contact Sales',
    ctaAction: 'contact',
    highlighted: true,
  },
]

function PricingHeader() {
  return (
    <header className="pricing-header">
      <div className="container pricing-header__container">
        <Link to="/" className="pricing-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="pricing-header__logo">
          <svg viewBox="0 0 32 32" className="pricing-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="pricing-header__nav">
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="pricing-header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="pricing-header__link">
            <Github size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

function PricingCard({ plan, onContactClick, selectedCurrency }) {
  const currency = currencies.find(c => c.code === selectedCurrency) || currencies[0]
  
  const formatPrice = (basePrice) => {
    if (basePrice === null) return 'Custom'
    return `${currency.symbol}${basePrice}`
  }

  return (
    <motion.div 
      className={`pricing-card ${plan.highlighted ? 'pricing-card--highlighted' : ''}`}
      variants={fadeInUp}
    >
      {plan.highlighted && (
        <div className="pricing-card__badge">Most Popular</div>
      )}
      
      <div className="pricing-card__header">
        <div className={`pricing-card__icon ${plan.highlighted ? 'pricing-card__icon--highlighted' : ''}`}>
          {plan.icon}
        </div>
        <h3 className="pricing-card__name">{plan.name}</h3>
        <p className="pricing-card__description">{plan.description}</p>
      </div>

      <div className="pricing-card__price">
        <span className="pricing-card__amount">{formatPrice(plan.basePrice)}</span>
        <span className="pricing-card__period">/{plan.period}</span>
      </div>

      <ul className="pricing-card__features">
        {plan.features.map((feature, i) => {
          const isObject = typeof feature === 'object'
          const featureText = isObject ? feature.text : feature
          const isComingSoon = isObject && feature.comingSoon
          
          return (
            <li key={i} className="pricing-card__feature">
              <Check size={16} className="pricing-card__check" />
              <span>{featureText}</span>
              {isComingSoon && (
                <span className="pricing-card__coming-soon">Coming Soon</span>
              )}
            </li>
          )
        })}
      </ul>

      <div className="pricing-card__cta">
        {plan.ctaAction === 'contact' ? (
          <button 
            className={`btn ${plan.highlighted ? 'btn--primary' : 'btn--secondary'} btn--full`}
            onClick={onContactClick}
          >
            {plan.cta}
            <ArrowRight size={16} />
          </button>
        ) : plan.isInternal ? (
          <Link 
            to={plan.ctaLink}
            className={`btn ${plan.highlighted ? 'btn--primary' : 'btn--secondary'} btn--full`}
          >
            {plan.cta}
            <ArrowRight size={16} />
          </Link>
        ) : (
          <a 
            href={plan.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn ${plan.highlighted ? 'btn--primary' : 'btn--secondary'} btn--full`}
          >
            {plan.cta}
            <ArrowRight size={16} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

function BookDemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    // W3Forms access key - get yours at https://web3forms.com
    const WEB3FORMS_ACCESS_KEY = 'b5090d55-66a0-4e7d-959a-4f90c5eb722d'
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Shepherd Demo Request from ${formData.name} - ${formData.company}`,
          from_name: 'Shepherd Demo Form',
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message || 'No message provided'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setIsSubmitted(true)
      } else {
        console.error('W3Forms error:', result)
        setError(result.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError('Failed to send. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', company: '', message: '' })
    setIsSubmitted(false)
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="demo-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div 
            className="demo-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="demo-modal__close" onClick={handleClose}>
              <X size={20} />
            </button>

            <div className="demo-modal__header">
              <div className="demo-modal__icon">
                <Calendar size={24} />
              </div>
              <h2 className="demo-modal__title">Book a Demo</h2>
              <p className="demo-modal__subtitle">
                See how Shepherd can help you trace and debug your AI agents at scale.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div 
                className="demo-modal__success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="demo-modal__success-icon">
                  <Check size={32} />
                </div>
                <h3>Request Sent!</h3>
                <p>We'll be in touch within 24 hours to schedule your demo.</p>
                <button className="btn btn--primary" onClick={handleClose}>
                  Done
                </button>
              </motion.div>
            ) : (
              <form className="demo-modal__form" onSubmit={handleSubmit}>
                <div className="demo-modal__field">
                  <label htmlFor="name">
                    <User size={14} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="demo-modal__field">
                  <label htmlFor="email">
                    <Mail size={14} />
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="demo-modal__field">
                  <label htmlFor="company">
                    <Building size={14} />
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    required
                  />
                </div>

                <div className="demo-modal__field">
                  <label htmlFor="message">
                    <MessageSquare size={14} />
                    Tell us about your use case
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="We're building an AI agent for..."
                    rows={3}
                  />
                </div>

                {error && (
                  <div className="demo-modal__error">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn--primary btn--full demo-modal__submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="demo-modal__spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Request Demo
                    </>
                  )}
                </button>

                <p className="demo-modal__note">
                  We'll reach out within 24 hours to schedule a personalized demo.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FAQ() {
  const faqs = [
    {
      q: 'What counts as a trace?',
      a: 'A trace is a single recorded execution of your AI agent, including all LLM calls, tool invocations, and function calls within that run.'
    },
    {
      q: 'Can I self-host Shepherd?',
      a: 'Yes! The aiobs SDK is open-source. Enterprise customers can deploy Shepherd on their own infrastructure with our support.'
    },
    {
      q: 'What LLM providers are supported?',
      a: 'We currently support OpenAI and Google Gemini out of the box. Enterprise plans include custom provider support for any LLM.'
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. We never store your prompts or responses by default. Enterprise plans include PII detection, data encryption, and compliance certifications.'
    },
  ]

  return (
    <section className="pricing-faq">
      <h2 className="heading-md pricing-faq__title">Frequently Asked Questions</h2>
      <div className="pricing-faq__grid">
        {faqs.map((faq, i) => (
          <motion.div 
            key={i} 
            className="pricing-faq__item"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="pricing-faq__question">{faq.q}</h4>
            <p className="pricing-faq__answer">{faq.a}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CurrencySelector({ selectedCurrency, onCurrencyChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0]

  return (
    <motion.div 
      className="currency-selector"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="currency-selector__label">
        <Globe size={14} />
        <span>View prices in:</span>
      </div>
      
      <div className="currency-selector__dropdown-wrapper">
        <button 
          className="currency-selector__trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="currency-selector__flag">{currentCurrency.flag}</span>
          <span className="currency-selector__code">{currentCurrency.code}</span>
          <span className="currency-selector__symbol">({currentCurrency.symbol})</span>
          <ChevronDown size={14} className={`currency-selector__arrow ${isOpen ? 'open' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="currency-selector__dropdown"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              {currencies.map(c => (
                <button
                  key={c.code}
                  className={`currency-selector__option ${selectedCurrency === c.code ? 'active' : ''}`}
                  onClick={() => {
                    onCurrencyChange(c.code)
                    setIsOpen(false)
                  }}
                >
                  <span className="currency-selector__option-flag">{c.flag}</span>
                  <span className="currency-selector__option-code">{c.code}</span>
                  <span className="currency-selector__option-name">{c.name}</span>
                  <span className="currency-selector__option-symbol">{c.symbol}</span>
                  {selectedCurrency === c.code && (
                    <Check size={14} className="currency-selector__option-check" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Pricing() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  useEffect(() => {
    // Auto-detect user's region and set currency
    const detectRegion = async () => {
      try {
        // Try to get timezone-based country
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const timezoneToCountry = {
          'Asia/Kolkata': 'IN',
          'Asia/Calcutta': 'IN',
          'Europe/London': 'GB',
          'Europe/Paris': 'FR',
          'Europe/Berlin': 'DE',
          'Europe/Madrid': 'ES',
          'Europe/Rome': 'IT',
          'Europe/Amsterdam': 'NL',
          'Asia/Tokyo': 'JP',
          'Australia/Sydney': 'AU',
          'Australia/Melbourne': 'AU',
          'America/Toronto': 'CA',
          'America/Vancouver': 'CA',
          'Asia/Singapore': 'SG',
          'America/New_York': 'US',
          'America/Los_Angeles': 'US',
          'America/Chicago': 'US',
        }
        
        const country = timezoneToCountry[timezone]
        if (country && regionToCurrency[country]) {
          setSelectedCurrency(regionToCurrency[country])
        }
      } catch (error) {
        // Fallback to USD if detection fails
        console.warn('Could not detect region:', error)
      }
    }

    detectRegion()
  }, [])

  const handleContactClick = () => {
    setIsDemoModalOpen(true)
  }

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency)
  }

  return (
    <div className="pricing-page">
      <PricingHeader />
      <BookDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
      
      <main className="pricing-main">
        <div className="container">
          <motion.div 
            className="pricing-hero"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 className="heading-xl pricing-hero__title" variants={fadeInUp}>
              Simple, transparent pricing
            </motion.h1>
            <motion.p className="text-lg pricing-hero__subtitle" variants={fadeInUp}>
              Start free, scale when you need to. No hidden fees.
            </motion.p>
            
            <CurrencySelector
              selectedCurrency={selectedCurrency}
              onCurrencyChange={handleCurrencyChange}
            />
          </motion.div>

          <motion.div 
            className="pricing-cards"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {plans.map((plan, i) => (
              <PricingCard 
                key={i} 
                plan={plan} 
                onContactClick={handleContactClick}
                selectedCurrency={selectedCurrency}
              />
            ))}
          </motion.div>

          <FAQ />

          <motion.div 
            className="pricing-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-md">Ready to trace your agents?</h2>
            <p className="text-base">Get started with aiobs in minutes. No credit card required.</p>
            <div className="pricing-cta__buttons">
              <a 
                href="https://github.com/neuralis-in/aiobs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                <Github size={18} />
                Start with aiobs
              </a>
              <Link to="/dashboard" className="btn btn--secondary">
                View Demo Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="pricing-footer">
        <div className="container pricing-footer__container">
          <span>© Shepherd, 2025</span>
          <div className="pricing-footer__links">
            <Link to="/">Home</Link>
            <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer">Docs</a>
            <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer">GitHub</a>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

