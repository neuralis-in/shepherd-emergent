import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Activity,
  Clock,
  DollarSign,
  Zap,
  AlertTriangle,
  Shield,
  Database,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  RefreshCw,
  Filter,
  Download,
  Calendar,
  ChevronDown,
  Cpu,
  MessageSquare,
  Eye,
  EyeOff,
  Ban,
  Timer,
  Gauge,
  Coins,
  HardDrive,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  FileJson,
  FileSpreadsheet,
  Check
} from 'lucide-react'
import './Dashboard.css'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
}

// Sample data
const sampleData = {
  overview: {
    totalRequests: 124847,
    totalTokens: 8420193,
    totalCost: 142.87,
    avgLatency: 847,
    cacheHitRate: 34.2,
    errorRate: 0.8
  },
  latency: {
    average: 847,
    p50: 623,
    p90: 1240,
    p95: 1680,
    p99: 2340,
    slowest: 4821,
    fastest: 89
  },
  tokens: {
    input: 5240120,
    output: 3180073,
    cached: 1420000,
    total: 8420193
  },
  costs: {
    today: 12.47,
    week: 89.23,
    month: 142.87,
    projected: 428.61,
    byModel: [
      { model: 'gpt-4o', cost: 98.42, percentage: 68.9 },
      { model: 'gpt-4o-mini', cost: 32.18, percentage: 22.5 },
      { model: 'gpt-3.5-turbo', cost: 12.27, percentage: 8.6 }
    ]
  },
  security: {
    piiLeaks: 23,
    deniedTopics: 47,
    blockedRequests: 12,
    sensitiveDataTypes: [
      { type: 'Email addresses', count: 12 },
      { type: 'Phone numbers', count: 6 },
      { type: 'SSN patterns', count: 3 },
      { type: 'Credit cards', count: 2 }
    ],
    topDeniedTopics: [
      { topic: 'Competitor information', count: 18 },
      { topic: 'Internal pricing', count: 14 },
      { topic: 'Employee data', count: 9 },
      { topic: 'Unreleased features', count: 6 }
    ]
  },
  prompts: {
    slowest: [
      { id: 'p-4821', prompt: 'Generate comprehensive market analysis...', duration: 4821, tokens: 12400 },
      { id: 'p-4102', prompt: 'Create detailed financial report for Q3...', duration: 4102, tokens: 9800 },
      { id: 'p-3847', prompt: 'Analyze customer feedback dataset...', duration: 3847, tokens: 8200 }
    ],
    fastest: [
      { id: 'p-089', prompt: 'Classify sentiment: positive/negative', duration: 89, tokens: 45 },
      { id: 'p-112', prompt: 'Extract date from text', duration: 112, tokens: 62 },
      { id: 'p-134', prompt: 'Translate greeting to Spanish', duration: 134, tokens: 28 }
    ]
  },
  caching: {
    hits: 42847,
    misses: 81000,
    hitRate: 34.6,
    savedTokens: 1420000,
    savedCost: 28.40,
    topCached: [
      { prompt: 'System prompt: Customer service agent...', hits: 8420, savings: 6.84 },
      { prompt: 'Format instruction template...', hits: 6210, savings: 4.12 },
      { prompt: 'JSON schema validation prompt...', hits: 4180, savings: 2.94 }
    ]
  },
  timeline: [
    { time: '00:00', requests: 2100, latency: 720, cost: 0.42 },
    { time: '04:00', requests: 1200, latency: 680, cost: 0.24 },
    { time: '08:00', requests: 8400, latency: 890, cost: 1.68 },
    { time: '12:00', requests: 12000, latency: 920, cost: 2.40 },
    { time: '16:00', requests: 14200, latency: 980, cost: 2.84 },
    { time: '20:00', requests: 9800, latency: 840, cost: 1.96 }
  ]
}

// Filter Panel Component
function FilterPanel({ isOpen, onClose, filters, setFilters }) {
  const panelRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      model: 'all',
      status: 'all',
      minLatency: '',
      maxLatency: '',
      minCost: '',
      maxCost: ''
    })
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'model' || key === 'status') return value !== 'all'
    return value !== ''
  }).length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          className="filter-panel"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <div className="filter-panel__header">
            <h3>Filters</h3>
            {activeFilterCount > 0 && (
              <button className="filter-panel__clear" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>

          <div className="filter-panel__body">
            <div className="filter-group">
              <label className="filter-label">Model</label>
              <select 
                className="filter-select"
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
              >
                <option value="all">All Models</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select 
                className="filter-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="timeout">Timeout</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Latency (ms)</label>
              <div className="filter-range">
                <input 
                  type="number" 
                  placeholder="Min"
                  className="filter-input"
                  value={filters.minLatency}
                  onChange={(e) => handleFilterChange('minLatency', e.target.value)}
                />
                <span className="filter-range__separator">–</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  className="filter-input"
                  value={filters.maxLatency}
                  onChange={(e) => handleFilterChange('maxLatency', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Cost ($)</label>
              <div className="filter-range">
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Min"
                  className="filter-input"
                  value={filters.minCost}
                  onChange={(e) => handleFilterChange('minCost', e.target.value)}
                />
                <span className="filter-range__separator">–</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="Max"
                  className="filter-input"
                  value={filters.maxCost}
                  onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="filter-panel__footer">
            <button className="dashboard-btn dashboard-btn--primary" onClick={onClose}>
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Export Panel Component
function ExportPanel({ isOpen, onClose, onExport }) {
  const panelRef = useRef(null)
  const [exporting, setExporting] = useState(null)
  const [exported, setExported] = useState(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleExport = async (format) => {
    setExporting(format)
    await onExport(format)
    setExporting(null)
    setExported(format)
    setTimeout(() => setExported(null), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          className="export-panel"
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <div className="export-panel__header">
            <h3>Export Data</h3>
          </div>

          <div className="export-panel__body">
            <button 
              className={`export-option ${exported === 'json' ? 'export-option--success' : ''}`}
              onClick={() => handleExport('json')}
              disabled={exporting}
            >
              <div className="export-option__icon">
                {exported === 'json' ? <Check size={20} /> : <FileJson size={20} />}
              </div>
              <div className="export-option__content">
                <span className="export-option__title">JSON</span>
                <span className="export-option__desc">Full data with nested structure</span>
              </div>
              {exporting === 'json' && <RefreshCw size={16} className="export-option__loading" />}
            </button>

            <button 
              className={`export-option ${exported === 'csv' ? 'export-option--success' : ''}`}
              onClick={() => handleExport('csv')}
              disabled={exporting}
            >
              <div className="export-option__icon">
                {exported === 'csv' ? <Check size={20} /> : <FileSpreadsheet size={20} />}
              </div>
              <div className="export-option__content">
                <span className="export-option__title">CSV</span>
                <span className="export-option__desc">Spreadsheet compatible format</span>
              </div>
              {exporting === 'csv' && <RefreshCw size={16} className="export-option__loading" />}
            </button>
          </div>

          <div className="export-panel__footer">
            <span className="export-panel__note">Exports current filtered view</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Header
function DashboardHeader({ filters, setFilters, onExport }) {
  const [timeRange, setTimeRange] = useState('24h')
  const [showFilters, setShowFilters] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'model' || key === 'status') return value !== 'all'
    return value !== ''
  }).length

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        <Link to="/" className="dashboard-header__back">
          <ArrowLeft size={18} />
        </Link>
        <div className="dashboard-header__title">
          <h1>Dashboard</h1>
          <span className="dashboard-header__subtitle">AI Observability Metrics</span>
        </div>
      </div>
      <div className="dashboard-header__right">
        <div className="dashboard-header__time-select">
          <Calendar size={14} />
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <ChevronDown size={14} />
        </div>
        
        <div className="dashboard-header__dropdown">
          <button 
            className={`dashboard-btn dashboard-btn--ghost ${showFilters ? 'dashboard-btn--active' : ''}`}
            onClick={() => { setShowFilters(!showFilters); setShowExport(false) }}
          >
            <Filter size={14} />
            Filter
            {activeFilterCount > 0 && (
              <span className="dashboard-btn__badge">{activeFilterCount}</span>
            )}
          </button>
          <FilterPanel 
            isOpen={showFilters} 
            onClose={() => setShowFilters(false)}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        <div className="dashboard-header__dropdown">
          <button 
            className={`dashboard-btn dashboard-btn--ghost ${showExport ? 'dashboard-btn--active' : ''}`}
            onClick={() => { setShowExport(!showExport); setShowFilters(false) }}
          >
            <Download size={14} />
            Export
          </button>
          <ExportPanel 
            isOpen={showExport} 
            onClose={() => setShowExport(false)}
            onExport={onExport}
          />
        </div>

        <button 
          className={`dashboard-btn dashboard-btn--primary ${isRefreshing ? 'dashboard-btn--refreshing' : ''}`}
          onClick={handleRefresh}
        >
          <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </header>
  )
}

// Stat Card Component
function StatCard({ icon, label, value, subvalue, trend, trendDirection, color = 'default' }) {
  return (
    <motion.div className={`stat-card stat-card--${color}`} variants={fadeInUp}>
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {subvalue && <span className="stat-card__subvalue">{subvalue}</span>}
      </div>
      {trend && (
        <div className={`stat-card__trend stat-card__trend--${trendDirection}`}>
          {trendDirection === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend}</span>
        </div>
      )}
    </motion.div>
  )
}

// Overview Section
function OverviewSection() {
  const { overview } = sampleData

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">Overview</h2>
      <motion.div 
        className="stat-grid stat-grid--6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <StatCard
          icon={<Activity size={20} />}
          label="Total Requests"
          value={overview.totalRequests.toLocaleString()}
          trend="+12.4%"
          trendDirection="up"
          color="blue"
        />
        <StatCard
          icon={<MessageSquare size={20} />}
          label="Total Tokens"
          value={(overview.totalTokens / 1000000).toFixed(2) + 'M'}
          trend="+8.2%"
          trendDirection="up"
          color="purple"
        />
        <StatCard
          icon={<DollarSign size={20} />}
          label="Total Cost"
          value={'$' + overview.totalCost.toFixed(2)}
          trend="+15.3%"
          trendDirection="up"
          color="green"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Avg Latency"
          value={overview.avgLatency + 'ms'}
          trend="-4.1%"
          trendDirection="down"
          color="orange"
        />
        <StatCard
          icon={<Database size={20} />}
          label="Cache Hit Rate"
          value={overview.cacheHitRate + '%'}
          trend="+2.8%"
          trendDirection="up"
          color="cyan"
        />
        <StatCard
          icon={<AlertTriangle size={20} />}
          label="Error Rate"
          value={overview.errorRate + '%'}
          trend="-0.3%"
          trendDirection="down"
          color="red"
        />
      </motion.div>
    </section>
  )
}

// Latency Section
function LatencySection() {
  const { latency } = sampleData

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">
        <Timer size={18} />
        Latency Analysis
      </h2>
      <div className="dashboard-grid dashboard-grid--2">
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">Response Time Percentiles</h3>
          <div className="percentile-grid">
            <div className="percentile-item">
              <span className="percentile-label">Average</span>
              <span className="percentile-value">{latency.average}ms</span>
              <div className="percentile-bar">
                <div className="percentile-bar__fill" style={{ width: `${(latency.average / latency.slowest) * 100}%` }}></div>
              </div>
            </div>
            <div className="percentile-item">
              <span className="percentile-label">P50</span>
              <span className="percentile-value">{latency.p50}ms</span>
              <div className="percentile-bar">
                <div className="percentile-bar__fill" style={{ width: `${(latency.p50 / latency.slowest) * 100}%` }}></div>
              </div>
            </div>
            <div className="percentile-item">
              <span className="percentile-label">P90</span>
              <span className="percentile-value">{latency.p90}ms</span>
              <div className="percentile-bar">
                <div className="percentile-bar__fill" style={{ width: `${(latency.p90 / latency.slowest) * 100}%` }}></div>
              </div>
            </div>
            <div className="percentile-item">
              <span className="percentile-label">P95</span>
              <span className="percentile-value">{latency.p95}ms</span>
              <div className="percentile-bar">
                <div className="percentile-bar__fill" style={{ width: `${(latency.p95 / latency.slowest) * 100}%` }}></div>
              </div>
            </div>
            <div className="percentile-item percentile-item--highlight">
              <span className="percentile-label">P99</span>
              <span className="percentile-value">{latency.p99}ms</span>
              <div className="percentile-bar percentile-bar--orange">
                <div className="percentile-bar__fill" style={{ width: `${(latency.p99 / latency.slowest) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">Extremes</h3>
          <div className="extremes-grid">
            <div className="extreme-item extreme-item--slow">
              <div className="extreme-item__header">
                <TrendingUp size={16} />
                <span>Slowest Prompt</span>
              </div>
              <div className="extreme-item__value">{latency.slowest}ms</div>
              <div className="extreme-item__desc">Market analysis generation</div>
            </div>
            <div className="extreme-item extreme-item--fast">
              <div className="extreme-item__header">
                <Zap size={16} />
                <span>Fastest Prompt</span>
              </div>
              <div className="extreme-item__value">{latency.fastest}ms</div>
              <div className="extreme-item__desc">Sentiment classification</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Tokens & Cost Section
function TokensCostSection() {
  const { tokens, costs } = sampleData

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">
        <Coins size={18} />
        Tokens & Cost Analysis
      </h2>
      <div className="dashboard-grid dashboard-grid--3">
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">Token Breakdown</h3>
          <div className="token-breakdown">
            <div className="token-item">
              <div className="token-item__header">
                <span className="token-dot token-dot--input"></span>
                <span>Input Tokens</span>
              </div>
              <span className="token-item__value">{(tokens.input / 1000000).toFixed(2)}M</span>
            </div>
            <div className="token-item">
              <div className="token-item__header">
                <span className="token-dot token-dot--output"></span>
                <span>Output Tokens</span>
              </div>
              <span className="token-item__value">{(tokens.output / 1000000).toFixed(2)}M</span>
            </div>
            <div className="token-item">
              <div className="token-item__header">
                <span className="token-dot token-dot--cached"></span>
                <span>Cached Tokens</span>
              </div>
              <span className="token-item__value">{(tokens.cached / 1000000).toFixed(2)}M</span>
            </div>
            <div className="token-visual">
              <div className="token-visual__bar">
                <div className="token-visual__segment token-visual__segment--input" style={{ width: '62.2%' }}></div>
                <div className="token-visual__segment token-visual__segment--output" style={{ width: '37.8%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">Cost Summary</h3>
          <div className="cost-summary">
            <div className="cost-item cost-item--primary">
              <span className="cost-item__label">Today</span>
              <span className="cost-item__value">${costs.today.toFixed(2)}</span>
            </div>
            <div className="cost-item">
              <span className="cost-item__label">This Week</span>
              <span className="cost-item__value">${costs.week.toFixed(2)}</span>
            </div>
            <div className="cost-item">
              <span className="cost-item__label">This Month</span>
              <span className="cost-item__value">${costs.month.toFixed(2)}</span>
            </div>
            <div className="cost-item cost-item--projected">
              <span className="cost-item__label">Projected (30d)</span>
              <span className="cost-item__value">${costs.projected.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">Cost by Model</h3>
          <div className="model-costs">
            {costs.byModel.map((model, i) => (
              <div key={i} className="model-cost-item">
                <div className="model-cost-item__header">
                  <span className="model-cost-item__name">{model.model}</span>
                  <span className="model-cost-item__value">${model.cost.toFixed(2)}</span>
                </div>
                <div className="model-cost-item__bar">
                  <div 
                    className="model-cost-item__fill" 
                    style={{ width: `${model.percentage}%` }}
                  ></div>
                </div>
                <span className="model-cost-item__percentage">{model.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Security Section
function SecuritySection() {
  const { security } = sampleData

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">
        <Shield size={18} />
        Security & Compliance
      </h2>
      <div className="dashboard-grid dashboard-grid--2">
        <motion.div 
          className="dashboard-card dashboard-card--alert"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">
            <Eye size={16} />
            PII Leak Detection
          </h3>
          <div className="security-stat">
            <span className="security-stat__value security-stat__value--warning">{security.piiLeaks}</span>
            <span className="security-stat__label">Potential PII leaks detected</span>
          </div>
          <div className="security-list">
            {security.sensitiveDataTypes.map((item, i) => (
              <div key={i} className="security-list__item">
                <AlertCircle size={14} className="security-list__icon security-list__icon--warning" />
                <span className="security-list__text">{item.type}</span>
                <span className="security-list__count">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">
            <Ban size={16} />
            Denied Topics
          </h3>
          <div className="security-stat">
            <span className="security-stat__value">{security.deniedTopics}</span>
            <span className="security-stat__label">Requests blocked by topic filters</span>
          </div>
          <div className="security-list">
            {security.topDeniedTopics.map((item, i) => (
              <div key={i} className="security-list__item">
                <XCircle size={14} className="security-list__icon security-list__icon--blocked" />
                <span className="security-list__text">{item.topic}</span>
                <span className="security-list__count">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Caching Section
function CachingSection() {
  const { caching } = sampleData

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">
        <HardDrive size={18} />
        Prompt Caching
      </h2>
      <div className="dashboard-grid dashboard-grid--2">
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">Cache Performance</h3>
          <div className="cache-stats">
            <div className="cache-stat">
              <div className="cache-stat__visual">
                <svg viewBox="0 0 100 100" className="cache-stat__ring">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E5E5" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="40" fill="none" 
                    stroke="#10B981" strokeWidth="8"
                    strokeDasharray={`${caching.hitRate * 2.51} 251`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="cache-stat__percentage">{caching.hitRate}%</span>
              </div>
              <span className="cache-stat__label">Cache Hit Rate</span>
            </div>
            <div className="cache-numbers">
              <div className="cache-number">
                <CheckCircle size={16} className="cache-number__icon cache-number__icon--hit" />
                <span className="cache-number__value">{caching.hits.toLocaleString()}</span>
                <span className="cache-number__label">Cache Hits</span>
              </div>
              <div className="cache-number">
                <XCircle size={16} className="cache-number__icon cache-number__icon--miss" />
                <span className="cache-number__value">{caching.misses.toLocaleString()}</span>
                <span className="cache-number__label">Cache Misses</span>
              </div>
            </div>
          </div>
          <div className="cache-savings">
            <div className="cache-saving">
              <span className="cache-saving__label">Tokens Saved</span>
              <span className="cache-saving__value">{(caching.savedTokens / 1000000).toFixed(2)}M</span>
            </div>
            <div className="cache-saving">
              <span className="cache-saving__label">Cost Saved</span>
              <span className="cache-saving__value cache-saving__value--money">${caching.savedCost.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">Top Cached Prompts</h3>
          <div className="cached-prompts">
            {caching.topCached.map((item, i) => (
              <div key={i} className="cached-prompt">
                <div className="cached-prompt__rank">#{i + 1}</div>
                <div className="cached-prompt__content">
                  <span className="cached-prompt__text">{item.prompt}</span>
                  <div className="cached-prompt__meta">
                    <span>{item.hits.toLocaleString()} hits</span>
                    <span className="cached-prompt__savings">${item.savings.toFixed(2)} saved</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Prompt Analysis Section
function PromptAnalysisSection() {
  const { prompts } = sampleData

  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section__title">
        <Gauge size={18} />
        Prompt Performance
      </h2>
      <div className="dashboard-grid dashboard-grid--2">
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">
            <TrendingUp size={16} className="icon--slow" />
            Slowest Prompts
          </h3>
          <div className="prompt-list">
            {prompts.slowest.map((prompt, i) => (
              <div key={i} className="prompt-item prompt-item--slow">
                <div className="prompt-item__header">
                  <span className="prompt-item__id">{prompt.id}</span>
                  <span className="prompt-item__duration">{prompt.duration}ms</span>
                </div>
                <span className="prompt-item__text">{prompt.prompt}</span>
                <span className="prompt-item__tokens">{prompt.tokens.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h3 className="dashboard-card__title">
            <Zap size={16} className="icon--fast" />
            Fastest Prompts
          </h3>
          <div className="prompt-list">
            {prompts.fastest.map((prompt, i) => (
              <div key={i} className="prompt-item prompt-item--fast">
                <div className="prompt-item__header">
                  <span className="prompt-item__id">{prompt.id}</span>
                  <span className="prompt-item__duration">{prompt.duration}ms</span>
                </div>
                <span className="prompt-item__text">{prompt.prompt}</span>
                <span className="prompt-item__tokens">{prompt.tokens.toLocaleString()} tokens</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main Dashboard Component
export default function Dashboard() {
  const [filters, setFilters] = useState({
    model: 'all',
    status: 'all',
    minLatency: '',
    maxLatency: '',
    minCost: '',
    maxCost: ''
  })

  const handleExport = async (format) => {
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const exportData = {
      exportedAt: new Date().toISOString(),
      filters: filters,
      data: sampleData
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `shepherd-dashboard-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      // Convert to CSV format
      const csvRows = []
      
      // Overview section
      csvRows.push('OVERVIEW')
      csvRows.push('Metric,Value')
      csvRows.push(`Total Requests,${sampleData.overview.totalRequests}`)
      csvRows.push(`Total Tokens,${sampleData.overview.totalTokens}`)
      csvRows.push(`Total Cost,$${sampleData.overview.totalCost}`)
      csvRows.push(`Avg Latency,${sampleData.overview.avgLatency}ms`)
      csvRows.push(`Cache Hit Rate,${sampleData.overview.cacheHitRate}%`)
      csvRows.push(`Error Rate,${sampleData.overview.errorRate}%`)
      csvRows.push('')

      // Latency section
      csvRows.push('LATENCY PERCENTILES')
      csvRows.push('Percentile,Value (ms)')
      csvRows.push(`Average,${sampleData.latency.average}`)
      csvRows.push(`P50,${sampleData.latency.p50}`)
      csvRows.push(`P90,${sampleData.latency.p90}`)
      csvRows.push(`P95,${sampleData.latency.p95}`)
      csvRows.push(`P99,${sampleData.latency.p99}`)
      csvRows.push(`Slowest,${sampleData.latency.slowest}`)
      csvRows.push(`Fastest,${sampleData.latency.fastest}`)
      csvRows.push('')

      // Tokens section
      csvRows.push('TOKEN BREAKDOWN')
      csvRows.push('Type,Count')
      csvRows.push(`Input Tokens,${sampleData.tokens.input}`)
      csvRows.push(`Output Tokens,${sampleData.tokens.output}`)
      csvRows.push(`Cached Tokens,${sampleData.tokens.cached}`)
      csvRows.push('')

      // Costs by model
      csvRows.push('COST BY MODEL')
      csvRows.push('Model,Cost,Percentage')
      sampleData.costs.byModel.forEach(m => {
        csvRows.push(`${m.model},$${m.cost},${m.percentage}%`)
      })
      csvRows.push('')

      // Security
      csvRows.push('SECURITY')
      csvRows.push('Metric,Value')
      csvRows.push(`PII Leaks Detected,${sampleData.security.piiLeaks}`)
      csvRows.push(`Denied Topics,${sampleData.security.deniedTopics}`)
      csvRows.push('')

      // Caching
      csvRows.push('CACHING')
      csvRows.push('Metric,Value')
      csvRows.push(`Cache Hits,${sampleData.caching.hits}`)
      csvRows.push(`Cache Misses,${sampleData.caching.misses}`)
      csvRows.push(`Hit Rate,${sampleData.caching.hitRate}%`)
      csvRows.push(`Tokens Saved,${sampleData.caching.savedTokens}`)
      csvRows.push(`Cost Saved,$${sampleData.caching.savedCost}`)

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `shepherd-dashboard-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="dashboard">
      <DashboardHeader 
        filters={filters} 
        setFilters={setFilters}
        onExport={handleExport}
      />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <OverviewSection />
          <LatencySection />
          <TokensCostSection />
          <SecuritySection />
          <CachingSection />
          <PromptAnalysisSection />
        </div>
      </main>
    </div>
  )
}

