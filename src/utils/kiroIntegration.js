// .kiro Integration Utilities
// This file provides integration points between the existing app and .kiro reasoning frameworks

/**
 * Apply .kiro/agent_brain/agent_constraints.md constraints to any financial decision
 */
export const applyAgentConstraints = (decision, userContext) => {
    const constraints = {
        userAutonomyPreserved: true,
        noGuaranteedReturns: true,
        explicitUncertainty: true,
        noAutonomousActions: true,
        violations: []
    };

    // Check for guaranteed return language
    if (decision.description && decision.description.toLowerCase().includes('guaranteed')) {
        constraints.noGuaranteedReturns = false;
        constraints.violations.push('Contains guaranteed return language - violates agent constraints');
    }

    // Check for autonomous action language
    if (decision.type === 'automatic' || decision.autoExecute) {
        constraints.noAutonomousActions = false;
        constraints.violations.push('Automatic execution violates user autonomy constraints');
    }

    // Check for uncertainty acknowledgment
    if (decision.confidence && !decision.uncertaintyRange) {
        constraints.explicitUncertainty = false;
        constraints.violations.push('Missing uncertainty acknowledgment for confident predictions');
    }

    return constraints;
};

/**
 * Apply .kiro/decision_graphs/money_weather_decision_graph.md risk thresholds
 */
export const assessRiskThreshold = (riskProbability, impactSeverity) => {
    // Risk Threshold Band Definitions from .kiro
    if (riskProbability < 15 && impactSeverity < 10) {
        return {
            band: 'Low',
            color: 'green',
            action: 'monitor',
            intervention: false,
            confidence: 'high'
        };
    } else if (riskProbability >= 15 && riskProbability <= 40) {
        return {
            band: 'Medium',
            color: 'yellow', 
            action: 'warn',
            intervention: true,
            confidence: 'medium'
        };
    } else if (riskProbability > 40) {
        return {
            band: 'High',
            color: 'red',
            action: 'escalate',
            intervention: true,
            confidence: 'high'
        };
    }
    
    return {
        band: 'Unknown',
        color: 'gray',
        action: 'defer',
        intervention: false,
        confidence: 'low'
    };
};

/**
 * Apply .kiro/failure_playbooks/false_positive_risk.md prevention logic
 */
export const preventFalsePositives = (alert, userHistory) => {
    const prevention = {
        shouldTrigger: true,
        confidence: 'high',
        reasons: []
    };

    // Check alert fatigue risk
    const recentAlerts = userHistory?.alerts?.filter(a => 
        Date.now() - new Date(a.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000
    ) || [];

    if (recentAlerts.length >= 3) {
        prevention.shouldTrigger = false;
        prevention.reasons.push('Alert fatigue risk - too many recent alerts');
    }

    // Check user dismissal patterns
    const dismissalRate = userHistory?.alertDismissalRate || 0;
    if (dismissalRate > 0.7) {
        prevention.confidence = 'low';
        prevention.reasons.push('High user dismissal rate indicates potential false positive pattern');
    }

    // Check prediction confidence
    if (alert.confidence < 0.6) {
        prevention.shouldTrigger = false;
        prevention.reasons.push('Prediction confidence below .kiro threshold (60%)');
    }

    return prevention;
};

/**
 * Apply .kiro/agent_brain/when_agent_should_not_act.md restraint logic
 */
export const shouldAgentAct = (scenario, userCapability, informationQuality) => {
    const decision = {
        shouldAct: true,
        reason: 'Conditions met for agent intervention',
        alternativeAction: null
    };

    // Insufficient information scenarios
    if (informationQuality < 0.7) {
        decision.shouldAct = false;
        decision.reason = 'Insufficient information quality for reliable intervention';
        decision.alternativeAction = 'Request additional information or defer to professional';
    }

    // User competence recognition
    if (userCapability?.demonstratedSuccess && scenario.complexity <= userCapability.handledComplexity) {
        decision.shouldAct = false;
        decision.reason = 'User has demonstrated capability to handle this scenario independently';
        decision.alternativeAction = 'Monitor without intervention';
    }

    // Low-impact scenarios
    if (scenario.impact < 0.3 && scenario.probability < 0.4) {
        decision.shouldAct = false;
        decision.reason = 'Low impact and probability - intervention may cause more harm than benefit';
        decision.alternativeAction = 'Continue monitoring';
    }

    return decision;
};

/**
 * Apply .kiro/problem_decomposition/financial_risk_invisibility.md uncertainty representation
 */
export const representUncertainty = (prediction, confidence) => {
    // Convert point estimates to probability ranges per .kiro requirements
    const uncertaintyRange = {
        low: prediction * (1 - (1 - confidence) * 0.5),
        high: prediction * (1 + (1 - confidence) * 0.5),
        confidence: confidence,
        display: `${(prediction * (1 - (1 - confidence) * 0.5)).toFixed(1)} - ${(prediction * (1 + (1 - confidence) * 0.5)).toFixed(1)}`
    };

    return {
        pointEstimate: prediction,
        range: uncertaintyRange,
        confidenceLevel: confidence > 0.8 ? 'High' : confidence > 0.6 ? 'Medium' : 'Low',
        shouldShowRange: confidence < 0.9, // Always show uncertainty unless very confident
        disclaimer: confidence < 0.7 ? 'Low confidence prediction - consider professional consultation' : null
    };
};

/**
 * Log high-impact decisions for .kiro/eth_accountability integration
 */
export const logForAccountability = (decision, userContext, impact) => {
    // Only log high-impact decisions per .kiro/eth_accountability/what_goes_on_chain.md
    if (impact < 0.7) {
        return null; // Don't log low-impact decisions
    }

    const logEntry = {
        timestamp: new Date().toISOString(),
        decisionType: decision.type,
        impactLevel: impact,
        userContextHash: hashUserContext(userContext), // Hash for privacy
        decisionHash: hashDecision(decision),
        confidenceLevel: decision.confidence || 'unknown'
    };

    // In a real implementation, this would create blockchain anchor
    console.log('High-impact decision logged for accountability:', logEntry);
    
    return logEntry;
};

// Helper functions for hashing (simplified for demo)
const hashUserContext = (context) => {
    // In real implementation, use proper cryptographic hash
    return btoa(JSON.stringify(context)).substring(0, 16);
};

const hashDecision = (decision) => {
    // In real implementation, use proper cryptographic hash  
    return btoa(JSON.stringify(decision)).substring(0, 16);
};