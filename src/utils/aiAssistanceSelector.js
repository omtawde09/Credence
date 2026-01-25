// AI Assistance Provider Selector
// Provides unified interface for multiple AI assistance providers
// Automatically selects available provider or falls back to deterministic mode

/**
 * Available AI assistance providers
 */
const AI_PROVIDERS = {
    HUGGINGFACE: 'huggingface',
    SIMPLE_ENHANCER: 'simple_enhancer',
    DETERMINISTIC: 'deterministic'
};

/**
 * Provider priority order (first available provider is used)
 */
const PROVIDER_PRIORITY = [
    AI_PROVIDERS.HUGGINGFACE,
    AI_PROVIDERS.SIMPLE_ENHANCER,
    AI_PROVIDERS.DETERMINISTIC
];

/**
 * Cache for provider availability to avoid repeated checks
 */
let providerCache = {
    lastCheck: null,
    availableProviders: [],
    selectedProvider: AI_PROVIDERS.DETERMINISTIC
};

/**
 * Check availability of all AI assistance providers
 * Returns array of available providers in priority order
 */
const checkProviderAvailability = async () => {
    const available = [];
    
    // Check Hugging Face availability (primary provider)
    try {
        const { getHFAssistStatus } = await import('./hfAssist.js');
        const hfStatus = getHFAssistStatus();
        if (hfStatus.enabled) {
            available.push({
                provider: AI_PROVIDERS.HUGGINGFACE,
                status: hfStatus,
                module: './hfAssist.js'
            });
        }
    } catch (error) {
        console.warn('Hugging Face provider check failed:', error.message);
    }
    
    // Simple enhancer is always available
    try {
        const { getSimpleEnhancerStatus } = await import('./simpleEnhancer.js');
        const simpleStatus = getSimpleEnhancerStatus();
        available.push({
            provider: AI_PROVIDERS.SIMPLE_ENHANCER,
            status: simpleStatus,
            module: './simpleEnhancer.js'
        });
    } catch (error) {
        console.warn('Simple enhancer check failed:', error.message);
    }
    
    // Deterministic mode is always available
    available.push({
        provider: AI_PROVIDERS.DETERMINISTIC,
        status: { enabled: true, mode: 'deterministic_only' },
        module: null
    });
    
    return available;
};

/**
 * Get the best available AI assistance provider
 * Uses caching to avoid repeated availability checks
 */
export const getAvailableProvider = async (forceRefresh = false) => {
    const now = Date.now();
    const cacheAge = now - (providerCache.lastCheck || 0);
    
    // Use cache if less than 5 minutes old and not forcing refresh
    if (!forceRefresh && cacheAge < 300000 && providerCache.availableProviders.length > 0) {
        return providerCache.selectedProvider;
    }
    
    // Check provider availability
    const available = await checkProviderAvailability();
    
    // Select provider based on priority
    let selectedProvider = AI_PROVIDERS.DETERMINISTIC;
    for (const priority of PROVIDER_PRIORITY) {
        const provider = available.find(p => p.provider === priority);
        if (provider) {
            selectedProvider = provider.provider;
            break;
        }
    }
    
    // Update cache
    providerCache = {
        lastCheck: now,
        availableProviders: available,
        selectedProvider: selectedProvider
    };
    
    return selectedProvider;
};

/**
 * Get status of all AI assistance providers
 */
export const getAllProviderStatus = async () => {
    const available = await checkProviderAvailability();
    const selectedProvider = await getAvailableProvider();
    
    return {
        available: available,
        selected: selectedProvider,
        providers: AI_PROVIDERS
    };
};

/**
 * Enhanced explanation using best available provider
 * Automatically falls back through providers if one fails
 */
export const enhanceExplanation = async (originalExplanation, context = {}) => {
    const fallbackContent = originalExplanation;
    const selectedProvider = await getAvailableProvider();
    
    // Try Hugging Face first
    if (selectedProvider === AI_PROVIDERS.HUGGINGFACE) {
        try {
            const { enhanceExplanation } = await import('./hfAssist.js');
            const result = await enhanceExplanation(originalExplanation, context);
            if (result.enhanced) {
                return {
                    ...result,
                    provider: AI_PROVIDERS.HUGGINGFACE
                };
            }
        } catch (error) {
            console.warn('Hugging Face enhancement failed, trying simple enhancer:', error.message);
        }
    }
    
    // Try simple enhancer as fallback
    if (selectedProvider === AI_PROVIDERS.SIMPLE_ENHANCER || selectedProvider === AI_PROVIDERS.HUGGINGFACE) {
        try {
            const { enhanceExplanation } = await import('./simpleEnhancer.js');
            const result = await enhanceExplanation(originalExplanation, context);
            if (result.enhanced) {
                return {
                    ...result,
                    provider: AI_PROVIDERS.SIMPLE_ENHANCER
                };
            }
        } catch (error) {
            console.warn('Simple enhancer failed, using deterministic:', error.message);
        }
    }
    
    // Deterministic fallback
    return {
        content: fallbackContent,
        enhanced: false,
        source: 'deterministic',
        provider: AI_PROVIDERS.DETERMINISTIC
    };
};

/**
 * Client context summary using best available provider
 */
export const summarizeClientContext = async (clientData, context = {}) => {
    const selectedProvider = await getAvailableProvider();
    
    // Try Hugging Face first
    if (selectedProvider === AI_PROVIDERS.HUGGINGFACE) {
        try {
            const { summarizeClientContext } = await import('./hfAssist.js');
            const result = await summarizeClientContext(clientData, context);
            if (result.enhanced) {
                return {
                    ...result,
                    provider: AI_PROVIDERS.HUGGINGFACE
                };
            }
        } catch (error) {
            console.warn('Hugging Face summary failed, using deterministic:', error.message);
        }
    }
    
    // Deterministic fallback
    const fallbackSummary = `${clientData.name || 'Client'}, Risk Profile: ${clientData.riskProfile || 'Not assessed'}, Goals: ${clientData.goals?.length || 0} defined goals.`;
    return {
        content: fallbackSummary,
        enhanced: false,
        source: 'deterministic',
        provider: AI_PROVIDERS.DETERMINISTIC
    };
};

/**
 * Risk narrative expansion using best available provider
 */
export const expandRiskNarrative = async (knownRisks, context = {}) => {
    const selectedProvider = await getAvailableProvider();
    
    // Try Hugging Face first
    if (selectedProvider === AI_PROVIDERS.HUGGINGFACE) {
        try {
            const { expandRiskNarrative } = await import('./hfAssist.js');
            const result = await expandRiskNarrative(knownRisks, context);
            if (result.enhanced) {
                return {
                    ...result,
                    provider: AI_PROVIDERS.HUGGINGFACE
                };
            }
        } catch (error) {
            console.warn('Hugging Face risk expansion failed, using deterministic:', error.message);
        }
    }
    
    // Deterministic fallback
    const fallbackNarrative = knownRisks && knownRisks.length > 0
        ? knownRisks.map(risk => `${risk.type}: ${risk.description} (Probability: ${risk.probability || 'Unknown'})`).join('. ')
        : 'No significant risks identified in current analysis.';
        
    return {
        content: fallbackNarrative,
        enhanced: false,
        source: 'deterministic',
        provider: AI_PROVIDERS.DETERMINISTIC
    };
};

/**
 * Log AI usage across all providers for accountability
 */
export const logAIUsage = (operation, provider, success, reason = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation: operation,
        provider: provider,
        success: success,
        reason: reason
    };
    
    // In production, send to proper logging system
    console.log('AI Assistance Usage:', logEntry);
};

/**
 * Force refresh of provider availability cache
 * Useful when configuration changes or providers become available/unavailable
 */
export const refreshProviderCache = async () => {
    return await getAvailableProvider(true);
};

export { AI_PROVIDERS };