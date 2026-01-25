// Simple Text Enhancement - Fallback for when AI APIs fail
// Provides basic text improvement without external dependencies

/**
 * Simple rule-based text enhancement for financial content
 * This serves as a reliable fallback when AI APIs are unavailable
 */
export const enhanceTextSimply = (originalText, context = {}) => {
    if (!originalText || typeof originalText !== 'string') {
        return {
            content: originalText || '',
            enhanced: false,
            source: 'deterministic',
            reason: 'Invalid input text'
        };
    }

    let enhanced = originalText;

    // Basic improvements
    const improvements = [
        // Replace technical jargon with clearer terms
        { from: /volatility metrics/gi, to: 'market fluctuation measures' },
        { from: /threshold parameters/gi, to: 'risk limits' },
        { from: /elevated volatility/gi, to: 'increased market fluctuations' },
        { from: /portfolio analysis/gi, to: 'investment review' },
        { from: /risk assessment/gi, to: 'risk evaluation' },
        { from: /probability assessment/gi, to: 'likelihood evaluation' },
        
        // Improve sentence structure
        { from: /indicates that/gi, to: 'shows that' },
        { from: /demonstrates/gi, to: 'shows' },
        { from: /utilizing/gi, to: 'using' },
        { from: /facilitate/gi, to: 'help' },
        
        // Add clarity to financial terms
        { from: /asset allocation/gi, to: 'how investments are divided' },
        { from: /diversification/gi, to: 'spreading investments across different areas' },
        { from: /liquidity/gi, to: 'how easily investments can be converted to cash' }
    ];

    // Apply improvements
    improvements.forEach(improvement => {
        enhanced = enhanced.replace(improvement.from, improvement.to);
    });

    // Basic sentence structure improvements
    enhanced = enhanced
        // Remove redundant words
        .replace(/\b(very|quite|rather|somewhat)\s+/gi, '')
        // Improve flow
        .replace(/\. Additionally,/gi, '. Also,')
        .replace(/\. Furthermore,/gi, '. Also,')
        // Ensure proper spacing
        .replace(/\s+/g, ' ')
        .trim();

    // Check if any improvements were made
    const wasEnhanced = enhanced !== originalText;

    return {
        content: enhanced,
        enhanced: wasEnhanced,
        source: 'simple_enhancement',
        originalContent: originalText,
        reason: wasEnhanced ? 'Applied rule-based improvements' : 'No improvements needed'
    };
};

/**
 * Enhanced explanation with simple improvements
 */
export const enhanceExplanation = async (originalExplanation, context = {}) => {
    return enhanceTextSimply(originalExplanation, context);
};

/**
 * Simple client context summary
 */
export const summarizeClientContext = async (clientData, context = {}) => {
    const name = clientData.name || 'Client';
    const riskProfile = clientData.riskProfile || 'Not assessed';
    const goalCount = clientData.goals?.length || 0;
    
    const summary = `${name} has a ${riskProfile.toLowerCase()} risk profile with ${goalCount} defined financial goals. ` +
                   `${goalCount > 0 ? 'Their planning focuses on achieving these specific objectives.' : 'Additional goal setting may be beneficial.'}`;

    return {
        content: summary,
        enhanced: true,
        source: 'simple_enhancement'
    };
};

/**
 * Simple risk narrative expansion
 */
export const expandRiskNarrative = async (knownRisks, context = {}) => {
    if (!knownRisks || knownRisks.length === 0) {
        return {
            content: 'No significant risks have been identified in the current analysis. However, all investments carry some level of risk.',
            enhanced: true,
            source: 'simple_enhancement'
        };
    }
    
    const expandedRisks = knownRisks.map(risk => {
        const riskType = risk.type || 'Unknown risk';
        const description = risk.description || 'No description available';
        const probability = risk.probability || 'Unknown likelihood';
        
        return `${riskType}: ${description} The likelihood of this occurring is ${probability.toLowerCase()}.`;
    }).join(' ');
    
    const narrative = `${expandedRisks} These risks should be carefully considered as part of your investment decision-making process.`;
    
    return {
        content: narrative,
        enhanced: true,
        source: 'simple_enhancement'
    };
};

/**
 * Get status of simple enhancer (always available)
 */
export const getSimpleEnhancerStatus = () => {
    return {
        enabled: true,
        mode: 'simple_rule_based',
        reliable: true,
        description: 'Rule-based text enhancement - always available'
    };
};