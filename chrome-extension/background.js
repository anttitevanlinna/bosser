// Bosser LinkedIn Assistant - Background Script (Service Worker)
// Handles extension lifecycle and communication between components

class BosserLinkedInBackground {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Bosser LinkedIn Assistant background script loaded');
        
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });
        
        // Handle messages from popup and content scripts
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });
        
        // Handle browser action (extension icon click)
        chrome.action.onClicked.addListener((tab) => {
            this.handleActionClick(tab);
        });
        
        // Set up periodic sync (if needed)
        this.setupPeriodicSync();
    }
    
    handleInstallation(details) {
        if (details.reason === 'install') {
            console.log('Bosser LinkedIn Assistant installed');
            
            // Initialize storage
            chrome.storage.local.set({
                scrapedArticles: [],
                settings: {
                    autoSync: false,
                    bosserProjectPath: '',
                    lastSyncTime: null
                },
                stats: {
                    articlesScraped: 0,
                    articlesPublished: 0,
                    installDate: new Date().toISOString()
                }
            });
            
            // Show welcome notification
            this.showNotification('Welcome to Bosser LinkedIn Assistant!', 
                'Extension installed successfully. Visit LinkedIn to get started.');
            
        } else if (details.reason === 'update') {
            console.log('Bosser LinkedIn Assistant updated');
        }
    }
    
    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'openPopup':
                    // Open popup programmatically (if possible)
                    sendResponse({ success: true });
                    break;
                    
                case 'getStorageData':
                    const data = await chrome.storage.local.get(request.keys || null);
                    sendResponse({ success: true, data });
                    break;
                    
                case 'setStorageData':
                    await chrome.storage.local.set(request.data);
                    sendResponse({ success: true });
                    break;
                    
                case 'clearStorage':
                    await chrome.storage.local.clear();
                    sendResponse({ success: true });
                    break;
                    
                case 'exportData':
                    const exportResult = await this.exportScrapedData();
                    sendResponse({ success: true, data: exportResult });
                    break;
                    
                case 'syncToBosser':
                    const syncResult = await this.syncToBosserProject();
                    sendResponse({ success: true, data: syncResult });
                    break;
                    
                case 'updateStats':
                    await this.updateStats(request.statType, request.increment || 1);
                    sendResponse({ success: true });
                    break;
                    
                case 'showNotification':
                    this.showNotification(request.title, request.message, request.type);
                    sendResponse({ success: true });
                    break;
                    
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
    
    handleActionClick(tab) {
        // This is called when the extension icon is clicked
        // The popup should open automatically, but we can add custom logic here
        console.log('Extension icon clicked on tab:', tab.url);
        
        if (!tab.url.includes('linkedin.com')) {
            // If not on LinkedIn, navigate there
            chrome.tabs.update(tab.id, { 
                url: 'https://www.linkedin.com/in/anttitevanlinna/recent-activity/articles/' 
            });
        }
    }
    
    async exportScrapedData() {
        try {
            const result = await chrome.storage.local.get(['scrapedArticles']);
            const scrapedArticles = result.scrapedArticles || [];
            
            if (scrapedArticles.length === 0) {
                throw new Error('No scraped articles to export');
            }
            
            // Format for Bosser project structure
            const bosserFormat = {
                exportDate: new Date().toISOString(),
                totalArticles: scrapedArticles.length,
                articles: scrapedArticles.map(article => ({
                    title: article.title,
                    slug: article.slug,
                    content: article.content,
                    author: article.author,
                    publishDate: article.publishDate,
                    tags: article.tags || [],
                    linkedinUrl: article.url,
                    scrapedAt: article.scrapedAt,
                    source: 'linkedin_scraped',
                    status: 'scraped'
                }))
            };
            
            // Create download
            const dataBlob = new Blob([JSON.stringify(bosserFormat, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(dataBlob);
            const filename = `bosser-linkedin-export-${new Date().toISOString().split('T')[0]}.json`;
            
            await chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
            });
            
            return {
                exported: scrapedArticles.length,
                filename: filename
            };
            
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    }
    
    async syncToBosserProject() {
        try {
            const result = await chrome.storage.local.get(['scrapedArticles', 'settings']);
            const scrapedArticles = result.scrapedArticles || [];
            const settings = result.settings || {};
            
            if (scrapedArticles.length === 0) {
                throw new Error('No scraped articles to sync');
            }
            
            // For now, we'll create files that can be manually copied to the Bosser project
            // In a full implementation, this would use Native File System API or native messaging
            
            const syncData = {
                syncDate: new Date().toISOString(),
                totalArticles: scrapedArticles.length,
                bosserFormat: scrapedArticles.map(article => this.convertToBosserFormat(article))
            };
            
            // Create individual article files
            for (const article of scrapedArticles) {
                const articleData = this.convertToBosserFormat(article);
                const filename = `${article.slug}.json`;
                
                const blob = new Blob([JSON.stringify(articleData, null, 2)], {
                    type: 'application/json'
                });
                
                const url = URL.createObjectURL(blob);
                await chrome.downloads.download({
                    url: url,
                    filename: `bosser-sync/${filename}`,
                    saveAs: false
                });
            }
            
            // Update sync time
            await chrome.storage.local.set({
                settings: {
                    ...settings,
                    lastSyncTime: new Date().toISOString()
                }
            });
            
            return {
                synced: scrapedArticles.length,
                syncTime: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Error syncing to Bosser:', error);
            throw error;
        }
    }
    
    convertToBosserFormat(article) {
        return {
            title: article.title,
            slug: article.slug,
            content: article.content,
            content_markdown: article.content, // Convert HTML to markdown if needed
            author: article.author || 'Antti Tevanlinna',
            publish_date: article.publishDate || article.scrapedAt,
            tags: article.tags || [],
            linkedin_url: article.url,
            source: 'linkedin_scraped',
            status: 'scraped',
            processed_at: article.scrapedAt,
            content_length: article.content ? article.content.length : 0,
            estimated_reading_time: this.calculateReadingTime(article.content)
        };
    }
    
    calculateReadingTime(content) {
        if (!content) return '1 min';
        const wordsPerMinute = 250;
        const words = content.split(/\s+/).length;
        const minutes = Math.max(1, Math.round(words / wordsPerMinute));
        return `${minutes} min`;
    }
    
    async updateStats(statType, increment = 1) {
        try {
            const result = await chrome.storage.local.get(['stats']);
            const stats = result.stats || {};
            
            stats[statType] = (stats[statType] || 0) + increment;
            stats.lastUpdated = new Date().toISOString();
            
            await chrome.storage.local.set({ stats });
            
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }
    
    setupPeriodicSync() {
        // Set up periodic background sync if needed
        // For now, we'll just log that sync is available
        console.log('Periodic sync available for Bosser LinkedIn Assistant');
    }
    
    showNotification(title, message, type = 'basic') {
        if (chrome.notifications) {
            chrome.notifications.create({
                type: 'basic',
                title: title,
                message: message
            });
        } else {
            console.log(`Notification: ${title} - ${message}`);
        }
    }
}

// Initialize background script
new BosserLinkedInBackground();