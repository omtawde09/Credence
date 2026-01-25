// Simple test script to verify Hugging Face AI integration
import { enhanceExplanation, getAllProviderStatus } from './src/utils/aiAssistanceSelector.js';

async function testAIIntegration() {
    console.log('🧪 Testing AI Integration...');
    
    // Check provider status
    const status = await getAllProviderStatus();
    console.log('Provider Status:', status);
    
    // Test explanation enhancement
    const originalText = "Portfolio risk analysis indicates elevated volatility metrics exceeding threshold parameters.";
    console.log('Original:', originalText);
    
    try {
        const enhanced = await enhanceExplanation(originalText, { confidence: 0.7 });
        console.log('Enhanced:', enhanced);
        
        if (enhanced.enhanced) {
            console.log('✅ AI Enhancement Working!');
            console.log('Provider:', enhanced.provider);
        } else {
            console.log('⚠️ Using deterministic fallback');
            console.log('Reason:', enhanced.reason);
        }
    } catch (error) {
        console.error('❌ Enhancement failed:', error);
    }
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
    window.testAIIntegration = testAIIntegration;
} else {
    testAIIntegration();
}