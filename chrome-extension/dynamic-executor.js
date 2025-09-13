// Dynamic Code Execution System for Bosser Extension
// Requests and executes code from the log server

class DynamicExecutor {
    constructor() {
        this.serverUrl = 'http://localhost:3001';
        this.logger = window.BosserLogger || console;
        this.failureCount = new Map(); // Track failures per action/page combo
    }
    
    async executeAction(action, pageType, additionalData = {}) {
        this.logger.info(`Requesting code for action: ${action} on ${pageType}`);
        
        try {
            // Get failure count for this action/page combination
            const key = `${action}_${pageType}`;
            const previousFailures = this.failureCount.get(key) || 0;
            
            // Request executable code from server
            const codeResponse = await this.requestCode(action, pageType, previousFailures, additionalData);
            
            if (!codeResponse.success) {
                throw new Error(`Server error: ${codeResponse.error}`);
            }
            
            this.logger.info(`Received strategy: ${codeResponse.name}`, {
                strategy: codeResponse.strategy,
                version: codeResponse.version
            });
            
            // Execute the code
            const result = await this.executeCode(codeResponse.code, codeResponse.strategy, additionalData);
            
            if (result.success !== false) {
                // Success - reset failure count
                this.failureCount.set(key, 0);
                this.logger.success(`Action succeeded: ${action}`, { 
                    strategy: codeResponse.strategy,
                    result: result 
                });
                return result;
            } else {
                // Failure - increment count and report
                const newFailureCount = previousFailures + 1;
                this.failureCount.set(key, newFailureCount);
                
                await this.reportFailure(codeResponse.strategy, result, action, pageType);
                
                this.logger.error(`Action failed: ${action} (attempt ${newFailureCount})`, {
                    strategy: codeResponse.strategy,
                    error: result.error
                });
                
                throw new Error(`Action failed: ${result.error}`);
            }
            
        } catch (error) {
            this.logger.error(`Dynamic execution failed for ${action}`, error);
            throw error;
        }
    }
    
    async requestCode(action, pageType, previousFailures = 0, additionalData = {}) {
        try {
            const response = await fetch(`${this.serverUrl}/get-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    pageType,
                    url: window.location.href,
                    previousFailures,
                    timestamp: new Date().toISOString(),
                    ...additionalData
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
            
        } catch (error) {
            this.logger.error('Failed to request code from server', error);
            throw new Error(`Code request failed: ${error.message}`);
        }
    }
    
    async executeCode(codeString, strategyName, additionalData = {}) {
        try {
            // Instead of dynamic execution, use the code as configuration for fixed functions
            // Parse the strategy from the received code
            const strategy = this.parseStrategyFromCode(codeString, strategyName);
            
            if (strategy.type === 'scrape') {
                const result = this.executeScrapingStrategy(strategy, additionalData);
                this.logger.info(`Scraping executed successfully`, { 
                    strategy: strategyName,
                    title: result.title
                });
                return result;
            } else if (strategy.type === 'fill') {
                const result = this.executeFormFillStrategy(strategy, additionalData);
                this.logger.info(`Form filling executed successfully`, { 
                    strategy: strategyName,
                    titleFilled: result.titleFilled,
                    contentFilled: result.contentFilled
                });
                return result;
            } else {
                throw new Error(`Unknown strategy type: ${strategy.type}`);
            }
            
        } catch (error) {
            this.logger.error(`Code execution failed for ${strategyName}`, error);
            
            return {
                success: false,
                error: error.message,
                strategy: strategyName,
                stack: error.stack
            };
        }
    }
    
    parseStrategyFromCode(codeString, strategyName) {
        // Extract strategy type and selectors from the code string
        // This is CSP-safe since we're not using eval/new Function
        
        if (strategyName.includes('article')) {
            return {
                type: 'scrape',
                selectors: {
                    title: ['h1', 'h1.break-words', '[data-test-id*="title"]', '.article-title'],
                    content: ['article .break-words', '.break-words', '.article-content', '[data-test-id*="content"]'],
                    author: ['.feed-shared-actor__name', '[data-test-id*="author"]', '.author-name'],
                    publishDate: ['time[datetime]', 'time', '.publish-date'],
                    hashtags: ['a[href*="/hashtag/"]', '.hashtag']
                }
            };
        } else if (strategyName.includes('form')) {
            return {
                type: 'fill',
                selectors: {
                    title: ['input[placeholder*="Title" i]', '[contenteditable][aria-label*="title" i]', 'h1[contenteditable]'],
                    content: ['.ProseMirror', '[contenteditable][role="textbox"]:not([aria-label*="Title"])', '[contenteditable].editor']
                }
            };
        }
        
        throw new Error(`Could not parse strategy from: ${strategyName}`);
    }
    
    executeScrapingStrategy(strategy, additionalData) {
        const result = {
            title: '',
            content: '',
            author: '',
            publishDate: '',
            tags: [],
            images: [],
            url: window.location.href,
            scrapedAt: new Date().toISOString(),
            strategy: strategy.name || 'csp_safe_scraper'
        };
        
        // Extract title
        for (const selector of strategy.selectors.title) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                result.title = element.textContent.trim();
                break;
            }
        }
        
        // Extract content
        for (const selector of strategy.selectors.content) {
            const element = document.querySelector(selector);
            if (element && element.innerText && element.innerText.trim()) {
                // Look for the main article content, skip navigation elements
                const text = element.innerText.trim();
                if (text.length > 100 && !text.startsWith('Home') && !text.startsWith('LinkedIn')) {
                    result.content = text;
                    break;
                }
            }
        }
        
        // If no content found with the above, try a different approach
        if (!result.content) {
            // Look for the article body or main content area
            const contentElements = document.querySelectorAll('article, main, [role="main"], .article-body');
            for (const element of contentElements) {
                const text = element.innerText?.trim();
                if (text && text.length > 100) {
                    result.content = text;
                    break;
                }
            }
        }
        
        // Extract author
        for (const selector of strategy.selectors.author) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                result.author = element.textContent.trim();
                break;
            }
        }
        
        // Extract publish date
        for (const selector of strategy.selectors.publishDate) {
            const element = document.querySelector(selector);
            if (element) {
                result.publishDate = element.getAttribute('datetime') || element.textContent.trim();
                if (result.publishDate) break;
            }
        }
        
        // Extract hashtags
        const hashtagElements = document.querySelectorAll('a[href*="/hashtag/"]');
        result.tags = Array.from(hashtagElements).map(el => 
            el.textContent.trim().replace('#', '')
        );
        
        // Extract images from article content
        this.extractArticleImages(result);
        
        // Generate slug
        result.slug = result.title
            .toLowerCase()
            .replace(/[^a-z0-9\\s-]/g, '')
            .replace(/\\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        
        return result;
    }
    
    executeFormFillStrategy(strategy, draftData) {
        const result = {
            titleFilled: false,
            contentFilled: false,
            errors: [],
            strategy: 'csp_safe_form_filler'
        };
        
        try {
            // Fill title
            for (const selector of strategy.selectors.title) {
                const titleField = document.querySelector(selector);
                if (titleField) {
                    titleField.focus();
                    if (titleField.tagName === 'INPUT') {
                        titleField.value = draftData.title;
                    } else {
                        titleField.textContent = draftData.title;
                    }
                    titleField.dispatchEvent(new Event('input', { bubbles: true }));
                    result.titleFilled = true;
                    break;
                }
            }
            
            // Fill content
            for (const selector of strategy.selectors.content) {
                const contentField = document.querySelector(selector);
                if (contentField && contentField.offsetParent !== null) {
                    contentField.focus();
                    const formattedContent = draftData.content.replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br>');
                    contentField.innerHTML = `<p>${formattedContent}</p>`;
                    
                    // Add hashtags
                    if (draftData.tags && draftData.tags.length > 0) {
                        const hashtags = draftData.tags.map(tag => `#${tag.replace(/\\s+/g, '')}`).join(' ');
                        contentField.innerHTML += `<p><br></p><p>${hashtags}</p>`;
                    }
                    
                    contentField.dispatchEvent(new Event('input', { bubbles: true }));
                    result.contentFilled = true;
                    break;
                }
            }
            
        } catch (error) {
            result.errors.push(error.message);
        }
        
        return result;
    }
    
    async reportFailure(strategy, result, action, pageType) {
        try {
            // Gather page analysis data
            const pageAnalysis = {
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString(),
                
                // Test common selectors to help with debugging
                selectorTests: this.testCommonSelectors(),
                
                // DOM structure analysis
                domStructure: this.analyzeDOMStructure()
            };
            
            const failureReport = {
                strategy,
                error: result.error,
                action,
                pageType,
                pageAnalysis,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent.substring(0, 100)
            };
            
            const response = await fetch(`${this.serverUrl}/report-failure`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(failureReport)
            });
            
            if (response.ok) {
                const result = await response.json();
                this.logger.info('Failure reported to server', { 
                    message: result.message,
                    newStrategy: result.newStrategy 
                });
                
                // If server generated a new strategy, we could retry immediately
                if (result.newStrategy && result.newCode) {
                    this.logger.info('Server generated improved strategy', { 
                        newStrategy: result.newStrategy 
                    });
                }
            }
            
        } catch (error) {
            this.logger.warning('Failed to report failure to server', error);
        }
    }
    
    testCommonSelectors() {
        const selectors = {
            titles: ['h1', 'h1.break-words', '[data-test-id*="title"]', '.article-title'],
            content: ['.article-content', '.break-words', 'article .break-words', '[data-test-id*="content"]'],
            authors: ['.feed-shared-actor__name', '[data-test-id*="author"]', '.author-name'],
            editors: ['.ProseMirror', '[contenteditable]', '[role="textbox"]'],
            inputs: ['input[type="text"]', 'input[placeholder]', 'textarea']
        };
        
        const results = {};
        
        for (const [category, selectorList] of Object.entries(selectors)) {
            results[category] = selectorList.map(selector => {
                const elements = document.querySelectorAll(selector);
                return {
                    selector,
                    found: elements.length,
                    visible: elements.length > 0 ? elements[0].offsetParent !== null : false,
                    sample: elements.length > 0 ? elements[0].textContent.trim().substring(0, 50) : null
                };
            });
        }
        
        return results;
    }
    
    analyzeDOMStructure() {
        return {
            totalElements: document.querySelectorAll('*').length,
            articleTags: document.querySelectorAll('article').length,
            h1Count: document.querySelectorAll('h1').length,
            editableElements: document.querySelectorAll('[contenteditable]').length,
            inputElements: document.querySelectorAll('input').length,
            
            // Find elements with specific class patterns
            linkedinClasses: Array.from(document.querySelectorAll('[class*="linkedin"], [class*="feed"], [class*="article"]'))
                .slice(0, 5)
                .map(el => ({
                    tag: el.tagName,
                    classes: el.className,
                    id: el.id
                }))
        };
    }
    
    extractArticleImages(result) {
        // Find all images on the page first
        const allImages = document.querySelectorAll('img');
        const foundImages = new Set(); // Avoid duplicates
        
        this.logger.info(`Found ${allImages.length} total images on page`);
        
        allImages.forEach((img, index) => {
            const src = img.src || img.getAttribute('src') || img.getAttribute('data-src');
            
            // Log all image sources for debugging
            if (src) {
                this.logger.info(`Image ${index}: ${src.substring(0, 100)}...`, {
                    visible: img.offsetParent !== null,
                    hasLinkedIn: src.includes('linkedin.com') || src.includes('licdn.com'),
                    isArticleImage: src.includes('article-inline') || src.includes('dms/image')
                });
            }
            
            // Check if this looks like a LinkedIn content image
            if (src && 
                (src.includes('linkedin.com') || src.includes('licdn.com')) &&
                (src.includes('article-inline') || 
                 src.includes('dms/image') ||
                 src.includes('media.licdn.com')) &&
                !foundImages.has(src) &&
                !src.includes('profile-displayphoto') && // Skip profile photos
                !src.includes('company-logo') && // Skip company logos
                img.offsetParent !== null) { // Only visible images
                
                foundImages.add(src);
                
                // Extract image metadata
                const imageData = {
                    src: src,
                    alt: img.alt || '',
                    title: img.title || '',
                    width: img.naturalWidth || img.width || 0,
                    height: img.naturalHeight || img.height || 0,
                    caption: this.findImageCaption(img),
                    position: result.images.length,
                    className: img.className,
                    parentText: img.parentElement?.textContent?.substring(0, 100) || ''
                };
                
                result.images.push(imageData);
                this.logger.success(`Found article image: ${src.substring(0, 60)}...`, {
                    alt: imageData.alt,
                    caption: imageData.caption,
                    dimensions: `${imageData.width}x${imageData.height}`,
                    className: imageData.className
                });
            }
        });
        
        this.logger.info(`Extracted ${result.images.length} article images`);
    }
    
    findImageCaption(imgElement) {
        // Look for caption in various ways
        const parent = imgElement.parentElement;
        
        // Check for figure/figcaption
        const figure = imgElement.closest('figure');
        if (figure) {
            const figcaption = figure.querySelector('figcaption');
            if (figcaption) return figcaption.textContent.trim();
        }
        
        // Check for nearby text elements that might be captions
        const nextSibling = imgElement.nextElementSibling;
        if (nextSibling && (nextSibling.tagName === 'P' || nextSibling.className.includes('caption'))) {
            const text = nextSibling.textContent.trim();
            if (text.length < 200) return text; // Likely a caption
        }
        
        return '';
    }
    
    
    // Convenience methods for common actions
    async scrapeArticle() {
        return await this.executeAction('scrape', 'article');
    }
    
    async fillForm(draftData) {
        return await this.executeAction('fill', 'editor', draftData);
    }
    
    async scrapeProfile() {
        return await this.executeAction('scrape', 'profile');
    }
}

// Export for use in other scripts
window.DynamicExecutor = DynamicExecutor;