// AI Assistance Layer - Optional Enhancement for Rule-Based Agents
// This module provides OPTIONAL AI assistance for explanation enhancement only
// ALL business logic remains in deterministic .kiro framework

import { applyAgentConstraints } from './kiroIntegration.js';

/**
 * AI Assistance Configuration
 * Uses environment variables only - never hardcoded keys
 */
const AI_CONFIG = {
    apiKey: import.meta.env.VITE_AI_API_KEY || null,
    timeout: 5000, // 5 second timeout
    maxRetries: 1,
    enabled: false // Will be set based on API key availability
};

/**
 * Initialize AI assistance layer
 * Checks API key availability and sets enabled state
 */
export const initializeAIAssist = () => {
    AI_CONFIG.enabled = Boolean(AI_CONFIG.apiKey);
    
    if (AI_CONFIG.enabled) {
        console.log('AI assistance layer initialized - enhancement mode enabled');
    } else {
        console.log('AI assistance layer initialized - deterministic mode only');
    }
    
    return AI_CONFIG.enabled;
};

/**
 * Core AI assistance function with safety constraints
 * Returns structured output with validation status
 */
const callAIWithSafety = async (prompt, context = {}) => {
    // Immediate fallback if AI not available
    if (!AI_CONFIG.enabled) {
        return {
            success: false,
            content: null,
            fallbackUsed: true,
            reason: 'AI assistance not available'
        };
    }

    try {
        // Timeout wrapper for API call
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI_TIMEOUT')), AI_CONFIG.timeout)
        );

        // Mock AI call structure - replace with actual API when key provided
        const aiCallPromise = mockAICall(prompt, context);
        
        const response = await Promise.race([aiCallPromise, timeoutPromise]);
        
        return {
            success: true,
            content: response,
            fallbackUsed: false,
            reason: 'AI assistance successful'
        };
        
    } catch (error) {
        console.warn('AI assistance failed:', error.message);
        
        return {
            success: false,
            content: null,
            fallbackUsed: true,
            reason: error.message === 'AI_TIMEOUT' ? 'AI timeout' : 'AI error'
        };
    }
};

/**
 * Mock AI call for development - replace with actual API integration
 * This structure shows how real AI integration should work
 */
const mockAICall = async (prompt, context) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return mock enhanced content
    return `Enhanced explanation: ${prompt.substring(0, 100)}...`;
};

/**
 * Validate AI output against .kiro constraints
 * CRITICAL: All AI outputs must pass validation
 */
const validateAIOutput = (aiContent, originalContent, context) => {
    const validation = {
        isValid: true,
        violations: [],
        sanitizedContent: aiContent
    };

    // Structural validation
    if (!aiContent || typeof aiContent !== 'string' || aiContent.length === 0) {
        validation.isValid = false;
        validation.violations.push('Empty or invalid AI content');
        return validation;
    }

    // Length validation - prevent excessive AI expansion
    if (aiContent.length > originalContent.length * 3) {
        validation.isValid = false;
        validation.violations.push('AI content exceeds reasonable expansion limit');
        return validation;
    }

    // Apply .kiro agent constraints validation
    const constraintCheck = applyAgentConstraints({
        description: aiContent,
        type: 'explanation',
        confidence: context.confidence || 0.5
    }, context);

    if (constraintCheck.violations.length > 0) {
        validation.isValid = false;
        validation.violations.push(...constraintCheck.violations);
        return validation;
    }

    // Content safety checks
    const forbiddenPhrases = [
        'guaranteed', 'certain', 'always', 'never fails',
        'risk-free', 'automatic', 'will definitely',
        'no chance of loss', 'perfect solution'
    ];

    const lowerContent = aiContent.toLowerCase();
    const foundViolations = forbiddenPhrases.filter(phrase => 
        lowerContent.includes(phrase)
    );

    if (foundViolations.length > 0) {
        validation.isValid = false;
        validation.violations.push(`Forbidden certainty language: ${foundViolations.join(', ')}`);
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
    
    if (!AI_CONFIG.enabled) {
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const prompt = `Improve the clarity of this financial explanation while preserving all factual content and uncertainty acknowledgments: "${originalExplanation}"`;
    
    const aiResult = await callAIWithSafety(prompt, context);
    
    if (!aiResult.success) {
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic',
            reason: aiResult.reason
        };
    }

    // Validate AI output
    const validation = validateAIOutput(aiResult.content, originalExplanation, context);
    
    if (!validation.isValid) {
        console.warn('AI output validation failed:', validation.violations);
        return {
            content: fallbackContent,
            enhanced: false,
            source: 'deterministic',
            reason: 'AI validation failed'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'ai_enhanced',
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
    
    if (!AI_CONFIG.enabled) {
        return {
            content: fallbackSummary,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const prompt = `Create a professional summary for an advisor based on this client analysis: ${JSON.stringify(clientData, null, 2)}`;
    
    const aiResult = await callAIWithSafety(prompt, context);
    
    if (!aiResult.success) {
        return {
            content: fallbackSummary,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateAIOutput(aiResult.content, fallbackSummary, context);
    
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
        source: 'ai_enhanced'
    };
};

/**
 * APPROVED USAGE: Generate plain-language versions of deterministic decisions
 * Input: Technical decision output from .kiro rules
 * Output: User-friendly explanation of the same decision
 */
export const translateDecisionToPlainLanguage = async (technicalDecision, context = {}) => {
    const fallbackTranslation = generatePlainLanguageFallback(technicalDecision);
    
    if (!AI_CONFIG.enabled) {
        return {
            content: fallbackTranslation,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const prompt = `Translate this technical financial decision into clear, simple language for a general audience: "${JSON.stringify(technicalDecision)}"`;
    
    const aiResult = await callAIWithSafety(prompt, context);
    
    if (!aiResult.success) {
        return {
            content: fallbackTranslation,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateAIOutput(aiResult.content, fallbackTranslation, context);
    
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
        source: 'ai_enhanced'
    };
};

/**
 * APPROVED USAGE: Expand "What could go wrong?" narratives
 * Input: Known risks from .kiro decision graphs
 * Output: Expanded explanation of existing risks (no new risks invented)
 */
export const expandRiskNarrative = async (knownRisks, context = {}) => {
    const fallbackNarrative = generateDeterministicRiskNarrative(knownRisks);
    
    if (!AI_CONFIG.enabled) {
        return {
            content: fallbackNarrative,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const prompt = `Expand on these identified financial risks with clear explanations, without adding new risks: ${JSON.stringify(knownRisks)}`;
    
    const aiResult = await callAIWithSafety(prompt, context);
    
    if (!aiResult.success) {
        return {
            content: fallbackNarrative,
            enhanced: false,
            source: 'deterministic'
        };
    }

    const validation = validateAIOutput(aiResult.content, fallbackNarrative, context);
    
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
        source: 'ai_enhanced'
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
 * System health check for AI assistance
 * Returns current status and capabilities
 */
export const getAIAssistStatus = () => {
    return {
        enabled: AI_CONFIG.enabled,
        apiKeyPresent: Boolean(AI_CONFIG.apiKey),
        timeout: AI_CONFIG.timeout,
        mode: AI_CONFIG.enabled ? 'enhancement' : 'deterministic_only'
    };
};

/**
 * Log AI assistance usage for accountability
 * Does NOT log user data or prompts
 */
export const logAIUsage = (operation, success, reason = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation: operation,
        success: success,
        reason: reason,
        mode: AI_CONFIG.enabled ? 'ai_enhanced' : 'deterministic'
    };
    
    // In production, send to proper logging system
    console.log('AI Assist Usage:', logEntry);
};

// Initialize on module load
initializeAIAssist();