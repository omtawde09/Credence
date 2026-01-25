# Tax Estimation & Compliance Agent - Detailed Specification

## Agent Purpose and Constraints

### Primary Objective
Prevent compliance risk during ITR planning through income classification and compliance exposure detection.

### Operational Constraints
- **NO autonomous tax filing** - Agent provides guidance only, never submits returns
- **Conservative classification bias** - Err on side of compliance safety over optimization
- **Professional consultation mandatory** - Complex scenarios require CA/tax professional
- **Explicit uncertainty ranges** - All tax estimates include confidence intervals

## Input Processing Architecture

### Income Stream Classification
```javascript
const classifyIncomeStreams = (incomeData) => {
  return incomeData.map(stream => {
    const classification = determineIncomeClassification(stream);
    
    return {
      source: stream.source,
      amount: stream.amount,
      classification: classification.category,
      confidence: classification.confidence,
      supportingFactors: classification.factors,
      alternativeClassifications: classification.alternatives,
      documentationRequired: classification.documentation
    };
  });
};

const determineIncomeClassification = (incomeStream) => {
  // Apply .kiro/tax_reasoning/income_classification_logic.md
  const factors = analyzeClassificationFactors(incomeStream);
  
  if (factors.employmentIndicators > 0.7) {
    return {
      category: 'salary',
      confidence: 'high',
      factors: ['regular_payments', 'employer_control', 'benefits_provided'],
      alternatives: [],
      documentation: ['form16', 'salary_certificate']
    };
  }
  
  if (factors.professionalIndicators > 0.6) {
    return {
      category: 'professional_fees',
      confidence: 'medium',
      factors: ['professional_expertise', 'client_relationships', 'independent_work'],
      alternatives: ['business_income'],
      documentation: ['invoices', 'professional_certificates', 'client_contracts']
    };
  }
  
  return {
    category: 'business_income',
    confidence: 'low',
    factors: ['commercial_activity', 'systematic_operations'],
    alternatives: ['professional_fees'],
    documentation: ['business_registration', 'books_of_accounts']
  };
};
```

### Compliance Risk Assessment
```javascript
const assessComplianceRisk = (taxProfile) => {
  const riskFactors = identifyComplianceRiskFactors(taxProfile);
  const riskScore = calculateComplianceRiskScore(riskFactors);
  
  return {
    overallRiskLevel: categorizeRiskLevel(riskScore),
    riskScore: riskScore,
    primaryRiskFactors: riskFactors.filter(rf => rf.severity === 'high'),
    mitigationActions: generateMitigationActions(riskFactors),
    professionalConsultationRequired: riskScore > 0.6,
    auditProbability: estimateAuditProbability(riskFactors)
  };
};

const identifyComplianceRiskFactors = (taxProfile) => {
  const riskFactors = [];
  
  // Mixed income source risk
  if (taxProfile.incomeStreams.length > 2) {
    riskFactors.push({
      factor: 'mixed_income_sources',
      severity: 'medium',
      impact: 'requires_detailed_documentation',
      probability: 0.4,
      description: 'Multiple income sources increase classification complexity'
    });
  }
  
  // High-value transactions risk
  const highValueTransactions = taxProfile.transactions.filter(t => t.amount > 1000000);
  if (highValueTransactions.length > 0) {
    riskFactors.push({
      factor: 'high_value_transactions',
      severity: 'high',
      impact: 'increased_scrutiny_probability',
      probability: 0.3,
      description: 'Transactions above ₹10L trigger additional reporting requirements'
    });
  }
  
  return riskFactors;
};
```

## Tax Estimation Engine

### Multi-Scenario Tax Calculation
```javascript
const calculateTaxEstimation = (classifiedIncome, deductions, userProfile) => {
  const scenarios = [
    { regime: 'old', name: 'Old Tax Regime' },
    { regime: 'new', name: 'New Tax Regime' }
  ];
  
  return scenarios.map(scenario => {
    const taxCalculation = calculateTaxForRegime(classifiedIncome, deductions, scenario.regime);
    
    return {
      regime: scenario.regime,
      regimeName: scenario.name,
      taxLiability: taxCalculation.totalTax,
      effectiveRate: taxCalculation.effectiveRate,
      breakdown: taxCalculation.breakdown,
      confidence: taxCalculation.confidence,
      uncertaintyRange: calculateUncertaintyRange(taxCalculation),
      assumptions: taxCalculation.assumptions,
      recommendedRegime: taxCalculation.totalTax < 50000 ? 'consider' : 'evaluate'
    };
  });
};

const calculateUncertaintyRange = (taxCalculation) => {
  const uncertaintyFactor = 1 - taxCalculation.confidence;
  const baseAmount = taxCalculation.totalTax;
  
  return {
    lower: Math.max(0, baseAmount * (1 - uncertaintyFactor * 0.3)),
    upper: baseAmount * (1 + uncertaintyFactor * 0.3),
    confidence: taxCalculation.confidence,
    factors: taxCalculation.uncertaintyFactors
  };
};
```

### Deduction Optimization Analysis
```javascript
const analyzeDeductionOpportunities = (userProfile, currentDeductions) => {
  const availableDeductions = identifyAvailableDeductions(userProfile);
  const optimizationOpportunities = [];
  
  availableDeductions.forEach(deduction => {
    const currentUtilization = getCurrentUtilization(deduction, currentDeductions);
    const maxUtilization = deduction.maxLimit;
    
    if (currentUtilization < maxUtilization) {
      optimizationOpportunities.push({
        section: deduction.section,
        currentAmount: currentUtilization,
        maxAmount: maxUtilization,
        additionalCapacity: maxUtilization - currentUtilization,
        taxSaving: calculateTaxSaving(maxUtilization - currentUtilization, userProfile.taxBracket),
        investmentOptions: deduction.qualifyingInvestments,
        priority: deduction.priority,
        deadline: deduction.deadline
      });
    }
  });
  
  return optimizationOpportunities.sort((a, b) => b.taxSaving - a.taxSaving);
};
```

## Compliance Monitoring System

### Missing Disclosure Detection
```javascript
const detectMissingDisclosures = (userProfile, filingData) => {
  const requiredDisclosures = identifyRequiredDisclosures(userProfile);
  const providedDisclosures = extractProvidedDisclosures(filingData);
  
  const missingDisclosures = requiredDisclosures.filter(required => 
    !providedDisclosures.some(provided => provided.type === required.type)
  );
  
  return missingDisclosures.map(disclosure => ({
    disclosureType: disclosure.type,
    requirement: disclosure.requirement,
    consequence: disclosure.consequence,
    deadline: disclosure.deadline,
    severity: disclosure.severity,
    correctionProcess: disclosure.correctionProcess,
    professionalAdviceRequired: disclosure.complexity === 'high'
  }));
};

const identifyRequiredDisclosures = (userProfile) => {
  const disclosures = [];
  
  // Foreign asset disclosure
  if (userProfile.hasInternationalIncome || userProfile.hasForeignAssets) {
    disclosures.push({
      type: 'foreign_assets',
      requirement: 'Schedule FA disclosure required',
      consequence: 'Penalty up to ₹10L for non-disclosure',
      deadline: 'ITR filing deadline',
      severity: 'high',
      complexity: 'high',
      correctionProcess: 'Revised return filing with penalty'
    });
  }
  
  // High-value transaction disclosure
  const highValueTransactions = userProfile.transactions.filter(t => t.amount > 1000000);
  if (highValueTransactions.length > 0) {
    disclosures.push({
      type: 'high_value_transactions',
      requirement: 'Schedule AL disclosure for transactions above ₹10L',
      consequence: 'Scrutiny assessment probability increase',
      deadline: 'ITR filing deadline',
      severity: 'medium',
      complexity: 'medium',
      correctionProcess: 'Revised return with detailed explanations'
    });
  }
  
  return disclosures;
};
```

## Output Generation and Communication

### Tax Classification Summary
```javascript
const generateTaxClassificationSummary = (classificationResults) => {
  const summary = {
    totalIncome: calculateTotalIncome(classificationResults),
    incomeBreakdown: {},
    classificationConfidence: 'high',
    uncertaintyFactors: [],
    professionalConsultationRequired: false
  };
  
  classificationResults.forEach(result => {
    summary.incomeBreakdown[result.classification] = 
      (summary.incomeBreakdown[result.classification] || 0) + result.amount;
    
    if (result.confidence === 'low') {
      summary.classificationConfidence = 'medium';
      summary.uncertaintyFactors.push({
        source: result.source,
        issue: 'Classification ambiguity',
        alternatives: result.alternativeClassifications
      });
    }
    
    if (result.alternativeClassifications.length > 0) {
      summary.professionalConsultationRequired = true;
    }
  });
  
  return summary;
};
```

### Corrective Action Checklist
```javascript
const generateCorrectiveActionChecklist = (complianceAssessment) => {
  const actions = [];
  
  complianceAssessment.riskFactors.forEach(risk => {
    switch (risk.factor) {
      case 'mixed_income_sources':
        actions.push({
          action: 'Separate income source documentation',
          priority: 'high',
          deadline: 'Before ITR filing',
          steps: [
            'Create separate invoice series for different income types',
            'Maintain separate bank accounts if possible',
            'Document client relationships and work arrangements'
          ],
          impact: 'Reduces classification disputes and audit risk'
        });
        break;
        
      case 'insufficient_documentation':
        actions.push({
          action: 'Strengthen documentation practices',
          priority: 'critical',
          deadline: 'Immediate',
          steps: [
            'Implement systematic invoice and receipt management',
            'Maintain detailed expense records with supporting bills',
            'Create digital backup of all financial documents'
          ],
          impact: 'Essential for audit defense and compliance'
        });
        break;
    }
  });
  
  return actions.sort((a, b) => {
    const priorityOrder = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};
```

## Integration with Existing Systems

### ITR Filing Workflow Enhancement
```javascript
const enhanceITRWorkflow = (existingWorkflow, agentAssessment) => {
  return {
    ...existingWorkflow,
    preFilingValidation: {
      complianceRiskCheck: agentAssessment.complianceRisk,
      classificationValidation: agentAssessment.classificationSummary,
      missingDisclosures: agentAssessment.missingDisclosures,
      recommendedActions: agentAssessment.correctiveActions
    },
    enhancedGuidance: {
      regimeComparison: agentAssessment.taxEstimation,
      deductionOptimization: agentAssessment.deductionOpportunities,
      documentationChecklist: agentAssessment.documentationRequirements
    },
    riskMitigation: {
      professionalConsultationRequired: agentAssessment.professionalConsultationRequired,
      auditRiskFactors: agentAssessment.auditRiskFactors,
      complianceRecommendations: agentAssessment.complianceRecommendations
    }
  };
};
```

### Investment Recommendation Integration
```javascript
const integrateTaxEfficientPlanning = (investmentRecommendations, taxAssessment) => {
  return investmentRecommendations.map(recommendation => {
    const taxImplications = assessTaxImplications(recommendation, taxAssessment);
    
    return {
      ...recommendation,
      taxEfficiency: {
        taxSavingPotential: taxImplications.deductionBenefit,
        taxTreatment: taxImplications.taxTreatment,
        holdingPeriodConsiderations: taxImplications.holdingPeriod,
        exitTaxImplications: taxImplications.exitTax
      },
      adjustedRecommendation: adjustForTaxEfficiency(recommendation, taxImplications),
      overallScore: calculateTaxAdjustedScore(recommendation, taxImplications)
    };
  });
};
```

## Failure Scenarios and Handling

### Classification Ambiguity Resolution
```javascript
const handleClassificationAmbiguity = (ambiguousIncome, userProfile) => {
  const ambiguityLevel = assessAmbiguityLevel(ambiguousIncome);
  
  if (ambiguityLevel === 'high') {
    return {
      canClassify: false,
      reason: 'Income classification requires professional tax expertise',
      requiredAction: 'Consult with qualified Chartered Accountant',
      riskOfMisclassification: 'High - potential penalties and interest',
      estimatedConsultationCost: '₹5,000 - ₹15,000',
      professionalConsultationRequired: true
    };
  }
  
  if (ambiguityLevel === 'medium') {
    return {
      canClassify: true,
      confidence: 'low',
      conservativeClassification: selectConservativeClassification(ambiguousIncome),
      alternativeClassifications: identifyAlternatives(ambiguousIncome),
      recommendedAction: 'Verify classification with tax professional',
      riskMitigation: 'Conservative approach reduces penalty risk'
    };
  }
  
  return {
    canClassify: true,
    confidence: 'medium',
    recommendedClassification: selectMostLikelyClassification(ambiguousIncome),
    supportingEvidence: identifySupportingEvidence(ambiguousIncome)
  };
};
```

### High-Stakes Decision Deferral
```javascript
const assessHighStakesDecisionDeferral = (taxDecision, potentialImpact) => {
  const stakesThreshold = {
    taxLiabilityImpact: 50000, // ₹50K difference
    penaltyRisk: 25000, // ₹25K potential penalty
    auditProbabilityIncrease: 0.2 // 20% increase in audit probability
  };
  
  if (potentialImpact.taxLiabilityImpact > stakesThreshold.taxLiabilityImpact ||
      potentialImpact.penaltyRisk > stakesThreshold.penaltyRisk ||
      potentialImpact.auditProbabilityIncrease > stakesThreshold.auditProbabilityIncrease) {
    
    return {
      shouldDefer: true,
      reason: 'High financial impact requires professional expertise',
      recommendedAction: 'Mandatory consultation with qualified CA',
      estimatedImpact: potentialImpact,
      urgency: 'high',
      professionalConsultationRequired: true
    };
  }
  
  return {
    shouldDefer: false,
    reason: 'Impact within acceptable agent decision boundaries',
    confidence: 'medium'
  };
};
```

## Audit Trail and Compliance

### Decision Logging for Tax Compliance
```javascript
const logTaxComplianceDecision = (userProfile, taxAssessment, recommendations) => {
  const decisionLog = {
    timestamp: new Date().toISOString(),
    agentId: 'tax_compliance',
    userId: hashUserId(userProfile.userId),
    assessmentYear: taxAssessment.assessmentYear,
    inputDataHash: hashInputData(userProfile),
    classificationDecisions: taxAssessment.classificationSummary,
    complianceRiskAssessment: taxAssessment.complianceRisk,
    professionalConsultationFlags: taxAssessment.professionalConsultationRequired,
    conservativeBiasApplied: taxAssessment.conservativeBiasApplied,
    auditTrail: generateTaxAuditTrail(userProfile, taxAssessment, recommendations)
  };
  
  // Store in MCP server for compliance tracking
  storeMCPAuditRecord(decisionLog);
  
  // Create blockchain anchor for high-impact tax decisions
  if (taxAssessment.estimatedTaxLiability > 100000) {
    createBlockchainAnchor(decisionLog);
  }
  
  return decisionLog;
};
```

This specification ensures the Tax Compliance Agent operates with appropriate caution and professional consultation triggers while providing valuable tax planning guidance.