// DeepSeek v3.1 Configuration Validator
// Validates environment setup and provides clear guidance

/**
 * Validate DeepSeek configuration - supports both Cloud and Local deployment
 * Returns validation status and user guidance
 */
export const validateDeepSeekConfig = () => {
    const config = {
        // Cloud configuration
        apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
        endpoint: import.meta.env.VITE_DEEPSEEK_ENDPOINT,
        
        // Local configuration
        ollamaEndpoint: import.meta.env.VITE_OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate',
        ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || 'deepseek-r1:8b',
        
        // Deployment mode
        deploymentMode: import.meta.env.VITE_DEEPSEEK_MODE || 'local'
    };

    const validation = {
        isValid: false,
        mode: 'deterministic_only',
        deploymentMode: config.deploymentMode,
        issues: [],
        guidance: []
    };

    if (config.deploymentMode === 'local') {
        // Local Ollama validation
        validation.mode = 'deepseek_local';
        validation.isValid = true; // Local mode doesn't require API key
        validation.guidance.push(`DeepSeek Local ready - Model: ${config.ollamaModel}`);
        validation.guidance.push(`Ollama endpoint: ${config.ollamaEndpoint}`);
        
        // Optional warnings for local setup
        if (!config.ollamaEndpoint.startsWith('http://localhost')) {
            validation.guidance.push('Note: Using non-localhost Ollama endpoint');
        }
        
    } else if (config.deploymentMode === 'cloud') {
        // Cloud API validation
        if (!config.apiKey) {
            validation.issues.push('DeepSeek API key not configured for cloud mode');
            validation.guidance.push('Set VITE_DEEPSEEK_API_KEY in your environment to enable DeepSeek v3.1 cloud enhancement');
        } else if (!config.apiKey.startsWith('sk-')) {
            validation.issues.push('DeepSeek API key format appears invalid');
            validation.guidance.push('DeepSeek API keys typically start with "sk-"');
        }

        // Check endpoint
        if (!config.endpoint) {
            validation.issues.push('DeepSeek endpoint not configured');
            validation.guidance.push('Set VITE_DEEPSEEK_ENDPOINT to https://api.deepseek.com/v1/chat/completions');
        } else if (!config.endpoint.startsWith('https://')) {
            validation.issues.push('DeepSeek endpoint must use HTTPS');
            validation.guidance.push('Ensure VITE_DEEPSEEK_ENDPOINT starts with https://');
        }

        // Determine cloud mode validity
        if (config.apiKey && config.endpoint && validation.issues.length === 0) {
            validation.isValid = true;
            validation.mode = 'deepseek_cloud';
            validation.guidance.push('DeepSeek v3.1 cloud enhancement ready');
        }
        
    } else {
        validation.issues.push(`Unknown deployment mode: ${config.deploymentMode}`);
        validation.guidance.push('Set VITE_DEEPSEEK_MODE to either "local" or "cloud"');
    }

    // Final mode determination
    if (!validation.isValid && validation.issues.length > 0) {
        validation.mode = 'deterministic_only';
        validation.guidance.push('Running in deterministic-only mode due to configuration issues');
    }

    return validation;
};

/**
 * Get user-friendly configuration status
 */
export const getConfigurationStatus = () => {
    const validation = validateDeepSeekConfig();
    
    const statusMessages = {
        'deepseek_local': 'DeepSeek Local (Ollama) enabled',
        'deepseek_cloud': 'DeepSeek v3.1 Cloud enhancement enabled',
        'deterministic_only': 'Running in deterministic-only mode'
    };
    
    return {
        status: validation.isValid ? 'ready' : 'not_configured',
        mode: validation.mode,
        deploymentMode: validation.deploymentMode,
        message: statusMessages[validation.mode] || 'Configuration error',
        issues: validation.issues,
        guidance: validation.guidance
    };
};

/**
 * Display configuration guidance to user
 */
export const displayConfigurationGuidance = () => {
    const status = getConfigurationStatus();
    
    console.group('🤖 DeepSeek Configuration Status');
    console.log(`Deployment Mode: ${status.deploymentMode}`);
    console.log(`Mode: ${status.mode}`);
    console.log(`Status: ${status.message}`);
    
    if (status.issues.length > 0) {
        console.group('⚠️ Configuration Issues:');
        status.issues.forEach(issue => console.log(`• ${issue}`));
        console.groupEnd();
    }
    
    if (status.guidance.length > 0) {
        console.group('💡 Configuration Info:');
        status.guidance.forEach(guide => console.log(`• ${guide}`));
        console.groupEnd();
    }
    
    if (status.deploymentMode === 'local') {
        console.log('\n🏠 Local Mode: Ensure Ollama is running with deepseek-r1:8b model');
        console.log('   Start Ollama: ollama serve');
        console.log('   Pull model: ollama pull deepseek-r1:8b');
    } else {
        console.log('\n📖 For detailed setup instructions, see: DEEPSEEK_INTEGRATION.md');
    }
    
    console.groupEnd();
    
    return status;
};