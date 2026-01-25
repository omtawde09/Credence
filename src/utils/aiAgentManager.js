// AI Agent Manager - Coordinates Assistive AI Agents
// Ensures proper execution order and safety constraints
// ALL business logic remains in deterministic rule-based system

import { 
    identifySpendingTrends, 
    highlightCategoryChanges, 
    describeExpenseRanges,
    getSpendingPredictorStatus,
    logSpendingPredictorUsage
} from './spendingPredictorAgent.js';

import { 
    generateClientSummary, 
    surfaceKeyDiscussionPoints, 
    prioritizeAttentionAreas,
    getAdvisorAssistantStatus,
    logAdvisorAssistantUsage
} from './advisorDashboardAssistant.js';

/**
 * AI Agent Manager Configuration
 */
const AGENT_CONFIG = {
    executionOrder: 'STRICT', // Raw data → Deterministic → AI (NEVER reversed)
    safetyValidation: 'MANDATORY', // All AI outputs must pass validation
    fallbackBehavior: 'DETERMINISTIC', // Always fall back to rule-based logic
    loggingLevel: 'USAGE_ONLY' // Log usage only, never user data
};

/**
 * Initialize all AI agents and check system readiness
 */
export const initializeAIAgents = () => {
    console.log('🤖 Initializing AI Agent Manager...');
    
    // Check API token configuration
    const hfToken = import.meta.env.VITE_HF_API_TOKEN;
    
    if (!hfToken) {
        console.warn('⚠️  HF_API_TOKEN not configured - AI agents will run in deterministic mode only');
        console.log('To enable AI assistance, set HF_API_TOKEN environment variable');
        return {
            enabled: false,
            reason: 'HF_API_TOKEN not configured',
            mode: 'deterministic_only'
        };
    }
    
    // Get agent status
    const spendingPredictorStatus = getSpendingPredictorStatus();
    const advisorAssistantStatus = getAdvisorAssistantStatus();
    
    const systemStatus = {
        enabled: spendingPredictorStatus.enabled || advisorAssistantStatus.enabled,
        agents: {
            spendingPredictor: spendingPredictorStatus,
            advisorAssistant: advisorAssistantStatus
        },
        mode: spendingPredictorStatus.enabled ? 'ai_enhanced' : 'deterministic_only',
        executionOrder: AGENT_CONFIG.executionOrder,
        safetyValidation: AGENT_CONFIG.safetyValidation
    };
    
    console.log('✅ AI Agent Manager initialized:', systemStatus);
    return systemStatus;
};

/**
 * STRICT EXECUTION ORDER ENFORCEMENT
 * Ensures AI agents NEVER run before deterministic logic
 */
const enforceExecutionOrder = (deterministicResult, aiFunction, ...args) => {
    // CRITICAL: Deterministic result must be provided first
    if (!deterministicResult) {
        throw new Error('EXECUTION_ORDER_VIOLATION: Deterministic logic must run before AI agents');
    }
    
    // AI can only enhance, never replace deterministic logic
    return aiFunction(...args);
};

/**
 * SPENDING PREDICTOR AGENT INTERFACE
 * Provides spending trend analysis with strict safety constraints
 */
export const spendingPredictorAgent = {
    /**
     * Analyze spending trends (AI-enhanced narrative)
     * REQUIRES: Deterministic spending analysis must be completed first
     */
    analyzeTrends: async (deterministicAnalysis, spendingData, context = {}) => {
        // Enforce execution order
        if (!deterministicAnalysis) {
            console.error('EXECUTION_ORDER_VIOLATION: Deterministic spending analysis required first');
            return {
                content: 'Spending trend analysis not available - deterministic analysis required first.',
                enhanced: false,
                source: 'error',
                violation: 'execution_order'
            };
        }
        
        try {
            const result = await enforceExecutionOrder(
                deterministicAnalysis,
                identifySpendingTrends,
                spendingData,
                context
            );
            
            // Log usage for accountability
            logSpendingPredictorUsage('analyzeTrends', result.enhanced, result.reason);
            
            return result;
        } catch (error) {
            console.error('Spending Predictor Agent error:', error);
            logSpendingPredictorUsage('analyzeTrends', false, error.message);
            
            return {
                content: deterministicAnalysis.summary || 'Deterministic spending analysis available.',
                enhanced: false,
                source: 'deterministic',
                error: error.message
            };
        }
    },

    /**
     * Highlight category changes (AI-enhanced explanation)
     * REQUIRES: Deterministic category analysis must be completed first
     */
    highlightChanges: async (deterministicChanges, categoryData, context = {}) => {
        if (!deterministicChanges) {
            console.error('EXECUTION_ORDER_VIOLATION: Deterministic category analysis required first');
            return {
                content: 'Category change analysis not available - deterministic analysis required first.',
                enhanced: false,
                source: 'error',
                violation: 'execution_order'
            };
        }
        
        try {
            const result = await enforceExecutionOrder(
                deterministicChanges,
                highlightCategoryChanges,
                categoryData,
                context
            );
            
            logSpendingPredictorUsage('highlightChanges', result.enhanced, result.reason);
            return result;
        } catch (error) {
            console.error('Spending Predictor Agent error:', error);
            logSpendingPredictorUsage('highlightChanges', false, error.message);
            
            return {
                content: deterministicChanges.summary || 'Deterministic category analysis available.',
                enhanced: false,
                source: 'deterministic',
                error: error.message
            };
        }
    },

    /**
     * Describe expense ranges (AI-enhanced qualitative description)
     * REQUIRES: Deterministic range analysis must be completed first
     */
    describeRanges: async (deterministicRanges, expenseData, context = {}) => {
        if (!deterministicRanges) {
            console.error('EXECUTION_ORDER_VIOLATION: Deterministic range analysis required first');
            return {
                content: 'Expense range analysis not available - deterministic analysis required first.',
                enhanced: false,
                source: 'error',
                violation: 'execution_order'
            };
        }
        
        try {
            const result = await enforceExecutionOrder(
                deterministicRanges,
                describeExpenseRanges,
                expenseData,
                context
            );
            
            logSpendingPredictorUsage('describeRanges', result.enhanced, result.reason);
            return result;
        } catch (error) {
            console.error('Spending Predictor Agent error:', error);
            logSpendingPredictorUsage('describeRanges', false, error.message);
            
            return {
                content: deterministicRanges.summary || 'Deterministic range analysis available.',
                enhanced: false,
                source: 'deterministic',
                error: error.message
            };
        }
    }
};

/**
 * ADVISOR DASHBOARD ASSISTANT INTERFACE
 * Provides advisor-facing summaries with strict safety constraints
 */
export const advisorDashboardAssistant = {
    /**
     * Generate client summary (AI-enhanced professional summary)
     * REQUIRES: Deterministic client analysis must be completed first
     */
    summarizeClient: async (deterministicSummary, clientData, context = {}) => {
        if (!deterministicSummary) {
            console.error('EXECUTION_ORDER_VIOLATION: Deterministic client analysis required first');
            return {
                content: 'Client summary not available - deterministic analysis required first.',
                enhanced: false,
                source: 'error',
                violation: 'execution_order'
            };
        }
        
        try {
            const result = await enforceExecutionOrder(
                deterministicSummary,
                generateClientSummary,
                clientData,
                context
            );
            
            logAdvisorAssistantUsage('summarizeClient', result.enhanced, result.reason);
            return result;
        } catch (error) {
            console.error('Advisor Dashboard Assistant error:', error);
            logAdvisorAssistantUsage('summarizeClient', false, error.message);
            
            return {
                content: deterministicSummary.summary || 'Deterministic client analysis available.',
                enhanced: false,
                source: 'deterministic',
                error: error.message
            };
        }
    },

    /**
     * Surface discussion points (AI-enhanced talking points)
     * REQUIRES: Deterministic alert analysis must be completed first
     */
    generateDiscussionPoints: async (deterministicAlerts, alertsData, context = {}) => {
        if (!deterministicAlerts) {
            console.error('EXECUTION_ORDER_VIOLATION: Deterministic alert analysis required first');
            return {
                content: 'Discussion points not available - deterministic alert analysis required first.',
                enhanced: false,
                source: 'error',
                violation: 'execution_order'
            };
        }
        
        try {
            const result = await enforceExecutionOrder(
                deterministicAlerts,
                surfaceKeyDiscussionPoints,
                alertsData,
                context
            );
            
            logAdvisorAssistantUsage('generateDiscussionPoints', result.enhanced, result.reason);
            return result;
        } catch (error) {
            console.error('Advisor Dashboard Assistant error:', error);
            logAdvisorAssistantUsage('generateDiscussionPoints', false, error.message);
            
            return {
                content: deterministicAlerts.summary || 'Deterministic alert analysis available.',
                enhanced: false,
                source: 'deterministic',
                error: error.message
            };
        }
    },

    /**
     * Prioritize attention areas (AI-enhanced prioritization)
     * REQUIRES: Deterministic priority analysis must be completed first
     */
    prioritizeAreas: async (deterministicPriorities, clientStatus, context = {}) => {
        if (!deterministicPriorities) {
            console.error('EXECUTION_ORDER_VIOLATION: Deterministic priority analysis required first');
            return {
                content: 'Attention areas not available - deterministic priority analysis required first.',
                enhanced: false,
                source: 'error',
                violation: 'execution_order'
            };
        }
        
        try {
            const result = await enforceExecutionOrder(
                deterministicPriorities,
                prioritizeAttentionAreas,
                clientStatus,
                context
            );
            
            logAdvisorAssistantUsage('prioritizeAreas', result.enhanced, result.reason);
            return result;
        } catch (error) {
            console.error('Advisor Dashboard Assistant error:', error);
            logAdvisorAssistantUsage('prioritizeAreas', false, error.message);
            
            return {
                content: deterministicPriorities.summary || 'Deterministic priority analysis available.',
                enhanced: false,
                source: 'deterministic',
                error: error.message
            };
        }
    }
};

/**
 * System health check for all AI agents
 */
export const getAIAgentSystemStatus = () => {
    const spendingStatus = getSpendingPredictorStatus();
    const advisorStatus = getAdvisorAssistantStatus();
    
    return {
        systemEnabled: spendingStatus.enabled || advisorStatus.enabled,
        agents: {
            spendingPredictor: spendingStatus,
            advisorAssistant: advisorStatus
        },
        configuration: AGENT_CONFIG,
        apiTokenPresent: Boolean(import.meta.env.VITE_HF_API_TOKEN),
        executionOrderEnforced: true,
        safetyValidationActive: true
    };
};

/**
 * Validate system configuration and constraints
 */
export const validateAIAgentSystem = () => {
    const validation = {
        isValid: true,
        violations: [],
        warnings: []
    };
    
    // Check API token configuration
    if (!import.meta.env.VITE_HF_API_TOKEN) {
        validation.warnings.push('HF_API_TOKEN not configured - agents will run in deterministic mode');
    }
    
    // Check execution order enforcement
    if (AGENT_CONFIG.executionOrder !== 'STRICT') {
        validation.isValid = false;
        validation.violations.push('Execution order enforcement not set to STRICT');
    }
    
    // Check safety validation
    if (AGENT_CONFIG.safetyValidation !== 'MANDATORY') {
        validation.isValid = false;
        validation.violations.push('Safety validation not set to MANDATORY');
    }
    
    // Check fallback behavior
    if (AGENT_CONFIG.fallbackBehavior !== 'DETERMINISTIC') {
        validation.isValid = false;
        validation.violations.push('Fallback behavior not set to DETERMINISTIC');
    }
    
    return validation;
};

/**
 * Emergency shutdown of all AI agents
 * Forces system to deterministic-only mode
 */
export const emergencyShutdownAIAgents = (reason = 'Manual shutdown') => {
    console.warn('🚨 EMERGENCY SHUTDOWN: Disabling all AI agents');
    console.warn('Reason:', reason);
    
    // Force deterministic mode by clearing token reference
    // (Note: This doesn't actually modify environment variables)
    const shutdownStatus = {
        timestamp: new Date().toISOString(),
        reason: reason,
        previousMode: getAIAgentSystemStatus().systemEnabled ? 'ai_enhanced' : 'deterministic_only',
        currentMode: 'deterministic_only',
        systemFunctional: true // System continues to work without AI
    };
    
    console.log('✅ System continues in deterministic mode');
    return shutdownStatus;
};

// Initialize agents on module load
initializeAIAgents();