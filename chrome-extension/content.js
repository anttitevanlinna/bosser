// Bosser LinkedIn Assistant - Content Script
// Runs on all LinkedIn pages to provide enhanced functionality

class BosserLinkedInContent {
    constructor() {
        this.isInitialized = false;
        this.executor = null;
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        
        console.log('Bosser LinkedIn Assistant loaded on:', window.location.href);
        
        // Initialize dynamic executor
        this.executor = new window.DynamicExecutor();
        
        // Add visual indicators for Bosser functionality
        this.addBosserIndicators();
        
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open
        });
        
        // Monitor page changes (LinkedIn is a SPA)
        this.observePageChanges();
    }
    
    addBosserIndicators() {
        // Add small Bosser indicator to articles
        if (window.location.href.includes('/pulse/')) {
            this.addArticleIndicator();
        }
        
        // Add indicator to profile article lists
        if (window.location.href.includes('/recent-activity/')) {
            this.addProfileIndicators();
        }
        
        // Add indicator to editor
        if (window.location.href.includes('/article/new') || 
            window.location.href.includes('/newsletters/')) {
            this.addEditorIndicator();
        }
    }
    
    addArticleIndicator() {
        setTimeout(() => {
            if (document.querySelector('.bosser-indicator')) return;
            
            const indicator = document.createElement('div');
            indicator.className = 'bosser-indicator';
            indicator.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #ff6b35;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 9999;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#ff8555'" 
                   onmouseout="this.style.background='#ff6b35'"
                   onclick="chrome.runtime.sendMessage({action: 'openPopup'})">
                    📄 Bosser: Ready to Scrape
                </div>
            `;
            
            document.body.appendChild(indicator);
        }, 1000);
    }
    
    addProfileIndicators() {
        setTimeout(() => {
            const articleLinks = document.querySelectorAll('a[href*="/pulse/"]:not(.bosser-enhanced)');
            
            articleLinks.forEach((link, index) => {
                if (link.classList.contains('bosser-enhanced')) return;
                link.classList.add('bosser-enhanced');
                
                // Add small scrape button
                const scrapeBtn = document.createElement('span');
                scrapeBtn.innerHTML = '📥';
                scrapeBtn.style.cssText = `
                    margin-left: 8px;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: opacity 0.3s;
                    font-size: 14px;
                `;
                scrapeBtn.title = 'Scrape this article with Bosser';
                
                scrapeBtn.addEventListener('mouseover', () => scrapeBtn.style.opacity = '1');
                scrapeBtn.addEventListener('mouseout', () => scrapeBtn.style.opacity = '0.6');
                
                scrapeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.scrapeArticleFromLink(link.href);
                });
                
                link.appendChild(scrapeBtn);
            });
        }, 2000);
    }
    
    addEditorIndicator() {
        setTimeout(() => {
            if (document.querySelector('.bosser-editor-indicator')) return;
            
            const indicator = document.createElement('div');
            indicator.className = 'bosser-editor-indicator';
            indicator.innerHTML = `
                <div style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #28a745;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 9999;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#34ce57'" 
                   onmouseout="this.style.background='#28a745'">
                    ✍️ Bosser: Ready to Publish
                </div>
            `;
            
            document.body.appendChild(indicator);
        }, 1000);
    }
    
    observePageChanges() {
        // LinkedIn is a Single Page Application, so we need to watch for URL changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                // Page changed, re-add indicators
                setTimeout(() => this.addBosserIndicators(), 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }
    
    handleMessage(request, sender, sendResponse) {
        const logger = window.BosserLogger;
        
        switch (request.action) {
            case 'scrapeCurrentArticle':
                logger?.info('Content script received scrapeCurrentArticle request');
                this.scrapeCurrentArticle()
                    .then(result => {
                        logger?.success('Scraping completed in content script', { title: result?.title });
                        sendResponse({ success: true, data: result });
                    })
                    .catch(error => {
                        logger?.error('Scraping failed in content script', error);
                        sendResponse({ success: false, error: error.message });
                    });
                break;
                
            case 'fillForm':
                logger?.info('Content script received fillForm request');
                this.fillLinkedInForm(request.draftData)
                    .then(result => {
                        logger?.success('Form filling completed in content script', result);
                        sendResponse({ success: true, data: result });
                    })
                    .catch(error => {
                        logger?.error('Form filling failed in content script', error);
                        sendResponse({ success: false, error: error.message });
                    });
                break;
                
            case 'scrapeAllArticles':
                logger?.info('Content script received scrapeAllArticles request');
                this.scrapeAllArticles()
                    .then(result => sendResponse({ success: true, data: result }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;
                
            case 'getPageInfo':
                sendResponse({
                    success: true,
                    data: {
                        url: window.location.href,
                        title: document.title,
                        type: this.detectPageType()
                    }
                });
                break;
                
            default:
                logger?.warning('Unknown message action', { action: request.action });
                sendResponse({ success: false, error: 'Unknown action' });
        }
    }
    
    detectPageType() {
        const url = window.location.href;
        
        if (url.includes('/pulse/')) return 'article';
        if (url.includes('/recent-activity/')) return 'profile_articles';
        if (url.includes('/article/new') || url.includes('/newsletters/')) return 'editor';
        if (url.includes('linkedin.com')) return 'linkedin_other';
        return 'unknown';
    }
    
    async scrapeCurrentArticle() {
        try {
            if (!this.executor) {
                throw new Error('Dynamic executor not initialized');
            }
            
            // Use dynamic executor to get and run scraping code from server
            const articleData = await this.executor.scrapeArticle();
            
            if (!articleData || !articleData.title) {
                throw new Error('No article data extracted');
            }
            
            // Save to server automatically
            await this.saveToServer(articleData);
            
            // Also save to extension storage for UI counter
            const result = await chrome.storage.local.get(['scrapedArticles']);
            const scrapedArticles = result.scrapedArticles || [];
            
            // Check for duplicates
            const exists = scrapedArticles.find(article => 
                article.url === articleData.url || article.slug === articleData.slug
            );
            
            if (!exists) {
                scrapedArticles.push(articleData);
                await chrome.storage.local.set({ scrapedArticles });
            }
            
            return articleData;
            
        } catch (error) {
            console.error('Error scraping article:', error);
            
            // The dynamic executor will handle failure reporting
            throw error;
        }
    }
    
    async saveToServer(articleData) {
        try {
            const logger = window.BosserLogger;
            logger?.info('Sending scraped data to server', { 
                title: articleData.title,
                images: articleData.images?.length || 0
            });
            
            const response = await fetch('http://localhost:3001/save-scraped-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleData)
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                logger?.success('Data saved to server', {
                    filename: result.filename,
                    imagesDownloaded: result.imagesDownloaded,
                    message: result.message
                });
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            const logger = window.BosserLogger;
            logger?.error('Failed to save data to server', error);
            // Don't throw - we still want local storage to work
        }
    }
    
    async scrapeAllArticles() {
        try {
            const articleLinks = Array.from(document.querySelectorAll('a[href*="/pulse/"]'));
            const articles = [];
            
            for (const link of articleLinks) {
                const title = link.textContent.trim();
                const url = link.href;
                const id = url.split('/pulse/')[1]?.split('/')[0];
                
                if (!title || !url || !id) continue;
                
                // Try to find publication date
                let publishDate = '';
                const parentElement = link.closest('article, .feed-shared-update-v2, li');
                if (parentElement) {
                    const dateElement = parentElement.querySelector('time, [datetime]');
                    if (dateElement) {
                        publishDate = dateElement.getAttribute('datetime') || 
                                     dateElement.textContent.trim();
                    }
                }
                
                const articleData = {
                    title,
                    url,
                    id,
                    publishDate,
                    scrapedAt: new Date().toISOString(),
                    slug: window.BosserTextUtils.generateSlug(title),
                    content: '', // Would need to visit each article to get full content
                    author: this.extractProfileAuthor(),
                    tags: [],
                    needsContentScraping: true
                };
                
                articles.push(articleData);
            }
            
            // Save to extension storage
            if (articles.length > 0) {
                const result = await chrome.storage.local.get(['scrapedArticles']);
                const scrapedArticles = result.scrapedArticles || [];
                
                for (const article of articles) {
                    const exists = scrapedArticles.find(existing => 
                        existing.url === article.url || existing.slug === article.slug
                    );
                    
                    if (!exists) {
                        scrapedArticles.push(article);
                    }
                }
                
                await chrome.storage.local.set({ scrapedArticles });
            }
            
            return articles;
            
        } catch (error) {
            console.error('Error scraping all articles:', error);
            throw error;
        }
    }
    
    async scrapeArticleFromLink(articleUrl) {
        // Open article in new tab and scrape it
        const newTab = window.open(articleUrl, '_blank');
        
        // Note: Due to browser security, we can't directly access the new tab's content
        // This would require the user to manually run scraping on that tab
        console.log('Opened article for scraping:', articleUrl);
    }
    
    extractTitle() {
        // Using shared selectors from config/linkedin-selectors.js
        const selectors = [
            'h1',
            '[data-test-id="article-title"]',
            '.article-title',
            'h1.break-words'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return document.title || '';
    }
    
    extractContent() {
        // Using shared selectors from config/linkedin-selectors.js
        const selectors = [
            '.article-content',
            '[data-test-id="article-content"]',
            '.break-words',
            'article .break-words',
            '.article-body'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.innerText.trim()) {
                return element.innerText.trim();
            }
        }
        
        return '';
    }
    
    extractAuthor() {
        // Using shared selectors from config/linkedin-selectors.js
        const selectors = [
            '[data-test-id="article-author"]',
            '.article-author',
            '.feed-shared-actor__name',
            'a[href*="/in/"] span:first-child'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        return '';
    }
    
    extractProfileAuthor() {
        // When scraping from profile page
        const profileName = document.querySelector('h1')?.textContent?.trim() || 
                           document.querySelector('.text-heading-xlarge')?.textContent?.trim() ||
                           'Antti Tevanlinna';
        return profileName;
    }
    
    extractPublishDate() {
        const dateElement = document.querySelector('time') || 
                           document.querySelector('[datetime]');
        
        if (dateElement) {
            return dateElement.getAttribute('datetime') || 
                   dateElement.textContent.trim();
        }
        
        return '';
    }
    
    extractTags() {
        const hashtagElements = document.querySelectorAll('a[href*="/hashtag/"]');
        return Array.from(hashtagElements).map(el => 
            el.textContent.trim().replace('#', '')
        );
    }
    
    
    async savePageHTMLForDebugging(reason) {
        try {
            // Create debug info
            const debugInfo = {
                reason: reason,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                title: document.title,
                
                // Test all our selectors
                selectorTests: {
                    titles: this.testSelectors([
                        'h1',
                        '[data-test-id="article-title"]',
                        '.article-title',
                        'h1.break-words'
                    ]),
                    content: this.testSelectors([
                        '.article-content',
                        '[data-test-id="article-content"]',
                        '.break-words',
                        'article .break-words',
                        '.article-body'
                    ]),
                    authors: this.testSelectors([
                        '[data-test-id="article-author"]',
                        '.article-author',
                        '.feed-shared-actor__name',
                        'a[href*="/in/"] span:first-child'
                    ])
                },
                
                // Page structure analysis
                pageStructure: {
                    allH1s: Array.from(document.querySelectorAll('h1')).map(el => ({
                        text: el.textContent.trim().substring(0, 100),
                        classes: el.className,
                        id: el.id
                    })),
                    allArticleTags: Array.from(document.querySelectorAll('article')).map(el => ({
                        classes: el.className,
                        id: el.id,
                        children: el.children.length
                    })),
                    possibleContent: Array.from(document.querySelectorAll('div[class*="content"], div[class*="article"], div[class*="text"], p')).slice(0, 10).map(el => ({
                        tag: el.tagName,
                        classes: el.className,
                        text: el.textContent.trim().substring(0, 50)
                    }))
                }
            };
            
            // Get full HTML (cleaned)
            const htmlContent = document.documentElement.outerHTML
                .replace(/data-[^=]*="[^"]*"/g, '') // Remove data attributes to reduce size
                .replace(/style="[^"]*"/g, ''); // Remove inline styles
            
            // Create the debug file content
            const debugFile = {
                debugInfo: debugInfo,
                html: htmlContent
            };
            
            // Save via download
            const blob = new Blob([JSON.stringify(debugFile, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            if (chrome && chrome.downloads) {
                const filename = `linkedin-debug-${reason}-${Date.now()}.json`;
                await chrome.downloads.download({
                    url: url,
                    filename: `scrapers/${filename}`,
                    saveAs: false
                });
                
                console.log(`🐛 Debug file saved: ${filename}`);
                
                // Also log to our server
                if (window.BosserLogger) {
                    window.BosserLogger.info(`Debug HTML saved: ${filename}`, {
                        reason: reason,
                        url: window.location.href,
                        selectorTestResults: debugInfo.selectorTests
                    });
                }
            }
            
        } catch (error) {
            console.error('Failed to save debug HTML:', error);
        }
    }
    
    testSelectors(selectors) {
        return selectors.map(selector => {
            const elements = document.querySelectorAll(selector);
            return {
                selector: selector,
                found: elements.length,
                firstText: elements.length > 0 ? elements[0].textContent.trim().substring(0, 100) : null,
                visible: elements.length > 0 ? elements[0].offsetParent !== null : false
            };
        });
    }
    
    async fillLinkedInForm(draftData) {
        try {
            if (!this.executor) {
                throw new Error('Dynamic executor not initialized');
            }
            
            // Use dynamic executor to get and run form filling code from server
            const result = await this.executor.fillForm(draftData);
            
            return result;
            
        } catch (error) {
            console.error('Error filling form:', error);
            throw error;
        }
    }
    
    fillTitle(title) {
        // Using shared selectors from config/linkedin-selectors.js
        const titleSelectors = [
            'input[placeholder*="Title"]',
            '[contenteditable][aria-label*="title"]',
            'h1[contenteditable]',
            '[data-test-id="article-title"]'
        ];
        
        for (const selector of titleSelectors) {
            const titleField = document.querySelector(selector);
            if (titleField) {
                titleField.focus();
                
                if (titleField.tagName === 'INPUT') {
                    titleField.value = title;
                } else {
                    titleField.textContent = title;
                }
                
                titleField.dispatchEvent(new Event('input', { bubbles: true }));
                titleField.dispatchEvent(new Event('change', { bubbles: true }));
                
                return true;
            }
        }
        
        return false;
    }
    
    fillContent(content, tags = []) {
        // Using shared selectors from config/linkedin-selectors.js
        const contentSelectors = [
            '.ProseMirror',
            '[contenteditable][role="textbox"]:not([aria-label*="Title"])',
            'div[aria-label*="content"]',
            '[data-test-id="article-content"]'
        ];
        
        for (const selector of contentSelectors) {
            const contentField = document.querySelector(selector);
            if (contentField && contentField.offsetParent !== null) {
                contentField.focus();
                
                // Clear existing content
                contentField.innerHTML = '';
                
                // Add content
                const formattedContent = content.replace(/\\n\\n/g, '</p><p>').replace(/\\n/g, '<br>');
                contentField.innerHTML = `<p>${formattedContent}</p>`;
                
                // Add tags as hashtags
                if (tags && tags.length > 0) {
                    const hashtags = tags.map(tag => `#${tag.replace(/\\s+/g, '')}`).join(' ');
                    contentField.innerHTML += `<p><br></p><p>${hashtags}</p>`;
                }
                
                contentField.dispatchEvent(new Event('input', { bubbles: true }));
                contentField.dispatchEvent(new Event('change', { bubbles: true }));
                
                return true;
            }
        }
        
        return false;
    }
}

// Initialize the content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BosserLinkedInContent();
    });
} else {
    new BosserLinkedInContent();
}