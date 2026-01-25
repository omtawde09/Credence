// Spending Predictor Agent - Assistive AI for Spending Trend Analysis
// This agent provides OPTIONAL narrative assistance for spending patterns
// ALL business logic remains in deterministic rule-based system

/**
 * Hugging Face API Configuration for Spending Predictor Agent
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
 * Initialize Spending Predictor Agent
 * Checks API token availability and sets enabled state
 */
export const initializeSpendingPredictorAgent = () => {
    HF_CONFIG.enabled = Boolean(HF_CONFIG.apiToken);
    
    if (HF_CONFIG.enabled) {
        console.log('Spending Predictor Agent initialized - AI assistance enabled');
    } else {
        console.log('Spending Predictor Agent initialized - deterministic mode only (HF_API_TOKEN not configured)');
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
        console.warn('Spending Predictor Agent failed:', error.message);
        
        return {
            success: false,
            content: null,
            fallbackUsed: true,
            reason: error.message === 'HF_TIMEOUT' ? 'Hugging Face timeout' : 'Hugging Face API error'
        };
    }
};

/**
 * Hugging Face Inference API integration for spending analysis
 */
const callHuggingFaceAPI = async (prompt, context) => {
    // Construct regulated prompt for spending trend analysis
    const regulatedPrompt = `Analyze spending trends and provide a narrative summary. Use cautious language with "may", "appears", "could". Do not predict exact amounts. Do not provide financial advice. Do not recommend actions. Focus on qualitative patterns only: "${prompt}"`;

    const requestBody = {
        inputs: regulatedPrompt,
        parameters: {
            max_new_tokens: Math.min(prompt.length * 1.5, 400), // Conservative expansion limit
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
const validateSpendingPredictorOutput = (aiContent, originalContent) => {
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
        
        // Certainty language (violates cautious requirements)
        'will definitely', 'certain', 'always', 'never', 'absolutely',
        'completely safe', 'risk-free', 'perfect',
        
        // Promotional/metaphorical language
        'amazing', 'incredible', 'fantastic', 'like', 'similar to',
        'imagine', 'think of it as', 'picture this'
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

    // Check for required cautious language
    const cautiousLanguage = ['may', 'appears', 'could', 'might', 'seems', 'suggests'];
    const hasCautiousLanguage = cautiousLanguage.some(phrase => 
        lowerContent.includes(phrase)
    );

    if (!hasCautiousLanguage && aiContent.length > 50) {
        validation.isValid = false;
        validation.violations.push('Missing required cautious language (may, appears, could)');
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
 * APPROVED USAGE: Identify spending trends from historical data
 * Input: Historical spending summaries and expense categories
 * Output: Qualitative narrative of spending patterns
 */
export const identifySpendingTrends = async (spendingData, context = {}) => {
    // Generate deterministic fallback summary first (always available)
    const deterministicSummary = generateDeterministicSpendingTrends(spendingData);
    
    if (!HF_CONFIG.enabled) {
        return {
            content: deterministicSummary,
            enhanced: false,
            source: 'deterministic',
            disclaimer: 'Analysis based on rule-based pattern detection only.'
        };
    }

    // Prepare input for AI analysis
    const analysisInput = `Historical spending data: ${JSON.stringify(spendingData, null, 2)}. Analyze spending trends and patterns.`;
    
    const hfResult = await callHuggingFaceWithSafety(analysisInput, context);
    
    if (!hfResult.success) {
        return {
            content: deterministicSummary,
            enhanced: false,
            source: 'deterministic',
            reason: hfResult.reason,
            disclaimer: 'Analysis based on rule-based pattern detection only.'
        };
    }

    // Validate AI output
    const validation = validateSpendingPredictorOutput(hfResult.content, deterministicSummary);
    
    if (!validation.isValid) {
        console.warn('Spending Predictor AI output validation failed:', validation.violations);
        return {
            content: deterministicSummary,
            enhanced: false,
            source: 'deterministic',
            reason: 'AI validation failed',
            disclaimer: 'Analysis based on rule-based pattern detection only.'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'ai_enhanced',
        originalContent: deterministicSummary,
        disclaimer: 'AI-enhanced analysis - outputs are estimates and should not be considered financial advice.'
    };
};

/**
 * APPROVED USAGE: Highlight category changes from rule-detected patterns
 * Input: Expense categories with detected changes
 * Output: Bullet list of notable category changes
 */
export const highlightCategoryChanges = async (categoryData, context = {}) => {
    // Generate deterministic fallback
    const deterministicChanges = generateDeterministicCategoryChanges(categoryData);
    
    if (!HF_CONFIG.enabled) {
        return {
            content: deterministicChanges,
            enhanced: false,
            source: 'deterministic',
            disclaimer: 'Category analysis based on rule-based detection only.'
        };
    }

    const analysisInput = `Expense category changes: ${JSON.stringify(categoryData, null, 2)}. Highlight notable patterns in spending categories.`;
    
    const hfResult = await callHuggingFaceWithSafety(analysisInput, context);
    
    if (!hfResult.success) {
        return {
            content: deterministicChanges,
            enhanced: false,
            source: 'deterministic',
            reason: hfResult.reason,
            disclaimer: 'Category analysis based on rule-based detection only.'
        };
    }

    const validation = validateSpendingPredictorOutput(hfResult.content, deterministicChanges);
    
    if (!validation.isValid) {
        return {
            content: deterministicChanges,
            enhanced: false,
            source: 'deterministic',
            reason: 'AI validation failed',
            disclaimer: 'Category analysis based on rule-based detection only.'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'ai_enhanced',
        originalContent: deterministicChanges,
        disclaimer: 'AI-enhanced analysis - outputs are estimates and should not be considered financial advice.'
    };
};

/**
 * APPROVED USAGE: Describe likely expense ranges in non-numeric terms
 * Input: Historical patterns and detected anomalies
 * Output: Qualitative expense range descriptions
 */
export const describeExpenseRanges = async (expenseData, context = {}) => {
    // Generate deterministic fallback
    const deterministicRanges = generateDeterministicExpenseRanges(expenseData);
    
    if (!HF_CONFIG.enabled) {
        return {
            content: deterministicRanges,
            enhanced: false,
            source: 'deterministic',
            disclaimer: 'Expense range analysis based on historical patterns only.'
        };
    }

    const analysisInput = `Expense patterns: ${JSON.stringify(expenseData, null, 2)}. Describe likely expense ranges in qualitative terms without exact amounts.`;
    
    const hfResult = await callHuggingFaceWithSafety(analysisInput, context);
    
    if (!hfResult.success) {
        return {
            content: deterministicRanges,
            enhanced: false,
            source: 'deterministic',
            reason: hfResult.reason,
            disclaimer: 'Expense range analysis based on historical patterns only.'
        };
    }

    const validation = validateSpendingPredictorOutput(hfResult.content, deterministicRanges);
    
    if (!validation.isValid) {
        return {
            content: deterministicRanges,
            enhanced: false,
            source: 'deterministic',
            reason: 'AI validation failed',
            disclaimer: 'Expense range analysis based on historical patterns only.'
        };
    }

    return {
        content: validation.sanitizedContent,
        enhanced: true,
        source: 'ai_enhanced',
        originalContent: deterministicRanges,
        disclaimer: 'AI-enhanced analysis - outputs are estimates and should not be considered financial advice.'
    };
};

/**
 * Deterministic fallback functions
 * These ensure the system works fully without AI assistance
 */
const generateDeterministicSpendingTrends = (spendingData) => {
    if (!spendingData || !spendingData.categories) {
        return 'Insufficient spending data available for trend analysis.';
    }
    
    const trends = [];
    Object.entries(spendingData.categories).forEach(([category, data]) => {
        if (data.trend === 'increasing') {
            trends.push(`${category} spending appears to be increasing based on recent patterns.`);
        } else if (data.trend === 'decreasing') {
            trends.push(`${category} spending appears to be decreasing based on recent patterns.`);
        }
    });
    
    return trends.length > 0 
        ? trends.join(' ') 
        : 'No significant spending trends detected in recent analysis.';
};

const generateDeterministicCategoryChanges = (categoryData) => {
    if (!categoryData || !Array.isArray(categoryData)) {
        return '• No category changes detected in current analysis.';
    }
    
    const changes = categoryData.map(category => 
        `• ${category.name}: ${category.change || 'No significant change detected'}`
    );
    
    return changes.length > 0 ? changes.join('\n') : '• No category changes detected in current analysis.';
};

const generateDeterministicExpenseRanges = (expenseData) => {
    if (!expenseData || !expenseData.ranges) {
        return 'Expense range analysis not available with current data.';
    }
    
    const ranges = [];
    Object.entries(expenseData.ranges).forEach(([category, range]) => {
        if (range.level === 'high') {
            ranges.push(`${category} expenses may be in the higher range based on historical patterns.`);
        } else if (range.level === 'low') {
            ranges.push(`${category} expenses may be in the lower range based on historical patterns.`);
        } else {
            ranges.push(`${category} expenses appear to be within typical range.`);
        }
    });
    
    return ranges.length > 0 
        ? ranges.join(' ') 
        : 'Expense ranges appear to be within typical historical patterns.';
};

/**
 * System health check for Spending Predictor Agent
 * Returns current status and capabilities
 */
export const getSpendingPredictorStatus = () => {
    return {
        enabled: HF_CONFIG.enabled,
        apiTokenPresent: Boolean(HF_CONFIG.apiToken),
        endpoint: HF_CONFIG.endpoint,
        timeout: HF_CONFIG.timeout,
        mode: HF_CONFIG.enabled ? 'ai_enhanced' : 'deterministic_only',
        agentType: 'spending_predictor'
    };
};

/**
 * Log Spending Predictor Agent usage for accountability
 * Does NOT log user data, prompts, or responses
 */
export const logSpendingPredictorUsage = (operation, success, reason = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        agent: 'spending_predictor',
        operation: operation,
        success: success,
        reason: reason,
        aiUsed: HF_CONFIG.enabled,
        mode: HF_CONFIG.enabled ? 'ai_enhanced' : 'deterministic'
    };
    
    // In production, send to proper logging system
    console.log('Spending Predictor Agent Usage:', logEntry);
};

// Initialize on module load
initializeSpendingPredictorAgent();