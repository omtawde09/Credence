# Policy Selection Agent - Detailed Specification

## Agent Purpose and Constraints

### Primary Objective
Validate insurance eligibility and detect coverage gaps while preventing over-insurance through life-stage suitability mapping.

### Operational Constraints
- **NO autonomous policy purchases** - Agent provides recommendations only
- **Conservative coverage bias** - Err on side of adequate protection over cost optimization
- **Explicit suitability reasoning** - All recommendations include detailed rationale
- **Professional consultation triggers** - Complex scenarios require expert guidance

## Input Processing Architecture

### Demographic Risk Profiling
```javascript
const processDemographicInputs = (userProfile) => {
  return {
    ageRiskProfile: calculateAgeRiskProfile(userProfile.age),
    lifeStageMapping: mapLifeStage(userProfile),
    dependencyAnalysis: analyzeDependencies(userProfile.dependents),
    geographicRiskFactors: assessGeographicRisk(userProfile.location)
  };
};

const mapLifeStage = (userProfile) => {
  const { age, maritalStatus, dependents, homeOwnership } = userProfile;
  
  if (age < 30 && dependents.length === 0) {
    return {
      stage: 'young_professional',
      insurancePriorities: ['health', 'term_life_basic', 'disability'],
      coverageMultipliers: { life: 5, health: 'basic' }
    };
  }
  
  if (age >= 30 && dependents.length > 0) {
    return {
      stage: 'family_provider',
      insurancePriorities: ['term_life_comprehensive', 'health_family', 'child_education'],
      coverageMultipliers: { life: 10, health: 'comprehensive' }
    };
  }
  
  return {
    stage: 'pre_retirement',
    insurancePriorities: ['health_senior', 'critical_illness', 'long_term_care'],
    coverageMultipliers: { life: 3, health: 'premium' }
  };
};
```

### Financial Capacity Assessment
```javascript
const assessFinancialCapacity = (incomeData, existingObligations) => {
  const disposableIncome = calculateDisposableIncome(incomeData, existingObligations);
  const premiumAffordability = calculatePremiumAffordability(disposableIncome);
  
  return {
    maxAffordablePremium: premiumAffordability.monthly,
    sustainabilityScore: premiumAffordability.sustainability,
    riskTolerance: assessRiskTolerance(incomeData.volatility),
    paymentFlexibilityNeeds: assessPaymentFlexibility(incomeData.patterns)
  };
};
```

## Eligibility Assessment Engine

### Multi-Factor Eligibility Screening
```javascript
const assessPolicyEligibility = (userProfile, policyType) => {
  const eligibilityFactors = {
    age: assessAgeEligibility(userProfile.age, policyType),
    health: assessHealthEligibility(userProfile.healthSignals, policyType),
    income: assessIncomeEligibility(userProfile.income, policyType),
    existing: assessExistingCoverageImpact(userProfile.existingPolicies, policyType)
  };
  
  const overallEligibility = calculateOverallEligibility(eligibilityFactors);
  
  return {
    eligible: overallEligibility.status,
    confidence: overallEligibility.confidence,
    eligibilityScore: overallEligibility.score,
    disqualifyingFactors: identifyDisqualifyingFactors(eligibilityFactors),
    conditionalRequirements: identifyConditionalRequirements(eligibilityFactors),
    alternativeOptions: suggestAlternativeOptions(eligibilityFactors, policyType)
  };
};
```
### Coverage Gap Detection
```javascript
const detectCoverageGaps = (userProfile, existingPolicies) => {
  const requiredCoverage = calculateRequiredCoverage(userProfile);
  const currentCoverage = analyzeCurrent Coverage(existingPolicies);
  
  const gaps = [];
  
  // Life insurance gap analysis
  if (currentCoverage.life < requiredCoverage.life) {
    gaps.push({
      type: 'life_insurance',
      currentAmount: currentCoverage.life,
      requiredAmount: requiredCoverage.life,
      gapAmount: requiredCoverage.life - currentCoverage.life,
      priority: 'high',
      reasoning: 'Insufficient coverage for family financial security'
    });
  }
  
  // Health insurance gap analysis
  if (!currentCoverage.health || currentCoverage.health < requiredCoverage.health) {
    gaps.push({
      type: 'health_insurance',
      currentAmount: currentCoverage.health || 0,
      requiredAmount: requiredCoverage.health,
      gapAmount: requiredCoverage.health - (currentCoverage.health || 0),
      priority: 'critical',
      reasoning: 'Essential for medical expense protection'
    });
  }
  
  return gaps;
};
```

### Over-Insurance Detection
```javascript
const detectOverInsurance = (userProfile, recommendedCoverage) => {
  const overInsuranceThresholds = {
    life: userProfile.annualIncome * 15, // Max 15x annual income
    health: 2000000, // Max ₹20L for most users
    disability: userProfile.annualIncome * 0.8 // Max 80% income replacement
  };
  
  const overInsuranceFlags = [];
  
  Object.keys(recommendedCoverage).forEach(coverageType => {
    const recommended = recommendedCoverage[coverageType];
    const threshold = overInsuranceThresholds[coverageType];
    
    if (recommended > threshold) {
      overInsuranceFlags.push({
        type: coverageType,
        recommendedAmount: recommended,
        reasonableMaximum: threshold,
        excessAmount: recommended - threshold,
        reasoning: `Exceeds reasonable coverage limits for income level`,
        recommendation: 'Reduce coverage to reasonable limits'
      });
    }
  });
  
  return overInsuranceFlags;
};
```

## Suitability Assessment Framework

### Life-Stage Suitability Mapping
```javascript
const assessLifeStageSuitability = (userProfile, policyOptions) => {
  const lifeStage = mapLifeStage(userProfile);
  
  return policyOptions.map(policy => {
    const suitabilityScore = calculateSuitabilityScore(policy, lifeStage, userProfile);
    
    return {
      policyId: policy.id,
      policyName: policy.name,
      suitabilityScore: suitabilityScore.overall,
      suitabilityFactors: {
        lifeStageFit: suitabilityScore.lifeStageFit,
        affordability: suitabilityScore.affordability,
        coverageAdequacy: suitabilityScore.coverageAdequacy,
        flexibility: suitabilityScore.flexibility
      },
      reasoning: generateSuitabilityReasoning(suitabilityScore, lifeStage),
      confidence: suitabilityScore.confidence,
      recommendationLevel: determinerecommendationLevel(suitabilityScore)
    };
  });
};

const calculateSuitabilityScore = (policy, lifeStage, userProfile) => {
  const scores = {
    lifeStageFit: assessLifeStageFit(policy, lifeStage),
    affordability: assessAffordability(policy, userProfile.financialCapacity),
    coverageAdequacy: assessCoverageAdequacy(policy, userProfile.coverageNeeds),
    flexibility: assessFlexibility(policy, userProfile.flexibilityNeeds)
  };
  
  // Apply .kiro/policy_reasoning/policy_comparison_criteria.md weighting
  const weights = {
    lifeStageFit: 0.25,
    affordability: 0.35, // Higher weight for irregular income users
    coverageAdequacy: 0.25,
    flexibility: 0.15
  };
  
  const overall = Object.keys(scores).reduce((total, factor) => {
    return total + (scores[factor] * weights[factor]);
  }, 0);
  
  return {
    overall: overall,
    ...scores,
    confidence: calculateConfidence(scores)
  };
};
```

### Risk-Based Recommendation Engine
```javascript
const generateRiskBasedRecommendations = (userProfile, eligibilityAssessment) => {
  const riskProfile = assessUserRiskProfile(userProfile);
  const recommendations = [];
  
  // Essential coverage recommendations
  if (riskProfile.dependencyRisk === 'high') {
    recommendations.push({
      type: 'term_life',
      priority: 'critical',
      recommendedAmount: userProfile.annualIncome * 10,
      reasoning: 'High dependency risk requires substantial life coverage',
      confidence: 'high',
      urgency: 'immediate'
    });
  }
  
  // Health coverage recommendations
  if (!userProfile.existingPolicies.health) {
    recommendations.push({
      type: 'health_insurance',
      priority: 'critical',
      recommendedAmount: Math.max(500000, userProfile.annualIncome * 0.5),
      reasoning: 'Essential protection against medical expenses',
      confidence: 'high',
      urgency: 'immediate'
    });
  }
  
  // Disability coverage for income protection
  if (riskProfile.incomeRisk === 'high') {
    recommendations.push({
      type: 'disability_insurance',
      priority: 'high',
      recommendedAmount: userProfile.annualIncome * 0.6,
      reasoning: 'Income volatility increases disability coverage importance',
      confidence: 'medium',
      urgency: 'moderate'
    });
  }
  
  return recommendations;
};
```

## Output Generation and Communication

### Eligibility Assessment Output
```javascript
const generateEligibilityOutput = (userProfile, assessmentResults) => {
  return {
    eligibilityAssessment: {
      eligibleCategories: assessmentResults.eligible,
      disqualifications: assessmentResults.disqualified.map(dq => ({
        category: dq.category,
        reason: dq.reason,
        alternativeOptions: dq.alternatives,
        waitingPeriod: dq.waitingPeriod,
        conditions: dq.conditions
      })),
      conditionalEligibility: assessmentResults.conditional.map(ce => ({
        category: ce.category,
        conditions: ce.conditions,
        requirements: ce.requirements,
        timeline: ce.timeline
      }))
    },
    coverageRecommendations: generateCoverageRecommendations(userProfile, assessmentResults),
    riskExplanation: generateRiskExplanation(userProfile, assessmentResults),
    professionalConsultationRequired: assessConsultationNeed(assessmentResults),
    confidence: calculateOverallConfidence(assessmentResults),
    nextSteps: generateNextSteps(assessmentResults)
  };
};

const generateCoverageRecommendations = (userProfile, assessmentResults) => {
  const recommendations = {};
  
  assessmentResults.eligible.forEach(category => {
    const recommendation = calculateOptimalCoverage(category, userProfile);
    
    recommendations[category] = {
      recommendedAmount: recommendation.amount,
      rationale: recommendation.rationale,
      confidenceLevel: recommendation.confidence,
      premiumRange: recommendation.premiumRange,
      keyFeatures: recommendation.keyFeatures,
      suitabilityScore: recommendation.suitabilityScore
    };
  });
  
  return recommendations;
};
```

### Risk Explanation Generation
```javascript
const generateRiskExplanation = (userProfile, assessmentResults) => {
  const riskFactors = identifyRiskFactors(userProfile);
  const coverageGaps = detectCoverageGaps(userProfile, userProfile.existingPolicies);
  
  let explanation = '';
  
  // Primary risk explanation
  if (coverageGaps.length > 0) {
    const primaryGap = coverageGaps.find(gap => gap.priority === 'critical') || coverageGaps[0];
    explanation += `Current coverage gap of ₹${(primaryGap.gapAmount / 100000).toFixed(1)}L in ${primaryGap.type.replace('_', ' ')} creates ${primaryGap.reasoning.toLowerCase()}. `;
  }
  
  // Risk factor explanation
  if (riskFactors.length > 0) {
    const highRiskFactors = riskFactors.filter(rf => rf.severity === 'high');
    if (highRiskFactors.length > 0) {
      explanation += `Key risk factors include: ${highRiskFactors.map(rf => rf.description).join(', ')}. `;
    }
  }
  
  // Suitability explanation
  explanation += `Based on life stage (${userProfile.lifeStage}) and financial capacity, recommended coverage prioritizes ${getPriorityAreas(userProfile).join(' and ')}.`;
  
  return explanation;
};
```

## Integration with Existing Systems

### Policy Recommendation Engine Enhancement
```javascript
const enhanceExistingRecommendations = (existingRecommendations, agentAssessment) => {
  return existingRecommendations.map(recommendation => {
    const agentValidation = validateRecommendation(recommendation, agentAssessment);
    
    return {
      ...recommendation,
      agentValidation: {
        suitabilityScore: agentValidation.suitabilityScore,
        eligibilityConfirmed: agentValidation.eligibilityConfirmed,
        riskAssessment: agentValidation.riskAssessment,
        alternativeOptions: agentValidation.alternativeOptions
      },
      enhancedReasoning: combineReasoningWithAgent(recommendation.reasoning, agentValidation),
      confidenceLevel: Math.min(recommendation.confidence, agentValidation.confidence),
      warnings: agentValidation.warnings,
      professionalConsultationRequired: agentValidation.requiresConsultation
    };
  });
};
```

### Application Flow Integration
```javascript
const integrateWithApplicationFlow = (applicationData, agentAssessment) => {
  return {
    preFilledData: generatePreFilledData(applicationData, agentAssessment),
    eligibilityWarnings: generateEligibilityWarnings(agentAssessment),
    documentationRequirements: identifyDocumentationRequirements(agentAssessment),
    expectedProcessingTime: estimateProcessingTime(agentAssessment),
    alternativeProducts: suggestAlternativeProducts(agentAssessment),
    riskDisclosures: generateRiskDisclosures(agentAssessment)
  };
};
```

## Failure Scenarios and Handling

### Eligibility Assessment Errors
```javascript
const handleEligibilityErrors = (assessmentAttempt, userProfile) => {
  const errorTypes = identifyErrorTypes(assessmentAttempt);
  
  if (errorTypes.includes('insufficient_health_data')) {
    return {
      canAssess: false,
      reason: 'Insufficient health information for accurate eligibility assessment',
      requiredInformation: ['health_questionnaire', 'medical_history'],
      fallbackRecommendation: 'Proceed with standard health insurance application process',
      professionalConsultationRequired: true
    };
  }
  
  if (errorTypes.includes('complex_medical_history')) {
    return {
      canAssess: false,
      reason: 'Complex medical history requires professional underwriting assessment',
      requiredAction: 'Consult with insurance advisor for personalized assessment',
      estimatedTimeline: '7-14 days for professional review',
      professionalConsultationRequired: true
    };
  }
  
  return {
    canAssess: true,
    confidence: 'low',
    reason: 'Assessment completed with limited confidence',
    recommendedAction: 'Verify assessment with insurance professional'
  };
};
```

### Over-Insurance Prevention
```javascript
const preventOverInsurance = (recommendationSet, userProfile) => {
  const overInsuranceFlags = detectOverInsurance(userProfile, recommendationSet);
  
  if (overInsuranceFlags.length > 0) {
    return {
      adjustedRecommendations: adjustForOverInsurance(recommendationSet, overInsuranceFlags),
      warnings: overInsuranceFlags.map(flag => ({
        type: 'over_insurance_warning',
        category: flag.type,
        message: `Recommended ${flag.type} coverage exceeds reasonable limits for your income level`,
        originalAmount: flag.recommendedAmount,
        adjustedAmount: flag.reasonableMaximum,
        reasoning: flag.reasoning
      })),
      professionalConsultationRequired: true,
      consultationReason: 'Coverage amounts exceed standard guidelines'
    };
  }
  
  return {
    adjustedRecommendations: recommendationSet,
    warnings: [],
    professionalConsultationRequired: false
  };
};
```

## Audit Trail and Compliance

### Decision Logging
```javascript
const logPolicySelectionDecision = (userProfile, assessmentResults, recommendations) => {
  const decisionLog = {
    timestamp: new Date().toISOString(),
    agentId: 'policy_selection',
    userId: hashUserId(userProfile.userId),
    inputDataHash: hashInputData(userProfile),
    assessmentHash: hashAssessment(assessmentResults),
    recommendations: recommendations.map(rec => ({
      type: rec.type,
      amount: rec.amount,
      suitabilityScore: rec.suitabilityScore,
      confidence: rec.confidence
    })),
    complianceValidation: validateIRDAICompliance(recommendations),
    professionalConsultationFlags: identifyConsultationFlags(assessmentResults),
    auditTrail: generatePolicyAuditTrail(userProfile, assessmentResults, recommendations)
  };
  
  // Store in MCP server
  storeMCPAuditRecord(decisionLog);
  
  // Create blockchain anchor for high-value recommendations
  if (recommendations.some(rec => rec.amount > 1000000)) {
    createBlockchainAnchor(decisionLog);
  }
  
  return decisionLog;
};
```

This specification ensures the Policy Selection Agent operates within regulatory constraints while providing valuable insurance guidance to users.