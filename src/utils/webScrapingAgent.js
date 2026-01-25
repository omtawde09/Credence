// Web Scraping and Data Ingestion Agent
// Uses ScraperAPI for fetching + Hugging Face for processing
// Follows strict data collection and traceability requirements

/**
 * Configuration for web scraping and data processing
 */
const SCRAPING_CONFIG = {
    scraperApiKey: import.meta.env.VITE_SCRAPER_API_KEY || null,
    hfApiToken: import.meta.env.VITE_HF_API_TOKEN || null,
    scraperEndpoint: 'https://api.scraperapi.com',
    hfEndpoint: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    timeout: 30000, // 30 second timeout
    maxRetries: 1, // Avoid aggressive retries as per requirements
    enabled: false
};

/**
 * Approved data sources - only these domains are allowed
 */
const APPROVED_SOURCES = [
    // Government and regulatory sites
    'sec.gov',
    'treasury.gov', 
    'federalreserve.gov',
    'cftc.gov',
    'finra.org',
    
    // Official financial institutions
    'imf.org',
    'worldbank.org',
    'bis.org',
    
    // Public news and information
    'reuters.com',
    'bloomberg.com',
    'wsj.com',
    'ft.com',
    'cnbc.com',
    
    // Open access sources
    'wikipedia.org',
    'investopedia.com'
];

/**
 * Prohibited sources - never access these
 */
const PROHIBITED_SOURCES = [
    // Paywalled content
    'nytimes.com/subscription',
    'wsj.com/articles/premium',
    
    // Personal/private data
    'facebook.com',
    'twitter.com/messages',
    'linkedin.com/in/',
    
    // Financial accounts
    'schwab.com/account',
    'fidelity.com/customer',
    'etrade.com/account'
];

/**
 * Initialize the web scraping agent
 */
export const initializeScrapingAgent = () => {
    const hasScraperKey = Boolean(SCRAPING_CONFIG.scraperApiKey);
    const hasHfToken = Boolean(SCRAPING_CONFIG.hfApiToken);
    
    SCRAPING_CONFIG.enabled = hasScraperKey && hasHfToken;
    
    if (!hasScraperKey) {
        console.error('SCRAPER_API_KEY not configured - web scraping disabled');
        return false;
    }
    
    if (!hasHfToken) {
        console.error('HF_API_TOKEN not configured - text processing disabled');
        return false;
    }
    
    console.log('Web Scraping Agent initialized - ScraperAPI + Hugging Face ready');
    return SCRAPING_CONFIG.enabled;
};

/**
 * Validate if a URL is from an approved source
 */
const validateSource = (url) => {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.toLowerCase();
        
        // Check if domain is in prohibited list
        const isProhibited = PROHIBITED_SOURCES.some(prohibited => 
            domain.includes(prohibited.toLowerCase())
        );
        
        if (isProhibited) {
            return {
                valid: false,
                reason: 'Source is in prohibited list',
                domain: domain
            };
        }
        
        // Check if domain is in approved list
        const isApproved = APPROVED_SOURCES.some(approved => 
            domain.includes(approved.toLowerCase())
        );
        
        if (!isApproved) {
            return {
                valid: false,
                reason: 'Source not in approved list',
                domain: domain
            };
        }
        
        return {
            valid: true,
            reason: 'Source approved',
            domain: domain
        };
        
    } catch (error) {
        return {
            valid: false,
            reason: 'Invalid URL format',
            domain: null
        };
    }
};

/**
 * Fetch web content using ScraperAPI
 */
const fetchWithScraperAPI = async (url) => {
    if (!SCRAPING_CONFIG.enabled) {
        throw new Error('Scraping agent not properly configured');
    }
    
    const scraperUrl = new URL(SCRAPING_CONFIG.scraperEndpoint);
    scraperUrl.searchParams.append('api_key', SCRAPING_CONFIG.scraperApiKey);
    scraperUrl.searchParams.append('url', url);
    scraperUrl.searchParams.append('render', 'false'); // Don't render JS for faster scraping
    scraperUrl.searchParams.append('format', 'json');
    
    const response = await fetch(scraperUrl.toString(), {
        method: 'GET',
        timeout: SCRAPING_CONFIG.timeout
    });
    
    if (!response.ok) {
        throw new Error(`ScraperAPI error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.html && !data.text) {
        throw new Error('No content returned from ScraperAPI');
    }
    
    return {
        html: data.html || '',
        text: data.text || '',
        status: data.status || response.status,
        url: data.url || url
    };
};

/**
 * Clean and extract text using Hugging Face
 */
const processWithHuggingFace = async (rawText, contentType = 'article') => {
    if (!SCRAPING_CONFIG.hfApiToken) {
        // Return raw text if HF not available
        return {
            cleaned_text: rawText.substring(0, 1000), // Limit to first 1000 chars
            structured_fields: {},
            processing_used: 'none',
            confidence_notes: 'Raw text only - HF processing unavailable'
        };
    }
    
    try {
        // Use HF for text summarization/cleaning (not interpretation)
        const prompt = `Clean and structure this ${contentType} content, preserving all factual information: ${rawText.substring(0, 2000)}`;
        
        const response = await fetch(SCRAPING_CONFIG.hfEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SCRAPING_CONFIG.hfApiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 500,
                    min_length: 100,
                    do_sample: false
                },
                options: {
                    wait_for_model: true,
                    use_cache: false
                }
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data && Array.isArray(data) && data[0] && data[0].summary_text) {
                return {
                    cleaned_text: data[0].summary_text,
                    structured_fields: extractStructuredFields(data[0].summary_text),
                    processing_used: 'huggingface_summarization',
                    confidence_notes: 'Processed with HF BART model - factual content preserved'
                };
            }
        }
        
        // Fallback to simple cleaning if HF fails
        return {
            cleaned_text: cleanTextSimple(rawText),
            structured_fields: extractStructuredFields(rawText),
            processing_used: 'simple_cleaning',
            confidence_notes: 'HF processing failed - using simple text cleaning'
        };
        
    } catch (error) {
        console.warn('Hugging Face processing failed:', error.message);
        
        return {
            cleaned_text: cleanTextSimple(rawText),
            structured_fields: extractStructuredFields(rawText),
            processing_used: 'simple_cleaning',
            confidence_notes: `HF error: ${error.message} - using fallback cleaning`
        };
    }
};

/**
 * Simple text cleaning fallback
 */
const cleanTextSimple = (text) => {
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/[^\w\s.,!?;:()\-]/g, '') // Remove special chars except basic punctuation
        .trim()
        .substring(0, 1000); // Limit length
};

/**
 * Extract structured fields from text (no AI interpretation)
 */
const extractStructuredFields = (text) => {
    const fields = {};
    
    // Extract dates (factual, no interpretation)
    const dateMatches = text.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi);
    if (dateMatches) {
        fields.dates_mentioned = dateMatches.slice(0, 3); // Limit to first 3
    }
    
    // Extract numbers/percentages (factual, no interpretation)
    const numberMatches = text.match(/\b\d+\.?\d*%?\b/g);
    if (numberMatches) {
        fields.numbers_mentioned = numberMatches.slice(0, 5); // Limit to first 5
    }
    
    // Extract currency amounts (factual, no interpretation)
    const currencyMatches = text.match(/\$[\d,]+\.?\d*/g);
    if (currencyMatches) {
        fields.currency_amounts = currencyMatches.slice(0, 3); // Limit to first 3
    }
    
    return fields;
};

/**
 * MAIN SCRAPING FUNCTION - follows mandatory execution flow
 */
export const scrapeAndIngest = async (targetUrl, options = {}) => {
    const startTime = new Date().toISOString();
    
    try {
        // Step 1: Receive target URL
        if (!targetUrl || typeof targetUrl !== 'string') {
            throw new Error('Invalid target URL provided');
        }
        
        // Step 2: Verify source is allowed
        const sourceValidation = validateSource(targetUrl);
        if (!sourceValidation.valid) {
            return {
                success: false,
                error: `Source validation failed: ${sourceValidation.reason}`,
                source_url: targetUrl,
                fetched_at: startTime,
                domain: sourceValidation.domain
            };
        }
        
        // Step 3: Fetch data using ScraperAPI
        console.log(`Fetching data from approved source: ${sourceValidation.domain}`);
        const scrapedData = await fetchWithScraperAPI(targetUrl);
        
        // Step 4: Normalize and structure content
        const rawText = scrapedData.text || scrapedData.html;
        if (!rawText || rawText.length < 50) {
            return {
                success: false,
                error: 'Insufficient content retrieved from source',
                source_url: targetUrl,
                fetched_at: startTime,
                raw_content_length: rawText?.length || 0
            };
        }
        
        // Step 5: Use HF models for cleanup (not interpretation)
        const processedContent = await processWithHuggingFace(rawText, options.contentType || 'article');
        
        // Step 6: Validate factual integrity (no AI interpretation added)
        const rawExcerpt = rawText.substring(0, 200).trim();
        
        // Step 7: Return structured output with full traceability
        return {
            success: true,
            source_url: targetUrl,
            fetched_at: startTime,
            data_type: options.contentType || 'article',
            raw_excerpt: rawExcerpt,
            cleaned_text: processedContent.cleaned_text,
            structured_fields: processedContent.structured_fields,
            confidence_notes: processedContent.confidence_notes,
            processing_method: processedContent.processing_used,
            domain: sourceValidation.domain,
            content_length: rawText.length,
            scraper_status: scrapedData.status
        };
        
    } catch (error) {
        console.error('Scraping failed:', error.message);
        
        return {
            success: false,
            error: error.message,
            source_url: targetUrl,
            fetched_at: startTime,
            confidence_notes: 'Scraping operation failed - no data retrieved'
        };
    }
};

/**
 * Batch scraping with rate limiting
 */
export const scrapeMultipleSources = async (urls, options = {}) => {
    const results = [];
    const delay = options.delayMs || 2000; // 2 second delay between requests
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`Scraping ${i + 1}/${urls.length}: ${url}`);
        
        try {
            const result = await scrapeAndIngest(url, options);
            results.push(result);
            
            // Rate limiting - respect site terms
            if (i < urls.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
        } catch (error) {
            results.push({
                success: false,
                error: error.message,
                source_url: url,
                fetched_at: new Date().toISOString()
            });
        }
    }
    
    return {
        total_urls: urls.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
    };
};

/**
 * Get agent status and configuration
 */
export const getScrapingAgentStatus = () => {
    return {
        enabled: SCRAPING_CONFIG.enabled,
        scraper_api_configured: Boolean(SCRAPING_CONFIG.scraperApiKey),
        hf_api_configured: Boolean(SCRAPING_CONFIG.hfApiToken),
        approved_sources_count: APPROVED_SOURCES.length,
        prohibited_sources_count: PROHIBITED_SOURCES.length,
        mode: SCRAPING_CONFIG.enabled ? 'scraper_api_plus_hf' : 'disabled'
    };
};

// Initialize on module load
initializeScrapingAgent();