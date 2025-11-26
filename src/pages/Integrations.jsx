import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  Database,
  Server,
  Zap,
  CheckCircle,
  Code,
  RefreshCw,
  Eye,
  Layers,
  Shield,
  Clock,
  GitBranch,
  Box,
  HardDrive,
  Globe,
  Lock,
  Activity,
  BarChart3,
  FileJson,
  Upload,
  Download,
  ExternalLink
} from 'lucide-react'
import './Integrations.css'

// Animation variants
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

// Integration providers data
const integrations = [
  {
    id: 'gcp',
    name: 'Google Cloud Storage',
    shortName: 'GCS',
    iconType: 'gcp',
    color: '#4285F4',
    description: 'Stream observability data directly to GCS buckets with automatic partitioning.',
    features: ['Auto-partitioning by date', 'IAM integration', 'Real-time streaming'],
    code: `from aiobs import observer
from aiobs.exporters import GCSExporter

exporter = GCSExporter(
    bucket="my-observability-bucket",
    prefix="traces/"
)

observer.observe()
# your agent code
observer.end()
observer.flush(exporter=exporter)`
  },
  {
    id: 's3',
    name: 'Amazon S3',
    shortName: 'S3',
    iconType: 'aws',
    color: '#FF9900',
    description: 'Export traces to S3 with support for cross-region replication and lifecycle policies.',
    features: ['Cross-region support', 'Lifecycle policies', 'SSE encryption'],
    code: `from aiobs import observer
from aiobs.exporters import S3Exporter

exporter = S3Exporter(
    bucket="my-traces-bucket",
    region="us-east-1",
    prefix="shepherd/"
)

observer.observe()
# your agent code
observer.end()
observer.flush(exporter=exporter)`
  },
  {
    id: 'azure',
    name: 'Azure Blob Storage',
    shortName: 'Azure',
    iconType: 'azure',
    color: '#0078D4',
    description: 'Seamlessly integrate with Azure Blob Storage for enterprise-grade observability.',
    features: ['Managed identity', 'Geo-redundancy', 'Tiered storage'],
    code: `from aiobs import observer
from aiobs.exporters import AzureBlobExporter

exporter = AzureBlobExporter(
    container="observability",
    connection_string=os.getenv("AZURE_CONN")
)

observer.observe()
# your agent code
observer.end()
observer.flush(exporter=exporter)`
  },
  {
    id: 'onprem',
    name: 'On-Premise / Self-Hosted',
    shortName: 'On-Prem',
    iconType: 'onprem',
    color: '#6366F1',
    description: 'Deploy to your own infrastructure with full data sovereignty and control.',
    features: ['Full data control', 'Custom storage', 'Air-gapped support'],
    code: `from aiobs import observer
from aiobs.exporters import FileExporter

exporter = FileExporter(
    path="/mnt/observability/traces",
    format="jsonl"
)

observer.observe()
# your agent code
observer.end()
observer.flush(exporter=exporter)`
  },
  {
    id: 'shepherd',
    name: 'Shepherd Cloud',
    shortName: 'Cloud',
    iconType: 'shepherd',
    color: '#111111',
    description: 'Zero-config managed solution with built-in dashboards and alerting.',
    features: ['Managed infrastructure', 'Built-in analytics', 'Real-time alerts'],
    code: `from aiobs import observer
from aiobs.exporters import ShepherdExporter

exporter = ShepherdExporter(
    api_key=os.getenv("SHEPHERD_API_KEY")
)

observer.observe()
# your agent code
observer.end()
observer.flush(exporter=exporter)`
  }
]

// Icon renderer
function ProviderIcon({ type, size = 32 }) {
  const basePath = import.meta.env.BASE_URL
  
  switch (type) {
    case 'gcp':
      return <img src={`${basePath}gcp.png`} alt="Google Cloud" width={size} height={size} style={{ objectFit: 'contain' }} />
    case 'aws':
      return <img src={`${basePath}aws.png`} alt="Amazon Web Services" width={size} height={size} style={{ objectFit: 'contain' }} />
    case 'azure':
      return <img src={`${basePath}azure.svg`} alt="Microsoft Azure" width={size} height={size} style={{ objectFit: 'contain' }} />
    case 'onprem':
      return <Server size={size} />
    case 'shepherd':
      return (
        <svg viewBox="0 0 32 32" width={size} height={size}>
          <rect width="32" height="32" rx="6" fill="#111"/>
          <path d="M8 12L16 8L24 12L16 16L8 12Z" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M8 16L16 20L24 16" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M8 20L16 24L24 20" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      )
    default:
      return <Cloud size={size} />
  }
}

// Integration Card Component
function IntegrationCard({ integration, isSelected, onSelect }) {
  return (
    <motion.div
      className={`integration-card ${isSelected ? 'integration-card--selected' : ''}`}
      onClick={() => onSelect(integration.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ '--accent-color': integration.color }}
    >
      <div className="integration-card__icon">
        <ProviderIcon type={integration.iconType} size={32} />
      </div>
      <div className="integration-card__content">
        <h3 className="integration-card__name">{integration.shortName}</h3>
        <p className="integration-card__full-name">{integration.name}</p>
      </div>
      {isSelected && (
        <div className="integration-card__check">
          <CheckCircle size={18} />
        </div>
      )}
    </motion.div>
  )
}

// Flow Diagram Component
function FlowDiagram({ selectedIntegration }) {
  const integration = integrations.find(i => i.id === selectedIntegration) || integrations[0]
  
  return (
    <div className="flow-diagram">
      <div className="flow-diagram__step">
        <div className="flow-diagram__node flow-diagram__node--agent">
          <Code size={24} />
          <span>Your Agent</span>
        </div>
        <div className="flow-diagram__label">observer.observe()</div>
      </div>
      
      <div className="flow-diagram__arrow">
        <ArrowRight size={20} />
      </div>
      
      <div className="flow-diagram__step">
        <div className="flow-diagram__node flow-diagram__node--aiobs">
          <Layers size={24} />
          <span>aiobs SDK</span>
        </div>
        <div className="flow-diagram__label">Capture traces</div>
      </div>
      
      <div className="flow-diagram__arrow">
        <ArrowRight size={20} />
      </div>
      
      <div className="flow-diagram__step">
        <div className="flow-diagram__node flow-diagram__node--flush">
          <Upload size={24} />
          <span>.flush()</span>
        </div>
        <div className="flow-diagram__label">Export data</div>
      </div>
      
      <div className="flow-diagram__arrow">
        <ArrowRight size={20} />
      </div>
      
      <div className="flow-diagram__step">
        <div 
          className="flow-diagram__node flow-diagram__node--storage"
          style={{ borderColor: integration.color, color: integration.color }}
        >
          <Cloud size={24} />
          <span>{integration.shortName}</span>
        </div>
        <div className="flow-diagram__label">Cloud Storage</div>
      </div>
      
      <div className="flow-diagram__arrow flow-diagram__arrow--subscribe">
        <RefreshCw size={16} />
        <span>Subscribe</span>
      </div>
      
      <div className="flow-diagram__step">
        <div className="flow-diagram__node flow-diagram__node--dashboard">
          <BarChart3 size={24} />
          <span>Dashboard</span>
        </div>
        <div className="flow-diagram__label">Monitor & Analyze</div>
      </div>
    </div>
  )
}

// Code Block Component
function CodeBlock({ code, title }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__title">{title}</span>
        <button className="code-block__copy" onClick={handleCopy}>
          {copied ? <CheckCircle size={14} /> : 'Copy'}
        </button>
      </div>
      <pre className="code-block__content">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// Main Integrations Page
export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState('shepherd')
  const currentIntegration = integrations.find(i => i.id === selectedIntegration) || integrations[0]

  return (
    <div className="integrations-page">
      {/* Header */}
      <header className="integrations-header">
        <div className="integrations-header__container">
          <Link to="/" className="integrations-header__back">
            <ArrowLeft size={18} />
          </Link>
          <div className="integrations-header__title">
            <h1>Integrations</h1>
            <span className="integrations-header__subtitle">Connect aiobs to your infrastructure</span>
          </div>
        </div>
      </header>

      <main className="integrations-main">
        {/* Hero Section */}
        <section className="integrations-hero">
          <motion.div
            className="integrations-hero__content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="integrations-hero__badge" variants={fadeInUp}>
              <Cloud size={14} />
              Flexible Storage Options
            </motion.div>
            <motion.h2 className="integrations-hero__title" variants={fadeInUp}>
              Flush traces to any cloud.<br />
              Monitor from anywhere.
            </motion.h2>
            <motion.p className="integrations-hero__description" variants={fadeInUp}>
              aiobs provides flexible exporters to stream your observability data to GCP, AWS S3, 
              Azure, on-premise storage, or Shepherd Cloud. The dashboard subscribes to your 
              storage bucket and continuously monitors incoming traces.
            </motion.p>
          </motion.div>
        </section>

        {/* Integration Selector */}
        <section className="integrations-selector">
          <h3 className="integrations-selector__title">Choose your storage provider</h3>
          <div className="integrations-selector__grid">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                isSelected={selectedIntegration === integration.id}
                onSelect={setSelectedIntegration}
              />
            ))}
          </div>
        </section>

        {/* Flow Diagram */}
        <section className="integrations-flow">
          <h3 className="integrations-flow__title">
            <GitBranch size={18} />
            Data Flow Pipeline
          </h3>
          <FlowDiagram selectedIntegration={selectedIntegration} />
        </section>

        {/* Selected Integration Details */}
        <section className="integrations-details">
          <div className="integrations-details__grid">
            <motion.div 
              className="integrations-details__info"
              key={selectedIntegration}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="integrations-details__icon"
                style={{ backgroundColor: currentIntegration.color + '15' }}
              >
                <ProviderIcon type={currentIntegration.iconType} size={40} />
              </div>
              <h3 className="integrations-details__name">{currentIntegration.name}</h3>
              <p className="integrations-details__description">{currentIntegration.description}</p>
              
              <div className="integrations-details__features">
                <h4>Features</h4>
                <ul>
                  {currentIntegration.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              className="integrations-details__code"
              key={`code-${selectedIntegration}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CodeBlock 
                code={currentIntegration.code} 
                title={`${currentIntegration.shortName} Integration`}
              />
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="integrations-how">
          <h3 className="integrations-how__title">How Continuous Monitoring Works</h3>
          <div className="integrations-how__grid">
            <div className="integrations-how__step">
              <div className="integrations-how__step-number">1</div>
              <div className="integrations-how__step-icon">
                <Upload size={24} />
              </div>
              <h4>Flush Traces</h4>
              <p>Your agent calls <code>.flush()</code> after each run, streaming JSON traces to your chosen storage.</p>
            </div>
            
            <div className="integrations-how__step">
              <div className="integrations-how__step-number">2</div>
              <div className="integrations-how__step-icon">
                <RefreshCw size={24} />
              </div>
              <h4>Subscribe & Sync</h4>
              <p>Shepherd Dashboard subscribes to your bucket via webhooks or polling, detecting new traces automatically.</p>
            </div>
            
            <div className="integrations-how__step">
              <div className="integrations-how__step-number">3</div>
              <div className="integrations-how__step-icon">
                <BarChart3 size={24} />
              </div>
              <h4>Visualize & Alert</h4>
              <p>Traces are parsed, indexed, and visualized in real-time. Set up alerts for failures or anomalies.</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="integrations-benefits">
          <h3 className="integrations-benefits__title">Why This Architecture</h3>
          <div className="integrations-benefits__grid">
            <div className="integrations-benefits__card">
              <div className="integrations-benefits__icon">
                <Shield size={20} />
              </div>
              <h4>Data Sovereignty</h4>
              <p>Your traces stay in your infrastructure. Full control over data residency and compliance.</p>
            </div>
            
            <div className="integrations-benefits__card">
              <div className="integrations-benefits__icon">
                <Zap size={20} />
              </div>
              <h4>Zero Lock-in</h4>
              <p>Standard JSON format. Switch storage providers anytime without changing your agent code.</p>
            </div>
            
            <div className="integrations-benefits__card">
              <div className="integrations-benefits__icon">
                <Activity size={20} />
              </div>
              <h4>Real-time Insights</h4>
              <p>Continuous monitoring with sub-second latency from flush to dashboard visibility.</p>
            </div>
            
            <div className="integrations-benefits__card">
              <div className="integrations-benefits__icon">
                <Lock size={20} />
              </div>
              <h4>Enterprise Security</h4>
              <p>Leverage your cloud provider's security: IAM, encryption at rest, VPC endpoints.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="integrations-cta">
          <div className="integrations-cta__content">
            <h3>Ready to integrate?</h3>
            <p>Start streaming your agent traces in minutes.</p>
            <div className="integrations-cta__actions">
              <a 
                href="https://neuralis-in.github.io/aiobs/getting_started.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="integrations-cta__btn integrations-cta__btn--primary"
              >
                Read the Docs <ExternalLink size={16} />
              </a>
              <Link to="/playground" className="integrations-cta__btn integrations-cta__btn--secondary">
                Try Playground <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

