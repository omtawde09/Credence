// AI Assistance Layer - Optional Enhancement for Rule-Based Agents
// This module provides OPTIONAL AI assistance for explanation enhancement only
// ALL business logic remains in deterministic .kiro framework

import { applyAgentConstraints } from './kiroIntegration.js';

/**
 * DeepSeek Configuration - Supports both Cloud API and Local Ollama
 * Uses environment variables only - never hardcoded keys
 */
const DEEPSEEK_CONFIG = {
    // Cloud API configuration
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || null,
    endpoint: import.meta.env.VITE_DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions',
    
    // Local Ollama configuration
    ollamaEndpoint: import.meta.env.VITE_OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate',
    ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || 'deepseek-r1:8b',
    
    // Deployment mode: 'cloud' or 'local'
    deploymentMode: import.meta.env.VITE_DEEPSEEK_MODE || 'local', // Default to local
    
    model: 'deepseek-v3.1', // For cloud API
    temperature: 0.1, // Low temperature for consistent, factual output
    timeout: 8000, // 8 second timeout for cloud API
    localTimeout: 15000, // 15 second timeout for local Ollama (slower)
    maxRetries: 1,
    enabled: false // Will be set based on configuration availability
};

/**
 * Initialize DeepSeek assistance layer - supports both Cloud and Local deployment
 * Checks configuration availability and sets enabled state
 */
export const initializeAIAssist = () => {
    // Determine deployment mode and availability
    if (DEEPSEEK_CONFIG.deploymentMode === 'local') {
        // Local Ollama mode - no API key required
        DEEPSEEK_CONFIG.enabled = true;
        console.log('DeepSeek assistance layer initialized - Local Ollama mode (deepseek-r1:8b)');
    } else {
        // Cloud API mode - requires API key
        DEEPSEEK_CONFIG.enabled = Boolean(DEEPSEEK_CONFIG.apiKey);
        
        if (DEEPSEEK_CONFIG.enabled) {
            console.log('DeepSeek v3.1 assistance layer initialized - Cloud API mode enabled');
        } else {
            console.log('AI assistance layer initialized - deterministic mode only (DeepSeek API key not configured)');
        }
    }
    
    // Import and run configuration validation
    import('./deepSeekConfigValidator.js')
        .then(({ displayConfigurationGuidance }) => {
            displayConfigurationGuidance();
        })
        .catch(() => {
            // Fallback if validator not available
            console.log(`DeepSeek assistance ready - Mode: ${DEEPSEEK_CONFIG.deploymentMode}, Enabled: ${DEEPSEEK_CONFIG.enabled}`);
        });
    
    return DEEPSEEK_CONFIG.enabled;
};

/**
 * Core DeepSeek call with safety constraints - supports both Cloud and Local
 * Returns structured output with validation status
 */
const callDeepSeekWithSafety = async (prompt, context = {}) => {
    // Immediate fallback if DeepSeek not available
    if (!DEEPSEEK_CONFIG.enabled) {
        return {
            success: false,
            content: null,
            fallbackUsed: true,
            reason: 'DeepSeek not available - check configuration'
        };
    }

    try {
        // Set timeout based on deployment mode
        const timeout = DEEPSEEK_CONFIG.deploymentMode === 'local' 
            ? DEEPSEEK_CONFIG.localTimeout 
            : DEEPSEEK_CONFIG.timeout;
            
        // Timeout wrapper for API call
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DEEPSEEK_TIMEOUT')), timeout)
        );

        // DeepSeek API call (cloud or local)
        const deepSeekCallPromise = DEEPSEEK_CONFIG.deploymentMode === 'local'
            ? callOllamaAPI(prompt, context)
            : callDeepSeekCloudAPI(prompt, context);
        
        const response = await Promise.race([deepSeekCallPromise, timeoutPromise]);
        
        return {
            success: true,
            content: response,
            fallbackUsed: false,
            reason: `DeepSeek enhancement successful (${DEEPSEEK_CONFIG.deploymentMode} mode)`
        };
        
    } catch (error) {
        console.warn(`DeepSeek assistance failed (${DEEPSEEK_CONFIG.deploymentMode} mode):`, error.message);
        
        return {
            success: false,
            content: null,
            fallbackUsed: true,
            reason: error.message === 'DEEPSEEK_TIMEOUT' ? 'DeepSeek timeout' : 'DeepSeek API error'
        };
    }
};

/**
 * Local Ollama API integration for DeepSeek R1
 * Uses Ollama's generate endpoint with DeepSeek model
 */
const callOllamaAPI = async (prompt, context) => {
    const systemPrompt = `You are a financial explanation enhancer. Your ONLY role is to rewrite existing explanations for clarity.

ABSOLUTE CONSTRAINTS:
- Never give advice or recommendations
- Never use guarantees or certainties
- Never add new facts or risks
- Never use metaphors or analogies
- Use neutral, regulated tone only
- Preserve all numerical values exactly
- Preserve all uncertainty acknowledgments

FORBIDDEN PHRASES:
- "guaranteed", "no risk", "you should"
- "imagine", "think of it as", "like"
- "always", "never", "certain"

Your task: Rewrite the given explanation for better clarity while preserving exact meaning and all constraints.`;

    const fullPrompt = `${systemPrompt}\n\nRewrite this financial explanation for clarity: "${prompt}"`;

    const requestBody = {
        model: DEEPSEEK_CONFIG.ollamaModel,
        prompt: fullPrompt,
        stream: false,
        options: {
            temperature: DEEPSEEK_CONFIG.temperature,
            num_predict: Math.min(prompt.length * 2, 1000) // Reasonable expansion limit
        }
    };

    const response = await fetch(DEEPSEEK_CONFIG.ollamaEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.response) {
        throw new Error('Invalid Ollama API response format');
    }

    return data.response.trim();
};

/**
 * DeepSeek v3.1 Cloud REST API integration
 * HTTPS REST calls only with regulated system prompt
 */
const callDeepSeekCloudAPI = async (prompt, context) => {
    const systemPrompt = `You are a financial explanation enhancer. Your ONLY role is to rewrite existing explanations for clarity.

ABSOLUTE CONSTRAINTS:
- Never give advice or recommendations
- Never use guarantees or certainties
- Never add new facts or risks
- Never use metaphors or analogies
- Use neutral, regulated tone only
- Preserve all numerical values exactly
- Preserve all uncertainty acknowledgments

FORBIDDEN PHRASES:
- "guaranteed", "no risk", "you should"
- "imagine", "think of it as", "like"
- "always", "never", "certain"

Your task: Rewrite the given explanation for better clarity while preserving exact meaning and all constraints.`;

    const requestBody = {
        model: DEEPSEEK_CONFIG.model,
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user", 
                content: `Rewrite this financial explanation for clarity: "${prompt}"`
            }
        ],
        temperature: DEEPSEEK_CONFIG.temperature,
        max_tokens: Math.min(prompt.length * 2, 1000), // Reasonable expansion limit
        stream: false
    };

    const response = await fetch(DEEPSEEK_CONFIG.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`DeepSeek Cloud API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid DeepSeek Cloud API response format');
    }

    return data.choices[0].message.content.trim();
};

/**
 * MANDATORY SAFETY GATE - Validate DeepSeek output against .kiro constraints
 * CRITICAL: All LLM outputs must pass validation
 */
const validateDeepSeekOutput = (deepSeekContent, originalContent, context) => {
    const validation = {
        isValid: true,
        violations: [],
        sanitizedContent: deepSeekContent
    };

    // Structural validation
    if (!deepSeekContent || typeof deepSeekContent !== 'string' || deepSeekContent.length === 0) {
        validation.isValid = false;
        validation.violations.push('Empty or invalid DeepSeek content');
        return validation;
    }

    // Length validation - prevent excessive expansion
    if (deepSeekContent.length > originalContent.length * 3) {
        validation.isValid = false;
        validation.violations.push('DeepSeek content exceeds reasonable expansion limit (3x original)');
        return validation;
    }

    // Apply .kiro agent constraints validation
    const constraintCheck = applyAgentConstraints({
        description: deepSeekContent,
        type: 'explanation',
        confidence: context.confidence || 0.5
    }, context);

    if (constraintCheck.violations.length > 0) {
        validation.isValid = false;
        validation.violations.push(...constraintCheck.violations);
        return validation;
    }

    // MANDATORY SAFETY GATE - Forbidden language detection
    const forbiddenPhrases = [
        // Certainty language (violates .kiro constraints)
        'guaranteed', 'certain', 'always', 'never fails', 'no risk',
        'risk-free', 'automatic', 'will definitely', 'no chance of loss',
        'perfect solution', 'completely safe', 'absolutely',
        
        // Advice language (violates narrator role)
        'you should', 'you must', 'i recommend', 'my advice',
        'i suggest', 'you need to', 'it would be best',
        
        // Metaphor/analogy language (violates system prompt)
        'imagine', 'think of it as', 'like', 'similar to',
        'picture this', 'consider it as', 'it\'s like'
    ];

    const lowerContent = deepSeekContent.toLowerCase();
    const foundViolations = forbiddenPhrases.filter(phrase => 
        lowerContent.includes(phrase.toLowerCase())
    );

    if (foundViolations.length > 0) {
        validation.isValid = false;
        validation.violations.push(`Forbidden language detected: ${foundViolations.join(', ')}`);
        return validation;
    }

    // Numerical value preservation check
    const originalNumbers = originalContent.match(/[\d,]+\.?\d*/g) || [];
    const deepSeekNumbers = deepSeekContent.match(/[\d,]+\.?\d*/g) || [];
    
    if (originalNumbers.length !== deepSeekNumbers.length) {
        validation.isValid = false;
        validation.violations.push('Numerical values not preserved exactly');
        return validation;
    }

    return validation;
};

/**
 * APPROVED USAGE: Enhance explanations generated from .kiro reasoning
 * Input: Deterministic explanation from rules
 * Output: Enhanced clarity while preserving meaning
 */
export const enhanceExplanation = async (originalExplanation, context = {}) => {
    // Always provide fallback content
    const fallbackContent = originalExplanation;
    
    if (!DEEPSEEK_CONFIG.enabled) {
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const deepSeekResult = await callDeepSeekWithSafety(originalExplanation, context);
    
    if (!deepSeekResult.success) {
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic',
            reason: deepSeekResult.reason
        };
    }

    // Validate DeepSeek output
    const validation = validateDeepSeekOutput(deepSeekResult.content, originalExplanation, context);
    
    if (!validation.isValid) {
        console.warn('DeepSeek output validation failed:', validation.violations);
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic',
            reason: 'DeepSeek validation failed'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'deepseek_enhanced',
        originalContent: originalExplanation
    };
};

/**
 * APPROVED USAGE: Summarize advisor-facing client context
 * Input: Structured client data from deterministic analysis
 * Output: Natural language summary for advisor dashboard
 */
export const summarizeClientContext = async (clientData, context = {}) => {
    // Generate deterministic fallback summary
    const fallbackSummary = generateDeterministicSummary(clientData);
    
    if (!DEEPSEEK_CONFIG.enabled) {
        return {
            content: fallbackSummary,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const deepSeekResult = await callDeepSeekWithSafety(
        `Create a professional summary for an advisor based on this client analysis: ${JSON.stringify(clientData, null, 2)}`, 
        context
    );
    
    if (!deepSeekResult.success) {
        return {
            content: fallbackSummary,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateDeepSeekOutput(deepSeekResult.content, fallbackSummary, context);
    
    if (!validation.isValid) {
        return {
            content: fallbackSummary,
            enhanced: false,
            source: 'deterministic'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'deepseek_enhanced'
    };
};

/**
 * APPROVED USAGE: Generate plain-language versions of deterministic decisions
 * Input: Technical decision output from .kiro rules
 * Output: User-friendly explanation of the same decision
 */
export const translateDecisionToPlainLanguage = async (technicalDecision, context = {}) => {
    const fallbackTranslation = generatePlainLanguageFallback(technicalDecision);
    
    if (!DEEPSEEK_CONFIG.enabled) {
        return {
            content: fallbackTranslation,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const deepSeekResult = await callDeepSeekWithSafety(
        `Translate this technical financial decision into clear, simple language for a general audience: "${JSON.stringify(technicalDecision)}"`,
        context
    );
    
    if (!deepSeekResult.success) {
        return {
            content: fallbackTranslation,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateDeepSeekOutput(deepSeekResult.content, fallbackTranslation, context);
    
    if (!validation.isValid) {
        return {
            content: fallbackTranslation,
            enhanced: false,
            source: 'deterministic'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'deepseek_enhanced'
    };
};

/**
 * APPROVED USAGE: Expand "What could go wrong?" narratives
 * Input: Known risks from .kiro decision graphs
 * Output: Expanded explanation of existing risks (no new risks invented)
 */
export const expandRiskNarrative = async (knownRisks, context = {}) => {
    const fallbackNarrative = generateDeterministicRiskNarrative(knownRisks);
    
    if (!DEEPSEEK_CONFIG.enabled) {
        return {
            content: fallbackNarrative,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const deepSeekResult = await callDeepSeekWithSafety(
        `Expand on these identified financial risks with clear explanations, without adding new risks: ${JSON.stringify(knownRisks)}`,
        context
    );
    
    if (!deepSeekResult.success) {
        return {
            content: fallbackNarrative,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateDeepSeekOutput(deepSeekResult.content, fallbackNarrative, context);
    
    if (!validation.isValid) {
        return {
            content: fallbackNarrative,
            enhanced: false,
            source: 'deterministic'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'deepseek_enhanced'
    };
};

/**
 * Deterministic fallback functions
 * These ensure the system works fully without AI
 */
const generateDeterministicSummary = (clientData) => {
    return `Client: ${clientData.name || 'Unknown'}, Risk Profile: ${clientData.riskProfile || 'Not assessed'}, Goals: ${clientData.goals?.length || 0} defined goals.`;
};

const generatePlainLanguageFallback = (technicalDecision) => {
    return `Decision: ${technicalDecision.type || 'Assessment'} - ${technicalDecision.reasoning || 'Based on analysis of your situation'}.`;
};

const generateDeterministicRiskNarrative = (knownRisks) => {
    if (!knownRisks || knownRisks.length === 0) {
        return 'No significant risks identified in current analysis.';
    }
    
    return knownRisks.map(risk => 
        `${risk.type}: ${risk.description} (Probability: ${risk.probability || 'Unknown'})`
    ).join('. ');
};

/**
 * System health check for DeepSeek assistance
 * Returns current status and capabilities
 */
export const getAIAssistStatus = () => {
    return {
        enabled: DEEPSEEK_CONFIG.enabled,
        deploymentMode: DEEPSEEK_CONFIG.deploymentMode,
        
        // Cloud API status
        apiKeyPresent: Boolean(DEEPSEEK_CONFIG.apiKey),
        cloudEndpoint: DEEPSEEK_CONFIG.endpoint,
        cloudModel: DEEPSEEK_CONFIG.model,
        
        // Local Ollama status
        ollamaEndpoint: DEEPSEEK_CONFIG.ollamaEndpoint,
        ollamaModel: DEEPSEEK_CONFIG.ollamaModel,
        
        // Common settings
        temperature: DEEPSEEK_CONFIG.temperature,
        timeout: DEEPSEEK_CONFIG.deploymentMode === 'local' 
            ? DEEPSEEK_CONFIG.localTimeout 
            : DEEPSEEK_CONFIG.timeout,
        mode: DEEPSEEK_CONFIG.enabled 
            ? `deepseek_${DEEPSEEK_CONFIG.deploymentMode}` 
            : 'deterministic_only'
    };
};

/**
 * Log DeepSeek usage for accountability
 * Does NOT log user data, prompts, or responses
 */
export const logAIUsage = (operation, success, reason = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation: operation,
        success: success,
        reason: reason,
        deploymentMode: DEEPSEEK_CONFIG.deploymentMode,
        model: DEEPSEEK_CONFIG.deploymentMode === 'local' 
            ? DEEPSEEK_CONFIG.ollamaModel 
            : DEEPSEEK_CONFIG.model,
        mode: DEEPSEEK_CONFIG.enabled 
            ? `deepseek_${DEEPSEEK_CONFIG.deploymentMode}` 
            : 'deterministic'
    };
    
    // In production, send to proper logging system
    console.log('DeepSeek Usage:', logEntry);
};

// Initialize on module load
initializeAIAssist();