import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  ChevronDown,
  Clock,
  Cpu,
  Terminal,
  AlertCircle,
  Layers,
  Wand2,
  MessageSquare,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import './EnhancePrompts.css'

// Enhanced Prompt Trace Item Component
function EnhancePromptTraceItem({ trace, index }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getNodeLabel = () => {
    if (trace.name) return trace.name
    if (trace.api) return trace.api
    return trace.provider || 'Unknown'
  }

  const formatDuration = (ms) => {
    if (!ms) return '—'
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getInputContent = () => {
    // OpenAI format: request.messages array
    if (trace.request?.messages && Array.isArray(trace.request.messages)) {
      const userMessage = trace.request.messages.find(m => m.role === 'user')
      if (userMessage) return userMessage.content
      // If no user message, return last message content
      const lastMsg = trace.request.messages[trace.request.messages.length - 1]
      return lastMsg?.content || null
    }
    // Gemini/other format: request.contents
    if (trace.request?.contents) return trace.request.contents
    // Function args
    if (trace.args && trace.args.length > 1) {
      return typeof trace.args[1] === 'string' ? trace.args[1] : JSON.stringify(trace.args[1], null, 2)
    }
    return null
  }

  const getSystemContent = () => {
    // OpenAI format: system message in messages array
    if (trace.request?.messages && Array.isArray(trace.request.messages)) {
      const systemMessage = trace.request.messages.find(m => m.role === 'system')
      if (systemMessage) return systemMessage.content
    }
    // Gemini/other format: config.system_instruction
    if (trace.request?.config?.system_instruction) {
      return trace.request.config.system_instruction
    }
    return null
  }

  const getOutputContent = () => {
    if (trace.response?.text) return trace.response.text
    if (trace.result) return typeof trace.result === 'string' ? trace.result : JSON.stringify(trace.result, null, 2)
    return null
  }

  return (
    <motion.div
      className="enhance-trace-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <div 
        className="enhance-trace-item__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`enhance-trace-item__icon enhance-trace-item__icon--${trace.event_type || trace.provider}`}>
          {trace.event_type === 'function' || trace.provider === 'function' ? (
            <Terminal size={14} />
          ) : (
            <Cpu size={14} />
          )}
        </div>
        
        <div className="enhance-trace-item__info">
          <span className="enhance-trace-item__name">{getNodeLabel()}</span>
          {trace.request?.model && (
            <span className="enhance-trace-item__model">{trace.request.model}</span>
          )}
        </div>

        <div className="enhance-trace-item__meta">
          {trace.duration_ms && (
            <span className="enhance-trace-item__duration">
              <Clock size={12} />
              {formatDuration(trace.duration_ms)}
            </span>
          )}
          <button className="enhance-trace-item__toggle">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="enhance-trace-item__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="enhance-trace-item__content">
              {/* Input Section */}
              {getInputContent() && (
                <div className="enhance-trace-item__section">
                  <div className="enhance-trace-item__section-label">
                    <MessageSquare size={12} />
                    Input
                  </div>
                  <div className="enhance-trace-item__text">
                    {getInputContent()}
                  </div>
                </div>
              )}

              {/* System Instruction */}
              {getSystemContent() && (
                <div className="enhance-trace-item__section">
                  <div className="enhance-trace-item__section-label">
                    <Terminal size={12} />
                    System
                  </div>
                  <div className="enhance-trace-item__text enhance-trace-item__text--system">
                    {getSystemContent()}
                  </div>
                </div>
              )}

              {/* Output Section */}
              {getOutputContent() && (
                <div className="enhance-trace-item__section">
                  <div className="enhance-trace-item__section-label">
                    <ArrowRight size={12} />
                    Output
                  </div>
                  <div className="enhance-trace-item__text enhance-trace-item__text--output">
                    {getOutputContent()}
                  </div>
                </div>
              )}

              {/* Token Usage */}
              {trace.response?.usage && (
                <div className="enhance-trace-item__tokens">
                  <span>Tokens: {trace.response.usage.total_token_count || trace.response.usage.total_tokens || 0}</span>
                  {(trace.response.usage.prompt_token_count || trace.response.usage.prompt_tokens) && (
                    <span className="enhance-trace-item__tokens-detail">
                      (in: {trace.response.usage.prompt_token_count || trace.response.usage.prompt_tokens}, 
                      out: {trace.response.usage.candidates_token_count || trace.response.usage.completion_tokens || 0})
                    </span>
                  )}
                </div>
              )}

              {/* Children traces */}
              {trace.children && trace.children.length > 0 && (
                <div className="enhance-trace-item__children">
                  <div className="enhance-trace-item__children-label">
                    <Layers size={12} />
                    Child Traces ({trace.children.length})
                  </div>
                  {trace.children.map((child, i) => (
                    <EnhancePromptTraceItem 
                      key={child.span_id || i} 
                      trace={child} 
                      index={i} 
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Main EnhancePrompts Component
export default function EnhancePrompts({ data, isAggregated = false, sessions = [] }) {
  const [selectedGroupKey, setSelectedGroupKey] = useState(null)

  // Create a unique key for grouping by function signature
  const createGroupKey = (trace) => {
    return `${trace.provider || ''}|${trace.api || ''}|${trace.name || ''}|${trace.module || ''}`
  }

  // Collect all enh_prompt traces and group by function signature
  // Groups are created by matching: provider, api, name, module
  const { enhPromptGroups, groupKeys } = useMemo(() => {
    const groups = new Map() // key -> { label, traces: [...] }
    
    const processSessionData = (sessionData, sessionName = null) => {
      const traceTree = sessionData?.trace_tree || []
      const functionEvents = sessionData?.function_events || []
      
      // Find all traces with enh_prompt=true from function_events
      functionEvents.forEach(event => {
        if (event.enh_prompt) {
          const key = createGroupKey(event)
          if (!groups.has(key)) {
            groups.set(key, {
              key,
              provider: event.provider,
              api: event.api,
              name: event.name,
              module: event.module,
              label: event.name || event.api || 'Enhancement Group',
              traces: []
            })
          }
          
          // Find full trace from trace_tree to get children
          const fullTrace = findTraceInTree(traceTree, event.span_id)
          groups.get(key).traces.push({
            ...event,
            children: fullTrace?.children || [],
            sessionName,
            sessionData
          })
        }
      })
      
      // Also search trace_tree directly for enh_prompt entries
      const searchTraceTree = (traces) => {
        traces.forEach(trace => {
          if (trace.enh_prompt && trace.provider === 'function') {
            const key = createGroupKey(trace)
            // Check if not already added from function_events
            const existingGroup = groups.get(key)
            const alreadyAdded = existingGroup?.traces.some(t => t.span_id === trace.span_id)
            
            if (!alreadyAdded) {
              if (!groups.has(key)) {
                groups.set(key, {
                  key,
                  provider: trace.provider,
                  api: trace.api,
                  name: trace.name,
                  module: trace.module,
                  label: trace.name || trace.api || 'Enhancement Group',
                  traces: []
                })
              }
              groups.get(key).traces.push({
                ...trace,
                sessionName,
                sessionData
              })
            }
          }
          if (trace.children && trace.children.length > 0) {
            searchTraceTree(trace.children)
          }
        })
      }
      searchTraceTree(traceTree)
    }
    
    // Helper to find a trace in the tree by span_id
    const findTraceInTree = (traces, spanId) => {
      for (const trace of traces) {
        if (trace.span_id === spanId) return trace
        if (trace.children && trace.children.length > 0) {
          const found = findTraceInTree(trace.children, spanId)
          if (found) return found
        }
      }
      return null
    }
    
    if (isAggregated && sessions.length > 0) {
      sessions.forEach(session => {
        processSessionData(session.data, session.fileName)
      })
    } else if (data) {
      processSessionData(data, null)
    }
    
    return {
      enhPromptGroups: groups,
      groupKeys: Array.from(groups.keys())
    }
  }, [data, isAggregated, sessions])

  // Compute effective selected key (defaults to first group)
  const effectiveSelectedKey = useMemo(() => {
    if (selectedGroupKey && enhPromptGroups.has(selectedGroupKey)) {
      return selectedGroupKey
    }
    return groupKeys.length > 0 ? groupKeys[0] : null
  }, [selectedGroupKey, enhPromptGroups, groupKeys])

  // Get selected group data
  const selectedGroup = useMemo(() => {
    return effectiveSelectedKey ? enhPromptGroups.get(effectiveSelectedKey) : null
  }, [enhPromptGroups, effectiveSelectedKey])

  // Extract and group common prompts from all child traces in the selected group
  const commonPrompts = useMemo(() => {
    if (!selectedGroup) return []
    
    const promptMap = new Map() // key -> { signature, instances: [...] }
    
    // Helper to extract prompt signature from a trace
    const getPromptSignature = (trace) => {
      let systemPrompt = ''
      if (trace.request?.messages) {
        const sysMsg = trace.request.messages.find(m => m.role === 'system')
        systemPrompt = sysMsg?.content || ''
      } else if (trace.request?.config?.system_instruction) {
        systemPrompt = trace.request.config.system_instruction
      }
      
      // Create a signature based on provider, api, model, and system prompt
      return `${trace.provider || ''}|${trace.api || ''}|${trace.request?.model || ''}|${systemPrompt.substring(0, 100)}`
    }
    
    // Helper to get display info from a trace
    const getPromptInfo = (trace) => {
      let systemPrompt = ''
      let userPromptTemplate = ''
      
      if (trace.request?.messages) {
        const sysMsg = trace.request.messages.find(m => m.role === 'system')
        const userMsg = trace.request.messages.find(m => m.role === 'user')
        systemPrompt = sysMsg?.content || ''
        userPromptTemplate = userMsg?.content || ''
      } else if (trace.request?.config?.system_instruction) {
        systemPrompt = trace.request.config.system_instruction
      }
      if (trace.request?.contents) {
        userPromptTemplate = trace.request.contents
      }
      
      return {
        provider: trace.provider,
        api: trace.api,
        model: trace.request?.model,
        systemPrompt,
        userPromptTemplate,
        output: trace.response?.text || ''
      }
    }
    
    // Collect all child traces from all traces in the group
    selectedGroup.traces.forEach((parentTrace, parentIndex) => {
      if (parentTrace.children && parentTrace.children.length > 0) {
        parentTrace.children.forEach(childTrace => {
          const signature = getPromptSignature(childTrace)
          
          if (!promptMap.has(signature)) {
            const info = getPromptInfo(childTrace)
            promptMap.set(signature, {
              id: signature,
              ...info,
              instances: []
            })
          }
          
          promptMap.get(signature).instances.push({
            parentIndex,
            sessionName: parentTrace.sessionName,
            trace: childTrace,
            input: getPromptInfo(childTrace).userPromptTemplate,
            output: childTrace.response?.text || ''
          })
        })
      }
    })
    
    // Convert to array and sort by instance count (most common first)
    return Array.from(promptMap.values()).sort((a, b) => b.instances.length - a.instances.length)
  }, [selectedGroup])

  // State for selected prompt to optimize
  const [selectedPromptId, setSelectedPromptId] = useState(null)

  // Handle dropdown change
  const handleSelectChange = (e) => {
    setSelectedGroupKey(e.target.value)
    setSelectedPromptId(null) // Reset prompt selection when group changes
  }
  
  // Handle prompt click
  const handlePromptClick = (promptId) => {
    setSelectedPromptId(selectedPromptId === promptId ? null : promptId)
  }

  // Calculate total traces across all groups
  const totalTraces = useMemo(() => {
    let count = 0
    enhPromptGroups.forEach(group => {
      count += group.traces.length
    })
    return count
  }, [enhPromptGroups])

  // Empty state
  if (groupKeys.length === 0) {
    return (
      <div className="enhance-prompts">
        <div className="enhance-prompts__empty">
          <Sparkles size={40} />
          <h3>No Enhancement Traces</h3>
          <p>
            No prompts have been flagged for enhancement.
            Use <code>@observe(enh_prompt=True)</code> to enable tracking.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="enhance-prompts">
      {/* Header with dropdown and button */}
      <div className="enhance-prompts__header">
        <div className="enhance-prompts__title">
          <Wand2 size={18} />
          <h3>Enhance Prompts</h3>
          <span className="enhance-prompts__stats">
            {groupKeys.length} group{groupKeys.length !== 1 ? 's' : ''} · {totalTraces} trace{totalTraces !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="enhance-prompts__controls">
          <div className="enhance-prompts__select-wrapper">
            <select 
              id="enh-prompt-select"
              className="enhance-prompts__select"
              value={effectiveSelectedKey || ''}
              onChange={handleSelectChange}
            >
              {groupKeys.map((key) => {
                const group = enhPromptGroups.get(key)
                return (
                  <option key={key} value={key}>
                    {group.label} ({group.traces.length} trace{group.traces.length !== 1 ? 's' : ''})
                  </option>
                )
              })}
            </select>
            <ChevronDown size={14} className="enhance-prompts__select-icon" />
          </div>
          
          <button className="enhance-prompts__enhance-btn enhance-prompts__enhance-btn--disabled" disabled>
            <Wand2 size={14} />
            Enhance All
            <span className="enhance-prompts__coming-soon">Coming Soon</span>
          </button>
        </div>
      </div>

      {/* Selected group info */}
      {selectedGroup && (
        <div className="enhance-prompts__info">
          <div className="enhance-prompts__info-row">
            <div className="enhance-prompts__badge">
              <Terminal size={14} />
              {selectedGroup.provider}
            </div>
            <span className="enhance-prompts__trace-count">
              {selectedGroup.traces.length} trace{selectedGroup.traces.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="enhance-prompts__group-details">
            <div className="enhance-prompts__detail">
              <span className="enhance-prompts__detail-label">API:</span>
              <code>{selectedGroup.api}</code>
            </div>
            {selectedGroup.module && (
              <div className="enhance-prompts__detail">
                <span className="enhance-prompts__detail-label">Module:</span>
                <code>{selectedGroup.module}</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Common Prompts - Optimizable */}
      {commonPrompts.length > 0 && (
        <div className="enhance-prompts__common">
          <div className="enhance-prompts__common-header">
            <div className="enhance-prompts__common-title">
              <Sparkles size={14} />
              <span>Prompts to Optimize</span>
            </div>
            <span className="enhance-prompts__common-count">
              {commonPrompts.length} unique prompt{commonPrompts.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="enhance-prompts__common-list">
            {commonPrompts.map((prompt) => (
              <div 
                key={prompt.id} 
                className={`enhance-prompts__prompt-card ${selectedPromptId === prompt.id ? 'enhance-prompts__prompt-card--selected' : ''}`}
                onClick={() => handlePromptClick(prompt.id)}
              >
                <div className="enhance-prompts__prompt-header">
                  <div className="enhance-prompts__prompt-info">
                    <Cpu size={14} />
                    <span className="enhance-prompts__prompt-api">{prompt.api}</span>
                    {prompt.model && (
                      <span className="enhance-prompts__prompt-model">{prompt.model}</span>
                    )}
                  </div>
                  <div className="enhance-prompts__prompt-meta">
                    <span className="enhance-prompts__prompt-instances">
                      {prompt.instances.length} call{prompt.instances.length !== 1 ? 's' : ''}
                    </span>
                    <button className="enhance-prompts__prompt-toggle">
                      {selectedPromptId === prompt.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                </div>
                
                {prompt.systemPrompt && (
                  <div className="enhance-prompts__prompt-preview">
                    <Terminal size={12} />
                    <span>{prompt.systemPrompt.substring(0, 100)}{prompt.systemPrompt.length > 100 ? '...' : ''}</span>
                  </div>
                )}
                
                <AnimatePresence>
                  {selectedPromptId === prompt.id && (
                    <motion.div
                      className="enhance-prompts__prompt-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Full System Prompt */}
                      {prompt.systemPrompt && (
                        <div className="enhance-prompts__prompt-section">
                          <div className="enhance-prompts__prompt-section-label">
                            <Terminal size={12} />
                            System Prompt
                          </div>
                          <div className="enhance-prompts__prompt-text enhance-prompts__prompt-text--system">
                            {prompt.systemPrompt}
                          </div>
                        </div>
                      )}
                      
                      {/* Instances */}
                      <div className="enhance-prompts__prompt-section">
                        <div className="enhance-prompts__prompt-section-label">
                          <Layers size={12} />
                          Instances ({prompt.instances.length})
                        </div>
                        <div className="enhance-prompts__prompt-instances-list">
                          {prompt.instances.map((instance, idx) => (
                            <div key={idx} className="enhance-prompts__prompt-instance">
                              <div className="enhance-prompts__prompt-instance-header">
                                <span className="enhance-prompts__prompt-instance-num">#{idx + 1}</span>
                                {instance.sessionName && (
                                  <span className="enhance-prompts__prompt-instance-session">{instance.sessionName}</span>
                                )}
                              </div>
                              <div className="enhance-prompts__prompt-instance-io">
                                <div className="enhance-prompts__prompt-instance-input">
                                  <MessageSquare size={10} />
                                  <span>{instance.input?.substring(0, 150)}{instance.input?.length > 150 ? '...' : ''}</span>
                                </div>
                                <ArrowRight size={12} className="enhance-prompts__prompt-instance-arrow" />
                                <div className="enhance-prompts__prompt-instance-output">
                                  <span>{instance.output?.substring(0, 150)}{instance.output?.length > 150 ? '...' : ''}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Optimize Button */}
                      <div className="enhance-prompts__prompt-actions">
                        <button className="enhance-prompts__optimize-btn" disabled>
                          <Wand2 size={14} />
                          Optimize This Prompt
                          <span className="enhance-prompts__coming-soon">Coming Soon</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traces list */}
      <div className="enhance-prompts__traces">
        <div className="enhance-prompts__traces-header">
          <Layers size={14} />
          <span>All Traces in Group</span>
        </div>
        <div className="enhance-prompts__traces-list">
          {selectedGroup && selectedGroup.traces.length > 0 ? (
            selectedGroup.traces.map((trace, index) => (
              <div key={trace.span_id || index} className="enhance-prompts__trace-wrapper">
                {trace.sessionName && (
                  <div className="enhance-prompts__trace-session">
                    {trace.sessionName}
                  </div>
                )}
                <EnhancePromptTraceItem 
                  trace={trace}
                  index={index}
                />
              </div>
            ))
          ) : (
            <div className="enhance-prompts__no-traces">
              No traces found for this enhancement group.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

