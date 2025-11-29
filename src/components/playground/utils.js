import { MODEL_PRICING, MODEL_COLORS } from './constants'

/**
 * Format duration in milliseconds to human-readable string
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export function formatDuration(ms) {
  if (!ms) return '—'
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Format timestamp to localized date string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date
 */
export function formatDate(timestamp) {
  if (!timestamp) return '—'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

/**
 * Format timestamp to localized time string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted time
 */
export function formatTime(timestamp) {
  if (!timestamp) return '—'
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/**
 * Format timestamp to localized date-time string
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date-time
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return '—'
  const date = new Date(timestamp * 1000)
  return date.toLocaleString(undefined, { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

/**
 * Format file size in bytes to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Get prompt/input text from various API formats
 * @param {object} request - Request object
 * @param {string} api - API endpoint name
 * @returns {string} Prompt text
 */
export function getPromptText(request, api) {
  if (!request) return 'N/A'
  // For embeddings.create, input is an array of strings
  if (api === 'embeddings.create' && request.input) {
    return Array.isArray(request.input) ? request.input.join(' | ') : request.input
  }
  // For chat.completions.create, messages is an array
  if (request.messages && Array.isArray(request.messages)) {
    const lastUserMsg = request.messages.filter(m => m.role === 'user').pop()
    return lastUserMsg?.content || request.messages[0]?.content || 'N/A'
  }
  // Gemini format uses contents
  if (request.contents) {
    return request.contents
  }
  return 'N/A'
}

/**
 * Extract all LLM events from trace tree recursively
 * @param {array} traceTree - Trace tree array
 * @param {array} events - Accumulator array for events
 * @param {string} sessionName - Optional session name
 * @returns {array} Extracted events
 */
export function extractLLMEvents(traceTree, events = [], sessionName = null) {
  if (!traceTree) return events
  
  for (const node of traceTree) {
    // Check if this is an LLM call (has provider and response)
    if (node.provider && node.provider !== 'function' && node.duration_ms) {
      const usage = node.response?.usage || {}
      const api = node.api || 'unknown'
      const isEmbedding = api === 'embeddings.create'
      events.push({
        ...node,
        api,
        prompt: getPromptText(node.request, api),
        // Support both OpenAI (total_tokens) and Gemini (total_token_count) formats
        tokens: usage.total_tokens || usage.total_token_count || 0,
        inputTokens: usage.prompt_tokens || usage.prompt_token_count || 0,
        // Embeddings don't have output tokens
        outputTokens: isEmbedding ? 0 : (usage.completion_tokens || usage.candidates_token_count || 0),
        cachedTokens: usage.cached_content_token_count || usage.cached_tokens || 0,
        reasoningTokens: usage.thoughts_token_count || usage.reasoning_tokens || 0,
        toolUseTokens: usage.tool_use_prompt_token_count || 0,
        model: node.request?.model || 'unknown',
        // Embedding-specific fields
        embeddingDimensions: isEmbedding ? node.response?.embedding_dimensions : null,
        sessionName
      })
    }
    // Recursively process children
    if (node.children && node.children.length > 0) {
      extractLLMEvents(node.children, events, sessionName)
    }
  }
  
  return events
}

/**
 * Get provider from model name
 * @param {string} model - Model name
 * @returns {string} Provider name
 */
export function getProviderFromModel(model) {
  if (!model) return 'other'
  const modelLower = model.toLowerCase()
  // OpenAI models include GPT, o1, o3, and embedding models
  if (modelLower.includes('gpt') || modelLower.includes('o1') || modelLower.includes('o3') || modelLower.includes('text-embedding')) return 'openai'
  if (modelLower.includes('gemini')) return 'gemini'
  if (modelLower.includes('claude')) return 'anthropic'
  return 'other'
}

/**
 * Get color for model visualization
 * @param {string} model - Model name
 * @returns {string} Hex color code
 */
export function getModelColor(model) {
  const key = Object.keys(MODEL_COLORS).find(k => model?.toLowerCase().includes(k))
  return MODEL_COLORS[key] || MODEL_COLORS.unknown
}

/**
 * Calculate cost for an event based on token usage
 * @param {object} event - Event object with token data
 * @returns {number} Cost in dollars
 */
export function calculateCost(event) {
  const model = event.model?.toLowerCase() || 'default'
  const pricing = Object.entries(MODEL_PRICING).find(([key]) => model.includes(key))?.[1] || MODEL_PRICING.default
  const inputCost = ((event.inputTokens || 0) / 1_000_000) * pricing.input
  const outputCost = ((event.outputTokens || 0) / 1_000_000) * pricing.output
  return inputCost + outputCost
}

/**
 * Truncate string to specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLen - Maximum length
 * @returns {string} Truncated string
 */
export function truncateString(str, maxLen = 60) {
  if (!str || str === 'N/A') return 'N/A'
  if (str.length <= maxLen) return str
  return str.substring(0, maxLen) + '...'
}

/**
 * Validate observability JSON structure
 * @param {object} data - Parsed JSON data
 * @param {string} fileName - File name for error messages
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateObservabilityJson(data, fileName) {
  // Check if sessions key exists and is an array
  if (!data.sessions || !Array.isArray(data.sessions)) {
    return {
      valid: false,
      error: `"${fileName}" is not a valid aiobs observability file. Missing "sessions" array.`
    }
  }
  
  // Check if sessions array has at least one entry with an id
  if (data.sessions.length === 0 || !data.sessions[0]?.id) {
    return {
      valid: false,
      error: `"${fileName}" is not a valid aiobs observability file. Sessions must contain at least one entry with an "id".`
    }
  }
  
  return { valid: true }
}

