# Money Weather Agent - Detailed Specification

## Agent Purpose and Constraints

### Primary Objective
Predict financial stress before it occurs through cash-flow risk analysis, providing early warning signals to prevent financial crises for irregular income users.

### Operational Constraints
- **NO spending amount predictions** - Agent predicts risk probability, not specific monetary amounts
- **Conservative bias mandatory** - When uncertain, err on side of caution
- **Human override required** - All recommendations require user confirmation
- **Explicit uncertainty communication** - All predictions include confidence intervals

## Input Signal Processing Architecture

### Transaction History Analysis
```javascript
// Input Processing Layer
const processTransactionHistory = (transactions) => {
  return {
    incomePatterns: analyzeIncomeStreams(transactions),
    paymentReliability: calculatePaymentTiming(transactions),
    seasonalVariations: detectSeasonalPatterns(transactions),
    volatilityMetrics: calculateIncomeVolatility(transactions)
  };
};

// Income Stream Analysis
const analyzeIncomeStreams = (transactions) => {
  const incomeStreams = groupBySource(transactions.filter(t => t.type === 'income'));
  
  return incomeStreams.map(stream => ({
    source: stream.source,
    averageAmount: calculateAverage(stream.amounts),
    paymentFrequency: calculateFrequency(stream.dates),
    reliabilityScore: calculateReliability(stream.dates),
    confidenceLevel: assessConfidence(stream.history)
  }));
};
```

### Fixed Obligations Mapping
```javascript
const mapFixedObligations = (obligations) => {
  return obligations.map(obligation => ({
    type: obligation.type,
    amount: obligation.amount,
    dueDate: obligation.dueDate,
    gracePeriod: obligation.gracePeriod || 0,
    penaltyStructure: obligation.penalties,
    criticality: assessCriticality(obligation),
    deferralOptions: identifyDeferralOptions(obligation)
  }));
};

const assessCriticality = (obligation) => {
  const criticalTypes = ['rent', 'insurance_premium', 'loan_emi', 'utilities'];
  return {
    level: criticalTypes.includes(obligation.type) ? 'high' : 'medium',
    impactScore: calculateImpactScore(obligation),
    cascadeRisk: assessCascadeRisk(obligation)
  };
};
```

### Employment Stability Assessment
```javascript
const assessEmploymentStability = (employmentData) => {
  return {
    stabilityScore: calculateStabilityScore(employmentData),
    riskFactors: identifyRiskFactors(employmentData),
    incomeProjection: projectIncomeStability(employmentData),
    confidenceLevel: assessProjectionConfidence(employmentData)
  };
};

const identifyRiskFactors = (employmentData) => {
  const riskFactors = [];
  
  if (employmentData.contractType === 'temporary') {
    riskFactors.push({
      factor: 'temporary_employment',
      impact: 'high',
      probability: 0.3,
      timeframe: '30-90 days'
    });
  }
  
  if (employmentData.clientConcentration > 0.7) {
    riskFactors.push({
      factor: 'client_concentration',
      impact: 'high',
      probability: 0.25,
      timeframe: '60-180 days'
    });
  }
  
  return riskFactors;
};
```

## Risk Assessment Logic Framework

### Probability Calculation Engine
```javascript
const calculateRiskProbability = (inputSignals) => {
  const {
    incomePatterns,
    fixedObligations,
    employmentStability,
    seasonalFactors
  } = inputSignals;
  
  // Bayesian updating approach
  const priorProbability = calculatePriorRisk(incomePatterns);
  const likelihoodFactors = [
    assessPaymentTimingRisk(incomePatterns, fixedObligations),
    assessEmploymentRisk(employmentStability),
    assessSeasonalRisk(seasonalFactors)
  ];
  
  const posteriorProbability = updateBayesian(priorProbability, likelihoodFactors);
  
  return {
    probability: posteriorProbability,
    confidence: calculateConfidence(likelihoodFactors),
    contributingFactors: identifyContributingFactors(likelihoodFactors)
  };
};

const assessPaymentTimingRisk = (incomePatterns, obligations) => {
  const paymentGaps = identifyPaymentGaps(incomePatterns, obligations);
  
  return paymentGaps.map(gap => ({
    startDate: gap.startDate,
    duration: gap.duration,
    severity: gap.obligationAmount / gap.availableLiquidity,
    probability: gap.probability,
    confidence: gap.confidence
  }));
};
```

### Severity Impact Assessment
```javascript
const assessSeverityImpact = (riskScenarios, userContext) => {
  return riskScenarios.map(scenario => {
    const directImpact = calculateDirectImpact(scenario);
    const compoundEffects = calculateCompoundEffects(scenario, userContext);
    
    return {
      scenario: scenario.description,
      directCost: directImpact.cost,
      compoundCost: compoundEffects.totalCost,
      recoveryTime: compoundEffects.recoveryTime,
      severityScore: calculateSeverityScore(directImpact, compoundEffects),
      confidence: Math.min(directImpact.confidence, compoundEffects.confidence)
    };
  });
};

const calculateCompoundEffects = (scenario, userContext) => {
  const cascadeEffects = [];
  
  // Late payment penalties
  if (scenario.type === 'payment_delay') {
    cascadeEffects.push({
      effect: 'late_payment_penalties',
      probability: 0.8,
      cost: scenario.amount * 0.02, // 2% penalty
      timeframe: '30 days'
    });
  }
  
  // Credit score impact
  if (scenario.severity > 0.3) {
    cascadeEffects.push({
      effect: 'credit_score_impact',
      probability: 0.6,
      cost: calculateCreditScoreImpactCost(userContext),
      timeframe: '90-180 days'
    });
  }
  
  return aggregateCascadeEffects(cascadeEffects);
};
```

## Risk Threshold Classification

### Threshold Band Implementation
```javascript
const classifyRiskBand = (riskAssessment) => {
  const { probability, severity, confidence } = riskAssessment;
  
  // Apply .kiro/decision_graphs/money_weather_decision_graph.md thresholds
  if (probability < 0.15 && severity < 0.10) {
    return {
      band: 'low',
      color: 'green',
      action: 'monitor',
      intervention: false,
      confidence: confidence
    };
  }
  
  if (probability >= 0.15 && probability <= 0.40) {
    return {
      band: 'medium',
      color: 'yellow',
      action: 'warn',
      intervention: true,
      confidence: confidence
    };
  }
  
  if (probability > 0.40) {
    return {
      band: 'high',
      color: 'red',
      action: 'escalate',
      intervention: true,
      confidence: confidence
    };
  }
  
  return {
    band: 'unknown',
    color: 'gray',
    action: 'defer',
    intervention: false,
    confidence: 'low'
  };
};
```

### Decision Branch Logic
```javascript
const determineAgentAction = (riskBand, userContext, historicalResponse) => {
  // Apply .kiro/failure_playbooks/false_positive_risk.md prevention
  const falsePositiveRisk = assessFalsePositiveRisk(riskBand, historicalResponse);
  
  if (falsePositiveRisk.shouldSuppress) {
    return {
      action: 'no_action',
      reason: falsePositiveRisk.reason,
      confidence: 'low'
    };
  }
  
  switch (riskBand.band) {
    case 'low':
      return {
        action: 'continue_monitoring',
        reason: 'Risk within acceptable parameters',
        confidence: riskBand.confidence
      };
      
    case 'medium':
      return {
        action: 'issue_warning',
        reason: 'Proactive risk mitigation recommended',
        warningType: 'early_warning',
        timeframe: calculateWarningTimeframe(riskBand),
        confidence: riskBand.confidence
      };
      
    case 'high':
      return {
        action: 'escalate_intervention',
        reason: 'Immediate risk mitigation required',
        escalationType: 'crisis_prevention',
        urgency: 'high',
        confidence: riskBand.confidence
      };
      
    default:
      return {
        action: 'defer_to_professional',
        reason: 'Insufficient confidence for automated assessment',
        confidence: 'low'
      };
  }
};
```

## Temporal Reasoning Framework

### Multi-Horizon Analysis
```javascript
const analyzeTemporalRisk = (inputSignals) => {
  const horizons = [
    { period: '0-30 days', confidence: 'high' },
    { period: '30-90 days', confidence: 'medium' },
    { period: '90+ days', confidence: 'low' }
  ];
  
  return horizons.map(horizon => {
    const riskAssessment = calculateHorizonRisk(inputSignals, horizon);
    
    return {
      timeframe: horizon.period,
      riskProbability: riskAssessment.probability,
      severityScore: riskAssessment.severity,
      confidence: Math.min(horizon.confidence, riskAssessment.confidence),
      keyRiskFactors: riskAssessment.factors,
      mitigationWindow: calculateMitigationWindow(horizon, riskAssessment)
    };
  });
};

const calculateMitigationWindow = (horizon, riskAssessment) => {
  if (horizon.period === '0-30 days' && riskAssessment.probability > 0.3) {
    return {
      windowStart: 'immediate',
      windowEnd: '7 days',
      actionRequired: 'urgent',
      effectiveness: 'high'
    };
  }
  
  if (horizon.period === '30-90 days' && riskAssessment.probability > 0.2) {
    return {
      windowStart: '7 days',
      windowEnd: '21 days',
      actionRequired: 'planned',
      effectiveness: 'medium'
    };
  }
  
  return {
    windowStart: '21 days',
    windowEnd: '60 days',
    actionRequired: 'strategic',
    effectiveness: 'low'
  };
};
```

## Output Generation and Communication

### Risk Horizon Classification Output
```javascript
const generateRiskOutput = (riskAssessment, temporalAnalysis, userContext) => {
  const primaryHorizon = identifyPrimaryRiskHorizon(temporalAnalysis);
  
  return {
    riskHorizon: primaryHorizon.timeframe,
    riskBand: classifyRiskBand(riskAssessment).band,
    earlyWarningSignals: generateWarningSignals(riskAssessment, temporalAnalysis),
    explanation: generateHumanExplanation(riskAssessment, userContext),
    confidenceLevel: calculateOverallConfidence(riskAssessment, temporalAnalysis),
    recommendedActions: generateActionRecommendations(riskAssessment, userContext),
    professionalConsultationRequired: assessConsultationNeed(riskAssessment, userContext),
    uncertaintyRange: calculateUncertaintyRange(riskAssessment),
    nextAssessmentDate: calculateNextAssessmentDate(riskAssessment)
  };
};

const generateWarningSignals = (riskAssessment, temporalAnalysis) => {
  const signals = [];
  
  // Income gap probability signal
  if (riskAssessment.incomeGapProbability > 0.25) {
    signals.push({
      signal: 'income_gap_probability',
      probability: riskAssessment.incomeGapProbability,
      confidence: riskAssessment.incomeGapConfidence,
      timeframe: identifyGapTimeframe(riskAssessment),
      severity: 'medium',
      description: 'Potential gap between income receipt and obligation due dates'
    });
  }
  
  // Client payment delay signal
  if (riskAssessment.paymentDelayRisk > 0.3) {
    signals.push({
      signal: 'client_payment_delay',
      probability: riskAssessment.paymentDelayRisk,
      confidence: riskAssessment.paymentDelayConfidence,
      timeframe: '15-45 days',
      severity: 'high',
      description: 'Higher than normal probability of client payment delays'
    });
  }
  
  return signals;
};
```

### Human-Readable Explanation Generation
```javascript
const generateHumanExplanation = (riskAssessment, userContext) => {
  const explanationComponents = [];
  
  // Primary risk factor explanation
  const primaryRisk = identifyPrimaryRiskFactor(riskAssessment);
  explanationComponents.push(
    `Based on ${primaryRisk.dataSource} (${primaryRisk.pattern}), ` +
    `there's a ${Math.round(primaryRisk.probability * 100)}% probability of ` +
    `${primaryRisk.riskType} in the next ${primaryRisk.timeframe}.`
  );
  
  // Contributing factors
  const contributingFactors = identifyContributingFactors(riskAssessment);
  if (contributingFactors.length > 0) {
    explanationComponents.push(
      `Contributing factors include: ${contributingFactors.map(f => f.description).join(', ')}.`
    );
  }
  
  // Confidence and uncertainty
  explanationComponents.push(
    `This assessment has ${riskAssessment.confidenceLevel} confidence ` +
    `(${Math.round(riskAssessment.confidence * 100)}%) based on ` +
    `${riskAssessment.dataPoints} months of transaction history.`
  );
  
  return explanationComponents.join(' ');
};
```

## Integration with Existing Systems

### Dashboard Integration Points
```javascript
// Integration with existing budget advisory
const integrateBudgetAdvisory = (moneyWeatherOutput) => {
  return {
    budgetRecommendations: adjustBudgetForRisk(moneyWeatherOutput),
    cashFlowAlerts: generateCashFlowAlerts(moneyWeatherOutput),
    emergencyFundGuidance: assessEmergencyFundAdequacy(moneyWeatherOutput),
    spendingPriorities: adjustSpendingPriorities(moneyWeatherOutput)
  };
};

// Integration with goal feasibility validation
const integrateGoalValidation = (moneyWeatherOutput, userGoals) => {
  return userGoals.map(goal => ({
    goalId: goal.id,
    feasibilityScore: calculateFeasibilityWithRisk(goal, moneyWeatherOutput),
    riskAdjustedTimeline: adjustTimelineForRisk(goal, moneyWeatherOutput),
    recommendedAdjustments: generateGoalAdjustments(goal, moneyWeatherOutput),
    confidenceLevel: goal.confidence * moneyWeatherOutput.confidenceLevel
  }));
};

// Integration with recommendation throttling
const integrateRecommendationThrottling = (moneyWeatherOutput) => {
  if (moneyWeatherOutput.riskBand === 'high') {
    return {
      throttleLevel: 'high',
      restrictedRecommendations: ['high_premium_policies', 'long_term_investments'],
      priorityRecommendations: ['emergency_fund', 'liquidity_preservation'],
      reasoning: 'High cash flow risk requires liquidity preservation focus'
    };
  }
  
  return {
    throttleLevel: 'normal',
    restrictedRecommendations: [],
    priorityRecommendations: [],
    reasoning: 'Normal risk levels allow standard recommendations'
  };
};
```

## Failure Scenarios and Handling

### False Positive Risk Mitigation
```javascript
const assessFalsePositiveRisk = (riskAssessment, userHistory) => {
  // Apply .kiro/failure_playbooks/false_positive_risk.md logic
  const recentAlerts = getUserRecentAlerts(userHistory, 30); // Last 30 days
  const dismissalRate = calculateDismissalRate(userHistory);
  
  if (recentAlerts.length >= 3) {
    return {
      shouldSuppress: true,
      reason: 'Alert fatigue risk - too many recent alerts',
      confidence: 'high'
    };
  }
  
  if (dismissalRate > 0.7) {
    return {
      shouldSuppress: false, // Don't suppress, but reduce confidence
      reason: 'High user dismissal rate indicates potential false positive pattern',
      confidenceAdjustment: -0.2
    };
  }
  
  if (riskAssessment.confidence < 0.6) {
    return {
      shouldSuppress: true,
      reason: 'Prediction confidence below .kiro threshold (60%)',
      confidence: 'low'
    };
  }
  
  return {
    shouldSuppress: false,
    reason: 'No false positive risk detected',
    confidence: 'high'
  };
};
```

### Data Insufficiency Handling
```javascript
const handleDataInsufficiency = (inputData) => {
  const dataQualityAssessment = assessDataQuality(inputData);
  
  if (dataQualityAssessment.transactionHistory < 90) { // Less than 3 months
    return {
      canPredict: false,
      reason: 'Insufficient transaction history for reliable prediction',
      minimumDataRequired: '90 days of transaction history',
      currentDataAvailable: `${dataQualityAssessment.transactionHistory} days`,
      recommendedAction: 'Continue data collection, provide general guidance only'
    };
  }
  
  if (dataQualityAssessment.incomeSourceCoverage < 0.8) {
    return {
      canPredict: true,
      confidence: 'low',
      reason: 'Incomplete income source information',
      missingData: dataQualityAssessment.missingIncomeSource,
      recommendedAction: 'Request additional income source information'
    };
  }
  
  return {
    canPredict: true,
    confidence: 'high',
    reason: 'Sufficient data quality for reliable prediction'
  };
};
```

### Model Uncertainty Management
```javascript
const manageModelUncertainty = (riskAssessment) => {
  const uncertaintyFactors = identifyUncertaintyFactors(riskAssessment);
  
  // Calculate uncertainty range
  const uncertaintyRange = {
    lower: riskAssessment.probability * (1 - uncertaintyFactors.totalUncertainty),
    upper: riskAssessment.probability * (1 + uncertaintyFactors.totalUncertainty),
    confidence: riskAssessment.confidence
  };
  
  // Apply conservative bias
  if (uncertaintyFactors.totalUncertainty > 0.3) {
    return {
      adjustedProbability: uncertaintyRange.upper, // Use upper bound for conservative bias
      confidence: Math.max(0.3, riskAssessment.confidence - 0.2),
      uncertaintyRange: uncertaintyRange,
      conservativeBiasApplied: true,
      reason: 'High model uncertainty requires conservative approach'
    };
  }
  
  return {
    adjustedProbability: riskAssessment.probability,
    confidence: riskAssessment.confidence,
    uncertaintyRange: uncertaintyRange,
    conservativeBiasApplied: false,
    reason: 'Model uncertainty within acceptable range'
  };
};
```

## Audit Trail and Accountability

### Decision Logging
```javascript
const logMoneyWeatherDecision = (inputData, riskAssessment, agentDecision, userContext) => {
  const decisionLog = {
    timestamp: new Date().toISOString(),
    agentId: 'money_weather',
    userId: hashUserId(userContext.userId), // Hash for privacy
    inputDataHash: hashInputData(inputData),
    riskAssessmentHash: hashRiskAssessment(riskAssessment),
    decision: {
      action: agentDecision.action,
      riskBand: agentDecision.riskBand,
      confidence: agentDecision.confidence,
      reasoning: agentDecision.reasoning
    },
    complianceFlags: validateCompliance(agentDecision),
    auditTrail: generateAuditTrail(inputData, riskAssessment, agentDecision)
  };
  
  // Store in MCP server for audit
  storeMCPAuditRecord(decisionLog);
  
  // Create blockchain anchor if high-impact decision
  if (agentDecision.impact > 0.7) {
    createBlockchainAnchor(decisionLog);
  }
  
  return decisionLog;
};
```

This specification provides the detailed implementation framework for the Money Weather Agent, ensuring it operates within the established .kiro constraints while providing valuable predictive capabilities for irregular income users.