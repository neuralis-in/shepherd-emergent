import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ArrowRight,
  Zap,
  Building2,
  Github,
  ExternalLink
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

const plans = [
  {
    name: 'Free',
    icon: <Zap size={24} />,
    price: '$0',
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
    ctaLink: 'https://github.com/neuralis-in/aiobs',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    icon: <Building2 size={24} />,
    price: 'Custom',
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

function PricingCard({ plan, onContactClick }) {
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
        <span className="pricing-card__amount">{plan.price}</span>
        <span className="pricing-card__period">/{plan.period}</span>
      </div>

      <ul className="pricing-card__features">
        {plan.features.map((feature, i) => (
          <li key={i} className="pricing-card__feature">
            <Check size={16} className="pricing-card__check" />
            <span>{feature}</span>
          </li>
        ))}
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

export default function Pricing() {
  const handleContactClick = () => {
    window.location.href = 'mailto:pranavchiku11@gmail.com?subject=Shepherd Enterprise Inquiry'
  }

  return (
    <div className="pricing-page">
      <PricingHeader />
      
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
          </div>
        </div>
      </footer>
    </div>
  )
}

