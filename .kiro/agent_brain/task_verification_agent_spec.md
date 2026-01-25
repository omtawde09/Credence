# Task Verification Agent - Detailed Specification

## Agent Purpose and Constraints

### Primary Objective
Prevent silent failures through systematic verification of completed tasks and compliance validation, ensuring all marked tasks meet acceptance criteria and regulatory requirements.

### Operational Constraints
- **Post-completion verification only** - Agent validates tasks after they are marked complete
- **Objective criteria assessment** - Uses measurable acceptance criteria rather than subjective judgment
- **Compliance-focused validation** - Prioritizes regulatory and safety compliance over feature completeness
- **Remediation requirement generation** - Provides specific, actionable steps for addressing identified issues

## Task Verification Framework

### Completion Verification Engine
```javascript
const verifyTaskCompletion = (taskId, taskSpecification, implementationEvidence) => {
  const verificationResults = {
    taskId: taskId,
    verificationTimestamp: new Date().toISOString(),
    overallStatus: 'PENDING',
    completionScore: 0,
    verificationCategories: {},
    identifiedIssues: [],
    complianceRisk: 'unknown',
    remediationRequired: false
  };
  
  // Acceptance Criteria Verification
  const acceptanceVerification = verifyAcceptanceCriteria(taskSpecification, implementationEvidence);
  verificationResults.verificationCategories.acceptanceCriteria = {
    status: acceptanceVerification.status,
    score: acceptanceVerification.score,
    metCriteria: acceptanceVerification.metCriteria,
    unmetCriteria: acceptanceVerification.unmetCriteria,
    partiallyMetCriteria: acceptanceVerification.partiallyMetCriteria
  };
  
  // Quality Assessment
  const qualityVerification = verifyQualityStandards(taskSpecification, implementationEvidence);
  verificationResults.verificationCategories.qualityStandards = {
    status: qualityVerification.status,
    score: qualityVerification.score,
    qualityMetrics: qualityVerification.metrics,
    qualityIssues: qualityVerification.issues
  };
  
  // Compliance Verification
  const complianceVerification = verifyComplianceRequirements(taskSpecification, implementationEvidence);
  verificationResults.verificationCategories.complianceRequirements = {
    status: complianceVerification.status,
    score: complianceVerification.score,
    complianceAreas: complianceVerification.areas,
    violations: complianceVerification.violations
  };
  
  // Integration Verification
  const integrationVerification = verifyIntegrationRequirements(taskSpecification, implementationEvidence);
  verificationResults.verificationCategories.integrationRequirements = {
    status: integrationVerification.status,
    score: integrationVerification.score,
    integrationPoints: integrationVerification.points,
    integrationIssues: integrationVerification.issues
  };
  
  // Calculate overall verification results
  verificationResults.overallStatus = calculateOverallVerificationStatus(verificationResults.verificationCategories);
  verificationResults.completionScore = calculateCompletionScore(verificationResults.verificationCategories);
  verificationResults.complianceRisk = assessComplianceRisk(verificationResults.verificationCategories);
  
  return verificationResults;
};
```

### Acceptance Criteria Verification
```javascript
const verifyAcceptanceCriteria = (taskSpec, evidence) => {
  const verification = {
    status: 'PASS',
    score: 100,
    metCriteria: [],
    unmetCriteria: [],
    partiallyMetCriteria: []
  };
  
  taskSpec.acceptanceCriteria.forEach(criterion => {
    const criterionVerification = verifySingleCriterion(criterion, evidence);
    
    if (criterionVerification.status === 'met') {
      verification.metCriteria.push({
        criterionId: criterion.id,
        description: criterion.description,
        evidence: criterionVerification.evidence,
        confidence: criterionVerification.confidence
      });
    } else if (criterionVerification.status === 'unmet') {
      verification.unmetCriteria.push({
        criterionId: criterion.id,
        description: criterion.description,
        reason: criterionVerification.reason,
        missingElements: criterionVerification.missingElements,
        severity: criterion.severity || 'medium'
      });
      
      const penaltyScore = criterion.severity === 'critical' ? 30 : 
                          criterion.severity === 'high' ? 20 : 10;
      verification.score -= penaltyScore;
      verification.status = 'FAIL';
    } else if (criterionVerification.status === 'partial') {
      verification.partiallyMetCriteria.push({
        criterionId: criterion.id,
        description: criterion.description,
        metElements: criterionVerification.metElements,
        unmetElements: criterionVerification.unmetElements,
        completionPercentage: criterionVerification.completionPercentage
      });
      
      const partialPenalty = (100 - criterionVerification.completionPercentage) * 0.15;
      verification.score -= partialPenalty;
      if (verification.status === 'PASS') verification.status = 'WARNING';
    }
  });
  
  return verification;
};
```

### Quality Standards Verification
```javascript
const verifyQualityStandards = (taskSpec, evidence) => {
  const verification = {
    status: 'PASS',
    score: 100,
    metrics: {},
    issues: []
  };
  
  // Code Quality Assessment (if applicable)
  if (taskSpec.type === 'development' && evidence.codeFiles) {
    const codeQuality = assessCodeQuality(evidence.codeFiles);
    verification.metrics.codeQuality = {
      complexity: codeQuality.complexity,
      maintainability: codeQuality.maintainability,
      testCoverage: codeQuality.testCoverage,
      documentation: codeQuality.documentation
    };
    
    if (codeQuality.complexity > 10) {
      verification.issues.push({
        category: 'code_quality',
        severity: 'medium',
        issue: 'Code complexity exceeds recommended threshold',
        metric: `Complexity: ${codeQuality.complexity}`,
        recommendation: 'Refactor complex functions to improve maintainability'
      });
      verification.score -= 10;
    }
    
    if (codeQuality.testCoverage < 80) {
      verification.issues.push({
        category: 'code_quality',
        severity: 'high',
        issue: 'Test coverage below minimum threshold',
        metric: `Coverage: ${codeQuality.testCoverage}%`,
        recommendation: 'Add tests to achieve minimum 80% coverage'
      });
      verification.score -= 15;
      verification.status = 'FAIL';
    }
  }
  
  // Documentation Quality Assessment
  if (evidence.documentation) {
    const docQuality = assessDocumentationQuality(evidence.documentation);
    verification.metrics.documentation = {
      completeness: docQuality.completeness,
      clarity: docQuality.clarity,
      accuracy: docQuality.accuracy,
      upToDate: docQuality.upToDate
    };
    
    if (docQuality.completeness < 90) {
      verification.issues.push({
        category: 'documentation',
        severity: 'medium',
        issue: 'Documentation completeness below standard',
        metric: `Completeness: ${docQuality.completeness}%`,
        recommendation: 'Complete missing documentation sections'
      });
      verification.score -= 8;
    }
  }
  
  // Performance Standards Assessment
  if (evidence.performanceMetrics) {
    const perfAssessment = assessPerformanceStandards(evidence.performanceMetrics, taskSpec.performanceRequirements);
    verification.metrics.performance = perfAssessment.metrics;
    
    if (!perfAssessment.meetsStandards) {
      verification.issues.push({
        category: 'performance',
        severity: 'high',
        issue: 'Performance requirements not met',
        details: perfAssessment.violations,
        recommendation: 'Optimize implementation to meet performance requirements'
      });
      verification.score -= 20;
      verification.status = 'FAIL';
    }
  }
  
  return verification;
};
```

## Compliance Risk Assessment

### Regulatory Compliance Verification
```javascript
const verifyComplianceRequirements = (taskSpec, evidence) => {
  const verification = {
    status: 'PASS',
    score: 100,
    areas: {},
    violations: []
  };
  
  // Financial Services Compliance
  if (taskSpec.complianceAreas.includes('financial_services')) {
    const finServCompliance = assessFinancialServicesCompliance(evidence);
    verification.areas.financialServices = {
      dataProtection: finServCompliance.dataProtection,
      auditTrail: finServCompliance.auditTrail,
      userConsent: finServCompliance.userConsent,
      riskDisclosure: finServCompliance.riskDisclosure
    };
    
    if (!finServCompliance.compliant) {
      finServCompliance.violations.forEach(violation => {
        verification.violations.push({
          area: 'financial_services',
          severity: violation.severity,
          violation: violation.description,
          regulation: violation.regulation,
          remediation: violation.remediation,
          riskLevel: violation.riskLevel
        });
        
        const penaltyScore = violation.severity === 'critical' ? 40 : 
                            violation.severity === 'high' ? 25 : 10;
        verification.score -= penaltyScore;
        verification.status = 'FAIL';
      });
    }
  }
  
  // Data Privacy Compliance
  if (taskSpec.complianceAreas.includes('data_privacy')) {
    const privacyCompliance = assessDataPrivacyCompliance(evidence);
    verification.areas.dataPrivacy = {
      dataMinimization: privacyCompliance.dataMinimization,
      consentManagement: privacyCompliance.consentManagement,
      dataRetention: privacyCompliance.dataRetention,
      userRights: privacyCompliance.userRights
    };
    
    if (!privacyCompliance.compliant) {
      privacyCompliance.violations.forEach(violation => {
        verification.violations.push({
          area: 'data_privacy',
          severity: violation.severity,
          violation: violation.description,
          regulation: violation.regulation,
          remediation: violation.remediation,
          riskLevel: violation.riskLevel
        });
        
        const penaltyScore = violation.severity === 'critical' ? 35 : 
                            violation.severity === 'high' ? 20 : 8;
        verification.score -= penaltyScore;
        verification.status = 'FAIL';
      });
    }
  }
  
  // Security Compliance
  if (taskSpec.complianceAreas.includes('security')) {
    const securityCompliance = assessSecurityCompliance(evidence);
    verification.areas.security = {
      authentication: securityCompliance.authentication,
      authorization: securityCompliance.authorization,
      dataEncryption: securityCompliance.dataEncryption,
      vulnerabilityManagement: securityCompliance.vulnerabilityManagement
    };
    
    if (!securityCompliance.compliant) {
      securityCompliance.violations.forEach(violation => {
        verification.violations.push({
          area: 'security',
          severity: violation.severity,
          violation: violation.description,
          standard: violation.standard,
          remediation: violation.remediation,
          riskLevel: violation.riskLevel
        });
        
        const penaltyScore = violation.severity === 'critical' ? 45 : 
                            violation.severity === 'high' ? 30 : 12;
        verification.score -= penaltyScore;
        verification.status = 'FAIL';
      });
    }
  }
  
  return verification;
};
```

### Risk Factor Identification
```javascript
const identifyRiskFactors = (verificationResults) => {
  const riskFactors = [];
  
  // Compliance Risk Factors
  verificationResults.verificationCategories.complianceRequirements.violations.forEach(violation => {
    riskFactors.push({
      category: 'compliance',
      riskType: violation.area,
      severity: violation.severity,
      description: violation.violation,
      impact: calculateComplianceImpact(violation),
      probability: assessViolationProbability(violation),
      mitigation: violation.remediation
    });
  });
  
  // Quality Risk Factors
  verificationResults.verificationCategories.qualityStandards.issues.forEach(issue => {
    riskFactors.push({
      category: 'quality',
      riskType: issue.category,
      severity: issue.severity,
      description: issue.issue,
      impact: calculateQualityImpact(issue),
      probability: 'high', // Quality issues are certain if present
      mitigation: issue.recommendation
    });
  });
  
  // Acceptance Criteria Risk Factors
  verificationResults.verificationCategories.acceptanceCriteria.unmetCriteria.forEach(criterion => {
    riskFactors.push({
      category: 'functionality',
      riskType: 'unmet_requirement',
      severity: criterion.severity,
      description: `Unmet acceptance criterion: ${criterion.description}`,
      impact: calculateFunctionalImpact(criterion),
      probability: 'high',
      mitigation: `Address missing elements: ${criterion.missingElements.join(', ')}`
    });
  });
  
  return riskFactors.sort((a, b) => {
    const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};
```

## Output Generation and Communication

### Verification Report Generation
```javascript
const generateVerificationReport = (taskId, verificationResults) => {
  const riskFactors = identifyRiskFactors(verificationResults);
  
  return {
    verificationSummary: {
      taskId: taskId,
      verificationTimestamp: verificationResults.verificationTimestamp,
      overallStatus: verificationResults.overallStatus,
      completionScore: verificationResults.completionScore,
      complianceRisk: verificationResults.complianceRisk,
      approvalRecommendation: determineApprovalRecommendation(verificationResults)
    },
    
    categoryAssessment: {
      acceptanceCriteria: {
        status: verificationResults.verificationCategories.acceptanceCriteria.status,
        metCount: verificationResults.verificationCategories.acceptanceCriteria.metCriteria.length,
        unmetCount: verificationResults.verificationCategories.acceptanceCriteria.unmetCriteria.length,
        partialCount: verificationResults.verificationCategories.acceptanceCriteria.partiallyMetCriteria.length
      },
      
      qualityStandards: {
        status: verificationResults.verificationCategories.qualityStandards.status,
        overallScore: verificationResults.verificationCategories.qualityStandards.score,
        issueCount: verificationResults.verificationCategories.qualityStandards.issues.length,
        metrics: verificationResults.verificationCategories.qualityStandards.metrics
      },
      
      complianceRequirements: {
        status: verificationResults.verificationCategories.complianceRequirements.status,
        violationCount: verificationResults.verificationCategories.complianceRequirements.violations.length,
        criticalViolations: verificationResults.verificationCategories.complianceRequirements.violations.filter(v => v.severity === 'critical').length,
        complianceAreas: verificationResults.verificationCategories.complianceRequirements.areas
      }
    },
    
    identifiedIssues: riskFactors.map(risk => ({
      category: risk.category,
      severity: risk.severity,
      description: risk.description,
      impact: risk.impact,
      riskLevel: calculateRiskLevel(risk.severity, risk.probability, risk.impact),
      remediation: risk.mitigation,
      blockingApproval: risk.severity === 'critical'
    })),
    
    complianceRiskSummary: {
      overallRisk: verificationResults.complianceRisk,
      riskFactors: riskFactors.filter(rf => rf.category === 'compliance'),
      regulatoryExposure: assessRegulatoryExposure(verificationResults),
      mitigationPriority: prioritizeComplianceRemediation(verificationResults)
    },
    
    remediationPlan: {
      criticalActions: generateCriticalActions(riskFactors),
      highPriorityActions: generateHighPriorityActions(riskFactors),
      recommendedImprovements: generateRecommendedImprovements(riskFactors),
      estimatedRemediationTime: calculateRemediationTime(riskFactors),
      resourceRequirements: assessResourceRequirements(riskFactors)
    },
    
    approvalDecision: {
      approved: determineApprovalStatus(verificationResults),
      conditions: generateApprovalConditions(verificationResults),
      blockers: identifyApprovalBlockers(verificationResults),
      nextSteps: generateNextSteps(verificationResults)
    },
    
    verificationMetadata: {
      verifierVersion: '1.0.0',
      verificationCriteria: 'kiro-task-standards-v1',
      verificationEnvironment: 'production',
      verifierId: 'task_verification_agent'
    }
  };
};
```

### Remediation Action Generation
```javascript
const generateRemediationActions = (verificationResults) => {
  const actions = [];
  
  // Critical compliance violations
  verificationResults.verificationCategories.complianceRequirements.violations
    .filter(v => v.severity === 'critical')
    .forEach(violation => {
      actions.push({
        priority: 'critical',
        category: 'compliance',
        action: violation.remediation,
        description: `Address critical compliance violation: ${violation.violation}`,
        regulation: violation.regulation,
        deadline: 'immediate',
        estimatedEffort: 'high',
        riskOfInaction: 'regulatory penalties, system shutdown',
        assignedTo: 'compliance_team',
        verificationRequired: true
      });
    });
  
  // Unmet acceptance criteria
  verificationResults.verificationCategories.acceptanceCriteria.unmetCriteria
    .filter(c => c.severity === 'critical' || c.severity === 'high')
    .forEach(criterion => {
      actions.push({
        priority: criterion.severity,
        category: 'functionality',
        action: `Implement missing functionality for: ${criterion.description}`,
        description: `Address unmet acceptance criterion`,
        missingElements: criterion.missingElements,
        deadline: criterion.severity === 'critical' ? 'immediate' : '3 days',
        estimatedEffort: 'medium',
        riskOfInaction: 'feature incomplete, user impact',
        assignedTo: 'development_team',
        verificationRequired: true
      });
    });
  
  // Quality standard violations
  verificationResults.verificationCategories.qualityStandards.issues
    .filter(i => i.severity === 'high')
    .forEach(issue => {
      actions.push({
        priority: 'high',
        category: 'quality',
        action: issue.recommendation,
        description: `Address quality issue: ${issue.issue}`,
        metric: issue.metric,
        deadline: '5 days',
        estimatedEffort: 'medium',
        riskOfInaction: 'technical debt, maintenance issues',
        assignedTo: 'development_team',
        verificationRequired: true
      });
    });
  
  return actions.sort((a, b) => {
    const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};
```

## Integration with Task Management

### Task Status Integration
```javascript
const integrateWithTaskManagement = (taskId, verificationResults) => {
  const taskUpdate = {
    taskId: taskId,
    verificationStatus: verificationResults.overallStatus,
    verificationScore: verificationResults.completionScore,
    verificationTimestamp: verificationResults.verificationTimestamp,
    
    statusUpdate: {
      currentStatus: 'verification_complete',
      nextStatus: determineNextTaskStatus(verificationResults),
      statusReason: generateStatusReason(verificationResults),
      blockers: identifyTaskBlockers(verificationResults)
    },
    
    qualityGates: {
      acceptanceCriteriaMet: verificationResults.verificationCategories.acceptanceCriteria.status === 'PASS',
      qualityStandardsMet: verificationResults.verificationCategories.qualityStandards.status === 'PASS',
      complianceRequirementsMet: verificationResults.verificationCategories.complianceRequirements.status === 'PASS',
      overallGatePassed: verificationResults.overallStatus === 'PASS'
    },
    
    remediationTracking: {
      remediationRequired: verificationResults.remediationRequired,
      criticalIssueCount: verificationResults.identifiedIssues.filter(i => i.severity === 'critical').length,
      estimatedRemediationTime: calculateRemediationTime(verificationResults.identifiedIssues),
      remediationAssignments: generateRemediationAssignments(verificationResults)
    }
  };
  
  return taskUpdate;
};
```

## Audit Trail and Compliance

### Verification Decision Logging
```javascript
const logVerificationDecision = (taskId, verificationResults, approvalDecision) => {
  const verificationLog = {
    timestamp: new Date().toISOString(),
    verifierId: 'task_verification_agent',
    taskId: taskId,
    verificationResultsHash: hashVerificationResults(verificationResults),
    
    verificationOutcome: {
      overallStatus: verificationResults.overallStatus,
      completionScore: verificationResults.completionScore,
      complianceRisk: verificationResults.complianceRisk,
      approved: approvalDecision.approved,
      approvalConditions: approvalDecision.conditions
    },
    
    complianceAssessment: {
      complianceViolations: verificationResults.verificationCategories.complianceRequirements.violations.length,
      criticalViolations: verificationResults.verificationCategories.complianceRequirements.violations.filter(v => v.severity === 'critical').length,
      regulatoryRisk: assessRegulatoryRisk(verificationResults),
      complianceAreas: Object.keys(verificationResults.verificationCategories.complianceRequirements.areas)
    },
    
    qualityAssessment: {
      qualityScore: verificationResults.verificationCategories.qualityStandards.score,
      qualityIssues: verificationResults.verificationCategories.qualityStandards.issues.length,
      acceptanceCriteriaMet: verificationResults.verificationCategories.acceptanceCriteria.metCriteria.length,
      acceptanceCriteriaUnmet: verificationResults.verificationCategories.acceptanceCriteria.unmetCriteria.length
    },
    
    remediationRequirements: {
      remediationRequired: verificationResults.remediationRequired,
      criticalActions: verificationResults.remediationActions.filter(a => a.priority === 'critical').length,
      estimatedRemediationTime: calculateRemediationTime(verificationResults.remediationActions)
    },
    
    auditTrail: generateVerificationAuditTrail(taskId, verificationResults, approvalDecision)
  };
  
  // Store in MCP server for task tracking
  storeMCPAuditRecord(verificationLog);
  
  // Create blockchain anchor for high-risk or high-value task verifications
  if (verificationResults.complianceRisk === 'high' || verificationResults.completionScore < 70) {
    createBlockchainAnchor(verificationLog);
  }
  
  return verificationLog;
};
```

This specification ensures the Task Verification Agent provides comprehensive validation of completed tasks while maintaining focus on compliance, quality, and risk management.