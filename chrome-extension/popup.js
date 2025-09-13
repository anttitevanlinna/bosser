class BosserLinkedInPopup {
    constructor() {
        this.currentPageType = 'unknown';
        this.scrapedCount = 0;
        this.loadedDraft = null;
        this.logger = window.BosserLogger || console;
        
        this.init();
    }
    
    async init() {
        this.logger.info('Popup initializing', { timestamp: new Date().toISOString() });
        
        try {
            await this.detectCurrentPage();
            await this.loadScrapedCount();
            await this.updateVersionInfo();
            this.setupEventListeners();
            this.updateUI();
            
            this.logger.success('Popup initialized successfully', { 
                pageType: this.currentPageType,
                scrapedCount: this.scrapedCount 
            });
        } catch (error) {
            this.logger.error('Failed to initialize popup', error);
        }
    }
    
    async detectCurrentPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = tab.url;
            
            if (url.includes('linkedin.com/pulse/')) {
                this.currentPageType = 'article';
            } else if (url.includes('linkedin.com/in/') && url.includes('/recent-activity/')) {
                this.currentPageType = 'profile_articles';
            } else if (url.includes('linkedin.com/article/new') || url.includes('linkedin.com/newsletters/')) {
                this.currentPageType = 'editor';
            } else if (url.includes('linkedin.com')) {
                this.currentPageType = 'linkedin_other';
            } else {
                this.currentPageType = 'not_linkedin';
            }
            
            this.updatePageDetection();
        } catch (error) {
            console.error('Error detecting page:', error);
            this.currentPageType = 'error';
        }
    }
    
    updatePageDetection() {
        const pageDetection = document.getElementById('pageDetection');
        const messages = {
            'article': '📄 LinkedIn Article - Ready to scrape',
            'profile_articles': '👤 Profile Articles - Ready to scrape all',
            'editor': '✍️  LinkedIn Editor - Ready to publish',
            'linkedin_other': '🔗 LinkedIn - Navigate to articles',
            'not_linkedin': '❌ Not on LinkedIn',
            'error': '⚠️  Page detection error'
        };
        
        pageDetection.textContent = messages[this.currentPageType] || '🔍 Unknown page';
    }
    
    async loadScrapedCount() {
        try {
            const result = await chrome.storage.local.get(['scrapedArticles']);
            const scrapedArticles = result.scrapedArticles || [];
            this.scrapedCount = scrapedArticles.length;
            
            document.getElementById('scrapedCounter').textContent = 
                `Scraped: ${this.scrapedCount} articles`;
        } catch (error) {
            console.error('Error loading scraped count:', error);
        }
    }
    
    async updateVersionInfo() {
        try {
            // Get plugin version from manifest
            const manifest = chrome.runtime.getManifest();
            const pluginVersion = manifest.version;
            
            // Get code version from server
            let codeVersion = '?';
            try {
                const response = await fetch('http://localhost:3001/version');
                if (response.ok) {
                    const versionData = await response.json();
                    codeVersion = versionData.version;
                }
            } catch (error) {
                this.logger.warning('Could not fetch code version from server', error);
            }
            
            document.getElementById('versionInfo').textContent = 
                `Plugin v${pluginVersion} | Code v${codeVersion}`;
                
            this.logger.info('Version info updated', {
                pluginVersion,
                codeVersion
            });
        } catch (error) {
            this.logger.error('Failed to update version info', error);
        }
    }
    
    setupEventListeners() {
        // Publishing buttons
        document.getElementById('loadDraftButton').addEventListener('click', () => {
            this.loadDraft();
        });
        
        document.getElementById('fillFormButton').addEventListener('click', () => {
            this.fillLinkedInForm();
        });
        
        // Scraping buttons
        document.getElementById('scrapeCurrentButton').addEventListener('click', () => {
            this.scrapeCurrentArticle();
        });
        
        document.getElementById('scrapeAllButton').addEventListener('click', () => {
            this.scrapeAllArticles();
        });
        
        // Data management buttons
        document.getElementById('syncButton').addEventListener('click', () => {
            this.syncToBosserProject();
        });
        
        document.getElementById('downloadButton').addEventListener('click', () => {
            this.downloadScrapedData();
        });
        
        // Debug button
        document.getElementById('sendLogsButton').addEventListener('click', () => {
            this.sendLogsToClaudeCode();
        });
    }
    
    updateUI() {
        const loadDraftBtn = document.getElementById('loadDraftButton');
        const fillFormBtn = document.getElementById('fillFormButton');
        const scrapeCurrentBtn = document.getElementById('scrapeCurrentButton');
        const scrapeAllBtn = document.getElementById('scrapeAllButton');
        
        // Enable/disable buttons based on current page
        switch (this.currentPageType) {
            case 'article':
                scrapeCurrentBtn.disabled = false;
                loadDraftBtn.disabled = true;
                fillFormBtn.disabled = true;
                scrapeAllBtn.disabled = true;
                break;
                
            case 'profile_articles':
                scrapeAllBtn.disabled = false;
                scrapeCurrentBtn.disabled = true;
                loadDraftBtn.disabled = true;
                fillFormBtn.disabled = true;
                break;
                
            case 'editor':
                loadDraftBtn.disabled = false;
                fillFormBtn.disabled = !this.loadedDraft;
                scrapeCurrentBtn.disabled = true;
                scrapeAllBtn.disabled = true;
                break;
                
            default:
                loadDraftBtn.disabled = false;  // Can always load draft
                fillFormBtn.disabled = true;
                scrapeCurrentBtn.disabled = true;
                scrapeAllBtn.disabled = true;
        }
    }
    
    async loadDraft() {
        this.logger.info('Loading draft from Bosser project');
        
        try {
            this.showStatus('Loading draft from Bosser project...', 'info');
            
            // This would normally read from the bosser project files
            // For now, we'll simulate loading the checking-assumptions draft
            const mockDraft = {
                title: "Checking Assumptions: Knowing more over being right",
                content: `# The Cost of Being Right
                
When we prioritize being right over understanding, we miss opportunities to learn and grow...`,
                tags: ['leadership', 'assumptions', 'communication', 'strategy'],
                slug: 'checking-assumptions'
            };
            
            this.loadedDraft = mockDraft;
            
            document.getElementById('draftInfo').textContent = 
                `Loaded: ${mockDraft.title.substring(0, 30)}...`;
                
            this.showStatus('Draft loaded successfully!', 'success');
            this.updateUI();
            
            this.logger.success('Draft loaded successfully', { 
                title: mockDraft.title,
                contentLength: mockDraft.content.length,
                tags: mockDraft.tags 
            });
            
        } catch (error) {
            this.logger.error('Failed to load draft', error);
            this.showStatus(`Error loading draft: ${error.message}`, 'error');
        }
    }
    
    async fillLinkedInForm() {
        if (!this.loadedDraft) {
            this.showStatus('No draft loaded. Load a draft first.', 'error');
            return;
        }
        
        try {
            this.logger.info('Starting dynamic form filling');
            this.showStatus('Requesting form filling code from server...', 'info');
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Send message to content script to use dynamic executor
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'fillForm',
                draftData: this.loadedDraft
            });
            
            if (response && response.success) {
                const result = response.data;
                const statusMsg = `Form filled with dynamic code! Title: ${result.titleFilled ? '✅' : '❌'}, Content: ${result.contentFilled ? '✅' : '❌'}`;
                this.showStatus(statusMsg, result.titleFilled && result.contentFilled ? 'success' : 'info');
                
                this.logger.success('Dynamic form filling succeeded', {
                    strategy: result.strategy,
                    titleFilled: result.titleFilled,
                    contentFilled: result.contentFilled
                });
            } else {
                const errorMsg = response?.error || 'Failed to fill form';
                this.showStatus(errorMsg, 'error');
                this.logger.error('Dynamic form filling failed', null, { error: errorMsg });
            }
            
        } catch (error) {
            this.logger.error('Error in dynamic form filling', error);
            this.showStatus(`Error filling form: ${error.message}`, 'error');
        }
    }
    
    // This function runs in the LinkedIn page context
    fillFormInPage(draft) {
        // Find title field
        const titleSelectors = [
            'input[placeholder*="Title"]',
            '[contenteditable][aria-label*="title"]',
            'h1[contenteditable]',
            '[data-test-id="article-title"]'
        ];
        
        let titleField = null;
        for (const selector of titleSelectors) {
            titleField = document.querySelector(selector);
            if (titleField) break;
        }
        
        if (titleField) {
            titleField.focus();
            titleField.value = draft.title;
            titleField.textContent = draft.title;
            titleField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Find content field
        const contentSelectors = [
            '.ProseMirror',
            '[contenteditable][role="textbox"]',
            'div[aria-label*="content"]',
            '[data-test-id="article-content"]'
        ];
        
        let contentField = null;
        for (const selector of contentSelectors) {
            contentField = document.querySelector(selector);
            if (contentField && contentField.offsetParent !== null) break;
        }
        
        if (contentField) {
            contentField.focus();
            contentField.innerHTML = draft.content.replace(/\\n/g, '<br>');
            contentField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Add tags as hashtags at the end
        if (draft.tags && contentField) {
            const hashtags = draft.tags.map(tag => `#${tag}`).join(' ');
            contentField.innerHTML += `<br><br>${hashtags}`;
        }
        
        return { titleFilled: !!titleField, contentFilled: !!contentField };
    }
    
    async scrapeCurrentArticle() {
        try {
            this.logger.info('Starting dynamic article scraping');
            this.showStatus('Requesting scraping code from server...', 'info');
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Send message to content script to use dynamic executor
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'scrapeCurrentArticle'
            });
            
            if (response && response.success && response.data) {
                await this.saveScrapedArticle(response.data);
                this.scrapedCount++;
                await this.loadScrapedCount();
                this.showStatus('Article scraped successfully with dynamic code!', 'success');
                
                this.logger.success('Dynamic scraping succeeded', {
                    strategy: response.data.strategy,
                    title: response.data.title
                });
            } else {
                const errorMsg = response?.error || 'Failed to scrape article content';
                this.showStatus(errorMsg, 'error');
                this.logger.error('Dynamic scraping failed', null, { error: errorMsg });
            }
            
        } catch (error) {
            this.logger.error('Error in dynamic scraping', error);
            this.showStatus(`Error scraping article: ${error.message}`, 'error');
        }
    }
    
    // This function runs in the LinkedIn page context
    scrapeArticleFromPage() {
        try {
            // Extract article data from the page
            const title = document.querySelector('h1')?.textContent?.trim() || 
                         document.querySelector('[data-test-id="article-title"]')?.textContent?.trim() ||
                         '';
            
            // Find article content
            let content = '';
            const contentSelectors = [
                '.article-content',
                '[data-test-id="article-content"]',
                '.break-words',
                'article .break-words'
            ];
            
            for (const selector of contentSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    content = element.innerText.trim();
                    break;
                }
            }
            
            // Extract author
            const author = document.querySelector('[data-test-id="article-author"]')?.textContent?.trim() ||
                          document.querySelector('.feed-shared-actor__name')?.textContent?.trim() ||
                          '';
            
            // Extract date
            const dateElement = document.querySelector('time') || 
                               document.querySelector('[datetime]');
            const publishDate = dateElement?.getAttribute('datetime') || 
                               dateElement?.textContent?.trim() || '';
            
            // Extract hashtags
            const hashtagElements = document.querySelectorAll('a[href*="/hashtag/"]');
            const tags = Array.from(hashtagElements).map(el => 
                el.textContent.trim().replace('#', '')
            );
            
            const articleData = {
                title,
                content,
                author,
                publishDate,
                tags,
                url: window.location.href,
                scrapedAt: new Date().toISOString(),
                slug: title.toLowerCase()
                    .replace(/[^a-z0-9\\s-]/g, '')
                    .replace(/\\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim('-')
            };
            
            return articleData;
        } catch (error) {
            console.error('Error scraping article:', error);
            return null;
        }
    }
    
    async saveScrapedArticle(articleData) {
        try {
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
            
        } catch (error) {
            console.error('Error saving scraped article:', error);
            throw error;
        }
    }
    
    async scrapeAllArticles() {
        try {
            this.showStatus('Starting batch scraping...', 'info');
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: this.scrapeAllArticlesFromPage
            });
            
            if (result.result && result.result.length > 0) {
                for (const article of result.result) {
                    await this.saveScrapedArticle(article);
                }
                
                await this.loadScrapedCount();
                this.showStatus(`Scraped ${result.result.length} articles!`, 'success');
            } else {
                this.showStatus('No articles found to scrape', 'error');
            }
            
        } catch (error) {
            this.showStatus(`Error batch scraping: ${error.message}`, 'error');
        }
    }
    
    // This function runs in the LinkedIn profile page context
    scrapeAllArticlesFromPage() {
        try {
            const articleLinks = Array.from(
                document.querySelectorAll('a[href*="/pulse/"]')
            );
            
            const articles = articleLinks.map(link => {
                const title = link.textContent.trim();
                const url = link.href;
                const id = url.split('/pulse/')[1]?.split('/')[0];
                
                // Try to find publication date
                let publishDate = '';
                const parentElement = link.closest('article, .feed-shared-update-v2');
                if (parentElement) {
                    const dateElement = parentElement.querySelector('time, [datetime]');
                    if (dateElement) {
                        publishDate = dateElement.getAttribute('datetime') || 
                                     dateElement.textContent.trim();
                    }
                }
                
                return {
                    title,
                    url,
                    id,
                    publishDate,
                    scrapedAt: new Date().toISOString(),
                    slug: title.toLowerCase()
                        .replace(/[^a-z0-9\\s-]/g, '')
                        .replace(/\\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-'),
                    content: '', // Will need to visit each article to get content
                    author: 'Antti Tevanlinna',
                    tags: []
                };
            }).filter(article => article.title && article.url && article.id);
            
            return articles;
        } catch (error) {
            console.error('Error scraping article list:', error);
            return [];
        }
    }
    
    async syncToBosserProject() {
        try {
            this.showStatus('Syncing to Bosser project...', 'info');
            
            const result = await chrome.storage.local.get(['scrapedArticles']);
            const scrapedArticles = result.scrapedArticles || [];
            
            if (scrapedArticles.length === 0) {
                this.showStatus('No scraped articles to sync', 'error');
                return;
            }
            
            // For now, we'll download the data as JSON
            // In a real implementation, this would communicate with the local filesystem
            const dataBlob = new Blob([JSON.stringify(scrapedArticles, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(dataBlob);
            await chrome.downloads.download({
                url: url,
                filename: `bosser-scraped-articles-${new Date().toISOString().split('T')[0]}.json`,
                saveAs: true
            });
            
            this.showStatus(`Exported ${scrapedArticles.length} articles for sync`, 'success');
            
        } catch (error) {
            this.showStatus(`Error syncing: ${error.message}`, 'error');
        }
    }
    
    async downloadScrapedData() {
        try {
            const result = await chrome.storage.local.get(['scrapedArticles']);
            const scrapedArticles = result.scrapedArticles || [];
            
            if (scrapedArticles.length === 0) {
                this.showStatus('No scraped data to download', 'error');
                return;
            }
            
            const dataBlob = new Blob([JSON.stringify(scrapedArticles, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(dataBlob);
            await chrome.downloads.download({
                url: url,
                filename: `bosser-linkedin-data-${Date.now()}.json`,
                saveAs: true
            });
            
            this.showStatus(`Downloaded ${scrapedArticles.length} articles`, 'success');
            
        } catch (error) {
            this.showStatus(`Error downloading: ${error.message}`, 'error');
        }
    }
    
    showStatus(message, type = 'info') {
        const container = document.getElementById('statusContainer');
        const status = document.createElement('div');
        status.className = `status ${type}`;
        status.textContent = message;
        
        container.appendChild(status);
        
        // Remove status after 3 seconds
        setTimeout(() => {
            if (status.parentNode) {
                status.parentNode.removeChild(status);
            }
        }, 3000);
        
        // Log status messages
        this.logger.info(`Status: ${message}`, { type });
    }
    
    async sendLogsToClaudeCode() {
        try {
            this.logger.info('Sending logs to Claude Code chat');
            
            if (this.logger && this.logger.sendToClaudeChat) {
                await this.logger.sendToClaudeChat('🚨 BOSSER EXTENSION ACTIVITY REPORT');
                this.showStatus('Logs copied to clipboard - paste in Claude Code!', 'success');
            } else {
                // Fallback: create summary manually
                const summary = `
BOSSER EXTENSION STATUS REPORT
Time: ${new Date().toISOString()}
Page Type: ${this.currentPageType}
Scraped Articles: ${this.scrapedCount}
Draft Loaded: ${this.loadedDraft ? this.loadedDraft.title : 'None'}
URL: ${window.location?.href || 'popup'}

Check browser console for detailed logs.
                `;
                
                await navigator.clipboard.writeText(summary);
                this.showStatus('Status report copied to clipboard!', 'success');
            }
            
        } catch (error) {
            this.logger.error('Failed to send logs to Claude Code', error);
            this.showStatus('Failed to send logs. Check console.', 'error');
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BosserLinkedInPopup();
});