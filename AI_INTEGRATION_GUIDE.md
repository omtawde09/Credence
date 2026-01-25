# AI Assistance Layer Integration Guide

## Overview

This system integrates optional AI assistance while maintaining the deterministic, rule-based architecture. The AI layer provides **enhancement only** - never making final decisions or overriding `.kiro` constraints.

## Architecture Principles

### ✅ AI AUGMENTS (Approved Uses)
- **Explanation Enhancement**: Improve clarity of `.kiro`-generated explanations
- **Natural Language Summaries**: Convert structured data to advisor-friendly summaries  
- **Plain Language Translation**: Make technical decisions user-friendly
- **Risk Narrative Expansion**: Elaborate on known risks (no new risks invented)

### ❌ AI NEVER DOES (Forbidden Uses)
- Risk scoring or threshold decisions
- Policy eligibility determination
- Autonomous actions or recommendations
- Inventing new risks or modifying numerical values
- Overriding `.kiro` constraints or decision graphs

## Configuration

### Environment Setup
```bash
# Optional - leave empty for deterministic-only mode
VITE_AI_API_KEY=your_api_key_here
```

### System Behavior
- **API Key Present**: AI enhancement enabled with validation
- **API Key Missing**: Full deterministic operation (no degradation)
- **API Key Invalid**: Automatic fallback to deterministic mode
- **API Call Failure**: Silent fallback with logging

## Integration Points

### 1. Client Summary Enhancement
```javascript
// Before: Deterministic summary only
const summary = generateClientSummary(investor, advisor);

// After: AI-enhanced if available, deterministic fallback
const summary = await generateClientSummary(investor, advisor);
```

### 2. Recommendation Validation
```javascript
// Enhanced warnings with AI clarity improvement
const validation = await validateRecommendationWithKiroConstraints(rec, profile);
// Uses validation.enhancedWarnings if AI available, falls back to validation.warnings
```

### 3. Risk Explanation Enhancement
```javascript
import { expandRiskNarrative } from '../utils/aiAssistLayer.js';

const enhanced = await expandRiskNarrative(knownRisks, context);
// Returns: { content, enhanced: boolean, source: 'ai_enhanced' | 'deterministic' }
```

## Safety Mechanisms

### Validation Pipeline
Every AI output passes through:
1. **Structural Validation**: Non-empty, reasonable length
2. **Constraint Validation**: Against `.kiro/agent_constraints.md`
3. **Content Safety**: No forbidden certainty language
4. **Fallback**: Deterministic content if validation fails

### Forbidden Language Detection
AI outputs are rejected if they contain:
- "guaranteed", "certain", "always", "never fails"
- "risk-free", "automatic", "will definitely"
- "no chance of loss", "perfect solution"

### Timeout & Error Handling
- **5-second timeout** on all AI calls
- **Silent failure** with deterministic fallback
- **Comprehensive logging** without exposing user data

## Usage Examples

### Enhance Explanation
```javascript
import { enhanceExplanation } from '../utils/aiAssistLayer.js';

const original = "Risk assessment indicates medium probability threshold breach";
const enhanced = await enhanceExplanation(original, { confidence: 0.7 });

// Result: Enhanced clarity while preserving technical accuracy
console.log(enhanced.content); // AI-improved version
console.log(enhanced.enhanced); // true if AI was used
console.log(enhanced.source); // 'ai_enhanced' or 'deterministic'
```

### Check AI Status
```javascript
import { getAIAssistStatus } from '../utils/aiAssistLayer.js';

const status = getAIAssistStatus();
// Returns: { enabled: boolean, apiKeyPresent: boolean, mode: string }
```

## MCP Integration

The AI layer can be registered as an MCP service:

```json
{
  "mcpServers": {
    "ai-assist-layer": {
      "disabled": true,
      "autoApprove": ["enhanceExplanation", "summarizeClientContext"]
    }
  }
}
```

## Logging & Accountability

### What Gets Logged
- AI assistance usage (success/failure)
- Validation failures and reasons
- Fallback usage statistics
- Performance metrics

### What NEVER Gets Logged
- Raw prompts or user data
- API keys or sensitive information
- Personal financial details

## Testing & Validation

### Test Without AI
```bash
# Remove or comment out API key
# VITE_AI_API_KEY=

npm run dev
# System should work identically in deterministic mode
```

### Test With AI
```bash
# Set valid API key
VITE_AI_API_KEY=your_key_here

npm run dev
# Enhanced explanations should appear with validation
```

### Validation Checklist
- [ ] App works without API key
- [ ] No business logic moved into AI
- [ ] All final decisions remain deterministic
- [ ] AI improves clarity, not authority
- [ ] Fallbacks work for all AI functions
- [ ] Validation rejects inappropriate AI outputs

## Troubleshooting

### AI Not Working
1. Check API key in environment
2. Verify network connectivity
3. Check browser console for errors
4. Confirm fallback content appears

### Validation Failures
1. Review console logs for rejection reasons
2. Check for forbidden language in AI outputs
3. Verify constraint validation logic
4. Confirm deterministic fallbacks activate

### Performance Issues
1. Monitor AI call timeouts (5s limit)
2. Check fallback usage rates
3. Verify caching of deterministic content
4. Review error rates in logs

## Security Considerations

- **No API keys in client code** (environment variables only)
- **Input sanitization** before AI calls
- **Output validation** after AI responses
- **Privacy preservation** (no user data in logs)
- **Graceful degradation** on security failures

## Future Enhancements

The architecture supports:
- Multiple AI model integration
- A/B testing of AI vs deterministic outputs
- Performance optimization with caching
- Advanced validation rules
- Real-time model switching

## Support

For issues with AI integration:
1. Check this guide first
2. Verify environment configuration
3. Test in deterministic mode
4. Review console logs for errors
5. Ensure `.kiro` constraints are respected

Remember: **When in doubt, the system defaults to deterministic operation.**