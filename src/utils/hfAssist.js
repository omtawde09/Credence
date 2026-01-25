// Hugging Face Inference API Integration - Optional Enhancement for Rule-Based Agents
// This module provides OPTIONAL AI assistance for explanation enhancement only
// ALL business logic remains in deterministic .kiro framework

import { applyAgentConstraints } from './kiroIntegration.js';

/**
 * Hugging Face Inference API Configuration
 * Uses environment variables only - never hardcoded tokens
 */
const HF_CONFIG = {
    apiToken: import.meta.env.VITE_HF_API_TOKEN || null,
    endpoint: 'https://api-inference.huggingface.co/models/gpt2',
    timeout: 20000, // 20 second timeout for inference API
    maxRetries: 2,
    enabled: false // Will be set based on API token availability
};

/**
 * Initialize Hugging Face assistance layer
 * Checks API token availability and sets enabled state
 */
export const initializeHFAssist = () => {
    // Disable Hugging Face due to API deprecation
    HF_CONFIG.enabled = false;
    
    console.log('Hugging Face assistance disabled - API endpoint deprecated');
    console.log('Using simple rule-based enhancement instead for better reliability');
    
    return HF_CONFIG.enabled;
};

/**
 * Core Hugging Face Inference API call with safety constraints
 * Returns structured output with validation status
 */
const callHuggingFaceWithSafety = async (prompt, context = {}) => {
    // Immediate fallback if Hugging Face not available
    if (!HF_CONFIG.enabled) {
        return {
            success: false,
            content: null,
            fallbackUsed: true,
            reason: 'Hugging Face API not available - HF_API_TOKEN not configured'
        };
    }

    let lastError = null;
    
    // Retry logic for model loading
    for (let attempt = 0; attempt <= HF_CONFIG.maxRetries; attempt++) {
        try {
            // Timeout wrapper for API call
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('HF_TIMEOUT')), HF_CONFIG.timeout)
            );

            // Hugging Face Inference API call
            const hfCallPromise = callHuggingFaceAPI(prompt, context);
            
            const response = await Promise.race([hfCallPromise, timeoutPromise]);
            
            return {
                success: true,
                content: response,
                fallbackUsed: false,
                reason: 'Hugging Face enhancement successful'
            };
            
        } catch (error) {
            lastError = error;
            console.warn(`Hugging Face attempt ${attempt + 1} failed:`, error.message);
            
            // If it's a model loading error, wait and retry
            if (error.message.includes('loading') && attempt < HF_CONFIG.maxRetries) {
                console.log(`Model loading, waiting 5 seconds before retry ${attempt + 2}...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
                continue;
            }
            
            // For other errors, don't retry
            break;
        }
    }
    
    return {
        success: false,
        content: null,
        fallbackUsed: true,
        reason: lastError?.message === 'HF_TIMEOUT' ? 'Hugging Face timeout' : `Hugging Face API error: ${lastError?.message}`
    };
};

/**
 * Hugging Face Inference API integration
 * Uses text-generation model for explanation enhancement
 */
const callHuggingFaceAPI = async (prompt, context) => {
    // For text generation model, we'll use it to enhance financial text
    const enhancedPrompt = `Rewrite this financial text to be clearer: "${prompt}" Enhanced version:`;

    const requestBody = {
        inputs: enhancedPrompt,
        parameters: {
            max_new_tokens: 50,
            temperature: 0.3,
            do_sample: true,
            return_full_text: false
        },
        options: {
            wait_for_model: true,
            use_cache: false
        }
    };

    const response = await fetch(HF_CONFIG.endpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_CONFIG.apiToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Handle text generation response format
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        return data[0].generated_text.trim();
    } else if (data.generated_text) {
        return data.generated_text.trim();
    }
    
    throw new Error('Invalid Hugging Face API response format: ' + JSON.stringify(data));
};

/**
 * MANDATORY SAFETY GATE - Validate Hugging Face output against .kiro constraints
 * CRITICAL: All AI outputs must pass validation
 */
const validateHuggingFaceOutput = (hfContent, originalContent, context) => {
    const validation = {
        isValid: true,
        violations: [],
        sanitizedContent: hfContent
    };

    // Structural validation
    if (!hfContent || typeof hfContent !== 'string' || hfContent.length === 0) {
        validation.isValid = false;
        validation.violations.push('Empty or invalid Hugging Face content');
        return validation;
    }

    // Length validation - prevent excessive expansion
    if (hfContent.length > originalContent.length * 3) {
        validation.isValid = false;
        validation.violations.push('Hugging Face content exceeds reasonable expansion limit (3x original)');
        return validation;
    }

    // Apply .kiro agent constraints validation
    const constraintCheck = applyAgentConstraints({
        description: hfContent,
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
        'i suggest', 'you need to', 'it would be best', 'we decide',
        
        // Informal/metaphor language (violates professional tone)
        'imagine', 'think of it as', 'like', 'similar to',
        'picture this', 'consider it as', 'it\'s like', 'basically'
    ];

    const lowerContent = hfContent.toLowerCase();
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
    const hfNumbers = hfContent.match(/[\d,]+\.?\d*/g) || [];
    
    if (originalNumbers.length !== hfNumbers.length) {
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
    
    if (!HF_CONFIG.enabled) {
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const hfResult = await callHuggingFaceWithSafety(originalExplanation, context);
    
    if (!hfResult.success) {
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic',
            reason: hfResult.reason
        };
    }

    // Validate Hugging Face output
    const validation = validateHuggingFaceOutput(hfResult.content, originalExplanation, context);
    
    if (!validation.isValid) {
        console.warn('Hugging Face output validation failed:', validation.violations);
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic',
            reason: 'Hugging Face validation failed'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'huggingface_enhanced',
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
    
    if (!HF_CONFIG.enabled) {
        return {
            content: fallbackSummary,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const hfResult = await callHuggingFaceWithSafety(
        `Create a professional summary for an advisor based on this client analysis: ${JSON.stringify(clientData, null, 2)}`, 
        context
    );
    
    if (!hfResult.success) {
        return {
            content: fallbackSummary,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateHuggingFaceOutput(hfResult.content, fallbackSummary, context);
    
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
        source: 'huggingface_enhanced'
    };
};

/**
 * APPROVED USAGE: Expand "What could go wrong?" narratives
 * Input: Known risks from .kiro decision graphs
 * Output: Expanded explanation of existing risks (no new risks invented)
 */
export const expandRiskNarrative = async (knownRisks, context = {}) => {
    const fallbackNarrative = generateDeterministicRiskNarrative(knownRisks);
    
    if (!HF_CONFIG.enabled) {
        return {
            content: fallbackNarrative,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const hfResult = await callHuggingFaceWithSafety(
        `Expand on these identified financial risks with clear explanations, without adding new risks: ${JSON.stringify(knownRisks)}`,
        context
    );
    
    if (!hfResult.success) {
        return {
            content: fallbackNarrative,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateHuggingFaceOutput(hfResult.content, fallbackNarrative, context);
    
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
        source: 'huggingface_enhanced'
    };
};

/**
 * Deterministic fallback functions
 * These ensure the system works fully without Hugging Face
 */
const generateDeterministicSummary = (clientData) => {
    return `Client: ${clientData.name || 'Unknown'}, Risk Profile: ${clientData.riskProfile || 'Not assessed'}, Goals: ${clientData.goals?.length || 0} defined goals.`;
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
 * System health check for Hugging Face assistance
 * Returns current status and capabilities
 */
export const getHFAssistStatus = () => {
    return {
        enabled: HF_CONFIG.enabled,
        apiTokenPresent: Boolean(HF_CONFIG.apiToken),
        endpoint: HF_CONFIG.endpoint,
        timeout: HF_CONFIG.timeout,
        mode: HF_CONFIG.enabled ? 'huggingface_enhancement' : 'deterministic_only'
    };
};

/**
 * Log Hugging Face usage for accountability
 * Does NOT log user data, prompts, or responses
 */
export const logHFUsage = (operation, success, reason = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation: operation,
        success: success,
        reason: reason,
        provider: 'huggingface',
        mode: HF_CONFIG.enabled ? 'huggingface_enhanced' : 'deterministic'
    };
    
    // In production, send to proper logging system
    console.log('Hugging Face Usage:', logEntry);
};

// Initialize on module load
initializeHFAssist();