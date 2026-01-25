export const mockInvestorProfile = {
    id: 'INV-2025-001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    age: 35,
    occupation: 'Software Engineer',
    annualIncome: 2400000,
    investableAssets: 1500000,
    
    goals: [
        { name: 'Retirement Corpus', target: 50000000, horizon: '25 years', priority: 'High' },
        { name: 'Child Education', target: 5000000, horizon: '15 years', priority: 'High' },
        { name: 'Home Purchase', target: 10000000, horizon: '5 years', priority: 'Medium' },
    ],
    
    riskProfile: {
        stated: 'Moderate',
        score: 6,
        maxDrawdownTolerance: 15,
        investmentExperience: '5-10 years',
    },
    
    preferences: {
        assetClasses: ['Equity Mutual Funds', 'Index Funds', 'Fixed Deposits'],
        excludedSectors: ['Tobacco', 'Gambling'],
        prefersSRI: true,
        liquidityNeeds: 'Low',
    },
    
    currentPortfolio: {
        totalValue: 1200000,
        allocation: {
            equity: 65,
            debt: 25,
            gold: 5,
            cash: 5,
        },
        currentRiskScore: 7.5,
    },
    
    lifeEvents: [
        { event: 'Marriage', date: '2020-03', acknowledged: true },
        { event: 'First Child', date: '2023-06', acknowledged: true },
        { event: 'Job Change', date: '2025-01', acknowledged: false, pending: true },
    ],
    
    lastReviewDate: '2024-09-15',
    nextReviewDate: '2025-03-15',
};

export const mockAdvisorProfile = {
    id: 'ADV-2025-042',
    name: 'Priya Mehta',
    designation: 'Senior Wealth Advisor',
    certifications: ['NISM Series VA', 'CFP', 'AMFI Registered'],
    experience: 12,
    specializations: ['Equity Markets', 'Retirement Planning', 'Tax Optimization'],
    clientsManaged: 85,
    aum: 125000000,
    
    riskPhilosophy: 'Moderate-Conservative',
    investmentStyle: 'Long-term value investing with systematic rebalancing',
    
    compensation: {
        model: 'Fee-based with trail commission',
        advisoryFee: '0.75% per annum on AUM',
        trailCommission: 'Up to 1% on mutual fund investments',
    },
    
    conflictDisclosure: `As your advisor, I may receive trail commissions from mutual fund houses 
for investments made through my platform. This does not increase your cost 
but is disclosed for transparency. I am obligated to recommend products 
that are suitable for your risk profile regardless of commission structure.`,
};

export const calculateCompatibilityScore = (investor, advisor) => {
    let score = 0;
    const factors = [];
    
    // Apply .kiro/agent_brain/agent_constraints.md - Uncertainty Acknowledgment Requirements
    let confidenceLevel = 'High';
    const uncertaintyFactors = [];
    
    const investorRisk = investor.riskProfile.stated.toLowerCase();
    const advisorRisk = advisor.riskPhilosophy.toLowerCase();
    
    // Apply .kiro/policy_reasoning/policy_comparison_criteria.md - Multi-dimensional decision framework
    if (investorRisk.includes('moderate') && advisorRisk.includes('moderate')) {
        score += 30;
        factors.push({ factor: 'Risk Philosophy Alignment', contribution: 30, detail: 'Both favor moderate risk approach' });
    } else if (Math.abs(investor.riskProfile.score - 5) <= 2) {
        score += 20;
        factors.push({ factor: 'Risk Philosophy Alignment', contribution: 20, detail: 'Reasonable alignment on risk tolerance' });
        uncertaintyFactors.push('Risk alignment based on limited data points');
    } else {
        score += 10;
        factors.push({ factor: 'Risk Philosophy Alignment', contribution: 10, detail: 'Some divergence in risk approach' });
        confidenceLevel = 'Medium';
        uncertaintyFactors.push('Significant risk philosophy differences detected');
    }
    
    const hasRetirement = investor.goals.some(g => g.name.toLowerCase().includes('retirement'));
    const advisorSpecializes = advisor.specializations.includes('Retirement Planning');
    if (hasRetirement && advisorSpecializes) {
        score += 25;
        factors.push({ factor: 'Goal-Expertise Match', contribution: 25, detail: 'Advisor specializes in your primary goal (Retirement)' });
    } else {
        score += 15;
        factors.push({ factor: 'Goal-Expertise Match', contribution: 15, detail: 'General expertise applicable to your goals' });
        if (!hasRetirement) {
            uncertaintyFactors.push('Goal-expertise match based on general capabilities');
        }
    }
    
    if (advisor.experience >= 10) {
        score += 20;
        factors.push({ factor: 'Experience Level', contribution: 20, detail: `${advisor.experience}+ years managing similar profiles` });
    } else {
        score += 12;
        factors.push({ factor: 'Experience Level', contribution: 12, detail: `${advisor.experience} years of experience` });
        if (advisor.experience < 5) {
            confidenceLevel = 'Medium';
            uncertaintyFactors.push('Limited advisor experience for complex scenarios');
        }
    }
    
    if (investor.preferences.prefersSRI) {
        score += 10;
        factors.push({ factor: 'Investment Style Compatibility', contribution: 10, detail: 'Supports responsible investing preferences' });
    } else {
        score += 15;
        factors.push({ factor: 'Investment Style Compatibility', contribution: 15, detail: 'Aligned on long-term value approach' });
    }
    
    // Apply .kiro/agent_brain/agent_constraints.md - Conservative Bias Requirements
    const finalScore = Math.min(score, 100);
    
    // Apply .kiro/failure_playbooks/false_positive_risk.md - Confidence thresholds
    if (uncertaintyFactors.length >= 2) {
        confidenceLevel = 'Low';
    }
    
    // Apply .kiro/agent_brain/when_agent_should_not_act.md - Professional consultation triggers
    const requiresProfessionalConsultation = confidenceLevel === 'Low' || finalScore < 60;
    
    return { 
        score: finalScore, 
        factors,
        confidenceLevel,
        uncertaintyFactors,
        requiresProfessionalConsultation
    };
};

export const detectRiskMismatch = (investor) => {
    const stated = investor.riskProfile.score;
    const actual = investor.currentPortfolio.currentRiskScore;
    const deviation = actual - stated;
    
    // Apply .kiro/decision_graphs/money_weather_decision_graph.md risk threshold logic
    // Low Risk Band: <15% probability, Medium: 15-40%, High: >40%
    const riskProbability = Math.abs(deviation) * 10; // Convert to percentage
    
    if (Math.abs(deviation) < 1) {
        return null; // Within acceptable range per .kiro constraints
    }
    
    // Apply .kiro/agent_brain/agent_constraints.md - Conservative Bias Requirements
    const severity = Math.abs(deviation) >= 2 ? 'High' : 'Medium';
    
    // Follow .kiro/agent_brain/agent_goals.md - Risk Prevention priority
    return {
        hasAlert: true,
        severity: severity,
        statedRisk: stated,
        actualRisk: actual.toFixed(1),
        deviation: deviation.toFixed(1),
        direction: deviation > 0 ? 'Higher' : 'Lower',
        // Apply .kiro/problem_decomposition/financial_risk_invisibility.md - Honest uncertainty communication
        confidenceLevel: Math.abs(deviation) >= 2 ? 'High' : 'Medium',
        explanation: deviation > 0 
            ? `Current portfolio risk (${actual.toFixed(1)}/10) exceeds stated risk tolerance (${stated}/10). Portfolio has higher equity exposure than recommended for this risk profile.`
            : `Current portfolio risk (${actual.toFixed(1)}/10) is below stated risk tolerance (${stated}/10). Portfolio may be too conservative, potentially limiting growth.`,
        suggestedAction: deviation > 0
            ? 'Consider rebalancing by shifting 10-15% from equity to debt instruments to align with stated risk tolerance.'
            : 'Consider increasing equity allocation by 5-10% to optimize for stated risk tolerance and long-term goals.',
        // Apply .kiro/agent_brain/when_agent_should_not_act.md - Professional consultation triggers
        requiresProfessionalConsultation: Math.abs(deviation) >= 2.5
    };
};

export const generateClientSummary = async (investor, advisor) => {
    const mismatch = detectRiskMismatch(investor);
    const pendingEvents = investor.lifeEvents.filter(e => e.pending);
    
    // Generate deterministic summary first (always available)
    const deterministicSummary = `${investor.name} is a ${investor.age}-year-old ${investor.occupation} with ${investor.riskProfile.investmentExperience} of investment experience. Primary financial goals include ${investor.goals.slice(0, 2).map(g => g.name).join(' and ')} with time horizons of ${investor.goals[0].horizon} and ${investor.goals[1].horizon} respectively. Stated risk tolerance is ${investor.riskProfile.stated} (${investor.riskProfile.score}/10) with a maximum drawdown tolerance of ${investor.riskProfile.maxDrawdownTolerance}%. ${mismatch ? `ALERT: Portfolio risk currently ${mismatch.direction.toLowerCase()} than profile suggests. ` : ''}${pendingEvents.length > 0 ? `Recent life event (${pendingEvents[0].event}) requires plan review. ` : ''}Current AUM: ₹${(investor.currentPortfolio.totalValue / 100000).toFixed(1)}L. Next scheduled review: ${investor.nextReviewDate}.`;
    
    // Try AI enhancement if available (optional)
    try {
        const { summarizeClientContext } = await import('../utils/aiAssistanceSelector.js');
        const enhanced = await summarizeClientContext({
            name: investor.name,
            age: investor.age,
            occupation: investor.occupation,
            riskProfile: investor.riskProfile,
            goals: investor.goals,
            mismatch: mismatch,
            pendingEvents: pendingEvents,
            aum: investor.currentPortfolio.totalValue
        });
        
        return enhanced.enhanced ? enhanced.content : deterministicSummary;
    } catch (error) {
        // Fallback to deterministic summary if AI fails
        console.warn('AI enhancement failed for client summary:', error);
        return deterministicSummary;
    }
};

export const lifeEventImpacts = {
    'Marriage': {
        assumptions: ['Single income planning', 'Individual insurance coverage', 'Personal expense ratios'],
        impacts: ['May need to revise income projections', 'Review life insurance beneficiary', 'Reassess emergency fund requirement'],
        nextSteps: ['Schedule joint financial planning session', 'Review and consolidate insurance policies', 'Update nomination details'],
    },
    'Job Change': {
        assumptions: ['Previous salary growth projections', 'Employer benefits package', 'Provident fund contributions'],
        impacts: ['Income may increase or decrease', 'New PF account requires transfer planning', 'May affect tax bracket and planning'],
        nextSteps: ['Update income details in financial plan', 'Decide on PF transfer vs withdrawal', 'Review gratuity and new benefits'],
    },
    'First Child': {
        assumptions: ['Expense projections', 'Insurance coverage adequacy', 'Long-term savings allocations'],
        impacts: ['Education planning becomes priority', 'Life insurance needs increase significantly', 'Monthly surplus may reduce'],
        nextSteps: ['Start child education fund immediately', 'Increase term insurance coverage', 'Review and adjust budget allocations'],
    },
    'Home Purchase': {
        assumptions: ['Liquid asset availability', 'Debt-to-income ratio', 'Monthly cash flow'],
        impacts: ['Significant portion of savings deployed', 'EMI commitment affects investable surplus', 'Asset allocation changes (real estate added)'],
        nextSteps: ['Rebuild emergency fund over 12 months', 'Adjust SIP amounts to accommodate EMI', 'Review overall asset allocation'],
    },
};

// .kiro Integration: Apply agent brain constraints to all recommendations
export const validateRecommendationWithKiroConstraints = async (recommendation, userProfile) => {
    const validation = {
        isValid: true,
        warnings: [],
        requiresProfessionalConsultation: false,
        confidenceLevel: 'High',
        ethicalConstraints: []
    };
    
    // Apply .kiro/agent_brain/agent_constraints.md - User Autonomy Preservation
    if (recommendation.type === 'mandatory' || recommendation.urgency === 'immediate') {
        validation.ethicalConstraints.push('Recommendation must preserve user choice and decision authority');
        validation.warnings.push('High-urgency recommendations require explicit user consent');
    }
    
    // Apply .kiro/agent_brain/agent_constraints.md - Exploitation Prevention
    if (recommendation.expectedReturn && parseFloat(recommendation.expectedReturn) > 15) {
        validation.warnings.push('High return expectations require explicit risk disclosure');
        validation.confidenceLevel = 'Medium';
    }
    
    // Apply .kiro/agent_brain/agent_goals.md - Risk Prevention priority
    if (recommendation.risk === 'High' && userProfile?.riskProfile?.score < 7) {
        validation.warnings.push('Risk level exceeds user stated tolerance');
        validation.requiresProfessionalConsultation = true;
    }
    
    // Apply .kiro/agent_brain/when_agent_should_not_act.md - Insufficient information scenarios
    if (!userProfile || !userProfile.riskProfile || !userProfile.goals) {
        validation.isValid = false;
        validation.warnings.push('Insufficient user profile data for reliable recommendation');
        validation.confidenceLevel = 'Low';
    }
    
    // Apply .kiro/failure_playbooks/false_positive_risk.md - Alert fatigue prevention
    if (recommendation.urgency === 'high' && !recommendation.reasoning?.length) {
        validation.warnings.push('High-urgency recommendations require detailed reasoning');
        validation.confidenceLevel = 'Low';
    }
    
    // Enhance warnings with AI assistance if available (optional)
    try {
        const { enhanceExplanation } = await import('../utils/aiAssistanceSelector.js');
        
        if (validation.warnings.length > 0) {
            const warningText = validation.warnings.join('. ');
            const enhanced = await enhanceExplanation(warningText, {
                confidence: validation.confidenceLevel === 'High' ? 0.8 : 0.6,
                userProfile: userProfile
            });
            
            if (enhanced.enhanced) {
                validation.enhancedWarnings = enhanced.content;
            }
        }
    } catch (error) {
        // Silently continue without AI enhancement
        console.warn('AI enhancement failed for validation warnings:', error);
    }
    
    return validation;
};
