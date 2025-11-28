import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CreditCard,
  Check,
  Loader2,
  AlertCircle,
  Shield,
  Building2,
  User,
  Mail,
  Phone,
  Building,
  Lock,
  RefreshCw,
  ExternalLink,
  Github,
  AlertTriangle
} from 'lucide-react'
import api from '../api'
import './Enterprise.css'

// Razorpay Key - Replace with your key
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder'

// Simple hash/unhash for price (Base64 encoding)
// In production, use proper encryption with a secret key
function decodePrice(hashedPrice) {
  try {
    if (!hashedPrice) return null
    const decoded = atob(hashedPrice)
    const price = parseInt(decoded, 10)
    if (isNaN(price) || price <= 0) return null
    return price
  } catch {
    return null
  }
}

// Utility to format INR price
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount)
}

// Header Component
function EnterpriseHeader() {
  return (
    <header className="enterprise-header">
      <div className="container enterprise-header__container">
        <Link to="/" className="enterprise-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="enterprise-header__logo">
          <svg viewBox="0 0 32 32" className="enterprise-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="enterprise-header__nav">
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="enterprise-header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="enterprise-header__link">
            <Github size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

// Invalid Link Component
function InvalidLink() {
  return (
    <div className="enterprise-page">
      <EnterpriseHeader />
      <main className="enterprise-main">
        <div className="container">
          <motion.div 
            className="enterprise-invalid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="enterprise-invalid__icon">
              <AlertTriangle size={48} />
            </div>
            <h1>Invalid Payment Link</h1>
            <p>
              This payment link is invalid or has expired. Please contact our sales team 
              to get a new payment link.
            </p>
            <div className="enterprise-invalid__actions">
              <Link to="/pricing" className="btn btn--primary">
                View Pricing
              </Link>
              <a href="mailto:sales@shepherd.dev" className="btn btn--secondary">
                Contact Sales
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

// Payment Form Component
function PaymentForm({ clientId, price, onSuccess }) {
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })

  const handleBillingChange = (e) => {
    setBillingDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const isFormComplete = () => {
    return (
      billingDetails.name &&
      billingDetails.email &&
      billingDetails.phone
    )
  }

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
      } else {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isFormComplete()) {
      setError('Please complete all required fields')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Initialize Razorpay
      const res = await initializeRazorpay()
      if (!res) {
        throw new Error('Razorpay SDK failed to load')
      }

      // Create subscription order from backend
      const orderData = await api.createSubscriptionOrder({
        clientId: clientId,
        amount: price,
        billingDetails: billingDetails,
      })

      // Configure Razorpay options
      const options = {
        key: RAZORPAY_KEY_ID,
        subscription_id: orderData.subscription_id,
        name: 'Shepherd',
        description: 'Enterprise Plan - Monthly Subscription',
        image: '/shepherd.svg',
        handler: async function (response) {
          // Verify payment on backend
          try {
            await api.verifySubscription({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            })
            setSucceeded(true)
            if (onSuccess) onSuccess(response)
          } catch (err) {
            setError('Payment verification failed. Please contact support.')
            setProcessing(false)
          }
        },
        prefill: {
          name: billingDetails.name,
          email: billingDetails.email,
          contact: billingDetails.phone,
        },
        notes: {
          company: billingDetails.company,
          client_id: clientId,
        },
        theme: {
          color: '#111111',
          backdrop_color: 'rgba(0, 0, 0, 0.6)',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false)
          },
          confirm_close: true,
          escape: false,
        },
        recurring: true,
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment failed. Please try again.')
        setProcessing(false)
      })
      paymentObject.open()
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.')
      setProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <motion.div 
        className="payment-success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="payment-success__icon">
          <Check size={48} />
        </div>
        <h2>Subscription Activated!</h2>
        <p>Your enterprise plan is now active. Welcome to Shepherd!</p>
        <div className="payment-success__details">
          <div className="payment-success__detail">
            <span>Plan</span>
            <strong>Enterprise</strong>
          </div>
          <div className="payment-success__detail">
            <span>Amount</span>
            <strong>{formatINR(price)}/month</strong>
          </div>
          <div className="payment-success__detail">
            <span>Next billing</span>
            <strong>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</strong>
          </div>
        </div>
        <div className="payment-success__actions">
          <Link to="/api-keys" className="btn btn--primary">
            Get Your API Keys
          </Link>
          <Link to="/dashboard" className="btn btn--secondary">
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <form className="enterprise-form" onSubmit={handleSubmit}>
      <div className="enterprise-form__section">
        <h3>
          <User size={18} />
          Billing Information
        </h3>
        <div className="enterprise-form__fields">
          <div className="enterprise-form__field">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={billingDetails.name}
              onChange={handleBillingChange}
              placeholder="Rahul Sharma"
              required
            />
          </div>
          <div className="enterprise-form__field">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={billingDetails.email}
              onChange={handleBillingChange}
              placeholder="rahul@company.com"
              required
            />
          </div>
          <div className="enterprise-form__field">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={billingDetails.phone}
              onChange={handleBillingChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          <div className="enterprise-form__field">
            <label htmlFor="company">Company (Optional)</label>
            <input
              type="text"
              id="company"
              name="company"
              value={billingDetails.company}
              onChange={handleBillingChange}
              placeholder="Acme Technologies Pvt. Ltd."
            />
          </div>
        </div>
      </div>

      <div className="enterprise-form__section">
        <h3>
          <CreditCard size={18} />
          Payment Methods
        </h3>
        <div className="payment-methods">
          <div className="payment-method">
            <CreditCard size={20} />
            <span>Credit/Debit Card</span>
          </div>
          <div className="payment-method">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span>Net Banking</span>
          </div>
          <div className="payment-method">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zm-4.2-5.78v1.75l3.2-2.99-3.2-2.99v1.7c-3.18.13-4.55 1.93-5.8 3.88.88-1.35 2.27-2.46 5.8-2.35z"/>
            </svg>
            <span>UPI</span>
          </div>
          <div className="payment-method">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            <span>Wallets</span>
          </div>
        </div>
        <p className="payment-methods__note">
          You'll be redirected to Razorpay's secure checkout to complete payment
        </p>
      </div>

      {error && (
        <motion.div 
          className="enterprise-form__error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      <div className="enterprise-form__autopay">
        <RefreshCw size={18} />
        <div>
          <strong>Autopay Enabled</strong>
          <p>Your selected payment method will be charged {formatINR(price)} monthly. Cancel anytime.</p>
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn--primary btn--full enterprise-form__submit"
        disabled={processing || !isFormComplete()}
      >
        {processing ? (
          <>
            <Loader2 size={18} className="spinner" />
            Processing...
          </>
        ) : (
          <>
            <Lock size={16} />
            Subscribe — {formatINR(price)}/month
          </>
        )}
      </button>

      <div className="enterprise-form__security">
        <Shield size={14} />
        <span>Secured by Razorpay. Your payment info is encrypted & protected.</span>
      </div>
    </form>
  )
}

// Main Enterprise Page
export default function Enterprise() {
  const [searchParams] = useSearchParams()
  
  const clientId = searchParams.get('client_id')
  const hashedPrice = searchParams.get('price')
  
  const price = useMemo(() => decodePrice(hashedPrice), [hashedPrice])
  
  // Validate parameters
  if (!clientId || !price) {
    return <InvalidLink />
  }

  return (
    <div className="enterprise-page">
      <EnterpriseHeader />
      
      <main className="enterprise-main">
        <div className="container">
          <div className="enterprise-content">
            {/* Left Side - Plan Info */}
            <motion.div 
              className="enterprise-plan"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="enterprise-plan__icon">
                <Building2 size={32} />
              </div>
              <h1>Enterprise Plan</h1>
              <p className="enterprise-plan__subtitle">
                Scale your AI agent observability with powerful enterprise features.
              </p>
              
              <div className="enterprise-plan__price">
                <span className="enterprise-plan__amount">{formatINR(price)}</span>
                <span className="enterprise-plan__period">/month</span>
              </div>
              
              <ul className="enterprise-plan__features">
                <li><Check size={16} /> Unlimited traces</li>
                <li><Check size={16} /> Advanced analytics dashboard</li>
                <li><Check size={16} /> Unlimited data retention</li>
                <li><Check size={16} /> Unlimited projects & teams</li>
                <li><Check size={16} /> Priority support & SLA</li>
                <li><Check size={16} /> SSO & RBAC</li>
                <li><Check size={16} /> Custom integrations</li>
                <li><Check size={16} /> Dedicated success manager</li>
              </ul>
              
              <div className="enterprise-plan__client">
                <span>Client ID</span>
                <code>{clientId}</code>
              </div>
            </motion.div>

            {/* Right Side - Payment Form */}
            <motion.div 
              className="enterprise-payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2>Complete Your Subscription</h2>
              <p>Set up autopay to activate your enterprise plan immediately.</p>
              
              <PaymentForm 
                clientId={clientId} 
                price={price}
              />
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="enterprise-footer">
        <div className="container enterprise-footer__container">
          <span>© Shepherd, 2025</span>
          <div className="enterprise-footer__links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Export utility function to generate payment links
export function generatePaymentLink(clientId, priceINR) {
  const hashedPrice = btoa(priceINR.toString())
  const baseUrl = window.location.origin + import.meta.env.BASE_URL
  return `${baseUrl}enterprise?client_id=${encodeURIComponent(clientId)}&price=${encodeURIComponent(hashedPrice)}`
}

