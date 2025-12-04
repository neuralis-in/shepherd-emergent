import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Github,
  FileText,
  Calendar,
  Activity,
  Headphones,
  FileSearch,
  Sparkles,
  Share2,
  Building2,
  Pen,
  Download,
  CheckCircle,
  Clock,
  Shield,
  Loader2,
  PartyPopper,
  X
} from 'lucide-react'
import './PilotAgreement.css'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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

// Header Component
function PilotHeader() {
  return (
    <header className="pilot-header">
      <div className="container pilot-header__container">
        <Link to="/" className="pilot-header__back">
          <ArrowLeft size={18} />
        </Link>
        <Link to="/" className="pilot-header__logo">
          <svg viewBox="0 0 32 32" className="pilot-header__logo-icon">
            <rect width="32" height="32" rx="6" fill="#111"/>
            <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
          </svg>
          <span>Shepherd</span>
        </Link>
        <nav className="pilot-header__nav">
          <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer" className="pilot-header__link">
            Docs <ExternalLink size={12} />
          </a>
          <a href="https://github.com/neuralis-in/aiobs" target="_blank" rel="noopener noreferrer" className="pilot-header__link">
            <Github size={16} />
          </a>
        </nav>
      </div>
    </header>
  )
}

// Signature Canvas Component
function SignatureCanvas({ onSignatureChange, disabled }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e) => {
    if (disabled) return
    e.preventDefault()
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing || disabled) return
    e.preventDefault()
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
    onSignatureChange(canvasRef.current.toDataURL())
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onSignatureChange(null)
  }

  return (
    <div className="signature-canvas-container">
      <canvas
        ref={canvasRef}
        width={500}
        height={150}
        className={`signature-canvas ${disabled ? 'signature-canvas--disabled' : ''}`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {!disabled && (
        <div className="signature-canvas__actions">
          {hasSignature && (
            <button type="button" className="signature-canvas__clear" onClick={clearSignature}>
              Clear
            </button>
          )}
          <span className="signature-canvas__hint">
            <Pen size={12} />
            Draw your signature above
          </span>
        </div>
      )}
    </div>
  )
}

// Success Modal
function SuccessModal({ isOpen, onClose, enterpriseName }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="pilot-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="pilot-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="pilot-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className="pilot-modal__content">
            <div className="pilot-modal__icon">
              <PartyPopper size={48} />
            </div>
            <h2>🎉 Agreement Signed!</h2>
            <p>
              Thank you, <strong>{enterpriseName}</strong>! Your Pilot Program agreement 
              has been successfully signed. Our team will reach out shortly to get you started.
            </p>
            <div className="pilot-modal__details">
              <div className="pilot-modal__detail">
                <Calendar size={16} />
                <span>Program starts within 24-48 hours</span>
              </div>
              <div className="pilot-modal__detail">
                <Headphones size={16} />
                <span>Priority support activated</span>
              </div>
            </div>
            <div className="pilot-modal__actions">
              <Link to="/api-keys" className="btn btn--primary">
                Get Your API Keys
              </Link>
              <Link to="/" className="btn btn--secondary">
                Return Home
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Confetti Celebration Component
function ConfettiCelebration() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Hide confetti after animation completes
    const timer = setTimeout(() => setShow(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  // Generate confetti pieces
  const confettiPieces = []
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA']
  
  // Left side confetti
  for (let i = 0; i < 30; i++) {
    confettiPieces.push({
      id: `left-${i}`,
      side: 'left',
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1,
      size: 8 + Math.random() * 8,
      endX: 100 + Math.random() * 400,
      endY: Math.random() * 600 - 100,
      rotation: Math.random() * 720
    })
  }
  
  // Right side confetti
  for (let i = 0; i < 30; i++) {
    confettiPieces.push({
      id: `right-${i}`,
      side: 'right',
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1,
      size: 8 + Math.random() * 8,
      endX: -(100 + Math.random() * 400),
      endY: Math.random() * 600 - 100,
      rotation: Math.random() * 720
    })
  }
  
  // Top confetti
  for (let i = 0; i < 20; i++) {
    confettiPieces.push({
      id: `top-${i}`,
      side: 'top',
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 1,
      size: 8 + Math.random() * 8,
      endX: (Math.random() - 0.5) * 800,
      endY: 300 + Math.random() * 400,
      rotation: Math.random() * 720
    })
  }

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-piece--${piece.side}`}
          style={{
            '--color': piece.color,
            '--delay': `${piece.delay}s`,
            '--duration': `${piece.duration}s`,
            '--size': `${piece.size}px`,
            '--end-x': `${piece.endX}px`,
            '--end-y': `${piece.endY}px`,
            '--rotation': `${piece.rotation}deg`,
            '--start-x': piece.side === 'top' ? `${(Math.random() - 0.5) * 100}vw` : '0px'
          }}
        />
      ))}
      {/* Party Popper Emojis */}
      <div className="party-popper party-popper--left">🎉</div>
      <div className="party-popper party-popper--right">🎊</div>
      <div className="party-popper party-popper--top-left">🎉</div>
      <div className="party-popper party-popper--top-right">🎊</div>
    </div>
  )
}

// Main Component
export default function PilotAgreement() {
  const { enterpriseName } = useParams()
  const [signature, setSignature] = useState(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [signerName, setSignerName] = useState('')
  const [signerTitle, setSignerTitle] = useState('')
  const [signerEmail, setSignerEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Format enterprise name for display (replace dashes/underscores with spaces, capitalize)
  const displayName = enterpriseName
    ? enterpriseName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Enterprise Partner'

  // Calculate dates
  const today = new Date()
  const endDate = new Date(today)
  endDate.setMonth(endDate.getMonth() + 1)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isFormValid = signature && agreedToTerms && signerName && signerEmail

  // Generate PDF with contract content
  const generatePDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - (margin * 2)
    let y = margin

    // Helper function to add text with word wrap
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0], indent = 0) => {
      pdf.setFontSize(fontSize)
      pdf.setTextColor(...color)
      if (isBold) {
        pdf.setFont('helvetica', 'bold')
      } else {
        pdf.setFont('helvetica', 'normal')
      }
      const textWidth = contentWidth - indent
      const lines = pdf.splitTextToSize(text, textWidth)
      
      // Check if we need a new page
      const lineHeight = fontSize * 0.4
      if (y + (lines.length * lineHeight) > 280) {
        pdf.addPage()
        y = margin
      }
      
      pdf.text(lines, margin + indent, y)
      y += lines.length * lineHeight + 1
    }

    // Helper for bullet points
    const addBullet = (title, description, color = [60, 60, 60]) => {
      pdf.setFontSize(10)
      pdf.setTextColor(...color)
      pdf.setFont('helvetica', 'bold')
      
      // Add bullet point
      pdf.text('-', margin, y)
      
      // Add title
      pdf.text(title, margin + 5, y)
      const titleWidth = pdf.getTextWidth(title)
      
      // Add description
      pdf.setFont('helvetica', 'normal')
      const descText = ' - ' + description
      const remainingWidth = contentWidth - 5 - titleWidth
      
      if (pdf.getTextWidth(descText) <= remainingWidth) {
        // Fits on same line
        pdf.text(descText, margin + 5 + titleWidth, y)
        y += 5
      } else {
        // Need to wrap
        y += 4
        const lines = pdf.splitTextToSize(description, contentWidth - 8)
        pdf.text(lines, margin + 8, y)
        y += lines.length * 4 + 1
      }
    }

    const addSpace = (space = 4) => {
      y += space
      if (y > 280) {
        pdf.addPage()
        y = margin
      }
    }

    // Header
    pdf.setFillColor(17, 17, 17)
    pdf.rect(0, 0, pageWidth, 35, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Shepherd Pilot Program', margin, 15)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Service Agreement', margin, 23)
    
    // Dates on right side
    pdf.setFontSize(8)
    pdf.text(`Effective: ${formatDate(today)}`, pageWidth - margin - 45, 15)
    pdf.text(`End: ${formatDate(endDate)}`, pageWidth - margin - 45, 22)
    
    y = 45

    // Section 1: Parties
    addText('1. Parties', 12, true)
    addSpace(2)
    addText('This Pilot Program Agreement ("Agreement") is entered into between:', 9, false, [60, 60, 60])
    addSpace(2)
    addText('- Shepherd ("Provider")', 9, false, [60, 60, 60], 3)
    addText('- ' + displayName + ' ("Client")', 9, false, [60, 60, 60], 3)
    addSpace(6)

    // Section 2: Program Overview
    addText('2. Program Overview', 12, true)
    addSpace(2)
    addText('The Provider agrees to grant the Client access to Shepherd\'s AI Agent Observability Platform for a period of one (1) month under the following terms and conditions.', 9, false, [60, 60, 60])
    addSpace(6)

    // Section 3: Benefits
    addText('3. Pilot Program Benefits', 12, true)
    addSpace(2)
    addText('During the pilot period, the Client shall receive:', 9, false, [60, 60, 60])
    addSpace(3)
    
    addBullet('10,000 + 2,000 Free Traces', 'Full access to trace and monitor AI agent executions with 12,000 complimentary traces to evaluate the platform capabilities.')
    addSpace(1)
    addBullet('Priority Support', 'Dedicated support channel with guaranteed response times. Direct access to our engineering team for technical assistance.')
    addSpace(1)
    addBullet('Audit Logs', 'Complete audit trail of all platform activities, user actions, and data access for compliance and security requirements.')
    addSpace(1)
    addBullet('Early Access: Self-Healing Prompts', 'Exclusive early access to our upcoming feature that automatically identifies weak responses, enhances prompts with AI, and validates improvements through A/B testing.')
    addSpace(6)

    // Section 4: Marketing Rights
    addText('4. Marketing & Publicity Rights', 12, true)
    addSpace(2)
    addText('By signing this Agreement, the Client formally grants Shepherd the right to:', 9, false, [60, 60, 60])
    addSpace(3)
    addBullet('Website Feature', 'Feature the Client\'s company name and logo on the Shepherd website.')
    addSpace(1)
    addBullet('Marketing Materials', 'Share case studies and success metrics on social media, press releases, and other marketing materials.')
    addSpace(6)

    // Section 5: Duration
    addText('5. Duration & Termination', 12, true)
    addSpace(2)
    addText('This pilot program shall commence on the Effective Date and continue for a period of one (1) month. Either party may terminate this Agreement with 7 days written notice. Upon termination, Client\'s access to the platform will be revoked.', 9, false, [60, 60, 60])
    addSpace(6)

    // Section 6: Confidentiality
    addText('6. Confidentiality', 12, true)
    addSpace(2)
    addText('Both parties agree to maintain the confidentiality of any proprietary information shared during the pilot program. This includes but is not limited to technical specifications, business strategies, and trace data.', 9, false, [60, 60, 60])
    addSpace(6)

    // Section 7: Data Handling
    addText('7. Data Handling', 12, true)
    addSpace(2)
    addText('The Provider shall handle all Client data in accordance with industry-standard security practices. Trace data remains the property of the Client and will be stored securely in the Client\'s designated cloud infrastructure when using on-premise deployment options.', 9, false, [60, 60, 60])
    addSpace(6)

    // Section 8: Signature
    addText('8. Signature', 12, true)
    addSpace(2)
    addText('By signing below, the Client agrees to the terms and conditions outlined in this Pilot Program Agreement.', 9, false, [60, 60, 60])
    addSpace(8)

    // Signature details box
    pdf.setDrawColor(200, 200, 200)
    pdf.setFillColor(250, 250, 250)
    pdf.roundedRect(margin, y, contentWidth, 45, 2, 2, 'FD')
    y += 6
    
    pdf.setFontSize(9)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Signatory Information', margin + 5, y)
    y += 6
    
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 60)
    pdf.text(`Name: ${signerName}`, margin + 5, y)
    y += 5
    if (signerTitle) {
      pdf.text(`Title: ${signerTitle}`, margin + 5, y)
      y += 5
    }
    pdf.text(`Email: ${signerEmail}`, margin + 5, y)
    y += 5
    pdf.text(`Date Signed: ${new Date().toLocaleString()}`, margin + 5, y)
    y += 5
    pdf.text(`On behalf of: ${displayName}`, margin + 5, y)
    
    y += 15

    // Add signature image
    if (signature) {
      // Check if we need a new page for the signature
      if (y + 35 > 280) {
        pdf.addPage()
        y = margin
      }
      
      pdf.setFontSize(9)
      pdf.setTextColor(0, 0, 0)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Digital Signature:', margin, y)
      y += 5
      
      try {
        pdf.addImage(signature, 'PNG', margin, y, 60, 20)
        y += 25
      } catch (e) {
        console.log('Could not add signature image to PDF')
      }
    }

    // Footer
    y = 285
    pdf.setFontSize(7)
    pdf.setTextColor(150, 150, 150)
    pdf.text('This document was digitally signed through Shepherd\'s Pilot Program Agreement Portal.', margin, y)
    pdf.text('Document ID: ' + Date.now().toString(36).toUpperCase(), pageWidth - margin - 35, y)

    // Generate filename and download
    const safeEnterpriseName = enterpriseName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const dateStr = new Date().toISOString().split('T')[0]
    const filename = `shepherd-pilot-agreement-${safeEnterpriseName}-${dateStr}.pdf`

    pdf.save(filename)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)

    try {
      // Generate and download PDF
      await generatePDF()

      // Send email notification
      await sendEmailNotification()

      setShowSuccess(true)
    } catch (error) {
      console.error('Error:', error)
      // Still show success if PDF was generated (email failure shouldn't block)
      setShowSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Send email notification when agreement is signed
  const sendEmailNotification = async () => {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'b5090d55-66a0-4e7d-959a-4f90c5eb722d',
          to: 'pranavchiku11@gmail.com',
          subject: `🎉 Pilot Agreement Signed - ${displayName}`,
          from_name: 'Shepherd Pilot Program',
          replyto: signerEmail,
          message: `
New Pilot Program Agreement Signed!

Enterprise: ${displayName}
Signed by: ${signerName}${signerTitle ? ` (${signerTitle})` : ''}
Email: ${signerEmail}
Date: ${new Date().toLocaleString()}

Program Details:
- Duration: 1 month
- Start Date: ${formatDate(today)}
- End Date: ${formatDate(endDate)}

Benefits Included:
✓ 10,000 + 2,000 Free Traces
✓ Priority Support
✓ Audit Logs
✓ Early Access to Self-Healing Prompts

Marketing Rights Granted:
✓ Feature company name/logo on Shepherd website
✓ Share case studies on social media & marketing materials

---
This agreement was signed through Shepherd's Pilot Program Portal.
          `.trim(),
        }),
      })

      const data = await response.json()
      if (!data.success) {
        console.error('Email notification failed:', data.message)
      }
    } catch (error) {
      console.error('Failed to send email notification:', error)
    }
  }

  return (
    <div className="pilot-page">
      <ConfettiCelebration />
      <PilotHeader />

      <main className="pilot-main">
        <div className="container">
          <motion.div
            className="pilot-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Header Section */}
            <motion.div className="pilot-hero" variants={fadeInUp}>
              <div className="pilot-hero__badge">
                <FileText size={14} />
                Pilot Program Agreement
              </div>
              <h1 className="pilot-hero__title">
                🎊 Congratulations, <span className="pilot-hero__highlight">{displayName}</span>!
              </h1>
              <p className="pilot-hero__subtitle">
                You've been selected for Shepherd's exclusive 1-Month Pilot Program. 
                Please review and sign the agreement below to get started.
              </p>
            </motion.div>

            {/* Contract Document */}
            <motion.div className="pilot-contract" variants={scaleIn}>
              <div className="pilot-contract__header">
                <div className="pilot-contract__header-left">
                  <svg viewBox="0 0 32 32" className="pilot-contract__logo">
                    <rect width="32" height="32" rx="6" fill="#111"/>
                    <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <div>
                    <h2>Shepherd Pilot Program</h2>
                    <span>Service Agreement</span>
                  </div>
                </div>
                <div className="pilot-contract__dates">
                  <div className="pilot-contract__date">
                    <span>Effective Date</span>
                    <strong>{formatDate(today)}</strong>
                  </div>
                  <div className="pilot-contract__date">
                    <span>End Date</span>
                    <strong>{formatDate(endDate)}</strong>
                  </div>
                </div>
              </div>

              <div className="pilot-contract__body">
                {/* Parties Section */}
                <section className="pilot-contract__section">
                  <h3>1. Parties</h3>
                  <p>
                    This Pilot Program Agreement ("Agreement") is entered into between:
                  </p>
                  <div className="pilot-contract__parties">
                    <div className="pilot-contract__party">
                      <Building2 size={16} />
                      <div>
                        <strong>Shepherd</strong>
                        <span>("Provider")</span>
                      </div>
                    </div>
                    <div className="pilot-contract__party-divider">and</div>
                    <div className="pilot-contract__party">
                      <Building2 size={16} />
                      <div>
                        <strong>{displayName}</strong>
                        <span>("Client")</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Program Overview */}
                <section className="pilot-contract__section">
                  <h3>2. Program Overview</h3>
                  <p>
                    The Provider agrees to grant the Client access to Shepherd's AI Agent 
                    Observability Platform for a period of <strong>one (1) month</strong> under 
                    the following terms and conditions.
                  </p>
                </section>

                {/* What's Included */}
                <section className="pilot-contract__section">
                  <h3>3. Pilot Program Benefits</h3>
                  <p>During the pilot period, the Client shall receive:</p>
                  
                  <div className="pilot-contract__benefits">
                    <div className="pilot-contract__benefit">
                      <div className="pilot-contract__benefit-icon">
                        <Activity size={20} />
                      </div>
                      <div className="pilot-contract__benefit-content">
                        <h4>10,000 + 2,000 Free Traces</h4>
                        <p>
                          Full access to trace and monitor AI agent executions with 12,000 
                          complimentary traces to evaluate the platform capabilities.
                        </p>
                      </div>
                    </div>

                    <div className="pilot-contract__benefit">
                      <div className="pilot-contract__benefit-icon">
                        <Headphones size={20} />
                      </div>
                      <div className="pilot-contract__benefit-content">
                        <h4>Priority Support</h4>
                        <p>
                          Dedicated support channel with guaranteed response times. Direct 
                          access to our engineering team for technical assistance.
                        </p>
                      </div>
                    </div>

                    <div className="pilot-contract__benefit">
                      <div className="pilot-contract__benefit-icon">
                        <FileSearch size={20} />
                      </div>
                      <div className="pilot-contract__benefit-content">
                        <h4>Audit Logs</h4>
                        <p>
                          Complete audit trail of all platform activities, user actions, 
                          and data access for compliance and security requirements.
                        </p>
                      </div>
                    </div>

                    <div className="pilot-contract__benefit">
                      <div className="pilot-contract__benefit-icon">
                        <Sparkles size={20} />
                      </div>
                      <div className="pilot-contract__benefit-content">
                        <h4>Early Access: Self-Healing Prompts</h4>
                        <p>
                          Exclusive early access to our upcoming Self-Healing Prompt feature 
                          that automatically identifies weak responses, enhances prompts with AI, 
                          and validates improvements through A/B testing.
                        </p>
                        <span className="pilot-contract__benefit-tag">Beta Feature</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Marketing Agreement */}
                <section className="pilot-contract__section pilot-contract__section--highlight">
                  <h3>4. Marketing & Publicity Rights</h3>
                  <div className="pilot-contract__marketing">
                    <div className="pilot-contract__marketing-icon">
                      <Share2 size={24} />
                    </div>
                    <div className="pilot-contract__marketing-content">
                      <p>
                        By signing this Agreement, the Client formally grants Shepherd the right to:
                      </p>
                      <ul>
                        <li>
                          <Check size={14} />
                          Feature the Client's company name and logo on the Shepherd website
                        </li>
                        <li>
                          <Check size={14} />
                          Share case studies and success metrics on social media, press releases, 
                          and other marketing materials
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Duration & Termination */}
                <section className="pilot-contract__section">
                  <h3>5. Duration & Termination</h3>
                  <p>
                    This pilot program shall commence on the Effective Date and continue for a 
                    period of <strong>one (1) month</strong>. Either party may terminate this 
                    Agreement with 7 days written notice. Upon termination, Client's access to 
                    the platform will be revoked.
                  </p>
                </section>

                {/* Confidentiality */}
                <section className="pilot-contract__section">
                  <h3>6. Confidentiality</h3>
                  <p>
                    Both parties agree to maintain the confidentiality of any proprietary 
                    information shared during the pilot program. This includes but is not 
                    limited to technical specifications, business strategies, and trace data.
                  </p>
                </section>

                {/* Data Handling */}
                <section className="pilot-contract__section">
                  <h3>7. Data Handling</h3>
                  <p>
                    The Provider shall handle all Client data in accordance with industry-standard 
                    security practices. Trace data remains the property of the Client and will be 
                    stored securely in the Client's designated cloud infrastructure when using 
                    on-premise deployment options.
                  </p>
                </section>
              </div>

              {/* Signature Section */}
              <div className="pilot-contract__signature-section">
                <h3>8. Signature</h3>
                <p>
                  By signing below, the Client agrees to the terms and conditions outlined in this 
                  Pilot Program Agreement.
                </p>

                <form onSubmit={handleSubmit} className="pilot-contract__form">
                  <div className="pilot-contract__form-grid">
                    <div className="pilot-contract__field">
                      <label htmlFor="signerName">Full Name *</label>
                      <input
                        type="text"
                        id="signerName"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="pilot-contract__field">
                      <label htmlFor="signerTitle">Title / Position</label>
                      <input
                        type="text"
                        id="signerTitle"
                        value={signerTitle}
                        onChange={(e) => setSignerTitle(e.target.value)}
                        placeholder="CTO"
                      />
                    </div>
                    <div className="pilot-contract__field pilot-contract__field--full">
                      <label htmlFor="signerEmail">Email Address *</label>
                      <input
                        type="email"
                        id="signerEmail"
                        value={signerEmail}
                        onChange={(e) => setSignerEmail(e.target.value)}
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="pilot-contract__signature-box">
                    <label>Signature *</label>
                    <SignatureCanvas 
                      onSignatureChange={setSignature}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="pilot-contract__terms">
                    <label className="pilot-contract__checkbox">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                      />
                      <span className="pilot-contract__checkmark">
                        <Check size={12} />
                      </span>
                      <span>
                        I have read, understood, and agree to all the terms and conditions 
                        of this Pilot Program Agreement on behalf of <strong>{displayName}</strong>.
                      </span>
                    </label>
                  </div>

                  <div className="pilot-contract__submit-section">
                    <button
                      type="submit"
                      className="btn btn--primary pilot-contract__submit"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="spinner" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          Sign & Download PDF
                        </>
                      )}
                    </button>
                    
                    <div className="pilot-contract__security">
                      <Shield size={14} />
                      <span>Your signature is encrypted and securely stored.</span>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Support Info */}
            <motion.div className="pilot-support" variants={fadeInUp}>
              <div className="pilot-support__content">
                <h3>Questions about the agreement?</h3>
                <p>Our team is here to help clarify any terms or discuss customizations.</p>
              </div>
              <div className="pilot-support__actions">
                <a href="mailto:hello@shepherd.dev" className="btn btn--secondary">
                  Contact Us
                </a>
                <Link to="/contact" className="btn btn--ghost">
                  Schedule a Call
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="pilot-footer">
        <div className="container pilot-footer__container">
          <span>© Shepherd, 2025</span>
          <div className="pilot-footer__links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <a href="https://neuralis-in.github.io/aiobs/getting_started.html" target="_blank" rel="noopener noreferrer">Docs</a>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        enterpriseName={displayName}
      />
    </div>
  )
}

