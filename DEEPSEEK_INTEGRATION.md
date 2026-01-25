# DeepSeek Integration Guide

## Overview

This system integrates DeepSeek for **explanation enhancement only** with support for both **Cloud API** and **Local Ollama** deployment. The LLM acts as a *narrator*, not an *authority*, improving readability while preserving all deterministic decision-making.

## Deployment Options

### 🏠 Local Deployment (Recommended)
- **Model**: DeepSeek R1 8B via Ollama
- **Endpoint**: `http://localhost:11434/api/generate`
- **Advantages**: No API costs, full privacy, offline capability
- **Requirements**: Ollama installed with deepseek-r1:8b model

### ☁️ Cloud Deployment
- **Model**: DeepSeek v3.1 via REST API
- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Advantages**: No local setup, always up-to-date
- **Requirements**: DeepSeek API key

## Quick Setup

### Local Setup (Default)
```bash
# 1. Install Ollama
# Visit: https://ollama.ai/download

# 2. Start Ollama service
ollama serve

# 3. Pull DeepSeek model
ollama pull deepseek-r1:8b

# 4. Configure environment (optional - uses defaults)
echo "VITE_DEEPSEEK_MODE=local" >> .env
echo "VITE_OLLAMA_ENDPOINT=http://localhost:11434/api/generate" >> .env
echo "VITE_OLLAMA_MODEL=deepseek-r1:8b" >> .env
```

### Cloud Setup
```bash
# 1. Get DeepSeek API key from https://platform.deepseek.com/

# 2. Configure environment
echo "VITE_DEEPSEEK_MODE=cloud" >> .env
echo "VITE_DEEPSEEK_API_KEY=your_api_key_here" >> .env
echo "VITE_DEEPSEEK_ENDPOINT=https://api.deepseek.com/v1/chat/completions" >> .env
```

## Architecture Principles

### ✅ CORRECT EXECUTION ORDER
```
User Input → Deterministic Agent Logic (.kiro) → Final Decision → 
Deterministic Explanation → DeepSeek Rewrite (Optional) → 
Safety Validation → UI Response
```

**DeepSeek NEVER runs before decisions are made.**

### ✅ APPROVED ROLE OF DEEPSEEK v3.1
- **Rewriting** deterministic explanations in clearer language
- **Summarizing** already-computed advisor/client context  
- **Expanding** "What could go wrong?" narratives based on known risks
- **Improving** readability of rule-based outputs

### ❌ FORBIDDEN ROLES
- Making decisions or computing risk/suitability/scores
- Triggering actions or recommendations
- Adding new facts or inventing risks
- Overriding .kiro constraints

## Configuration

### Environment Variables

#### Local Ollama Mode (Default)
```bash
# Deployment mode
VITE_DEEPSEEK_MODE=local

# Ollama configuration (optional - uses defaults)
VITE_OLLAMA_ENDPOINT=http://localhost:11434/api/generate
VITE_OLLAMA_MODEL=deepseek-r1:8b
```

#### Cloud API Mode
```bash
# Deployment mode
VITE_DEEPSEEK_MODE=cloud

# DeepSeek API configuration
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_DEEPSEEK_ENDPOINT=https://api.deepseek.com/v1/chat/completions
```

### System Behavior Matrix
| Configuration | Behavior |
|---------------|----------|
| Local + Ollama Running | DeepSeek local enhancement enabled |
| Local + Ollama Stopped | Automatic fallback to deterministic mode |
| Cloud + Valid API Key | DeepSeek cloud enhancement enabled |
| Cloud + Invalid/Missing Key | Automatic fallback to deterministic mode |
| Any Mode + Network Issues | Silent fallback with logging |

## API Integration

### Local Ollama Integration
- **Model**: `deepseek-r1:8b`
- **Temperature**: `0.1` (low for consistent, factual output)
- **Protocol**: HTTP POST to `/api/generate`
- **Timeout**: 15 seconds (local processing allowance)
- **Max Tokens**: Limited to 2x original content length

### Cloud API Integration
- **Model**: `deepseek-v3.1`
- **Temperature**: `0.1` (low for consistent, factual output)
- **Protocol**: HTTPS REST calls only
- **Timeout**: 8 seconds (cloud API allowance)
- **Max Tokens**: Limited to 2x original content length

### System Prompt (Enforced for Both Modes)
```
You are a financial explanation enhancer. Your ONLY role is to rewrite existing explanations for clarity.

ABSOLUTE CONSTRAINTS:
- Never give advice or recommendations
- Never use guarantees or certainties  
- Never add new facts or risks
- Never use metaphors or analogies
- Use neutral, regulated tone only
- Preserve all numerical values exactly
- Preserve all uncertainty acknowledgments
```

## MANDATORY SAFETY GATE

### Forbidden Language Detection
DeepSeek output is **automatically rejected** if it contains:

**Certainty Language** (violates .kiro constraints):
- "guaranteed", "no risk", "certain", "always", "never fails"
- "risk-free", "completely safe", "absolutely"

**Advice Language** (violates narrator role):
- "you should", "you must", "i recommend", "my advice"
- "i suggest", "you need to", "it would be best"

**Metaphor/Analogy Language** (violates system prompt):
- "imagine", "think of it as", "like", "similar to"
- "picture this", "consider it as"

### Validation Pipeline
Every DeepSeek output passes through:
1. **Structural Validation**: Non-empty, reasonable length (max 3x original)
2. **Constraint Validation**: Against `.kiro/agent_constraints.md`
3. **Forbidden Language Scan**: Automatic rejection of unsafe phrases
4. **Numerical Preservation**: Exact preservation of all numbers
5. **Fallback**: Deterministic content if any validation fails

## Integration Points

### 1. Explanation Enhancement
```javascript
import { enhanceExplanation } from '../utils/aiAssistLayer.js';

const original = "Risk assessment indicates medium probability threshold breach";
const enhanced = await enhanceExplanation(original, { confidence: 0.7 });

// Result structure:
{
  content: "Enhanced explanation text",
  enhanced: true,
  source: 'deepseek_enhanced',
  originalContent: "Original text"
}
```

### 2. Client Summary Enhancement
```javascript
const summary = await generateClientSummary(investor, advisor);
// Automatically tries DeepSeek enhancement if available
// Falls back to deterministic summary on any failure
```

### 3. Risk Narrative Expansion
```javascript
import { expandRiskNarrative } from '../utils/aiAssistLayer.js';

const enhanced = await expandRiskNarrative(knownRisks, context);
// Expands existing risks only - never invents new ones
```

## Logging & Accountability

### What Gets Logged
- DeepSeek usage (success/failure) with timestamps
- Validation failures and specific reasons
- Fallback usage statistics and performance metrics
- Model version and configuration used

### What NEVER Gets Logged
- Raw prompts or user data
- API keys or sensitive information
- Personal financial details or PII
- DeepSeek responses (privacy preservation)

### Sample Log Entry
```json
{
  "timestamp": "2025-01-26T10:30:00Z",
  "operation": "enhanceExplanation",
  "success": true,
  "model": "deepseek-v3.1",
  "mode": "deepseek_enhanced"
}
```

## Security & Privacy

### API Key Management
- **Environment variables only** - never hardcoded
- **Frontend never sees keys** - backend integration only
- **Secure transmission** - HTTPS REST calls only
- **No key logging** - keys never appear in logs

### Data Protection
- **Input sanitization** before DeepSeek calls
- **Output validation** after DeepSeek responses
- **Privacy preservation** - no user data in logs
- **Graceful degradation** on security failures

## Testing & Validation

### Test Local Ollama Setup
```bash
# 1. Verify Ollama is running
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:8b","prompt":"Hello","stream":false}'

# 2. Test with application
npm run dev
# Check browser console for "DeepSeek Local (Ollama) enabled"
```

### Test Cloud API Setup
```bash
# 1. Set cloud configuration
export VITE_DEEPSEEK_MODE=cloud
export VITE_DEEPSEEK_API_KEY=your_key_here

# 2. Test with application
npm run dev
# Check browser console for "DeepSeek v3.1 Cloud enhancement enabled"
```

### Test Without DeepSeek (Deterministic Mode)
```bash
# Remove or comment out configuration
# VITE_DEEPSEEK_MODE=
# VITE_DEEPSEEK_API_KEY=

npm run dev
# System should work identically in deterministic mode
```

### Integration Test Page
Open `test-integration.html` in your browser to run comprehensive tests:
- Configuration validation
- Direct API calls
- Enhancement layer testing
- Validation pipeline verification

### Validation Checklist
- [ ] App works without DeepSeek API key
- [ ] No business logic moved into DeepSeek
- [ ] All final decisions remain deterministic  
- [ ] DeepSeek improves clarity, not authority
- [ ] Fallbacks work for all DeepSeek functions
- [ ] Safety gate rejects inappropriate outputs
- [ ] Numerical values preserved exactly
- [ ] Forbidden language detection works

## Error Handling

### Common Issues & Solutions

**Local Ollama Not Working:**
1. Verify Ollama is installed and running: `ollama serve`
2. Check if model is available: `ollama list`
3. Pull model if missing: `ollama pull deepseek-r1:8b`
4. Test endpoint: `curl -X POST http://localhost:11434/api/generate -H "Content-Type: application/json" -d '{"model":"deepseek-r1:8b","prompt":"test","stream":false}'`
5. Check firewall/port 11434 accessibility

**Cloud API Not Working:**
1. Verify API key in environment variables
2. Check network connectivity to DeepSeek endpoint
3. Review browser console for API errors
4. Confirm API key format (starts with 'sk-')

**Configuration Issues:**
1. Check VITE_DEEPSEEK_MODE is set correctly ('local' or 'cloud')
2. Restart development server after environment changes
3. Verify .env file is in project root
4. Check browser console for configuration status

**Performance Issues:**
1. Local: Monitor Ollama response times (should be <15s)
2. Cloud: Monitor API call timeouts (8s limit)
3. Check fallback usage rates in console logs
4. Verify model is loaded in Ollama: `ollama ps`

### Configuration Examples

### Local Development Setup (Recommended)
```bash
# .env.local
VITE_DEEPSEEK_MODE=local
VITE_OLLAMA_ENDPOINT=http://localhost:11434/api/generate
VITE_OLLAMA_MODEL=deepseek-r1:8b
```

### Cloud Development Setup
```bash
# .env.local
VITE_DEEPSEEK_MODE=cloud
VITE_DEEPSEEK_API_KEY=sk-your-development-key
VITE_DEEPSEEK_ENDPOINT=https://api.deepseek.com/v1/chat/completions
```

### Production Setup (Local)
```bash
# Production environment with local Ollama
VITE_DEEPSEEK_MODE=local
VITE_OLLAMA_ENDPOINT=http://localhost:11434/api/generate
VITE_OLLAMA_MODEL=deepseek-r1:8b
```

### Production Setup (Cloud)
```bash
# Production environment with cloud API
VITE_DEEPSEEK_MODE=cloud
VITE_DEEPSEEK_API_KEY=sk-your-production-key
VITE_DEEPSEEK_ENDPOINT=https://api.deepseek.com/v1/chat/completions
```

### Deterministic-Only Mode
```bash
# No DeepSeek configuration or set mode to disabled
# VITE_DEEPSEEK_MODE=
# System runs in full deterministic mode
```

## Monitoring & Metrics

### Key Metrics to Track
- DeepSeek enhancement success rate
- Validation failure rate and reasons
- Fallback usage frequency
- API response times and timeouts
- User experience impact (A/B testing)

### Health Check Endpoint
```javascript
import { getAIAssistStatus } from '../utils/aiAssistLayer.js';

const status = getAIAssistStatus();
// Returns: { enabled, model, endpoint, mode, etc. }
```

## Compliance & Regulatory

### Regulatory Posture Maintained
- **All decisions remain deterministic** and auditable
- **DeepSeek enhances explanations only** - never makes decisions
- **Audit trails preserved** independent of DeepSeek usage
- **Professional consultation triggers unchanged**
- **.kiro constraints enforced** on all DeepSeek outputs

### Explainability Preserved
- **All decisions traceable to rules** - DeepSeek doesn't change logic
- **DeepSeek enhancements clearly marked** with source attribution
- **Validation logic transparent** - all rejections logged
- **Conservative bias maintained** through safety gates

## Support & Troubleshooting

### Getting Help
1. **Check this guide first** for common issues
2. **Verify environment configuration** matches examples
3. **Test in deterministic mode** to isolate DeepSeek issues
4. **Review console logs** for specific error messages
5. **Ensure .kiro constraints respected** in all outputs

### Emergency Fallback
If DeepSeek causes issues:
```bash
# Immediately disable DeepSeek
unset VITE_DEEPSEEK_API_KEY
# or comment out in .env file
# System continues in full deterministic mode
```

## Future Enhancements

The architecture supports:
- **Multiple LLM integration** (GPT, Claude, etc.)
- **A/B testing** of DeepSeek vs deterministic outputs
- **Performance optimization** with response caching
- **Advanced validation rules** and safety mechanisms
- **Real-time model switching** based on performance

---

**Remember: DeepSeek v3.1 is a narrator, not an authority. When in doubt, the system defaults to deterministic operation.**