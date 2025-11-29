// Animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
}

// Model pricing (per 1M tokens) - approximate costs
export const MODEL_PRICING = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-4': { input: 30.00, output: 60.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'gemini-2.0-flash': { input: 0.10, output: 0.40 },
  'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  'gemini-1.5-pro': { input: 1.25, output: 5.00 },
  'gemini-pro': { input: 0.50, output: 1.50 },
  'claude-3-opus': { input: 15.00, output: 75.00 },
  'claude-3-sonnet': { input: 3.00, output: 15.00 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
  // Embedding models (input only, no output)
  'text-embedding-3-large': { input: 0.13, output: 0 },
  'text-embedding-3-small': { input: 0.02, output: 0 },
  'text-embedding-ada-002': { input: 0.10, output: 0 },
  'default': { input: 1.00, output: 3.00 }
}

// Model colors for visualizations
export const MODEL_COLORS = {
  'gemini-2.5-pro': '#4285F4',
  'gemini-2.0-flash': '#34A853',
  'gemini-1.5-pro': '#FBBC05',
  'gemini-1.5-flash': '#EA4335',
  'gpt-4o': '#10A37F',
  'gpt-4o-mini': '#74AA9C',
  'gpt-4-turbo': '#00A67E',
  'gpt-4': '#19C37D',
  'gpt-3.5-turbo': '#5AB8A3',
  'claude-3-opus': '#D97706',
  'claude-3-sonnet': '#F59E0B',
  'claude-3-haiku': '#FBBF24',
  // Embedding models
  'text-embedding-3-large': '#6366F1',
  'text-embedding-3-small': '#8B5CF6',
  'text-embedding-ada': '#A78BFA',
  'unknown': '#9CA3AF'
}

