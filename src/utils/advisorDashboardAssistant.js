// Advisor Dashboard Assistant - Assistive AI for Client Status Summarization
// This agent provides OPTIONAL narrative assistance for advisor dashboards
// ALL business logic remains in deterministic rule-based system

/**
 * Hugging Face API Configuration for Advisor Dashboard Assistant
 * Uses environment variables only - never hardcoded tokens
 */
const HF_CONFIG = {
    apiToken: import.meta.env.VITE_HF_API_TOKEN || null,
    endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    timeout: 8000, // 8 second timeout
    maxRetries: 1,
    enabled: false // Will be set based on API token availability
};

/**
 * Initialize Advisor Dashboard Assistant
 * Checks API token availability and sets enabled state
 */
export const initializeAdvisorDashboardAssistant = () => {
    HF_CONFIG.enabled = Boolean(HF_CONFIG.apiToken);
    
    if (HF_CONFIG.enabled) {
        console.log('Advisor Dashboard Assistant initialized - AI assistance enabled');
    } else {
        console.log('Advisor Dashboard Assistant initialized - deterministic mode only (HF_API_TOKEN not configured)');
        console.log('To enable AI assistance, set HF_API_TOKEN environment variable');
    }
    
    return HF_CONFIG.enabled;
};

/**
 * Core Hugging Face API call with safety constraints
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
        console.warn('Advisor Dashboard Assistant failed:', error.message);
        
        return {
            success: false,
            content: null,
            fallbackUsed: true,
            reason: error.message === 'HF_TIMEOUT' ? 'Hugging Face timeout' : 'Hugging Face API error'
        };
    }
};

/**
 * Hugging Face Inference API integration for advisor assistance
 */
const callHuggingFaceAPI = async (prompt, context) => {
    // Construct regulated prompt for advisor dashboard assistance
    const regulatedPrompt = `Generate a professional advisor summary. Use neutral, professional tone. Do not suggest buying, selling, or reallocating. Do not override alerts. Do not introduce new risks. Focus on summarizing existing information only: "${prompt}"`;

    const requestBody = {
        inputs: regulatedPrompt,
        parameters: {
            max_new_tokens: Math.min(prompt.length * 1.5, 500), // Conservative expansion limit
            temperature: 0.1, // Low temperature for consistent output
            do_sample: false, // Deterministic generation
            return_full_text: false
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
        throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data) || !data[0] || !data[0].generated_text) {
        throw new Error('Invalid Hugging Face API response format');
    }

    return data[0].generated_text.trim();
};

/**
 * MANDATORY SAFETY & TONE VALIDATION
 * CRITICAL: All AI outputs must pass validation before use
 */
const validateAdvisorAssistantOutput = (aiContent, originalContent) => {
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

    // MANDATORY SAFETY GATE - Forbidden language detection
    const forbiddenPhrases = [
        // Financial advice language (STRICTLY FORBIDDEN)
        'guaranteed', 'no risk', 'you should', 'buy', 'sell', 'invest',
        'recommend', 'suggest', 'advise', 'must', 'need to',
        'should buy', 'should sell', 'should reallocate', 'should invest',
        
        // Action-triggering language (violates non-actionable requirement)
        'take action', 'execute', 'implement', 'proceed with',
        'make changes', 'adjust portfolio', 'rebalance now',
        
        // Risk modification language (violates restrictions)
        'new risk', 'additional risk', 'hidden risk', 'overlooked risk',
        'risk not considered', 'missed risk',
        
        // Promotional/unprofessional language
        'amazing', 'incredible', 'fantastic', 'perfect', 'excellent opportunity'
    ];

    const lowerContent = aiContent.toLowerCase();
    const foundViolations = forbiddenPhrases.filter(phrase => 
        lowerContent.includes(phrase.toLowerCase())
    );

    if (foundViolations.length > 0) {
        validation.isValid = false;
        validation.violations.push(`Forbidden language detected: ${foundViolations.join(', ')}`);
        return validation;
    }

    // Check for professional tone requirements
    const unprofessionalIndicators = ['lol', 'omg', 'wow', '!!!', 'super', 'totally'];
    const hasUnprofessionalTone = unprofessionalIndicators.some(indicator => 
        lowerContent.includes(indicator)
    );

    if (hasUnprofessionalTone) {
        validation.isValid = false;
        validation.violations.push('Unprofessional tone detected');
        return validation;
    }

    // Length validation - prevent excessive expansion
    if (aiContent.length > originalContent.length * 2.5) {
        validation.isValid = false;
        validation.violations.push('AI content exceeds reasonable expansion limit');
        return validation;
    }

    return validation;
};

/**
 * APPROVED USAGE: Generate concise client summaries for advisors
 * Input: Client profile, goals, portfolio status, and rule-generated alerts
 * Output: Professional advisor-facing summary paragraph
 */
export const generateClientSummary = async (clientData, context = {}) => {
    // Generate deterministic fallback summary first (always available)
    const deterministicSummary = generateDeterministicClientSummary(clientData);
    
    if (!HF_CONFIG.enabled) {
        return {
            content: deterministicSummary,
            enhanced: false,
            source: 'deterministic',
            disclaimer: 'Summary based on rule-based analysis only.'
        };
    }

    // Prepare input for AI analysis
    const summaryInput = `Client data: ${JSON.stringify(clientData, null, 2)}. Generate a professional advisor summary focusing on key client status and existing alerts.`;
    
    const hfResult = await callHuggingFaceWithSafety(summaryInput, context);
    
    if (!hfResult.success) {
        return {
            content: deterministicSummary,
            enhanced: false,
            source: 'deterministic',
            reason: hfResult.reason,
            disclaimer: 'Summary based on rule-based analysis only.'
        };
    }

    // Validate AI output
    const validation = validateAdvisorAssistantOutput(hfResult.content, deterministicSummary);
    
    if (!validation.isValid) {
        console.warn('Advisor Dashboard Assistant output validation failed:', validation.violations);
        return {
            content: deterministicSummary,
            enhanced: false,
            source: 'deterministic',
            reason: 'AI validation failed',
            disclaimer: 'Summary based on rule-based analysis only.'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'ai_enhanced',
        originalContent: deterministicSummary,
        disclaimer: 'AI-enhanced summary for advisor reference only.'
    };
};

/**
 * APPROVED USAGE: Surface key risks and changes already identified by rules
 * Input: Rule-generated alerts, flags, and detected changes
 * Output: Bullet list of key discussion points for advisor reviews
 */
export const surfaceKeyDiscussionPoints = async (alertsData, context = {}) => {
    // Generate deterministic fallback
    const deterministicPoints = generateDeterministicDiscussionPoints(alertsData);
    
    if (!HF_CONFIG.enabled) {
        return {
            content: deterministicPoints,
            enhanced: false,
            source: 'deterministic',
            disclaimer: 'Discussion points based on rule-detected alerts only.'
        };
    }

    const analysisInput = `Alerts and flags: ${JSON.stringify(alertsData, null, 2)}. Generate key discussion points for advisor review based on existing alerts only.`;
    
    const hfResult = await callHuggingFaceWithSafety(analysisInput, context);
    
    if (!hfResult.success) {
        return {
            content: deterministicPoints,
            enhanced: false,
            source: 'deterministic',
            reason: hfResult.reason,
            disclaimer: 'Discussion points based on rule-detected alerts only.'
        };
    }

    const validation = validateAdvisorAssistantOutput(hfResult.content, deterministicPoints);
    
    if (!validation.isValid) {
        return {
            content: deterministicPoints,
            enhanced: false,
            source: 'deterministic',
            reason: 'AI validation failed',
            disclaimer: 'Discussion points based on rule-detected alerts only.'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'ai_enhanced',
        originalContent: deterministicPoints,
        disclaimer: 'AI-enhanced discussion points for advisor reference only.'
    };
};

/**
 * APPROVED USAGE: Prioritize attention areas (non-actionable)
 * Input: Client status, portfolio metrics, and life events
 * Output: Non-prescriptive talking points for advisor preparation
 */
export const prioritizeAttentionAreas = async (clientStatus, context = {}) => {
    // Generate deterministic fallback
    const deterministicPriorities = generateDeterministicAttentionAreas(clientStatus);
    
    if (!HF_CONFIG.enabled) {
        return {
            content: deterministicPriorities,
            enhanced: false,
            source: 'deterministic',
            disclaimer: 'Attention areas based on rule-based prioritization only.'
        };
    }

    const analysisInput = `Client status: ${JSON.stringify(clientStatus, null, 2)}. Prioritize attention areas for advisor review without suggesting specific actions.`;
    
    const hfResult = await callHuggingFaceWithSafety(analysisInput, context);
    
    if (!hfResult.success) {
        return {
            content: deterministicPriorities,
            enhanced: false,
            source: 'deterministic',
            reason: hfResult.reason,
            disclaimer: 'Attention areas based on rule-based prioritization only.'
        };
    }

    const validation = validateAdvisorAssistantOutput(hfResult.content, deterministicPriorities);
    
    if (!validation.isValid) {
        return {
            content: deterministicPriorities,
            enhanced: false,
            source: 'deterministic',
            reason: 'AI validation failed',
            disclaimer: 'Attention areas based on rule-based prioritization only.'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'ai_enhanced',
        originalContent: deterministicPriorities,
        disclaimer: 'AI-enhanced attention areas for advisor reference only.'
    };
};

/**
 * Deterministic fallback functions
 * These ensure the system works fully without AI assistance
 */
const generateDeterministicClientSummary = (clientData) => {
    if (!clientData) {
        return 'Client data not available for summary generation.';
    }
    
    const name = clientData.name || 'Client';
    const age = clientData.age || 'Unknown age';
    const riskProfile = clientData.riskProfile || 'Not assessed';
    const goalCount = clientData.goals?.length || 0;
    const alertCount = clientData.alerts?.length || 0;
    
    let summary = `${name}, ${age}, Risk Profile: ${riskProfile}. `;
    summary += `${goalCount} defined goals. `;
    
    if (alertCount > 0) {
        summary += `${alertCount} active alerts requiring attention. `;
    } else {
        summary += 'No active alerts. ';
    }
    
    if (clientData.lastReview) {
        summary += `Last reviewed: ${clientData.lastReview}.`;
    }
    
    return summary;
};

const generateDeterministicDiscussionPoints = (alertsData) => {
    if (!alertsData || !Array.isArray(alertsData) || alertsData.length === 0) {
        return '• No active alerts or flags detected\n• Regular portfolio review recommended';
    }
    
    const points = alertsData.map(alert => 
        `• ${alert.type || 'Alert'}: ${alert.description || 'Review required'}`
    );
    
    return points.join('\n');
};

const generateDeterministicAttentionAreas = (clientStatus) => {
    if (!clientStatus) {
        return 'Client status data not available for prioritization.';
    }
    
    const areas = [];
    
    if (clientStatus.riskMismatch) {
        areas.push('Risk profile alignment review needed');
    }
    
    if (clientStatus.pendingLifeEvents?.length > 0) {
        areas.push('Life event impact assessment required');
    }
    
    if (clientStatus.portfolioRebalanceNeeded) {
        areas.push('Portfolio allocation review recommended');
    }
    
    if (clientStatus.goalProgressBehind) {
        areas.push('Goal progress discussion needed');
    }
    
    if (areas.length === 0) {
        areas.push('Regular check-in and goal progress review');
    }
    
    return areas.join('. ') + '.';
};

/**
 * System health check for Advisor Dashboard Assistant
 * Returns current status and capabilities
 */
export const getAdvisorAssistantStatus = () => {
    return {
        enabled: HF_CONFIG.enabled,
        apiTokenPresent: Boolean(HF_CONFIG.apiToken),
        endpoint: HF_CONFIG.endpoint,
        timeout: HF_CONFIG.timeout,
        mode: HF_CONFIG.enabled ? 'ai_enhanced' : 'deterministic_only',
        agentType: 'advisor_dashboard_assistant'
    };
};

/**
 * Log Advisor Dashboard Assistant usage for accountability
 * Does NOT log user data, prompts, or responses
 */
export const logAdvisorAssistantUsage = (operation, success, reason = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        agent: 'advisor_dashboard_assistant',
        operation: operation,
        success: success,
        reason: reason,
        aiUsed: HF_CONFIG.enabled,
        mode: HF_CONFIG.enabled ? 'ai_enhanced' : 'deterministic'
    };
    
    // In production, send to proper logging system
    console.log('Advisor Dashboard Assistant Usage:', logEntry);
};

// Initialize on module load
initializeAdvisorDashboardAssistant();